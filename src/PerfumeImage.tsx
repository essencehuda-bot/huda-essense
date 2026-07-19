import { useState, useEffect } from 'react';
import { ProductData } from './AdminPanel';

type Product = ProductData;

// Global in-memory cache to prevent redrawing the same product multiple times
const imageCache: Record<string, string> = {};

interface Props {
  product: Product;
  className?: string;
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

export default function PerfumeImage({ product, className }: Props) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // If already cached, use the cached data URL immediately
    if (imageCache[product.id]) {
      setSrc(imageCache[product.id]);
      return;
    }

    const baseImgPath = getScentThemeTemplate(product);

    const drawCanvasTemplate = () => {
      // If it's a custom data image, draw on top of it. Otherwise draw on top of base template.
      const bgSrc = (product.image && product.image.startsWith('data:image/'))
        ? product.image
        : baseImgPath;

      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSrc(baseImgPath);
          return;
        }

        // Draw the background image
        ctx.drawImage(img, 0, 0, 1024, 1024);

        // Ensure full opacity for drawing the sticker
        ctx.globalAlpha = 1.0;

        // Center X
        const centerX = 512;

        const drawRoundedRect = (
          x: number,
          y: number,
          width: number,
          height: number,
          radius: number
        ) => {
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

        const drawLeafLogo = (cx: number, cy: number) => {
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
          const drawLeaf = (x: number, y: number, w: number, h: number, angle: number) => {
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
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '1px';
        }
        ctx.fillText('HUDA', centerX, 562);

        // 3. Draw "— ESSENCE —"
        ctx.font = "600 12.5px 'Cormorant Garamond', 'Times New Roman', serif";
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '5px';
        }
        ctx.fillText('ESSENCE', centerX, 595);

        // Reset letter spacing
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }

        // 4. Draw separator line with diamond (centered Y = 625)
        ctx.beginPath();
        ctx.moveTo(centerX - 40, 625);
        ctx.lineTo(centerX + 40, 625);
        ctx.strokeStyle = 'rgba(28, 28, 28, 0.22)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, 621);
        ctx.lineTo(centerX + 4, 625);
        ctx.lineTo(centerX, 629);
        ctx.lineTo(centerX - 4, 625);
        ctx.closePath();
        ctx.fillStyle = goldGrad;
        ctx.fill();

        // 5. Draw "INSPIRED BY" (rich gold, bold, centered Y = 658)
        ctx.font = "700 10.5px 'Instrument Sans', 'Arial', sans-serif";
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '2px';
        }
        ctx.fillText('INSPIRED BY', centerX, 658);

        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }

        // 6. Draw clean perfume name (bold, sharp, and title case)
        const cleanName = product.name
          .replace(/\s+(men|women|unisex|pour\s+homme|pour\s+femme|for\s+him|for\s+her)\b/gi, '')
          .trim();

        const words = cleanName.split(/\s+/);
        const lines: string[] = [];
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

        ctx.font = `700 ${fontSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = '#0d0d0d';
        const totalHeight = lines.length * lineHeight;
        // Shift startY down to make space for Inspired By
        const startY = 705 - (totalHeight / 2) + (lineHeight / 2);
        lines.forEach((line, index) => {
          ctx.fillText(line, centerX, startY + (index * lineHeight));
        });

        // 7. Draw Gender (using exact casing from user image: e.g. "Women" or "Men")
        ctx.font = "600 14px 'Cormorant Garamond', 'Times New Roman', serif";
        ctx.fillStyle = '#444444';
        const displayGender = product.gender === 'Women' ? 'Women' : product.gender === 'Men' ? 'Men' : 'Unisex';
        ctx.fillText(displayGender, centerX, 755);

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

    // If it is a pre-rendered static image (like /images/dior-sauvage.png), try to load it directly
    const isPreRendered = product.image && 
                          product.image.startsWith('/images/') && 
                          !product.image.startsWith('/images/base_');

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
    <img src={src} alt={product.name} className={className} />
  ) : (
    // Fallback: render the empty base image while canvas is drawing
    <div className={`bg-[#f0ece4] animate-pulse ${className}`} />
  );
}
