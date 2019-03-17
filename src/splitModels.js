/** Split models to separate and organize state, reducers, subscriptions and effects
 * @param {array} models
 * TODO: handle subscriptions!
 */
module.exports = function splitModels(models) {
  let globalDefaultState = {};
  let globalReducers = {};
  let globalSubscriptions = {};
  let globalEffects = {};
  models.forEach(model => {
    const { namespace, state, reducers, subscriptions, effects } = model;
    // We organize the global state
    globalDefaultState[namespace] = state;
    // We extract, rename with the namespace and organize the reducers
    Object.keys(reducers).forEach(r => {
      globalReducers = {
        ...globalReducers,
        [`${namespace}/${r}`]: reducers[r]
      };
    });
    // We extract, rename with the namespace and organize the effects
    Object.keys(effects).forEach(e => {
      globalEffects = {
        ...globalEffects,
        [`${namespace}/${e}`]: effects[e]
      };
    });
  });
  return {
    globalDefaultState,
    globalReducers,
    globalSubscriptions,
    globalEffects
  };
};
