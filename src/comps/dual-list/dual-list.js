import './dual-list.scss';
import {useEffect, useRef, useState} from 'react';

const DualList = ({className, itemKey, src, size = 8, dest, optionRenderer, onChange}) => {
  const list1Ref = useRef();
  const list2Ref = useRef();
  const list1 = src;
  const [list2, setList2] = useState(dest);

  const onMoveFromList1ToList2 = () => {
    const elem = list1Ref.current;
    const selectedValues = Array.from(elem.selectedOptions).map(optionElem => src[optionElem.value]);
    setList2([...list2, ...selectedValues]);
  };

  const onMoveAllFromList1ToList2 = () => {
    const existingKeys = list2.reduce((p, item) => {
      p[item[itemKey]] = true;
      return p;
    }, {});

    console.log('existingKeys', existingKeys);

    setList2([...list2, ...src.filter((item) => !existingKeys[item[itemKey]])]);
  };

  const onRemoveFromList2 = () => {
    const elem = list2Ref.current;
    const selectedValues = Array.from(elem.selectedOptions).map((optionElem) => optionElem.value);
    setList2(list2.filter((_, idx) => !selectedValues.includes(`${idx}`)));
  };

  const onRemoveAllFromList2 = () => {
    setList2([]);
  };

  useEffect(() => {
    if(list2 !== dest) {
      if(onChange) {
        onChange(list2);
      }
    }
  }, [list2, dest]);

  return (
    <div className={`dual-list ${className || ''}`} >
      <div className="select is-multiple is-small">
        <select multiple={true} size={size} ref={list1Ref}>
          {list1.map(optionRenderer)}
        </select>
      </div>
      <div className=" buttons are-small">
        <button className=" button is-dark is-small" onClick={onMoveFromList1ToList2}>Add →</button>
        <button className=" button is-dark is-small" onClick={onMoveAllFromList1ToList2}>Add All → →</button>
        <button className=" button is-dark is-small" onClick={onRemoveFromList2}>← Remove</button>
        <button className=" button is-dark is-small" onClick={onRemoveAllFromList2}>← ← Remove All</button>
      </div>
      <div className="select is-multiple is-small">
        <select multiple={true} size={size} ref={list2Ref}>
          {list2.map(optionRenderer)}
        </select>
      </div>
    </div>
  );
};

export default DualList;
