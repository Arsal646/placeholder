const sharp = require("sharp");

exports.handler = async (event) => {
  try {
    // Extract requested size from path, e.g. /api/image/300x250.png
    const path = event.path || "";
    const sizeMatch = path.match(/\/api\/image\/(\d+)x(\d+)\.(png|jpg|webp|svg)/);
    if (!sizeMatch) {
      return { statusCode: 400, body: "Invalid size format" };
    }
    const width = parseInt(sizeMatch[1], 10);
    const height = parseInt(sizeMatch[2], 10);
    const format = sizeMatch[3];

    // Get query params
    const { bg = "cccccc", color = "555555", text } = event.queryStringParameters || {};
    const displayText = text || `${width}×${height}`;

    // Create simple SVG image
    const fontSize = Math.min(width, height) / 5;
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bg}"/>
        <text x="50%" y="50%" fill="#${color}" font-family="Arial, sans-serif"
          font-size="${fontSize}" dominant-baseline="middle" text-anchor="middle">
          ${displayText}
        </text>
      </svg>`;

    if (format === "svg") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
        body: svg,
      };
    }

    // Convert SVG to requested raster format with sharp
    const imageBuffer = await sharp(Buffer.from(svg))
      .toFormat(format)
      .toBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true,
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: `Error generating image: ${error.message}`,
    };
  }
};
