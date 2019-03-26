import iceCreamPlease from "./src/icecream";
import { organizeModelReducers } from "./src/splitModels";
import { getArrayFromReducersObject } from "./src/createReducer";

/**
 * Takes the key "reducers" of model and give back an array of reducers
 * @param {object} reducersFromModel
 * @return {array}
 */
function getArrayFromModelReducers(namespace, reducersFromModel) {
  return getArrayFromReducersObject(
    organizeModelReducers(namespace, reducersFromModel)
  );
}

export { getArrayFromModelReducers };

export default iceCreamPlease;
