import iceCreamPlease from "./src/icecream";
import { organizeModelReducers } from "./src/splitModels";
import { getArrayFromReducersObject } from "./src/createReducer";

/**
 * Takes the key "reducers" of model and give back an array of reducers
 * @param {string} modelname
 * @param {object} reducersFromModel
 * @return {array}
 */
function getArrayFromModelReducers(modelname, reducersFromModel) {
  return getArrayFromReducersObject(
    organizeModelReducers(modelname, reducersFromModel)
  );
}

export { getArrayFromModelReducers };

export default iceCreamPlease;
