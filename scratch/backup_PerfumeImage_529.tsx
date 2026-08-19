import { ProductData } from './AdminPanel';

type Product = ProductData;

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

// Fallback template selection (only used if product.image is missing)
function getScentThemeTemplate(product: Product): string {
  const family = (product.family || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const mood = (product.mood || '').toLowerCase();
  const story = (product.story || '').toLowerCase();
  const topNotes = (product.top || []).map(n => n.toLowerCase());
  const heartNotes = (product.heart || []).map(n => n.toLowerCase());
  const baseNotes = (product.base || []).map(n => n.toLowerCase());

  const allText = [family, name, mood, story, ...topNotes, ...heartNotes, ...baseNotes].join(' ');

  const scores: Record<string, number> = {
    woody: 0, leather: 0, aquatic: 0, spicy: 0,
    green: 0, white_floral: 0, fruity: 0, floral: 0
  };

  const keywords: Record<string, string[]> = {
    woody: ['wood', 'oud', 'cedar', 'sandalwood', 'patchouli', 'vetiver', 'birch', 'incense', 'tobacco', 'amberwood', 'smoky', 'guaiac', 'cypress'],
    leather: ['leather', 'suede', 'animalic', 'caban'],
    aquatic: ['aquatic', 'marine', 'sea', 'calone', 'ocean', 'water', 'salt', 'ozone', 'ozonic'],
    spicy: ['vanilla', 'vanille', 'spicy', 'spice', 'amber', 'cinnamon', 'cardamom', 'clove', 'nutmeg', 'ginger', 'tonka', 'meringue', 'chestnut', 'caramel', 'khamrah', 'warm', 'cocoa', 'coffee'],
    green: ['green', 'herbal', 'basil', 'sage', 'violet leaf', 'galbanum', 'grass', 'ivy', 'mint', 'oakmoss', 'aromatic', 'tweed'],
    white_floral: ['jasmine', 'neroli', 'orange blossom', 'tuberose', 'gardenia', 'lily', 'freesia', 'magnolia', 'white floral', 'orange flower', 'bloom'],
    fruity: ['fruity', 'sweet', 'cherry', 'peach', 'apple', 'pineapple', 'pear', 'strawberry', 'raspberry', 'blackcurrant', 'berry', 'berries', 'melon', 'coconut', 'gourmand', 'plum', 'mandarin', 'citrus', 'orange', 'grapefruit', 'lemon', 'lime', 'bergamot'],
    floral: ['floral', 'rose', 'peony', 'iris', 'orchid', 'violet', 'geranium', 'lavender', 'blossom', 'flower', 'petal', 'petals', 'flora']
  };

  const weights: Record<string, number> = {
    woody: 2.5, leather: 5, aquatic: 4, spicy: 2.5,
    green: 2.5, white_floral: 3, fruity: 1.5, floral: 2.2
  };

  Object.keys(keywords).forEach(theme => {
    keywords[theme].forEach(k => { if (allText.includes(k)) scores[theme] += weights[theme]; });
  });

  if (family.includes('wood') || family.includes('oud')) scores.woody += 5;
  if (family.includes('leather')) scores.leather += 8;
  if (family.includes('aquatic') || family.includes('marine')) scores.aquatic += 5;
  if (family.includes('spicy') || family.includes('amber') || family.includes('oriental')) scores.spicy += 5;
  if (family.includes('green') || family.includes('herbal')) scores.green += 5;
  if (family.includes('white floral') || family.includes('jasmine')) scores.white_floral += 5;
  else if (family.includes('floral') || family.includes('rose')) scores.floral += 4;
  if (family.includes('fruity') || family.includes('sweet') || family.includes('gourmand')) scores.fruity += 5;

  let maxScore = -1;
  let selectedTheme = 'floral';
  Object.keys(scores).forEach(theme => {
    if (scores[theme] > maxScore) { maxScore = scores[theme]; selectedTheme = theme; }
  });

  if (maxScore <= 0) {
    if (product.gender === 'Men') return '/images/base_aquatic.png';
    if (product.gender === 'Women') return '/images/base_floral.png';
    return '/images/base_spicy.png';
  }

  const themeMap: Record<string, string> = {
    woody: '/images/base_woody.png', leather: '/images/base_leather.png',
    aquatic: '/images/base_aquatic.png', spicy: '/images/base_spicy.png',
    green: '/images/base_green.png', white_floral: '/images/base_white_floral.png',
    fruity: '/images/base_fruity.png', floral: '/images/base_floral.png',
  };
  return themeMap[selectedTheme] || '/images/base_spicy.png';
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  const baseImgPath = getScentThemeTemplate(product);
  const src = (product.image && !product.image.startsWith('data:image/'))
    ? product.image.replace(/\.png$/, '.jpeg')
    : (product.image || baseImgPath);

  return (
    <img 
      src={src} 
      alt={product.name} 
      className={className} 
      onClick={onClick} 
      loading="lazy" 
    />
  );
}
