const sharp = require("sharp");

exports.handler = async (event) => {
  try {
    const path = event.path || "";

    // Match /api/image/300x250.png or /api/image/300x250.svg etc.
    const sizeMatch = path.match(/\/api\/image\/(\d+)x(\d+)\.(png|jpg|webp|svg)$/);

    if (!sizeMatch) {
      return {
        statusCode: 200,
        body: "Welcome to Image Placeholder API!\nUse URL format: /api/image/300x250.png?bg=ccc&color=000&text=Hello",
        headers: { "Content-Type": "text/plain" },
      };
    }

    const width = parseInt(sizeMatch[1], 10);
    const height = parseInt(sizeMatch[2], 10);
    const format = sizeMatch[3].toLowerCase();

    const { bg = "cccccc", color = "555555", text } = event.queryStringParameters || {};
    const displayText = text || `${width}×${height}`;
    const fontSize = Math.min(width, height) / 5;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bg}"/>
        <text x="50%" y="50%" fill="#${color}" font-family="Arial, sans-serif"
          font-size="${fontSize}" dominant-baseline="middle" text-anchor="middle">${displayText}</text>
      </svg>`;

    if (format === "svg") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        body: svg,
      };
    }

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
