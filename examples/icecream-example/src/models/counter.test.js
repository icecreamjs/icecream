import reduceReducers from "reduce-reducers";
import { getArrayFromModelReducers } from "icecream-please";
import counterModel from "./counter";

const { modelname, state, reducers } = counterModel;

describe("Reducers of counter model...", () => {
  const reducer = reduceReducers(
    state,
    ...getArrayFromModelReducers(modelname, reducers)
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
