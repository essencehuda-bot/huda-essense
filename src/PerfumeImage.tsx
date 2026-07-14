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
      // Determine the template path
      const baseImgPath = getScentThemeTemplate(product);

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

        // Draw the base bottle image
        ctx.drawImage(img, 0, 0, 1024, 1024);

        // Label Bounding Box coordinates
        const centerX = 511;

        // --- Draw "HUDA ESSENCE" Header ---
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1c1c1c';
        
        // Top Brand Header
        ctx.font = "600 13px 'Cormorant Garamond', 'Times New Roman', serif";
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '3px';
        }
        ctx.fillText('HUDA ESSENCE', centerX, 506);

        // Draw Horizontal Lines on both sides of HUDA ESSENCE
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(28, 28, 28, 0.4)';
        ctx.beginPath();
        ctx.moveTo(432, 506);
        ctx.lineTo(448, 506);
        ctx.moveTo(572, 506);
        ctx.lineTo(588, 506);
        ctx.stroke();

        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }

        // --- Draw Perfume Name ---
        const name = product.name.trim();
        const words = name.split(/\s+/);
        const lines: string[] = [];
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

        ctx.font = `700 ${fontSize}px 'Cormorant Garamond', 'Times New Roman', serif`;
        
        const totalNameHeight = lines.length * lineHeight;
        const startY = 590 - (totalNameHeight / 2) + (lineHeight / 2);

        lines.forEach((line, index) => {
          ctx.fillText(line.toUpperCase(), centerX, startY + (index * lineHeight));
        });

        // --- Draw Gender & Concentration ---
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '2px';
        }
        ctx.font = "600 10.5px 'Instrument Sans', 'Arial', sans-serif";
        ctx.fillStyle = 'rgba(28, 28, 28, 0.75)';
        
        let genderText = 'FOR HIM';
        if (product.gender === 'Women') genderText = 'FOR HER';
        else if (product.gender === 'Unisex') genderText = 'FOR UNISEX';
        
        ctx.fillText(genderText, centerX, 666);

        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '1.5px';
        }
        ctx.font = "500 9.5px 'Instrument Sans', 'Arial', sans-serif";
        ctx.fillStyle = 'rgba(28, 28, 28, 0.55)';
        
        const concentration = product.concentration ? product.concentration.toUpperCase() : 'EAU DE PARFUM';
        ctx.fillText(concentration, centerX, 683);

        // --- Draw Bottom Logo/Signature ---
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '4px';
        }
        ctx.font = "600 10px 'Cormorant Garamond', 'Times New Roman', serif";
        ctx.fillStyle = 'rgba(28, 28, 28, 0.6)';
        ctx.fillText('ATELIER', centerX, 715);

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
        console.error('Failed to load base image:', baseImgPath);
        setSrc(baseImgPath);
      };

      // Set src after setting up handlers to prevent race condition
      img.src = baseImgPath;
    };

    if (product.image) {
      const testImg = new Image();
      testImg.onload = () => {
        imageCache[product.id] = product.image;
        setSrc(product.image);
      };
      testImg.onerror = () => {
        drawCanvasTemplate();
      };
      // Set src after setting up handlers to prevent race condition
      testImg.src = product.image;
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
