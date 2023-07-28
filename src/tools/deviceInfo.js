const { exec } = require("child_process");

const gpuInfo = () => {
  return new Promise((resolve, reject) => {
    exec("system_profiler SPDisplaysDataType", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        // Normalise the result here to get the GPU name
        const info = { graphics: { displays: {} } };

        const lines = stdout.split("\n");
         lines[2] = 'model:\n';
        let currentSection = "";
        
        for (const line of lines) {
          if (line.trim() === "") {
            continue;
          }
        
          if (line.trim().endsWith(":")) {
            currentSection = line.trim().slice(0, -1).replace(/ /g, '_').toLowerCase();
            if (currentSection === "graphics_card") {
              currentSection = "graphics";
            }
            info[currentSection] = {};
          } else if (currentSection !== "") {
            const [key, value] = line.split(":");
            info[currentSection][key.trim().replace(/ /g, '_').toLowerCase()] = value.trim();
          }
        }
        
        resolve({
       ...info,
          originResult: stdout
        });
      }
    });
  });
};

module.exports = { gpuInfo };