const fs = require("fs");
const path = require("path");

async function setup(dname) {
    const tmpFolder = path.resolve(dname, "../tmp");
    const inputFolder = path.resolve(tmpFolder, "input");
    const outputFolder = path.resolve(tmpFolder, "output");
    const noAudioFolder = path.resolve(tmpFolder, "no-audio");

    if (!fs.existsSync(tmpFolder)) {
        fs.mkdirSync(tmpFolder);
    }
    if (!fs.existsSync(inputFolder)) {
        fs.mkdirSync(inputFolder);
    }
    if (!fs.existsSync(noAudioFolder)) {
        fs.mkdirSync(noAudioFolder);
    }
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }


    return tmpFolder;
}

module.exports = setup