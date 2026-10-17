const createFileService = (dbName) => {
  const db = window.localStorage;
  const getFullName = (name) => `${dbName}:${name}`;
  const save = (name, value) => db.setItem(getFullName(name), JSON.stringify(value));
  const load = (name)  => JSON.parse(db.getItem(getFullName(name) || null));
  const remove = (name) => db.removeItem(getFullName(name));

  return {save, load, remove, getFileIdByName: getFullName};
};

const FileService = createFileService('jce-file');

export default FileService;
