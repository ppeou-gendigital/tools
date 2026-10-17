import {useState} from 'react';
import {valueToLookupList} from '../../../services/jira';
import {useStore} from '../../../context/store';
import DualList from '../../../comps/dual-list/dual-list';
import {setJira} from '../../../context/store/action';

const IssueType = () => {
  const [state, dispatch] = useStore();
  const [selectedValues] = useState(state.jira.types || []);
  const lookupList = valueToLookupList(state.jira.lookupList.issueType);

  const onChange = (values) => {
    dispatch(setJira({types: values}));
  };

  const optionRenderer = ({name, id, stateKey}, idx) => <option key={idx} value={idx}>{name}</option>;

  return (
    <section>
      <h1>Issue Status</h1>
      <DualList itemKey="id" src={lookupList} size={4} dest={selectedValues} optionRenderer={optionRenderer} onChange={onChange}/>
    </section>
  );
};

export default IssueType;
