const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = __dirname;
const APP_TSX_PATH = path.join(WORKSPACE_DIR, 'src', 'App.tsx');
const MAPPINGS_PATH = path.join(WORKSPACE_DIR, 'ocr_mappings.json');

// Get products from App.tsx
function getProducts() {
  const content = fs.readFileSync(APP_TSX_PATH, 'utf8');
  const startMatch = content.match(/const DEFAULT_PRODUCTS:\s*\w+\[\]\s*=\s*\[/);
  if (!startMatch) return [];
  const startIdx = startMatch.index + startMatch[0].length - 1;
  let bracketCount = 0;
  let currentIdx = startIdx;
  let arrayText = '';
  while (currentIdx < content.length) {
    const char = content[currentIdx];
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
    arrayText += char;
    if (bracketCount === 0) break;
    currentIdx++;
  }
  return new Function(`return ${arrayText}`)();
}

function getUnusedMappings() {
  const products = getProducts();
  const mappings = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf8'));

  // Run the matching logic again
  const matchedFiles = new Set();
  
  // Normalize function
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

  for (const product of products) {
    let bestMatch = null;
    let bestScore = 0;

    for (const map of mappings) {
      const scoreName = similarity(product.name, map.raw_text);
      const scoreInspired = similarity(product.inspiredBy, map.raw_text);
      const scoreId = similarity(product.id.replace(/-/g, ' '), map.raw_text);

      const score = Math.max(scoreName, scoreInspired, scoreId);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = map;
      }
    }

    if (bestMatch && bestScore >= 0.25) {
      matchedFiles.add(bestMatch.filename);
    }
  }

  const unused = mappings.filter(m => !matchedFiles.has(m.filename));
  console.log(`=== UNUSED OCR MAPPINGS (${unused.length}) ===`);
  unused.forEach(u => {
    console.log(`  File: ${u.filename} -> "${u.raw_text}"`);
  });
}

getUnusedMappings();
