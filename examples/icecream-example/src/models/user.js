import { getPostFromUser } from "../functions";

export default {
  modelname: "user",
  state: {
    name: "",
    post: {},
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
  },
  effects: {
    *fetchPost({ id }, { call, put, delay }) {
      try {
        yield delay(2000);
        const data = yield call(getPostFromUser, id);
        if (data) {
          yield put({ type: "user/addPost", post: data });
        }
      } catch (error) {
        console.error(error);
      }
    },
    takeLatest: {
      *fetchPostLatest({ id }, { call, put }) {
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
  },
  listeners: {}
};
