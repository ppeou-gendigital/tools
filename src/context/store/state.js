const jira = {
  projects: [],
  resolutions: [],
  sprints: [],
  types: [],
  status: [],
  columns: [],
  users: [],
  orderBy: [],
  lookupList: {
    projects: [], resolutions: [], issueStatus: [], issueType: [], fields: []
  }
};

const initialState = {
  jira,
};

export default initialState;
