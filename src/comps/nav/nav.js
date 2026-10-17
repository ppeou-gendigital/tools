import {useEffect} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router';
import {useStore as useProfile} from '../../context/profile';

import './nav.scss';


const Nav = () => {
  const [{profile}] = useProfile();
  const location = useLocation();
  let navigate = useNavigate();
  useEffect(() => {
    if((location.pathname === '/' || location.pathname === '/index.html')) {
      navigate(profile.selected ? '/jira' : '/profiles');
    }
  }, []);
  return (
    <nav className="tabs is-centered is-small is-boxed" role="navigation" aria-label="main navigation">
      <ul>
        <li><NavLink to="/profiles" end>Profiles</NavLink></li>
        <li><NavLink to="/jira" end>Jira</NavLink></li>
      </ul>
    </nav>
  );
};

export default Nav;
