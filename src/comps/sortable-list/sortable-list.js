import './sortable-list.scss';
import {useEffect, useState} from 'react';

const moveElement = (srcArr, fromIndex, toIndex) => {
  const arr = [...srcArr];
  const element = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, element);
  return arr;
}


const SortableList = ({label, items, onChange, size}) => {

  const [list, setList] = useState(items);
  const [selectedIndex, setSelectedIndex ] = useState(0);

  const onSelect = (e) => {
    setSelectedIndex(e.target.value);
    /*const li = e.currentTarget;
    setSelectedIndex(Number(li.dataset.nth));*/
  };

  useEffect(() => {
    onChange(list);
  }, [list]);

  const moveTop = () => {
    const newIndex = 0;
    if(selectedIndex > newIndex) {
      setList(moveElement(list, selectedIndex, newIndex));
      setSelectedIndex(newIndex);
    }
  };
  const moveUp = () => {
    if(selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setList(moveElement(list, selectedIndex, newIndex));
      setSelectedIndex(newIndex);
    }
  };

  const moveDown = () => {
    if(selectedIndex < list.length - 1) {
      const newIndex = selectedIndex + 1;
      setList(moveElement(list, selectedIndex, newIndex));
      setSelectedIndex(newIndex);
    }
  };
  const moveBottom = () => {
    const newIndex = list.length - 1;
    if(selectedIndex < newIndex) {
      setList(moveElement(list, selectedIndex, newIndex));
      setSelectedIndex(newIndex);
    }
  };

  return (
    <div className="sortable-list">
      <label>{label}</label>
      <div className="sortable-list__controls">
        <button className=" button is-dark is-small" onClick={moveTop}>↑↑ top</button>
        <button className=" button is-dark is-small" onClick={moveUp}>↑ up</button>
        <button className=" button is-dark is-small" onClick={moveDown}>↓ down</button>
        <button className=" button is-dark is-small" onClick={moveBottom}>↓↓ bottom</button>
      </div>
      <div className="select is-multiple is-small">
        <select size={list.length > size ? size : list.length} value={selectedIndex} onChange={onSelect} data-abc={selectedIndex}>
          {list.map((item, idx) => (
            <option key={idx} data-id={item.id} value={idx}>{item.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortableList
