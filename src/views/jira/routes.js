import {Route} from 'react-router';
import Users from './users/users';
import Sprints from './sprints/sprints';
import Report from './report/report';
import IssueStatus from './issue-status/issue-status';
import IssueType from './issue-type/issue-type';
import Home from './home/home';
import Columns from './columns/columns';
import Projects from './projects/projects';
import Resolutions from './resolutions/resolutions';

const useRoutes = () => {
  return (<>
    <Route path="jira" element={<Home />}>
      <Route index element={<Report />} />
      <Route path="users" element={<Users/>} />
      <Route path="sprints" element={<Sprints/>} />
      <Route path="issue-status" element={<IssueStatus/>} />
      <Route path="issue-type" element={<IssueType/>} />
      <Route path="columns" element={<Columns/>} />
      <Route path="projects" element={<Projects/>} />
      <Route path="resolutions" element={<Resolutions/>} />
    </Route>
  </>);
};

export default useRoutes;
