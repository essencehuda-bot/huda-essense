const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync('ocr_mappings.json', 'utf8'));
let output = "";
mappings.forEach(m => {
  output += `${m.filename} -> "${m.raw_text}"\n`;
});
fs.writeFileSync('all_ocr_texts.txt', output, 'utf8');
console.log("Saved all OCR texts to all_ocr_texts.txt");
