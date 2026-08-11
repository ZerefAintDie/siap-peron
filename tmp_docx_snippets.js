const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const file = process.argv[2] || 'public/templates/template_kelahiran.docx';
const p = path.resolve(file);
console.log('FILE', file, '->', p);
const content = fs.readFileSync(p, 'binary');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();
const regex = /\{\{([^}]+?)\}\}/g;
let m;
let idx = 0;
while ((m = regex.exec(xml)) && idx < 10) {
  const start = Math.max(0, m.index - 120);
  const end = Math.min(xml.length, regex.lastIndex + 120);
  console.log('---');
  console.log('match', idx, m[0]);
  console.log(xml.slice(start, end).replace(/\n/g, '\\n'));
  idx++;
}
console.log('TOTAL matches', [...xml.matchAll(regex)].length);
console.log('RAW open count', (xml.match(/\{\{/g) || []).length);
console.log('RAW close count', (xml.match(/\}\}/g) || []).length);
