import { getPostFromUser } from "../functions";

export default {
  namespace: "user",
  state: {
    name: "",
    post: {},
    fetchingPost: false
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
        post,
        fetchingPost: false
      };
    },
    fetchingPost(state) {
      return {
        ...state,
        fetchingPost: !state.fetchingPost
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
    listen(state, lastDispatch, dispatch) {
      if (lastDispatch === "user/fetchPost") {
        dispatch({ type: "user/fetchingPost" });
      }
    }
  }
};
