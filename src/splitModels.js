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
    if (effectsName.includes(e)) {
      const helperAr = Object.keys(effects[e]).reduce((ac, f) => {
        ac.push({
          type: `${modelname}/${f}`,
          effect: e,
          fn: effects[e][f]
        });
        return ac;
      }, []);
      return [...acc, ...helperAr];
    }
    if (!effectsName.includes(e) && typeof effects[e] === 'function') {
      acc.push({
        type: `${modelname}/${e}`,
        effect: "takeEvery",
        fn: effects[e],
      });
    }
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

/** Create the initial state of the _loading model
* @param {array} models
*/
function initializeLoadingState(models) {
  let state = {};
  models.forEach(model => {
    const { modelname, effects } = model;
    if(modelname !== '_loading') {
      state[modelname] = Object.keys(effects).reduce((acc, e) => {
        if (effectsName.includes(e)) {
           acc = {
              ...acc,
              ...Object.keys(effects[e]).reduce((ac, f) => ({
                ...ac,
                [f]: false,
              }), {}),
           };
        }
        if (!effectsName.includes(e) && typeof effects[e] === 'function') {
          acc = {
            ...acc,
            [e]: false,
          };
        }
        return acc;
      }, {});
      state[modelname].global = false;
    }
  });
  return state;
}

/** Split models to separate and organize state, reducers, listeners and effects
 * @param {array} models
 */
function splitModels(models) {
  let initialState = {
    _ic: {lD: ""},
    _loading: initializeLoadingState(models)
  };
  let reduxReducers = [];
  let reduxListeners = {};
  let sagaEffects = [];

  models.forEach(model => {
    checkModel(model);
    const { modelname, state, reducers, listeners, effects } = model;
    // We add the model in the _loading initialState
    // We organize the global initialState
    if (modelname !== '_loading') initialState[modelname] = state;
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
