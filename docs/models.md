---
id: models
title: Models
sidebar_label: Models
hide_title: true
---

# Models

## General structure

Models have a well define structure that must be:

```js
export default {
  modelname: "", // type: string
  state: {}, // type: Object
  reducers: {}, // type: Object of functions
  effects: {}, // type: Object of functions generators
  listeners: {}, // type: Object of functions
}
```

If you don't respect the structure and types above, you will have an error when you build your app.
Let's see each aspect of the structure.

## state

Let's start with the state of the model. This is your initial redux state, you will mutate it with your reducers. That all about the state key of the model! If you need more details, I invite you to check the [Redux documentation](https://redux.js.org/).

## modelname

Your application logic will be break into differents bricks. You decide how to split your application the most convenient way.
Those bricks need a name to create the global redux state following your choice of organization. This name must be a simple string like
`user`, `auth`, `account`, etc... Don't try to have a more complexe name for your model, because each time you will have to dispatch an action
to a reducers from this model, the type will be in the form of:

```js
dispatch({
  type: 'modelname/reducer',
  payload,
})
```

So for a real exemple:

```js
dispatch({
  type: 'account/editName',
  name: 'Lea',
})
```

Your global redux state will be split into differents part following your models:

```js
state = {
  user:{
    ...
  },
  auth:{
    ...
  },
  account:{
    ...
  },
  ...
  _ic: { lD: "" }
}
```

What is the last key of the state, _ic? That an information automatically add by iceCream to know your last dispatch. It will be handy for
the listeners functions to avoid infinite loops!

## reducers

The main (and the only!) goal of reducers is to mutate the state. There is plenty to say about what a reducer should do or not, and it is explained very well in the Redux documentation [here](https://redux.js.org/recipes/structuring-reducers/prerequisite-concepts#prerequisite-reducer-concepts), so no reason to repeat everything here.
One detail add by iceCream:
  * the signature of a reducer is `(state, action)`, and state here is not the global state of the application, but only the state of the model in which the reducer is written.

To go back to the _real example_ above, the reducer call by the dispatch will be:
```js
...,
modelname: "account",
...,
reducers: {
  editName(state, { name }) {
    return {
      ...state,
      name
    }
  }
},
...
```

## effects

Effects is the object where redux-saga functions will be written. Again, there is a lot to say about redux-saga, and fortunately, they have a great
documentation [here](https://redux-saga.js.org/). Be sure to check how it work!

First thing, redux-saga use functions generators. What is that? [Answer here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*). We can quickly explain for our needs here, that a function generator is a function that use the key word `yield`. This key word
provide _steps_ to the function that you can iterate into. This `yield` key word will be use with effects(`put`, `call`, `select`, etc...),
that are functions provide by redux-saga, to handle asynchronous actions the way you want.
This is by the way the reason to exist of redux-saga, to help you handle asynchronous actions. And if you understood nothing of what explained above, please go check the docs ;).

When you create a function generator, you need to choose which helper to use. By default, iceCream use the helper function `takeEvery`. So if you write:

```js
...,
effects: {
  *fetchPost({ id }, { call, put }) {
    try {
      const data = yield call(getPostFromUser, id);
      if (data) {
        yield put({
          type: "user/addPost",
          post: data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
},
...
```

The function `fetchPost` will be use with `takeEvery`. But maybe you don't want to use the `takeEvery` helper, and use another one like `takeLatest`
for a few others functions in your model. For that, just create a key in the effects object with the same name of the helper you wish to use:

```js
...,
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
...
```

All the functions generators inside the object `takeLatest` will be call with the helper `takeLatest`. Same with the helpers : takeLeading, throttle,  debounce.

Now let's talk about the signature of functions generators use in effects. The first argument is the action of your dispatch, you can like with the reducers, destructure directly the object to extract the variable you want. The second argument is an object containing all the effects of `redux-saga/effects`. By destructuring the object, you can choose the effects you need.

## listeners

In the last key of the model object, you have the listeners, functions that will be subscribed with Redux `subscribe` function.
In the same logic that state, listeners that are declare in a specific model will be call only by a dispatch concerning this model.

```js
...,
listeners: {
  listen(state, lastDispatch, dispatch) {
    if (lastDispatch === "user/fetchPost") {
      dispatch({ type: "user/fetchingPost" });
    }
  }
},
...
```

As you can see, the signature of a listeners function is composed by 3 elements:
  * the state of the model
  * the type of the last dispatch to avoid infinite loop
  * the redux dispatch function
