import { all } from "redux-saga/effects";
import * as customEffects from "./customEffects";

/** create a saga
 * by default use takeEvery, but if fn is Array, use fn[0] which is the effect choose by the user
 */
function createSagaFn({ type, effect, fn }) {
  return function*() {
    yield customEffects[effect](type, fn);
  };
}

/** generate the saga from the model
 * @param {object} effects
 * @return {generator}
 */
function createSaga(effects) {
  const sagas = [];
  effects.forEach(e => {
    sagas.push(createSagaFn(e)());
  });
  return function*() {
    yield all(sagas);
  };
}

export default createSaga;
