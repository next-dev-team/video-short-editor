const setup = require("./setup/index");
const log = require("./tools/printWithColors");
const editor = require("./editing/index");
const process = require('process');

(async () => {
    const resolution = process.argv[2];
    // -crf 23 -preset medium -c:a aac -b:a 320k -ac 2 -ar 44100
    // log(`URL ${url}`, 'yellow')
    log(`Starting setup...`, "yellow");
    const dname = await setup(__dirname);
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    await editor({
        resolution,
        dname,
        audio: 1,
        filter: randomNumber,
        gpu:'h264_nvenc -preset fast -cq 23 -c:a aac -b:a 192k '
    });

})()