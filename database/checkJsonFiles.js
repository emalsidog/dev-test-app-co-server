const fs = require("fs");

const checkJSONFiles = (files) => {
  for (let file in files) {
    const exists = fs.existsSync(files[file]);
    if (!exists) {
      throw Error("Files does not exists (Check 'json' folder.");
    }
  }
};

module.exports = checkJSONFiles;
