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

        // Ensure full opacity for drawing
        ctx.globalAlpha = 1.0;

        // Uniform scale factor based on vertical height to preserve aspect ratio
        const scale = img.height / 1024;

        const centerX = img.width / 2;

        // ─── Metallic gold gradient for direct-to-glass printing ───
        // Matches the reference image's gold ink appearance
        const goldGrad = ctx.createLinearGradient(
          centerX - 140 * scale, 420 * scale,
          centerX + 140 * scale, 800 * scale
        );
        goldGrad.addColorStop(0, '#d4a95a');    // bright warm gold highlight
        goldGrad.addColorStop(0.15, '#c9993f'); // rich gold
        goldGrad.addColorStop(0.35, '#b08d46'); // warm metallic
        goldGrad.addColorStop(0.55, '#d4a95a'); // re-highlight (glass reflection)
        goldGrad.addColorStop(0.75, '#a07830'); // deeper gold shadow
        goldGrad.addColorStop(1, '#c49a42');    // warm bottom

        // Slightly lighter gold for secondary/smaller text
        const goldGradLight = ctx.createLinearGradient(
          centerX - 100 * scale, 450 * scale,
          centerX + 100 * scale, 780 * scale
        );
        goldGradLight.addColorStop(0, '#c9993f');
        goldGradLight.addColorStop(0.3, '#d4a95a');
        goldGradLight.addColorStop(0.6, '#b08d46');
        goldGradLight.addColorStop(1, '#c49a42');

        // ─── Text rendering settings for glass-printed feel ───
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Slight transparency so the gold text looks printed INTO the glass, not floating
        ctx.globalAlpha = 0.92;

        // Very subtle glow to simulate gold ink catching light on glass
        ctx.shadowColor = 'rgba(212, 169, 90, 0.25)';
        ctx.shadowBlur = 2 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0.5 * scale;

        // ─── 1. HE Monogram (matching reference logo style) ───
        const monoY = 440 * scale;

        // Draw "H" in gold
        ctx.font = `600 ${Math.round(52 * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }
        ctx.fillText('H', centerX - 12 * scale, monoY);

        // Draw "E" overlapping in slightly brighter gold
        ctx.fillStyle = goldGradLight;
        ctx.fillText('E', centerX + 16 * scale, monoY);

        // ─── Small decorative dots radiating upward (crown/spray accent from reference) ───
        ctx.fillStyle = goldGrad;
        ctx.globalAlpha = 0.65;
        const dotCenterY = monoY - 32 * scale;
        const dotR = 1.4 * scale;
        // Fan of 5 dots above the HE monogram
        for (let i = -2; i <= 2; i++) {
          const dx = i * 10 * scale;
          const dy = Math.abs(i) * 4 * scale;
          ctx.beginPath();
          ctx.arc(centerX + dx, dotCenterY + dy, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
        // Central larger dot
        ctx.beginPath();
        ctx.arc(centerX, dotCenterY - 4 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.92;

        // Small diamond below HE
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.moveTo(centerX, monoY + 28 * scale);
        ctx.lineTo(centerX + 4 * scale, monoY + 32 * scale);
        ctx.lineTo(centerX, monoY + 36 * scale);
        ctx.lineTo(centerX - 4 * scale, monoY + 32 * scale);
        ctx.closePath();
        ctx.fill();

        // ─── 2. HUDA ESSENCE ───
        const brandY = monoY + 62 * scale;
        ctx.font = `600 ${Math.round(28 * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (3.5 * scale) + 'px';
        }
        ctx.fillText('HUDA ESSENCE', centerX, brandY);

        // Reset letter spacing
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }

        // ─── 3. Thin separator line ───
        const sepY = brandY + 26 * scale;
        ctx.strokeStyle = goldGrad;
        ctx.lineWidth = 0.7 * scale;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(centerX - 60 * scale, sepY);
        ctx.lineTo(centerX + 60 * scale, sepY);
        ctx.stroke();
        ctx.globalAlpha = 0.92;

        // ─── 4. INSPIRED BY ───
        const inspY = sepY + 24 * scale;
        ctx.font = `500 ${Math.round(11 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldGradLight;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (2.5 * scale) + 'px';
        }
        ctx.fillText('INSPIRED BY', centerX, inspY);

        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }

        // ─── 5. Product Name (dynamic — uses product.name from data) ───
        // This is the hero text, rendered in elegant script/serif like the reference
        const nameText = product.name;
        const nameAreaTop = inspY + 20 * scale;
        const maxNameWidth = 300 * scale;

        // Auto-size the perfume name to fit within the bottle width
        let nameFontSize = 28 * scale;
        let nameLines: string[] = [];
        let nameLineHeight = 32 * scale;

        for (let size = 28; size >= 14; size -= 1) {
          // Use italic for the product name to match the cursive/script style in reference
          ctx.font = `italic 600 ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
          nameLines = [];
          const words = nameText.split(/\s+/);
          let currentLine = words[0] || '';
          let fits = true;

          for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            if (ctx.measureText(testLine).width <= maxNameWidth) {
              currentLine = testLine;
            } else {
              nameLines.push(currentLine);
              currentLine = words[i];
              if (ctx.measureText(words[i]).width > maxNameWidth) fits = false;
            }
          }
          if (currentLine) nameLines.push(currentLine);

          if (fits && nameLines.length <= (nameText.length > 25 ? 3 : 2)) {
            nameFontSize = size * scale;
            nameLineHeight = (size + 5) * scale;
            break;
          }
        }

        // Draw the perfume name lines
        ctx.font = `italic 600 ${Math.round(nameFontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;

        // Slightly brighter gold glow for the hero name
        ctx.shadowColor = 'rgba(212, 169, 90, 0.3)';
        ctx.shadowBlur = 2.5 * scale;

        const totalNameHeight = nameLines.length * nameLineHeight;
        const nameStartY = nameAreaTop + (nameLineHeight / 2);
        nameLines.forEach((line, index) => {
          ctx.fillText(line, centerX, nameStartY + index * nameLineHeight);
        });

        // Reset shadow
        ctx.shadowColor = 'rgba(212, 169, 90, 0.25)';
        ctx.shadowBlur = 2 * scale;

        // ─── 6. EXTRAIT DE PARFUM ───
        const edpY = nameStartY + totalNameHeight + 18 * scale;
        ctx.font = `400 ${Math.round(9 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldGradLight;
        ctx.globalAlpha = 0.75;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (2 * scale) + 'px';
        }
        ctx.fillText('EXTRAIT DE PARFUM', centerX, edpY);

        // ─── 7. 50ML | 1.7 FL.OZ ───
        const sizeY = edpY + 18 * scale;
        ctx.font = `400 ${Math.round(8 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (1.5 * scale) + 'px';
        }
        ctx.fillText('50ML | 1.7 FL.OZ', centerX, sizeY);

        // ─── Reset all rendering state ───
        ctx.globalAlpha = 1.0;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // ─── Subtle glass reflection streak over the text area ───
        // This makes the gold text feel like it's behind/on the glass surface
        ctx.save();
        ctx.globalAlpha = 0.045;
        const reflGrad = ctx.createLinearGradient(
          centerX - 150 * scale, 400 * scale,
          centerX + 150 * scale, 750 * scale
        );
        reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        reflGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.4)');
        reflGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        reflGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.4)');
        reflGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.moveTo(centerX - 60 * scale, 400 * scale);
        ctx.lineTo(centerX + 60 * scale, 400 * scale);
        ctx.lineTo(centerX + 100 * scale, 780 * scale);
        ctx.lineTo(centerX - 20 * scale, 780 * scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

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

    // Always draw dynamically on the client-side to apply the premium direct-to-glass design
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
    <img src={src} alt={product.name} className={className} onClick={onClick} loading="lazy" />
  ) : (
    // Fallback: render the empty base image while canvas is drawing
    <div className={`bg-[#f0ece4] animate-pulse ${className}`} onClick={onClick} />
  );
}
