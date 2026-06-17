const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching...');
  const departamentosObj = await fetchJson('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/departamentos.json');
  const provinciasObj = await fetchJson('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/provincias.json');
  const distritosObj = await fetchJson('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/distritos.json');
  
  // Create mapping from department id_ubigeo (e.g., '2534') to its numeric code (e.g., '1')
  const deptIdToCode = {};
  for (const dept of departamentosObj) {
    deptIdToCode[dept.id_ubigeo] = parseInt(dept.codigo_ubigeo, 10).toString();
  }

  const provincesData = {};
  const provinceIdToName = {};
  
  for (const deptId in provinciasObj) {
    const numDeptId = deptIdToCode[deptId];
    if (!numDeptId) continue;
    
    provincesData[numDeptId] = [];
    for (const prov of provinciasObj[deptId]) {
      provinceIdToName[prov.id_ubigeo] = prov.nombre_ubigeo;
      provincesData[numDeptId].push(prov.nombre_ubigeo);
    }
  }

  const districtsData = {};
  for (const provId in distritosObj) {
    const provName = provinceIdToName[provId];
    if (!provName) continue;
    
    if (!districtsData[provName]) {
      districtsData[provName] = [];
    }
    for (const dist of distritosObj[provId]) {
      districtsData[provName].push(dist.nombre_ubigeo);
    }
  }

  const outFile = 'd:/JOSHUA PROYECTO/Frontend/src/utils/ubigeo.js';
  
  let content = 'export const provincesData = ' + JSON.stringify(provincesData, null, 2) + ';\n\n';
  content += 'export const districtsData = ' + JSON.stringify(districtsData, null, 2) + ';\n';
  fs.writeFileSync(outFile, content);
  console.log('Done mapping ' + Object.keys(districtsData).length + ' provinces.');
}

main();
