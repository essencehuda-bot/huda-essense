import { useState, useEffect } from 'react';
import { ProductData } from './AdminPanel';

type Product = ProductData;

// Global in-memory cache to prevent redrawing the same product multiple times
const imageCache: Record<string, string> = {};

// Single bottle base image — the master reference for ALL products
const BOTTLE_BASE = '/images/huda_bottle_base.jpg';

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // If already cached, use the cached data URL immediately
    if (imageCache[product.id]) {
      setSrc(imageCache[product.id]);
      return;
    }

    const drawBottle = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSrc(BOTTLE_BASE);
          return;
        }

        // Draw the bottle base image at native dimensions
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // ─── Scale factor based on image height ───
        const scale = img.height / 1024;
        const centerX = img.width / 2;

        // ─── Metallic gold gradient for all text ───
        // Vertical gradient to simulate lighting on printed gold ink
        const goldGrad = ctx.createLinearGradient(
          centerX - 120 * scale, 380 * scale,
          centerX + 120 * scale, 780 * scale
        );
        goldGrad.addColorStop(0, '#d4a95a');    // bright warm gold highlight
        goldGrad.addColorStop(0.18, '#c9993f'); // rich gold
        goldGrad.addColorStop(0.4, '#b08d46');  // warm metallic center
        goldGrad.addColorStop(0.6, '#d4a95a');  // re-highlight (glass reflection)
        goldGrad.addColorStop(0.8, '#a07830');  // deeper gold shadow
        goldGrad.addColorStop(1, '#c49a42');    // warm bottom

        // Subtle secondary gradient for smaller text (slightly more transparent feel)
        const goldGradLight = ctx.createLinearGradient(
          centerX - 100 * scale, 400 * scale,
          centerX + 100 * scale, 750 * scale
        );
        goldGradLight.addColorStop(0, '#c9993f');
        goldGradLight.addColorStop(0.3, '#d4a95a');
        goldGradLight.addColorStop(0.6, '#b08d46');
        goldGradLight.addColorStop(1, '#c49a42');

        // ─── Text rendering settings for glass-printed feel ───
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.92; // Slight transparency to feel printed INTO the glass

        // Very subtle shadow to simulate depth of printing on glass
        ctx.shadowColor = 'rgba(180, 138, 60, 0.15)';
        ctx.shadowBlur = 1.5 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0.5 * scale;

        // ─── 1. HE Monogram ───
        const monoY = 420 * scale;

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

        // Small decorative diamond below HE
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.moveTo(centerX, monoY + 28 * scale);
        ctx.lineTo(centerX + 4 * scale, monoY + 32 * scale);
        ctx.lineTo(centerX, monoY + 36 * scale);
        ctx.lineTo(centerX - 4 * scale, monoY + 32 * scale);
        ctx.closePath();
        ctx.fill();

        // ─── Small decorative dots radiating from diamond (crown-like accent) ───
        ctx.globalAlpha = 0.7;
        const dotY = monoY - 30 * scale;
        const dotR = 1.5 * scale;
        const dotSpread = 12 * scale;
        for (let i = -2; i <= 2; i++) {
          const dy = Math.abs(i) * 3 * scale;
          ctx.beginPath();
          ctx.arc(centerX + i * dotSpread, dotY + dy, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.92;

        // ─── 2. HUDA ESSENCE ───
        const brandY = monoY + 60 * scale;
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
        const sepY = brandY + 24 * scale;
        ctx.strokeStyle = goldGrad;
        ctx.lineWidth = 0.7 * scale;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(centerX - 55 * scale, sepY);
        ctx.lineTo(centerX + 55 * scale, sepY);
        ctx.stroke();
        ctx.globalAlpha = 0.92;

        // ─── 4. INSPIRED BY ───
        const inspY = sepY + 22 * scale;
        ctx.font = `500 ${Math.round(11 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldGradLight;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (2.5 * scale) + 'px';
        }
        ctx.fillText('INSPIRED BY', centerX, inspY);

        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }

        // ─── 5. Product Name (dynamic from product.name) ───
        const nameText = product.name.toUpperCase();
        const nameAreaTop = inspY + 18 * scale;
        const maxNameWidth = 280 * scale;

        // Auto-size the perfume name to fit
        let nameFontSize = 26 * scale;
        let nameLines: string[] = [];
        let nameLineHeight = 30 * scale;

        for (let size = 26; size >= 14; size -= 1) {
          ctx.font = `700 ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
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

          if (fits && nameLines.length <= (nameText.length > 20 ? 3 : 2)) {
            nameFontSize = size * scale;
            nameLineHeight = (size + 5) * scale;
            break;
          }
        }

        // Draw the perfume name lines
        ctx.font = `700 ${Math.round(nameFontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;

        // Use slightly more visible shadow for the name (it's the hero text)
        ctx.shadowColor = 'rgba(180, 138, 60, 0.2)';
        ctx.shadowBlur = 2 * scale;

        const totalNameHeight = nameLines.length * nameLineHeight;
        const nameStartY = nameAreaTop + (nameLineHeight / 2);
        nameLines.forEach((line, index) => {
          ctx.fillText(line, centerX, nameStartY + index * nameLineHeight);
        });

        // Reset shadow
        ctx.shadowColor = 'rgba(180, 138, 60, 0.15)';
        ctx.shadowBlur = 1.5 * scale;

        // ─── 6. EXTRAIT DE PARFUM ───
        const edpY = nameStartY + totalNameHeight + 14 * scale;
        ctx.font = `400 ${Math.round(9 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldGradLight;
        ctx.globalAlpha = 0.78;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (2 * scale) + 'px';
        }
        ctx.fillText('EXTRAIT DE PARFUM', centerX, edpY);

        // ─── 7. 50ML | 1.7 FL.OZ ───
        const sizeY = edpY + 16 * scale;
        ctx.font = `400 ${Math.round(8 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = (1.5 * scale) + 'px';
        }
        ctx.fillText('50ML | 1.7 FL.OZ', centerX, sizeY);

        // Reset
        ctx.globalAlpha = 1.0;
        if ('letterSpacing' in ctx) {
          (ctx as any).letterSpacing = '0px';
        }
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // ─── Glass reflection overlay ───
        // Subtle diagonal light streak across the text area to simulate glass refraction
        ctx.save();
        ctx.globalAlpha = 0.06;
        const reflGrad = ctx.createLinearGradient(
          centerX - 150 * scale, 380 * scale,
          centerX + 150 * scale, 700 * scale
        );
        reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        reflGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)');
        reflGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        reflGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.6)');
        reflGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.moveTo(centerX - 80 * scale, 380 * scale);
        ctx.lineTo(centerX + 40 * scale, 380 * scale);
        ctx.lineTo(centerX + 80 * scale, 750 * scale);
        ctx.lineTo(centerX - 40 * scale, 750 * scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ─── Export final image ───
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          imageCache[product.id] = dataUrl;
          setSrc(dataUrl);
        } catch (err) {
          console.error('Failed to export canvas image:', err);
          setSrc(BOTTLE_BASE);
        }
      };

      img.onerror = () => {
        console.error('Failed to load bottle base image');
        setSrc(BOTTLE_BASE);
      };

      img.src = BOTTLE_BASE;
    };

    drawBottle();
  }, [product]);

  return src ? (
    <img src={src} alt={product.name} className={className} onClick={onClick} loading="lazy" />
  ) : (
    // Fallback: render a shimmer placeholder while canvas is drawing
    <div className={`bg-[#1a1714] animate-pulse ${className}`} onClick={onClick} />
  );
}
