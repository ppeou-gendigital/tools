import {useStore} from '../../../context/profile';
import {setA11y} from '../../../context/profile/action';

const A11y = () => {
  const [{a11y}, dispatch] = useStore();

  const onFontSizeChange = (e) => {
    dispatch(setA11y({fontSize: e.currentTarget.value}));
  };

  return (<section className="content is-normal">
    <h1>Accessibility</h1>
    <div className="fixed-grid">
      <div className="grid" style={{gridTemplateColumns: '1fr auto'}}>
        <div className="cell">Font Size</div>
        <div className="cell select is-small">
          <select onChange={onFontSizeChange} value={a11y.fontSize}>
            <option value="16px">Default (16px)</option>
            <option value="20px">Large (20px)</option>
            <option value="24px">Extra Large (24px)</option>
          </select>
        </div>
      </div>
    </div>
  </section>);
};


export default A11y;
