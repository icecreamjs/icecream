import invariant from "invariant";

function reduceForRedux(...reducers) {
  return (prevState, action) => {
    invariant(
      typeof action.type !== "undefined",
      'Dispatched action must have a "type" key'
    );

    const model = action.type.split("/")[0];
    if (typeof prevState[model] === "undefined") return prevState;

    return reducers.reduce((state, fn) => {
      const newState = fn(state[model], action);
      const _ic = { lD: action.type };
      return {
        ...prevState,
        [model]: newState,
        _ic
      };
    }, prevState);
  };
}

/** build function reducer for redux
 * @param {string} type
 * @param {function} fn
 * @param initialState
 * @return {function} function
 */
function createReducerFn(type, fn) {
  return (state, action) => {
    if (!action) return state;
    if (type === action.type) {
      return fn(state, action);
    } else {
      return state;
    }
  };
}

/** create global reducer for redux's createStore()
 * @param {object} reducersCollection
 * @return {function} redux reducer
 */
function createReducer(reducersCollection) {
  const arrayReducers = reducersCollection.reduce((acc, r) => {
    const { type, fn } = r;
    acc.push(createReducerFn(type, fn));
    return acc;
  }, []);
  const reduce = reduceForRedux(...arrayReducers);
  return reduce;
}

export default createReducer;
