const modifyFram = async (frame, f, resolution) => {

    const getResolution = {
        '480': [480, 720],   // Standard 480p resolution
        '720': [720, 1280],  // Standard 720p resolution
        '1080': [1080, 1920] // Standard 1080p resolution
    }[resolution?.toString() ?? '1080'];

    frame.resize(...getResolution);
    frame.composite(f, 0, 0);
    return frame;
}

module.exports = modifyFram