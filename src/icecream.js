import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import invariant from "invariant";
// Import functions
import splitModels from "./splitModels";
import createReducer from "./createReducer";
import createSaga from "./createSaga";

/** build redux store and sagas
 * @param {object} defaultState
 * @param {object} reducers
 * @param {object} subscriptions
 * @param {object} effects
 * @returns {object} redux store of application
 * TODOs managing subscriptions!
 * TODOs managing effects!
 */
function buildSystem(defaultState, reducers, subscriptions, effects, plugins) {
  try {
    const sagaMiddleware = createSagaMiddleware();
    // We build the global reducer
    const reducer = createReducer(reducers);
    let middleware = [...plugins, sagaMiddleware];
    const store = createStore(
      reducer,
      defaultState,
      applyMiddleware(...middleware)
    );
    const saga = createSaga(effects);
    // sagaMiddleware.run(rootSaga(effects));
    return store;
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
    const store = buildSystem(
      defaultState,
      reducers,
      subscriptions,
      effects,
      plugins
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
  invariant(
    Object.keys(configuration).includes("models"),
    "icecream must has at least one model to work with!"
  );
  invariant(
    configuration.models.length > 0,
    "icecream must has at least one model to work with!"
  );
  if (!Object.keys(configuration).includes("plugins")) {
    configuration.plugins = [];
  }
  const storeToReturn = initialize(configuration);
  return storeToReturn;
}

export default iceCreamPlease;
