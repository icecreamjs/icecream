/** subscribe
 * @param {object} store
 * @param {object} subscriptions
 * @param {object} state
 * @param {function} dispatch
 */
function createSubscriptions(store, subscriptions) {
  Object.keys(subscriptions).forEach(model => {
    subscriptions[model].forEach(fn => {
      store.subscribe(() => {
        if (store.getState().lastDispatch.split("/")[0] === model) {
          fn(store.getState()[model]);
        }
      });
    });
  });
}

export default createSubscriptions;
