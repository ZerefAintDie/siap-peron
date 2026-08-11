const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function repairPlaceholders(xml) {
  let out = '';
  const len = xml.length;
  let i = 0;
  while (i < len) {
    if (xml[i] === '{' && xml[i+1] === '{') {
      out += '{{';
      i += 2;
      let buffer = '';
      while (i < len) {
        if (xml[i] === '}' && xml[i+1] === '}') {
          const cleaned = buffer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          out += cleaned + '}}';
          i += 2;
          break;
        }
        if (xml[i] === '<') {
          while (i < len && xml[i] !== '>') i++;
          if (i < len) i++;
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

function inspectFile(file) {
  const p = path.resolve(file);
  const content = fs.readFileSync(p, 'binary');
  const zip = new PizZip(content);
  const xml = zip.file('word/document.xml').asText();
  const repaired = repairPlaceholders(xml);
  if (xml === repaired) {
    console.log(file, 'no changes');
  } else {
    console.log(file, 'changed');
  }
  const rx = /\{\{[^}]+\}\}/g;
  console.log('orig matches', (xml.match(rx) || []).slice(0, 10));
  console.log('repaired matches', (repaired.match(rx) || []).slice(0, 10));
  const zip2 = new PizZip(content);
  zip2.file('word/document.xml', repaired);
  try {
    const doc = new Docxtemplater(zip2, { paragraphLoop: true, linebreaks: true });
    doc.render({ nama_kepala_keluarga: 'test', nomor_kk: '123', nama_bayi: 'test', jenis_kelamin: 'M', tempat_dilahirkan: 'A', tempat_kelahiran: 'B', tanggal_lahir: 'C', jam_lahir: 'D', jenis_kelahiran: 'E', anak_ke: 'F', penolong_kelahiran: 'G', berat_bayi: 'H', panjang_bayi: 'I', nik_ibu: 'J', nama_ibu: 'K', tanggal_lahir_ibu: 'L', pekerjaan_ibu: 'M', alamat_ibu: 'N' });
    console.log('render OK');
  } catch (e) {
    console.log('render ERROR', e.message.split('\n')[0]);
  }
}

inspectFile('public/templates/template_kelahiran (1).docx');
inspectFile('public/templates/template_kelahiran.docx');
