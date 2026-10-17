import ACTION_TYPE from './action-type';

const setProfile =  (payload) => ({ type: ACTION_TYPE.PROFILE.set, payload });
const addProfile =  (payload) => ({ type: ACTION_TYPE.PROFILE.add, payload });
const setA11y =  (payload) => ({ type: ACTION_TYPE.A11Y.set, payload });

export {setProfile, addProfile, setA11y};
