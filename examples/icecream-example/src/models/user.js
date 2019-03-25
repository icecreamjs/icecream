export default {
  namespace: "user",
  state: {
    name: "",
    post: {}
  },
  reducers: {
    name(state, { name }) {
      return {
        ...state,
        name
      };
    },
    addPost(state, { post }) {
      return {
        ...state,
        post
      };
    }
  },
  effects: {
    *fetchPost({ id }, { call, put }) {
      try {
        const data = yield call(getPostFromUser, id);
        if (data) {
          yield put({ type: "user/addPost", post: data });
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  subscriptions: {
    listen(state, lastDispatch) {
      if (lastDispatch === "user/fetchPost") {
        console.log("fetching data...");
      }
    }
  }
};

function getPostFromUser(id) {
  const response = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(res => {
      if (res.status !== 200) {
        return;
      }
      return res.json();
    })
    .then(data => data)
    .catch(error => error);

  return response;
}
