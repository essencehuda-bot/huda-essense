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

// Fallback template selection (only used if product.image is missing)
function getScentThemeTemplate(product: Product): string {
  const family = (product.family || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const mood = (product.mood || '').toLowerCase();
  const story = (product.story || '').toLowerCase();
  const topNotes = (product.top || []).map(n => n.toLowerCase());
  const heartNotes = (product.heart || []).map(n => n.toLowerCase());
  const baseNotes = (product.base || []).map(n => n.toLowerCase());

  const allText = [family, name, mood, story, ...topNotes, ...heartNotes, ...baseNotes].join(' ');

  const scores: Record<string, number> = {
    woody: 0, leather: 0, aquatic: 0, spicy: 0,
    green: 0, white_floral: 0, fruity: 0, floral: 0
  };

  const keywords: Record<string, string[]> = {
    woody: ['wood', 'oud', 'cedar', 'sandalwood', 'patchouli', 'vetiver', 'birch', 'incense', 'tobacco', 'amberwood', 'smoky', 'guaiac', 'cypress'],
    leather: ['leather', 'suede', 'animalic', 'caban'],
    aquatic: ['aquatic', 'marine', 'sea', 'calone', 'ocean', 'water', 'salt', 'ozone', 'ozonic'],
    spicy: ['vanilla', 'vanille', 'spicy', 'spice', 'amber', 'cinnamon', 'cardamom', 'clove', 'nutmeg', 'ginger', 'tonka', 'meringue', 'chestnut', 'caramel', 'khamrah', 'warm', 'cocoa', 'coffee'],
    green: ['green', 'herbal', 'basil', 'sage', 'violet leaf', 'galbanum', 'grass', 'ivy', 'mint', 'oakmoss', 'aromatic', 'tweed'],
    white_floral: ['jasmine', 'neroli', 'orange blossom', 'tuberose', 'gardenia', 'lily', 'freesia', 'magnolia', 'white floral', 'orange flower', 'bloom'],
    fruity: ['fruity', 'sweet', 'cherry', 'peach', 'apple', 'pineapple', 'pear', 'strawberry', 'raspberry', 'blackcurrant', 'berry', 'berries', 'melon', 'coconut', 'gourmand', 'plum', 'mandarin', 'citrus', 'orange', 'grapefruit', 'lemon', 'lime', 'bergamot'],
    floral: ['floral', 'rose', 'peony', 'iris', 'orchid', 'violet', 'geranium', 'lavender', 'blossom', 'flower', 'petal', 'petals', 'flora']
  };

  const weights: Record<string, number> = {
    woody: 2.5, leather: 5, aquatic: 4, spicy: 2.5,
    green: 2.5, white_floral: 3, fruity: 1.5, floral: 2.2
  };

  Object.keys(keywords).forEach(theme => {
    keywords[theme].forEach(k => { if (allText.includes(k)) scores[theme] += weights[theme]; });
  });

  if (family.includes('wood') || family.includes('oud')) scores.woody += 5;
  if (family.includes('leather')) scores.leather += 8;
  if (family.includes('aquatic') || family.includes('marine')) scores.aquatic += 5;
  if (family.includes('spicy') || family.includes('amber') || family.includes('oriental')) scores.spicy += 5;
  if (family.includes('green') || family.includes('herbal')) scores.green += 5;
  if (family.includes('white floral') || family.includes('jasmine')) scores.white_floral += 5;
  else if (family.includes('floral') || family.includes('rose')) scores.floral += 4;
  if (family.includes('fruity') || family.includes('sweet') || family.includes('gourmand')) scores.fruity += 5;

  let maxScore = -1;
  let selectedTheme = 'floral';
  Object.keys(scores).forEach(theme => {
    if (scores[theme] > maxScore) { maxScore = scores[theme]; selectedTheme = theme; }
  });

  if (maxScore <= 0) {
    if (product.gender === 'Men') return '/images/base_aquatic.png';
    if (product.gender === 'Women') return '/images/base_floral.png';
    return '/images/base_spicy.png';
  }

  const themeMap: Record<string, string> = {
    woody: '/images/base_woody.png', leather: '/images/base_leather.png',
    aquatic: '/images/base_aquatic.png', spicy: '/images/base_spicy.png',
    green: '/images/base_green.png', white_floral: '/images/base_white_floral.png',
    fruity: '/images/base_fruity.png', floral: '/images/base_floral.png',
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

    const fallbackPath = getScentThemeTemplate(product);

    const drawBrandingOnBottle = () => {
      // Load the ORIGINAL product image — preserves the exact bottle
      const originalImageSrc = (product.image && !product.image.startsWith('data:image/'))
        ? product.image
        : fallbackPath;

      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setSrc(originalImageSrc); return; }

        // 1. Draw the ORIGINAL product bottle photograph — everything preserved
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const scale = img.height / 1024;
        const centerX = img.width / 2;

        // ══════════════════════════════════════════════════════════
        // OFFSCREEN CANVAS: Draw flat luxury label to warp onto bottle
        // ══════════════════════════════════════════════════════════
        const offscreen = document.createElement('canvas');
        offscreen.width = img.width;
        offscreen.height = img.height;
        const oCtx = offscreen.getContext('2d');
        if (!oCtx) { setSrc(originalImageSrc); return; }

        // Label dimensions — covers the original branding area
        const rectW = 340 * scale;
        const rectH = 310 * scale;
        const rectX = centerX - rectW / 2;
        const rectY = 440 * scale;

        // Rounded rect helper
        const drawRoundedRect = (
          c: CanvasRenderingContext2D,
          x: number, y: number, w: number, h: number, r: number
        ) => {
          c.beginPath();
          c.moveTo(x + r, y);
          c.arcTo(x + w, y, x + w, y + h, r);
          c.arcTo(x + w, y + h, x, y + h, r);
          c.arcTo(x, y + h, x, y, r);
          c.arcTo(x, y, x + w, y, r);
          c.closePath();
        };

        // ──────── Metallic gold gradients ────────
        const goldGrad = oCtx.createLinearGradient(rectX, rectY, rectX + rectW, rectY + rectH);
        goldGrad.addColorStop(0, '#8a6d2f');
        goldGrad.addColorStop(0.2, '#c9993f');
        goldGrad.addColorStop(0.4, '#d4a95a');
        goldGrad.addColorStop(0.5, '#e8c06a');
        goldGrad.addColorStop(0.6, '#d4a95a');
        goldGrad.addColorStop(0.8, '#c9993f');
        goldGrad.addColorStop(1, '#8a6d2f');

        const goldLight = oCtx.createLinearGradient(rectX, rectY + rectH * 0.3, rectX + rectW, rectY + rectH * 0.7);
        goldLight.addColorStop(0, '#b08d46');
        goldLight.addColorStop(0.5, '#d4a95a');
        goldLight.addColorStop(1, '#b08d46');

        // ──────── BLACK LABEL BACKGROUND (covers old branding) ────────
        const labelBg = oCtx.createLinearGradient(rectX, 0, rectX + rectW, 0);
        labelBg.addColorStop(0, '#080808');
        labelBg.addColorStop(0.1, '#0f0f0f');
        labelBg.addColorStop(0.5, '#181818');
        labelBg.addColorStop(0.9, '#0f0f0f');
        labelBg.addColorStop(1, '#080808');

        oCtx.fillStyle = labelBg;
        drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 12 * scale);
        oCtx.fill();

        // Outer gold border
        oCtx.strokeStyle = goldGrad;
        oCtx.lineWidth = 1.6 * scale;
        drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 12 * scale);
        oCtx.stroke();

        // Inner gold border (inset)
        oCtx.lineWidth = 0.45 * scale;
        drawRoundedRect(oCtx, rectX + 6 * scale, rectY + 6 * scale, rectW - 12 * scale, rectH - 12 * scale, 8 * scale);
        oCtx.stroke();

        // Text setup
        oCtx.textAlign = 'center';
        oCtx.textBaseline = 'middle';
        oCtx.shadowColor = 'rgba(212, 169, 90, 0.18)';
        oCtx.shadowBlur = 2 * scale;
        oCtx.shadowOffsetX = 0;
        oCtx.shadowOffsetY = 0.5 * scale;

        // ─── 1. HE Monogram + atomizer icon ───
        const monoY = rectY + rectH * 0.18;
        const monoSize = Math.round(rectH * 0.15);

        oCtx.font = `600 ${monoSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        oCtx.fillStyle = goldGrad;
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = '0px';
        oCtx.fillText('H', centerX - monoSize * 0.28, monoY);
        oCtx.fillStyle = goldLight;
        oCtx.fillText('E', centerX + monoSize * 0.30, monoY);

        // Atomizer icon
        oCtx.save();
        oCtx.fillStyle = goldGrad;
        oCtx.strokeStyle = goldGrad;
        const bx = centerX - monoSize * 0.04;
        const by = monoY - monoSize * 0.62;
        const bw = monoSize * 0.17;
        const bh = monoSize * 0.28;

        oCtx.lineWidth = 1.0 * scale;
        oCtx.beginPath();
        oCtx.moveTo(bx - bw * 0.7, by);
        oCtx.lineTo(bx - bw * 0.45, by - bh * 0.3);
        oCtx.lineTo(bx + bw * 0.45, by - bh * 0.3);
        oCtx.lineTo(bx + bw * 0.7, by);
        oCtx.lineTo(bx + bw * 0.7, by + bh * 0.55);
        oCtx.lineTo(bx - bw * 0.7, by + bh * 0.55);
        oCtx.closePath();
        oCtx.stroke();

        oCtx.fillRect(bx - bw * 0.3, by - bh * 0.55, bw * 0.6, bh * 0.25);

        oCtx.beginPath();
        oCtx.moveTo(bx, by - bh * 0.55);
        oCtx.lineTo(bx + bw * 0.22, by - bh * 0.65);
        oCtx.lineTo(bx, by - bh * 0.78);
        oCtx.lineTo(bx - bw * 0.22, by - bh * 0.65);
        oCtx.closePath();
        oCtx.fill();
        oCtx.restore();

        // Spray mist (deterministic)
        oCtx.save();
        oCtx.fillStyle = goldGrad;
        const sprayOX = bx + bw * 0.7;
        const sprayOY = by - bh * 0.5;
        let seed = 0;
        for (let i = 0; i < product.id.length; i++) seed = ((seed << 5) - seed + product.id.charCodeAt(i)) | 0;
        const pRand = (s: number) => { s = Math.sin(s) * 43758.5453; return s - Math.floor(s); };
        for (let i = 0; i < 28; i++) {
          const angle = -Math.PI * 0.35 + pRand(seed + i * 7) * (Math.PI * 0.4);
          const dist = (6 + pRand(seed + i * 13) * 24) * scale;
          const dotR = (0.4 + pRand(seed + i * 19) * 0.9) * scale;
          oCtx.globalAlpha = 0.22 + pRand(seed + i * 23) * 0.45;
          oCtx.beginPath();
          oCtx.arc(sprayOX + Math.cos(angle) * dist, sprayOY + Math.sin(angle) * dist, dotR, 0, Math.PI * 2);
          oCtx.fill();
        }
        oCtx.globalAlpha = 1.0;
        oCtx.restore();

        // ─── 2. "HUDA ESSENCE" ───
        const brandY = rectY + rectH * 0.40;
        const brandSize = Math.round(rectH * 0.062);
        oCtx.fillStyle = goldGrad;
        oCtx.font = `600 ${brandSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = (3.5 * scale) + 'px';
        oCtx.fillText('HUDA ESSENCE', centerX, brandY);
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = '0px';

        // ─── 3. Heart + flanking lines ───
        const heartY = rectY + rectH * 0.49;
        const lineLen = rectW * 0.16;
        const hs = rectH * 0.016;

        oCtx.strokeStyle = goldGrad;
        oCtx.lineWidth = 0.8 * scale;
        oCtx.beginPath();
        oCtx.moveTo(centerX - 11 * scale, heartY);
        oCtx.lineTo(centerX - 11 * scale - lineLen, heartY);
        oCtx.stroke();
        oCtx.beginPath();
        oCtx.moveTo(centerX + 11 * scale, heartY);
        oCtx.lineTo(centerX + 11 * scale + lineLen, heartY);
        oCtx.stroke();

        oCtx.save();
        oCtx.fillStyle = goldGrad;
        oCtx.beginPath();
        oCtx.moveTo(centerX, heartY + hs * 0.8);
        oCtx.bezierCurveTo(centerX - hs * 1.3, heartY - hs * 0.2, centerX - hs * 0.7, heartY - hs * 1.0, centerX, heartY - hs * 0.05);
        oCtx.bezierCurveTo(centerX + hs * 0.7, heartY - hs * 1.0, centerX + hs * 1.3, heartY - hs * 0.2, centerX, heartY + hs * 0.8);
        oCtx.closePath();
        oCtx.fill();
        oCtx.restore();

        // ─── 4. "INSPIRED BY" ───
        const inspY = rectY + rectH * 0.58;
        const inspSize = Math.round(rectH * 0.030);
        oCtx.font = `500 ${inspSize}px 'Instrument Sans', 'Arial', sans-serif`;
        oCtx.fillStyle = goldLight;
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = (2.2 * scale) + 'px';
        oCtx.fillText('INSPIRED BY', centerX, inspY);
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = '0px';

        // ─── 5. Dynamic perfume name ───
        const nameText = product.name.toUpperCase();
        const maxW = rectW - 36 * scale;
        const nameTargetY = rectY + rectH * 0.70;

        let fontSize = 22 * scale;
        let lineH = 26 * scale;
        let lines: string[] = [];

        for (let size = 22; size >= 11; size -= 1) {
          oCtx.font = `italic 600 ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
          lines = [];
          const words = nameText.split(/\s+/);
          let curLine = words[0] || '';
          let ok = true;
          for (let i = 1; i < words.length; i++) {
            const test = curLine + ' ' + words[i];
            if (oCtx.measureText(test).width <= maxW) {
              curLine = test;
            } else {
              lines.push(curLine);
              curLine = words[i];
              if (oCtx.measureText(words[i]).width > maxW) ok = false;
            }
          }
          if (curLine) lines.push(curLine);
          if (ok && lines.length <= (nameText.length > 25 ? 3 : 2)) {
            fontSize = size * scale;
            lineH = (size + 4) * scale;
            break;
          }
        }

        oCtx.save();
        oCtx.font = `italic 600 ${Math.round(fontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        oCtx.fillStyle = goldGrad;
        oCtx.shadowColor = 'rgba(212, 169, 90, 0.25)';
        oCtx.shadowBlur = 2.5 * scale;
        const totalH = lines.length * lineH;
        const nameStartY = nameTargetY - totalH / 2 + lineH / 2;
        lines.forEach((line, idx) => {
          oCtx.fillText(line, centerX, nameStartY + idx * lineH);
        });
        oCtx.restore();

        // ─── 6. "EXTRAIT DE PARFUM" ───
        const edpY = rectY + rectH * 0.84;
        oCtx.font = `400 ${Math.round(rectH * 0.023)}px 'Instrument Sans', 'Arial', sans-serif`;
        oCtx.fillStyle = goldLight;
        oCtx.globalAlpha = 0.8;
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = (1.5 * scale) + 'px';
        oCtx.fillText('EXTRAIT DE PARFUM', centerX, edpY);

        // ─── 7. "50ML | 1.7 FL.OZ" ───
        const sizeTextY = rectY + rectH * 0.91;
        oCtx.font = `400 ${Math.round(rectH * 0.019)}px 'Instrument Sans', 'Arial', sans-serif`;
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = (1.2 * scale) + 'px';
        oCtx.fillText('50ML | 1.7 FL.OZ', centerX, sizeTextY);

        // Reset
        oCtx.globalAlpha = 1.0;
        if ('letterSpacing' in oCtx) (oCtx as any).letterSpacing = '0px';
        oCtx.shadowColor = 'transparent';
        oCtx.shadowBlur = 0;

        // ─── Subtle diagonal gloss ───
        oCtx.save();
        drawRoundedRect(oCtx, rectX, rectY, rectW, rectH, 12 * scale);
        oCtx.clip();
        const reflGrad = oCtx.createLinearGradient(rectX, rectY, rectX + rectW, rectY + rectH);
        reflGrad.addColorStop(0, 'rgba(255,255,255,0)');
        reflGrad.addColorStop(0.38, 'rgba(255,255,255,0)');
        reflGrad.addColorStop(0.50, 'rgba(255,255,255,0.045)');
        reflGrad.addColorStop(0.62, 'rgba(255,255,255,0)');
        reflGrad.addColorStop(1, 'rgba(255,255,255,0)');
        oCtx.fillStyle = reflGrad;
        oCtx.beginPath();
        oCtx.moveTo(rectX, rectY);
        oCtx.lineTo(rectX + rectW * 0.6, rectY);
        oCtx.lineTo(rectX + rectW, rectY + rectH);
        oCtx.lineTo(rectX + rectW * 0.4, rectY + rectH);
        oCtx.closePath();
        oCtx.fill();
        oCtx.restore();

        // ══════════════════════════════════════════════════════════
        // WARP label onto main canvas with 3D cylindrical bend
        // ══════════════════════════════════════════════════════════
        ctx.save();
        ctx.shadowColor = 'rgba(15, 10, 5, 0.20)';
        ctx.shadowBlur = 8 * scale;
        ctx.shadowOffsetX = 1 * scale;
        ctx.shadowOffsetY = 2 * scale;

        const bendAmt = 4.0 * scale;
        const thetaMax = 0.36;
        const sinThetaMax = Math.sin(thetaMax);

        // Draw curved background shape
        ctx.fillStyle = '#0e0e0e';
        ctx.beginPath();
        for (let x = 0; x <= rectW; x++) {
          const nX = (x - rectW / 2) / (rectW / 2);
          const yS = bendAmt * (1 - nX * nX);
          if (x === 0) ctx.moveTo(rectX + x, rectY + yS);
          else ctx.lineTo(rectX + x, rectY + yS);
        }
        ctx.lineTo(rectX + rectW, rectY + rectH);
        for (let x = rectW; x >= 0; x--) {
          const nX = (x - rectW / 2) / (rectW / 2);
          const yS = bendAmt * (1 - nX * nX);
          ctx.lineTo(rectX + x, rectY + rectH + yS);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Column-by-column cylindrical warp
        for (let x = 0; x < rectW; x++) {
          const nX = (x - rectW / 2) / (rectW / 2);
          const sinTheta = nX * sinThetaMax;
          const theta = Math.asin(sinTheta);
          const srcNX = theta / thetaMax;
          const srcX = rectX + (rectW / 2) + srcNX * (rectW / 2);
          const yS = bendAmt * (1 - nX * nX);

          ctx.drawImage(
            offscreen,
            srcX, rectY, 1, rectH,
            rectX + x, rectY + yS, 1, rectH
          );
        }

        // ─── Export & cache ───
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          imageCache[product.id] = dataUrl;
          setSrc(dataUrl);
        } catch (err) {
          console.error('Canvas export failed for', product.id, err);
          setSrc(originalImageSrc);
        }
      };

      img.onerror = () => {
        console.error('Failed to load original product image:', originalImageSrc);
        setSrc(fallbackPath);
      };

      img.src = originalImageSrc;
    };

    drawBrandingOnBottle();
  }, [product]);

  return src ? (
    <img src={src} alt={product.name} className={className} onClick={onClick} loading="lazy" />
  ) : (
    <div className={`bg-[#181512] animate-pulse ${className}`} onClick={onClick} />
  );
}
