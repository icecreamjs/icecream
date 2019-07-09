---
id: testing
title: Testing
sidebar_label: Testing
hide_title: true
---

# Testing

## How to test our model reducer?

Testing functions of models is easy, since we just have to import the model in a file and test it.


But testing the reducer of a particular model is harder.
For that iceCream provides a function `getArrayFromModelReducers` that take, as arguments, the modelname and the reducers object of your model and returns an array of all your reducers of the model you are testing. With the library [reduce-reducers](https://www.npmjs.com/package/reduce-reducers) you can create a reducer and test it to see if it mutates the state as desired:

```js
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
```
