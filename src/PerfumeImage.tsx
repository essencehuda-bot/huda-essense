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

// Map colors to the correct clean template base image
function getCleanTemplate(product: Product): string {
  const color = (product.color || '').toLowerCase();
  
  if (color.includes('blue') || color.includes('aquatic') || color.includes('marine')) {
    return '/images/clean_base_blue.jpg';
  }
  if (color.includes('green') || color.includes('emerald') || color.includes('aromatic') || color.includes('fougere')) {
    return '/images/clean_base_green.jpg';
  }
  if (color.includes('teal')) {
    return '/images/clean_base_teal.jpg';
  }
  if (color.includes('black') || color.includes('noir') || color.includes('dark')) {
    return '/images/clean_base_black.jpg';
  }
  if (color.includes('silver') || color.includes('grey') || color.includes('gray') || color.includes('pink') || color.includes('rose') || color.includes('clear')) {
    return '/images/clean_base_silver.jpg';
  }
  if (color.includes('brown') || color.includes('cognac')) {
    return '/images/clean_base_brown.jpg';
  }
  
  // Default fallback (Amber)
  return '/images/clean_base_amber.jpg';
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  const isUnique = UNIQUE_GENERATED_PRODUCTS.has(product.id);
  
  // For the 12 unique products, load their full image directly.
  // For others, load the clean base color template.
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
      
      {/* If it's a shared template, render the perfume name dynamically in the empty slot */}
      {!isUnique && (
        <div 
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
          style={{
            bottom: '22%', // Positioned exactly in the blank space under "INSPIRED BY"
            height: '10%',
            textAlign: 'center',
            padding: '0 10%'
          }}
        >
          <span 
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: 'clamp(10px, 2.4vw, 20px)',
              fontWeight: 400,
              fontStyle: 'italic',
              // Rich gold metallic color with subtle glow
              color: '#d4a95a',
              textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(212,169,90,0.3)',
              letterSpacing: '0.5px',
              lineHeight: 1.2,
              display: 'inline-block',
              maxWidth: '100%',
              wordWrap: 'break-word'
            }}
          >
            {product.name}
          </span>
        </div>
      )}
    </div>
  );
}
