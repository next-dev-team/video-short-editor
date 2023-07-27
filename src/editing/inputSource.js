const fs = require("fs").promises;
const path = require("path");
const util = require("util");
// const exec = util.promisify(require("child_process").exec);
const log = require("../tools/printWithColors");

async function inputSource({ dname }) {
  try {
    const inputDir = path.join(dname, 'input');
    const outputDir = path.join(dname, 'output');
    const noAudioDir = path.join(dname, 'no-audio');
    const audiosDir = path.join(dname, '..', 'assets', 'audios');
    const filtersDir = path.join(dname, '..', 'assets', 'filters');

    // Check that input and output directories exist
    await fs.access(inputDir, fs.constants.R_OK);
    await fs.access(outputDir, fs.constants.W_OK);

    const inputFiles = await fs.readdir(inputDir);

    log(`counting source`, inputFiles.length);

    let sourceInput = [];
    for (let i = 0; i < inputFiles.length; i++) {
      const inputFile = inputFiles[i];
      const ext = path.extname(inputFile).toLowerCase();

      const inputPath = path.join(inputDir, inputFile);
      const outputPath = path.join(outputDir, inputFile);
      const audioFile = path.join(audiosDir, `${i}.mp3`);
      const overlayPath = path.join(filtersDir, `${i}.png`);
      const noAudioPath = path.join(noAudioDir, inputFile);

      sourceInput.push({
        inputFiles,
        ext,
        noAudioPath,
        inputPath,
        inputDir,
        outputDir,
        outputPath,
        audioFile,
        overlayPath,
        inputFile
      })
    }

    return sourceInput;

  } catch (error) {
    log(`Error`, error, 'red');
  }
}

module.exports = { inputSource };