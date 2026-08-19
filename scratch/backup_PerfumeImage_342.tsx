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
      // ═══════════════════════════════════════════════════════════════════
      // CRITICAL: Load the ORIGINAL product image — never replace the bottle
      // The product.image is the SOURCE OF TRUTH for the bottle photograph.
      // We only overlay Huda Essence gold branding on the label area.
      // ═══════════════════════════════════════════════════════════════════
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

        // 1. Draw the ORIGINAL product bottle photograph at full native resolution
        //    This preserves: bottle shape, cap, glass, liquid, reflections,
        //    shadows, background, lighting, camera angle, perspective — EVERYTHING.
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Scale factor based on image height for responsive label sizing
        const scale = img.height / 1024;
        const centerX = img.width / 2;

        // ══════════════════════════════════════════════════════════════════
        // DIRECT-TO-GLASS GOLD BRANDING (Reference style: gold foil print)
        //
        // NO black rectangle. NO border. NO sticker background.
        // Gold text is drawn directly onto the existing bottle glass surface
        // with transparency so the bottle shows through — like real gold
        // foil printing on glass.
        // ══════════════════════════════════════════════════════════════════

        // Label zone — centered on the bottle body (middle vertical third)
        const labelTop = img.height * 0.38;
        const labelBottom = img.height * 0.78;
        const labelHeight = labelBottom - labelTop;

        // Rich metallic gold gradient matching the reference image's foil print
        const goldGrad = ctx.createLinearGradient(
          centerX - 140 * scale, labelTop,
          centerX + 140 * scale, labelBottom
        );
        goldGrad.addColorStop(0, '#8c6b2b');
        goldGrad.addColorStop(0.18, '#c9993f');
        goldGrad.addColorStop(0.38, '#f3d27a');
        goldGrad.addColorStop(0.50, '#ffe89e');
        goldGrad.addColorStop(0.62, '#f3d27a');
        goldGrad.addColorStop(0.82, '#c9993f');
        goldGrad.addColorStop(1, '#8c6b2b');

        // Secondary slightly muted gold for smaller text
        const goldLight = ctx.createLinearGradient(
          centerX - 100 * scale, labelTop + labelHeight * 0.3,
          centerX + 100 * scale, labelBottom
        );
        goldLight.addColorStop(0, '#b88d3e');
        goldLight.addColorStop(0.5, '#f5d688');
        goldLight.addColorStop(1, '#b88d3e');

        // Setup text rendering for direct glass print appearance
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtle warm glow simulating metallic foil catching studio light
        ctx.shadowColor = 'rgba(180, 150, 80, 0.35)';
        ctx.shadowBlur = 2.0 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0.5 * scale;

        // 92% opacity — lets the bottle glass subtly show through the gold,
        // creating the "printed on glass" effect rather than "sticker on top"
        ctx.globalAlpha = 0.92;

        // ─── 1. HE MONOGRAM ───
        const monoY = labelTop + labelHeight * 0.12;
        const monoSize = Math.round(labelHeight * 0.18);

        ctx.font = `600 ${monoSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';
        ctx.fillText('H', centerX - monoSize * 0.28, monoY);
        ctx.fillStyle = goldLight;
        ctx.fillText('E', centerX + monoSize * 0.30, monoY);

        // Perfume atomizer icon above monogram
        ctx.save();
        ctx.fillStyle = goldGrad;
        ctx.strokeStyle = goldGrad;
        const bx = centerX - monoSize * 0.03;
        const by = monoY - monoSize * 0.60;
        const bw = monoSize * 0.16;
        const bh = monoSize * 0.26;

        ctx.lineWidth = 1.0 * scale;
        ctx.beginPath();
        ctx.moveTo(bx - bw * 0.7, by);
        ctx.lineTo(bx - bw * 0.45, by - bh * 0.3);
        ctx.lineTo(bx + bw * 0.45, by - bh * 0.3);
        ctx.lineTo(bx + bw * 0.7, by);
        ctx.lineTo(bx + bw * 0.7, by + bh * 0.55);
        ctx.lineTo(bx - bw * 0.7, by + bh * 0.55);
        ctx.closePath();
        ctx.stroke();

        ctx.fillRect(bx - bw * 0.3, by - bh * 0.55, bw * 0.6, bh * 0.25);

        ctx.beginPath();
        ctx.moveTo(bx, by - bh * 0.55);
        ctx.lineTo(bx + bw * 0.22, by - bh * 0.65);
        ctx.lineTo(bx, by - bh * 0.78);
        ctx.lineTo(bx - bw * 0.22, by - bh * 0.65);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Spray mist dots (deterministic seed from product id for consistency)
        ctx.save();
        ctx.fillStyle = goldGrad;
        const sprayOX = bx + bw * 0.7;
        const sprayOY = by - bh * 0.5;
        // Use a simple deterministic pseudo-random based on product id
        let seed = 0;
        for (let i = 0; i < product.id.length; i++) seed = ((seed << 5) - seed + product.id.charCodeAt(i)) | 0;
        const pseudoRandom = (s: number) => {
          s = Math.sin(s) * 43758.5453;
          return s - Math.floor(s);
        };
        for (let i = 0; i < 28; i++) {
          const angle = -Math.PI * 0.35 + pseudoRandom(seed + i * 7) * (Math.PI * 0.4);
          const dist = (6 + pseudoRandom(seed + i * 13) * 24) * scale;
          const dotR = (0.4 + pseudoRandom(seed + i * 19) * 0.9) * scale;
          ctx.globalAlpha = 0.22 + pseudoRandom(seed + i * 23) * 0.45;
          ctx.beginPath();
          ctx.arc(sprayOX + Math.cos(angle) * dist, sprayOY + Math.sin(angle) * dist, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.92;
        ctx.restore();

        // ─── 2. "HUDA ESSENCE" BRAND TITLE ───
        const brandY = labelTop + labelHeight * 0.32;
        const brandSize = Math.round(labelHeight * 0.065);
        ctx.font = `700 ${brandSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (3.5 * scale) + 'px';
        ctx.fillText('HUDA ESSENCE', centerX, brandY);
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';

        // ─── 3. HEART ORNAMENT WITH FLANKING GOLD LINES ───
        const heartY = labelTop + labelHeight * 0.40;
        const lineLen = 55 * scale;
        const hs = labelHeight * 0.016;

        ctx.strokeStyle = goldGrad;
        ctx.lineWidth = 0.8 * scale;
        // Left line
        ctx.beginPath();
        ctx.moveTo(centerX - 11 * scale, heartY);
        ctx.lineTo(centerX - 11 * scale - lineLen, heartY);
        ctx.stroke();
        // Right line
        ctx.beginPath();
        ctx.moveTo(centerX + 11 * scale, heartY);
        ctx.lineTo(centerX + 11 * scale + lineLen, heartY);
        ctx.stroke();

        // Center heart
        ctx.save();
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.moveTo(centerX, heartY + hs * 0.8);
        ctx.bezierCurveTo(centerX - hs * 1.3, heartY - hs * 0.2, centerX - hs * 0.7, heartY - hs * 1.0, centerX, heartY - hs * 0.05);
        ctx.bezierCurveTo(centerX + hs * 0.7, heartY - hs * 1.0, centerX + hs * 1.3, heartY - hs * 0.2, centerX, heartY + hs * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ─── 4. "INSPIRED BY" ───
        const inspY = labelTop + labelHeight * 0.50;
        const inspSize = Math.round(labelHeight * 0.030);
        ctx.font = `600 ${inspSize}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldLight;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (2.2 * scale) + 'px';
        ctx.fillText('INSPIRED BY', centerX, inspY);
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';

        // ─── 5. DYNAMIC PERFUME NAME (each product's own unique name) ───
        const nameText = product.name;
        const maxTextW = 240 * scale;
        const nameTargetY = labelTop + labelHeight * 0.62;

        let nameFontSize = 22 * scale;
        let nameLineH = 26 * scale;
        let nameLines: string[] = [];

        for (let size = 22; size >= 11; size -= 1) {
          ctx.font = `italic 600 ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
          nameLines = [];
          const words = nameText.split(/\s+/);
          let curLine = words[0] || '';
          let fits = true;

          for (let i = 1; i < words.length; i++) {
            const test = curLine + ' ' + words[i];
            if (ctx.measureText(test).width <= maxTextW) {
              curLine = test;
            } else {
              nameLines.push(curLine);
              curLine = words[i];
              if (ctx.measureText(words[i]).width > maxTextW) fits = false;
            }
          }
          if (curLine) nameLines.push(curLine);

          if (fits && nameLines.length <= (nameText.length > 25 ? 3 : 2)) {
            nameFontSize = size * scale;
            nameLineH = (size + 4) * scale;
            break;
          }
        }

        ctx.save();
        ctx.font = `italic 600 ${Math.round(nameFontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        ctx.shadowColor = 'rgba(200, 170, 80, 0.40)';
        ctx.shadowBlur = 2.5 * scale;

        const totalNameH = nameLines.length * nameLineH;
        const nameStartY = nameTargetY - totalNameH / 2 + nameLineH / 2;
        nameLines.forEach((line, idx) => {
          ctx.fillText(line, centerX, nameStartY + idx * nameLineH);
        });
        ctx.restore();

        // ─── 6. "EXTRAIT DE PARFUM" ───
        const edpY = labelTop + labelHeight * 0.78;
        ctx.font = `500 ${Math.round(labelHeight * 0.023)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldLight;
        ctx.globalAlpha = 0.80;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (1.5 * scale) + 'px';
        ctx.fillText('EXTRAIT DE PARFUM', centerX, edpY);

        // ─── 7. "50ML | 1.7 FL.OZ" ───
        const sizeY = edpY + 14 * scale;
        ctx.font = `400 ${Math.round(labelHeight * 0.019)}px 'Instrument Sans', 'Arial', sans-serif`;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (1.2 * scale) + 'px';
        ctx.fillText('50ML | 1.7 FL.OZ', centerX, sizeY);

        // Reset canvas state
        ctx.globalAlpha = 1.0;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // ─── Export & cache ───
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.93);
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
