import invariant from "invariant";
import checkModel from "./checkModel";
import { effectsName } from "./customEffects";

/** Split models to separate and organize state, reducers, subscriptions and effects
 * @param {array} models
 */
function splitModels(models) {
  let defaultState = {};
  let reduxReducers = {};
  let reduxSubscriptions = {};
  let sagaEffects = [];

  models.forEach(model => {
    checkModel(model);
    const { namespace, state, reducers, subscriptions, effects } = model;
    // We organize the global initialState
    defaultState[namespace] = state;
    // We extract, rename with the namespace and organize the reducers
    reduxReducers[namespace] = Object.keys(reducers).reduce(
      (acc, reducerName) => {
        acc.push({
          type: `${namespace}/${reducerName}`,
          name: reducerName,
          initialState: state[reducerName],
          fn: reducers[reducerName]
        });
        return acc;
      },
      []
    );
    // we extract and organize the subscriptions
    reduxSubscriptions[namespace] = Object.keys(subscriptions).reduce(
      (acc, s) => {
        acc.push(subscriptions[s]);
        return acc;
      },
      []
    );
    // We extract, rename with the namespace and organize the effects
    Object.keys(effects).forEach(e => {
      sagaEffects.push({
        type: `${namespace}/${effects[e].name}`,
        effect: effectsName.includes(e) ? e : "takeEvery",
        fn: effects[e]
      });
    });
  });

  return [defaultState, reduxReducers, reduxSubscriptions, sagaEffects];
}

export default splitModels;
