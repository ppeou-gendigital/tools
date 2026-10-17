import {createContext, use, useContext, useEffect, useReducer, useRef} from 'react';
import initialState from './state';
import reducer from './reducer';
import createStorage from '../shared/storage';

const StateContext = createContext(null);
const DispatchContext = createContext(null);
const DB_NAME = 'jira-chrome-ext';
const db = createStorage(DB_NAME, 'localStorage');

const Store = ({children}) => {
  const [state, dispatch] = useReducer(reducer,db.has() ? db.get() : initialState);
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
