import ACTION_TYPE from './action-type';

const {PROFILE, A11Y} = ACTION_TYPE;

const profileReducer = (state, action) => {
  switch (action.type) {
    case PROFILE.set: {
      return Object.assign({}, state, action.payload);
    }
    case PROFILE.add: {
      return Object.assign({}, state, {list: [...state.list, action.payload]});
    }
    default: return state
  }
};
const a11yReducer = (state, action) => {
  switch (action.type) {
    case A11Y.set: {
      return Object.assign({}, state, action.payload);
    }
    default: return state
  }
};

const reducer = (state, action) => Object.assign({}, state, {
  profile: profileReducer(state.profile, action),
  a11y: a11yReducer(state.a11y, action),
});

export default reducer;
