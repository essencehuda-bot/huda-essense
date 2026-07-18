const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const MAPPINGS = JSON.parse(fs.readFileSync('ocr_mappings.json', 'utf8'));

// Run the same matching logic to get automatically matched files
const productsContent = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf8');
const startMatch = productsContent.match(/const DEFAULT_PRODUCTS:\s*\w+\[\]\s*=\s*\[/);
const startIdx = startMatch.index + startMatch[0].length - 1;
let bracketCount = 0;
let currentIdx = startIdx;
let arrayText = '';
while (currentIdx < productsContent.length) {
  const char = productsContent[currentIdx];
  if (char === '[') bracketCount++;
  if (char === ']') bracketCount--;
  arrayText += char;
  if (bracketCount === 0) break;
  currentIdx++;
}
const products = new Function(`return ${arrayText}`)();

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/huda/g, '')
    .replace(/essence/g, '')
    .replace(/atelier/g, '')
    .replace(/for\s+(him|her|them|men|women|unisex|spr|eac|pr)/g, '')
    .replace(/eau\s+de\s+parfum/g, '')
    .replace(/extrait\s+de\s+parfum/g, '')
    .replace(/\d+/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function similarity(str1, str2) {
  const s1 = new Set(normalize(str1).split(' ').filter(w => w.length > 1));
  const s2 = new Set(normalize(str2).split(' ').filter(w => w.length > 1));
  if (s1.size === 0 || s2.size === 0) return 0;
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  return intersection.size / union.size;
}

// Automatically matched files:
const autoMatched = new Set();
for (const product of products) {
  let bestMatch = null;
  let bestScore = 0;
  for (const map of MAPPINGS) {
    const score = Math.max(
      similarity(product.name, map.raw_text),
      similarity(product.inspiredBy, map.raw_text),
      similarity(product.id.replace(/-/g, ' '), map.raw_text)
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = map;
    }
  }
  if (bestMatch && bestScore >= 0.25) {
    autoMatched.add(bestMatch.filename);
  }
}

// Add the 6 manually matched files:
const manualMatched = new Set([
  'gpt-image-1_a_Create_the_exact_sam_(3).png_202607160741_39.jpeg', // Nishane Hacivat
  'gpt-image-1_a_Create_the_exact_sam_(3).png_202607160742_106.jpeg', // Mancera Cedrat Boise
  'gpt-image-1_a_Create_the_exact_sam_(3).png_202607160741_6.jpeg', // Xerjoff Erba Pura
  'gpt-image-1_a_Create_the_exact_sam_(3).png_202607160742_14.jpeg', // Hugo Boss Bottled
  'gpt-image-1_a_Create_the_exact_sam_(3).png_202607160742_33.jpeg', // Dunhill Icon
  'gpt-image-1_a_Create_the_exact_sam_(3).png_202607160742_58.jpeg', // Davidoff Cool Water
]);

const allFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith('gpt-image-'));
const unusedFiles = allFiles.filter(f => !autoMatched.has(f) && !manualMatched.has(f));

let outStr = `Total unused files: ${unusedFiles.length}\n`;
unusedFiles.forEach(f => {
  const map = MAPPINGS.find(m => m.filename === f);
  outStr += `${f} -> "${map ? map.raw_text : 'NO OCR'}"\n`;
});
fs.writeFileSync('remaining_unused.txt', outStr, 'utf8');
console.log("Saved remaining unused files to remaining_unused.txt");
