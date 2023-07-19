const setup = require("./setup/index");
const log = require("./tools/printWithColors");
const editor = require("./editing/index");
const process = require('process');

(async () => {
    const resolution = process.argv[2];
    // log(`URL ${url}`, 'yellow')
    log(`Starting setup...`, "yellow");
    const dname = await setup(__dirname);
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    await editor({
        dname,
        audio: 1,
        filter: randomNumber,
        resolution
    });

})()