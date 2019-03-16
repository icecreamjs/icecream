module.exports = {
  namespace: "search",
  state: {
    value: null,
    result: []
  },
  reducers: {
    value(state, { value }) {
      return {
        ...state,
        value
      };
    },
    result(state, { result }) {
      return {
        ...state,
        result
      };
    }
  },
  effects: {
    *launchSearch({ value }, { put, call, select }) {
      yield put({ type: "value", value });
      if (value !== "") {
        const res = yield call(SearchService.search, { s: value });
        if (res.status === "success") {
          yield put({ type: "result", result: res.data });
        } else {
          if (res.data === "UnAuthorized") {
            yield put({
              type: "error",
              error: { status: true, data: res.data }
            });
            yield put({ type: "auth/logout" });
          }
        }
      } else {
        yield put({ type: "result", result: [] });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};
