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
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
          style={{
            top: '66.5%',
            height: '13.5%',
            textAlign: 'center',
            padding: '0 8%'
          }}
        >
          <span 
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: 'clamp(10px, 2.2vw, 18px)',
              fontWeight: 500,
              fontStyle: 'italic',
              // Rich gold metallic color with subtle glow
              color: '#d4a95a',
              textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 6px rgba(212,169,90,0.4)',
              letterSpacing: '0.5px',
              lineHeight: 1.15,
              display: 'inline-block',
              maxWidth: '100%',
              wordBreak: 'break-word'
            }}
          >
            {product.name}
          </span>
        </div>
      )}
    </div>
  );
}
