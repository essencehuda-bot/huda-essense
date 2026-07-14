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
  const normalizedTargets = TARGET_INSPIRED.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  for (const product of products) {
    if (!product.image) continue;
    
    // Check if the product matches our list of target inspired-by perfumes
    const inspiredNormalized = (product.inspiredBy || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameNormalized = (product.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const isTarget = normalizedTargets.some(target => 
      inspiredNormalized.includes(target) || nameNormalized.includes(target)
    );

    if (isTarget) {
      const cleanPath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
      const fullPath = path.join(PUBLIC_DIR, cleanPath);
      
      if (!fs.existsSync(fullPath)) {
        missing.push(product);
      }
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
        const { filename, dataUrl } = JSON.parse(body);
        if (!filename || !dataUrl) {
          throw new Error("Missing filename or dataUrl");
        }

        const cleanPath = filename.startsWith('/') ? filename.slice(1) : filename;
        const filePath = path.join(PUBLIC_DIR, cleanPath);

        // Never overwrite if file already exists
        if (fs.existsSync(filePath)) {
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
        <div class="lbl">Missing Target Images</div>
      </div>
      <div class="stat-card">
        <div class="val" id="statProgress">0%</div>
        <div class="lbl">Progress</div>
      </div>
    </div>

    <div class="controls">
      <button id="btnGenerateMissing" disabled>Generate Missing Images Only</button>
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

      // Theme 2: Woody, Oud, Smoky
      if (
        family.includes('wood') ||
        family.includes('oud') ||
        name.includes('wood') ||
        name.includes('oud') ||
        name.includes('janan') ||
        name.includes('prestige') ||
        name.includes('mood') ||
        mood.includes('smoky') ||
        mood.includes('oriental') ||
        mood.includes('woody')
      ) {
        return '/images/base_woody.png';
      }

      // Theme 1: Fresh & Aquatic
      if (
        family.includes('aquatic') ||
        family.includes('marine') ||
        name.includes('sauvage') ||
        name.includes('bleu') ||
        name.includes('cool water') ||
        name.includes('acqua') ||
        name.includes('hawas') ||
        name.includes('chrome') ||
        name.includes('explorer') ||
        mood.includes('fresh') ||
        mood.includes('aquatic')
      ) {
        return '/images/base_aquatic.png';
      }

      // Theme 3: Warm & Spicy / Amber
      if (
        family.includes('spicy') ||
        family.includes('amber') ||
        name.includes('spicy') ||
        name.includes('vanille') ||
        name.includes('khamrah') ||
        name.includes('asad') ||
        name.includes('code') ||
        name.includes('stronger') ||
        mood.includes('warm') ||
        mood.includes('sweet')
      ) {
        return '/images/base_spicy.png';
      }

      // Theme 6: Bold Leather / Seductive
      if (
        family.includes('leather') ||
        name.includes('leather') ||
        name.includes('black opium') ||
        name.includes('la nuit') ||
        name.includes('desire') ||
        name.includes('eros') ||
        name.includes('1 million') ||
        mood.includes('leather') ||
        mood.includes('nocturnal') ||
        mood.includes('seductive')
      ) {
        return '/images/base_leather.png';
      }

      // Theme 8: Green & Herbal
      if (
        family.includes('green') ||
        family.includes('herbal') ||
        name.includes('tweed') ||
        name.includes('sage') ||
        name.includes('neroli') ||
        name.includes('legend') ||
        name.includes('century')
      ) {
        return '/images/base_green.png';
      }

      // Theme 5: White Floral / Sweet Garden
      if (
        family.includes('white floral') ||
        family.includes('jasmine') ||
        name.includes('bloom') ||
        name.includes('j\\\'adore') ||
        name.includes('blue lady') ||
        name.includes('jasmine') ||
        name.includes('flower') ||
        name.includes('grace')
      ) {
        return '/images/base_white_floral.png';
      }

      // Theme 7: Fruity & Sweet / Gourmand
      if (
        family.includes('fruity') ||
        name.includes('rouge 540') ||
        name.includes('bombshell') ||
        name.includes('yara') ||
        name.includes('good girl') ||
        name.includes('cherry')
      ) {
        return '/images/base_fruity.png';
      }

      // Theme 4: Rich Floral
      if (
        product.gender === 'Women' ||
        family.includes('floral') ||
        name.includes('flora') ||
        name.includes('rose') ||
        name.includes('chance') ||
        name.includes('gabrielle') ||
        name.includes('yellow diamond') ||
        name.includes('bright crystal')
      ) {
        return '/images/base_floral.png';
      }

      // Default fallbacks by gender
      if (product.gender === 'Men') {
        return '/images/base_aquatic.png';
      } else if (product.gender === 'Women') {
        return '/images/base_floral.png';
      } else {
        return '/images/base_spicy.png';
      }
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
      
      const centerX = 511;

      // Label Bounding Box details exactly matching reference
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Label box size: 382 x 218px
      const rectX = centerX - 191;
      const rectY = 485;
      
      // Paint white-cream label background to matches YSL template
      ctx.fillStyle = '#f8f5ee';
      ctx.fillRect(rectX, rectY, 382, 218);
      
      // Draw sublte gray border around label
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(28, 28, 28, 0.08)';
      ctx.strokeRect(rectX, rectY, 382, 218);

      // --- Draw "HUDA ESSENCE" Header ---
      ctx.fillStyle = '#1c1c1c';
      ctx.font = "600 13.5px 'Cormorant Garamond', 'Times New Roman', serif";
      ctx.letterSpacing = '3px';
      ctx.fillText('HUDA ESSENCE', centerX, 514);

      // Divider line
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(28, 28, 28, 0.3)';
      ctx.beginPath();
      ctx.moveTo(centerX - 60, 526);
      ctx.lineTo(centerX + 60, 526);
      ctx.stroke();

      ctx.letterSpacing = '0px';

      // --- Draw Perfume Name ---
      const name = product.name.trim();
      const words = name.split(/\\s+/);
      const lines = [];
      let currentLine = '';
      
      const maxChars = name.length > 20 ? 12 : 9;

      words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length <= maxChars) {
          currentLine = (currentLine + ' ' + word).trim();
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);

      let fontSize = 23;
      let lineHeight = 28;
      
      const maxLineLength = Math.max(...lines.map(l => l.length));
      if (maxLineLength > 12 || lines.length > 3) {
        fontSize = 15;
        lineHeight = 19;
      } else if (maxLineLength > 9 || lines.length > 2) {
        fontSize = 18;
        lineHeight = 22;
      }

      ctx.font = \`700 \smash{\${fontSize}}px 'Cormorant Garamond', 'Times New Roman', serif\`;
      
      const totalNameHeight = lines.length * lineHeight;
      const startY = 582 - (totalNameHeight / 2) + (lineHeight / 2);

      lines.forEach((line, index) => {
        ctx.fillText(line.toUpperCase(), centerX, startY + (index * lineHeight));
      });

      // --- Gender and concentration details ---
      ctx.letterSpacing = '2px';
      ctx.font = "600 10px 'Instrument Sans', 'Arial', sans-serif";
      ctx.fillStyle = 'rgba(28, 28, 28, 0.75)';
      
      let genderText = 'FOR HIM';
      if (product.gender === 'Women') genderText = 'FOR HER';
      else if (product.gender === 'Unisex') genderText = 'FOR UNISEX';
      
      ctx.fillText(genderText, centerX, 642);

      ctx.letterSpacing = '1.5px';
      ctx.font = "500 9px 'Instrument Sans', 'Arial', sans-serif";
      ctx.fillStyle = 'rgba(28, 28, 28, 0.55)';
      
      const concentration = product.concentration ? product.concentration.toUpperCase() : 'EAU DE PARFUM';
      ctx.fillText(concentration, centerX, 658);

      // --- Vol Size details ---
      ctx.font = "500 8.5px 'Instrument Sans', 'Arial', sans-serif";
      ctx.fillText('50ML', centerX, 674);
    }

    async function startGeneration(productList) {
      if (isGenerating) return;
      isGenerating = true;
      
      document.getElementById('btnGenerateMissing').disabled = true;
      progressBarContainer.style.display = 'block';
      previewImg.style.display = 'block';
      
      log(\`Starting generation of \smash{\${productList.length}} target images...\`);
      
      const total = productList.length;
      let count = 0;
      
      await document.fonts.ready;
      log('Web fonts loaded and ready.', 'info');

      for (const product of productList) {
        if (!product.image) {
          log(\`Skipping \smash{\${product.name}}: no image path specified.\`, 'info');
          continue;
        }
        
        previewTitle.innerText = \`Rendering: \smash{\${product.name}}\`;
        
        try {
          await renderProduct(product);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          previewImg.src = dataUrl;
          
          const response = await fetch('/api/save-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: product.image,
              dataUrl: dataUrl
            })
          });
          
          const result = await response.json();
          if (result.success) {
            if (result.skipped) {
              log(\`[SKIPPED] \smash{\${product.image}} (protected original)\`, 'info');
            } else {
              log(\`[SAVED] \smash{\${product.image}}\`);
            }
          } else {
            throw new Error(result.error || 'Unknown error');
          }
        } catch (err) {
          log(\`Error processing \smash{\${product.name}}: \smash{\${err.message}}\`, 'error');
        }
        
        count++;
        const pct = Math.round((count / total) * 100);
        progressBar.style.width = pct + '%';
        document.getElementById('statProgress').innerText = pct + '%';
      }
      
      isGenerating = false;
      log(\`Done! Processed \smash{\${count}} files.\`, 'info');
      previewTitle.innerText = 'Generation Complete!';
      
      await loadStatus();
    }

    document.getElementById('btnGenerateMissing').addEventListener('click', () => {
      startGeneration(missingProducts);
    });

    window.onload = () => {
      loadStatus();
    };
  </script>
</body>
</html>
`;
}
