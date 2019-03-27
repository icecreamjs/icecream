import invariant from "invariant";

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
  for (const key in object) {
    invariant(
      type.includes(object[key].constructor.name),
      `"${key}" in model "${modelname}" is not a ${type[0]}.`
    );
  }
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
    /^[A-Za-z]+$/.test(model.modelname),
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
  checkTypeElementsInModel.bind(
    null,
    ["GeneratorFunction", "AsyncGeneratorFunction"],
    model.modelname,
    model.effects
  )();
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
