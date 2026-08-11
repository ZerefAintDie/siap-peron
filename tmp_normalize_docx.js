const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function normalizePlaceholderXml(xml) {
  return xml.replace(/\{\{([\s\S]*?)\}\}/g, (_, content) => {
    const cleaned = content.replace(/<[^>]+>/g, '');
    return '{{' + cleaned.trim() + '}}';
  });
}

const files = ['public/templates/template_kelahiran (1).docx', 'public/templates/template_kelahiran.docx'];
for (const file of files) {
  const p = path.resolve(file);
  console.log('FILE:', file);
  const content = fs.readFileSync(p, 'binary');
  const zip = new PizZip(content);
  const original = zip.file('word/document.xml').asText();
  const normalized = normalizePlaceholderXml(original);
  if (original !== normalized) {
    console.log('  normalized placeholders');
    zip.file('word/document.xml', normalized);
  } else {
    console.log('  no normalization needed');
  }
  try {
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render({ nama_kepala_keluarga: 'test', nomor_kk: '123' });
    console.log('  render OK');
  } catch (e) {
    console.log('  render ERROR');
    console.log(e && e.message ? e.message.split('\n')[0] : e);
  }
}
