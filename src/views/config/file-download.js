import {pushToDownload} from '../../services/download/download';

const FileDownload = ({className, label,title, fileName, fileContent}) => {


  const onClick = () => {
    pushToDownload({name: fileName, data: fileContent});
  };

  return (<button className={className ? className : 'button is-small is-black'} title={title} onClick={onClick}>{label}</button>)
};

export default FileDownload
