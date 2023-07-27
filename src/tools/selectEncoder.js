const { getGPUTier } = require('detect-gpu');
const log = require('./printWithColors');

async function selectEncoder() {

  const gpuTier = await getGPUTier();
  const HIGH_PERFORMANCE_TIER = 3;
  
  if (gpuTier.tier === HIGH_PERFORMANCE_TIER) {
    // The GPU is classified as high-performance, so we can use a hardware-accelerated encoder.
    if (gpuTier.gpu.toLowerCase().includes('nvidia')) {
      // The GPU is an NVIDIA GPU
      return 'h264_nvenc';
    } else if (gpuTier.gpu.toLowerCase().includes('amd')) {
      // The GPU is an AMD GPU
      return 'h264_amf';
    } else {
      // The GPU is not an NVIDIA or AMD GPU, so we cannot use hardware-accelerated encoding.
      return 'libx264';
    }
  } else {
    // The GPU is not high-performance, so we should use the macOS encoder.
    return 'h264_videotoolbox';
  }
}
module.exports = selectEncoder;
