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
  if (name.includes('vanille') || name.includes('khamrah') || name.includes('asad') || name.includes('code') || name.includes('stronger') || name.includes('9 pm') || name.includes('afnan')) {
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
      img.crossOrigin = 'anonymous';

      img.onload = () => {


        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSrc(baseImgPath);
          return;
        }

        // 1. Draw a soft, premium warm-cream studio vignette background gradient first
        const centerX = img.width / 2;
        const scale = img.height / 1024;
        
        const bgGrad = ctx.createRadialGradient(
          centerX, img.height / 2, 50 * scale,
          centerX, img.height / 2, img.height * 0.7
        );
        bgGrad.addColorStop(0, '#ffffff'); // bright studio center lighting
        bgGrad.addColorStop(1, '#f3eee4'); // soft elegant warm-cream vignette
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, img.width, img.height);

        // 2. Remove the solid white background from the original product bottle photo dynamically
        const offscreenImg = document.createElement('canvas');
        offscreenImg.width = img.width;
        offscreenImg.height = img.height;
        const imgCtx = offscreenImg.getContext('2d');
        if (imgCtx) {
          imgCtx.drawImage(img, 0, 0);
          const imgData = imgCtx.getImageData(0, 0, img.width, img.height);
          const pixels = imgData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // 1. General background removal (around the bottle): very bright white
            const isBrightWhite = r > 235 && g > 235 && b > 235;
            const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
            const isNeutral = maxDiff < 20;

            if (isBrightWhite && isNeutral) {
              const brightness = (r + g + b) / 3;
              // Pure white or light gray background becomes transparent
              const alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) * 4.5)));
              pixels[i + 3] = alpha;
            }
          }
          imgCtx.putImageData(imgData, 0, 0);
          ctx.drawImage(offscreenImg, 0, 0);


        } else {
          // Fallback: draw original image directly if context fails
          ctx.drawImage(img, 0, 0);
        }

        // Ensure full opacity for drawing the sticker
        ctx.globalAlpha = 1.0;



        // Setup offscreen canvas for flat label drawing (to be warped later)
        const offscreen = document.createElement('canvas');
        offscreen.width = img.width;
        offscreen.height = img.height;
        const oCtx = offscreen.getContext('2d');
        if (!oCtx) {
          setSrc(baseImgPath);
          return;
        }

        const rectW = 370 * scale;
        const rectH = 340 * scale;
        const rectX = centerX - rectW / 2;
        const rectY = 455 * scale;

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

        // ══════════ BLACK & GOLD LUXURY LABEL (matching HUDA ESSENCE master reference) ══════════

        // Metallic gold gradient for text, borders, and logo
        const goldGrad = oCtx.createLinearGradient(rectX, rectY, rectX + rectW, rectY + rectH);
        goldGrad.addColorStop(0, '#8a6d2f');
        goldGrad.addColorStop(0.2, '#c9993f');
        goldGrad.addColorStop(0.4, '#d4a95a');
        goldGrad.addColorStop(0.5, '#e8c06a');
        goldGrad.addColorStop(0.6, '#d4a95a');
        goldGrad.addColorStop(0.8, '#c9993f');
        goldGrad.addColorStop(1, '#8a6d2f');

        // Lighter gold for secondary text
        const goldGradLight = oCtx.createLinearGradient(rectX, rectY + rectH * 0.3, rectX + rectW, rectY + rectH * 0.7);
        goldGradLight.addColorStop(0, '#b08d46');
        goldGradLight.addColorStop(0.5, '#d4a95a');
        goldGradLight.addColorStop(1, '#b08d46');

        // ─── Direct-to-glass branding: fully transparent background with no borders ───

        // ─── Setup text rendering ───
        oCtx.textAlign = 'center';
        oCtx.textBaseline = 'middle';
        oCtx.shadowColor = 'rgba(212, 169, 90, 0.18)';
        oCtx.shadowBlur = 2 * scale;
        oCtx.shadowOffsetX = 0;
        oCtx.shadowOffsetY = 0.5 * scale;

        // ═══════ ALL POSITIONS RELATIVE TO STICKER RECT ═══════
        // This ensures the layout scales and fits any bottle size

        // ─── 1. HE Monogram (top 35% of sticker) ───
        const monoY = rectY + rectH * 0.20;
        const monoFontSize = Math.round(rectH * 0.16);

        oCtx.font = `600 ${monoFontSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        oCtx.fillStyle = goldGrad;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = '0px';
        }
        oCtx.fillText('H', centerX - monoFontSize * 0.28, monoY);

        oCtx.fillStyle = goldGradLight;
        oCtx.fillText('E', centerX + monoFontSize * 0.30, monoY);

        // ─── Elegant Gold Crown on top of the HE Monogram ───
        oCtx.save();
        oCtx.fillStyle = goldGrad;
        oCtx.strokeStyle = goldGrad;
        
        const crownX = centerX + monoFontSize * 0.015;
        const crownY = monoY - monoFontSize * 0.52;
        const crownW = monoFontSize * 0.40;
        const crownH = monoFontSize * 0.28;

        oCtx.beginPath();
        // Crown Base
        oCtx.moveTo(crownX - crownW / 2, crownY + crownH / 2);
        oCtx.lineTo(crownX + crownW / 2, crownY + crownH / 2);
        // Right side up
        oCtx.lineTo(crownX + crownW / 2, crownY + crownH / 5);
        // Outer right peak
        oCtx.lineTo(crownX + crownW * 0.35, crownY - crownH / 3);
        // Inner right dip
        oCtx.lineTo(crownX + crownW * 0.18, crownY + crownH / 6);
        // Center main peak
        oCtx.lineTo(crownX, crownY - crownH / 2);
        // Inner left dip
        oCtx.lineTo(crownX - crownW * 0.18, crownY + crownH / 6);
        // Outer left peak
        oCtx.lineTo(crownX - crownW * 0.35, crownY - crownH / 3);
        // Left side down
        oCtx.lineTo(crownX - crownW / 2, crownY + crownH / 5);
        oCtx.closePath();
        oCtx.fill();

        // Jewels/dots on peaks
        oCtx.beginPath();
        oCtx.arc(crownX, crownY - crownH / 2, crownW * 0.07, 0, Math.PI * 2);
        oCtx.arc(crownX - crownW * 0.35, crownY - crownH / 3, crownW * 0.06, 0, Math.PI * 2);
        oCtx.arc(crownX + crownW * 0.35, crownY - crownH / 3, crownW * 0.06, 0, Math.PI * 2);
        oCtx.fill();
        oCtx.restore();

        // ─── 2. "HUDA ESSENCE" brand text (at ~42% of sticker) ───
        const brandY = rectY + rectH * 0.42;
        const brandFontSize = Math.round(rectH * 0.065);
        oCtx.fillStyle = goldGrad;
        oCtx.font = `600 ${brandFontSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (3.5 * scale) + 'px';
        }
        oCtx.fillText('HUDA ESSENCE', centerX, brandY);
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = '0px';
        }

        // ─── 3. Decorative lines with Diamond Divider (at ~50%) ───
        const heartY = rectY + rectH * 0.50;
        const lineLen = rectW * 0.18;
        const hs = rectH * 0.012; // Diamond half-size

        // Left line
        oCtx.strokeStyle = goldGrad;
        oCtx.lineWidth = 0.8 * scale;
        oCtx.beginPath();
        oCtx.moveTo(centerX - 14 * scale, heartY);
        oCtx.lineTo(centerX - 14 * scale - lineLen, heartY);
        oCtx.stroke();
        
        // Right line
        oCtx.beginPath();
        oCtx.moveTo(centerX + 14 * scale, heartY);
        oCtx.lineTo(centerX + 14 * scale + lineLen, heartY);
        oCtx.stroke();

        // Center Diamond (◆)
        oCtx.save();
        oCtx.fillStyle = goldGrad;
        oCtx.beginPath();
        oCtx.moveTo(centerX, heartY - hs);
        oCtx.lineTo(centerX + hs, heartY);
        oCtx.lineTo(centerX, heartY + hs);
        oCtx.lineTo(centerX - hs, heartY);
        oCtx.closePath();
        oCtx.fill();
        oCtx.restore();

        // ─── 4. "INSPIRED BY" (at ~58%) ───
        const inspLabelY = rectY + rectH * 0.59;
        const inspFontSize = Math.round(rectH * 0.032);
        oCtx.font = `500 ${inspFontSize}px 'Instrument Sans', 'Arial', sans-serif`;
        oCtx.fillStyle = goldGradLight;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (2.2 * scale) + 'px';
        }
        oCtx.fillText('INSPIRED BY', centerX, inspLabelY);
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = '0px';
        }

        // ─── 5. Product name — dynamic from product.name (at ~70%) ───
        const nameText = product.name.toUpperCase();
        const maxWidth = rectW - 40 * scale;
        const nameTargetY = rectY + rectH * 0.70;

        let fontSize = 24 * scale;
        let lineHeight = 28 * scale;
        let lines: string[] = [];

        for (let size = 24; size >= 12; size -= 1) {
          oCtx.font = `italic 600 ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
          lines = [];
          const words = nameText.split(/\s+/);
          let currentLine = words[0] || '';
          let ok = true;

          for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + " " + words[i];
            if (oCtx.measureText(testLine).width <= maxWidth) {
              currentLine = testLine;
            } else {
              lines.push(currentLine);
              currentLine = words[i];
              if (oCtx.measureText(words[i]).width > maxWidth) ok = false;
            }
          }
          if (currentLine) lines.push(currentLine);

          if (ok && lines.length <= (nameText.length > 25 ? 3 : 2)) {
            fontSize = size * scale;
            lineHeight = (size + 4) * scale;
            break;
          }
        }

        oCtx.save();
        oCtx.font = `italic 600 ${Math.round(fontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        oCtx.fillStyle = goldGrad;
        oCtx.shadowColor = 'rgba(212, 169, 90, 0.25)';
        oCtx.shadowBlur = 2.5 * scale;

        const totalHeight = lines.length * lineHeight;
        const nameStartY = nameTargetY - totalHeight / 2 + lineHeight / 2;
        lines.forEach((line, index) => {
          oCtx.fillText(line, centerX, nameStartY + (index * lineHeight));
        });
        oCtx.restore();

        // ─── 6. EXTRAIT DE PARFUM (at ~84%) ───
        const edpY = rectY + rectH * 0.84;
        oCtx.font = `400 ${Math.round(rectH * 0.024)}px 'Instrument Sans', 'Arial', sans-serif`;
        oCtx.fillStyle = goldGradLight;
        oCtx.globalAlpha = 0.8;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (1.5 * scale) + 'px';
        }
        oCtx.fillText('EXTRAIT DE PARFUM', centerX, edpY);

        // ─── 7. 50ML | 1.7 FL.OZ (at ~91%) ───
        const sizeTextY = rectY + rectH * 0.91;
        oCtx.font = `400 ${Math.round(rectH * 0.020)}px 'Instrument Sans', 'Arial', sans-serif`;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = (1.2 * scale) + 'px';
        }
        oCtx.fillText('50ML | 1.7 FL.OZ', centerX, sizeTextY);

        // Reset state
        oCtx.globalAlpha = 1.0;
        if ('letterSpacing' in oCtx) {
          (oCtx as any).letterSpacing = '0px';
        }
        oCtx.shadowColor = 'transparent';
        oCtx.shadowBlur = 0;

        // ─── Subtle diagonal gloss reflection ───
        oCtx.save();
        drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 14 * scale);
        oCtx.clip();

        const reflectGrad = oCtx.createLinearGradient(rectX, rectY, rectX + rectW, rectY + rectH);
        reflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        reflectGrad.addColorStop(0.38, 'rgba(255, 255, 255, 0)');
        reflectGrad.addColorStop(0.50, 'rgba(255, 255, 255, 0.05)');
        reflectGrad.addColorStop(0.62, 'rgba(255, 255, 255, 0)');
        reflectGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        oCtx.fillStyle = reflectGrad;
        oCtx.beginPath();
        oCtx.moveTo(rectX, rectY);
        oCtx.lineTo(rectX + rectW * 0.6, rectY);
        oCtx.lineTo(rectX + rectW, rectY + rectH);
        oCtx.lineTo(rectX + rectW * 0.4, rectY + rectH);
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
          const dataUrl = canvas.toDataURL('image/png');
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

    // Images are pre-rendered with AI - load them directly without canvas processing
    const isPreRendered = true;

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
    <img src={src} alt={product.name} className={className} onClick={onClick} loading="lazy" />
  ) : (
    // Fallback: render the empty base image while canvas is drawing
    <div className={`bg-[#f0ece4] animate-pulse ${className}`} onClick={onClick} />
  );
}
