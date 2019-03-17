const path = require("path");
const fs = require("fs");

const rootProjectPath = "../";

/**  retrieve all models objects from projects
 * @param {string} modelsFolder
 */
module.exports = function retrieveAllModels(modelsFolder = "models/") {
  return new Promise((resolve, reject) => {
    try {
      const templatePath = path.resolve(rootProjectPath, modelsFolder);
      if (fs.existsSync(templatePath)) {
        const paths = fs.readdirSync(templatePath);
        const models = [];
        paths.forEach(p => {
          console.info(`retrieving ${p} model...`);
          absPath = path.resolve(templatePath, p);
          models.push(require(absPath));
        });
        resolve(models);
      } else {
        throw "No models's folder found!";
      }
    } catch (error) {
      reject(error);
    }
  });
};
