import {useStore} from '../../../context/store';
import SortableList from '../../../comps/sortable-list/sortable-list';
import {setJira, setJiraLookupList} from '../../../context/store/action';
import {useState} from 'react';
import JiraService, {valueToLookupList} from '../../../services/jira';
import DualList from '../../../comps/dual-list/dual-list';
const ColumnsLookup = () => {

  const [state, dispatch] = useStore();
  const [result, setResult] = useState([]);
  const [selectedValues] = useState(state.jira.lookupList.fields || []);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const doSearch = () => {
    JiraService.columns.search(inputValue).then(r => {
      setResult([...r.data]);
    });
  };

  const onChange = (values) => {
    dispatch(setJiraLookupList({fields: values}));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.length > 0) {
      doSearch()
    }
  };

  const optionRenderer = ({id, name}, idx) => <option key={idx} value={idx}>{name} ({id})</option>;

  return (
    <section>
      <h1>Columns for JIRA Data Fetching</h1>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input className="input" type="text" placeholder="Enter text here" value={inputValue} onChange={handleInputChange}
                 onKeyDown={onKeyDown}/>
        </div>
        <div className="control">
          <button className="button is-dark" onClick={doSearch} disabled={!inputValue}>Search</button>
        </div>
      </div>
      <DualList className="columns-list" itemKey="name" src={result} size={8} dest={selectedValues} optionRenderer={optionRenderer} onChange={onChange}/>
    </section>
  );
};

const ColumnsReport = () => {
  const [state, dispatch] = useStore();
  const [selectedValues] = useState(state.jira.columns || []);

  const onChange = (values) => {
    dispatch(setJira({columns: values}));
  };

  const optionRenderer = ({name, id, stateKey}, idx) => <option key={idx} value={idx}>{name} ({id})</option>;

  return (<>
    <section>
      <h1>Columns For Report</h1>
      <DualList itemKey="id"
                src={state.jira.lookupList.fields} size={4}
                dest={selectedValues} optionRenderer={optionRenderer} onChange={onChange}/>
    </section>
  </>);
};

const Columns = () => {
  return (
    <>
      <ColumnsLookup />
      <hr />
      <ColumnsReport />
    </>
  );
};

export default Columns;
