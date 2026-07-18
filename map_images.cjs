const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = __dirname;
const PUBLIC_DIR = path.join(WORKSPACE_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const APP_TSX_PATH = path.join(WORKSPACE_DIR, 'src', 'App.tsx');
const MAPPINGS_PATH = path.join(WORKSPACE_DIR, 'ocr_mappings.json');

// Get products from App.tsx
function getProducts() {
  const content = fs.readFileSync(APP_TSX_PATH, 'utf8');
  const startMatch = content.match(/const DEFAULT_PRODUCTS:\s*\w+\[\]\s*=\s*\[/);
  if (!startMatch) {
    console.error("Could not find start of DEFAULT_PRODUCTS in App.tsx");
    return [];
  }
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
  try {
    return new Function(`return ${arrayText}`)();
  } catch (err) {
    console.error("Failed to parse products:", err);
    return [];
  }
}

// Normalize strings for matching
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

// Jaccard similarity between two token sets
function similarity(str1, str2) {
  const s1 = new Set(normalize(str1).split(' ').filter(w => w.length > 1));
  const s2 = new Set(normalize(str2).split(' ').filter(w => w.length > 1));
  if (s1.size === 0 || s2.size === 0) return 0;
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  return intersection.size / union.size;
}

function runMapping() {
  const products = getProducts();
  const mappings = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf8'));

  console.log(`Loaded ${products.length} products and ${mappings.length} OCR mappings.`);

  const matched = [];
  const unmatchedProducts = [];

  for (const product of products) {
    let bestMatch = null;
    let bestScore = 0;

    for (const map of mappings) {
      // Score against product name
      const scoreName = similarity(product.name, map.raw_text);
      // Score against inspiredBy (e.g. "Sauvage by Dior")
      const scoreInspired = similarity(product.inspiredBy, map.raw_text);
      // Score against id
      const scoreId = similarity(product.id.replace(/-/g, ' '), map.raw_text);

      const score = Math.max(scoreName, scoreInspired, scoreId);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = map;
      }
    }

    // Threshold of 0.25 is usually good for noisy OCR
    if (bestMatch && bestScore >= 0.25) {
      matched.push({
        product: product,
        file: bestMatch.filename,
        text: bestMatch.raw_text,
        score: bestScore
      });
    } else {
      unmatchedProducts.push(product);
    }
  }

  console.log(`\n=== MATCHED PRODUCTS (${matched.length}) ===`);
  matched.forEach(m => {
    console.log(`  [OK] Product: "${m.product.name}" -> File: ${m.file} (OCR: "${m.text}", Score: ${m.score.toFixed(2)})`);
  });

  console.log(`\n=== UNMATCHED PRODUCTS (${unmatchedProducts.length}) ===`);
  unmatchedProducts.forEach(p => {
    console.log(`  [MISSING] "${p.name}" (Inspired by: "${p.inspiredBy}")`);
  });

  // Let's copy matched files to their correct names!
  console.log(`\n=== Copying Files ===`);
  let copyCount = 0;
  matched.forEach(m => {
    const srcPath = path.join(IMAGES_DIR, m.file);
    // Since App.tsx has been restored, it expects .png filenames
    const destPath = path.join(IMAGES_DIR, path.basename(m.product.image));
    
    try {
      fs.copyFileSync(srcPath, destPath);
      copyCount++;
    } catch (err) {
      console.error(`Failed to copy: ${m.file} -> ${m.product.image}:`, err.message);
    }
  });

  console.log(`\nSuccessfully copied ${copyCount} files.`);
}

runMapping();
