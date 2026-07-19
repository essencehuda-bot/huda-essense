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

  // Get status api
  if (req.url === '/api/status' && req.method === 'GET') {
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
  if (req.url === '/api/save-image' && req.method === 'POST') {
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
  if (req.url === '/api/exit') {
    console.log("Exit API called. Shutting down server.");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    setTimeout(() => {
      process.exit(0);
    }, 1000);
    return;
  }

  // Serve public folder assets
  if (req.url.startsWith('/images/')) {
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
  if (req.url === '/' || req.url === '/generator') {
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
        
        log(\`Loaded status. Total scents: \smash{\${data.totalProducts}}, Missing: \smash{\${data.missingCount}}\`);
        
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
      if (name.includes('bloom') || name.includes('j\'adore') || name.includes('blue lady') || name.includes('jasmine') || name.includes('grace')) {
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
      const templatePath = getScentThemeTemplate(product);
      const img = await loadImage(templatePath);
      
      ctx.clearRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      
      // Ensure full opacity for drawing the sticker
      ctx.globalAlpha = 1.0;

      const centerX = 512;

      const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
      };

      // Label sizing (perfectly fitted on the bottle's flat front face)
      const rectW = 270;
      const rectH = 340;
      const rectX = centerX - rectW / 2;
      const rectY = 475;

      // Create metallic gold gradient for foil-like appearance on borders & logo
      const goldGrad = ctx.createLinearGradient(rectX, rectY, rectX + rectW, rectY + rectH);
      goldGrad.addColorStop(0, '#59441a');   // deep gold shadow
      goldGrad.addColorStop(0.22, '#be9f6a'); // warm gold
      goldGrad.addColorStop(0.45, '#f5e4c3'); // bright gold shine
      goldGrad.addColorStop(0.55, '#f5e4c3'); // bright gold shine
      goldGrad.addColorStop(0.78, '#be9f6a'); // warm gold
      goldGrad.addColorStop(1, '#59441a');   // deep gold shadow

      const drawLeafLogo = (cx, cy) => {
        ctx.save();
        ctx.fillStyle = goldGrad;
        ctx.strokeStyle = goldGrad;
        ctx.lineWidth = 2.0; // Bolder stem
        
        // Draw stem
        ctx.beginPath();
        ctx.moveTo(cx, cy + 22);
        ctx.quadraticCurveTo(cx - 2, cy + 5, cx, cy - 15);
        ctx.stroke();
        
        // Helper to draw a single leaf pointing at an angle
        const drawLeaf = (x, y, w, h, angle) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(w / 2, -h / 2, w, 0);
          ctx.quadraticCurveTo(w / 2, h / 2, 0, 0);
          ctx.fill();
          ctx.restore();
        };

        // Top center leaf
        drawLeaf(cx, cy - 15, 14, 7, -Math.PI / 2);
        
        // Upper left leaf
        drawLeaf(cx - 2, cy - 3, 13, 6, -Math.PI * 0.7);
        // Upper right leaf
        drawLeaf(cx + 2, cy - 3, 13, 6, -Math.PI * 0.3);
        
        // Lower left leaf
        drawLeaf(cx - 3, cy + 10, 14, 6.5, -Math.PI * 0.8);
        // Lower right leaf
        drawLeaf(cx + 3, cy + 10, 14, 6.5, -Math.PI * 0.2);
        
        ctx.restore();
      };

      // Draw soft drop shadow for the label to simulate real paper depth on glass
      ctx.shadowColor = 'rgba(15, 10, 5, 0.18)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 3;

      // Cylindrical 3D gradient for label background (simulates bottle curvature & lighting)
      const labelGrad = ctx.createLinearGradient(rectX, 0, rectX + rectW, 0);
      labelGrad.addColorStop(0, '#ebdcc5');    // shadow on left edge
      labelGrad.addColorStop(0.12, '#fbf8f0'); // transition
      labelGrad.addColorStop(0.5, '#ffffff');  // bright highlight in the center
      labelGrad.addColorStop(0.88, '#fbf8f0'); // transition
      labelGrad.addColorStop(1, '#ebdcc5');    // shadow on right edge

      // Fill sticker with premium warm cream/ivory paper color (3D gradient)
      ctx.fillStyle = labelGrad;
      drawRoundedRect(rectX, rectY, rectW, rectH, 16);
      ctx.fill();

      // RESET shadow for borders and text to keep them sharp
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw outer gold border (metallic gold gradient)
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 1.8;
      drawRoundedRect(rectX, rectY, rectW, rectH, 16);
      ctx.stroke();

      // Draw inner gold border (inset by 7px)
      ctx.lineWidth = 0.8;
      drawRoundedRect(rectX + 7, rectY + 7, rectW - 14, rectH - 14, 11);
      ctx.stroke();

      // Overlay a realistic diagonal glass reflection across the label paper
      ctx.save();
      drawRoundedRect(rectX, rectY, rectW, rectH, 16);
      ctx.clip();

      const reflectGrad = ctx.createLinearGradient(rectX, 0, rectX + rectW, 0);
      reflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      reflectGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
      reflectGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.12)'); // soft white reflection highlight
      reflectGrad.addColorStop(0.75, 'rgba(255, 255, 255, 0.02)');
      reflectGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = reflectGrad;
      ctx.beginPath();
      ctx.moveTo(rectX - 100, rectY);
      ctx.lineTo(rectX + rectW, rectY);
      ctx.lineTo(rectX + rectW + 100, rectY + rectH);
      ctx.lineTo(rectX, rectY + rectH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Enable a very subtle letterpress shadow for printed elements to feel physical
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;

      // 1. Draw Leaf Logo
      drawLeafLogo(centerX, 515);

      // 2. Draw "HUDA" brand name (sharp, solid charcoal color)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0d0d0d';
      ctx.font = "bold 38px 'Cormorant Garamond', 'Times New Roman', serif";
      ctx.fillText('HUDA', centerX, 562);

      // 3. Draw "— ESSENCE —"
      ctx.font = "600 12.5px 'Cormorant Garamond', 'Times New Roman', serif";
      ctx.fillText('— ESSENCE —', centerX, 595);

      // 6. Draw clean perfume name (bold, sharp, and title case)
      const cleanName = product.name
        .replace(/\s+(men|women|unisex|pour\s+homme|pour\s+femme|for\s+him|for\s+her)\b/gi, '')
        .trim();

      const words = cleanName.split(/\s+/);
      const lines = [];
      let currentLine = '';
      const maxChars = cleanName.length > 20 ? 14 : 10;
      words.forEach(w => {
        if ((currentLine + ' ' + w).trim().length <= maxChars) {
          currentLine = (currentLine + ' ' + w).trim();
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = w;
        }
      });
      if (currentLine) lines.push(currentLine);

      let fontSize = 21;
      let lineHeight = 25;
      if (lines.length === 2) {
        fontSize = 18;
        lineHeight = 22;
      } else if (lines.length >= 3) {
        fontSize = 15;
        lineHeight = 18;
      }

      ctx.font = \`700 \${fontSize}px 'Cormorant Garamond', 'Times New Roman', serif\`;
      ctx.fillStyle = '#0d0d0d';
      const totalHeight = lines.length * lineHeight;
      const startY = 665 - (totalHeight / 2) + (lineHeight / 2);
      lines.forEach((line, index) => {
        ctx.fillText(line.toUpperCase(), centerX, startY + (index * lineHeight));
      });

      // 7. Draw Gender
      ctx.font = "600 14px 'Cormorant Garamond', 'Times New Roman', serif";
      ctx.fillStyle = '#444444';
      ctx.fillText(product.gender.toUpperCase(), centerX, 735);
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
        if (missingProducts.length > 0) {
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
