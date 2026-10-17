import {useEffect} from 'react';
import {useStore} from '../../context/profile';

const A11yService = () => {
  const [{a11y}] = useStore();
  useEffect(() => {
    document.querySelector(':root').style.fontSize = a11y.fontSize;
  }, [a11y]);

  return null;
};


export default A11yService;
