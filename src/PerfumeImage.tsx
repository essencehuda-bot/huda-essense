import { useState, useEffect } from 'react';
import { ProductData } from './AdminPanel';

type Product = ProductData;

// Global in-memory cache to prevent redrawing the same product multiple times
const imageCache: Record<string, string> = {};

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

// Automatically select the template based on the fragrance's family, name, and notes
function getScentThemeTemplate(product: Product): string {
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
  
  (Object.keys(scores) as Array<keyof typeof scores>).forEach(theme => {
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

  const themeMap: Record<string, string> = {
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

export default function PerfumeImage({ product, className, onClick }: Props) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // If already cached, use the cached data URL immediately
    if (imageCache[product.id]) {
      setSrc(imageCache[product.id]);
      return;
    }

    const baseImgPath = getScentThemeTemplate(product);

    const drawCanvasTemplate = () => {
      // Load the original unique photographed bottle image (.jpeg) as the background template!
      // This preserves the unique bottle shape, cap, shadows, and background photographed in the studio.
      const bgSrc = (product.image && !product.image.startsWith('data:image/'))
        ? product.image.replace(/\.png$/, '.jpeg')
        : (product.image || baseImgPath);

      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSrc(baseImgPath);
          return;
        }

        // Draw the background image at its native dimensions
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Ensure full opacity for drawing the sticker
        ctx.globalAlpha = 1.0;

        // Uniform scale factor based on vertical height to preserve aspect ratio of the label on unstretched bottles
        const scale = img.height / 1024;

        // Setup offscreen canvas for flat label drawing (to be warped later)
        const offscreen = document.createElement('canvas');
        offscreen.width = img.width;
        offscreen.height = img.height;
        const oCtx = offscreen.getContext('2d');
        if (!oCtx) {
          setSrc(baseImgPath);
          return;
        }

        const centerX = img.width / 2;
        const rectW = 380 * scale;
        const rectH = 330 * scale;
        const rectX = centerX - rectW / 2;
        const rectY = 460 * scale;

        const drawRoundedRect = (
          c: CanvasRenderingContext2D,
          x: number,
          y: number,
          width: number,
          height: number,
          radius: number
        ) => {
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

        const drawLeafLogo = (c: CanvasRenderingContext2D, cx: number, cy: number) => {
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
          const drawLeaf = (x: number, y: number, w: number, h: number, angle: number) => {
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

          // Top center leaf (slightly larger)
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

        // 1. Draw Leaf Logo (shifted up slightly for larger label)
        drawLeafLogo(oCtx, centerX, 502 * scale);

        // 2. Draw "HUDA" brand name (gold, bold serif, scaled up for high readability)
        oCtx.textAlign = 'center';
        oCtx.textBaseline = 'middle';
        oCtx.fillStyle = goldGrad;
        oCtx.font = `bold ${Math.round(48 * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (1.2 * scale) + 'px';
        }
        oCtx.fillText('HUDA', centerX, 550 * scale);

        // 3. Draw "— ESSENCE —" (gold, bold, scaled up for high readability)
        oCtx.fillStyle = goldGrad;
        oCtx.font = `bold ${Math.round(16 * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (5.5 * scale) + 'px';
        }
        oCtx.fillText('— ESSENCE —', centerX, 588 * scale);

        // Reset letter spacing
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = '0px';
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
        oCtx.font = `bold ${Math.round(13 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        oCtx.fillStyle = goldGrad;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (2.2 * scale) + 'px';
        }
        const inspiredText = 'INSPIRED BY';
        oCtx.fillText(inspiredText, centerX, 650 * scale);

        // Measure text for flanking lines
        const inspiredWidth = oCtx.measureText(inspiredText).width;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = '0px';
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
        let lines: string[] = [];
        const maxWidth = rectW - 40 * scale;

        // Try sizes from 28 down to 16 to find the one that fits nicely and stays bold
        for (let size = 28; size >= 16; size -= 1) {
          oCtx.font = `bold ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
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
        oCtx.font = `bold ${Math.round(fontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
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

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          imageCache[product.id] = dataUrl;
          setSrc(dataUrl);
        } catch (err) {
          console.error('Failed to export canvas image:', err);
          setSrc(baseImgPath);
        }
      };

      img.onerror = () => {
        console.error('Failed to load background image:', bgSrc);
        setSrc(baseImgPath);
      };

      // Set src after setting up handlers to prevent race condition
      img.src = bgSrc;
    };

    // Always draw dynamically on the client-side to apply the premium label design directly
    const isPreRendered = false;

    if (isPreRendered) {
      const img = new Image();
      img.onload = () => {
        imageCache[product.id] = product.image;
        setSrc(product.image);
      };
      img.onerror = () => {
        drawCanvasTemplate();
      };
      img.src = product.image;
    } else {
      drawCanvasTemplate();
    }
  }, [product]);

  return src ? (
    <img src={src} alt={product.name} className={className} onClick={onClick} />
  ) : (
    // Fallback: render the empty base image while canvas is drawing
    <div className={`bg-[#f0ece4] animate-pulse ${className}`} onClick={onClick} />
  );
}
