const { ffmpeg } = require("../tools");
const log = require("../tools/printWithColors");
const selectEncoder = require("../tools/selectEncoder");

// Define constants for platform names and aspect ratios
const TEMPLATE = {
  TIKTOK: {
    name: "tiktok",
    aspectRatio: [9, 16],
  },
  YOUTUBE_SHORTS: {
    name: "youtube_shorts",
    aspectRatio: [9, 16],
  },
};

/**
 * Convert video to a specific size for a given platform
 * @param {keyof typeof TEMPLATE} template - Platform to optimize the video for
 * @param {{
 * inputPath: string,
 * outputPath: string
 * inputFile: string
 * encoder: string
 *
 * }}  - Path to the input video file
 */
async function convertSize(
  template = "TIKTOK",
  { inputPath, outputPath, inputFile, encoder }
) {
  const { aspectRatio } = TEMPLATE[template];

  log(`Edit template for ${template}`, inputFile);

  const probeResult = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const inputAspectRatio = probeResult.streams[0].display_aspect_ratio
    .split(":")
    .map(Number);
  const inputWidth = probeResult.streams[0].width;
  const inputHeight = probeResult.streams[0].height;
  const outputWidth = inputWidth;
  const outputHeight = Math.floor(
    (outputWidth * inputAspectRatio[1]) / inputAspectRatio[0]
  );

  const cropHeight = Math.min(outputHeight, inputHeight);

  const cropWidth = Math.floor((cropHeight * aspectRatio[0]) / aspectRatio[1]);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .size(`${outputWidth}x${outputHeight}`)
      .videoFilter([
        `crop=${cropWidth}:${cropHeight}`,
        `scale=${outputWidth}:-1`,
      ])
      .outputOptions("-c:v", encoder)
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        resolve();
      })
      .run();
  });
}

// Export the constants and function
module.exports = {
  TEMPLATE,
  convertSize,
};
