import invariant from "invariant";
import { effectsName } from "./customEffects";

const modelStructure = {
  modelname: "",
  state: {},
  reducers: {},
  effects: {},
  listeners: {}
};

/**
 * Check Type of element in object
 * @param {array} type
 * @param {string} modelname
 * @param {object} object
 */
function checkTypeElementsInModel(type, modelname, object) {
  Object.keys(object).forEach(key => {
    const typeName = object[key].constructor.displayName || object[key].constructor.name;
    invariant(type.includes(typeName), `"${key}" in model "${modelname}" is not a ${type[0]}.`);
  });
}

const structureString =
  'The model must have this structure: {modelname: "", state: {}, reducers: {}, effects: {}, listeners: {}}';

/** Check the structure of model
 * @param {object} model
 * @return {boolean}
 */
function checkModel(model) {
  /********** Structure ***********/
  invariant(
    Object.keys(model).length > 0,
    `Model don\'t have any key. ${structureString}`
  );
  // Check if the keys of the model are valid
  let missingKey = null;
  const modelKeys = Object.keys(model);
  const goodKeys = Object.keys(modelStructure);
  for (let i = 0; i < goodKeys.length; i++) {
    if (!modelKeys.includes(goodKeys[i])) {
      missingKey = goodKeys[i];
      break;
    }
  }
  invariant(
    missingKey === null,
    `Model missing the key "${missingKey}". ${structureString}`
  );

  /********** modelname ***********/
  // Check if modelname is a string
  invariant(
    typeof model.modelname === "string",
    "modelname of model must be of string type."
  );
  // Check if modelname is not just white space or empty and regular word
  invariant(
    /^[A-Za-z_]+$/.test(model.modelname),
    "modelname should be a regular word, no special character, not white space and not empty"
  );

  /********** Type ***********/
  // Check if element of reducers are only functions
  checkTypeElementsInModel.bind(
    null,
    ["Function"],
    model.modelname,
    model.reducers
  )();
  // Check if element of effects are only generators
  Object.keys(model.effects).forEach(e => {
      if(typeof model.effects[e] !== 'function' && effectsName.includes(e)) {
        checkTypeElementsInModel.bind(
          null,
          ["GeneratorFunction", "AsyncGeneratorFunction"],
          model.modelname,
          model.effects[e]
        )();
      } else if(typeof model.effects[e] !== 'function' && !effectsName.includes(e)) {
        invariant(false, `"${e}" in model "${model.modelname}" is not recognized as a valid value.`);
      } else {
        const typeName = model.effects[e].constructor.displayName || model.effects[e].constructor.name;
        invariant(["GeneratorFunction", "AsyncGeneratorFunction"].includes(typeName), `"${e}" in model "${model.modelname}" is not a GeneratorFunction.`);
      }
  });

  // Check if element of listeners are only functions
  checkTypeElementsInModel.bind(
    null,
    ["Function"],
    model.modelname,
    model.listeners
  )();

  return true;
}

export default checkModel;
