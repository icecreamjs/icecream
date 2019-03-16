const path = require("path");
const fs = require("fs");
const util = require("util");

const rootProjectPath = "../";

const modelStructure = {
  namespace: "",
  state: {},
  reducers: {},
  effects: {},
  subscriptions: {}
};

/**  Recover all models objects from projects
 * @param {string} modelsFolder
 * ! Créer Promise!
 */
function recoverAllModels(modelsFolder = "models/") {
  const templatePath = path.resolve(rootProjectPath, modelsFolder);
  try {
    if (fs.existsSync(templatePath)) {
      const paths = fs.readdirSync(templatePath);
      const models = [];
      paths.forEach(p => {
        absPath = path.resolve(templatePath, p);
        models.push(require(absPath));
      });
      return models;
    }
  } catch (error) {
    console.error(error);
  }
}

/** Split models to separate and organize state, reducers, subscriptions and effects
 * @param {array} models
 * TODO A finir!
 */
function splitModels(models) {
  const globalDefaultState = {};
  const globalReducers = {};
  const globalSubscriptions = {};
  const globalEffects = {};
  models.forEach(model => {
    const { namespace, state, reducers, subscriptions, effects } = model;
    // We extract and organize for the global state
    Object.keys(state).forEach(s => {
      globalDefaultState[namespace][s] = state[s];
    });
    // We extract, rename with the namespace and organize the reducers
    Object.keys(reducers).forEach(r => {
      const key = `${namespace}/${r}`;
      globalReducers[key] = reducers[r];
    });
    // We extract, rename with the namespace and organize the effects
    Object.keys(effects).forEach(e => {
      const key = `${namespace}/${e}`;
      globalEffects[key] = effects[e];
    });
  });
  console.log(globalDefaultState);
  console.log(globalReducers);
  console.log(globalEffects);
}

recoverAllModels();
