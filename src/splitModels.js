import checkModel from "./checkModel";
import { effectsName } from "./customEffects";

/**
 * Organize model's reducers for next step
 * @param {string} modelname
 * @param {object} reducers
 * @return {array} [{type, fn}]
 */
export function organizeModelReducers(modelname, reducers) {
  return Object.keys(reducers).reduce((acc, reducerName) => {
    acc.push({
      type: `${modelname}/${reducerName}`,
      fn: reducers[reducerName]
    });
    return acc;
  }, []);
}

/**
 * Organize model's effects for next step
 * @param {string} modelname
 * @param {object} effects
 * @return {array} [{type, effect, fn}]
 */
export function organizeModelEffects(modelname, effects) {
  return Object.keys(effects).reduce((acc, e) => {
    acc.push({
      type: `${modelname}/${e}`,
      effect: effectsName.includes(e) ? e : "takeEvery",
      fn: effects[e]
    });
    return acc;
  }, []);
}

/**
 * Organize model's listeners for next step
 * @param {object} listeners
 * @return {array} [fn]
 */
export function organizeModelListeners(listeners) {
  return Object.keys(listeners).reduce((acc, s) => {
    acc.push(listeners[s]);
    return acc;
  }, []);
}

/** Split models to separate and organize state, reducers, listeners and effects
 * @param {array} models
 */
function splitModels(models) {
  let initialState = { _ic: { lD: "" } };
  let reduxReducers = [];
  let reduxListeners = {};
  let sagaEffects = [];

  models.forEach(model => {
    checkModel(model);
    const { modelname, state, reducers, listeners, effects } = model;
    // We organize the global initialState
    initialState[modelname] = state;
    reduxReducers = [
      ...reduxReducers,
      ...organizeModelReducers(modelname, reducers)
    ];
    reduxListeners[modelname] = organizeModelListeners(listeners);
    sagaEffects = [...sagaEffects, ...organizeModelEffects(modelname, effects)];
  });

  return [initialState, reduxReducers, reduxListeners, sagaEffects];
}

export default splitModels;
