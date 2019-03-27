import reduceReducers from "reduce-reducers";
import assert from "assert";
import { getArrayFromModelReducers } from "icecream-please";
import { call, put } from "icecream-please/effects";
import userModel from "./user";
import { getPostFromUser } from "../functions";

const { modelname, state, reducers, effects } = userModel;

describe("Reducers of user model...", () => {
  const reducer = reduceReducers(
    state,
    ...getArrayFromModelReducers(modelname, reducers)
  );
  test("should change the state name", () => {
    expect(
      reducer(state, { type: "user/name", name: "Jacques Peralta" })
    ).toEqual({
      name: "Jacques Peralta",
      post: {},
      fetchingPost: false
    });
    expect(
      reducer(
        {
          name: "Jacques Peralta",
          post: {},
          fetchingPost: false
        },
        { type: "user/name", name: "Jack Peralta" }
      )
    ).toEqual({
      name: "Jack Peralta",
      post: {},
      fetchingPost: false
    });
  });
  test("should change the state post", () => {
    expect(
      reducer(state, {
        type: "user/addPost",
        post: { id: 1, user: 1, title: "Hello", body: "World" }
      })
    ).toEqual({
      name: "",
      post: { id: 1, user: 1, title: "Hello", body: "World" },
      fetchingPost: false
    });
  });
  test("should change the state fetchingPost to true", () => {
    expect(reducer(state, { type: "user/fetchingPost" })).toEqual({
      name: "",
      post: {},
      fetchingPost: true
    });
  });
  test("should change the state fetchingPost to false", () => {
    expect(
      reducer(
        { name: "", post: {}, fetchingPost: true },
        { type: "user/fetchingPost" }
      )
    ).toEqual({
      name: "",
      post: {},
      fetchingPost: false
    });
  });
});

describe("Effects of user model...", () => {
  test("should fetch a post", () => {
    const { fetchPost } = effects;
    const gen = fetchPost({ id: 0 }, { call, put });
    assert.deepStrictEqual(
      gen.next().value,
      call(getPostFromUser, 0),
      "fetchPost should yield an Effect call(getPostFromUser, 0)"
    );
  });
});
