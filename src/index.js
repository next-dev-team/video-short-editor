const setup = require("./setup");
const log = require("./tools/printWithColors");
const { convertSize } = require("./editing/convertSize");
const { inputSource } = require("./editing/inputSource");
const selectEncoder = require("./tools/selectEncoder");

async function convertVideos(sources = [], { encoder }) {
  const convertAll = () =>
    sources.map(async (video) => {
      const convert = await convertSize("TIKTOK", { ...video, encoder });
      return convert;
    });

  await Promise.allSettled(convertAll()).catch(log);
}

(async () => {
  // const resolution = process.argv[2];
  log(`Starting setup...`, "", "yellow");
  const dname = await setup(__dirname);
  const encoder = await selectEncoder();

  log(`Starting Editing...`, "yellow");
  try {
    const sources = await inputSource({ dname });
    // log(`source`, sources)
    if (Array.isArray(sources)) {
      await convertVideos(sources, { encoder });
    }
  } catch (error) {
    log(`get source`, error, "red");
  }
})();
