import * as sagaEffects from "redux-saga/effects";
import { take, fork, cancel, actionChannel } from "redux-saga/effects";

export * from "redux-saga/effects";

export const effectsName = [
  "takeEvery",
  "takeLatest",
  "takeLeading",
  "throttle",
  "debounce"
];

export const takeEvery = (pattern, saga) =>
  fork(function*() {
    while (true) {
      const action = yield take(pattern);
      yield fork(saga, action, sagaEffects);
    }
  });

export const takeLatest = (pattern, saga) =>
  fork(function*() {
    let lastTask;
    while (true) {
      const action = yield take(pattern);
      if (lastTask) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(saga, action, sagaEffects);
    }
  });

export const takeLeading = (pattern, saga) =>
  fork(function*() {
    while (true) {
      const action = yield take(pattern);
      yield call(saga, action, sagaEffects);
    }
  });

/* When the effect has to receive a "ms" argument, it has to be passed as an action */
export const throttle = (pattern, saga) =>
  fork(function*() {
    const throttleChannel = yield actionChannel(pattern, buffers.sliding(1));
    while (true) {
      const action = yield take(throttleChannel);
      yield fork(saga, action, sagaEffects);
      yield delay(action.ms);
    }
  });

/* When the effect has to receive a "ms" argument, it has to be passed as an action */
export const debounce = (pattern, saga) =>
  fork(function*() {
    while (true) {
      let action = yield take(pattern);
      while (true) {
        const { debounced, _action } = yield race({
          debounced: delay(action.ms),
          _action: take(pattern)
        });
        if (debounced) {
          yield fork(saga, action, sagaEffects);
          break;
        }
        action = _action;
      }
    }
  });
