import { useState, useEffect } from 'react';
import { ProductData } from './AdminPanel';

type Product = ProductData;

// Global in-memory cache to prevent redrawing the same product multiple times
const imageCache: Record<string, string> = {};

// Master reference clean glass bottle (teal-to-amber ombre, faceted crystal, black cap, zero sticker)
const MASTER_BOTTLE_BASE = '/images/huda_bottle_base.jpg';

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

    const drawDirectToGlassBottle = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSrc(MASTER_BOTTLE_BASE);
          return;
        }

        // Draw the pristine master bottle photography at native dimensions
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Uniform scale factor based on image vertical height
        const scale = img.height / 1024;
        const centerX = img.width / 2;

        // ════════════════════════════════════════════════════════════════
        // DIRECT-TO-GLASS METALLIC GOLD BRANDING (Matching Master Reference)
        // ════════════════════════════════════════════════════════════════

        // Rich metallic gold gradient for 3D gold foil/ink print
        const goldGrad = ctx.createLinearGradient(
          centerX - 130 * scale, 390 * scale,
          centerX + 130 * scale, 760 * scale
        );
        goldGrad.addColorStop(0, '#8c6b2b');    // deep warm antique gold shadow
        goldGrad.addColorStop(0.18, '#c9993f'); // rich metallic gold
        goldGrad.addColorStop(0.38, '#f3d27a'); // bright gold highlight
        goldGrad.addColorStop(0.50, '#ffe89e'); // peak specular shine
        goldGrad.addColorStop(0.62, '#f3d27a'); // bright gold highlight
        goldGrad.addColorStop(0.82, '#c9993f'); // rich metallic gold
        goldGrad.addColorStop(1, '#8c6b2b');    // deep warm antique gold shadow

        // Secondary lighter gold for fine details & secondary text
        const goldGradLight = ctx.createLinearGradient(
          centerX - 100 * scale, 420 * scale,
          centerX + 100 * scale, 740 * scale
        );
        goldGradLight.addColorStop(0, '#b88d3e');
        goldGradLight.addColorStop(0.5, '#f5d688');
        goldGradLight.addColorStop(1, '#b88d3e');

        // Setup canvas text rendering for direct-to-glass print
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 94% opacity lets glass refractions & liquid depth subtly interact with the gold print
        ctx.globalAlpha = 0.94;

        // Subtle specular glow to simulate metallic foil catching ambient studio lighting
        ctx.shadowColor = 'rgba(232, 192, 106, 0.35)';
        ctx.shadowBlur = 2.5 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0.6 * scale;

        // ─── 1. HE MONOGRAM WITH PERFUME ATOMIZER & MIST ───
        const monoY = 432 * scale;
        const monoSize = 64 * scale;

        // Monogram H (Left)
        ctx.font = `600 ${Math.round(monoSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';
        ctx.fillText('H', centerX - 18 * scale, monoY);

        // Monogram E (Right, overlapping with connected swash)
        ctx.fillStyle = goldGradLight;
        ctx.fillText('E', centerX + 20 * scale, monoY);

        // Perfume bottle atomizer icon sitting atop the H
        ctx.save();
        ctx.fillStyle = goldGrad;
        ctx.strokeStyle = goldGrad;
        const bx = centerX - 2 * scale;
        const by = monoY - monoSize * 0.60;
        const bw = monoSize * 0.18;
        const bh = monoSize * 0.28;

        // Atomizer body
        ctx.lineWidth = 1.2 * scale;
        ctx.beginPath();
        ctx.moveTo(bx - bw * 0.75, by);
        ctx.lineTo(bx - bw * 0.45, by - bh * 0.32);
        ctx.lineTo(bx + bw * 0.45, by - bh * 0.32);
        ctx.lineTo(bx + bw * 0.75, by);
        ctx.lineTo(bx + bw * 0.75, by + bh * 0.6);
        ctx.lineTo(bx - bw * 0.75, by + bh * 0.6);
        ctx.closePath();
        ctx.stroke();

        // Atomizer collar & nozzle
        ctx.fillRect(bx - bw * 0.32, by - bh * 0.58, bw * 0.64, bh * 0.26);

        // Diamond gem topper
        ctx.beginPath();
        ctx.moveTo(bx, by - bh * 0.58);
        ctx.lineTo(bx + bw * 0.24, by - bh * 0.68);
        ctx.lineTo(bx, by - bh * 0.82);
        ctx.lineTo(bx - bw * 0.24, by - bh * 0.68);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Radiating spray mist to upper right
        ctx.save();
        ctx.fillStyle = goldGrad;
        const sprayOriginX = bx + bw * 0.75;
        const sprayOriginY = by - bh * 0.52;

        for (let i = 0; i < 36; i++) {
          const angle = -Math.PI * 0.34 + Math.random() * (Math.PI * 0.42);
          const dist = (8 + Math.random() * 32) * scale;
          const dotRadius = (0.4 + Math.random() * 1.1) * scale;
          ctx.globalAlpha = 0.25 + Math.random() * 0.55;
          ctx.beginPath();
          ctx.arc(sprayOriginX + Math.cos(angle) * dist, sprayOriginY + Math.sin(angle) * dist, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.94;
        ctx.restore();

        // ─── 2. "HUDA ESSENCE" BRAND TITLE ───
        const brandY = monoY + 54 * scale;
        ctx.font = `700 ${Math.round(25 * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (4 * scale) + 'px';
        ctx.fillText('HUDA ESSENCE', centerX, brandY);
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';

        // ─── 3. HEART ORNAMENT WITH FLANKING GOLD BARS ───
        const heartY = brandY + 24 * scale;
        const heartSize = 5.5 * scale;
        const barLength = 65 * scale;

        // Left gold bar
        ctx.strokeStyle = goldGrad;
        ctx.lineWidth = 0.9 * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 14 * scale, heartY);
        ctx.lineTo(centerX - 14 * scale - barLength, heartY);
        ctx.stroke();

        // Right gold bar
        ctx.beginPath();
        ctx.moveTo(centerX + 14 * scale, heartY);
        ctx.lineTo(centerX + 14 * scale + barLength, heartY);
        ctx.stroke();

        // Center solid gold heart
        ctx.save();
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.moveTo(centerX, heartY + heartSize * 0.75);
        ctx.bezierCurveTo(centerX - heartSize * 1.3, heartY - heartSize * 0.25, centerX - heartSize * 0.7, heartY - heartSize * 1.05, centerX, heartY - heartSize * 0.1);
        ctx.bezierCurveTo(centerX + heartSize * 0.7, heartY - heartSize * 1.05, centerX + heartSize * 1.3, heartY - heartSize * 0.25, centerX, heartY + heartSize * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ─── 4. "INSPIRED BY" LABEL ───
        const inspLabelY = heartY + 22 * scale;
        ctx.font = `600 ${Math.round(10.5 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldGradLight;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (2.6 * scale) + 'px';
        ctx.fillText('INSPIRED BY', centerX, inspLabelY);
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';

        // ─── 5. DYNAMIC PERFUME NAME (From Website Product Data) ───
        // Displays the dynamic perfume name in elegant gold italic script/serif
        const nameText = product.name;
        const maxTextWidth = 270 * scale;
        const nameAreaTop = inspLabelY + 16 * scale;

        let nameFontSize = 26 * scale;
        let nameLineHeight = 30 * scale;
        let nameLines: string[] = [];

        for (let size = 26; size >= 13; size -= 1) {
          ctx.font = `italic 600 ${Math.round(size * scale)}px 'Cormorant Garamond', 'Times New Roman', serif`;
          nameLines = [];
          const words = nameText.split(/\s+/);
          let currentLine = words[0] || '';
          let fits = true;

          for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + " " + words[i];
            if (ctx.measureText(testLine).width <= maxTextWidth) {
              currentLine = testLine;
            } else {
              nameLines.push(currentLine);
              currentLine = words[i];
              if (ctx.measureText(words[i]).width > maxTextWidth) fits = false;
            }
          }
          if (currentLine) nameLines.push(currentLine);

          if (fits && nameLines.length <= (nameText.length > 25 ? 3 : 2)) {
            nameFontSize = size * scale;
            nameLineHeight = (size + 4) * scale;
            break;
          }
        }

        ctx.save();
        ctx.font = `italic 600 ${Math.round(nameFontSize)}px 'Cormorant Garamond', 'Times New Roman', serif`;
        ctx.fillStyle = goldGrad;
        ctx.shadowColor = 'rgba(232, 192, 106, 0.45)';
        ctx.shadowBlur = 3.0 * scale;

        const totalNameHeight = nameLines.length * nameLineHeight;
        const nameStartY = nameAreaTop + (nameLineHeight / 2);
        nameLines.forEach((line, index) => {
          ctx.fillText(line, centerX, nameStartY + (index * nameLineHeight));
        });
        ctx.restore();

        // ─── 6. "EXTRAIT DE PARFUM" ───
        const edpY = nameStartY + totalNameHeight + 16 * scale;
        ctx.font = `500 ${Math.round(8.5 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        ctx.fillStyle = goldGradLight;
        ctx.globalAlpha = 0.82;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (2.0 * scale) + 'px';
        ctx.fillText('EXTRAIT DE PARFUM', centerX, edpY);

        // ─── 7. "50ML | 1.7 FL.OZ" ───
        const sizeY = edpY + 16 * scale;
        ctx.font = `400 ${Math.round(7.8 * scale)}px 'Instrument Sans', 'Arial', sans-serif`;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = (1.4 * scale) + 'px';
        ctx.fillText('50ML | 1.7 FL.OZ', centerX, sizeY);

        // Reset state
        ctx.globalAlpha = 1.0;
        if ('letterSpacing' in ctx) (ctx as any).letterSpacing = '0px';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // ─── 8. NATURAL GLASS SPECULAR HIGHLIGHT REFLECTION ───
        // Subtle diagonal specular sweep across the glass face
        ctx.save();
        ctx.globalAlpha = 0.055;
        const glassShine = ctx.createLinearGradient(
          centerX - 140 * scale, 390 * scale,
          centerX + 140 * scale, 760 * scale
        );
        glassShine.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glassShine.addColorStop(0.35, 'rgba(255, 255, 255, 0)');
        glassShine.addColorStop(0.48, 'rgba(255, 255, 255, 0.7)');
        glassShine.addColorStop(0.52, 'rgba(255, 255, 255, 1.0)');
        glassShine.addColorStop(0.56, 'rgba(255, 255, 255, 0.7)');
        glassShine.addColorStop(0.70, 'rgba(255, 255, 255, 0)');
        glassShine.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = glassShine;
        ctx.beginPath();
        ctx.moveTo(centerX - 80 * scale, 380 * scale);
        ctx.lineTo(centerX + 60 * scale, 380 * scale);
        ctx.lineTo(centerX + 110 * scale, 760 * scale);
        ctx.lineTo(centerX - 30 * scale, 760 * scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ─── 9. EXPORT & CACHE RESULT ───
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
          imageCache[product.id] = dataUrl;
          setSrc(dataUrl);
        } catch (err) {
          console.error('Failed to export canvas image:', err);
          setSrc(MASTER_BOTTLE_BASE);
        }
      };

      img.onerror = () => {
        console.error('Failed to load master bottle base image');
        setSrc(MASTER_BOTTLE_BASE);
      };

      img.src = MASTER_BOTTLE_BASE;
    };

    drawDirectToGlassBottle();
  }, [product]);

  return src ? (
    <img src={src} alt={product.name} className={className} onClick={onClick} loading="lazy" />
  ) : (
    // Fallback luxury shimmer placeholder while canvas renders
    <div className={`bg-[#12100e] animate-pulse ${className}`} onClick={onClick} />
  );
}
