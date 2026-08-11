const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function normalizeDocxXml(xml) {
  // Remove proofErr markers and any no-op tags that break placeholder parsing.
  let cleaned = xml.replace(/<w:proofErr[^>]*>.*?<\/w:proofErr>/gis, '');
  cleaned = cleaned.replace(/<w:proofErr[^>]*\/>/gis, '');

  const result = [];
  let i = 0;
  const len = cleaned.length;
  while (i < len) {
    if (cleaned[i] === '{' && cleaned[i + 1] === '{') {
      // Found placeholder start
      const start = i;
      let depth = 0;
      const placeholderText = [];
      const innerNodes = [];
      let j = i;
      while (j < len) {
        if (cleaned[j] === '{' && cleaned[j + 1] === '{') {
          depth += 1;
          placeholderText.push('{{');
          j += 2;
          continue;
        }
        if (cleaned[j] === '}' && cleaned[j + 1] === '}') {
          depth -= 1;
          placeholderText.push('}}');
          j += 2;
          if (depth === 0) break;
          continue;
        }
        if (cleaned[j] === '<') {
          // collect tag boundaries and skip them in the placeholder text
          const tagStart = j;
          while (j < len && cleaned[j] !== '>') j++;
          if (j < len) j++;
          innerNodes.push(cleaned.slice(tagStart, j));
          continue;
        }
        placeholderText.push(cleaned[j]);
        j += 1;
      }

      if (depth === 0) {
        const text = placeholderText.join('')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        result.push(text);
        i = j;
        continue;
      }
    }
    result.push(cleaned[i]);
    i += 1;
  }
  return result.join('');
}

function repairFile(filePath, outputPath) {
  const absPath = path.resolve(filePath);
  const content = fs.readFileSync(absPath, 'binary');
  const zip = new PizZip(content);
  const xml = zip.file('word/document.xml').asText();
  const repaired = normalizeDocxXml(xml);
  zip.file('word/document.xml', repaired);
  const output = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outputPath, output);
  return outputPath;
}

const files = ['public/templates/template_kelahiran.docx','public/templates/template_kelahiran (1).docx'];
for (const file of files) {
  const out = file.replace(/\.docx$/, '_repaired.docx');
  try {
    repairFile(file, out);
    const content = fs.readFileSync(path.resolve(out), 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render({ nomor_surat: '123', tanggal_sekarang: '01 Januari 2026', nama_bayi: 'Bayi', jenis_kelamin: 'Laki-laki', tanggal_lahir: '01 Januari 2026', jam_lahir: '12:00', jenis_kelahiran: 'Normal', panjang_bayi: '50 cm', nik_ibu: '123', alamat_ibu: 'Jakarta' });
    fs.writeFileSync(out.replace('.docx', '_ok.docx'), doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' }));
    console.log(file, 'repair success', out);
  } catch (err) {
    console.error(file, 'repair failed', err.message);
    if (err.properties) console.error(JSON.stringify(err.properties));
  }
}
