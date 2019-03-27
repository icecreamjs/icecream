import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import invariant from "invariant";
// Import functions
import splitModels from "./splitModels";
import createReducer from "./createReducer";
import createSaga from "./createSaga";
import createListeners from "./createListeners";

/** build redux store and sagas
 * @param {object} initialState
 * @param {object} reducers
 * @param {object} listeners
 * @param {object} effects
 * @returns {object} redux store of application
 */
function build(initialState, reducers, listeners, effects, plugins) {
  try {
    const sagaMiddleware = createSagaMiddleware();
    const reducer = createReducer(reducers);
    const saga = createSaga(effects);
    let middleware = [...plugins, sagaMiddleware];
    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(...middleware)
    );
    createListeners(store, listeners);
    sagaMiddleware.run(saga);
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
    const [initialState, reducers, listeners, effects] = splitModels(models);
    const store = build(initialState, reducers, listeners, effects, plugins);
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
    "icecream must have at least one model to work with!"
  );
  invariant(
    configuration.models.length > 0,
    "icecream must have at least one model to work with!"
  );
  if (!Object.keys(configuration).includes("plugins")) {
    configuration.plugins = [];
  }
  const storeToReturn = initialize(configuration);
  return storeToReturn;
}

export default iceCreamPlease;
