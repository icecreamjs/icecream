import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
// Import functions
import splitModels from "./splitModels";
import buildReducer from "./buildReducer";

// const modelStructure = {
//   namespace: "",
//   state: {},
//   reducers: {},
//   effects: {},
//   subscriptions: {}
// };

class app {
  store = {};
}

const app = new app();

function rootSaga(effects) {
  return function*() {
    yield all(effects);
  };
}

/** build redux store and sagas
 * @param {object} defaultState
 * @param {object} reducers
 * @param {object} subscriptions
 * @param {object} effects
 * @returns {object} redux store of application
 * TODOs managing subscriptions!
 */
function buildReduxAndSaga(defaultState, reducers, subscriptions, effects) {
  try {
    // const sagaMiddleware = createSagaMiddleware();
    const reducer = buildReducer(reducers, app.store.getState() || {});
    app.store = createStore(
      reducer,
      defaultState
      // applyMiddleware(sagaMiddleware)
    );
    // sagaMiddleware.run(rootSaga(effects));
    return app.store;
  } catch (error) {
    throw error;
  }
}

/** initialize the project
 * @return {object} redux store of application
 * @param {object} configuration
 */
function initialize(configuration) {
  const { models, plugins } = configuration;
  try {
    const [defaultState, reducers, subscriptions, effects] = splitModels(
      models
    );
    const store = buildReduxAndSaga(
      defaultState,
      reducers,
      subscriptions,
      effects
    );
    return store;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const configDefault = {
  models: [],
  plugins: []
};

/** entry point
 * @return {object} redux store of application
 * @param {object} configuration
 */
function iceCreamPlease(configuration = configDefault) {
  const storeToReturn = initialize(configuration);
  return storeToReturn;
}

export default iceCreamPlease;
