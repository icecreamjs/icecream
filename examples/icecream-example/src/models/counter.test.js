import reduceReducers from "reduce-reducers";
import { getArrayFromModelReducers } from "icecream";
import counterModel from "./counter";

const { namespace, state, reducers } = counterModel;

describe("Reducers of counter model...", () => {
  const reducer = reduceReducers(
    state,
    ...getArrayFromModelReducers(namespace, reducers)
  );
  test("should increment the counter", () => {
    expect(reducer(state, { type: "counter/add" })).toEqual({ number: 1 });
  });
  test("should decrement the counter", () => {
    expect(reducer({ number: 3 }, { type: "counter/sub" })).toEqual({
      number: 2
    });
  });
  test("should reset the counter", () => {
    expect(reducer({ number: 5 }, { type: "counter/reset" })).toEqual({
      number: 0
    });
  });
});
