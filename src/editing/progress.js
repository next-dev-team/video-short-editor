const log = require("../tools/printWithColors");


const checkProgress = (currentFrame, totalFrames, currentprogress) => {

    const progress = currentFrame / totalFrames * 100;
    if (progress > (currentprogress + 10)) {
        const displayProgress = Math.floor(progress);
        log("progress [" + displayProgress + "%]", displayProgress > 60 ? 'green' : "yellow");
        currentprogress = displayProgress;
    }
}

module.exports = checkProgress