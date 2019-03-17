/** Split models to separate and organize state, reducers, subscriptions and effects
 * @param {array} models
 * TODO: handle subscriptions!
 */
function splitModels(models) {
  let defaultState = {};
  let reduxReducers = {};
  let reduxSubscriptions = {};
  let sagaEffects = {};
  models.forEach(model => {
    const { namespace, state, reducers, subscriptions, effects } = model;
    // We organize the global state
    defaultState[namespace] = state;
    // We extract, rename with the namespace and organize the reducers
    Object.keys(reducers).forEach(r => {
      reduxReducers = {
        ...reduxReducers,
        [`${namespace}/${r}`]: reducers[r]
      };
    });
    // We extract, rename with the namespace and organize the effects
    Object.keys(effects).forEach(e => {
      sagaEffects = {
        ...sagaEffects,
        [`${namespace}/${e}`]: effects[e]
      };
    });
  });
  return [defaultState, reduxReducers, reduxSubscriptions, sagaEffects];
}

export default splitModels;
