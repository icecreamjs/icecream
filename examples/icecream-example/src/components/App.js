import React, { useState } from "react";
import { connect } from "react-redux";

const App = props => {
  const [postId, setPostId] = useState(1);

  const {
    counter: { number },
    user: { name, post, fetchingPost },
    dispatch
  } = props;

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{`Hello ${name}`}</h1>
      <div>
        <p>(write your name below:)</p>
        <input
          type="text"
          onChange={e => dispatch({ type: "user/name", name: e.target.value })}
        />
      </div>
      <hr />
      <div>
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
      <hr />
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => {
              dispatch({ type: "user/fetchPost", id: postId });
            }}
          >
            fetch post number:
          </button>
          <input
            style={{ width: "20px" }}
            onChange={e => setPostId(e.target.value)}
          />
        </div>
        {fetchingPost ? (
          <p>fetching...</p>
        ) : (
          Object.keys(post).length > 0 && (
            <div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default connect(({ counter, user }) => ({ counter, user }))(App);
