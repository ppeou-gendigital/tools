import {useState} from 'react';
import {valueToLookupList} from '../../../services/jira';
import {useStore} from '../../../context/store';
import DualList from '../../../comps/dual-list/dual-list';
import {setJira} from '../../../context/store/action';

const IssueStatus = () => {
  const [state, dispatch] = useStore();
  const [selectedValues] = useState(state.jira.status);
  const lookupList = valueToLookupList(state.jira.lookupList.issueStatus);

  const onChange = (values) => {
    dispatch(setJira({status: values}));
  };

  const optionRenderer = ({name, id, stateKey}, idx) => <option key={idx} value={idx}>{name}</option>;

  return (
    <section>
      <h1>Issue Status</h1>
      <DualList itemKey="id" src={lookupList} size={4} dest={selectedValues} optionRenderer={optionRenderer} onChange={onChange}/>
    </section>
  );
};

export default IssueStatus;
