import checkModel from "./checkModel";
import { effectsName } from "./customEffects";

/**
 * Organize model's reducers for next step
 * @param {string} namespace
 * @param {object} reducers
 * @return {array} [{type, fn}]
 */
export function organizeModelReducers(namespace, reducers) {
  return Object.keys(reducers).reduce((acc, reducerName) => {
    acc.push({
      type: `${namespace}/${reducerName}`,
      fn: reducers[reducerName]
    });
    return acc;
  }, []);
}

/**
 * Organize model's effects for next step
 * @param {string} namespace
 * @param {object} effects
 * @return {array} [{type, effect, fn}]
 */
export function organizeModelEffects(namespace, effects) {
  return Object.keys(effects).reduce((acc, e) => {
    acc.push({
      type: `${namespace}/${effects[e].name}`,
      effect: effectsName.includes(e) ? e : "takeEvery",
      fn: effects[e]
    });
    return acc;
  }, []);
}

/**
 * Organize model's subscription for next step
 * @param {object} subscriptions
 * @return {array} [fn]
 */
export function organizeModelSubscriptions(subscriptions) {
  return Object.keys(subscriptions).reduce((acc, s) => {
    acc.push(subscriptions[s]);
    return acc;
  }, []);
}

/** Split models to separate and organize state, reducers, subscriptions and effects
 * @param {array} models
 */
function splitModels(models) {
  let defaultState = { _ic: { lD: "" } };
  let reduxReducers = [];
  let reduxSubscriptions = {};
  let sagaEffects = [];

  models.forEach(model => {
    checkModel(model);
    const { namespace, state, reducers, subscriptions, effects } = model;
    // We organize the global initialState
    defaultState[namespace] = state;
    reduxReducers = [
      ...reduxReducers,
      ...organizeModelReducers(namespace, reducers)
    ];
    reduxSubscriptions[namespace] = organizeModelSubscriptions(subscriptions);
    sagaEffects = [...sagaEffects, ...organizeModelEffects(namespace, effects)];
  });

  return [defaultState, reduxReducers, reduxSubscriptions, sagaEffects];
}

export default splitModels;
