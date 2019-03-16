module.exports = {
  namespace: "router",
  state: {},
  reducers: {},
  effects: {
    *checkIfAuthorized({ pathname }, { call, put, select }) {
      const { me } = yield select(state => state.auth);
      const token = yield localStorage.getItem("access_token");
      const authorized = me && token;

      if (pathname !== "/login" && !authorized) {
        yield put({ type: "auth/logout" });
      } else if (pathname === "/login" && authorized) {
        router.push("/");
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location;
        // console.log(`path: ${pathname}`);
        // Make sure that the step match the address
        switch (pathname) {
          case "/login":
            dispatch({ type: "app/setStep", step: 0 });
            break;
          case "/":
            dispatch({ type: "app/setStep", step: 1 });
            break;
          case "/symptoms":
            dispatch({ type: "app/setStep", step: 2 });
            break;
          case "/prescriptions":
            dispatch({ type: "app/setStep", step: 3 });
            break;

          default:
            break;
        }

        // We check if user is allowed to go where he wants
        dispatch({ type: "checkIfAuthorized", pathname });
      });
    }
  }
};
