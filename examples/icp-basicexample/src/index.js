import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import iceCreamPlease from "icecream-please";
import counterModel from "./counterModel";
import App from "./App";

const store = iceCreamPlease({ models: [counterModel] });

const Container = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Container />, document.getElementById("root"));
