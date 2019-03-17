/** build Reducer for redux from model
 * @param {object} reducersCollection
 * @param {obejct} state
 * ! NOT FINISH
 */
function buildReducer(reducersCollection, state) {
  const actions_names = Object.keys(reducers);
  const state = app.store.getState();
  return function(state, action) {
    for (let i = 0; i < actions_names.length; i++) {
      const action_name = actions_names[i];
      if (action_name === action.type) {
        return reducers[action_name];
      }
    }
    return state;
  };
}
