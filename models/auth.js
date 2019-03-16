module.exports = {
  namespace: "auth",
  state: {
    me: false,
    error: false,
    messageError: false
  },
  reducers: {
    me(state, { me }) {
      return {
        ...state,
        me
      };
    },
    error(state, { error }) {
      return {
        ...state,
        error
      };
    },
    messageError(state, { messageError }) {
      return {
        ...state,
        messageError
      };
    }
  },
  effects: {
    *login({ values }, { put, call, select }) {
      const { email, password } = values;
      const data = { username: email, password: password };

      const res = yield call(AuthService.logUser, data);

      if (res.status === "success") {
        const {
          data: { username, access_token }
        } = res;
        yield localStorage.setItem("access_token", access_token);
        yield put({ type: "me", me: { username: username } });
        yield put({ type: "error", error: false });
        yield put({ type: "messageError", messageError: false });
        yield put({ type: "diagno/startDiagnostic" });
      } else {
        yield put({ type: "error", error: true });
        yield put({ type: "messageError", messageError: res.data });
      }
    },
    *logout(_, { put, call, select }) {
      const { menuCollapsed } = yield select(state => state.app);
      if (menuCollapsed) {
        yield put({ type: "app/menuCollapsed" });
      }
      console.log("clearing token");
      yield localStorage.removeItem("access_token");
      yield put({ type: "me", me: false });
      yield put({ type: "app/setStep", step: 0 });
      router.push("/login");
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};
