const Jimp = require("jimp");

const modifyFrame = async (frame, filterImage, resolution, flipHorizontal) => {
    // Resize the frame to the specified resolution
    const getResolution = {
        '144': [144, 360],   // Standard 480p resolution
        '480': [480, 720],   // Standard 480p resolution
        '720': [720, 1280],  // Standard 720p resolution
        '1080': [1080, 1920] // Standard 1080p resolution
    }[resolution?.toString() ?? '1080'];

    // Resize filter image
    filterImage = filterImage.resize(...getResolution, Jimp.AUTO);

    // Apply filter to frame
    frame.flip(true, false);
    frame.composite(filterImage, 0, 0);
    frame.resize(...getResolution);

    return frame;
};

module.exports = modifyFrame;