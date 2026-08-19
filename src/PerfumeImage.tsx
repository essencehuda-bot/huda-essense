import { ProductData } from './AdminPanel';

type Product = ProductData;

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

// Check if this product has a uniquely generated image with correct pre-printed name
const UNIQUE_GENERATED_PRODUCTS = new Set([
  'afnan-9-pm',
  'dior-sauvage',
  'bleu-de-chanel',
  'chanel-allure-homme-sport',
  'creed-aventus',
  'creed-green-irish-tweed',
  'creed-silver-mountain',
  'armani-code',
  'acqua-di-gio',
  'stronger-with-you',
  'ysl-y',
  'la-nuit-de-l-homme'
]);

// Clean product name specifically for bottle label printing so names fit 100% perfectly
function getBottleDisplayName(fullName: string): string {
  if (!fullName) return '';
  let clean = fullName;

  // Remove parenthetical notes like (Unisex), (Men), etc.
  clean = clean.replace(/\s*\([^)]*\)/g, '');

  // Brand prefixes to trim off the bottle label (where INSPIRED BY is already printed above)
  const brandPrefixes = [
    "Jo Malone ", "Maison Francis ", "Carolina Herrera ", 
    "Victoria's Secret ", "Dolce & Gabbana ", "Issey Miyake ", 
    "Tom Ford ", "Scents N Stories ", "WB by Hemani ", 
    "Bonanza Satrangi ", "Armaf ", "Lattafa ", "Ajmal ",
    "Mont Blanc ", "Paco Rabanne ", "Byredo ", "Mancera ",
    "Montale ", "Initio ", "Xerjoff ", "Le Labo ", "Memo ",
    "Amouage ", "Nishane "
  ];

  for (const prefix of brandPrefixes) {
    if (clean.startsWith(prefix) && clean.length - prefix.length >= 3) {
      clean = clean.slice(prefix.length);
      break;
    }
  }

  // Handle specific long name cleanups for flawless bottle label fitting
  if (clean.includes("Club De Nuit Intense Man")) clean = "Club De Nuit Intense";
  if (clean.includes("Club De Nuit Women")) clean = "Club De Nuit";

  return clean.trim();
}

// Map product details to the correct clean template base image
function getCleanTemplate(product: Product): string {
  const family = (product.family || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const gender = (product.gender || '').toLowerCase();

  // Blue theme
  if (
    name.includes('sauvage') || name.includes('bleu') || name.includes('blue') || 
    name.includes('dylan') || name.includes('chrome') || name.includes('cool water') || 
    name.includes('acqua') || name.includes('light blue') || name.includes('hawas') ||
    family.includes('aquatic') || family.includes('marine')
  ) {
    return '/images/clean_base_blue.jpg';
  }
  
  // Green theme
  if (
    name.includes('green') || name.includes('tweed') || name.includes('vetiver') ||
    family.includes('green') || family.includes('aromatic') || family.includes('fougere') || family.includes('fougère')
  ) {
    return '/images/clean_base_green.jpg';
  }
  
  // Teal theme
  if (family.includes('citrus') || family.includes('fresh')) {
    return '/images/clean_base_teal.jpg';
  }
  
  // Black theme
  if (
    name.includes('black') || name.includes('noir') || name.includes('intense') || 
    name.includes('opium') || name.includes('poison') || name.includes('nuit') ||
    name.includes('afghano')
  ) {
    return '/images/clean_base_black.jpg';
  }
  
  // Silver theme (used for silver, clear, and pink/female floral scents)
  if (
    name.includes('silver') || name.includes('platinum') || name.includes('mountain') ||
    name.includes('creed') || name.includes('white') || name.includes('musk') || name.includes('clean') ||
    gender === 'Women' || family.includes('floral') || family.includes('rose')
  ) {
    return '/images/clean_base_silver.jpg';
  }
  
  // Brown theme (warm woody/leather scents)
  if (
    name.includes('tobacco') || name.includes('leather') || name.includes('cognac') ||
    name.includes('tuscan') || name.includes('ombre') || name.includes('ombré') ||
    family.includes('woody') || family.includes('leather')
  ) {
    return '/images/clean_base_brown.jpg';
  }

  // Default Amber Gold
  return '/images/clean_base_amber.jpg';
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  const isUnique = UNIQUE_GENERATED_PRODUCTS.has(product.id);
  
  // For the 12 unique products with dedicated pre-printed bottle graphics, load their full image.
  // For all others, load the clean base color template matching the fragrance theme.
  const imgSrc = isUnique 
    ? `/images/huda-essence-${product.id}.jpg`
    : getCleanTemplate(product);

  const displayName = getBottleDisplayName(product.name || '');
  const len = displayName.length;

  // Responsive font size & line height tuned specifically to character length
  const fontSize = len <= 10 
    ? 'clamp(9.5px, 1.8vw, 15px)' 
    : len <= 18 
      ? 'clamp(8.5px, 1.4vw, 13px)' 
      : 'clamp(7.5px, 1.1vw, 11px)';

  const fontWeight = len <= 12 ? 600 : 500;

  return (
    <div 
      className={`relative select-none ${className}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Background bottle image (luxury style, dark background) */}
      <img 
        src={imgSrc} 
        alt={product.name} 
        className="w-full h-full object-cover block"
        loading="lazy"
      />
      
      {/* For all template-based bottles, overlay the EXACT matching perfume name dynamically */}
      {!isUnique && (
        <div 
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{
            top: '66.2%',
            height: '13.8%',
            textAlign: 'center',
            padding: '0 5%'
          }}
        >
          <span 
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize,
              fontWeight,
              fontStyle: 'italic',
              color: '#d4a95a',
              textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 6px rgba(212,169,90,0.4)',
              letterSpacing: '0.4px',
              lineHeight: 1.12,
              display: 'inline-block',
              maxWidth: '100%',
              maxHeight: '100%',
              overflow: 'hidden',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'break-word'
            }}
          >
            {displayName}
          </span>
        </div>
      )}
    </div>
  );
}
