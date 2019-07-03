---
id: how-it-works
title: How it works
sidebar_label: How it works
hide_title: true
---

# How it works

## Very quickly

```js
// index.js

import iceCreamPlease from "icecream-please";
import userModel from "./src/models/userModel";
import authModel from "./src/models/authModel";

const store = iceCreamPlease({
  models: [userModel, authModel],
});

...

```

IceCreamPlease is a function that you import in the root file of your project. This function returns the redux store object that you normally get with the redux's `createStore` function. And that's it.

## Install package

Use your favorite packages manager:

```bash
yarn add icecream-please
```

or

```bash
npm i --save icecream-please
```

## Basic example

Let's start by writting a model.
A model is a classic JavaScript object `key/value` that will contains all the necessary logic for a part of your application to works.
You can have only one model for your entire application, but it usually useful to organize your application by splitting it in differents parts.

Let's create a model to handle a basic counter:

```js
// counterModel.js

export default {
  modelname: "counter",
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
  listeners: {}
};
```

You have in this model the state of the counter with his initial value and the reducers to mutate the state. Even if we don't use any effects or listeners, keys must be there with an empty object. Model's structure are immutable, if you want to know more about it, you can directly click here.

Ok, you remember the code at the top of this page? Well we do exactly the same thing here:

```js
// index.js
import iceCreamPlease from "icecream-please";
import counterModel from "./counterModel";

const store = iceCreamPlease({
  models: [counterModel],
});

...

```

IceCreamPlease is working with redux and redux-saga, that's all. It means that **you can use it with any kind of JavaScript libraries and frameworks**. We use React here:

```js
// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import iceCreamPlease from "icecream-please";
import counterModel from "./counterModel";
import App from "./components/App";

const store = iceCreamPlease({ models: [counterModel] });

const Container = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Container />, document.getElementById("root"));
```

Here the code of the App.js file:

```js
// App.js
import React from "react";
import { connect } from "react-redux";

const App = props => {
  const {
    counter: { number },
    dispatch
  } = props;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Use the counter:</h2>
      <h2>{number}</h2>
      <div>
        <button
          onClick={() => {
            dispatch({ type: "counter/sub" });
          }}
        >
          SUB
        </button>
        <button
          onClick={() => {
            dispatch({ type: "counter/reset" });
          }}
        >
          RESET
        </button>
        <button
          onClick={() => {
            dispatch({ type: "counter/add" });
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default connect(({ counter }) => ({ counter }))(App);
```

And Voilà! You can find this example [here](https://github.com/icecreamjs/icecream/tree/master/examples/icp-basicexample) and a less basic [here](https://github.com/icecreamjs/icecream/tree/master/examples/icecream-example).

## Middlewares and enhancers for Redux

IceCreamPlease takes as argument an object which can have the `models` key that we just saw above and two others: `middlewares` and `enhancers`.

To have the same behavior that:

```js
import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import DevTools from "./containers/DevTools";
import reducer from "../reducers";

const store = createStore(
  reducer,
  compose(
    applyMiddleware(logger),
    DevTools.instrument()
  )
);
```

Do:

```js
import iceCreamPlease from "icecream-please";
import logger from "redux-logger";
import DevTools from "./containers/DevTools";
import myModel from "./myModel";

const store = iceCreamPlease({
  models: [myModel],
  middlewares: [logger],
  enhancers: [DevTools.instrument()]
});
```
