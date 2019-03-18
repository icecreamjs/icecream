import { combineReducers } from "redux";

/** build function reducer for redux
 * @param {string} type
 * @param {function} fn
 * @param initialState
 * @return {function} function
 */
function createReducerFn(type, fn, initialState) {
  return (state = initialState, action) => {
    switch (action.type) {
      case type:
        return fn(state, action);
      default:
        return state;
    }
  };
}

/** Combine all the reducer's functions of a model
 * @param {array} modelReducers [{type, name, initialState, fn}, {...}]
 * @return {function} combine reducer function
 */
function createModelReducer(modelReducers) {
  let reducerCollection = {};
  modelReducers.forEach(o => {
    const { type, name, initialState, fn } = o;
    reducerCollection[name] = createReducerFn(type, fn, initialState);
  });
  return combineReducers(reducerCollection);
}

/** create global reducer for redux's createStore()
 * @param {object} reducersCollection
 * @return {function} redux reducer
 */
function createReducer(reducersCollection) {
  const globalObjectReducer = {};
  for (const model in reducersCollection) {
    globalObjectReducer[model] = createModelReducer(reducersCollection[model]);
  }
  return combineReducers(globalObjectReducer);
}

export default createReducer;
