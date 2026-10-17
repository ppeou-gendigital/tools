import ACTION_TYPE from './action-type';

const {JIRA, APP, UPLOAD} = ACTION_TYPE;

const appReducer = (state, action) => {
  switch (action.type) {
    case APP.set: {
      return Object.assign({}, state, action.payload);
    }
    default: return state
  }
};

const jiraReducer = (state, action) => {
  switch (action.type) {
    case JIRA.set: {
      return Object.assign({}, state, action.payload);
    }
    case JIRA.setLookup: {
      const lookupList = Object.assign({}, state.lookupList, action.payload)
      return  Object.assign({}, state, {lookupList});
    }
    default: return state
  }
};

const reducer = (state, action) => (
  action.type === UPLOAD.set ? action.payload : {
    app: appReducer(state.app, action),
    jira: jiraReducer(state.jira, action)
  }
);

export default reducer;
