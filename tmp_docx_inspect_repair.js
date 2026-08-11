const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function repairPlaceholders(xml) {
  let out = '';
  let i = 0;
  while (i < xml.length) {
    if (xml[i] === '{' && xml[i+1] === '{') {
      out += '{{';
      i += 2;
      let buffer = '';
      while (i < xml.length) {
        if (xml[i] === '}' && xml[i+1] === '}') {
          const cleaned = buffer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          out += cleaned + '}}';
          i += 2;
          break;
        }
        if (xml[i] === '<') {
          while (i < xml.length && xml[i] !== '>') i++;
          if (i < xml.length) i++;
          continue;
        }
        buffer += xml[i];
        i++;
      }
      continue;
    }
    out += xml[i];
    i++;
  }
  return out;
}

const file = process.argv[2] || 'public/templates/template_kelahiran (1).docx';
const abs = path.resolve(file);
const zip = new PizZip(fs.readFileSync(abs, 'binary'));
const xml = zip.file('word/document.xml').asText();
const repaired = repairPlaceholders(xml);

const names = ['nama_bayi', 'jenis_kelamin', 'tanggal_lahir', 'jam_lahir', 'jenis_kelahiran', 'panjang_bayi', 'nik_ibu', 'alamat_ibu'];
for (const name of names) {
  const idx = repaired.indexOf(`{{ ${name} }}`);
  if (idx !== -1) {
    console.log('FOUND repaired', name, 'at', idx);
    console.log(repaired.slice(Math.max(0, idx-80), idx+80).replace(/\n/g,'\n'));
  }
}

const sample = repaired.slice(0, 1000);
console.log('SAMPLE', sample.replace(/\n/g,'\n'));
console.log('ORIG COUNT', (xml.match(/\{\{/g) || []).length, (xml.match(/\}\}/g) || []).length);
console.log('REPAIRED COUNT', (repaired.match(/\{\{/g) || []).length, (repaired.match(/\}\}/g) || []).length);
