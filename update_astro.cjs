const fs = require('fs');
const path = 'd:/JOSHUA PROYECTO/Frontend/src/pages/index.astro';
let content = fs.readFileSync(path, 'utf8');

// Find start of process-cards
const startStr = '<div class="process-cards stagger-container">';
const startIndex = content.indexOf(startStr);
if (startIndex === -1) { console.error('Start not found'); process.exit(1); }

// Find end of process-cards
const sectionEndStr = '  </section>\r\n\r\n  <!-- Carrusel de Bancos';
let sectionEndIndex = content.indexOf(sectionEndStr);
if (sectionEndIndex === -1) { 
    const sectionEndStrUnix = '  </section>\n\n  <!-- Carrusel de Bancos';
    sectionEndIndex = content.indexOf(sectionEndStrUnix);
}

if (sectionEndIndex === -1) { console.error('End not found'); process.exit(1); }

// The end of the process-cards div is right before </section>
const sectionEndContent = content.substring(0, sectionEndIndex);
const cardsEndIndex = sectionEndContent.lastIndexOf('    </div>');

const before = content.substring(0, startIndex);
const cardsContent = content.substring(startIndex + startStr.length, cardsEndIndex);
const after = content.substring(cardsEndIndex + 10); // skip '    </div>'

const newContent = before + 
  '<div class="process-carousel-container">\n' +
  '    <div class="process-cards stagger-container">\n' +
  '      {[1, 2].map(() => (\n' +
  '        <Fragment>\n' +
  cardsContent +
  '        </Fragment>\n' +
  '      ))}\n' +
  '    </div>\n' +
  '  </div>' +
  after;

fs.writeFileSync(path, newContent);
console.log('Successfully updated index.astro');
