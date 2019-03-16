module.exports = {
  namespace: "app",
  state: {
    step: {
      0: false,
      1: "Etape suivante",
      2: "Voir prescription",
      3: "Retourner au début"
    },
    currentStep: 0,
    activeNextButton: false,
    menuCollapsed: false
  },
  reducers: {
    menuCollapsed(state) {
      const menuCollapsed = !state.menuCollapsed;
      return {
        ...state,
        menuCollapsed
      };
    },
    setStep(state, { step }) {
      return {
        ...state,
        currentStep: step
      };
    },
    upStep(state) {
      const currentStep =
        state.currentStep < 3 ? state.currentStep + 1 : state.currentStep;
      return {
        ...state,
        currentStep
      };
    },
    downStep(state) {
      const currentStep =
        state.currentStep < 3 ? state.currentStep + 1 : state.currentStep;
      return {
        ...state,
        currentStep
      };
    },
    activeNextButton(state, { active }) {
      return {
        ...state,
        activeNextButton: active
      };
    }
  },
  effects: {
    *handleNextStep(_, { put, call, select }) {
      const { currentStep } = yield select(state => state.app);
      switch (currentStep) {
        case 1:
          yield put({ type: "diagno/startSymptoms" });
          break;
        case 2:
          yield put({ type: "diagno/displayPrescription" });
          break;
        case 3:
          yield put({ type: "diagno/resetDiagno" });
          break;
        default:
          break;
      }
    },
    *toSearch(_, { put, call, select }) {
      const { currentStep } = yield select(state => state.app);
      if (currentStep === 3) {
        yield put({ type: "/setStep", step: 1 });
        yield put({ type: "diagno/reset" });
      }
      router.push("/search");
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};
