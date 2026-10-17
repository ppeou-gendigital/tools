const pushToDownload = ({name, mime, data}) => {
  let _mime = mime || 'text/plain;charset=utf-8;';
  const placeholder = document.body;
  const text = JSON.stringify(data);
  const blob = new Blob([text], {type: _mime});
  const fileData = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', fileData);
  link.setAttribute('download', name);
  placeholder.appendChild(link);
  link.click();
  placeholder.removeChild(link);
};

export {pushToDownload};
