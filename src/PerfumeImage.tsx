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

  

  // Theme 2: Woody, Oud, Smoky (the woody background with smoke and incense burner, matching reference)
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

  // Theme 1: Fresh & Aquatic (navy blue bottle, ripples)
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

  // Theme 3: Warm & Spicy / Amber (amber glass, cinnamon/vanilla)
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

  // Theme 6: Bold Leather / Seductive (matte black/purple leather)
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

  // Theme 8: Green & Herbal (emerald green, ferns, daylight)
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

  // Theme 5: White Floral / Sweet Garden (clear glass, jasmine, fresh leaves)
  if (
    family.includes('white floral') ||
    family.includes('jasmine') ||
    name.includes('bloom') ||
    name.includes('j\'adore') ||
    name.includes('blue lady') ||
    name.includes('jasmine') ||
    name.includes('flower') ||
    name.includes('grace')
  ) {
    return '/images/base_white_floral.png';
  }

  // Theme 7: Fruity & Sweet / Gourmand (ruby red, berries, gold flakes)
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

  // Theme 4: Rich Floral (default for women if not matching others: soft pink/peony petals)
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

export default function PerfumeImage({ product, className }: Props) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // If already cached, use the cached data URL immediately
    if (imageCache[product.id]) {
      setSrc(imageCache[product.id]);
      return;
    }

    const drawCanvasTemplate = () => {
      // Determine the background image to draw
      const baseImgPath = getScentThemeTemplate(product);
      // If the image is a custom data URL (uploaded via admin), use it. Otherwise use the base template.
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

        const goldColor = '#7d6132'; // Deep, rich gold/bronze with high contrast

        const drawLeafLogo = (cx: number, cy: number) => {
          ctx.save();
          ctx.fillStyle = goldColor;
          ctx.strokeStyle = goldColor;
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

        // Draw sticker/label background (vertical rectangle 270x340 px, fits perfectly on bottle body)
        const rectW = 270;
        const rectH = 340;
        const rectX = centerX - rectW / 2;
        const rectY = 475;

        // Fill sticker with premium warm cream/ivory paper color
        ctx.fillStyle = '#f9f6f0';
        drawRoundedRect(rectX, rectY, rectW, rectH, 16);
        ctx.fill();

        // Draw outer gold border (thicker for high visibility)
        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 2.2;
        drawRoundedRect(rectX, rectY, rectW, rectH, 16);
        ctx.stroke();

        // Draw inner gold border (inset by 7px)
        ctx.lineWidth = 1.0;
        drawRoundedRect(rectX + 7, rectY + 7, rectW - 14, rectH - 14, 11);
        ctx.stroke();

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

        // 4. Draw separator line with diamond
        ctx.beginPath();
        ctx.moveTo(centerX - 40, 625);
        ctx.lineTo(centerX + 40, 625);
        ctx.strokeStyle = 'rgba(28, 28, 28, 0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, 621);
        ctx.lineTo(centerX + 4, 625);
        ctx.lineTo(centerX, 629);
        ctx.lineTo(centerX - 4, 625);
        ctx.closePath();
        ctx.fillStyle = goldColor;
        ctx.fill();

        // 5. Draw "INSPIRED BY" (rich gold, bold)
        ctx.font = "700 11px 'Instrument Sans', 'Arial', sans-serif";
        ctx.fillStyle = goldColor;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '2px';
        }
        ctx.fillText('INSPIRED BY', centerX, 655);

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
        const startY = 702 - (totalHeight / 2) + (lineHeight / 2);
        lines.forEach((line, index) => {
          ctx.fillText(line, centerX, startY + (index * lineHeight));
        });

        // 7. Draw Gender
        ctx.font = "600 14px 'Cormorant Garamond', 'Times New Roman', serif";
        ctx.fillStyle = '#444444';
        ctx.fillText(product.gender, centerX, 752);

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

    drawCanvasTemplate();
  }, [product]);

  return src ? (
    <img src={src} alt={product.name} className={className} />
  ) : (
    // Fallback: render the empty base image while canvas is drawing
    <div className={`bg-[#f0ece4] animate-pulse ${className}`} />
  );
}
