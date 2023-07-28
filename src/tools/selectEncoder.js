const log = require("./printWithColors");

const { gpuInfo } = require("./deviceInfo");

async function selectEncoder() {
  try {
    const gpuTier = await gpuInfo();
    const model = gpuTier.model?.chipset_model;
    log("Detecting computer model", model);

    const modelMap = {
      "Apple M1": "h264_videotoolbox",
    };

    // let encoder;

    // if (gpuTier.tier === HIGH_PERFORMANCE_TIER) {
    //   // The GPU is classified as high-performance, so we can use a hardware-accelerated encoder.
    //   if (gpuTier.gpu.toLowerCase().includes("nvidia")) {
    //     // The GPU is an NVIDIA GPU
    //     encoder = "h264_nvenc";
    //   } else if (gpuTier.gpu.toLowerCase().includes("amd")) {
    //     // The GPU is an AMD GPU
    //     encoder = "h264_amf";
    //   } else {
    //     // The GPU is not an NVIDIA or AMD GPU, so we cannot use hardware-accelerated encoding.
    //     encoder = "libx264";
    //   }
    // } else {
    //   // The GPU is not high-performance, so we should use the macOS encoder.
    //   encoder = "h264_videotoolbox";
    // }
    // log("Detecting encoder", modelMap[model]);
    return modelMap[model] ?? "libx264";
  } catch (error) {
    log("Detecting computer error", error);
  }
}
module.exports = selectEncoder;
