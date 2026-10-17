import {useRef} from 'react';

const FileUpload = ({label, onChange}) => {
  const elemRef= useRef(null);

  const validateJSONFileContent = (text) => {
    let file = false;
    try {
      file = JSON.parse(text);
      /*let count = 0;

      if(file) {
        if(file.app) {count++;}
        if(file.jira) {
          count++;
          if(file.jira.lookupList) {
            count++;
            if(file.jira.lookupList.issueStatus) {count++;}
            if(file.jira.lookupList.issueType) {count++;}
          }
          if(file.jira.sprints) {count++;}
          if(file.jira.status) {count++;}
          if(file.jira.types) {count++;}
          if(file.jira.users) {count++;}
        }
      }
      file =  count === 9 ? file : false;*/
    } catch (e) {
      console.log('unable to validate file', e);
    }
    return file;
  };

  const onFileChange = (e, callback) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = ((_file) => {
      const fileAttributes = ['lastModified', 'lastModifiedDate', 'name', 'size', 'type'];
      const fileInfo = fileAttributes.reduce((p, f) => {
        p[f] = _file[f];
        return p;
      }, {});
      return (e) => {
        callback({...fileInfo, data: e.target.result});
      };
    })(file);

    reader.readAsText(file);
  };

  const onUploadComplete = (e) => {
    const {data, ...rest} = e;
    const file = validateJSONFileContent(e.data);
    if(file) {
      onChange({value: file, info: rest});
    }
  };

  const onUploadClick = () => {
    const placeholder = document.body;
    const elementId = `file-input-${new Date().getTime()}`;
    const element = document.createElement('input');
    element.setAttribute('id', elementId);
    element.setAttribute('type', 'file');
    element.setAttribute('accept', '.json');
    element.style.display = 'none';
    placeholder.appendChild(element);
    element.click();
    const onChange = (e) => {
      onFileChange(e, onUploadComplete);
      const element = document.getElementById(elementId);
      element.removeEventListener('change', onChange);
      element.remove();
    };
    element.addEventListener('change', onChange);
  };

  return (
    <div ref={elemRef}>
      <button className="button is-small is-black" onClick={onUploadClick}>{label}</button>
    </div>
  );
};
export default FileUpload;
