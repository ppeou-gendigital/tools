import {useState} from 'react';
import {valueToLookupList} from '../../../services/jira';
import {useStore} from '../../../context/store';
import DualList from '../../../comps/dual-list/dual-list';
import {setJira} from '../../../context/store/action';

const Resolutions = () => {
  const [state, dispatch] = useStore();
  const [selectedValues] = useState(state.jira.resolutions || []);
  const lookupList = valueToLookupList(state.jira.lookupList.resolutions);

  const onChange = (values) => {
    dispatch(setJira({resolutions: values}));
  };

  const optionRenderer = ({id, name}, idx) => <option key={idx} value={idx}>{name}</option>;

  return (
    <section>
      <h1>Project</h1>
      <DualList itemKey="id" src={lookupList} size={2} dest={selectedValues} optionRenderer={optionRenderer} onChange={onChange}/>
    </section>
  );
};

export default Resolutions;
