const sharp = require("sharp");
const { builder } = require("@netlify/functions");

exports.handler = builder(async (event) => {
  const pathParts = event.path.split("/");
  const size = pathParts[pathParts.length - 1].replace(/\.\w+$/, "");
  const [width, height] = size.split("x").map(Number);

  const {
    bg = "cccccc",
    color = "000000",
    text = `${width}x${height}`,
    format = "png",
  } = event.queryStringParameters;

  const fontSize = Math.min(width, height) / 5;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bg}"/>
      <text x="50%" y="50%" fill="#${color}"
            font-size="${fontSize}" text-anchor="middle"
            alignment-baseline="central" dominant-baseline="central"
            font-family="sans-serif">${text}</text>
    </svg>`;

  const image = await sharp(Buffer.from(svg))
    .toFormat(format)
    .toBuffer();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": `image/${format}`,
      "Cache-Control": "public, max-age=31536000, immutable"
    },
    body: image.toString("base64"),
    isBase64Encoded: true,
  };
});
