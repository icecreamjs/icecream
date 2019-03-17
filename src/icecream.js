const path = require("path");
const fs = require("fs");
const { createStore, combineReducers, applyMiddleware } = require("redux");
const createSagaMiddleware = require("redux-saga");
// Import functions
const retrieveAllModels = require("./retrieveAllModels");
const splitModels = require("./splitModels");

const modelStructure = {
  namespace: "",
  state: {},
  reducers: {},
  effects: {},
  subscriptions: {}
};

function* rootSaga(effects) {
  yield all([...effects]);
}

/** initialize the project */
function initialize() {
  return new Promise((resolve, reject) => {
    retrieveAllModels()
      .then(models => {
        const {
          globalDefaultState,
          globalReducers,
          globalSubscriptions,
          globalEffects
        } = splitModels(models);
        console.log(globalReducers);

        const sagaMiddleware =
          typeof createSagaMiddleware === "function"
            ? createSagaMiddleware()
            : createSagaMiddleware.default();

        const reducer = combineReducers({ ...globalReducers });

        const store = createStore(
          reducer,
          globalDefaultState,
          applyMiddleware(sagaMiddleware)
        );

        sagaMiddleware.run(rootSaga(globalEffects));

        resolve(store);
      })
      .catch(error => reject(error));
  });
}

initialize()
  .then(store => console.log(store))
  .catch(error => console.error(error));
