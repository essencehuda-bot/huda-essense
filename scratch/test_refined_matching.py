import re
import json

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[.*?\]);', content, re.DOTALL)
products = json.loads(match.group(1))

def get_product_template(p):
    name = (p.get('name') or '').lower()
    family = (p.get('family') or '').lower()
    gender = (p.get('gender') or '').lower()
    mood = (p.get('mood') or '').lower()
    
    top = [n.lower() for n in p.get('top', [])]
    heart = [n.lower() for n in p.get('heart', [])]
    base = [n.lower() for n in p.get('base', [])]
    all_notes = " ".join(top + heart + base)
    
    text = f"{name} {family} {mood} {all_notes}"
    
    # 1. Blue Theme (Aquatic / Marine / Oceanic / Water)
    if any(k in text for k in [
        'aquatic', 'marine', 'sea notes', 'sea salt', 'water', 'ocean', 'cool water', 'sauvage',
        'bleu', 'blue', 'dylan', 'chrome', 'hawas', 'acqua', 'light blue', 'rain'
    ]):
        return '/images/clean_base_blue.jpg', 'Blue (Aquatic/Marine)'

    # 2. Black Theme (Dark / Intense / Night / Incense / Heavy Oud)
    if any(k in text for k in [
        'black', 'noir', 'intense', 'opium', 'poison', 'nuit', 'afghano', 'incense',
        'interlude', 'greatness', 'nomade', 'night out', 'dark', 'smoke', 'myrrh', 'opopanax'
    ]):
        return '/images/clean_base_black.jpg', 'Black (Dark/Intense)'

    # 3. Brown Theme (Woody / Leather / Tobacco / Sandalwood)
    if any(k in text for k in [
        'leather', 'suede', 'tobacco', 'santal', 'birch', 'cognac', 'tuscan', 'ombre leather',
        'umbré', 'sandalwood', 'cedarwood', 'guaiac', 'papyrus', 'chestnut'
    ]) or ('woody' in family and not ('floral' in family or 'citrus' in family)):
        return '/images/clean_base_brown.jpg', 'Brown (Woody/Leather)'

    # 4. Green Theme (Herbal / Aromatic / Vetiver / Sage / Mint / Pine)
    if any(k in text for k in [
        'green', 'tweed', 'vetiver', 'sage', 'mint', 'pine', 'grass', 'herbal', 'fougere', 'fougère',
        'tea', 'cypress', 'oakmoss', 'moss', 'century', 'legend', 'galbanum'
    ]):
        return '/images/clean_base_green.jpg', 'Green (Aromatic/Herbal)'

    # 5. Teal Theme (Fresh Citrus / Bergamot / Grapefruit / Lemon)
    if any(k in text for k in [
        'citrus', 'lemon', 'bergamot', 'grapefruit', 'mandarin', 'lime', 'neroli', 'orange blossom',
        'fresh', 'y', 'allure'
    ]) and not ('floral' in family and gender == 'women'):
        return '/images/clean_base_teal.jpg', 'Teal (Fresh Citrus)'

    # 6. Silver Theme (Floral / Rose / Jasmine / White Musk / Soft Pink)
    if any(k in text for k in [
        'silver', 'platinum', 'mountain', 'white musk', 'cotton', 'musk', 'clean', 'bloom',
        'j\'adore', 'rose', 'jasmine', 'peony', 'tuberose', 'lily', 'freesia', 'floral', 'violet',
        'iris', 'chastity', 'body', 'her', 'girl', 'lady', 'floras', 'blush', 'pink'
    ]) or gender == 'women' or 'floral' in family:
        return '/images/clean_base_silver.jpg', 'Silver (Floral/Musk)'

    # 7. Amber Gold Theme (Warm Amber / Spicy / Vanilla / Gourmand)
    return '/images/clean_base_amber.jpg', 'Amber Gold (Spicy/Gourmand)'

counts = {}
for p in products:
    img, cat = get_product_template(p)
    counts[cat] = counts.get(cat, 0) + 1
    print(f"{p['id']:38s} | {cat:25s} | Notes: {p.get('top', [])[:2]} / {p.get('base', [])[:2]}")

print("\nRefined Category Breakdown:")
for cat, count in sorted(counts.items()):
    print(f"  {cat}: {count} perfumes")
