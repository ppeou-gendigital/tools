import {useState} from 'react';
import JiraService from '../../../services/jira';
import {useStore} from '../../../context/store';
import DualList from '../../../comps/dual-list/dual-list';
import {setJira} from '../../../context/store/action';

const Sprints = () => {
  const [state, dispatch] = useStore();
  const [result, setResult] = useState([]);
  const [selectedValues] = useState(state.jira.sprints || []);
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const doSearch = () => {
    JiraService.sprint.search(inputValue).then(r => {
      setResult([...r.data]);
    });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.length > 0) {
      doSearch()
    }
  };


  const onChange = (values) => {
    dispatch(setJira({sprints: values}));
  };

  const optionRenderer = ({name, id, stateKey}, idx) => <option key={idx} value={idx}>{name}</option>;

  return (
    <section>
      <h1>Sprints</h1>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input className="input" type="text" placeholder="Enter text here" value={inputValue} onChange={handleInputChange}
                 onKeyDown={onKeyDown}/>
        </div>
        <div className="control">
          <button className="button is-dark" onClick={doSearch} disabled={!inputValue}>Search</button>
        </div>
      </div>
      <DualList itemKey="id" src={result} size={8} dest={selectedValues} optionRenderer={optionRenderer}
                onChange={onChange}/>
    </section>
  );
};

export default Sprints;
