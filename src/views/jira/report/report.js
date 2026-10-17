import {useEffect, useState} from 'react';
import {useStore} from '../../../context/store';
import useEventBus from '../../../services/event-bus/event-bus';
import convertReport from './trasnform';
import mock from '../../../services/jira/mock';
import SortableList from '../../../comps/sortable-list/sortable-list';
import {setJira} from '../../../context/store/action';
import LoadingScreen from '../../../comps/loading-screen/loading-screen';
import convertReportComment from './transform-report-comment';

const FilterListRender = ({items}) => {
  return items.length < 1
      ? <ul><li className="has-text-grey is-size-6">No selection</li></ul>
      : <ul className="is-size-6">{items.map(({id, name}, idx) => <li key={idx} data-id={id}>{name}</li>)}</ul>;
};

const Report = () => {
  const [isInProgress, setIsInProgress] = useState(false);
  const [state, storeDispatch] = useStore();
  const jiraState = state.jira;

  const {on, broadcast, dispatch} = useEventBus();

  const onColumnsOrderChange = (arr) => {
    storeDispatch(setJira({columns: arr}));
  };
  const onResourcesOrderChange = (arr) => {
    storeDispatch(setJira({users: arr}));
  };

  const createReport = (e) => {
    convertReport(e.detail.data, jiraState).then(r => {
      setIsInProgress(false);
    });
  };

  const createReportComment = (e) => {
    convertReportComment(e.detail.data, jiraState).then(r => {
      setIsInProgress(false);
    });
  };

  const exportTicketsWithComments = async () => {
    broadcast('channel::report-comment::get', jiraState);
    setIsInProgress(true);
  };

  const generateReport = async () => {
    broadcast('channel::report::get', jiraState);
    //dispatch('channel::report::result', {data: mock.report});
    setIsInProgress(true);
  };
  useEffect(() => {
    const fns = [on('channel::report::result', createReport), on('channel::report-comment::result', createReportComment)];
    return () => fns.forEach(fn => fn());
  }, [jiraState]);

  return (
    <section>
      <div className="section">
        <button className="button is-medium is-fullwidth is-dark is-size-6" onClick={generateReport}>
          <span className="icon is-medium">
            <i className="fa-classic fa-solid fa-gears fa-fw"></i>
          </span>
          <span>Generate Capacity Report</span>
        </button>
        <button className="button is-medium is-fullwidth is-primary is-size-6" onClick={exportTicketsWithComments}>
          <span>Export Tickets and Comments</span>
        </button>
      </div>
      <div className="section section--list">
        <label>Projects:</label>
        <FilterListRender items={jiraState.projects}/>
      </div>
      <div className="section section--list">
        <label>Resolution:</label>
        <FilterListRender items={jiraState.resolutions}/>
      </div>
      <div className="section section--list">
        <label>Sprints:</label>
        <FilterListRender items={jiraState.sprints}/>
      </div>
      <div className="section section--list">
        <label>Status:</label>
        <FilterListRender items={jiraState.status}/>
      </div>
      <div className="section section--list">
        <label>Types:</label>
        <FilterListRender items={jiraState.types}/>
      </div>

      <SortableList size={state.jira.columns.length} label="Columns" items={state.jira.columns} onChange={onColumnsOrderChange}/>
      <SortableList size={8} label="Resources" items={state.jira.users} onChange={onResourcesOrderChange}/>
      {isInProgress && <LoadingScreen textPosition="top" />}
    </section>
  );
};
export default Report;
