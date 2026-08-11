const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const files = ['public/templates/template_kelahiran (1).docx','public/templates/template_kelahiran.docx'];
for (const file of files) {
  const p = path.resolve(file);
  console.log('FILE:', file);
  try {
    const zip = new AdmZip(p);
    const xml = zip.readAsText('word/document.xml');
    console.log('  word/document.xml length:', xml.length);
    const matches = [...xml.matchAll(/\{\{([^}]+)\}\}/g)];
    console.log('  placeholder count:', matches.length);
    matches.slice(0, 20).forEach((m, i) => console.log(`    ${i}: ${m[0]}`));
    if (matches.length > 20) console.log('    ...');
    const bad = [...xml.matchAll(/\{\{|\}\}/g)];
    console.log('  raw delimiter count:', bad.length);
    console.log('');
  } catch (e) {
    console.error('  ERROR:', e && e.message ? e.message : e);
  }
}
