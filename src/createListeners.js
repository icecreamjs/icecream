/** subscribe functions
 * @param {object} store
 * @param {object} listeners
 * @param {object} state
 * @param {function} dispatch
 */
function createListeners(store, listeners) {
  Object.keys(listeners).forEach(model => {
    listeners[model].forEach(fn => {
      store.subscribe(() => {
        if (store.getState()._ic.lD.split("/")[0] === model) {
          fn(store.getState()[model], store.getState()._ic.lD, store.dispatch);
        }
      });
    });
  });
}

export default createListeners;
