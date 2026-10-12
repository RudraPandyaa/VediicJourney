const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Sumit\\VediicJourney-Client\\app';
const pagesDest = path.join(basePath, 'pages', 'destinations');
const dataDest = path.join(basePath, 'data');

const europeIndex = fs.readFileSync(path.join(pagesDest, 'europe', 'index.vue'), 'utf-8');
const europeId = fs.readFileSync(path.join(pagesDest, 'europe', '[id].vue'), 'utf-8');

const targets = [
  { id: 'africa', title: 'Africa', upper: 'AFRICA', camel: 'africa', dataVar: 'africaData' },
  { id: 'asia', title: 'Asia', upper: 'ASIA', camel: 'asia', dataVar: 'asiaData' },
  { id: 'south-america', title: 'South America', upper: 'SOUTH AMERICA', camel: 'southAmerica', dataVar: 'southAmericaData' },
  { id: 'north-america', title: 'North America', upper: 'NORTH AMERICA', camel: 'northAmerica', dataVar: 'northAmericaData' },
  { id: 'australia', title: 'Australia', upper: 'AUSTRALIA', camel: 'australia', dataVar: 'australiaData' },
];

function camelize(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

for (const target of targets) {
  const targetDir = path.join(pagesDest, target.id);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // replace europe strings
  let newIndex = europeIndex
    .replace(/europeData/g, target.dataVar)
    .replace(/europe/g, target.id)
    .replace(/Europe/g, target.title)
    .replace(/EUROPE/g, target.upper);

  let newId = europeId
    .replace(/europeData/g, target.dataVar)
    .replace(/europe/g, target.id)
    .replace(/Europe/g, target.title)
    .replace(/EUROPE/g, target.upper);

  fs.writeFileSync(path.join(targetDir, 'index.vue'), newIndex, 'utf-8');
  fs.writeFileSync(path.join(targetDir, '[id].vue'), newId, 'utf-8');
  
  // Now handle data files
  const dataFile = path.join(dataDest, target.dataVar + '.ts');
  if (!fs.existsSync(dataFile)) {
    // create by copying europeData and replacing
    const europeData = fs.readFileSync(path.join(dataDest, 'europeData.ts'), 'utf-8');
    const newData = europeData
      .replace(/europeData/g, target.dataVar)
      .replace(/europe/g, target.id)
      .replace(/Europe/g, target.title);
    fs.writeFileSync(dataFile, newData, 'utf-8');
  } else {
    // if exists (e.g. asiaData.ts, africaData.ts) just try to make sure they export the correct var
    let currentData = fs.readFileSync(dataFile, 'utf-8');
    if (target.id === 'asia') {
      currentData = currentData.replace(/export const statesData/g, 'export const asiaData');
      fs.writeFileSync(dataFile, currentData, 'utf-8');
    }
  }
}

console.log('Done!');
