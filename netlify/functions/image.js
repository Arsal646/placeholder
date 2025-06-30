const sharp = require("sharp");

exports.handler = async (event) => {
  try {
    const path = event.path || "";

    // Match /300x250.png or /300x250.svg etc. (after redirect removes /api/image)
    const sizeMatch = path.match(/^\/(\d+)x(\d+)\.(png|jpg|jpeg|webp|svg)$/);

    if (!sizeMatch) {
      return {
        statusCode: 200,
        body: "Welcome to Image Placeholder API!\n\nUsage examples:\n/api/image/300x250.png\n/api/image/400x300.jpg?bg=ff0000&color=ffffff&text=Hello World\n\nParameters:\n- bg: background color (hex without #)\n- color: text color (hex without #)\n- text: custom text (default: dimensions)",
        headers: { 
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
      };
    }

    const width = parseInt(sizeMatch[1], 10);
    const height = parseInt(sizeMatch[2], 10);
    const format = sizeMatch[3].toLowerCase();

    // Validate dimensions
    if (width > 2000 || height > 2000 || width < 1 || height < 1) {
      return {
        statusCode: 400,
        body: "Invalid dimensions. Width and height must be between 1 and 2000 pixels.",
        headers: { "Content-Type": "text/plain" },
      };
    }

    const { bg = "cccccc", color = "555555", text } = event.queryStringParameters || {};
    
    // Clean hex colors (remove # if present)
    const backgroundColor = bg.replace("#", "");
    const textColor = color.replace("#", "");
    
    // Validate hex colors
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(backgroundColor) || 
        !/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(textColor)) {
      return {
        statusCode: 400,
        body: "Invalid color format. Use 3 or 6 digit hex colors without #",
        headers: { "Content-Type": "text/plain" },
      };
    }

    const displayText = text ? decodeURIComponent(text) : `${width}×${height}`;
    const fontSize = Math.max(12, Math.min(width, height) / 8);

    // Create SVG
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${backgroundColor}"/>
        <text x="50%" y="50%" fill="#${textColor}" font-family="Arial, sans-serif"
              font-size="${fontSize}" dominant-baseline="middle" text-anchor="middle"
              font-weight="400">${displayText}</text>
      </svg>`.trim();

    // Return SVG directly for SVG format
    if (format === "svg") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        },
        body: svg,
      };
    }

    // Convert to other formats using Sharp
    let sharpInstance = sharp(Buffer.from(svg));
    
    // Handle different formats
    switch (format) {
      case "png":
        sharpInstance = sharpInstance.png({ quality: 90 });
        break;
      case "jpg":
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({ quality: 90 });
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality: 90 });
        break;
      default:
        return {
          statusCode: 400,
          body: "Unsupported format. Use: png, jpg, jpeg, webp, or svg",
          headers: { "Content-Type": "text/plain" },
        };
    }

    const imageBuffer = await sharpInstance.toBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": `image/${format === "jpg" ? "jpeg" : format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Content-Length": imageBuffer.length.toString(),
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error("Image generation error:", error);
    return {
      statusCode: 500,
      body: `Error generating image: ${error.message}`,
      headers: { 
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};