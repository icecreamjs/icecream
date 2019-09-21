import { put } from "redux-saga/effects";

const handleLoadingStatus = (isActive) => (state, { modelName, fnName }) => {
  return {
    ...state,
    [modelName]: {
      ...state[modelName],
      [fnName]: isActive,
      global: isActive,
    },
  };
}

export function loadingEffectWrapper (modelName, fnName, effect){
 return function *(...args) {
     try {
       yield put({type: '_loading/isActive', modelName, fnName});
       yield effect(...args);
       yield put({type: '_loading/notActive', modelName, fnName});
     } catch(err){
       console.error(err);
     }
   }
}

export const _loadingModel = {
    modelname: '_loading',
    state: {},
    reducers: {
      isActive: handleLoadingStatus(true),
      notActive: handleLoadingStatus(false),
    },
    effects: {},
    listeners: {},
};
