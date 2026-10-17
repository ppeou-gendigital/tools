import {copyFormattedText} from './helper';

const roundFloatToTwo = (num) => {
  if (typeof num === 'number' && !Number.isInteger(num)) {
    return Math.round(num * 100) / 100;
  }
  return num; // Return the number as is if it's not a float
};

const stringSecondToTimeConverter = (str) => {
  if (str) {
    const timeInSecond = Number(str);
    return roundFloatToTwo(timeInSecond / 3600);
  }
  return str;
};

const cellValueExtractors = {
  default: (cell) => cell.textContent.trim(),
  issuekey: (cell) => cell.innerHTML,
  timeoriginalestimate: (cell) => stringSecondToTimeConverter(cell.textContent.trim()),
  timeestimate: (cell) => stringSecondToTimeConverter(cell.textContent.trim()),
};

const aggregateSubTaskAssignee = (items) => {
  return Object.values(items).reduce((p, {assignee, timeestimate}) => {
    if (!p[assignee]) {
      p[assignee] = 0;
    }
    timeestimate && (p[assignee] += timeestimate);

    if (p[assignee] === 0) {
      p[assignee] = '';
    }
    return p;
  }, {});
};

const createTable = (columns, data) => new DOMParser().parseFromString(`
<table>
    <thead>
        <tr>${columns.map(({name}) => '<td>' + name + '</td>').join('')}</tr>
    </thead>
    <tbody>
    ${data.map((row) => '<tr>' +
  columns.map(({id: field}) => '<td>' + (row[field] || '') + '</td>').join('')
  + '</tr>').join('')}
    </tbody>
</tbody>
</thead>
</table>
`, 'text/html').querySelector('table');

const convertReport = async (txt, {columns, users}) => {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(txt, 'text/html');

  var table = xmlDoc.getElementById('issuetable');

  const [data, issueKeyWithSubTask] = Array.from(table.tBodies[0].rows).reduce(([p, z], tr, nth) => {
    const {issuekey} = tr.dataset;
    const parentIssueKey = tr.querySelector('.parentIssue')?.textContent.trim();

    const data = Array.from(tr.cells).reduce((p2, td) => {
      const extractor = cellValueExtractors[td.className] || cellValueExtractors.default;
      p2[td.className] = extractor(td);
      return p2;
    }, {nth, parentIssueKey});

    if (parentIssueKey) {
      z[parentIssueKey] = true;
      if (!p[parentIssueKey]) {
        p[parentIssueKey] = {};
      }
      if (!p[parentIssueKey].items) {
        p[parentIssueKey].items = {};
      }
      p[parentIssueKey].items[issuekey] = data;
    } else {
      p[issuekey] = Object.assign({}, data, p[issuekey]);
    }
    return [p, z];

  }, [{}, {}]);

  Object.keys(issueKeyWithSubTask).forEach((issueKey) => {
    const tr = data[issueKey];
    Object.assign(tr, aggregateSubTaskAssignee(tr.items));
  }, {});

  const zz = Object.values(data).sort((a, b) => a.nth - b.nth).map(a => a);

  const fields = [...columns, ...users.map(({name}) => ({id: name, name,}))];


  const newTable = createTable(fields, zz);
  console.log(newTable);
  await copyFormattedText(newTable.outerHTML);
  return newTable;
};

export default convertReport;
