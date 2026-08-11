const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const files = ['public/templates/template_kelahiran (1).docx', 'public/templates/template_kelahiran.docx'];
for (const file of files) {
  const p = path.resolve(file);
  console.log('FILE:', file);
  try {
    const content = fs.readFileSync(p, 'binary');
    const zip = new PizZip(content);
    const xml = zip.file('word/document.xml').asText();
    console.log('  word/document.xml length:', xml.length);
    const placeholders = [...xml.matchAll(/\{\{[^}]+\}\}/g)];
    console.log('  placeholder count:', placeholders.length);
    console.log('  first placeholders:', placeholders.slice(0, 20).map(m => m[0]));
    const raw = [...xml.matchAll(/\{\{|\}\}/g)];
    console.log('  raw delimiter count:', raw.length);
  } catch (e) {
    console.error('  ERROR:', e && e.message ? e.message : e);
  }
}
