import data from './mock';

const sprint = {
  base: new URL('https://jira.corp.nortonlifelock.com/rest/greenhopper/1.0/sprint/picker?excludeCompleted=false&maxResults=28'),
  search: (text) => {
    sprint.base.searchParams.set('query', text);
    return new Promise((resolve) => {
      fetch(sprint.base.toString())
        .then((r) => r.text())
        .then((r) => {
          const response = JSON.parse(r);
          const masterList = [ ...response.allMatches, ...response.suggestions];
          let data = [];
          if(masterList) {
            data = masterList.map(a => ({...a, datetime: new Date(a.date.replace('00:0Z', '00'))}))
              .sort((a,b) => a.datetime.getTime() - b.datetime.getTime())
              .map(({id, name}) => ({id, name}));
          }
          //.map(a => ({...a, datetime: new Date(a.date.replace('00:0Z', '00'))})).sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
          resolve({data});
        })
        .catch((error) => resolve({error}));
    });
  }
};

const getDisplayName = (string) => {
  const all = string.replaceAll(/<[^>]*>/ig, '').split(' (');
  all.pop();
  return all.join(' (');
};

const user = {
  base: new URL('https://jira.corp.nortonlifelock.com/rest/api/latest/groupuserpicker?showAvatar=true'),
  search: (text) => {
    user.base.searchParams.set('query', text);
    return new Promise((resolve) => {
      fetch(user.base.toString())
        .then((r) => r.text())
        .then((r) => {
          const response = JSON.parse(r);
          let data = [];
          if(response.users.users) {
            data = response.users.users.map(({name: id, displayName: name, html: displayName, avatarUrl: icon}) => ({id, name, displayName: getDisplayName(displayName), icon}))
          }

          resolve({data});

        })
        .catch((error) => resolve({error}));
    })
  }
};

const columns = {
  base: new URL('https://jira.corp.nortonlifelock.com/rest/gadget/1.0/availableColumns'),
  cachedData: undefined,
  filter: (data, text) => {
    const token = new RegExp(text, 'i');
    return data.filter(({label, value}) => token.test(label) || token.test(value))
      .map(({label: name, value: id}) => ({id, name}));

  },
  search: (text) => {
    return new Promise((resolve) => {
      if(!columns.cachedData) {
        fetch('https://jira.corp.nortonlifelock.com/rest/gadget/1.0/availableColumns?_=1748660289609')
          .then(r => r.text())
          .then(r => {
            columns.cachedData = JSON.parse(r).availableColumns;
            resolve({data: columns.filter(columns.cachedData, text)});
          })
          .catch(e => console.log(e));
      } else {
        resolve({data: columns.filter(columns.cachedData, text)});
      }

    })
  }
};
/*
const columns = {
  base: new URL('https://jira.corp.nortonlifelock.com/rest/gadget/1.0/availableColumns'),
  cachedData: undefined,
  search: (text) => {
    return new Promise((resolve) => {
      if(!columns.cachedData) {
        columns.cachedData = JSON.parse(data.columns);
      }
      const token = new RegExp(text, 'i');
      const results = columns.cachedData.availableColumns
        .filter(({label, value}) => token.test(label) || token.test(value))
        .map(({label: name, value: id}) => ({id, name}));
      setTimeout(() => {
        resolve({data: results});
      }, 100);
    })
  }
};

const sprint = {
  base: new URL('https://jira.corp.nortonlifelock.com/rest/greenhopper/1.0/sprint/picker?excludeCompleted=false&maxResults=26'),
  search: (text) => {
    sprint.base.searchParams.set('query', text);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({data: JSON.parse(data.sprint.replaceAll('WebExp2025', `${text}WebExp2025`))});
      }, 100);
    })
  }
};

const user = {
  base: new URL('https://jira.corp.nortonlifelock.com/rest/api/latest/groupuserpicker?showAvatar=true'),
  search: (text) => {
    user.base.searchParams.set('query', text);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({data: JSON.parse(data.user)});
      }, 100);
    })
  }
};*/

const getReportJqlQuery = ({projects, sprints, types, status, orderBy, columns}) => {
  let sort = '';
  if(orderBy.length > 0) {
    sort = ` ORDER BY ${orderBy.map(({id, direction}) => `${id} ${direction}`).join(', ')}`;
  }
  const report = `project in (${`"` + projects.map(({id}) => id).join(`","`) + `"`}) 
          AND issuetype in (${`"` + types.map(({id}) => id).join(`","`) + `"`}) 
          AND status in (${`"` + status.map(({id}) => id).join(`","`) + `"`}) 
          AND Sprint in (${`"` + sprints.map(({id}) => id).join(`","`) + `"`}) 
          ${sort}`;
  const _columns =  JSON.stringify({columns: columns.map(({id}) => id)});

  return {report, columns: _columns};
};

const report = {
  reportBase: new URL('https://jira.corp.nortonlifelock.com/sr/jira.issueviews:searchrequest-html-current-fields/temp/SearchRequest.html'),
  columnsBase: new URL('https://jira.corp.nortonlifelock.com/rest/api/2/user/columns'),
    //+`project = WEBEXP AND issuetype in (Bug, "User Story", Sub-task) AND status in ("In Progress", Open, Ready) AND resolution = Unresolved AND Sprint = 264165 ORDER BY "QA Drop Date" ASC, priority DESC, key ASC`),
    //project = WEBEXP AND issuetype in (Bug, "User Story", Sub-task) AND status in ("In Progress", Open, Ready) AND resolution = Unresolved AND Sprint = 264165 ORDER BY "QA Drop Date" ASC, priority DESC, key ASC
  search: (params) => {
    const {report: reportUrl, columns: columnsUrl} = getReportJqlQuery(params);

    report.reportBase.searchParams.set('jqlQuery', reportUrl);
    console.log(report.reportBase.toString());
    console.log(report.columnsBase.toString(), columnsUrl);

    const headers = new Headers();
    headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
    headers.append('x-requested-with', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/json');

    return new Promise((resolve) => {
      fetch(report.columnsBase.toString(), {method: "PUT", headers: headers, body: columnsUrl})
        .then((r1) => r1.text())
        .then((r1) => {
          console.log(r1);

          fetch(report.reportBase.toString())
            .then(r2 => r2.text())
            .then(r2 => {
              var parser = new DOMParser();
              var xmlDoc = parser.parseFromString(r2,"text/html");
              console.log(xmlDoc);

              var table = xmlDoc.getElementById('issuetable');
              console.log(table);
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));

      resolve(user.base.toString());
      /*setTimeout(() => {
        resolve({data: JSON.parse(data.user)});
      }, 100);*/
    })
  }
};

const valueToLookupList = (values) => values.map(key => ({id: key, name: key}));

const JiraService = {sprint, user, report, columns};
export {valueToLookupList, getReportJqlQuery};
export default JiraService;
