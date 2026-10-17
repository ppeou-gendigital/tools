(() => {
  var COLUMNS = {
    STATUS: { id: "status", name: "Status" },
    ISSUE_TYPE: { id: "issuetype", name: "Type" },
    PRIORITY: { id: "priority", name: "Priority" },
    ISSUE_KEY: { id: "issuekey", name: "Issue Key" },
    SUMMARY: { id: "summary", name: "summary" },
    ASSIGNEE: { id: "assignee", name: "Assignee" },
    QA_ASSIGNEE: { id: "customfield_16064", name: "QA Assignee" },
    QA_DROP_DATE: { id: "customfield_20600", name: "QA Drop date" },
    STORY_POINTS: { id: "customfield_10008", name: "Story Points" },
    SUB_TASKS: { id: "subtasks", name: "Sub Tasks" },
    SUB_TASK: { id: "subtask", name: "Sub Task" },
    ORIGINAL_ESTIMATE: { id: "timeoriginalestimate", name: "Original Estimate" },
    REMAINING_ESTIMATE: { id: "timeestimate", name: "Remaining Estimate" },
    COMMENTS: { id: "comment", name: "Comments" },
    FLAGGED: { id: "customfield_10006", name: "Flagged" },
  };

  var fieldsForDataFetching = [
    COLUMNS.STATUS,
    COLUMNS.ISSUE_TYPE,
    COLUMNS.PRIORITY,
    COLUMNS.ISSUE_KEY,
    COLUMNS.SUMMARY,
    COLUMNS.ASSIGNEE,
    COLUMNS.QA_ASSIGNEE,
    COLUMNS.QA_DROP_DATE,
    COLUMNS.STORY_POINTS,
    COLUMNS.SUB_TASKS,
    COLUMNS.ORIGINAL_ESTIMATE,
    COLUMNS.REMAINING_ESTIMATE,
    COLUMNS.COMMENTS,
    COLUMNS.FLAGGED,
  ];

  var fieldsForReport = [
    COLUMNS.STATUS,
    COLUMNS.ISSUE_TYPE,
    COLUMNS.PRIORITY,
    COLUMNS.ISSUE_KEY,
    COLUMNS.SUMMARY,
    COLUMNS.ASSIGNEE,
    COLUMNS.QA_ASSIGNEE,
    COLUMNS.QA_DROP_DATE,
    COLUMNS.STORY_POINTS,
    COLUMNS.SUB_TASK,
    COLUMNS.ORIGINAL_ESTIMATE,
    COLUMNS.REMAINING_ESTIMATE,
    COLUMNS.COMMENTS,
  ];
  var fieldIdsForDataFetching = fieldsForDataFetching.map(({id}) => id).join(',');


  const getReportJqlQuery = ({projects, resolutions, sprints, types, status, orderBy, lookupList}) => {
    const columns = lookupList.fields;
    let sort = '';
    if(orderBy.length > 0) {
      sort = ` ORDER BY ${orderBy.map(({id, direction}) => `"${id}" ${direction}`).join(', ')}`;
    }

    const filters = [];
    if(projects.length > 0) {
      filters.push(`project in (${`"` + projects.map(({id}) => id).join(`","`) + `"`})`);
    }
    if(resolutions.length > 0) {
      filters.push(`resolution in (${`"` + resolutions.map(({id}) => id).join(`","`) + `"`})`);
    }
    if(sprints.length > 0) {
      filters.push(`Sprint in (${sprints.map(({id}) => id).join(`,`)})`);
    }
    if(types.length > 0) {
      filters.push(`issuetype in (${`"` + types.map(({id}) => id).join(`","`) + `"`})`);
    }
    if(status.length > 0) {
      filters.push(`status in (${`"` + status.map(({id}) => id).join(`","`) + `"`})`);
    }

    return [filters.join(' AND '), `${sort}`].join(' ');
  };

  const columnsApi = {
    base: new URL('https://jira.corp.nortonlifelock.com/rest/api/2/user/columns'),
    get: () => {
      return new Promise((resolve) => {
        fetch(columnsApi.base.toString())
          .then(r => r.text())
          .then(r => resolve({data: JSON.parse(r).map(({label:name, value: id}) => ({id,name}))}))
          .catch(r => resolve({error: r}));
      });
    },
    update: (columns) => {
      const payload = JSON.stringify({columns: columns.map(({id}) => id)});
      const headers = new Headers();
      headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
      headers.append('x-requested-with', 'XMLHttpRequest');
      headers.append('Content-Type', 'application/json');

      return new Promise((resolve) => {
        fetch(columnsApi.base.toString(), {method: "PUT", headers: headers, body: payload})
          .then(r => r.text())
          .then(r => resolve({data: r}))
          .catch(r => resolve({error: r}));
      });
    },
  };

  const reportApi = {
    base: new URL('https://jira.corp.nortonlifelock.com/sr/jira.issueviews:searchrequest-html-current-fields/temp/SearchRequest.html'),
    get: (params) => {
      return new Promise((resolve) => {
        reportApi.base.searchParams.set('jqlQuery', getReportJqlQuery(params));
        fetch(reportApi.base.toString())
          .then(r => r.text())
          .then(r => resolve({data: r}))
          .catch((error) => {
            console.error(error);
            resolve({error});
          });
      });
    },
  };

  const report = {
    search: async (params) => {
      //get current user's columns
      const {data: originalColumns} = await columnsApi.get();

      //set new columns for export
      await columnsApi.update(params.lookupList.fields);

      //get report
      const reportResult = await reportApi.get(params);

      //restore user's columns
      await columnsApi.update(originalColumns);

      return reportResult;
    }
  };

  //var {data: {total}} = await getAllJiraTicketsApi(`https://jira.corp.nortonlifelock.com/rest/api/2/search?jql=${encodeURIComponent('project=WEBEXP AND sprint=264156')}&fields=status&maxResults=1`);
  const reportComment = {
    base: new URL('https://jira.corp.nortonlifelock.com/rest/api/2/search'),
    get: (params, fields, maxResults) => {
      return new Promise((resolve) => {
        reportComment.base.searchParams.set('jql', getReportJqlQuery(params));
        reportComment.base.searchParams.set('fields', fields);
        reportComment.base.searchParams.set('maxResults', maxResults);
        fetch(reportComment.base.toString())
          .then(r => r.text())
          .then(r => resolve({data: JSON.parse(r)}))
          .catch((error) => {
            console.error(error);
            resolve({error});
          });
      });
    },
    search: async (params) => {
      const {data: {total}} = await reportComment.get(params, 'status', 1);
      const {data} = await reportComment.get(params, fieldIdsForDataFetching, total);
      return {data};
    },
  };


  const port = chrome.runtime.connect({name: "channel001"});
  port.postMessage({type: 'channel::main::established', detail: {time: new Date().getTime()}});
  port.onMessage.addListener(({type, detail}) => {
    if(type === 'channel::report::get') {
      report.search(detail).then(r => {
        port.postMessage({type: 'channel::report::result', detail: r});
      })
    } else if(type === 'channel::report-comment::get') {
      reportComment.search(detail).then(r => {
        port.postMessage({type: 'channel::report-comment::result', detail: r});
      })
    }
  });
})();
