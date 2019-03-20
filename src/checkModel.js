import invariant from "invariant";

const modelStructure = {
  namespace: "",
  state: {},
  reducers: {},
  effects: {},
  subscriptions: {}
};

function checkTypeElementsInModel(type, namespace, object) {
  for (const key in object) {
    invariant(
      object[key].constructor.name === type,
      `"${key}" in model "${namespace}" is not a ${type}.`
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
  // Check if namespace is a string
  invariant(
    typeof model.namespace === "string",
    "namespace of model must be of string type."
  );
  // Check if element of reducers are only functions
  checkTypeElementsInModel.bind(
    null,
    "Function",
    model.namespace,
    model.reducers
  )();
  // Check if element of effects are only generators
  checkTypeElementsInModel.bind(
    null,
    "GeneratorFunction",
    model.namespace,
    model.effects
  )();
  // Check if element of subscriptions are only functions
  checkTypeElementsInModel.bind(
    null,
    "Function",
    model.namespace,
    model.subscriptions
  )();
}

export default checkModel;
