import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import iceCreamPlease from "icecream-please";
import "./index.css";
import App from "./components/App";
import { createLogger } from "redux-logger";
// models
import counterModel from "./models/counter";
import userModel from "./models/user";

const logger = createLogger({
  collapsed: true,
  duration: true
});

const store = iceCreamPlease({
  models: [counterModel, userModel],
  plugins: [logger]
});

const Container = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Container />, document.getElementById("root"));
