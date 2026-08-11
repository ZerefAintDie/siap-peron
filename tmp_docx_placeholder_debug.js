const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function show(file) {
  const content = fs.readFileSync(path.resolve(file), 'binary');
  const zip = new PizZip(content);
  const xml = zip.file('word/document.xml').asText();
  console.log('---', file, '---');
  const tags = [];
  for (let i = 0; i < xml.length; i++) {
    if (xml[i] === '{' && xml[i+1] === '{') {
      tags.push({type: 'open', index: i});
    } else if (xml[i] === '}' && xml[i+1] === '}') {
      tags.push({type: 'close', index: i});
    }
  }
  console.log('Total open:', tags.filter(t => t.type === 'open').length, 'close:', tags.filter(t => t.type === 'close').length);
  const regex = /\{\{[^}]*\}\}/g;
  let m;
  while ((m = regex.exec(xml))) {
    const snippet = xml.slice(Math.max(0, m.index-120), Math.min(xml.length, m.index+m[0].length+120));
    console.log('TAG', m[0], 'at', m.index);
    console.log(snippet.replace(/\n/g,'\n'));
    console.log('---');
  }
  const brokenRegex = /<w:t[^>]*>[^<]*\{\{[^<]*<\/w:t>[^<]*<w:t[^>]*>[^<]*\}\}[^<]*<\/w:t>/g;
  const broken = xml.match(brokenRegex);
  console.log('split placeholder candidate count:', broken ? broken.length : 0);
  if (broken) {
    broken.slice(0, 10).forEach((b, idx) => {
      console.log('BROKEN', idx, b.replace(/\n/g,'\n'));
    });
  }
}

show('public/templates/template_kelahiran (1).docx');
show('public/templates/template_kelahiran.docx');
