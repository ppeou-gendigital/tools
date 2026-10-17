import {createContext, useContext, useEffect, useReducer} from 'react';
import initialState from './state';
import reducer from './reducer';
import {setJira} from './action';

const StateContext = createContext(null);
const DispatchContext = createContext(null);

const Store = ({children, db}) => {
  const [state, dispatch] = useReducer(reducer, db.has() ? db.get() : initialState);

  useEffect(() => {
    if(db.has()) {
      const cacheData = db.get();
      dispatch(setJira(cacheData.jira));
    }

  }, [db]);

  useEffect(() => {
    db.set(state);
  }, [state]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const useStore = () => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return [state, dispatch];
};

export default Store;

export {StateContext, DispatchContext, useStore}
