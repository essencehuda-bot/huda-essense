const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const WORKSPACE_DIR = __dirname;
const PUBLIC_DIR = path.join(WORKSPACE_DIR, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const APP_TSX_PATH = path.join(WORKSPACE_DIR, 'src', 'App.tsx');

// List of target inspired-by female perfumes to safely generate
const TARGET_INSPIRED = [
  "Gucci Flora", "Gucci Bloom", "Gucci Rush", "Miss Dior", "J'adore Dior", 
  "Dior Poison Girl", "Chanel Coco Mademoiselle", "Chanel Chance", "Chanel Gabrielle", 
  "Versace Bright Crystal", "Versace Crystal Noir", "Versace Yellow Diamond", "YSL Libre", 
  "Mon Paris", "Black Opium", "Burberry Her", "Burberry Body", "Victoria's Secret Bombshell", 
  "Bombshell Intense", "Bombshell Seduction", "Carolina Herrera Good Girl", "Good Girl Blush", 
  "212 VIP Rose", "Lancôme La Vie Est Belle", "Idôle", "Dolce & Gabbana Light Blue", 
  "Dolce Garden", "Issey Miyake L'Eau d'Issey", "Blue Lady", "Chastity", "Tea Rose", 
  "White Musk", "Red Door", "Guess Seductive", "Guess Girl", "Escada Cherry In Japan", 
  "Escada Magnetism", "Armaf Club De Nuit Women", "Ajmal Raindrops", "Ajmal Sacrifice For Her", 
  "Lattafa Yara", "Lattafa Fakhar Women", "Lattafa Ana Abiyedh Rouge", "Lattafa Haya", 
  "J. Janan", "Bonanza Satrangi Femme", "Sapphire Femme", "Khaadi Bloom", 
  "WB by Hemani Grace", "Scents N Stories Belle"
];

function getProducts() {
  if (!fs.existsSync(APP_TSX_PATH)) {
    console.error("App.tsx not found at: " + APP_TSX_PATH);
    return [];
  }

  const content = fs.readFileSync(APP_TSX_PATH, 'utf8');
  const startMatch = content.match(/const DEFAULT_PRODUCTS:\s*\w+\[\]\s*=\s*\[/);

  if (!startMatch) {
    console.error("Could not find start of DEFAULT_PRODUCTS in App.tsx");
    return [];
  }

  const startIdx = startMatch.index + startMatch[0].length - 1; // start index of '['

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
    const products = new Function(`return ${arrayText}`)();
    return products;
  } catch (err) {
    console.error("Failed to parse arrayText:", err);
    return [];
  }
}

function getMissingTargetImages(products) {
  const missing = [];
  for (const product of products) {
    if (!product.image) continue;
    const cleanPath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
    const fullPath = path.join(PUBLIC_DIR, cleanPath);
    if (!fs.existsSync(fullPath)) {
      missing.push(product);
    }
  }
  return missing;
}

// Start HTTP Server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // Get status api
  if (urlPath === '/api/status' && req.method === 'GET') {
    const products = getProducts();
    const missing = getMissingTargetImages(products);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalProducts: products.length,
      missingCount: missing.length,
      products: products,
      missing: missing
    }));
    return;
  }

  // Save image api
  if (urlPath === '/api/save-image' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { filename, dataUrl, overwrite } = JSON.parse(body);
        if (!filename || !dataUrl) {
          throw new Error("Missing filename or dataUrl");
        }

        const cleanPath = filename.startsWith('/') ? filename.slice(1) : filename;
        const filePath = path.join(PUBLIC_DIR, cleanPath);

        // Never overwrite if file already exists
        if (fs.existsSync(filePath) && !overwrite) {
          console.log(`[SKIPPED] ${cleanPath} (File already exists, protecting original)`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, skipped: true, path: cleanPath }));
          return;
        }

        // Save base64 image data
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
        fs.writeFileSync(filePath, base64Data, 'base64');

        console.log(`[SAVED] ${cleanPath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, path: cleanPath }));
      } catch (err) {
        console.error("Save image error:", err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Exit api to shut down server
  if (urlPath === '/api/exit') {
    console.log("Exit API called. Shutting down server.");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    setTimeout(() => {
      process.exit(0);
    }, 1000);
    return;
  }

  // Serve public folder assets
  if (urlPath.startsWith('/images/')) {
    const filePath = path.join(PUBLIC_DIR, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        const ext = path.extname(filePath);
        const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
    return;
  }

  // Serve main interface HTML
  if (urlPath === '/' || urlPath === '/generator') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getGeneratorHtml());
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Secure Image Generator Server is running!`);
  console.log(`👉 Open http://localhost:${PORT} in your web browser`);
  console.log(`======================================================\n`);
});

// Generator HTML Interface
function getGeneratorHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Huda Essence — Image Asset Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-dark: #12100e;
      --panel-dark: rgba(30, 26, 22, 0.7);
      --accent: #b89050;
      --accent-hover: #d8af6e;
      --text: #f0ece4;
      --text-muted: #a69a88;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--bg-dark);
      color: var(--text);
      font-family: 'Instrument Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
    }

    .container {
      max-width: 900px;
      width: 100%;
      background: var(--panel-dark);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(184, 144, 80, 0.2);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }

    header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid rgba(184, 144, 80, 0.15);
      padding-bottom: 30px;
    }

    h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 38px;
      font-weight: 500;
      letter-spacing: 2px;
      color: var(--accent);
      margin-bottom: 10px;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 15px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }

    .stat-card .val {
      font-size: 28px;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 5px;
    }

    .stat-card .lbl {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }

    .controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-bottom: 35px;
    }

    button {
      background: var(--accent);
      color: #12100e;
      border: none;
      border-radius: 12px;
      padding: 14px 28px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    button:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(184, 144, 80, 0.4);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .progress-bar-container {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      height: 8px;
      width: 100%;
      margin-bottom: 30px;
      overflow: hidden;
      display: none;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent-hover));
      width: 0%;
    }

    .status-log {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      padding: 20px;
      height: 250px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #8bb38b;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .log-entry {
      margin-bottom: 5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.02);
      padding-bottom: 4px;
      display: flex;
      justify-content: space-between;
    }

    .log-entry.error {
      color: #ff6b6b;
    }

    .log-entry.info {
      color: var(--text-muted);
    }

    #renderCanvas {
      display: none;
    }

    .preview-box {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .preview-box h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      color: var(--accent);
    }

    #previewImg {
      width: 250px;
      height: 250px;
      border-radius: 16px;
      border: 2px solid var(--accent);
      object-fit: cover;
      background: rgba(255,255,255,0.02);
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      display: none;
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <h1>HUDA ESSENCE</h1>
      <div class="subtitle">Secure Perfume Image Asset Generator</div>
    </header>

    <div class="stats">
      <div class="stat-card">
        <div class="val" id="statTotal">0</div>
        <div class="lbl">Total Scents</div>
      </div>
      <div class="stat-card">
        <div class="val" id="statMissing" style="color: #ff6b6b;">0</div>
        <div class="lbl">Missing Images</div>
      </div>
      <div class="stat-card">
        <div class="val" id="statProgress">0%</div>
        <div class="lbl">Progress</div>
      </div>
    </div>

    <div class="controls">
      <button id="btnGenerateMissing" disabled>Generate Missing Images Only</button>
      <button id="btnGenerateAll" style="background: #731827; color: white;">Regenerate All 130 Images (Force Overwrite)</button>
    </div>

    <div class="progress-bar-container" id="progressBarContainer">
      <div class="progress-bar" id="progressBar"></div>
    </div>

    <div class="status-log" id="statusLog">
      <div class="log-entry info">Connecting to local server...</div>
    </div>

    <div class="preview-box">
      <h3 id="previewTitle">Rendering Preview</h3>
      <img id="previewImg" src="" alt="Preview">
    </div>
  </div>

  <canvas id="renderCanvas" width="1024" height="1024"></canvas>

  <script>
    const logEl = document.getElementById('statusLog');
    const canvas = document.getElementById('renderCanvas');
    const ctx = canvas.getContext('2d');
    const previewImg = document.getElementById('previewImg');
    const previewTitle = document.getElementById('previewTitle');
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');
    
    let allProducts = [];
    let missingProducts = [];
    let isGenerating = false;

    function log(msg, type = '') {
      const entry = document.createElement('div');
      entry.className = 'log-entry ' + type;
      
      const time = new Date().toLocaleTimeString();
      entry.innerHTML = '<span>[' + time + '] ' + msg + '</span>';
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }

    async function loadStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        allProducts = data.products;
        missingProducts = data.missing;
        
        document.getElementById('statTotal').innerText = data.totalProducts;
        document.getElementById('statMissing').innerText = data.missingCount;
        
        log("Loaded status. Total scents: " + data.totalProducts + ", Missing: " + data.missingCount);
        
        if (data.missingCount > 0) {
          document.getElementById('btnGenerateMissing').disabled = false;
          log('Ready to generate. Click the button to start rendering missing files safely.');
} else {
          log('All images are present! No missing images to generate.', 'info');
        }
      } catch (err) {
        log('Failed to connect to backend server: ' + err.message, 'error');
      }
    }

    // Determine the scent theme background template
    function getScentThemeTemplate(product) {
      const family = (product.family || '').toLowerCase();
      const name = (product.name || '').toLowerCase();
      const mood = (product.mood || '').toLowerCase();
      const story = (product.story || '').toLowerCase();
      const topNotes = (product.top || []).map(n => n.toLowerCase());
      const heartNotes = (product.heart || []).map(n => n.toLowerCase());
      const baseNotes = (product.base || []).map(n => n.toLowerCase());

      // Aggregate all perfume text descriptive details
      const allText = [
        family,
        name,
        mood,
        story,
        ...topNotes,
        ...heartNotes,
        ...baseNotes
      ].join(' ');

      const scores = {
        woody: 0,
        leather: 0,
        aquatic: 0,
        spicy: 0,
        green: 0,
        white_floral: 0,
        fruity: 0,
        floral: 0
      };

      // 1. Woody keywords
      const woodyKeywords = ['wood', 'oud', 'cedar', 'sandalwood', 'patchouli', 'vetiver', 'birch', 'incense', 'tobacco', 'amberwood', 'smoky', 'guaiac', 'cypress', 'commanding'];
      woodyKeywords.forEach(k => {
        if (allText.includes(k)) scores.woody += 2.5;
      });

      // 2. Leather keywords
      const leatherKeywords = ['leather', 'suede', 'animalic', 'caban'];
      leatherKeywords.forEach(k => {
        if (allText.includes(k)) scores.leather += 5;
      });

      // 3. Aquatic keywords
      const aquaticKeywords = ['aquatic', 'marine', 'sea', 'calone', 'ocean', 'water', 'salt', 'ozone', 'ozonic'];
      aquaticKeywords.forEach(k => {
        if (allText.includes(k)) scores.aquatic += 4;
      });

      // 4. Spicy / Amber / Vanilla keywords
      const spicyKeywords = ['vanilla', 'vanille', 'spicy', 'spice', 'amber', 'cinnamon', 'cardamom', 'clove', 'nutmeg', 'ginger', 'tonka', 'meringue', 'chestnut', 'caramel', 'khamrah', 'warm', 'cocoa', 'coffee'];
      spicyKeywords.forEach(k => {
        if (allText.includes(k)) scores.spicy += 2.5;
      });

      // 5. Green / Herbal / Aromatic keywords
      const greenKeywords = ['green', 'herbal', 'basil', 'sage', 'violet leaf', 'galbanum', 'grass', 'ivy', 'mint', 'oakmoss', 'aromatic', 'tweed'];
      greenKeywords.forEach(k => {
        if (allText.includes(k)) scores.green += 2.5;
      });

      // 6. White Floral keywords
      const whiteFloralKeywords = ['jasmine', 'neroli', 'orange blossom', 'tuberose', 'gardenia', 'lily', 'freesia', 'magnolia', 'white floral', 'orange flower', 'bloom'];
      whiteFloralKeywords.forEach(k => {
        if (allText.includes(k)) scores.white_floral += 3;
      });

      // 7. Fruity / Sweet keywords
      const fruityKeywords = ['fruity', 'sweet', 'cherry', 'peach', 'apple', 'pineapple', 'pear', 'strawberry', 'raspberry', 'blackcurrant', 'berry', 'berries', 'melon', 'coconut', 'gourmand', 'plum', 'mandarin', 'citrus', 'orange', 'grapefruit', 'lemon', 'lime', 'bergamot'];
      fruityKeywords.forEach(k => {
        if (allText.includes(k)) scores.fruity += 1.5;
      });

      // 8. Floral keywords
      const floralKeywords = ['floral', 'rose', 'peony', 'iris', 'orchid', 'violet', 'geranium', 'lavender', 'blossom', 'flower', 'petal', 'petals', 'flora'];
      floralKeywords.forEach(k => {
        if (allText.includes(k)) scores.floral += 2.2;
      });

      // Boost based on family name
      if (family.includes('wood') || family.includes('oud')) scores.woody += 5;
      if (family.includes('leather')) scores.leather += 8;
      if (family.includes('aquatic') || family.includes('marine')) scores.aquatic += 5;
      if (family.includes('spicy') || family.includes('amber') || family.includes('oriental')) scores.spicy += 5;
      if (family.includes('green') || family.includes('herbal')) scores.green += 5;
      if (family.includes('white floral') || family.includes('jasmine')) scores.white_floral += 5;
      else if (family.includes('floral') || family.includes('rose')) scores.floral += 4;
      if (family.includes('fruity') || family.includes('sweet') || family.includes('gourmand')) scores.fruity += 5;

      // Exact Name-Based Boosts to guarantee accuracy for specific iconic fragrances
      if (name.includes('sauvage') || name.includes('bleu') || name.includes('cool water') || name.includes('hawas') || name.includes('chrome') || name.includes('explorer') || name.includes('acqua')) {
        scores.aquatic += 12;
      }
      if (name.includes('rose') || name.includes('flora') || name.includes('chance') || name.includes('bright crystal')) {
        scores.floral += 12;
      }
      if (name.includes('wood') || name.includes('oud') || name.includes('janan') || name.includes('prestige')) {
        scores.woody += 12;
      }
      if (name.includes('vanille') || name.includes('khamrah') || name.includes('asad') || name.includes('code') || name.includes('stronger')) {
        scores.spicy += 12;
      }
      if (name.includes('black opium') || name.includes('la nuit') || name.includes('desire') || name.includes('eros') || name.includes('1 million')) {
        scores.leather += 12;
      }
      if (name.includes('bloom') || name.includes("j'adore") || name.includes('blue lady') || name.includes('jasmine') || name.includes('grace')) {
        scores.white_floral += 12;
      }
      if (name.includes('yara') || name.includes('bombshell') || name.includes('cherry') || name.includes('rouge 540') || name.includes('baccarat') || name.includes('pear')) {
        scores.fruity += 12;
      }
      if (name.includes('tweed') || name.includes('sage') || name.includes('legend') || name.includes('century')) {
        scores.green += 12;
      }

      // Find highest scoring theme
      let maxScore = -1;
      let selectedTheme = 'floral';
      
      Object.keys(scores).forEach(theme => {
        if (scores[theme] > maxScore) {
          maxScore = scores[theme];
          selectedTheme = theme;
        }
      });

      if (maxScore <= 0) {
        if (product.gender === 'Men') return '/images/base_aquatic.png';
        if (product.gender === 'Women') return '/images/base_floral.png';
        return '/images/base_spicy.png';
      }

      const themeMap = {
        woody: '/images/base_woody.png',
        leather: '/images/base_leather.png',
        aquatic: '/images/base_aquatic.png',
        spicy: '/images/base_spicy.png',
        green: '/images/base_green.png',
        white_floral: '/images/base_white_floral.png',
        fruity: '/images/base_fruity.png',
        floral: '/images/base_floral.png',
      };

      return themeMap[selectedTheme] || '/images/base_spicy.png';
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load: ' + src));
        img.src = src;
      });
    }

    // Canvas rendering script
    async function renderProduct(product) {
      const bgSrc = (product.image && !product.image.startsWith('data:image/'))
        ? product.image.replace(/\.png$/, '.jpeg')
        : (product.image || templatePath);
      const img = await loadImage(bgSrc);
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      // Ensure full opacity for drawing the sticker
      ctx.globalAlpha = 1.0;

      // Uniform scale factor based on vertical height to preserve aspect ratio of the label on unstretched bottles
      const scale = img.height / 1024;

      const centerX = img.width / 2;

      // Setup offscreen canvas for flat label drawing (to be warped later)
      const offscreen = document.createElement('canvas');
      offscreen.width = img.width;
      offscreen.height = img.height;
      const oCtx = offscreen.getContext('2d');
      if (!oCtx) {
        return;
      }

      const rectW = 380 * scale;
      const rectH = 330 * scale;
      const rectX = centerX - rectW / 2;
      const rectY = 460 * scale;

      const drawRoundedRect = (c, x, y, width, height, radius) => {
        c.beginPath();
        c.moveTo(x + radius, y);
        c.arcTo(x + width, y, x + width, y + height, radius);
        c.arcTo(x + width, y + height, x, y + height, radius);
        c.arcTo(x, y + height, x, y, radius);
        c.arcTo(x, y, x + width, y, radius);
        c.closePath();
      };

      // Create metallic gold gradient for foil-like appearance on borders, logo & HUDA
      const goldGrad = oCtx.createLinearGradient(rectX, rectY, rectX + rectW, rectY + rectH);
      goldGrad.addColorStop(0, '#3a2b0e');    // darker deep bronze shadow
      goldGrad.addColorStop(0.25, '#7b5e28');  // rich antique gold
      goldGrad.addColorStop(0.5, '#b08d46');   // warm metallic shine (deeper gold)
      goldGrad.addColorStop(0.75, '#7b5e28');  // rich antique gold
      goldGrad.addColorStop(1, '#3a2b0e');     // darker deep bronze shadow

      // Cylindrical 3D gradient for label background
      const labelGrad = oCtx.createLinearGradient(rectX, 0, rectX + rectW, 0);
      labelGrad.addColorStop(0, '#e8ddcc');    // shadow on left edge
      labelGrad.addColorStop(0.12, '#faf6ed'); // transition
      labelGrad.addColorStop(0.5, '#fffefa');  // pearly warm white highlight
      labelGrad.addColorStop(0.88, '#faf6ed'); // transition
      labelGrad.addColorStop(1, '#e8ddcc');    // shadow on right edge

      // Draw flat background
      oCtx.fillStyle = labelGrad;
      drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 16 * scale);
      oCtx.fill();

      // Draw outer gold border
      oCtx.strokeStyle = goldGrad;
      oCtx.lineWidth = 1.8 * scale;
      drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 16 * scale);
      oCtx.stroke();

      // Draw inner gold border (inset by 7 * scale)
      oCtx.lineWidth = 0.8 * scale;
      drawRoundedRect(oCtx, rectX + 7 * scale, rectY + 7 * scale, rectW - 14 * scale, rectH - 14 * scale, 11 * scale);
      oCtx.stroke();

      const drawLeafLogo = (c, cx, cy) => {
        c.save();
        c.fillStyle = goldGrad;
        c.strokeStyle = goldGrad;
        c.lineWidth = 2.0 * scale; // Bolder stem
        
        // Draw stem
        c.beginPath();
        c.moveTo(cx, cy + 22 * scale);
        c.quadraticCurveTo(cx - 2 * scale, cy + 5 * scale, cx, cy - 15 * scale);
        c.stroke();
        
        // Helper to draw a single leaf pointing at an angle
        const drawLeaf = (x, y, w, h, angle) => {
          c.save();
          c.translate(x, y);
          c.rotate(angle);
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(w / 2, -h / 2, w, 0);
          c.quadraticCurveTo(w / 2, h / 2, 0, 0);
          c.fill();
          c.restore();
        };

        // Top center leaf
        drawLeaf(cx, cy - 15 * scale, 16.5 * scale, 8.5 * scale, -Math.PI / 2);
        
        // Upper left leaf
        drawLeaf(cx - 2 * scale, cy - 3 * scale, 15.5 * scale, 7.5 * scale, -Math.PI * 0.7);
        // Upper right leaf
        drawLeaf(cx + 2 * scale, cy - 3 * scale, 15.5 * scale, 7.5 * scale, -Math.PI * 0.3);
        
        // Lower left leaf
        drawLeaf(cx - 3 * scale, cy + 10 * scale, 16.5 * scale, 8 * scale, -Math.PI * 0.8);
        // Lower right leaf
        drawLeaf(cx + 3 * scale, cy + 10 * scale, 16.5 * scale, 8 * scale, -Math.PI * 0.2);
        
        c.restore();
      };

      // Enable a very subtle letterpress shadow for printed elements to feel physical
      oCtx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      oCtx.shadowBlur = 1 * scale;
      oCtx.shadowOffsetX = 0.5 * scale;
      oCtx.shadowOffsetY = 0.5 * scale;

      // 1. Draw Leaf Logo
      drawLeafLogo(oCtx, centerX, 502 * scale);

      // 2. Draw "HUDA" brand name (gold, bold serif, scaled up for high readability)
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillStyle = goldGrad;
      oCtx.font = "bold " + Math.round(48 * scale) + "px 'Cormorant Garamond', 'Times New Roman', serif";
      if ('letterSpacing' in oCtx) {
        oCtx.letterSpacing = (1.2 * scale) + 'px';
      }
      oCtx.fillText('HUDA', centerX, 550 * scale);

      // 3. Draw "— ESSENCE —" (gold, bold, scaled up for high readability)
      oCtx.fillStyle = goldGrad;
      oCtx.font = "bold " + Math.round(16 * scale) + "px 'Cormorant Garamond', 'Times New Roman', serif";
      if ('letterSpacing' in oCtx) {
        oCtx.letterSpacing = (5.5 * scale) + 'px';
      }
      oCtx.fillText('— ESSENCE —', centerX, 588 * scale);

      // Reset letter spacing
      if ('letterSpacing' in oCtx) {
        oCtx.letterSpacing = '0px';
      }

      // 4. Draw separator line with diamond
      oCtx.beginPath();
      oCtx.moveTo(centerX - 60 * scale, 616 * scale);
      oCtx.lineTo(centerX + 60 * scale, 616 * scale);
      oCtx.strokeStyle = goldGrad;
      oCtx.lineWidth = 1.0 * scale;
      oCtx.stroke();

      oCtx.beginPath();
      oCtx.moveTo(centerX, 612 * scale);
      oCtx.lineTo(centerX + 5 * scale, 616 * scale);
      oCtx.lineTo(centerX, 620 * scale);
      oCtx.lineTo(centerX - 5 * scale, 616 * scale);
      oCtx.closePath();
      oCtx.fillStyle = goldGrad;
      oCtx.fill();

      // 5. Draw "INSPIRED BY" with flanking lines (bold, scaled up)
      oCtx.font = "bold " + Math.round(13 * scale) + "px 'Instrument Sans', 'Arial', sans-serif";
      oCtx.fillStyle = goldGrad;
      if ('letterSpacing' in oCtx) {
        oCtx.letterSpacing = (2.2 * scale) + 'px';
      }
      const inspiredText = 'INSPIRED BY';
      oCtx.fillText(inspiredText, centerX, 650 * scale);

      // Measure text for flanking lines
      const inspiredWidth = oCtx.measureText(inspiredText).width;
      if ('letterSpacing' in oCtx) {
        oCtx.letterSpacing = '0px';
      }

      oCtx.strokeStyle = goldGrad;
      oCtx.lineWidth = 1.0 * scale;
      // Left line flanking INSPIRED BY
      oCtx.beginPath();
      oCtx.moveTo(centerX - inspiredWidth / 2 - 14 * scale, 650 * scale);
      oCtx.lineTo(centerX - inspiredWidth / 2 - 50 * scale, 650 * scale);
      oCtx.stroke();

      // Right line flanking INSPIRED BY
      oCtx.beginPath();
      oCtx.moveTo(centerX + inspiredWidth / 2 + 14 * scale, 650 * scale);
      oCtx.lineTo(centerX + inspiredWidth / 2 + 50 * scale, 650 * scale);
      oCtx.stroke();

      // 6. Draw perfume name (automatically wrap onto multiple lines, start at 28px and bold weight)
      let fontSize = 28 * scale;
      let lineHeight = 32 * scale;
      let lines = [];
      const maxWidth = rectW - 40 * scale;

      // Try sizes from 28 down to 16 to find the one that fits nicely and stays bold
      for (let size = 28; size >= 16; size -= 1) {
        oCtx.font = "bold " + Math.round(size * scale) + "px 'Cormorant Garamond', 'Times New Roman', serif";
        lines = [];
        const words = product.name.split(/\s+/);
        let currentLine = words[0] || '';
        let ok = true;

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + " " + word;
          const width = oCtx.measureText(testLine).width;
          if (width <= maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
            if (oCtx.measureText(word).width > maxWidth) {
              ok = false;
            }
          }
        }
        if (currentLine) {
          lines.push(currentLine);
        }

        if (ok && lines.length <= (product.name.length > 25 ? 3 : 2)) {
          fontSize = size * scale;
          lineHeight = (size + 4) * scale;
          break;
        }
      }

      oCtx.save();
      oCtx.font = "bold " + Math.round(fontSize) + "px 'Cormorant Garamond', 'Times New Roman', serif";
      oCtx.fillStyle = '#000000';
      // Add premium high-contrast letterpress shadow to make the text pop off the card
      oCtx.shadowColor = 'rgba(0, 0, 0, 0.28)';
      oCtx.shadowBlur = 1.8 * scale;
      oCtx.shadowOffsetX = 0.6 * scale;
      oCtx.shadowOffsetY = 0.9 * scale;
      
      // Center the perfume name vertically in the lower half (between 650 and 785)
      const totalHeight = lines.length * lineHeight;
      const startY = (718 * scale) - (totalHeight / 2) + (lineHeight / 2) - 4 * scale;
      lines.forEach((line, index) => {
        oCtx.fillText(line, centerX, startY + (index * lineHeight));
      });
      oCtx.restore();

      // Apply realistic paper texture / grain
      const imgData = oCtx.getImageData(rectX, rectY, rectW, rectH);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i+3] > 0) {
          const noise = (Math.random() - 0.5) * 6;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
          data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
        }
      }
      oCtx.putImageData(imgData, rectX, rectY);

      // Overlay the diagonal glass reflection
      oCtx.save();
      drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 16 * scale);
      oCtx.clip();

      const reflectGrad = oCtx.createLinearGradient(rectX, 0, rectX + rectW, 0);
      reflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      reflectGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
      reflectGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.12)');
      reflectGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.02)');
      reflectGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      oCtx.fillStyle = reflectGrad;
      oCtx.beginPath();
      oCtx.moveTo(rectX - 100 * scale, rectY);
      oCtx.lineTo(rectX + rectW, rectY);
      oCtx.lineTo(rectX + rectW + 100 * scale, rectY + rectH);
      oCtx.lineTo(rectX, rectY + rectH);
      oCtx.closePath();
      oCtx.fill();
      oCtx.restore();

      // ────────── WARP AND BEND ONTO MAIN CANVAS ──────────
      ctx.save();
      ctx.shadowColor = 'rgba(15, 10, 5, 0.22)';
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetX = 1 * scale;
      ctx.shadowOffsetY = 3 * scale;

      const bendAmount = 4.5 * scale;
      const thetaMax = 0.38;
      const sinThetaMax = Math.sin(thetaMax);

      ctx.fillStyle = '#ebdcc5';
      ctx.beginPath();
      for (let x = 0; x <= rectW; x++) {
        const normX = (x - rectW / 2) / (rectW / 2);
        const yShift = bendAmount * (1 - normX * normX);
        if (x === 0) ctx.moveTo(rectX + x, rectY + yShift);
        else ctx.lineTo(rectX + x, rectY + yShift);
      }
      ctx.lineTo(rectX + rectW, rectY + rectH);
      for (let x = rectW; x >= 0; x--) {
        const normX = (x - rectW / 2) / (rectW / 2);
        const yShift = bendAmount * (1 - normX * normX);
        ctx.lineTo(rectX + x, rectY + rectH + yShift);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      for (let x = 0; x < rectW; x++) {
        const targetDX = x - rectW / 2;
        const normX = targetDX / (rectW / 2);
        
        const sinTheta = normX * sinThetaMax;
        const theta = Math.asin(sinTheta);
        const srcNormX = theta / thetaMax;
        const srcX = rectX + (rectW / 2) + srcNormX * (rectW / 2);
        
        const yShift = bendAmount * (1 - normX * normX);
        
        ctx.drawImage(
          offscreen,
          srcX, rectY, 1, rectH,
          rectX + x, rectY + yShift, 1, rectH
        );
      }
    }

    async function startGeneration(productList, forceOverwrite = false) {
      if (isGenerating) return;
      isGenerating = true;
      
      document.getElementById('btnGenerateMissing').disabled = true;
      if (document.getElementById('btnGenerateAll')) {
        document.getElementById('btnGenerateAll').disabled = true;
      }
      progressBarContainer.style.display = 'block';
      previewImg.style.display = 'block';
      
      log(\`Starting generation of \${productList.length} images...\`);
      
      const total = productList.length;
      let count = 0;
      
      await document.fonts.ready;
      log('Web fonts loaded and ready.', 'info');

      for (const product of productList) {
        if (!product.image) {
          log(\`Skipping \${product.name}: no image path specified.\`, 'info');
          continue;
        }
        
        previewTitle.innerText = \`Rendering: \${product.name}\`;
        
        try {
          await renderProduct(product);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          previewImg.src = dataUrl;
          
          const response = await fetch('/api/save-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: product.image,
              dataUrl: dataUrl,
              overwrite: forceOverwrite
            })
          });
          
          const result = await response.json();
          if (result.success) {
            if (result.skipped) {
              log(\`[SKIPPED] \${product.image} (already exists)\`, 'info');
            } else {
              log(\`[SAVED] \${product.image}\`);
            }
          } else {
            throw new Error(result.error || 'Unknown error');
          }
        } catch (err) {
          log(\`Error processing \${product.name}: \${err.message}\`, 'error');
        }
        
        count++;
        const pct = Math.round((count / total) * 100);
        progressBar.style.width = pct + '%';
        document.getElementById('statProgress').innerText = pct + '%';
      }
      
      await endGeneration(count);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auto') === 'true') {
        log('Auto-mode complete. Shutting down server...');
        setTimeout(() => {
          fetch('/api/exit');
        }, 1500);
      }
    }

    async function endGeneration(count) {
      isGenerating = false;
      log(\`Done! Processed \${count} files.\`, 'info');
      previewTitle.innerText = 'Generation Complete!';
      
      document.getElementById('btnGenerateMissing').disabled = false;
      if (document.getElementById('btnGenerateAll')) {
        document.getElementById('btnGenerateAll').disabled = false;
      }
      await loadStatus();
    }

    document.getElementById('btnGenerateMissing').addEventListener('click', () => {
      startGeneration(missingProducts, false);
    });

    document.getElementById('btnGenerateAll').addEventListener('click', () => {
      if (confirm("Are you sure you want to regenerate and overwrite all perfume images? This will fix any naming/image mismatches.")) {
        startGeneration(allProducts, true);
      }
    });

    window.onload = async () => {
      await loadStatus();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auto') === 'true') {
        log('Auto-start generation triggered via url parameter.');
        const forceAll = urlParams.get('force') === 'true';
        if (forceAll) {
          startGeneration(allProducts, true);
        } else if (missingProducts.length > 0) {
          startGeneration(missingProducts, false);
        } else {
          log('No missing products to generate. Exiting...');
          setTimeout(() => {
            fetch('/api/exit');
          }, 1500);
        }
      }
    };
  </script>
</body>
</html>
`;
}
