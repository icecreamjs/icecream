import invariant from "invariant";

const modelStructure = {
  namespace: "",
  state: {},
  reducers: {},
  effects: {},
  subscriptions: {}
};

/**
 * Check Type of element in object
 * @param {array} type
 * @param {string} namespace
 * @param {object} object
 */
function checkTypeElementsInModel(type, namespace, object) {
  for (const key in object) {
    invariant(
      type.includes(object[key].constructor.name),
      `"${key}" in model "${namespace}" is not a ${type[0]}.`
    );
  }
}

const structureString =
  'The model must have this structure: {namespace: "", state: {}, reducers: {}, effects: {}, subscriptions: {}}';

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

  /********** Namespace ***********/
  // Check if namespace is a string
  invariant(
    typeof model.namespace === "string",
    "Namespace of model must be of string type."
  );
  // Check if namespace is not just white space or empty and regular word
  invariant(
    /^[A-Za-z]+$/.test(model.namespace),
    "Namespace should be a regular word, no special character, not white space and not empty"
  );

  /********** State && Reducers ***********/
  // Check if reducers match the states
  const stateKeys = Object.keys(model.state);
  const reducerKeys = Object.keys(model.reducers);
  let reducerMissing = null;
  reducerKeys.forEach(reducer => {
    if (!stateKeys.includes(reducer)) reducerMissing = reducer;
  });
  invariant(
    reducerMissing === null,
    `The reducer "${reducerMissing}" for the "${
      model.namespace
    }" model do not correspond to any initial state. Reducers have to correspond with state.`
  );

  /********** Type ***********/
  // Check if element of reducers are only functions
  checkTypeElementsInModel.bind(
    null,
    ["Function"],
    model.namespace,
    model.reducers
  )();
  // Check if element of effects are only generators
  checkTypeElementsInModel.bind(
    null,
    ["GeneratorFunction", "AsyncGeneratorFunction"],
    model.namespace,
    model.effects
  )();
  // Check if element of subscriptions are only functions
  checkTypeElementsInModel.bind(
    null,
    ["Function"],
    model.namespace,
    model.subscriptions
  )();

  return true;
}

export default checkModel;
