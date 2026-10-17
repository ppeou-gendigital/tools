import {useStore} from '../../../context/store';
import {useState} from 'react';
import JiraService from '../../../services/jira';
import DualList from '../../../comps/dual-list/dual-list';
import {setJira} from '../../../context/store/action';

const Users = () => {
  const [state, dispatch] = useStore();
  const [result, setResult] = useState([]);
  const [selectedValues] = useState(state.jira.users || []);
  const [inputValue, setInputValue] = useState('');

  const getDisplayName = (string) => {
    const all = string.replaceAll(/<[^>]*>/ig, '').split(' (');
    all.pop();
    return all.join(' (');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const doSearch = () => {
    JiraService.user.search(inputValue).then(r => {
      setResult([...r.data]);
    });
  };

  const onChange = (values) => {
    dispatch(setJira({users: values}));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.length > 0) {
      doSearch()
    }
  };

  const optionRenderer = ({id, name, displayName}, idx) => <option  key={idx} value={idx}>{displayName || name}</option>;

  return (
    <section>
      <h1>Users</h1>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input className="input" type="text" placeholder="Enter text here" value={inputValue} onChange={handleInputChange}
                 onKeyDown={onKeyDown}/>
        </div>
        <div className="control">
          <button className="button is-dark" onClick={doSearch} disabled={!inputValue}>Search</button>
        </div>
      </div>
      <DualList className="user-list" itemKey="name" src={result} size={8} dest={selectedValues} optionRenderer={optionRenderer} onChange={onChange}/>
    </section>
  );
};

export default Users;
