const fs = require('fs');

const distritosObj = JSON.parse(fs.readFileSync('distritos.json', 'utf8'));
const provinciasObj = JSON.parse(fs.readFileSync('provincias.json', 'utf8'));

const provinceIdToName = {};
for (const deptId in provinciasObj) {
  for (const prov of provinciasObj[deptId]) {
    provinceIdToName[prov.id_ubigeo] = prov.nombre_ubigeo;
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

const outFile = 'd:/JOSHUA PROYECTO/Frontend/src/utils/ubigeo_temp.js';
let content = 'export const districtsData = ' + JSON.stringify(districtsData, null, 2) + ';\n';
fs.writeFileSync(outFile, content);
console.log('Done mapping districts. File written to ' + outFile);
