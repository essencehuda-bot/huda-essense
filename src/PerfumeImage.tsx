import { ProductData } from './AdminPanel';

type Product = ProductData;

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

// Map product to the correct color-matched template
// We have 7 unique AI-generated base templates by color
function getColorTemplate(product: Product): string {
  const family = (product.family || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const gender = (product.gender || '').toLowerCase();

  // Blue bottles
  if (name.includes('sauvage') || name.includes('bleu') || name.includes('blue') || 
      name.includes('dylan') || name.includes('chrome') || name.includes('cool water') || 
      name.includes('acqua') || name.includes('light blue') || name.includes('hawas') ||
      family.includes('aquatic') || family.includes('marine')) {
    return '/images/huda-essence-dior-sauvage.jpg';
  }
  
  // Green bottles
  if (name.includes('green') || name.includes('tweed') || name.includes('vetiver') ||
      family.includes('green') || family.includes('aromatic') || family.includes('fougere') || family.includes('fougère')) {
    return '/images/huda-essence-creed-green-irish-tweed.jpg';
  }
  
  // Black/dark bottles
  if (name.includes('black') || name.includes('noir') || name.includes('intense') || 
      name.includes('opium') || name.includes('poison') || name.includes('nuit') ||
      name.includes('afghano') || name.includes('dark')) {
    return '/images/huda-essence-la-nuit-de-l-homme.jpg';
  }
  
  // Silver/grey bottles
  if (name.includes('silver') || name.includes('platinum') || name.includes('mountain') ||
      name.includes('creed') || name.includes('ghost') || name.includes('water')) {
    return '/images/huda-essence-creed-aventus.jpg';
  }
  
  // Amber/warm bottles
  if (name.includes('oud') || name.includes('amber') || name.includes('tobacco') || 
      name.includes('tuscan') || name.includes('leather') || name.includes('khamrah') ||
      name.includes('sheikh') || name.includes('asad') ||
      family.includes('woody') || family.includes('leather') || family.includes('oud')) {
    return '/images/huda-essence-chanel-allure-homme-sport.jpg';
  }

  // Gold/amber bottles (default for men)
  if (name.includes('gold') || name.includes('million') || name.includes('wanted') || 
      name.includes('boss') || name.includes('icon') || name.includes('code') ||
      family.includes('amber') || family.includes('vanilla') || family.includes('oriental') ||
      family.includes('spicy')) {
    return '/images/huda-essence-afnan-9-pm.jpg';
  }

  // Teal green (aromatic/fresh men)
  if (family.includes('citrus') || family.includes('fresh')) {
    return '/images/huda-essence-ysl-y.jpg';
  }
  
  // Gender-based fallback
  if (gender === 'women') {
    return '/images/huda-essence-creed-aventus.jpg'; // silver/light
  }
  
  // Default: amber gold
  return '/images/huda-essence-afnan-9-pm.jpg';
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  const imgSrc = getColorTemplate(product);
  
  // Extract "inspired by" name from product
  const inspiredName = product.inspiredBy 
    ? product.inspiredBy.replace(/^inspired by\s*/i, '').replace(/\s*by\s+\w+.*$/i, '').trim()
    : product.name;

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      onClick={onClick}
      style={{ background: '#0a0a0a' }}
    >
      {/* Bottle image - cropped to show mainly the bottle shape */}
      <img 
        src={imgSrc} 
        alt={product.name} 
        className="w-full h-full object-cover"
        loading="lazy"
        style={{ opacity: 0.92 }}
      />
      
      {/* Dark gradient overlay to cover the template's wrong text */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 25%,
            rgba(0,0,0,0.3) 40%,
            rgba(0,0,0,0.85) 60%,
            rgba(0,0,0,0.95) 75%,
            rgba(0,0,0,1) 100%
          )`
        }}
      />
      
      {/* Correct branding overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end"
        style={{ paddingBottom: '8%' }}
      >
        {/* HE Monogram */}
        <div style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(18px, 4vw, 32px)',
          fontWeight: 700,
          color: '#c9a84c',
          letterSpacing: '3px',
          lineHeight: 1,
          marginBottom: '2px'
        }}>
          HE
        </div>
        
        {/* HUDA ESSENCE */}
        <div style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(8px, 2vw, 14px)',
          fontWeight: 400,
          color: '#c9a84c',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          HUDA ESSENCE
        </div>
        
        {/* Diamond divider */}
        <div style={{
          width: 'clamp(30px, 8vw, 60px)',
          height: '1px',
          background: '#c9a84c',
          position: 'relative',
          marginBottom: '6px'
        }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: '5px',
            height: '5px',
            background: '#c9a84c'
          }} />
        </div>
        
        {/* INSPIRED BY */}
        <div style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(6px, 1.5vw, 10px)',
          fontWeight: 400,
          color: '#c9a84c',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '2px'
        }}>
          INSPIRED BY
        </div>
        
        {/* Product Name */}
        <div style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(10px, 2.5vw, 20px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#c9a84c',
          letterSpacing: '1px',
          textAlign: 'center',
          padding: '0 10%',
          lineHeight: 1.2
        }}>
          {product.name}
        </div>
      </div>
    </div>
  );
}
