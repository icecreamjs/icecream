import { all } from "redux-saga/effects";
import * as customEffects from "./customEffects";

/** create a saga
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
  const sagas = effects.reduce((acc, e) => {
    acc.push(createSagaFn(e)());
    return acc;
  }, []);

  return function*() {
    yield all(sagas);
  };
}

export default createSaga;
