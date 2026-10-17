import {NavLink} from 'react-router';

const Nav = () => {
  const routes = [
    {to: '/jira', label: 'Report'},
    {to: 'sprints', label: 'Sprints'},
    {to: 'columns', label: 'Columns'},
    {to: 'users', label: 'Users'},
    {to: 'issue-type', label: 'Type'},
    {to: 'issue-status', label: 'Status'},
    {to: 'resolutions', label: 'Resolutions'},
    {to: 'projects', label: 'Projects'},
  ];

  return (
    <nav className="tabs is-small">
      <ul>
        {routes.map(({to,label}, idx) => (<li key={idx}><NavLink to={to} end={to.startsWith('/')}>{label}</NavLink></li>))}
      </ul>
    </nav>
  );
};

export default Nav;
