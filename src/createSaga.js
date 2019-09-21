import { all } from "redux-saga/effects";
import * as customEffects from "./customEffects";
import { loadingEffectWrapper } from './handleLoading';

/** create a saga
 */
function createSagaFn({ type, effect, fn }) {
  const modelName = type.split('/')[0];
  const fnName = type.split('/')[1];
  return function *() {
    yield customEffects[effect](type, loadingEffectWrapper(modelName, fnName, fn));
  }
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
