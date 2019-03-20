import { combineReducers } from "redux";

// Action to remember the last dispatch for subscription.
function lastDispatch(state = null, { type }) {
  return type;
}

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
  const reducerCollection = modelReducers.reduce((acc, o) => {
    const { type, name, initialState, fn } = o;
    acc[name] = createReducerFn(type, fn, initialState);
    return acc;
  }, {});
  return combineReducers(reducerCollection);
}

/** create global reducer for redux's createStore()
 * @param {object} reducersCollection
 * @return {function} redux reducer
 */
function createReducer(reducersCollection) {
  const globalObjectReducer = Object.keys(reducersCollection).reduce(
    (acc, model) => {
      acc[model] = createModelReducer(reducersCollection[model]);
      return acc;
    },
    {}
  );
  return combineReducers({ ...globalObjectReducer, lastDispatch });
}

export default createReducer;
