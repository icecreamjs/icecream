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
