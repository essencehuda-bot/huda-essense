const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = __dirname;
const MAPPINGS_PATH = path.join(WORKSPACE_DIR, 'ocr_mappings.json');

const mappings = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf8'));

const keywords = ["aventus", "icon", "bottled", "cool", "hacivat", "mancera", "tobacco", "pura", "erba", "creed", "dunhill", "boss", "davidoff"];

console.log("=== KEYWORD SEARCH IN MAPPINGS ===");
mappings.forEach(m => {
  const text = m.raw_text.toLowerCase();
  const matched = keywords.filter(k => text.includes(k));
  if (matched.length > 0) {
    console.log(`File: ${m.filename} -> "${m.raw_text}" (Matched: ${matched.join(', ')})`);
  }
});
