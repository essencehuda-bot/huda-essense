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

// Map product details & perfume notes (top, heart, base) to the correct clean template background image
function getCleanTemplate(product: Product): string {
  const family = (product.family || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const gender = (product.gender || '').toLowerCase();
  const mood = (product.mood || '').toLowerCase();

  const topNotes = (product.top || []).map(n => n.toLowerCase());
  const heartNotes = (product.heart || []).map(n => n.toLowerCase());
  const baseNotes = (product.base || []).map(n => n.toLowerCase());
  const allNotesStr = [...topNotes, ...heartNotes, ...baseNotes].join(' ');
  const fullText = `${name} ${family} ${mood} ${allNotesStr}`;

  // 1. Blue Theme (Aquatic / Marine / Water / Oceanic)
  if (
    fullText.includes('sea notes') || fullText.includes('sea salt') || fullText.includes('aquatic') ||
    fullText.includes('marine') || fullText.includes('water') || fullText.includes('ocean') ||
    name.includes('sauvage') || name.includes('bleu') || name.includes('blue') ||
    name.includes('dylan') || name.includes('chrome') || name.includes('cool water') ||
    name.includes('acqua') || name.includes('light blue') || name.includes('hawas') ||
    family.includes('aquatic') || family.includes('marine')
  ) {
    return '/images/clean_base_blue.jpg';
  }

  // 2. Black Theme (Dark / Intense / Mysterious / Night / Incense / Heavy Oud)
  if (
    name.includes('black') || name.includes('noir') || name.includes('intense') ||
    name.includes('opium') || name.includes('poison') || name.includes('nuit') ||
    name.includes('afghano') || fullText.includes('incense') || fullText.includes('smoke') ||
    fullText.includes('dark') || fullText.includes('myrrh') || fullText.includes('opopanax') ||
    name.includes('interlude') || name.includes('greatness') || name.includes('nomade')
  ) {
    return '/images/clean_base_black.jpg';
  }

  // 3. Brown Theme (Woody / Leather / Tobacco / Sandalwood / Cedar / Birch / Cognac)
  if (
    allNotesStr.includes('leather') || allNotesStr.includes('suede') || allNotesStr.includes('tobacco') ||
    allNotesStr.includes('santal') || allNotesStr.includes('birch') || allNotesStr.includes('cognac') ||
    allNotesStr.includes('chestnut') || allNotesStr.includes('papyrus') || allNotesStr.includes('guaiac') ||
    name.includes('tuscan') || name.includes('ombre leather') || name.includes('ombré') ||
    name.includes('santal') || family.includes('leather') ||
    (family.includes('woody') && !family.includes('floral') && !family.includes('citrus'))
  ) {
    return '/images/clean_base_brown.jpg';
  }

  // 4. Green Theme (Herbal / Aromatic / Vetiver / Sage / Mint / Pine / Cypress / Green Tea)
  if (
    allNotesStr.includes('vetiver') || allNotesStr.includes('sage') || allNotesStr.includes('mint') ||
    allNotesStr.includes('pine') || allNotesStr.includes('cypress') || allNotesStr.includes('oakmoss') ||
    allNotesStr.includes('galbanum') || allNotesStr.includes('green tea') || allNotesStr.includes('herbal') ||
    name.includes('green') || name.includes('tweed') || name.includes('century') || name.includes('legend') ||
    family.includes('green') || family.includes('aromatic') || family.includes('fougere') || family.includes('fougère')
  ) {
    return '/images/clean_base_green.jpg';
  }

  // 5. Teal Theme (Fresh Citrus / Bergamot / Lemon / Grapefruit / Mandarin / Lime / Neroli)
  if (
    allNotesStr.includes('citrus') || allNotesStr.includes('bergamot') || allNotesStr.includes('lemon') ||
    allNotesStr.includes('grapefruit') || allNotesStr.includes('mandarin') || allNotesStr.includes('neroli') ||
    allNotesStr.includes('lime') || family.includes('citrus') || (family.includes('fresh') && gender !== 'women')
  ) {
    return '/images/clean_base_teal.jpg';
  }

  // 6. Silver Theme (Soft Floral / White Musk / Rose / Jasmine / Peony / Tuberose / Lily / Violet / Powder)
  if (
    allNotesStr.includes('white musk') || allNotesStr.includes('rose') || allNotesStr.includes('jasmine') ||
    allNotesStr.includes('peony') || allNotesStr.includes('tuberose') || allNotesStr.includes('lily') ||
    allNotesStr.includes('freesia') || allNotesStr.includes('violet') || allNotesStr.includes('iris') ||
    allNotesStr.includes('cotton') || name.includes('silver') || name.includes('platinum') ||
    name.includes('mountain') || name.includes('bloom') || name.includes('j\'adore') ||
    name.includes('chastity') || name.includes('body') || name.includes('her') ||
    gender === 'women' || family.includes('floral') || family.includes('rose')
  ) {
    return '/images/clean_base_silver.jpg';
  }

  // 7. Default Amber Gold (Warm Amber / Vanilla / Tonka / Cinnamon / Nutmeg / Gourmand)
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
