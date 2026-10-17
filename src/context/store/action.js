import ACTION_TYPE from './action-type';

const setJira =  (payload) => ({ type: ACTION_TYPE.JIRA.set, payload });
const setJiraLookupList =  (payload) => ({ type: ACTION_TYPE.JIRA.setLookup, payload });
const setApp =  (payload) => ({ type: ACTION_TYPE.APP.set, payload });
const setUpload =  (payload) => ({ type: ACTION_TYPE.UPLOAD.set, payload });

export {setApp, setJira, setUpload, setJiraLookupList};
