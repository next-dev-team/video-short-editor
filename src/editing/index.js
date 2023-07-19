const fs = require("fs").promises;
const fextra = require("fs-extra");
const util = require("util");
const Jimp = require("jimp");
const checkProgress = require("./progress");
const modifyFrame = require("./modifyFrame");
const exec = util.promisify(require("child_process").exec);
const log = require("../tools/printWithColors");

async function editor({ dname, audio, filter, resolution = 1080 }) {
    try {
        log(`Estimate time 10mn / 1mn video`);
        log(`DECODING START ${resolution}`, "yellow");

        const testVideoPath = `${dname}/../assets/test.mp4`;
        const { stdout: testVideoDuration } = await exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${testVideoPath}`);
        const testVideoSeconds = Math.floor(parseFloat(testVideoDuration.trim()));

        await exec(`ffmpeg -i ${testVideoPath} -vf scale=${resolution}:-1 ${dname}/raws/%d.png`);
        log("DECODING FINISH SUCCESSFULLY [V]", "green");

        log(`RENDERING START`, "yellow");

        const frames = await fs.readdir(`${dname}/raws`);
        let filterImage = await Jimp.read(`${dname}/../assets/filters/${filter}.png`);
        let currentprogress = 0;
        for (i = 1; i < frames.length; i++) {
            checkProgress(i, frames.length, currentprogress);
            let frame = await Jimp.read(`${dname}/raws/${i}.png`);
            frame = await modifyFrame(frame, filterImage, resolution);
            await frame.writeAsync(`${dname}/edited/${i}.png`);
        }
        log("RENDERING FINISH SUCCESSFULLY [V]", "green");

        log("Encoding START #####..", "yellow");
        try {
            await exec(`ffmpeg -framerate 45 -i ${dname}/edited/%d.png -c:v libx264 -r 45 ${dname}/noAUD.mp4`);
        } catch (error) {
            log(`RENDERING ERROR ${error}`, 'yellow');
        }

        try {
            await exec(`ffmpeg -i ${dname}/noAUD.mp4 -i ${dname}/../assets/audios/${audio}.mp3 -c copy -map 0:v -map 1:a -t ${testVideoSeconds} -shortest ${dname}/../final${i}.mp4`);
        } catch (error) {
            log(`RENDERING ERROR1 ${error}`, 'yellow');
        }

        log("ENCODING FINISH SUCCESSFULLY [V]");
        log("CLEANING AND CLOSE.\nTHANK YOU FOR USING ME", "blue");
        await fextra.remove(dname);
    } catch (e) {
        await fextra.remove(dname);
        console.error(`error: ${e}`);
    }
}

module.exports = editor;