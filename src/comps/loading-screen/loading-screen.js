import './loading-screen.scss';

const LoadingScreen = ({textPosition}) => {
  const classNames = ['loading-screen'];
  if(textPosition) {
    classNames.push(`loading-screen--text-${textPosition}`);
  }
  return <div className={classNames.join(' ')}>
    <h1 className="is-size-3 has-text-weight-bold">Loading ...</h1>
  </div>;
};

export default LoadingScreen;
