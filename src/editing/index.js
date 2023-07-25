const fs = require("fs").promises;
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const log = require("../tools/printWithColors");

async function editor({ dname, resolution ="1080", gpu = 'libx264' }) {
  try {
    log(`DECODING START ${resolution}`, "yellow");
    const inputDir = path.join(dname, 'input');
    const outputDir = path.join(dname, 'output');
    const noAudioDir = path.join(dname, 'no-audio');
    const audiosDir = path.join(dname, '..', 'assets', 'audios');
    const filtersDir = path.join(dname, '..', 'assets', 'filters');

    // Check that input and output directories exist
    await fs.access(inputDir, fs.constants.R_OK);
    await fs.access(outputDir, fs.constants.W_OK);

    log(`Estimate time 10mn / 1mn video`);
    log(`DECODING START ${dname}`, "yellow");

    const inputFiles = await fs.readdir(inputDir);
    log(`counting ${inputFiles.length}`);
    for (let i = 0; i < inputFiles.length; i++) {
      const inputFile = inputFiles[i];
      const ext = path.extname(inputFile).toLowerCase();

      if (ext !== '.mp4') {
        // skip non-MP4 files
        continue;
      }

      const inputPath = path.join(inputDir, inputFile);
      const outputPath = path.join(outputDir, inputFile);
      const audioFile = path.join(audiosDir, `${i}.mp3`);
      const overlayPath = path.join(filtersDir, `${i}.png`);
      const noAudioPath = path.join(noAudioDir, inputFile);

      try {
       log(`Apply filter to the input video ${inputFiles.length}`);
        await exec(`ffmpeg -i ${inputPath} -i ${overlayPath}  -filter_complex "[0:v]scale=${resolution}:-1,overlay=W-w-10:H-h-10" -c:a copy ${noAudioPath} `);

        // Add audio to the video
        await exec(`ffmpeg -i ${noAudioPath} -i ${audioFile} -c:v ${gpu} -map 0:v:0 -map 1:a:0 -shortest ${outputPath}`);


        log(`Processing complete for ${inputFile}`, 'green');
      } catch (error) {
        log(`Error processing ${inputFile}: ${error}`, 'red');
      }
    }

    log(`DECODING COMPLETE ${dname}`, "green");
  } catch (error) {
    log(`Error: ${error}`, 'red');
  }
}

module.exports = editor;