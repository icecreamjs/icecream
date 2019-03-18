import * as sagaEffects from "redux-saga/effects";

/** create a saga
 *
 */
function createSagaFn(action, type, fn) {
  return function*() {
    yield takeEvery(type, () => fn(action, sagaEffects));
  };
}

function rootSaga(effects) {
  return function*() {
    yield all(effects);
  };
}

/** create the saga to run
 * @param {object} effects
 * @return {generator}
 */
function createSaga(effects) {
  console.log(effects);
}

export default createSaga;
