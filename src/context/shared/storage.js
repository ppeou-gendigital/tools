const createStorage = (dbName, storageType) => {
  const db = window[storageType] || window.localStorage;
  const hasDB = () => !!db.getItem(dbName);
  const getDB = () => JSON.parse(db.getItem(dbName) || "{}");
  const setDB = (value) => db.setItem(dbName, JSON.stringify(value));

  const get = () => getDB();
  const has = () => hasDB();
  const set = (value) => setDB(value);
  const put = (key, value) => db.setItem(`${dbName}:${key}`, JSON.stringify(value));

  return { get, set, has, put, name: dbName};
};

export default createStorage;
