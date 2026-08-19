import { ProductData } from './AdminPanel';

type Product = ProductData;

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

// Select the correct clean base template (without any pre-printed text)
function getCleanTemplate(product: Product): string {
  const family = (product.family || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const mood = (product.mood || '').toLowerCase();
  const story = (product.story || '').toLowerCase();
  const allText = `${name} ${family} ${mood} ${story}`.toLowerCase();

  // Aquatic / Fresh / Water
  if (
    allText.includes('aquatic') || 
    allText.includes('marine') || 
    allText.includes('sea') || 
    allText.includes('water') ||
    allText.includes('blue') ||
    allText.includes('sauvage') ||
    allText.includes('dylan') ||
    allText.includes('cool water')
  ) {
    return '/images/base_aquatic.png';
  }

  // Leather / Intense
  if (
    allText.includes('leather') || 
    allText.includes('suede') || 
    allText.includes('ombré') ||
    allText.includes('ombre') ||
    allText.includes('tuscan')
  ) {
    return '/images/base_leather.png';
  }

  // Green / Aromatic
  if (
    allText.includes('green') || 
    allText.includes('irish') || 
    allText.includes('tweed') || 
    allText.includes('vetiver') || 
    allText.includes('green') ||
    allText.includes('fresh')
  ) {
    return '/images/base_green.png';
  }

  // Spicy / Warm Spicy
  if (
    allText.includes('spicy') || 
    allText.includes('cinnamon') || 
    allText.includes('pepper') || 
    allText.includes('cardamom') ||
    allText.includes('stronger') ||
    allText.includes('desire')
  ) {
    return '/images/base_spicy.png';
  }

  // Fruity / Sweet
  if (
    allText.includes('fruity') || 
    allText.includes('peach') || 
    allText.includes('cherry') || 
    allText.includes('apple') ||
    allText.includes('sweet') ||
    allText.includes('yara')
  ) {
    return '/images/base_fruity.png';
  }

  // White Floral
  if (
    allText.includes('white floral') || 
    allText.includes('jasmine') || 
    allText.includes('tuberose') || 
    allText.includes('orange blossom') ||
    allText.includes('bloom') ||
    allText.includes('flora')
  ) {
    return '/images/base_white_floral.png';
  }

  // Floral / Rose
  if (
    allText.includes('floral') || 
    allText.includes('rose') || 
    allText.includes('peony') || 
    allText.includes('petal') ||
    allText.includes('pink')
  ) {
    return '/images/base_floral.png';
  }

  // Woody / Oud / Amber (Default fallback for rich colors)
  return '/images/base_woody.png';
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  // Use clean template image with no text printed
  const imgSrc = getCleanTemplate(product);

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      onClick={onClick}
      style={{ 
        background: 'radial-gradient(circle, #252525 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Bottle image - Clean transparent bottle, no text */}
      <img 
        src={imgSrc} 
        alt={product.name} 
        className="w-full h-full object-contain"
        loading="lazy"
        style={{ 
          filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
          transform: 'scale(0.92)'
        }}
      />
      
      {/* Dynamic Branding Overlay (Gold Printed on Glass Effect) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ paddingTop: '15%' }}
      >
        {/* Crown Logo/HE Monogram */}
        <div style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          fontSize: 'clamp(14px, 3.5vw, 24px)',
          fontWeight: 700,
          color: '#dfba5f',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          letterSpacing: '3px',
          lineHeight: 1,
          marginBottom: '2px'
        }}>
          HE
        </div>
        
        {/* HUDA ESSENCE */}
        <div style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          fontSize: 'clamp(6px, 1.5vw, 11px)',
          fontWeight: 600,
          color: '#dfba5f',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '3px'
        }}>
          HUDA ESSENCE
        </div>
        
        {/* Diamond divider line */}
        <div style={{
          width: 'clamp(25px, 6vw, 45px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, #dfba5f, transparent)',
          position: 'relative',
          marginBottom: '4px'
        }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: '4px',
            height: '4px',
            background: '#dfba5f'
          }} />
        </div>
        
        {/* INSPIRED BY */}
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'clamp(5px, 1vw, 8px)',
          fontWeight: 500,
          color: '#dfba5f',
          opacity: 0.9,
          textShadow: '0 1px 1px rgba(0,0,0,0.5)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '2px'
        }}>
          INSPIRED BY
        </div>
        
        {/* Product Name */}
        <div style={{
          fontFamily: "'Cinzel', 'Playfair Display', serif",
          fontSize: 'clamp(9px, 2vw, 16px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#dfba5f',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          letterSpacing: '0.5px',
          textAlign: 'center',
          padding: '0 15%',
          lineHeight: 1.2,
          maxWidth: '85%'
        }}>
          {product.name}
        </div>
      </div>
    </div>
  );
}
