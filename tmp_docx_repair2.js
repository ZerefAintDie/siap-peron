const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function buildTextIndex(xml) {
  const textChars = [];
  const origIdx = [];
  let i = 0;
  while (i < xml.length) {
    if (xml[i] === '<') {
      while (i < xml.length && xml[i] !== '>') i++;
      if (i < xml.length) i++;
      continue;
    }
    textChars.push(xml[i]);
    origIdx.push(i);
    i++;
  }
  return { text: textChars.join(''), origIdx };
}

function repairXmlPlaceholders(xml) {
  const { text, origIdx } = buildTextIndex(xml);
  let repair = xml;
  let offset = 0;
  let searchFrom = 0;
  while (true) {
    const open = text.indexOf('{{', searchFrom);
    if (open === -1) break;
    const close = text.indexOf('}}', open + 2);
    if (close === -1) break;
    const rawStart = origIdx[open];
    const rawEnd = origIdx[close + 1] + 1;
    const placeholderText = text.slice(open + 2, close).replace(/\s+/g, ' ').trim();
    const normalized = `{{${placeholderText}}}`;
    const before = repair.slice(0, rawStart + offset);
    const after = repair.slice(rawEnd + offset);
    repair = before + normalized + after;
    const delta = normalized.length - (rawEnd - rawStart);
    offset += delta;
    searchFrom = close + 2;
  }
  return repair;
}

function fixFile(file) {
  const abs = path.resolve(file);
  console.log('FILE', file);
  const content = fs.readFileSync(abs, 'binary');
  const zip = new PizZip(content);
  const xml = zip.file('word/document.xml').asText();
  const repaired = repairXmlPlaceholders(xml);
  if (repaired.length !== xml.length) {
    console.log('  xml length changed:', xml.length, '->', repaired.length);
  } else {
    console.log('  xml length same');
  }
  const fixedName = `${path.basename(file, '.docx')}_fixed.docx`;
  const fixedPath = path.join(path.dirname(abs), fixedName);
  zip.file('word/document.xml', repaired);
  const buf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(fixedPath, buf);
  try {
    const doc = new Docxtemplater(new PizZip(fs.readFileSync(fixedPath, 'binary')), { paragraphLoop: true, linebreaks: true });
    doc.render({
      nama_kepala_keluarga: 'Test',
      nomor_kk: '12345',
      nama_bayi: 'Bayi',
      jenis_kelamin: 'Laki-laki',
      tempat_dilahirkan: 'Rumah',
      tempat_kelahiran: 'Kota',
      tanggal_lahir: '01 Januari 2024',
      jam_lahir: '12:00',
      jenis_kelahiran: 'Normal',
      anak_ke: '1',
      penolong_kelahiran: 'Dokter',
      berat_bayi: '3 kg',
      panjang_bayi: '50 cm',
      nik_ibu: '123',
      nama_ibu: 'Ibu',
      tanggal_lahir_ibu: '01-01-1990',
      pekerjaan_ibu: 'Karyawan',
      alamat_ibu: 'Alamat Ibu',
      nik_ayah: '456',
      nama_ayah: 'Ayah',
      tanggal_lahir_ayah: '01-01-1988',
      pekerjaan_ayah: 'Wiraswasta',
      alamat_ayah: 'Alamat Ayah',
      nik_pelapor: '789',
      nama_pelapor: 'Pelapor',
      tanggal_lahir_pelapor: '01-01-1995',
      pekerjaan_pelapor: 'Pegawai',
      alamat_pelapor: 'Alamat Pelapor',
      nik_saksi_1: '111',
      nama_saksi_1: 'Saksi 1',
      tanggal_lahir_saksi_1: '01-01-1990',
      pekerjaan_saksi_1: 'Pekerja',
      alamat_saksi_1: 'Alamat Saksi 1',
      nik_saksi_2: '222',
      nama_saksi_2: 'Saksi 2',
      tanggal_lahir_saksi_2: '01-01-1989',
      pekerjaan_saksi_2: 'Buruh',
      alamat_saksi_2: 'Alamat Saksi 2',
    });
    console.log('  render OK ->', fixedName);
  } catch (e) {
    console.error('  render ERROR ->', fixedName, e && e.message ? e.message.split('\n')[0] : e);
  }
}

fixFile('public/templates/template_kelahiran (1).docx');
fixFile('public/templates/template_kelahiran.docx');
