import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import App from "./components/App";
import reducer from "./reducers";
import "todomvc-app-css/index.css";

const logger = createLogger({ collapsed: true });

const store = createStore(reducer, applyMiddleware(logger));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
