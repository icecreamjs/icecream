export default {
  namespace: "app",
  state: {
    text: "Hello World",
    status: true
  },
  reducers: {
    text(state, { text }) {
      return text;
    },
    status(state, { status }) {
      return {
        status
      };
    }
  },
  effects: {},
  subscriptions: {
    listen(state) {
      console.log("I see you!");
    }
  }
};