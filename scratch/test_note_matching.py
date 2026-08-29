import re
import json

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const DEFAULT_PRODUCTS: Product\[\] = (\[.*?\]);', content, re.DOTALL)
products = json.loads(match.group(1))

def classify_product_background(p):
    name = (p.get('name') or '').lower()
    family = (p.get('family') or '').lower()
    gender = (p.get('gender') or '').lower()
    mood = (p.get('mood') or '').lower()
    
    # Collect all notes as a single lowercase text string
    all_notes = " ".join(p.get('top', []) + p.get('heart', []) + p.get('base', [])).lower()
    full_text = f"{name} {family} {mood} {all_notes}"
    
    # 1. Aquatic / Blue Theme
    if any(k in full_text for k in [
        'sea', 'marine', 'aquatic', 'water', 'ocean', 'cool water', 'sauvage', 'bleu', 'blue',
        'dylan', 'chrome', 'hawas', 'acqua', 'light blue'
    ]):
        return '/images/clean_base_blue.jpg', 'Blue (Aquatic)'
        
    # 2. Black / Dark Intense Theme
    if any(k in full_text for k in [
        'black', 'noir', 'intense', 'opium', 'poison', 'nuit', 'afghano', 'dark', 'night', 'incense'
    ]):
        return '/images/clean_base_black.jpg', 'Black (Dark Intense)'
        
    # 3. Green / Herbal / Aromatic Theme
    if any(k in full_text for k in [
        'green', 'tweed', 'vetiver', 'sage', 'mint', 'pine', 'grass', 'herbal', 'fougere', 'fougère',
        'tea', 'cypress', 'oakmoss', 'moss', 'century', 'legend'
    ]):
        return '/images/clean_base_green.jpg', 'Green (Herbal Aromatic)'

    # 4. Brown / Woody / Leather Theme
    if any(k in full_text for k in [
        'leather', 'suede', 'birch', 'wood', 'woody', 'cedar', 'sandalwood', 'tobacco', 'cognac',
        'tuscan', 'ombre', 'ombré', 'santal', 'guaiac', 'papyrus'
    ]):
        return '/images/clean_base_brown.jpg', 'Brown (Woody Leather)'

    # 5. Teal / Fresh Citrus Theme
    if any(k in full_text for k in [
        'citrus', 'lemon', 'bergamot', 'grapefruit', 'mandarin', 'lime', 'neroli', 'orange blossom',
        'fresh', 'y', 'allure'
    ]):
        return '/images/clean_base_teal.jpg', 'Teal (Fresh Citrus)'

    # 6. Silver / Soft Floral / White Musk Theme
    if any(k in full_text for k in [
        'silver', 'platinum', 'mountain', 'white musk', 'cotton', 'musk', 'clean', 'bloom',
        'j\'adore', 'rose', 'jasmine', 'peony', 'tuberose', 'lily', 'freesia', 'floral', 'violet',
        'iris', 'chastity', 'body', 'her', 'girl', 'lady', 'floras', 'blush'
    ]) or gender == 'women':
        return '/images/clean_base_silver.jpg', 'Silver (Floral / Musk)'

    # 7. Amber Gold / Spicy / Gourmand Theme
    return '/images/clean_base_amber.jpg', 'Amber Gold (Spicy / Gourmand)'

counts = {}
for p in products:
    img, cat = classify_product_background(p)
    counts[cat] = counts.get(cat, 0) + 1
    print(f"{p['id']:35s} -> {cat}")

print("\nCategory breakdown:")
for cat, count in sorted(counts.items()):
    print(f"  {cat}: {count} perfumes")
