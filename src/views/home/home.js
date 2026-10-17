import {useStore} from '../../context/store';


const Home = () => {
  const [state, dispatch] = useStore();
  console.log('state', state);
  const doSomething = () => {
    dispatch({type: 'set', payload: {now: new Date().toJSON()}})
  };
  return (
    <div>
      <h1>Home: {state.now || 'no data'}</h1>
      <button onClick={doSomething}>Click Me</button>
    </div>
  );
};

export default Home;
