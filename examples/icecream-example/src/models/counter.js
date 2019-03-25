export default {
  namespace: "counter",
  state: {
    number: 0
  },
  reducers: {
    add(state) {
      return {
        ...state,
        number: state.number + 1
      };
    },
    sub(state) {
      return {
        ...state,
        number: state.number - 1
      };
    },
    reset(state) {
      return {
        ...state,
        number: 0
      };
    }
  },
  effects: {},
  subscriptions: {}
};
