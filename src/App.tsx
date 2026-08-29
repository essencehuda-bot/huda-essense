import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import Logo from './Logo';
import AdminPanel, { ProductData } from './AdminPanel';
import PerfumeImage from './PerfumeImage';

/* ── types ─────────────────────────────────────────── */
type Product = ProductData;

/* ── PKR formatter ────────────────────────────────── */
const PKR = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;

/* ── All 12 Products (Matched) ──────────────────── */
const DEFAULT_PRODUCTS: Product[] = [    {
        "id": "afnan-9-pm",
        "name": "Afnan 9 PM",
        "inspiredBy": "9 PM by Afnan",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Apple",
            "Cinnamon",
            "Wild Lavender",
            "Bergamot"
        ],
        "heart": [
            "Orange Blossom",
            "Lily-of-the-Valley"
        ],
        "base": [
            "Vanilla",
            "Tonka Bean",
            "Amber",
            "Patchouli"
        ],
        "mood": "seductive \u2022 night out \u2022 magnetic",
        "image": "/images/huda-essence-afnan-9-pm.jpg",
        "bestseller": true,
        "story": "An irresistible blast of juicy apple, warm cinnamon, and rich vanilla. 9 PM by Afnan is legendary for date nights and evening allure.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.9,
        "reviews": 142
    },
    {
        "id": "dior-sauvage",
        "name": "Dior Sauvage",
        "inspiredBy": "Sauvage by Dior",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Calabrian Bergamot",
            "Pepper"
        ],
        "heart": [
            "Sichuan Pepper",
            "Lavender",
            "Vetiver",
            "Patchouli"
        ],
        "base": [
            "Ambroxan",
            "Cedar",
            "Labdanum"
        ],
        "mood": "raw \u2022 wild \u2022 magnetic",
        "image": "/images/huda-essence-dior-sauvage.jpg",
        "bestseller": true,
        "story": "An explosive blast of fresh bergamot and raw ambroxan. A fragrance that projects confidence and turns heads.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 120
    },
    {
        "id": "bleu-de-chanel",
        "name": "Bleu de Chanel",
        "inspiredBy": "Bleu de Chanel by Chanel",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Woody",
        "top": [
            "Grapefruit",
            "Lemon",
            "Mint",
            "Pink Pepper"
        ],
        "heart": [
            "Ginger",
            "Nutmeg",
            "Jasmine"
        ],
        "base": [
            "Incense",
            "Vetiver",
            "Cedar",
            "Sandalwood",
            "Patchouli"
        ],
        "mood": "fresh \u2022 clean \u2022 commanding",
        "image": "/images/huda-essence-bleu-de-chanel.jpg",
        "bestseller": true,
        "story": "A tribute to masculine freedom. Our Bleu impression is crisp, powerful, and impossibly versatile.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 207
    },
    {
        "id": "chanel-allure-homme-sport",
        "name": "Chanel Allure Homme Sport",
        "inspiredBy": "Allure Homme Sport by Chanel",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Spicy",
        "top": [
            "Orange",
            "Mandarin Orange",
            "Sea Notes"
        ],
        "heart": [
            "Black Pepper",
            "Neroli",
            "Cedar"
        ],
        "base": [
            "Tonka Bean",
            "Vanilla",
            "Amber",
            "White Musk"
        ],
        "mood": "fresh \u2022 athletic \u2022 dynamic",
        "image": "/images/huda-essence-chanel-allure-homme-sport.jpg",
        "story": "A fresh and sensual scent that evokes the simplicity of allure. Clean citrus meets warm tonka bean.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 294
    },
    {
        "id": "creed-aventus",
        "name": "Creed Aventus",
        "inspiredBy": "Aventus by Creed",
        "gender": "Men",
        "concentration": "Extrait de Parfum",
        "family": "Chypre Fruity",
        "top": [
            "Pineapple",
            "Bergamot",
            "Blackcurrant",
            "Apple"
        ],
        "heart": [
            "Birch",
            "Patchouli",
            "Moroccan Jasmine",
            "Rosée"
        ],
        "base": [
            "Musk",
            "Oakmoss",
            "Ambergris",
            "Vanilla"
        ],
        "mood": "bold \u2022 legendary \u2022 powerful",
        "image": "/images/huda-essence-creed-aventus.jpg",
        "bestseller": true,
        "story": "Inspired by the dramatic life of an emperor, celebrating strength, power, and success.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 381
    },
    {
        "id": "creed-green-irish-tweed",
        "name": "Creed Green Irish Tweed",
        "inspiredBy": "Green Irish Tweed by Creed",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Floral Musk",
        "top": [
            "Lemon Verbena",
            "Iris"
        ],
        "heart": [
            "Violet Leaf"
        ],
        "base": [
            "Ambergris",
            "Sandalwood"
        ],
        "mood": "fresh \u2022 country-side \u2022 sophisticated",
        "image": "/images/huda-essence-creed-green-irish-tweed.jpg",
        "story": "Like a walk through the Irish countryside, Green Irish Tweed is fresh, green, and classically elegant.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 468
    },
    {
        "id": "creed-silver-mountain",
        "name": "Creed Silver Mountain Water",
        "inspiredBy": "Silver Mountain Water by Creed",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic",
        "top": [
            "Bergamot",
            "Mandarin Orange"
        ],
        "heart": [
            "Green Tea",
            "Black Currant"
        ],
        "base": [
            "Musk",
            "Petitgrain",
            "Sandalwood",
            "Galbanum"
        ],
        "mood": "crisp \u2022 fresh \u2022 mountain-air",
        "image": "/images/huda-essence-creed-silver-mountain.jpg",
        "story": "Inspired by the exhilarating crispness of mountain air, capturing the purity of alpine streams.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 555
    },
    {
        "id": "armani-code",
        "name": "Armani Code",
        "inspiredBy": "Armani Code by Giorgio Armani",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Lemon",
            "Bergamot"
        ],
        "heart": [
            "Star Anise",
            "Olive Blossom"
        ],
        "base": [
            "Leather",
            "Tobacco",
            "Tonka Bean"
        ],
        "mood": "mysterious \u2022 seductive \u2022 sophisticated",
        "image": "/images/huda-essence-armani-code.jpg",
        "story": "A mysterious, sophisticated, and utterly seductive fragrance.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 642
    },
    {
        "id": "acqua-di-gio",
        "name": "Acqua di Gio",
        "inspiredBy": "Acqua di Gio by Giorgio Armani",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Aquatic",
        "top": [
            "Lime",
            "Lemon",
            "Bergamot",
            "Jasmine"
        ],
        "heart": [
            "Sea Notes",
            "Peach",
            "Freesia",
            "Calone"
        ],
        "base": [
            "White Musk",
            "Cedar",
            "Oakmoss",
            "Patchouli"
        ],
        "mood": "aquatic \u2022 fresh \u2022 sunny",
        "image": "/images/huda-essence-acqua-di-gio.jpg",
        "story": "A clean fragrance inspired by the Mediterranean sea, combining salty marine notes with sweet citrus.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 729
    },
    {
        "id": "stronger-with-you",
        "name": "Stronger With You",
        "inspiredBy": "Stronger With You by Emporio Armani",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Cardamom",
            "Pink Pepper",
            "Violet Leaf"
        ],
        "heart": [
            "Sage",
            "Cinnamon",
            "Meringue"
        ],
        "base": [
            "Vanilla",
            "Chestnut",
            "Amber",
            "Suede"
        ],
        "mood": "warm \u2022 sweet \u2022 irresistible",
        "image": "/images/huda-essence-stronger-with-you.jpg",
        "bestseller": true,
        "story": "A warm, addictive embrace in a bottle. Sweet chestnut and vanilla merge with spicy cardamom.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 816
    },
    {
        "id": "ysl-y",
        "name": "YSL Y",
        "inspiredBy": "Y Eau de Parfum by Yves Saint Laurent",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Apple",
            "Ginger",
            "Bergamot"
        ],
        "heart": [
            "Sage",
            "Juniper Berries",
            "Geranium"
        ],
        "base": [
            "Amberwood",
            "Tonka Bean",
            "Cedar",
            "Olibanum"
        ],
        "mood": "fresh \u2022 masculine \u2022 intense",
        "image": "/images/huda-essence-ysl-y.jpg",
        "bestseller": true,
        "story": "A deep, fresh and masculine scent representing the creative spirit of self-accomplishment.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 903
    },
    {
        "id": "la-nuit-de-l-homme",
        "name": "La Nuit De L'Homme",
        "inspiredBy": "La Nuit de L'Homme by Yves Saint Laurent",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Cardamom"
        ],
        "heart": [
            "Lavender",
            "Virginia Cedar",
            "Bergamot"
        ],
        "base": [
            "Vetiver",
            "Caraway"
        ],
        "mood": "suave \u2022 nocturnal \u2022 magnetic",
        "image": "/images/huda-essence-la-nuit-de-l-homme.jpg",
        "story": "The ultimate weapon of seduction. Fresh cardamom and sweet lavender blended on deep, dark vetiver.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.85,
        "reviews": 990
    },
    {
        "id": "versace-eros",
        "name": "Versace Eros",
        "inspiredBy": "Eros by Versace",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Mint",
            "Green Apple",
            "Lemon"
        ],
        "heart": [
            "Tonka Bean",
            "Ambroxan",
            "Geranium"
        ],
        "base": [
            "Madagascar Vanilla",
            "Cedar",
            "Vetiver",
            "Oakmoss"
        ],
        "mood": "passionate \u2022 bold \u2022 addictive",
        "image": "/images/huda-essence-versace-eros.jpg",
        "bestseller": true,
        "story": "Inspired by Greek mythology, Eros is the fragrance that depicts passion, desire and love.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.86,
        "reviews": 1077
    },
    {
        "id": "versace-dylan-blue",
        "name": "Versace Dylan Blue",
        "inspiredBy": "Dylan Blue by Versace",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Calabrian Bergamot",
            "Water Notes",
            "Grapefruit"
        ],
        "heart": [
            "Ambroxan",
            "Black Pepper",
            "Patchouli"
        ],
        "base": [
            "Incense",
            "Musk",
            "Tonka Bean",
            "Saffron"
        ],
        "mood": "sensual \u2022 modern \u2022 charismatic",
        "image": "/images/huda-essence-versace-dylan-blue.jpg",
        "story": "A highly sensual fragrance with woody aroma and fresh aquatic accents.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.87,
        "reviews": 1164
    },
    {
        "id": "versace-pour-homme",
        "name": "Versace Pour Homme",
        "inspiredBy": "Versace Pour Homme by Versace",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Lemon",
            "Neroli",
            "Bergamot"
        ],
        "heart": [
            "Hyacinth",
            "Clary Sage",
            "Cedar",
            "Geranium"
        ],
        "base": [
            "Tonka Bean",
            "Musk",
            "Amber"
        ],
        "mood": "clean \u2022 Mediterranean \u2022 classic",
        "image": "/images/huda-essence-versace-pour-homme.jpg",
        "story": "An elegant, classic fragrance inspired by the fresh air of the Mediterranean coast.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.88,
        "reviews": 1251
    },
    {
        "id": "paco-rabanne-1-million",
        "name": "Paco Rabanne 1 Million",
        "inspiredBy": "1 Million by Paco Rabanne",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Blood Mandarin",
            "Grapefruit",
            "Mint"
        ],
        "heart": [
            "Cinnamon",
            "Spicy Notes",
            "Rosée"
        ],
        "base": [
            "Amber",
            "Leather",
            "Woody Notes",
            "Patchouli"
        ],
        "mood": "bold \u2022 luxurious \u2022 nocturnal",
        "image": "/images/huda-essence-paco-rabanne-1-million.jpg",
        "bestseller": true,
        "story": "The scent of success and luxury. A rich, spicy-sweet blend of cinnamon, leather, and blood mandarin.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.89,
        "reviews": 1338
    },
    {
        "id": "invictus",
        "name": "Invictus",
        "inspiredBy": "Invictus by Paco Rabanne",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Aquatic",
        "top": [
            "Sea Notes",
            "Grapefruit",
            "Mandarin Orange"
        ],
        "heart": [
            "Bay Leaf",
            "Jasmine"
        ],
        "base": [
            "Ambergris",
            "Guaiac Wood",
            "Oakmoss",
            "Patchouli"
        ],
        "mood": "fresh \u2022 victorious \u2022 dynamic",
        "image": "/images/huda-essence-invictus.jpg",
        "story": "A fresh and dynamic fragrance that embodies victory and physical energy.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.9,
        "reviews": 120
    },
    {
        "id": "phantom",
        "name": "Phantom",
        "inspiredBy": "Phantom by Paco Rabanne",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Lavender",
            "Lemon Zest",
            "Amalfi Lemon"
        ],
        "heart": [
            "Lavender",
            "Apple",
            "Smoke",
            "Patchouli"
        ],
        "base": [
            "Vanilla",
            "Lavender",
            "Vetiver"
        ],
        "mood": "futuristic \u2022 sweet \u2022 energetic",
        "image": "/images/huda-essence-phantom.jpg",
        "story": "A futuristic fragrance born from the clash between luxury craftsmanship and new-tech.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.91,
        "reviews": 207
    },
    {
        "id": "dunhill-desire-red",
        "name": "Dunhill Desire Red",
        "inspiredBy": "Desire Red by Alfred Dunhill",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Apple",
            "Lemon",
            "Neroli",
            "Bergamot"
        ],
        "heart": [
            "Patchouli",
            "Teak Wood",
            "Rosée"
        ],
        "base": [
            "Vanilla",
            "Musk"
        ],
        "mood": "sensual \u2022 hot \u2022 confident",
        "image": "/images/huda-essence-dunhill-desire-red.jpg",
        "story": "A masculine scent designed for the self-confident man who wants to be at the center of attention.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.92,
        "reviews": 294
    },
    {
        "id": "dunhill-icon",
        "name": "Dunhill Icon",
        "inspiredBy": "Icon by Alfred Dunhill",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Aromatic",
        "top": [
            "Neroli",
            "Bergamot",
            "Black Pepper"
        ],
        "heart": [
            "Lavender",
            "Cardamom",
            "Sage"
        ],
        "base": [
            "Vetiver",
            "Leather",
            "Oud",
            "Oakmoss"
        ],
        "mood": "sophisticated \u2022 classic \u2022 executive",
        "image": "/images/huda-essence-dunhill-icon.jpg",
        "story": "The perfect blend of classic elegance and modern sophistication. Woody base meets fresh spices.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.93,
        "reviews": 381
    },
    {
        "id": "dunhill-century",
        "name": "Dunhill Century",
        "inspiredBy": "Century by Alfred Dunhill",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Citrus Aromatic",
        "top": [
            "Mandarin Orange",
            "Grapefruit",
            "Bergamot"
        ],
        "heart": [
            "Neroli",
            "Cardamom",
            "Olibanum"
        ],
        "base": [
            "Cypriol Oil",
            "Sandalwood",
            "Musk"
        ],
        "mood": "clean \u2022 bright \u2022 futuristic",
        "image": "/images/huda-essence-dunhill-century.jpg",
        "story": "An uplifting and bright fragrance that combines fresh citruses with cardamoms and warm sandalwood.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.94,
        "reviews": 468
    },
    {
        "id": "hugo-boss-bottled",
        "name": "Hugo Boss Bottled",
        "inspiredBy": "Boss Bottled by Hugo Boss",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Spicy",
        "top": [
            "Apple",
            "Plum",
            "Bergamot",
            "Lemon"
        ],
        "heart": [
            "Cinnamon",
            "Mahogany",
            "Carnation"
        ],
        "base": [
            "Vanilla",
            "Sandalwood",
            "Cedar",
            "Vetiver"
        ],
        "mood": "elegant \u2022 versatile \u2022 professional",
        "image": "/images/huda-essence-hugo-boss-bottled.jpg",
        "story": "An elegant, modern scent that balances fresh fruity notes with warm spicy elements.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 555
    },
    {
        "id": "boss-the-scent",
        "name": "Boss The Scent",
        "inspiredBy": "Boss The Scent by Hugo Boss",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Spicy",
        "top": [
            "Ginger",
            "Mandarin Orange",
            "Bergamot"
        ],
        "heart": [
            "Maninka Fruit",
            "Lavender"
        ],
        "base": [
            "Leather",
            "Woody Notes"
        ],
        "mood": "seductive \u2022 warm \u2022 magnetic",
        "image": "/images/huda-essence-boss-the-scent.jpg",
        "story": "A seductive fragrance that captures the mind with a unique note of African Maninka fruit.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 642
    },
    {
        "id": "hugo-man",
        "name": "Hugo Man",
        "inspiredBy": "Hugo Man by Hugo Boss",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Green",
        "top": [
            "Green Apple",
            "Lavender",
            "Mint",
            "Grapefruit"
        ],
        "heart": [
            "Sage",
            "Geranium",
            "Carnation",
            "Jasmine"
        ],
        "base": [
            "Fir",
            "Pine Tree",
            "Cedar",
            "Patchouli"
        ],
        "mood": "adventurous \u2022 fresh \u2022 clean",
        "image": "/images/huda-essence-hugo-man.jpg",
        "story": "An aromatic green scent designed for the man who lives life on his own terms.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 729
    },
    {
        "id": "tom-ford-ombrée-leather",
        "name": "Tom Ford Ombre Leather",
        "inspiredBy": "Ombre Leather by Tom Ford",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Leather",
        "top": [
            "Cardamom"
        ],
        "heart": [
            "Leather",
            "Jasmine Sambac"
        ],
        "base": [
            "Amber",
            "Moss",
            "Patchouli"
        ],
        "mood": "raw \u2022 wild \u2022 luxurious",
        "image": "/images/huda-essence-tom-ford-ombrée-leather.jpg",
        "bestseller": true,
        "story": "A rich, smoky leather fragrance that captures the wide-open spaces of the American West.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 816
    },
    {
        "id": "tom-ford-tuscan-leather",
        "name": "Tom Ford Tuscan Leather",
        "inspiredBy": "Tuscan Leather by Tom Ford",
        "gender": "Men",
        "concentration": "Extrait de Parfum",
        "family": "Leather",
        "top": [
            "Raspberry",
            "Saffron",
            "Thyme"
        ],
        "heart": [
            "Olibanum",
            "Jasmine"
        ],
        "base": [
            "Leather",
            "Suede",
            "Woody Notes",
            "Amber"
        ],
        "mood": "opulent \u2022 smoky \u2022 sophisticated",
        "image": "/images/huda-essence-tom-ford-tuscan-leather.jpg",
        "story": "A dark, rich leather scent sweetened with raspberry and spiced with saffron. Impossibly opulent.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 903
    },
    {
        "id": "tom-ford-oud-wood",
        "name": "Tom Ford Oud Wood",
        "inspiredBy": "Oud Wood by Tom Ford",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Sichuan Pepper",
            "Cardamom"
        ],
        "heart": [
            "Oud",
            "Sandalwood",
            "Vetiver"
        ],
        "base": [
            "Tonka Bean",
            "Vanilla",
            "Amber"
        ],
        "mood": "smoky \u2022 royal \u2022 warming",
        "image": "/images/huda-essence-tom-ford-oud-wood.jpg",
        "story": "Rare and expensive oud wood blended with warm spices, amber, and vanilla.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 990
    },
    {
        "id": "tom-ford-tobacco-vanille",
        "name": "Tom Ford Tobacco Vanille",
        "inspiredBy": "Tobacco Vanille by Tom Ford",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Tobacco Leaf",
            "Spicy Notes"
        ],
        "heart": [
            "Vanilla",
            "Cocoa",
            "Tonka Bean"
        ],
        "base": [
            "Dried Fruits",
            "Woody Notes"
        ],
        "mood": "opulent \u2022 sweet \u2022 warm",
        "image": "/images/huda-essence-tom-ford-tobacco-vanille.jpg",
        "story": "A modern take on an old-world gentleman's club. Rich tobacco meets sweet vanilla.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 1077
    },
    {
        "id": "ferrari-black",
        "name": "Ferrari Black",
        "inspiredBy": "Ferrari Black by Ferrari",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Red Apple",
            "Plum",
            "Lime",
            "Bergamot"
        ],
        "heart": [
            "Cinnamon",
            "Jasmine",
            "Rosée"
        ],
        "base": [
            "Vanilla",
            "Amber",
            "Musk",
            "Cedar"
        ],
        "mood": "sporty \u2022 sweet \u2022 energetic",
        "image": "/images/huda-essence-ferrari-black.jpg",
        "story": "A sporty and fresh fragrance that settles into a sweet apple and warm vanilla note.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 1164
    },
    {
        "id": "jaguar-classic-black",
        "name": "Jaguar Classic Black",
        "inspiredBy": "Classic Black by Jaguar",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Oriental Foug\u00e8re",
        "top": [
            "Granny Smith Apple",
            "Mandarin",
            "Bitter Orange"
        ],
        "heart": [
            "Tea",
            "Sea Water",
            "Geranium",
            "Cardamom"
        ],
        "base": [
            "Musk",
            "Virginia Cedar",
            "Tonka Bean",
            "Sandalwood"
        ],
        "mood": "expressive \u2022 charismatic \u2022 fresh",
        "image": "/images/huda-essence-jaguar-classic-black.jpg",
        "story": "An expressive and elegant fragrance that is fresh, spicy and deeply masculine.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 1251
    },
    {
        "id": "jaguar-classic-gold",
        "name": "Jaguar Classic Gold",
        "inspiredBy": "Classic Gold by Jaguar",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Aromatic",
        "top": [
            "Apple",
            "Lime",
            "Bergamot"
        ],
        "heart": [
            "Orange Blossom",
            "Teak Wood"
        ],
        "base": [
            "Vanilla",
            "Patchouli",
            "Musk"
        ],
        "mood": "warm \u2022 sweet \u2022 captivating",
        "image": "/images/huda-essence-jaguar-classic-gold.jpg",
        "story": "A warm and sweet woody aromatic fragrance that turns heads with its vanilla and teak wood notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 1338
    },
    {
        "id": "bentley-intense",
        "name": "Bentley Intense",
        "inspiredBy": "Bentley for Men Intense by Bentley",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Black Pepper",
            "Bay Leaf",
            "Bergamot"
        ],
        "heart": [
            "Rum",
            "Woody Notes",
            "Cinnamon",
            "Clary Sage"
        ],
        "base": [
            "Incense",
            "Leather",
            "Benzoin",
            "Patchouli"
        ],
        "mood": "boozy \u2022 dark \u2022 rich",
        "image": "/images/huda-essence-bentley-intense.jpg",
        "story": "A rich and boozy fragrance featuring black pepper, rum and incense. Truly premium projection.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.85,
        "reviews": 120
    },
    {
        "id": "bentley-absolute",
        "name": "Bentley Absolute",
        "inspiredBy": "Bentley for Men Absolute by Bentley",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Ginger",
            "Pink Pepper"
        ],
        "heart": [
            "Olibanum",
            "Sandalwood",
            "Papyrus"
        ],
        "base": [
            "Cedar",
            "Amber",
            "Oud",
            "Moss"
        ],
        "mood": "smoky \u2022 dark \u2022 woody",
        "image": "/images/huda-essence-bentley-absolute.jpg",
        "story": "An intensely woody and smoky fragrance with heavy notes of cedar, sandalwood, and oud.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.86,
        "reviews": 207
    },
    {
        "id": "davidoff-cool-water",
        "name": "Davidoff Cool Water",
        "inspiredBy": "Cool Water by Davidoff",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Aquatic",
        "top": [
            "Sea Water",
            "Mint",
            "Lavender",
            "Coriander"
        ],
        "heart": [
            "Sandalwood",
            "Jasmine",
            "Neroli",
            "Geranium"
        ],
        "base": [
            "Musk",
            "Oakmoss",
            "Tobacco",
            "Cedar"
        ],
        "mood": "fresh \u2022 aquatic \u2022 classic",
        "image": "/images/huda-essence-davidoff-cool-water.jpg",
        "story": "The classic aquatic fragrance. Fresh, clean sea notes blended with mint and rosemary.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.87,
        "reviews": 294
    },
    {
        "id": "ck-one",
        "name": "CK One",
        "inspiredBy": "CK One by Calvin Klein",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Citrus Aromatic",
        "top": [
            "Lemon",
            "Green Notes",
            "Bergamot",
            "Pineapple"
        ],
        "heart": [
            "Lily of the Valley",
            "Jasmine",
            "Violet"
        ],
        "base": [
            "Musk",
            "Cedar",
            "Sandalwood"
        ],
        "mood": "clean \u2022 bright \u2022 casual",
        "image": "/images/huda-essence-ck-one.jpg",
        "story": "The iconic citrus aromatic fragrance. Bright lemon meets clean musk and green notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.88,
        "reviews": 381
    },
    {
        "id": "ck-be",
        "name": "CK Be",
        "inspiredBy": "CK Be by Calvin Klein",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Floral Woody Musk",
        "top": [
            "Lavender",
            "Green Notes",
            "Mint",
            "Bergamot"
        ],
        "heart": [
            "Green Grass",
            "Peach",
            "Jasmine"
        ],
        "base": [
            "Musk",
            "Sandalwood",
            "Cedar",
            "Vanilla"
        ],
        "mood": "intimate \u2022 warm \u2022 clean",
        "image": "/images/huda-essence-ck-be.jpg",
        "story": "A warm, fresh woody fragrance with a highly intimate musk base that sits close to the skin.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.89,
        "reviews": 468
    },
    {
        "id": "mont-blanc-legend",
        "name": "Mont Blanc Legend",
        "inspiredBy": "Legend by Mont Blanc",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Foug\u00e8re",
        "top": [
            "Lavender",
            "Pineapple",
            "Bergamot",
            "Lemon Verbena"
        ],
        "heart": [
            "Red Apple",
            "Dried Fruits",
            "Oakmoss"
        ],
        "base": [
            "Tonka Bean",
            "Sandalwood"
        ],
        "mood": "confident \u2022 charismatic \u2022 smooth",
        "image": "/images/huda-essence-mont-blanc-legend.jpg",
        "story": "Designed for the confident and charismatic man. A fresh, fruity aromatic foug\u00e8re.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.9,
        "reviews": 555
    },
    {
        "id": "mont-blanc-explorer",
        "name": "Mont Blanc Explorer",
        "inspiredBy": "Explorer by Mont Blanc",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Aromatic",
        "top": [
            "Bergamot",
            "Pink Pepper",
            "Clary Sage"
        ],
        "heart": [
            "Haitian Vetiver",
            "Leather"
        ],
        "base": [
            "Ambroxan",
            "Akigalawood",
            "Patchouli"
        ],
        "mood": "adventurous \u2022 woody \u2022 fresh",
        "image": "/images/huda-essence-mont-blanc-explorer.jpg",
        "story": "An unconventional woody aromatic scent that takes you on a journey of discovery.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.91,
        "reviews": 642
    },
    {
        "id": "azzaro-wanted",
        "name": "Azzaro Wanted",
        "inspiredBy": "Wanted by Azzaro",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Spicy",
        "top": [
            "Lemon",
            "Ginger",
            "Lavender",
            "Mint"
        ],
        "heart": [
            "Apple",
            "Juniper",
            "Guatemalan Cardamom",
            "Geranium"
        ],
        "base": [
            "Tonka Bean",
            "Amberwood",
            "Haitian Vetiver"
        ],
        "mood": "bold \u2022 magnetic \u2022 irresistible",
        "image": "/images/huda-essence-azzaro-wanted.jpg",
        "story": "A bold, magnetic, and irresistible fragrance for the confident man.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.92,
        "reviews": 729
    },
    {
        "id": "azzaro-chrome",
        "name": "Azzaro Chrome",
        "inspiredBy": "Chrome by Azzaro",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Citrus Aromatic",
        "top": [
            "Lemon",
            "Roséemary",
            "Bergamot",
            "Neroli"
        ],
        "heart": [
            "Jasmine",
            "Cyclamen",
            "Coriander"
        ],
        "base": [
            "Musk",
            "Oakmoss",
            "Cedar",
            "Sandalwood"
        ],
        "mood": "fresh \u2022 clean \u2022 metallic",
        "image": "/images/huda-essence-azzaro-chrome.jpg",
        "story": "A fresh and clean citrus fragrance with crisp metallic accents and woody notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.93,
        "reviews": 816
    },
    {
        "id": "rasasi-hawas",
        "name": "Rasasi Hawas",
        "inspiredBy": "Hawas by Rasasi",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Aquatic",
        "top": [
            "Bergamot",
            "Cinnamon",
            "Green Apple"
        ],
        "heart": [
            "Marine Notes",
            "Ambroxan",
            "Silver Sage"
        ],
        "base": [
            "Musk",
            "Amber",
            "Patchouli",
            "Woodsy Notes"
        ],
        "mood": "fresh \u2022 aquatic \u2022 powerful",
        "image": "/images/huda-essence-rasasi-hawas.jpg",
        "bestseller": true,
        "story": "A fresh aquatic powerhouse combining crisp marine notes with warm amber. Beast-mode projection.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.94,
        "reviews": 903
    },
    {
        "id": "armaf-club-de-nuit-intense",
        "name": "Armaf Club De Nuit Intense Man",
        "inspiredBy": "Club de Nuit Intense Man by Armaf",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Spicy",
        "top": [
            "Lemon",
            "Pineapple",
            "Blackcurrant",
            "Bergamot"
        ],
        "heart": [
            "Birch",
            "Jasmine",
            "Rosée"
        ],
        "base": [
            "Musk",
            "Ambergris",
            "Patchouli",
            "Vanilla"
        ],
        "mood": "smoky \u2022 citrusy \u2022 beast-mode",
        "image": "/images/huda-essence-armaf-club-de-nuit-intense.jpg",
        "bestseller": true,
        "story": "A legendary smoky pineapple beast-mode fragrance that commands attention.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 990
    },
    {
        "id": "lattafa-asad",
        "name": "Lattafa Asad",
        "inspiredBy": "Asad by Lattafa",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Black Pepper",
            "Pineapple",
            "Tobacco"
        ],
        "heart": [
            "Coffee",
            "Patchouli",
            "Iris"
        ],
        "base": [
            "Vanilla",
            "Amber",
            "Dry Wood",
            "Benzoin"
        ],
        "mood": "spicy \u2022 warm \u2022 beast-mode",
        "image": "/images/huda-essence-lattafa-asad.jpg",
        "bestseller": true,
        "story": "A rich, spicy amber fragrance with a bold performance. Deep black pepper meets sweet vanilla.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 1077
    },
    {
        "id": "lattafa-khamrah",
        "name": "Lattafa Khamrah",
        "inspiredBy": "Khamrah by Lattafa",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Cinnamon",
            "Nutmeg",
            "Bergamot"
        ],
        "heart": [
            "Dates",
            "Praline",
            "Tuberose"
        ],
        "base": [
            "Vanilla",
            "Tonka Bean",
            "Myrrh"
        ],
        "mood": "sweet \u2022 boozy \u2022 warm",
        "image": "/images/huda-essence-lattafa-khamrah.jpg",
        "bestseller": true,
        "story": "A sweet, warm, and inviting fragrance perfect for cozy evenings.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 1164
    },
    {
        "id": "ameer-al-oud",
        "name": "Ameer Al Oud",
        "inspiredBy": "Ameer Al Oudh Intense Oud by Lattafa",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Agarwood (Oud)",
            "Woody Notes"
        ],
        "heart": [
            "Vanilla",
            "Sugar"
        ],
        "base": [
            "Agarwood (Oud)",
            "Sandalwood",
            "Herbal Notes"
        ],
        "mood": "warm \u2022 sweet \u2022 oriental",
        "image": "/images/huda-essence-ameer-al-oud.jpg",
        "story": "A warm and sweet oriental fragrance featuring deep oud notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 1251
    },
    {
        "id": "oud-mood",
        "name": "Oud Mood",
        "inspiredBy": "Oud Mood by Lattafa",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Rosée",
            "Saffron",
            "Pimento"
        ],
        "heart": [
            "Oud",
            "Caramel",
            "Patchouli"
        ],
        "base": [
            "Resin",
            "Amber",
            "Woody Notes",
            "Incense"
        ],
        "mood": "sweet \u2022 warm \u2022 royal",
        "image": "/images/huda-essence-oud-mood.jpg",
        "story": "A warm, sweet and royal fragrance featuring caramel blended with rich woody oud and saffron.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 1338
    },
    {
        "id": "j-janan-gold",
        "name": "J. Janan Gold",
        "inspiredBy": "Janan Gold by J.",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Bergamot",
            "Pink Pepper"
        ],
        "heart": [
            "Jasmine",
            "Rosée",
            "Patchouli"
        ],
        "base": [
            "Oud",
            "Amber",
            "Sandalwood"
        ],
        "mood": "royal \u2022 spicy \u2022 oriental",
        "image": "/images/huda-essence-j-janan-gold.jpg",
        "story": "A majestic Pakistani blend featuring fresh citruses, rich rose, and a base of sweet amber and oud.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 120
    },
    {
        "id": "j-janan-platinum",
        "name": "J. Janan Platinum",
        "inspiredBy": "Janan Platinum by J.",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Woody",
        "top": [
            "Grapefruit",
            "Mint"
        ],
        "heart": [
            "Cedar",
            "Jasmine"
        ],
        "base": [
            "Vetiver",
            "Musk",
            "Sandalwood"
        ],
        "mood": "fresh \u2022 modern \u2022 executive",
        "image": "/images/huda-essence-j-janan-platinum.jpg",
        "story": "A modern executive fragrance that combines fresh grapefruit with dry cedarwood and white musk.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 207
    },
    {
        "id": "bonanza-satrangi-pour-homme",
        "name": "Bonanza Satrangi Pour Homme",
        "inspiredBy": "Pour Homme by Bonanza Satrangi",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Woody",
        "top": [
            "Bergamot",
            "Pineapple"
        ],
        "heart": [
            "Jasmine",
            "Cedarwood"
        ],
        "base": [
            "Oakmoss",
            "Musk",
            "Amber"
        ],
        "mood": "sporty \u2022 fresh \u2022 clean",
        "image": "/images/huda-essence-bonanza-satrangi-pour-homme.jpg",
        "story": "A fresh and sporty aromatic fragrance that keeps you clean and active all day.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 294
    },
    {
        "id": "scents-n-stories-hero",
        "name": "Scents N Stories Hero",
        "inspiredBy": "Hero by Scents N Stories",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Aromatic Aquatic",
        "top": [
            "Lemon",
            "Grapefruit"
        ],
        "heart": [
            "Marine Notes",
            "Mint"
        ],
        "base": [
            "Cedar",
            "Vetiver",
            "Amber"
        ],
        "mood": "energetic \u2022 fresh \u2022 aquatic",
        "image": "/images/huda-essence-scents-n-stories-hero.jpg",
        "story": "A high-performance fresh fragrance designed to beat the heat with citrus and mint.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 381
    },
    {
        "id": "wb-by-hemani-prestige",
        "name": "WB by Hemani Prestige",
        "inspiredBy": "Prestige by WB by Hemani",
        "gender": "Men",
        "concentration": "Eau de Parfum",
        "family": "Woody Spicy",
        "top": [
            "Bergamot",
            "Cardamom"
        ],
        "heart": [
            "Pepper",
            "Lavender"
        ],
        "base": [
            "Leather",
            "Sandalwood",
            "Vetiver"
        ],
        "mood": "charismatic \u2022 refined \u2022 classic",
        "image": "/images/huda-essence-wb-by-hemani-prestige.jpg",
        "story": "A classic charismatic scent with premium woody notes, fresh spices, and a touch of leather.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 468
    },
    {
        "id": "gucci-flora",
        "name": "Gucci Flora",
        "inspiredBy": "Flora by Gucci",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Peony",
            "Citrus",
            "Mandarin Orange"
        ],
        "heart": [
            "Osmanthus",
            "Rosée"
        ],
        "base": [
            "Sandalwood",
            "Patchouli",
            "Pink Pepper"
        ],
        "mood": "elegant \u2022 sensual \u2022 floral",
        "image": "/images/huda-essence-gucci-flora.jpg",
        "story": "An elegant and sensual floral bouquet that celebrates the youthful spirit of femininity.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 120
    },
    {
        "id": "gucci-bloom",
        "name": "Gucci Bloom",
        "inspiredBy": "Gucci Bloom by Gucci",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "White Floral",
        "top": [
            "Rangoon Creeper"
        ],
        "heart": [
            "Tuberose"
        ],
        "base": [
            "Jasmine",
            "Honeysuckle"
        ],
        "mood": "floral \u2022 rich \u2022 enchanting",
        "image": "/images/huda-essence-gucci-bloom.jpg",
        "story": "A rich white floral scent that transports you to a beautiful, blooming garden.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 207
    },
    {
        "id": "gucci-rush",
        "name": "Gucci Rush",
        "inspiredBy": "Gucci Rush by Gucci",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Chypre Fruity",
        "top": [
            "Peach",
            "California Gardenia"
        ],
        "heart": [
            "Coriander",
            "Damask Rosée",
            "Jasmine"
        ],
        "base": [
            "Patchouli",
            "Vanilla",
            "Vetiver"
        ],
        "mood": "bold \u2022 modern \u2022 intoxicating",
        "image": "/images/huda-essence-gucci-rush.jpg",
        "story": "An intoxicating and bold modern fragrance that leaves an unforgettable trail.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 294
    },
    {
        "id": "miss-dior",
        "name": "Miss Dior",
        "inspiredBy": "Miss Dior by Dior",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Chypre",
        "top": [
            "Blood Orange",
            "Mandarin"
        ],
        "heart": [
            "Rosée",
            "Peony",
            "Iris"
        ],
        "base": [
            "Patchouli",
            "Musk",
            "Roséewood"
        ],
        "mood": "feminine \u2022 fresh \u2022 romantic",
        "image": "/images/huda-essence-miss-dior.jpg",
        "story": "A modern feminine icon. Captures the romantic freshness of peony and rose, balanced with a warm patchouli base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 381
    },
    {
        "id": "j-adore-dior",
        "name": "J'adore Dior",
        "inspiredBy": "J'adore by Dior",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Pear",
            "Melon",
            "Peach",
            "Mandarin"
        ],
        "heart": [
            "Jasmine",
            "Lily of the Valley",
            "Tuberose",
            "Rosée",
            "Orchid"
        ],
        "base": [
            "Musk",
            "Vanilla",
            "Blackberry",
            "Cedar"
        ],
        "mood": "glamorous \u2022 golden \u2022 opulent",
        "image": "/images/huda-essence-j-adore-dior.jpg",
        "bestseller": true,
        "story": "An opulent, golden floral fragrance that shimmers on the skin. A tribute to modern luxury.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 468
    },
    {
        "id": "dior-poison-girl",
        "name": "Dior Poison Girl",
        "inspiredBy": "Poison Girl by Dior",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Bitter Orange",
            "Lemon"
        ],
        "heart": [
            "Damask Rosée",
            "Grasse Rosée",
            "Orange Blossom"
        ],
        "base": [
            "Vanilla",
            "Almond",
            "Tonka Bean",
            "Sandalwood",
            "Heliotrope"
        ],
        "mood": "delicious \u2022 toxic \u2022 sensual",
        "image": "/images/huda-essence-dior-poison-girl.jpg",
        "story": "A delicious, bitter-sweet floral fragrance with mouthwatering notes of vanilla and almond.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 555
    },
    {
        "id": "chanel-coco-mademoiselle",
        "name": "Chanel Coco Mademoiselle",
        "inspiredBy": "Coco Mademoiselle by Chanel",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Orange",
            "Bergamot"
        ],
        "heart": [
            "Rosée",
            "Jasmine"
        ],
        "base": [
            "Patchouli",
            "White Musk",
            "Vanilla",
            "Vetiver"
        ],
        "mood": "elegant \u2022 chic \u2022 captivating",
        "image": "/images/huda-essence-chanel-coco-mademoiselle.jpg",
        "bestseller": true,
        "story": "A spirited and voluptuous fragrance. Sparkly orange notes meet a clear heart of rose and jasmine.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 642
    },
    {
        "id": "chanel-chance",
        "name": "Chanel Chance",
        "inspiredBy": "Chance by Chanel",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Chypre Floral",
        "top": [
            "Patchouli",
            "Pink Pepper",
            "Pineapple"
        ],
        "heart": [
            "Jasmine",
            "Lemon",
            "Iris"
        ],
        "base": [
            "Musk",
            "Patchouli",
            "Vanilla",
            "Vetiver"
        ],
        "mood": "unexpected \u2022 sparkling \u2022 energetic",
        "image": "/images/huda-essence-chanel-chance.jpg",
        "story": "A spin of fortune. A sparkling floral fragrance where pink pepper and jasmine intertwine.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 729
    },
    {
        "id": "chanel-gabrielle",
        "name": "Chanel Gabrielle",
        "inspiredBy": "Gabrielle by Chanel",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Grapefruit",
            "Mandarin Orange",
            "Blackcurrant"
        ],
        "heart": [
            "Orange Blossom",
            "Jasmine",
            "Ylang-Ylang",
            "Tuberose"
        ],
        "base": [
            "Musk",
            "Sandalwood",
            "Cashmeran"
        ],
        "mood": "luminous \u2022 solar \u2022 pure",
        "image": "/images/huda-essence-chanel-gabrielle.jpg",
        "story": "A solar fragrance created around four white flowers \u2014 a pure floral heart.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 816
    },
    {
        "id": "versace-bright-crystal",
        "name": "Versace Bright Crystal",
        "inspiredBy": "Bright Crystal by Versace",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Yuzu",
            "Pomegranate",
            "Ice Notes"
        ],
        "heart": [
            "Peony",
            "Lotus",
            "Magnolia"
        ],
        "base": [
            "Musk",
            "Mahogany",
            "Amber"
        ],
        "mood": "bright \u2022 fresh \u2022 glamorous",
        "image": "/images/huda-essence-versace-bright-crystal.jpg",
        "story": "A fresh, vibrant floral fragrance featuring pomegranate and peony with a warm musk finish.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 903
    },
    {
        "id": "versace-crystal-noir",
        "name": "Versace Crystal Noir",
        "inspiredBy": "Crystal Noir by Versace",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Pepper",
            "Ginger",
            "Cardamom"
        ],
        "heart": [
            "Coconut",
            "Gardenia",
            "Orange Blossom",
            "Peony"
        ],
        "base": [
            "Sandalwood",
            "Musk",
            "Amber"
        ],
        "mood": "dark \u2022 sensual \u2022 mysterious",
        "image": "/images/huda-essence-versace-crystal-noir.jpg",
        "bestseller": true,
        "story": "A dark, mysterious fragrance featuring creamy coconut blended with rich gardenia and spices.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.85,
        "reviews": 990
    },
    {
        "id": "versace-yellow-diamond",
        "name": "Versace Yellow Diamond",
        "inspiredBy": "Yellow Diamond by Versace",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Amalfi Lemon",
            "Pear",
            "Bergamot",
            "Neroli"
        ],
        "heart": [
            "Mimosa",
            "Freesia",
            "Orange Blossom",
            "Water Lily"
        ],
        "base": [
            "Musk",
            "Guaiac Wood",
            "Amber"
        ],
        "mood": "airy \u2022 bright \u2022 solar",
        "image": "/images/huda-essence-versace-yellow-diamond.jpg",
        "story": "A bright, solar floral fragrance that sparkles like a diamond under the sun.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.86,
        "reviews": 1077
    },
    {
        "id": "ysl-libre",
        "name": "YSL Libre",
        "inspiredBy": "Libre by YSL",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Foug\u00e8re",
        "top": [
            "Lavender",
            "Mandarin Orange",
            "Blackcurrant"
        ],
        "heart": [
            "Lavender",
            "Orange Blossom",
            "Jasmine"
        ],
        "base": [
            "Madagascar Vanilla",
            "Musk",
            "Ambergris",
            "Cedar"
        ],
        "mood": "free \u2022 bold \u2022 charismatic",
        "image": "/images/huda-essence-ysl-libre.jpg",
        "bestseller": true,
        "story": "A grand floral fragrance of freedom. Tension between French lavender and Moroccan orange blossom.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.87,
        "reviews": 1164
    },
    {
        "id": "mon-paris",
        "name": "Mon Paris",
        "inspiredBy": "Mon Paris by YSL",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Chypre Fruity",
        "top": [
            "Strawberry",
            "Raspberry",
            "Pear",
            "Orange"
        ],
        "heart": [
            "Datura",
            "Peony",
            "Jasmine"
        ],
        "base": [
            "Patchouli",
            "White Musk",
            "Ambroxan",
            "Cedar"
        ],
        "mood": "passionate \u2022 sweet \u2022 romantic",
        "image": "/images/huda-essence-mon-paris.jpg",
        "story": "A passionate love fragrance capturing the spirit of Paris. Sweet berries meet patchouli.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.88,
        "reviews": 1251
    },
    {
        "id": "black-opium",
        "name": "Black Opium",
        "inspiredBy": "Black Opium by YSL",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Pear",
            "Pink Pepper",
            "Orange Blossom"
        ],
        "heart": [
            "Coffee",
            "Jasmine",
            "Bitter Almond",
            "Licorice"
        ],
        "base": [
            "Vanilla",
            "Patchouli",
            "Cashmere Wood",
            "Cedar"
        ],
        "mood": "addictive \u2022 nocturnal \u2022 warm",
        "image": "/images/huda-essence-black-opium.jpg",
        "bestseller": true,
        "story": "A highly addictive feminine fragrance. Black coffee combined with sweet vanilla and white florals.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.89,
        "reviews": 1338
    },
    {
        "id": "burberry-her",
        "name": "Burberry Her",
        "inspiredBy": "Burberry Her by Burberry",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity Gourmand",
        "top": [
            "Strawberry",
            "Raspberry",
            "Blackberry",
            "Sour Cherry"
        ],
        "heart": [
            "Violet",
            "Jasmine"
        ],
        "base": [
            "Musk",
            "Vanilla",
            "Cashmeran",
            "Amber",
            "Oakmoss"
        ],
        "mood": "sweet \u2022 energetic \u2022 youthful",
        "image": "/images/huda-essence-burberry-her.jpg",
        "story": "A burst of sweet berries blended with jasmine and a warm, woody-musky base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.9,
        "reviews": 120
    },
    {
        "id": "burberry-body",
        "name": "Burberry Body",
        "inspiredBy": "Burberry Body by Burberry",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Chypre Fruity",
        "top": [
            "Peach",
            "Absinthe",
            "Freesia"
        ],
        "heart": [
            "Rosée",
            "Sandalwood",
            "Iris"
        ],
        "base": [
            "Musk",
            "Cashmere Wood",
            "Vanilla",
            "Amber"
        ],
        "mood": "intimate \u2022 warm \u2022 sensual",
        "image": "/images/huda-essence-burberry-body.jpg",
        "story": "An intimate and sensual fragrance that wraps the skin like a warm cashmere blanket.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.91,
        "reviews": 207
    },
    {
        "id": "victoria-s-secret-bombshell",
        "name": "Victoria's Secret Bombshell",
        "inspiredBy": "Bombshell by Victoria's Secret",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Passionfruit",
            "Grapefruit",
            "Pineapple",
            "Tangerine",
            "Strawberry"
        ],
        "heart": [
            "Peony",
            "Vanilla Orchid",
            "Red Berries",
            "Jasmine"
        ],
        "base": [
            "Musk",
            "Woody Notes",
            "Oakmoss"
        ],
        "mood": "glamorous \u2022 confident \u2022 playful",
        "image": "/images/huda-essence-victoria-s-secret-bombshell.jpg",
        "bestseller": true,
        "story": "A glamorous and confident blend of purple passionfruit, Shangri-la peony and vanilla orchid.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.92,
        "reviews": 294
    },
    {
        "id": "bombshell-intense",
        "name": "Bombshell Intense",
        "inspiredBy": "Bombshell Intense by Victoria's Secret",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Chypre Fruity",
        "top": [
            "Cherry"
        ],
        "heart": [
            "Red Peony"
        ],
        "base": [
            "Vanilla"
        ],
        "mood": "passionate \u2022 bold \u2022 sultry",
        "image": "/images/huda-essence-bombshell-intense.jpg",
        "story": "A sultry, rich blend of decadent cherry, red peony and warm vanilla. Pure passion.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.93,
        "reviews": 381
    },
    {
        "id": "bombshell-seduction",
        "name": "Bombshell Seduction",
        "inspiredBy": "Bombshell Seduction by Victoria's Secret",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Oriental",
        "top": [
            "White Peony"
        ],
        "heart": [
            "Sage"
        ],
        "base": [
            "Velvet Musk"
        ],
        "mood": "intimate \u2022 airy \u2022 warm",
        "image": "/images/huda-essence-bombshell-seduction.jpg",
        "story": "An intimate, airy floral fragrance with a warm, skin-like velvet musk base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.94,
        "reviews": 468
    },
    {
        "id": "carolina-herrera-good-girl",
        "name": "Carolina Herrera Good Girl",
        "inspiredBy": "Good Girl by Carolina Herrera",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Almond",
            "Coffee",
            "Bergamot",
            "Lemon"
        ],
        "heart": [
            "Tuberose",
            "Jasmine Sambac",
            "Orris",
            "Orange Blossom"
        ],
        "base": [
            "Tonka Bean",
            "Cocoa",
            "Vanilla",
            "Sandalwood",
            "Praline"
        ],
        "mood": "bold \u2022 glamorous \u2022 dual-natured",
        "image": "/images/huda-essence-carolina-herrera-good-girl.jpg",
        "bestseller": true,
        "story": "Sweet jasmine and cocoa meet bold coffee and tonka bean. A glamorous, confident scent.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 555
    },
    {
        "id": "good-girl-blush",
        "name": "Good Girl Blush",
        "inspiredBy": "Good Girl Blush by Carolina Herrera",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Bergamot",
            "Bitter Almond"
        ],
        "heart": [
            "Peony",
            "Ylang-Ylang"
        ],
        "base": [
            "Vanilla",
            "Coumarin"
        ],
        "mood": "powdery \u2022 romantic \u2022 sweet",
        "image": "/images/huda-essence-good-girl-blush.jpg",
        "story": "A powdery, romantic floral fragrance featuring sweet vanilla and fresh peonies.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 642
    },
    {
        "id": "212-vip-rose",
        "name": "212 VIP Roséée",
        "inspiredBy": "212 VIP Roséé\u00e9 by Carolina Herrera",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Champagne",
            "Fruity Notes"
        ],
        "heart": [
            "Peach Blossom"
        ],
        "base": [
            "White Musk",
            "Woody Notes",
            "Amber"
        ],
        "mood": "festive \u2022 sparkling \u2022 glamorous",
        "image": "/images/huda-essence-212-vip-rose.jpg",
        "story": "A sparkling champagne fragrance with sweet peach blossom and a warm, woody-musk base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 729
    },
    {
        "id": "lancome-la-vie-est-belle",
        "name": "Lanc\u00f4me La Vie Est Belle",
        "inspiredBy": "La Vie Est Belle by Lanc\u00f4me",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity Gourmand",
        "top": [
            "Blackcurrant",
            "Pear"
        ],
        "heart": [
            "Iris",
            "Jasmine",
            "Orange Blossom"
        ],
        "base": [
            "Praline",
            "Vanilla",
            "Patchouli",
            "Tonka Bean"
        ],
        "mood": "sweet \u2022 joyful \u2022 iconic",
        "image": "/images/huda-essence-lancome-la-vie-est-belle.jpg",
        "bestseller": true,
        "story": "Life is beautiful. A rich gourmand blend of sweet praline, warm vanilla, and iris.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 816
    },
    {
        "id": "idole",
        "name": "Id\u00f4le",
        "inspiredBy": "Id\u00f4le by Lanc\u00f4me",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Chypre Floral",
        "top": [
            "Pear",
            "Bergamot"
        ],
        "heart": [
            "Turkish Rosée",
            "Rosée de Mai",
            "Indian Jasmine"
        ],
        "base": [
            "White Musk",
            "Vanilla"
        ],
        "mood": "clean \u2022 modern \u2022 inspiring",
        "image": "/images/huda-essence-idole.jpg",
        "story": "For the future leaders. A clean, modern rose fragrance with a delicate white musk base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 903
    },
    {
        "id": "dolce-gabbana-light-blue",
        "name": "Dolce & Gabbana Light Blue",
        "inspiredBy": "Light Blue by Dolce & Gabbana",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Sicilian Lemon",
            "Apple",
            "Cedar",
            "Bellflower"
        ],
        "heart": [
            "Bamboo",
            "Jasmine",
            "White Rosée"
        ],
        "base": [
            "Cedar",
            "Musk",
            "Amber"
        ],
        "mood": "fresh \u2022 sunny \u2022 Mediterranean",
        "image": "/images/huda-essence-dolce-gabbana-light-blue.jpg",
        "story": "A fresh and sunny Mediterranean scent combining crisp apple and lemon with bamboo.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 990
    },
    {
        "id": "dolce-garden",
        "name": "Dolce Garden",
        "inspiredBy": "Dolce Garden by Dolce & Gabbana",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity Gourmand",
        "top": [
            "Magnolia",
            "Neroli",
            "Mandarin"
        ],
        "heart": [
            "Coconut",
            "Frangipani",
            "Ylang-Ylang"
        ],
        "base": [
            "Vanilla",
            "Almond Milk",
            "Sandalwood"
        ],
        "mood": "creamy \u2022 sweet \u2022 tropical",
        "image": "/images/huda-essence-dolce-garden.jpg",
        "story": "A delicious tropical garden scent featuring creamy coconut and sweet frangipani blossoms.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 1077
    },
    {
        "id": "issey-miyake-l-eau-d-issey",
        "name": "Issey Miyake L'Eau d'Issey",
        "inspiredBy": "L'Eau d'Issey by Issey Miyake",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Aquatic",
        "top": [
            "Lotus",
            "Melon",
            "Freesia",
            "Rosée water"
        ],
        "heart": [
            "Lily",
            "Lily-of-the-Valley",
            "Peony"
        ],
        "base": [
            "Musk",
            "Tuberose",
            "Exotic Woods",
            "Amber"
        ],
        "mood": "pure \u2022 fresh \u2022 peaceful",
        "image": "/images/huda-essence-issey-miyake-l-eau-d-issey.jpg",
        "story": "A pure and fresh aquatic floral fragrance, clean as spring water.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 1164
    },
    {
        "id": "blue-lady",
        "name": "Blue Lady",
        "inspiredBy": "Blue Lady by Rasasi",
        "gender": "Women",
        "concentration": "Extrait de Parfum",
        "family": "White Floral",
        "top": [
            "Rangoon Creeper"
        ],
        "heart": [
            "Tuberose",
            "Jasmine Sambac"
        ],
        "base": [
            "Orris Root",
            "Musk"
        ],
        "mood": "garden \u2022 rich \u2022 white floral",
        "image": "/images/huda-essence-blue-lady.jpg",
        "story": "A rich white floral garden in a bottle. Lush, creamy tuberose and jasmine experience.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 1251
    },
    {
        "id": "chastity",
        "name": "Chastity",
        "inspiredBy": "Chastity Women by Rasasi",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Green",
        "top": [
            "Green Notes",
            "Water Notes",
            "Lemon"
        ],
        "heart": [
            "Jasmine",
            "African Orange Flower",
            "Rosée"
        ],
        "base": [
            "Musk"
        ],
        "mood": "clean \u2022 green \u2022 pure",
        "image": "/images/huda-essence-chastity.jpg",
        "story": "A clean, pure green-floral fragrance that brings a burst of freshness in warm weather.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 1338
    },
    {
        "id": "tea-rose",
        "name": "Tea Rosée",
        "inspiredBy": "Tea Rosée by Perfumer's Workshop",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Green Leaves"
        ],
        "heart": [
            "Tea Rosée",
            "Chamomile"
        ],
        "base": [
            "Violet"
        ],
        "mood": "fresh \u2022 classic \u2022 rose",
        "image": "/images/huda-essence-tea-rose.jpg",
        "story": "The ultimate fresh rose. Captures the true aroma of a rose garden in full bloom.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.85,
        "reviews": 120
    },
    {
        "id": "white-musk",
        "name": "White Musk",
        "inspiredBy": "White Musk by The Body Shop",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Musk",
        "top": [
            "Lily",
            "Musk",
            "Galbanum",
            "Ylang-Ylang"
        ],
        "heart": [
            "Musk",
            "Jasmine",
            "Lily",
            "Rosée"
        ],
        "base": [
            "Musk",
            "Iris",
            "Jasmine",
            "Amber"
        ],
        "mood": "velvety \u2022 clean \u2022 comforting",
        "image": "/images/huda-essence-white-musk.jpg",
        "story": "A velvety, clean, and comforting musk fragrance. A classic signature scent.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.86,
        "reviews": 207
    },
    {
        "id": "red-door",
        "name": "Red Door",
        "inspiredBy": "Red Door by Elizabeth Arden",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Rosée",
            "Orange Blossom",
            "Peach",
            "Plum"
        ],
        "heart": [
            "Carnation",
            "Tuberose",
            "Jasmine",
            "Ylang-Ylang"
        ],
        "base": [
            "Honey",
            "Sandalwood",
            "Amber",
            "Musk"
        ],
        "mood": "glamorous \u2022 classic \u2022 opulent",
        "image": "/images/huda-essence-red-door.jpg",
        "story": "An opulent, classic floral fragrance. A rich bouquet of rose, jasmine, and sweet honey.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.87,
        "reviews": 294
    },
    {
        "id": "guess-seductive",
        "name": "Guess Seductive",
        "inspiredBy": "Guess Seductive by Guess",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Pear",
            "Bergamot",
            "Blackcurrant"
        ],
        "heart": [
            "Jasmine",
            "African Orange Flower",
            "Orris Root"
        ],
        "base": [
            "Vanilla",
            "Cashmere Wood",
            "Olibanum"
        ],
        "mood": "charming \u2022 sweet \u2022 seductive",
        "image": "/images/huda-essence-guess-seductive.jpg",
        "story": "A charming, sweet floral fragrance with a warm, seductive vanilla base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.88,
        "reviews": 381
    },
    {
        "id": "guess-girl",
        "name": "Guess Girl",
        "inspiredBy": "Guess Girl by Guess",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Raspberry",
            "Melon",
            "Bergamot"
        ],
        "heart": [
            "Orchid",
            "Lily",
            "Acacia"
        ],
        "base": [
            "Vanilla",
            "Sandalwood"
        ],
        "mood": "youthful \u2022 playful \u2022 fresh",
        "image": "/images/huda-essence-guess-girl.jpg",
        "story": "A playful, youthful floral-fruity scent with sweet raspberry and soft sandalwood.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.89,
        "reviews": 468
    },
    {
        "id": "escada-cherry-in-japan",
        "name": "Escada Cherry In Japan",
        "inspiredBy": "Cherry In Japan by Escada",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Cherry Blossom"
        ],
        "heart": [
            "Jasmine"
        ],
        "base": [
            "Tonka Bean"
        ],
        "mood": "sweet \u2022 fresh \u2022 cheerful",
        "image": "/images/huda-essence-escada-cherry-in-japan.jpg",
        "story": "A cheerful, sweet fragrance that captures the beauty of cherry blossoms in Tokyo.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.9,
        "reviews": 555
    },
    {
        "id": "escada-magnetism",
        "name": "Escada Magnetism",
        "inspiredBy": "Magnetism by Escada",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Red Berries",
            "Blackcurrant",
            "Pineapple"
        ],
        "heart": [
            "Caramel",
            "Iris",
            "Jasmine",
            "Basil"
        ],
        "base": [
            "Vanilla",
            "Patchouli",
            "Amber",
            "Benzoin"
        ],
        "mood": "sweet \u2022 magnetic \u2022 addictive",
        "image": "/images/huda-essence-escada-magnetism.jpg",
        "story": "A sweet, magnetic fragrance featuring delicious caramel, vanilla, and red berries.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.91,
        "reviews": 642
    },
    {
        "id": "armaf-club-de-nuit-women",
        "name": "Armaf Club De Nuit Women",
        "inspiredBy": "Club de Nuit Women by Armaf",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Orange",
            "Bergamot",
            "Grapefruit",
            "Peach"
        ],
        "heart": [
            "Rosée",
            "Jasmine",
            "Geranium",
            "Litchi"
        ],
        "base": [
            "Patchouli",
            "Vanilla",
            "Musk",
            "Vetiver"
        ],
        "mood": "elegant \u2022 bold \u2022 glamorous",
        "image": "/images/huda-essence-armaf-club-de-nuit-women.jpg",
        "story": "An elegant and bold fragrance that is sweet, fresh, and projects beautifully.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.92,
        "reviews": 729
    },
    {
        "id": "ajmal-raindrops",
        "name": "Ajmal Raindrops",
        "inspiredBy": "Raindrops by Ajmal",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Woody Musk",
        "top": [
            "Fruity Notes",
            "Floral Notes"
        ],
        "heart": [
            "Floral Notes"
        ],
        "base": [
            "Woody Notes",
            "Ambergris"
        ],
        "mood": "clean \u2022 fresh \u2022 dewy",
        "image": "/images/huda-essence-ajmal-raindrops.jpg",
        "story": "A clean, fresh, and dewy fragrance that feels like fresh raindrops on dry earth.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.93,
        "reviews": 816
    },
    {
        "id": "ajmal-sacrifice-for-her",
        "name": "Ajmal Sacrifice For Her",
        "inspiredBy": "Sacrifice for Her by Ajmal",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Jasmine",
            "Water Notes"
        ],
        "heart": [
            "Orange Blossom",
            "Vanilla"
        ],
        "base": [
            "Amber",
            "Musk"
        ],
        "mood": "warm \u2022 sweet \u2022 magnetic",
        "image": "/images/huda-essence-ajmal-sacrifice-for-her.jpg",
        "story": "A warm and sweet floral amber fragrance featuring Jasmine and rich musk.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.94,
        "reviews": 903
    },
    {
        "id": "lattafa-yara",
        "name": "Lattafa Yara",
        "inspiredBy": "Yara by Lattafa",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Orchid",
            "Heliotrope",
            "Tangerine"
        ],
        "heart": [
            "Gourmand Accord",
            "Tropical Fruits"
        ],
        "base": [
            "Vanilla",
            "Musk",
            "Sandalwood"
        ],
        "mood": "creamy \u2022 sweet \u2022 viral",
        "image": "/images/huda-essence-lattafa-yara.jpg",
        "bestseller": true,
        "story": "The viral sensation. Creamy strawberry-vanilla milkshake vibe with rich white florals.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 990
    },
    {
        "id": "lattafa-fakhar-women",
        "name": "Lattafa Fakhar Women",
        "inspiredBy": "Fakhar Women by Lattafa",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Lily",
            "Pomegranate",
            "Aldehydes"
        ],
        "heart": [
            "Tuberose",
            "Jasmine",
            "Gardenia",
            "Rosée",
            "Ylang-Ylang"
        ],
        "base": [
            "Vanilla",
            "White Musk",
            "Sandalwood"
        ],
        "mood": "creamy \u2022 white-floral \u2022 elegant",
        "image": "/images/huda-essence-lattafa-fakhar-women.jpg",
        "story": "A creamy, opulent white floral bouquet with pomegranate and a sweet vanilla base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 1077
    },
    {
        "id": "lattafa-ana-abiyedh-rouge",
        "name": "Lattafa Ana Abiyedh Rouge",
        "inspiredBy": "Ana Abiyedh Rouge by Lattafa",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Pear",
            "Bergamot"
        ],
        "heart": [
            "Saffron",
            "Cardamom"
        ],
        "base": [
            "Ambergris",
            "Cedar",
            "Patchouli"
        ],
        "mood": "rich \u2022 sweet \u2022 woody",
        "image": "/images/huda-essence-lattafa-ana-abiyedh-rouge.jpg",
        "story": "A sweet and woody amber fragrance with warm saffron. Similar to high-end luxury scents.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 1164
    },
    {
        "id": "lattafa-haya",
        "name": "Lattafa Haya",
        "inspiredBy": "Haya by Lattafa",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Champagne",
            "Strawberry",
            "Rosée",
            "Tangerine"
        ],
        "heart": [
            "Gardenia",
            "Jasmine",
            "Orchid"
        ],
        "base": [
            "Chestnut",
            "Amber",
            "Sandalwood"
        ],
        "mood": "festive \u2022 sweet \u2022 sparkling",
        "image": "/images/huda-essence-lattafa-haya.jpg",
        "story": "A sweet, sparkling floral fragrance with notes of strawberry, rose, and gardenia.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 1251
    },
    {
        "id": "j-janan",
        "name": "J. Janan",
        "inspiredBy": "Janan by J.",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Pink Pepper",
            "Lemon",
            "Pineapple"
        ],
        "heart": [
            "Jasmine",
            "Iris",
            "Hyacinth"
        ],
        "base": [
            "Patchouli",
            "Musk",
            "Vetiver",
            "Vanilla"
        ],
        "mood": "bold \u2022 smoky \u2022 alluring",
        "image": "/images/huda-essence-j-janan.jpg",
        "story": "A legendary Pakistani scent reimagined. Rich floral notes blend with a warm amber base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 1338
    },
    {
        "id": "bonanza-satrangi-femme",
        "name": "Bonanza Satrangi Femme",
        "inspiredBy": "Femme by Bonanza Satrangi",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Bergamot",
            "Peach"
        ],
        "heart": [
            "Rosée",
            "Lily"
        ],
        "base": [
            "Musk",
            "Sandalwood"
        ],
        "mood": "soft \u2022 powdery \u2022 feminine",
        "image": "/images/huda-essence-bonanza-satrangi-femme.jpg",
        "story": "A soft, powdery floral fragrance that stays fresh and elegant throughout the day.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 120
    },
    {
        "id": "sapphire-femme",
        "name": "Sapphire Femme",
        "inspiredBy": "Femme by Sapphire",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Fruity Floral",
        "top": [
            "Citrus",
            "Apple"
        ],
        "heart": [
            "Jasmine",
            "Rosée"
        ],
        "base": [
            "Amber",
            "Musk"
        ],
        "mood": "cheerful \u2022 fresh \u2022 clean",
        "image": "/images/huda-essence-sapphire-femme.jpg",
        "story": "A cheerful and fresh daily-wear scent featuring crisp apple, jasmine, and white musk.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 207
    },
    {
        "id": "khaadi-bloom",
        "name": "Khaadi Bloom",
        "inspiredBy": "Bloom by Khaadi",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral",
        "top": [
            "Freesia",
            "Green Notes"
        ],
        "heart": [
            "Lily",
            "Jasmine"
        ],
        "base": [
            "White Musk"
        ],
        "mood": "clean \u2022 light \u2022 floral",
        "image": "/images/huda-essence-khaadi-bloom.jpg",
        "story": "A light, clean floral scent that evokes the freshness of spring gardens.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 294
    },
    {
        "id": "wb-by-hemani-grace",
        "name": "WB by Hemani Grace",
        "inspiredBy": "Grace by WB by Hemani",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Woody",
        "top": [
            "Citrus",
            "Pear"
        ],
        "heart": [
            "Jasmine",
            "Orchid"
        ],
        "base": [
            "Sandalwood",
            "Musk"
        ],
        "mood": "graceful \u2022 fresh \u2022 elegant",
        "image": "/images/huda-essence-wb-by-hemani-grace.jpg",
        "story": "A graceful daily fragrance with fresh citruses, white jasmine, and soft sandalwood.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 381
    },
    {
        "id": "scents-n-stories-belle",
        "name": "Scents N Stories Belle",
        "inspiredBy": "Belle by Scents N Stories",
        "gender": "Women",
        "concentration": "Eau de Parfum",
        "family": "Floral Fruity",
        "top": [
            "Litchi",
            "Bergamot"
        ],
        "heart": [
            "Turkish Rosée",
            "Peony"
        ],
        "base": [
            "Vanilla",
            "Musk",
            "Cashmeran"
        ],
        "mood": "sweet \u2022 romantic \u2022 fresh",
        "image": "/images/huda-essence-scents-n-stories-belle.jpg",
        "story": "A sweet and romantic rose fragrance that projects beautifully in hot weather.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 468
    },
    {
        "id": "baccarat-rouge-540",
        "name": "Baccarat Rouge 540",
        "inspiredBy": "Baccarat Rouge 540 by Maison Francis Kurkdjian",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Saffron",
            "Jasmine"
        ],
        "heart": [
            "Amberwood",
            "Ambergris"
        ],
        "base": [
            "Fir Resin",
            "Cedar"
        ],
        "mood": "radiant \u2022 complex \u2022 luxurious",
        "image": "/images/huda-essence-baccarat-rouge-540.jpg",
        "bestseller": true,
        "story": "A luminous and sophisticated fragrance that lays on the skin like an amber floral and woody breeze.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 120
    },
    {
        "id": "ck-one-unisex",
        "name": "CK One (Unisex)",
        "inspiredBy": "CK One by Calvin Klein",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Citrus Aromatic",
        "top": [
            "Lemon",
            "Green Notes",
            "Bergamot",
            "Pineapple"
        ],
        "heart": [
            "Lily of the Valley",
            "Jasmine",
            "Violet"
        ],
        "base": [
            "Musk",
            "Cedar",
            "Sandalwood"
        ],
        "mood": "clean \u2022 bright \u2022 casual",
        "image": "/images/huda-essence-ck-one-unisex.jpg",
        "story": "The iconic citrus aromatic fragrance. Bright lemon meets clean musk and green notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 207
    },
    {
        "id": "tom-ford-oud-wood-unisex",
        "name": "Tom Ford Oud Wood (Unisex)",
        "inspiredBy": "Oud Wood by Tom Ford",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Sichuan Pepper",
            "Cardamom"
        ],
        "heart": [
            "Oud",
            "Sandalwood",
            "Vetiver"
        ],
        "base": [
            "Tonka Bean",
            "Vanilla",
            "Amber"
        ],
        "mood": "smoky \u2022 royal \u2022 warming",
        "image": "/images/huda-essence-tom-ford-oud-wood-unisex.jpg",
        "bestseller": true,
        "story": "One of the most rare and expensive ingredients in a perfumer's arsenal, oud wood is blended here with warm spices.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 294
    },
    {
        "id": "tom-ford-neroli-portofino",
        "name": "Tom Ford Neroli Portofino",
        "inspiredBy": "Neroli Portofino by Tom Ford",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Citrus Aromatic",
        "top": [
            "Bergamot",
            "Mandarin Orange",
            "Lemon",
            "Lavender"
        ],
        "heart": [
            "African Orange Flower",
            "Neroli",
            "Jasmine"
        ],
        "base": [
            "Amber",
            "Ambrette"
        ],
        "mood": "fresh \u2022 citrusy \u2022 summer",
        "image": "/images/huda-essence-tom-ford-neroli-portofino.jpg",
        "story": "A vibrant, sparkling citrus scent that captures the cool breezes and clear water of Italy.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 381
    },
    {
        "id": "tobacco-vanille",
        "name": "Tobacco Vanille",
        "inspiredBy": "Tobacco Vanille by Tom Ford",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Tobacco Leaf",
            "Spicy Notes"
        ],
        "heart": [
            "Vanilla",
            "Cocoa",
            "Tonka Bean"
        ],
        "base": [
            "Dried Fruits",
            "Woody Notes"
        ],
        "mood": "opulent \u2022 sweet \u2022 warm",
        "image": "/images/huda-essence-tobacco-vanille.jpg",
        "story": "A modern take on an old-world gentleman's club. Rich tobacco meets sweet vanilla.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 468
    },
    {
        "id": "white-oud",
        "name": "White Oud",
        "inspiredBy": "White Oud by Huda Essence",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Oriental Woody",
        "top": [
            "White Oud",
            "Saffron"
        ],
        "heart": [
            "Rosée",
            "Jasmine",
            "Patchouli"
        ],
        "base": [
            "Amber",
            "Vanilla",
            "Sandalwood"
        ],
        "mood": "soft \u2022 woody \u2022 spiritual",
        "image": "/images/huda-essence-white-oud.jpg",
        "story": "A soft, creamy woody fragrance featuring sweet white oud blended with amber and saffron.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 555
    },
    {
        "id": "ameer-al-oud-unisex",
        "name": "Ameer Al Oud (Unisex)",
        "inspiredBy": "Ameer Al Oudh by Lattafa",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Oud",
            "Woody Notes"
        ],
        "heart": [
            "Vanilla",
            "Sugar"
        ],
        "base": [
            "Sandalwood",
            "Herbal Notes"
        ],
        "mood": "warm \u2022 sweet \u2022 oriental",
        "image": "/images/huda-essence-ameer-al-oud-unisex.jpg",
        "story": "A warm and sweet oriental fragrance featuring deep oud notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 642
    },
    {
        "id": "ombrée-nomade",
        "name": "Ombre Nomade",
        "inspiredBy": "Ombre Nomade by Louis Vuitton",
        "gender": "Unisex",
        "concentration": "Extrait de Parfum",
        "family": "Amber Woody",
        "top": [
            "Oud",
            "Raspberry"
        ],
        "heart": [
            "Incense",
            "Rosée",
            "Saffron"
        ],
        "base": [
            "Birch",
            "Amberwood",
            "Benzoin"
        ],
        "mood": "dark \u2022 majestic \u2022 opulent",
        "image": "/images/huda-essence-ombrée-nomade.jpg",
        "bestseller": true,
        "story": "An opulent, dark fragrance designed for lovers of rare essences. Rich oud meets smoky incense.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 729
    },
    {
        "id": "oud-mood-unisex",
        "name": "Oud Mood (Unisex)",
        "inspiredBy": "Oud Mood by Lattafa",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Rosée",
            "Saffron"
        ],
        "heart": [
            "Oud",
            "Caramel"
        ],
        "base": [
            "Resin",
            "Amber",
            "Woody Notes"
        ],
        "mood": "sweet \u2022 warm \u2022 royal",
        "image": "/images/huda-essence-oud-mood-unisex.jpg",
        "story": "A warm, sweet and royal fragrance featuring caramel blended with rich woody oud.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 816
    },
    {
        "id": "amber-oud",
        "name": "Amber Oud",
        "inspiredBy": "Amber Oud by Al Haramain",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Bergamot",
            "Green Notes"
        ],
        "heart": [
            "Melon",
            "Pineapple",
            "Sweet Notes",
            "Amber"
        ],
        "base": [
            "Woody Notes",
            "Vanilla",
            "Musk"
        ],
        "mood": "sweet \u2022 fruity \u2022 woody",
        "image": "/images/huda-essence-amber-oud.jpg",
        "story": "A rich, sweet woody fragrance featuring delicious tropical fruits and sweet amber notes.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 903
    },
    {
        "id": "musk-rijali",
        "name": "Musk Rijali",
        "inspiredBy": "Musk Rijali by Huda Essence",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Floral Musk",
        "top": [
            "White Musk"
        ],
        "heart": [
            "Rosée",
            "Lily"
        ],
        "base": [
            "Sandalwood",
            "Amber"
        ],
        "mood": "clean \u2022 powdery \u2022 pure",
        "image": "/images/huda-essence-musk-rijali.jpg",
        "story": "A clean, powdery, and pure white musk fragrance that is a timeless classic.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.85,
        "reviews": 990
    },
    {
        "id": "musk-al-tahara",
        "name": "Musk Al Tahara",
        "inspiredBy": "Musk Al Tahara by Huda Essence",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Floral Musk",
        "top": [
            "White Musk",
            "Cotton"
        ],
        "heart": [
            "Jasmine",
            "Lily"
        ],
        "base": [
            "White Musk",
            "Amber"
        ],
        "mood": "thick \u2022 clean \u2022 pure",
        "image": "/images/huda-essence-musk-al-tahara.jpg",
        "story": "The ultimate clean scent. A thick, velvety white musk that feels like fresh laundry.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.86,
        "reviews": 1077
    },
    {
        "id": "sheikh-al-shuyukh",
        "name": "Sheikh Al Shuyukh",
        "inspiredBy": "Sheikh Al Shuyukh by Lattafa",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Woody",
        "top": [
            "Oud",
            "Cedar"
        ],
        "heart": [
            "Lavender",
            "Sage",
            "Roséemary"
        ],
        "base": [
            "Vetiver",
            "Patchouli"
        ],
        "mood": "spicy \u2022 clean \u2022 woody",
        "image": "/images/huda-essence-sheikh-al-shuyukh.jpg",
        "story": "A clean and spicy woody fragrance with aromatic lavender and a deep cedar-oud base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.87,
        "reviews": 1164
    },
    {
        "id": "lattafa-khamrah-unisex",
        "name": "Lattafa Khamrah (Unisex)",
        "inspiredBy": "Khamrah by Lattafa",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Spicy",
        "top": [
            "Cinnamon",
            "Nutmeg",
            "Bergamot"
        ],
        "heart": [
            "Dates",
            "Praline",
            "Tuberose"
        ],
        "base": [
            "Vanilla",
            "Tonka Bean",
            "Myrrh"
        ],
        "mood": "sweet \u2022 boozy \u2022 warm",
        "image": "/images/huda-essence-lattafa-khamrah-unisex.jpg",
        "story": "A sweet, warm, and inviting fragrance perfect for cozy evenings.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.88,
        "reviews": 1251
    },
    {
        "id": "nishane-hacivat",
        "name": "Nishane Hacivat",
        "inspiredBy": "Hacivat by Nishane",
        "gender": "Unisex",
        "concentration": "Extrait de Parfum",
        "family": "Chypre Woody",
        "top": [
            "Pineapple",
            "Grapefruit",
            "Bergamot"
        ],
        "heart": [
            "Cedar",
            "Patchouli",
            "Jasmine"
        ],
        "base": [
            "Oakmoss",
            "Woody Notes"
        ],
        "mood": "fruity \u2022 earthy \u2022 beast-mode",
        "image": "/images/huda-essence-nishane-hacivat.jpg",
        "bestseller": true,
        "story": "A tribute to elegance, competence, and love of art. Smoky pineapple and heavy oakmoss.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.89,
        "reviews": 1338
    },
    {
        "id": "mancera-cedrat-boise",
        "name": "Mancera Cedrat Boise",
        "inspiredBy": "Cedrat Boise by Mancera",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Citrus Woody",
        "top": [
            "Sicilian Lemon",
            "Blackcurrant",
            "Bergamot"
        ],
        "heart": [
            "Fruity Notes",
            "Patchouli",
            "Jasmine"
        ],
        "base": [
            "Cedar",
            "Leather",
            "Sandalwood",
            "Musk",
            "Moss"
        ],
        "mood": "fresh \u2022 woody \u2022 versatile",
        "image": "/images/huda-essence-mancera-cedrat-boise.jpg",
        "story": "A fresh citrus and blackcurrant blend with a rich woody leather base. Impossibly versatile.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.9,
        "reviews": 120
    },
    {
        "id": "mancera-red-tobacco",
        "name": "Mancera Red Tobacco",
        "inspiredBy": "Red Tobacco by Mancera",
        "gender": "Unisex",
        "concentration": "Extrait de Parfum",
        "family": "Amber Woody",
        "top": [
            "Cinnamon",
            "Oud",
            "Saffron",
            "Incense"
        ],
        "heart": [
            "Patchouli",
            "Jasmine"
        ],
        "base": [
            "Tobacco",
            "Madagascar Vanilla",
            "Amber",
            "Sandalwood"
        ],
        "mood": "intense \u2022 warm \u2022 beast-mode",
        "image": "/images/huda-essence-mancera-red-tobacco.jpg",
        "bestseller": true,
        "story": "An incredibly intense warm fragrance. Heavy tobacco and sweet cinnamon. Beast-mode projection.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.91,
        "reviews": 207
    },
    {
        "id": "montale-black-aoud",
        "name": "Montale Black Aoud",
        "inspiredBy": "Black Aoud by Montale",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Woody Floral Musk",
        "top": [
            "Mandarin Orange"
        ],
        "heart": [
            "Rosée"
        ],
        "base": [
            "Oud",
            "Patchouli",
            "Musk",
            "Labdanum"
        ],
        "mood": "dark \u2022 gothic \u2022 powerful",
        "image": "/images/huda-essence-montale-black-aoud.jpg",
        "story": "A dark, gothic masterpiece. Deep Cambodian oud blended with rich, velvety red roses.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.92,
        "reviews": 294
    },
    {
        "id": "montale-intense-cafe",
        "name": "Montale Intense Cafe",
        "inspiredBy": "Intense Cafe by Montale",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Floral Notes"
        ],
        "heart": [
            "Rosée",
            "Coffee"
        ],
        "base": [
            "Vanilla",
            "White Musk",
            "Amber"
        ],
        "mood": "cozy \u2022 sweet \u2022 addictive",
        "image": "/images/huda-essence-montale-intense-cafe.jpg",
        "story": "A cozy and addictive scent featuring fresh coffee blended with sweet vanilla and roses.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.93,
        "reviews": 381
    },
    {
        "id": "initio-oud-for-greatness",
        "name": "Initio Oud For Greatness",
        "inspiredBy": "Oud for Greatness by Initio",
        "gender": "Unisex",
        "concentration": "Extrait de Parfum",
        "family": "Amber Woody",
        "top": [
            "Saffron",
            "Nutmeg",
            "Lavender"
        ],
        "heart": [
            "Oud"
        ],
        "base": [
            "Patchouli",
            "Musk"
        ],
        "mood": "mystical \u2022 royal \u2022 powerful",
        "image": "/images/huda-essence-initio-oud-for-greatness.jpg",
        "story": "A mystical and powerful fragrance featuring raw oud wood, warm saffron, and lavender.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.94,
        "reviews": 468
    },
    {
        "id": "xerjoff-erba-pura",
        "name": "Xerjoff Erba Pura",
        "inspiredBy": "Erba Pura by Xerjoff",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Fruity",
        "top": [
            "Sicilian Orange",
            "Calabrian Bergamot",
            "Lemon"
        ],
        "heart": [
            "Fruits"
        ],
        "base": [
            "White Musk",
            "Amber",
            "Madagascar Vanilla"
        ],
        "mood": "sweet \u2022 tropical \u2022 loud",
        "image": "/images/huda-essence-xerjoff-erba-pura.jpg",
        "bestseller": true,
        "story": "A basket of delicious Mediterranean citrus fruits over a loud vanilla-musk base.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.75,
        "reviews": 555
    },
    {
        "id": "le-labo-santal-33",
        "name": "Le Labo Santal 33",
        "inspiredBy": "Santal 33 by Le Labo",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Woody Aromatic",
        "top": [
            "Cardamom",
            "Iris",
            "Violet"
        ],
        "heart": [
            "Sandalwood",
            "Papyrus"
        ],
        "base": [
            "Cedar",
            "Leather",
            "Amber"
        ],
        "mood": "minimalist \u2022 leather \u2022 woody",
        "image": "/images/huda-essence-le-labo-santal-33.jpg",
        "bestseller": true,
        "story": "The iconic scent of the American West. Smoky sandalwood, dry papyrus, and leather.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.76,
        "reviews": 642
    },
    {
        "id": "byredo-mojave-ghost",
        "name": "Byredo Mojave Ghost",
        "inspiredBy": "Mojave Ghost by Byredo",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Floral",
        "top": [
            "Sapodilla",
            "Ambrette"
        ],
        "heart": [
            "Magnolia",
            "Violet",
            "Sandalwood"
        ],
        "base": [
            "Ambergris",
            "Cedar"
        ],
        "mood": "airy \u2022 powdery \u2022 delicate",
        "image": "/images/huda-essence-byredo-mojave-ghost.jpg",
        "story": "A woody composition inspired by the soulful beauty of the Mojave Desert. Delicate and powdery.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.77,
        "reviews": 729
    },
    {
        "id": "byredo-gypsy-water",
        "name": "Byredo Gypsy Water",
        "inspiredBy": "Gypsy Water by Byredo",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Woody Aromatic",
        "top": [
            "Juniper",
            "Lemon",
            "Bergamot",
            "Pepper"
        ],
        "heart": [
            "Pine Needles",
            "Incense",
            "Orris Root"
        ],
        "base": [
            "Sandalwood",
            "Vanilla",
            "Amber"
        ],
        "mood": "earthy \u2022 free-spirited \u2022 fresh",
        "image": "/images/huda-essence-byredo-gypsy-water.jpg",
        "story": "A glamorization of the Romany lifestyle. Earthy pine needles, incense, and warm vanilla.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.78,
        "reviews": 816
    },
    {
        "id": "maison-francis-gentle-fluidity",
        "name": "Maison Francis Gentle Fluidity",
        "inspiredBy": "Gentle Fluidity Gold by MFK",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Amber Vanilla",
        "top": [
            "Juniper Berries",
            "Coriander"
        ],
        "heart": [
            "Nutmeg"
        ],
        "base": [
            "Amber",
            "Vanilla",
            "Musk",
            "Woody Notes"
        ],
        "mood": "creamy \u2022 smooth \u2022 elegant",
        "image": "/images/huda-essence-maison-francis-gentle-fluidity.jpg",
        "story": "A creamy, smooth fragrance featuring sweet vanilla and warm amber. Impossibly elegant.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.79,
        "reviews": 903
    },
    {
        "id": "jo-malone-wood-sage-sea-salt",
        "name": "Jo Malone Wood Sage & Sea Salt",
        "inspiredBy": "Wood Sage & Sea Salt by Jo Malone",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Aromatic",
        "top": [
            "Ambrette Seeds"
        ],
        "heart": [
            "Sea Salt"
        ],
        "base": [
            "Sage"
        ],
        "mood": "salty \u2022 windy \u2022 fresh",
        "image": "/images/huda-essence-jo-malone-wood-sage-sea-salt.jpg",
        "story": "Escape the everyday along the windswept shore. Waves breaking white, the air fresh with sea salt.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.8,
        "reviews": 990
    },
    {
        "id": "jo-malone-english-pear-freesia",
        "name": "Jo Malone English Pear & Freesia",
        "inspiredBy": "English Pear & Freesia by Jo Malone",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Chypre Fruity",
        "top": [
            "King William Pear"
        ],
        "heart": [
            "Freesia"
        ],
        "base": [
            "Patchouli"
        ],
        "mood": "fresh \u2022 juicy \u2022 autumnal",
        "image": "/images/huda-essence-jo-malone-english-pear-freesia.jpg",
        "story": "The essence of autumn. The sensuous freshness of just-ripe pears wrapped in a bouquet of white freesias.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.81,
        "reviews": 1077
    },
    {
        "id": "memo-irish-leather",
        "name": "Memo Irish Leather",
        "inspiredBy": "Irish Leather by Memo Paris",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Leather",
        "top": [
            "Juniper Berries"
        ],
        "heart": [
            "Green Mat\u00e9",
            "Iris"
        ],
        "base": [
            "Leather",
            "Amber"
        ],
        "mood": "green \u2022 frosty \u2022 leather",
        "image": "/images/huda-essence-memo-irish-leather.jpg",
        "story": "Frosty gallop on a horse. A green leather fragrance that is crisp and deep.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.82,
        "reviews": 1164
    },
    {
        "id": "amouage-interlude",
        "name": "Amouage Interlude",
        "inspiredBy": "Interlude Man by Amouage",
        "gender": "Unisex",
        "concentration": "Extrait de Parfum",
        "family": "Amber Woody",
        "top": [
            "Oregano",
            "Pepper",
            "Bergamot"
        ],
        "heart": [
            "Incense",
            "Opopanax",
            "Amber"
        ],
        "base": [
            "Leather",
            "Oud",
            "Patchouli",
            "Sandalwood"
        ],
        "mood": "smoky \u2022 chaotic \u2022 royal",
        "image": "/images/huda-essence-amouage-interlude.jpg",
        "story": "Known as the 'Blue Beast'. An incredibly smoky, chaotic blend of incense, leather, and oud.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.83,
        "reviews": 1251
    },
    {
        "id": "creed-silver-mountain-water-unisex",
        "name": "Creed Silver Mountain Water (Unisex)",
        "inspiredBy": "Silver Mountain Water by Creed",
        "gender": "Unisex",
        "concentration": "Eau de Parfum",
        "family": "Aromatic",
        "top": [
            "Bergamot",
            "Mandarin Orange"
        ],
        "heart": [
            "Green Tea",
            "Black Currant"
        ],
        "base": [
            "Musk",
            "Petitgrain",
            "Sandalwood",
            "Galbanum"
        ],
        "mood": "crisp \u2022 fresh \u2022 mountain-air",
        "image": "/images/huda-essence-creed-silver-mountain-water-unisex.jpg",
        "story": "Inspired by the exhilarating crispness of mountain air, capturing the purity of alpine streams.",
        "sizes": [
            {
                "ml": 10,
                "price": 299
            },
            {
                "ml": 50,
                "price": 1299
            },
            {
                "ml": 100,
                "price": 2499
            }
        ],
        "rating": 4.84,
        "reviews": 1338
    }

];

/* ── cart line ─────────────────────────────────────── */
type CartLine = { productId: string; sizeMl: number; qty: number };

/* ── star component ──────────────────────────────── */
const Stars = ({ rating }: { rating: number }) => (
  <span className="text-[#c9a24b]">
    {"★".repeat(Math.floor(rating))}
    {rating % 1 >= 0.5 && "½"}
  </span>
);

/* ── app ──────────────────────────────────────────── */
export default function App() {
  /* ── Dynamic data from localStorage ── */
  const [PRODUCTS, setProducts] = useState<Product[]>(() => {
    // Always start fresh from DEFAULT_PRODUCTS to ensure new products & images are loaded
    localStorage.setItem("he_products_v2", JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  });
  const [deliveryCharge, setDeliveryCharge] = useState(() => {
    try { const s = localStorage.getItem("he_delivery"); return s ? Number(s) : 300; }
    catch { return 300; }
  });
  const [whatsappNum, setWhatsappNum] = useState(() => {
    try { return localStorage.getItem("he_whatsapp") || "923376760760"; }
    catch { return "923376760760"; }
  });
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [adminPass, setAdminPass] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);

  /* persist to localStorage */
  const saveProducts = useCallback((p: Product[]) => { setProducts(p); localStorage.setItem("he_products_v2", JSON.stringify(p)); }, []);
  const saveDelivery = useCallback((d: number) => { setDeliveryCharge(d); localStorage.setItem("he_delivery", String(d)); }, []);
  const saveWhatsapp = useCallback((w: string) => { setWhatsappNum(w); localStorage.setItem("he_whatsapp", w); }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Global Tap/Click Easter Egg: Spawns a small, elegant "HUDA ESSENCE ❤️" with slow-motion floating hearts
  useEffect(() => {
    // Inject the CSS animations
    const style = document.createElement("style");
    style.innerHTML = `
      .he-tap-container {
        position: absolute;
        pointer-events: none;
        z-index: 99999;
        font-family: 'Cormorant Garamond', 'Times New Roman', serif;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .he-tap-bubble {
        background: rgba(250, 246, 237, 0.97);
        color: #7b5e28;
        padding: 2px 6px;
        border-radius: 9px;
        font-size: 9px;
        font-weight: bold;
        letter-spacing: 0.6px;
        white-space: nowrap;
        box-shadow: 0 3px 12px rgba(123, 94, 40, 0.12);
        animation: floatUpFade 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform: translate(-50%, -50%);
        text-shadow: 0 0 1px rgba(123, 94, 40, 0.08);
      }
      .he-tap-heart {
        position: absolute;
        font-size: 9px;
        animation: heartPop 3.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform: translate(-50%, -50%);
      }
      @keyframes floatUpFade {
        0% {
          transform: translate(-50%, -50%) translateY(8px) scale(0.8);
          opacity: 0;
        }
        12% {
          transform: translate(-50%, -50%) translateY(-2px) scale(1.02);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) translateY(-55px) scale(0.92);
          opacity: 0;
        }
      }
      @keyframes heartPop {
        0% {
          transform: translate(-50%, -50%) translate(0, 0) scale(0.2) rotate(0deg);
          opacity: 0;
        }
        20% {
          opacity: 0.9;
        }
        100% {
          transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(var(--tscale)) rotate(var(--trotate));
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    let lastTouchTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const spawnBubble = (x: number, y: number, target: HTMLElement) => {
      if (
        target.closest('button') || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('textarea') || 
        target.closest('a') ||
        target.closest('.admin-panel')
      ) {
        return;
      }

      // Create container
      const container = document.createElement("div");
      container.className = "he-tap-container";
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;

      // Create main text bubble
      const bubble = document.createElement("div");
      bubble.className = "he-tap-bubble";
      bubble.innerHTML = "HUDA ESSENCE ❤️";
      container.appendChild(bubble);

      // Create 5-7 scattering hearts/stars
      const icons = ["❤️", "💖", "✨", "❤️", "💕"];
      const count = 5;
      for (let i = 0; i < count; i++) {
        const heart = document.createElement("div");
        heart.className = "he-tap-heart";
        heart.innerText = icons[i % icons.length];
        
        // Randomize direction and distance (more compact scatter)
        const angle = (i * (360 / count) + Math.random() * 15) * (Math.PI / 180);
        const distance = 25 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 12; // bias upwards slightly
        const tscale = 0.4 + Math.random() * 0.4;
        const trotate = `${(Math.random() - 0.5) * 60}deg`;

        heart.style.setProperty("--tx", `${tx}px`);
        heart.style.setProperty("--ty", `${ty}px`);
        heart.style.setProperty("--tscale", `${tscale}`);
        heart.style.setProperty("--trotate", trotate);

        // Random slight delay
        heart.style.animationDelay = `${Math.random() * 0.12}s`;

        container.appendChild(heart);
      }

      document.body.appendChild(container);

      // Cleanup after slow-motion animation completes
      setTimeout(() => {
        container.remove();
      }, 3600);
    };

    const handleClick = (e: MouseEvent) => {
      // Prevent double-triggering on mobile tap
      if (Date.now() - lastTouchTime < 600) return;
      spawnBubble(e.pageX, e.pageY, e.target as HTMLElement);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX = touch.pageX;
      touchStartY = touch.pageY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const dx = touch.pageX - touchStartX;
      const dy = touch.pageY - touchStartY;
      const dt = Date.now() - touchStartTime;

      // If touch stayed in a 10px area and duration is less than 300ms, it is a tap
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 300) {
        lastTouchTime = Date.now();
        spawnBubble(touch.pageX, touch.pageY, e.target as HTMLElement);
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      style.remove();
    };
  }, []);

  /* secret admin access: click footer logo 5 times or #admin */
  useEffect(() => {
    if (window.location.hash === "#admin") setAdminOpen(true);
    const handler = () => { if (window.location.hash === "#admin") setAdminOpen(true); };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => { if (adminClicks >= 5) { setAdminOpen(true); setAdminClicks(0); } }, [adminClicks]);

  const [gender, setGender] = useState<"All" | "Women" | "Men" | "Unisex">("All");
  const [sort, setSort] = useState<"featured" | "bestsellers" | "price_low" | "price_high" | "new">("featured");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [modal, setModal] = useState<Product | null>(null);
  const [sizePick, setSizePick] = useState<number>(50);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  /* ── Checkout state ── */
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custCity, setCustCity] = useState("Karachi");
  const [payMethod, setPayMethod] = useState<"cod" | "easypaisa" | "jazzcash" | "bank">("easypaisa");
  const [payScreenshot, setPayScreenshot] = useState<string | null>(null);
  const [payScreenshotName, setPayScreenshotName] = useState<string>("");
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotUpload = (file: File) => {
    if (!file) return;
    setPayScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPayScreenshot(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetCheckout = () => {
    setCustName(""); setCustPhone(""); setCustAddress(""); setCustCity("Karachi");
    setPayMethod("easypaisa"); setPayScreenshot(null); setPayScreenshotName("");
    setCheckoutStep(1); setCheckoutOpen(false);
  };

  const canProceedStep1 = custName.trim().length >= 2 && custPhone.trim().length >= 10 && custAddress.trim().length >= 5;
  const canConfirmOrder = canProceedStep1 && (payMethod === "cod" || payScreenshot !== null);

  const paymentAccounts: Record<string, { title: string; icon: string; color: string; number: string; name: string }> = {
    cod: { title: "Cash on Delivery", icon: "💵", color: "#2E7D32", number: "Pay on delivery", name: "Delivery charges advance required" },
    easypaisa: { title: "EasyPaisa", icon: "📱", color: "#4CAF50", number: "0337-6760760", name: "Huda Essence" },
    jazzcash: { title: "JazzCash", icon: "📲", color: "#E53935", number: "0337-6760760", name: "Huda Essence" },
    bank: { title: "Bank Transfer", icon: "🏦", color: "#1565C0", number: "IBAN: PK36MEZN0003310107645678", name: "Huda Essence — Meezan Bank" }
  };

  useEffect(() => {
    if (modal) setSizePick(modal.sizes[1]?.ml ?? modal.sizes[0].ml);
  }, [modal]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    let r = PRODUCTS.slice();
    if (gender !== "All") r = r.filter(p => p.gender === gender);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.inspiredBy.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        p.mood.toLowerCase().includes(q) ||
        p.top.join(" ").toLowerCase().includes(q) ||
        p.heart.join(" ").toLowerCase().includes(q) ||
        p.base.join(" ").toLowerCase().includes(q)
      );
    }
    if (sort === "bestsellers") r = r.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || b.reviews - a.reviews);
    else if (sort === "price_low") r = r.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    else if (sort === "price_high") r = r.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    else if (sort === "new") r = r.sort((a, b) => (b.nouveau ? 1 : 0) - (a.nouveau ? 1 : 0));
    else r = r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [gender, sort, search]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((sum, line) => {
    const p = PRODUCTS.find(pp => pp.id === line.productId);
    if (!p) return sum;
    const sz = p.sizes.find(s => s.ml === line.sizeMl) ?? p.sizes[0];
    return sum + sz.price * line.qty;
  }, 0);

  const addToCart = (productId: string, sizeMl?: number) => {
    const p = PRODUCTS.find(pp => pp.id === productId);
    if (!p) return;
    const sz = sizeMl ?? p.sizes[1]?.ml ?? p.sizes[0].ml;
    setCart(c => {
      const idx = c.findIndex(l => l.productId === productId && l.sizeMl === sz);
      if (idx > -1) { const copy = [...c]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }; return copy; }
      return [...c, { productId, sizeMl: sz, qty: 1 }];
    });
    setToast(`${p.name} added to bag ✓`);
    setCartOpen(true);
  };

  const toggleWish = (id: string) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    const p = PRODUCTS.find(pp => pp.id === id);
    if (p && !wishlist.includes(id)) setToast(`${p.name} saved to wishlist ♥`);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#191510]">

      {/* ═══════════ ANNOUNCEMENT BAR ═══════════ */}
      <div className="relative z-50 overflow-hidden bg-[#14110c] text-[#e9dcb8] border-b border-[#2b2416]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
          <div className="animate-sheen absolute -top-1/2 h-[200%] w-24 bg-gradient-to-r from-transparent via-[#e8c876]/25 to-transparent" />
        </div>
        <div className="relative mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-2.5 text-center text-[12px] sm:text-[13px] tracking-[0.05em] lg:px-10">
          <span className="rounded-full border border-[#caa24f]/50 bg-[#caa24f]/10 px-2.5 py-0.5 text-[10px] font-[700] uppercase tracking-[0.2em] text-[#e8c876]">
            Fire Sale
          </span>
          <span>10ml <s className="opacity-45">Rs 500</s> <b className="font-[700] text-[#e8c876]">Rs 299</b></span>
          <span className="hidden text-[#4a3f28] sm:inline">•</span>
          <span>50ml <s className="opacity-45">Rs 1,600</s> <b className="font-[700] text-[#e8c876]">Rs 1,299</b></span>
          <span className="hidden text-[#4a3f28] sm:inline">•</span>
          <span>100ml <s className="opacity-45">Rs 3,000</s> <b className="font-[700] text-[#e8c876]">Rs 2,399</b></span>
          <span className="hidden rounded-full bg-[#e8c876]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#cfae66] lg:inline">
            Limited stock
          </span>
        </div>
      </div>

      {/* ═══════════ HEADER ═══════════ */}
      <header className="sticky top-0 z-40 border-b border-[#e7dfcd] bg-[#f7f4ed]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between gap-6 px-5 lg:px-10">
          <button onClick={() => setMobileMenu(!mobileMenu)} aria-label="menu" className="lg:hidden w-9 h-9 grid place-items-center">
            <div className="w-5">
              <div className={`h-[1.6px] bg-[#191510] transition-all ${mobileMenu ? "rotate-45 translate-y-[5.2px]" : "mb-1.5"}`}></div>
              <div className={`h-[1.6px] bg-[#191510] transition-opacity ${mobileMenu ? "opacity-0" : "mb-1.5"}`}></div>
              <div className={`h-[1.6px] bg-[#191510] transition-all ${mobileMenu ? "-rotate-45 -translate-y-[5.2px]" : ""}`}></div>
            </div>
          </button>

          <div className="flex items-center gap-10">
            <a href="#">
              <Logo />
            </a>
            <nav className="hidden lg:flex items-center gap-[30px] text-[11.5px] font-[600] uppercase tracking-[0.16em] text-[#5c5344]">
              <a href="#shop" className="underline-offset-8 transition hover:text-[#191510] hover:underline hover:decoration-[#c3a05c] hover:decoration-2">Shop All</a>
              <button onClick={() => { setGender("Men"); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="underline-offset-8 transition hover:text-[#191510] hover:underline hover:decoration-[#c3a05c] hover:decoration-2">For Him</button>
              <button onClick={() => { setGender("Women"); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="underline-offset-8 transition hover:text-[#191510] hover:underline hover:decoration-[#c3a05c] hover:decoration-2">For Her</button>
              <button onClick={() => { setGender("Unisex"); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="underline-offset-8 transition hover:text-[#191510] hover:underline hover:decoration-[#c3a05c] hover:decoration-2">Unisex</button>
              <a href="#about" className="underline-offset-8 transition hover:text-[#191510] hover:underline hover:decoration-[#c3a05c] hover:decoration-2">About</a>
              <a href="#contact" className="underline-offset-8 transition hover:text-[#191510] hover:underline hover:decoration-[#c3a05c] hover:decoration-2">Contact</a>
            </nav>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="hidden md:flex items-center gap-2 border border-[#dcd2bc] rounded-full pl-4 pr-3.5 py-[8px] bg-white/70 min-w-[210px] focus-within:border-[#b3924f] transition-colors">
              <svg className="text-[#a08b62] shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search perfumes…"
                className="bg-transparent outline-none text-[13px] w-full placeholder-[#a89b82]"
              />
            </div>

            <button onClick={() => { }} aria-label="wishlist" className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e2d8c2] bg-white/60 transition hover:border-[#b3924f] hover:text-[#8a6a33]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.6 1.6-1.6 4.1 0 5.7l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.1 0-5.7Z" /></svg>
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-[16px] h-[16px] text-[10px] grid place-items-center rounded-full bg-[#6e1e2a] text-white">{wishlist.length}</span>}
            </button>

            <button onClick={() => setCartOpen(true)} aria-label="cart" className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e2d8c2] bg-white/60 transition hover:border-[#b3924f] hover:text-[#8a6a33]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[17px] px-[4px] h-[17px] text-[10px] grid place-items-center rounded-full bg-[#191510] text-[#e9dcb8] font-[600]">{cartCount}</span>}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t border-[#e7dfcd] bg-[#f7f4ed] px-5 py-5 space-y-3.5 text-[13px] font-[600] uppercase tracking-[0.14em] text-[#443c30]">
            <a href="#shop" onClick={() => setMobileMenu(false)} className="block">Shop All Perfumes</a>
            <button onClick={() => { setGender("Men"); setMobileMenu(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block w-full text-left">For Him</button>
            <button onClick={() => { setGender("Women"); setMobileMenu(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block w-full text-left">For Her</button>
            <button onClick={() => { setGender("Unisex"); setMobileMenu(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block w-full text-left">Unisex</button>
            <a href="#about" onClick={() => setMobileMenu(false)} className="block">About Us</a>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block">Contact</a>
            <div className="pt-3">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search perfumes…"
                className="w-full border border-[#dcd2bc] rounded-full px-4 py-3 text-[13px] tracking-normal normal-case outline-none bg-white focus:border-[#b3924f] transition"
              />
            </div>
          </div>
        )}
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-[#f7f4ed]">
        {/* ambient light field */}
        <div className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-[#ecdfc2]/60 blur-[130px]"></div>
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[320px] w-[320px] rounded-full bg-[#6e1e2a]/5 blur-[110px] animate-blob-2"></div>

        <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-3 text-[10.5px] font-[600] uppercase tracking-[0.24em] text-[#a08040]">
              <span className="h-px w-10 bg-[#c9ad74]"></span>
              Perfume House — Huda Essence
            </div>
            <h1 className="mt-6 text-[42px] leading-[1.02] tracking-[-0.01em] text-[#191510] sm:text-[54px] lg:text-[64px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Branded fragrances ki wohi khushboo,
              <span className="italic text-[#a08040]"> ab har kisi ki pohanch</span> mein.
            </h1>
            <p className="mt-6 max-w-[480px] text-[15.5px] leading-relaxed text-[#6b6153]">
              Premium impression perfumes crafted from high-quality oils — available in 10ml, 50ml aur 100ml. Ek simple, imaandaar price. Sirf Karachi mein delivery.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-[#191510] px-[30px] py-[15px] text-[12px] font-[600] uppercase tracking-[0.14em] text-[#f0e6d2] transition hover:bg-[#2b241a] hover:shadow-[0_16px_36px_-12px_rgba(25,21,16,0.5)]"
              >
                Shop Collection
              </button>
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-full border border-[#d8cdb4] bg-white/70 px-[28px] py-[15px] text-[12px] font-[600] uppercase tracking-[0.12em] text-[#3c3428] transition hover:border-[#b3924f] hover:bg-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                WhatsApp Order
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#e4dbc6] pt-6 text-[11.5px] font-[600] uppercase tracking-[0.14em] text-[#7a6e58]">
              <span>From Rs 299</span>
              <span className="hidden h-1 w-1 rounded-full bg-[#c9ad74] sm:block"></span>
              <span>6–8h Lasting</span>
              <span className="hidden h-1 w-1 rounded-full bg-[#c9ad74] sm:block"></span>
              <span>COD — Karachi</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-[88%] max-w-[440px]">
              <div className="absolute -inset-3 rounded-t-[999px] rounded-b-[36px] border border-[#cbb47f]/50 pointer-events-none"></div>
              <div className="relative h-[460px] overflow-hidden rounded-t-[999px] rounded-b-[28px] shadow-[0_60px_110px_-40px_rgba(90,70,40,0.45)] lg:h-[580px]">
                <img
                  src="/images/huda_essence_hero_all_sizes.png"
                  alt="Huda Essence Bottles 10ml, 50ml, 100ml"
                  className="absolute inset-0 h-full w-full object-cover"
                  fetchPriority="high"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#19130d2b] via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e4dbc6] bg-white/95 px-5 py-2.5 text-[10px] font-[600] uppercase tracking-[0.2em] text-[#6b6153] shadow-[0_18px_40px_-18px_rgba(90,70,40,0.4)] backdrop-blur">
                Eau de Parfum • Premium Oils
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BAR ═══════════ */}
      <div className="border-y border-[#e7dfcd] bg-[#fbf9f4]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 divide-y divide-[#e7dfcd] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
          {[
            { title: "Premium Quality", sub: "Long-lasting fragrances" },
            { title: `PKR ${deliveryCharge} Delivery`, sub: "Karachi Only" },
            { title: "Cash on Delivery", sub: "Delivery charges advance" },
          ].map(t => (
            <div key={t.title} className="flex flex-col items-center gap-1 px-4 py-5 text-center">
              <div className="text-[11px] font-[700] uppercase tracking-[0.2em] text-[#191510]">{t.title}</div>
              <div className="text-[12px] text-[#8a7d66]">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ SHOP ALL PRODUCTS ═══════════ */}
      <section id="shop" ref={shopRef} className="mx-auto max-w-[1320px] px-5 py-14 lg:px-10 lg:py-[90px]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-[10.5px] font-[600] uppercase tracking-[0.24em] text-[#a08040]">Our Collection</div>
            <h2 className="mt-3 text-[40px] leading-[0.98] text-[#191510] lg:text-[52px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Shop Huda Essence
            </h2>
            <p className="mt-3 max-w-[520px] text-[14.5px] text-[#6b6153]">
              {PRODUCTS.length} premium impression perfumes. All sizes, one simple price in PKR.
            </p>
          </div>
        </div>

        {/* filters */}
        <div className="mb-10 mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-[#e2d8c2] bg-white p-1">
            {(["All", "Men", "Women", "Unisex"] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`rounded-full px-4 py-[8px] text-[11.5px] font-[600] uppercase tracking-[0.1em] transition ${gender === g ? "bg-[#191510] text-[#f0e6d2]" : "text-[#6b6153] hover:bg-[#f3efe4]"}`}
              >{g === "All" ? "All" : g === "Men" ? "For Him" : g === "Women" ? "For Her" : "Unisex"}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] font-[600] uppercase tracking-[0.14em] text-[#8a7d66]">Sort</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="rounded-full border border-[#e2d8c2] bg-white px-4 py-[9px] text-[13px] outline-none transition focus:border-[#b3924f]"
            >
              <option value="featured">Featured</option>
              <option value="bestsellers">Bestsellers</option>
              <option value="new">New Arrivals</option>
              <option value="price_low">Price ↑</option>
              <option value="price_high">Price ↓</option>
            </select>
          </div>
        </div>

        {/* product grids */}
        <div className="space-y-16">
          {(gender === "All" && !search.trim() ? [
            { title: "For Her", items: filtered.filter(p => p.gender === "Women") },
            { title: "For Him", items: filtered.filter(p => p.gender === "Men") },
            { title: "Unisex", items: filtered.filter(p => p.gender === "Unisex") },
          ] : [
            { title: null, items: filtered }
          ]).filter(g => g.items.length > 0).map((group, idx) => (
            <div key={idx}>
              {group.title && <h3 className="mb-6 border-b border-[#e7dfcd] pb-3 text-[30px] text-[#191510] lg:text-[34px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{group.title}</h3>}
              <div className="grid grid-cols-2 gap-3 sm:gap-7 md:grid-cols-3 lg:grid-cols-4">
                {group.items.map(p => (
                  <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8e0cd] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_36px_70px_-30px_rgba(90,70,40,0.35)]">
                    <div className="relative overflow-hidden">
                      <PerfumeImage product={p} onClick={() => setModal(p)} className="h-[190px] w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-[260px] md:h-[320px] lg:h-[380px]" />
                      <div className="absolute left-3 top-3 flex gap-1.5">
                        {p.bestseller && <span className="rounded-full bg-[#191510]/85 px-2.5 py-1 text-[8.5px] font-[600] uppercase tracking-[0.16em] text-[#e9dcb8] backdrop-blur">Bestseller</span>}
                        {p.nouveau && <span className="rounded-full bg-[#6e1e2a] px-2.5 py-1 text-[8.5px] font-[600] uppercase tracking-[0.16em] text-white">New</span>}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-[#e8e0cd] bg-white/95 transition-transform hover:scale-110 sm:h-10 sm:w-10"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlist.includes(p.id) ? "#6e1e2a" : "none"} stroke={wishlist.includes(p.id) ? "#6e1e2a" : "#6b6153"} strokeWidth="1.7"><path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.6 1.6-1.6 4.1 0 5.7l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.1 0-5.7Z" /></svg>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#191510]/75 via-[#191510]/40 to-transparent p-2.5 transition-transform duration-300 group-hover:translate-y-0 sm:p-4">
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                          {p.sizes.map(s => {
                            const orig = s.ml === 10 ? 500 : s.ml === 50 ? 1600 : s.ml === 100 ? 3000 : null;
                            return (
                              <button key={s.ml} onClick={(e) => { e.stopPropagation(); addToCart(p.id, s.ml); }} className="rounded-full bg-white/95 px-2 py-1.5 text-[9.5px] font-[600] text-[#191510] transition hover:bg-[#e8c876] sm:px-3 sm:text-[11.5px]">
                                {s.ml}ml {orig ? <s className="mr-0.5 text-[8.5px] font-normal text-[#9a8c72] sm:text-[9.5px]">Rs {orig.toLocaleString()}</s> : null} {PKR(s.price)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 pb-5 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[20px] leading-tight text-[#191510] sm:text-[23px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{p.name}</h3>
                          <div className="mt-1 text-[10px] font-[600] uppercase tracking-[0.14em] text-[#a08040]">{p.gender === "Men" ? "For Him" : p.gender === "Women" ? "For Her" : "Unisex"} • {p.family}</div>
                        </div>
                        <div className="shrink-0 text-right text-[10px] text-[#8a7d66]">
                          <div className="flex items-center justify-end gap-1"><Stars rating={p.rating} /><span>{p.rating}</span></div>
                          <div className="mt-0.5 text-[9px] text-[#a4977e]">({p.reviews} reviews)</div>
                        </div>
                      </div>
                      <div className="mt-1.5 text-[12px] italic text-[#8a7d66] line-clamp-1">{p.mood}</div>
                      <div className="mt-auto">
                        <div className="mt-4 grid grid-cols-3 gap-1.5 text-center">
                          {p.sizes.map(s => {
                            const orig = s.ml === 10 ? 500 : s.ml === 50 ? 1600 : s.ml === 100 ? 3000 : null;
                            return (
                              <div key={s.ml} className="rounded-xl border border-[#ece3cf] bg-[#faf7ee] py-1.5 sm:py-2">
                                <div className="text-[8.5px] font-[600] uppercase tracking-[0.12em] text-[#a4977e]">{s.ml}ml</div>
                                {orig && <div className="text-[8.5px] text-[#b3a488] line-through sm:text-[10px]">Rs {orig.toLocaleString()}</div>}
                                <div className="text-[10.5px] font-[700] text-[#191510] sm:text-[13px]">{PKR(s.price)}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3.5 flex items-center gap-2">
                          <button onClick={() => setModal(p)} className="flex-1 rounded-full bg-[#191510] py-[9px] text-[10px] font-[600] uppercase tracking-[0.12em] text-[#f0e6d2] transition hover:bg-[#2b241a] sm:py-[11px] sm:text-[11px]">View Details</button>
                          <button onClick={() => addToCart(p.id)} className="rounded-full border border-[#ddd2b8] px-4 py-[9px] text-[10px] font-[600] uppercase tracking-[0.12em] text-[#5c5344] transition hover:border-[#b3924f] hover:text-[#8a6a33] sm:px-5 sm:py-[11px] sm:text-[11px]">+ Bag</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-[15px] text-[#a4977e]">No perfumes match your search. Try a different filter.</div>
        )}
      </section>

      {/* ═══════════ PRICING BANNER ═══════════ */}
      <section className="relative overflow-hidden bg-[#12100b] text-[#ece1c8]">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#c9a75c]/10 blur-[130px]"></div>
        <div className="relative mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[800px] text-center">
            <div className="text-[10.5px] font-[600] uppercase tracking-[0.26em] text-[#cfae66]">Simple & Honest Pricing</div>
            <h3 className="mt-4 text-[40px] leading-[0.98] lg:text-[54px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              One price for every fragrance.
            </h3>
            <p className="mx-auto mt-4 max-w-[540px] text-[15px] leading-relaxed text-[#b3a486]">
              No hidden charges. No confusing tiers. Every Huda Essence perfume is the same price — pick your size.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-[860px] gap-5 sm:grid-cols-3">
            {[
              { ml: 10, price: 299, originalPrice: 500, label: "Travel Size", desc: "Perfect for trying a new scent or keeping in your bag" },
              { ml: 50, price: 1299, originalPrice: 1600, label: "Popular Choice", desc: "The sweet spot — lasts 2–3 months with daily wear" },
              { ml: 100, price: 2399, originalPrice: 3000, label: "Best Value", desc: "Maximum value — 5+ months of your signature scent", popular: true },
            ].map(s => (
              <div key={s.ml} className={`relative overflow-hidden rounded-2xl border p-6 text-center ${s.popular ? "border-[#c3a05c] bg-[#1d1810]" : "border-[#2c2517] bg-[#181510]"}`}>
                {s.popular && <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="animate-sheen absolute -top-1/2 h-[200%] w-16 bg-gradient-to-r from-transparent via-[#e8c876]/15 to-transparent" /></div>}
                <div className="mb-3 text-[9.5px] font-[700] uppercase tracking-[0.24em] text-[#cfae66]">{s.label}</div>
                <div className="text-[13px] font-[500] text-[#8a7a5c] line-through">Rs {s.originalPrice.toLocaleString()}</div>
                <div className="mt-1 text-[38px] leading-none text-[#f2e6c8] sm:text-[44px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  Rs {s.price.toLocaleString()}
                </div>
                <div className="mt-2 text-[10.5px] font-[600] uppercase tracking-[0.18em] text-[#b3924f]">{s.ml} ml Eau de Parfum</div>
                <div className="mt-3 text-[12.5px] leading-relaxed text-[#a49372]">{s.desc}</div>
                <button
                  onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className={`mt-5 w-full rounded-full py-3 text-[11px] font-[600] uppercase tracking-[0.14em] transition ${s.popular ? "bg-[#e0bd6f] text-[#1c1408] hover:bg-[#eccf85]" : "border border-[#3d3320] bg-transparent text-[#d8c49c] hover:bg-[#241e13]"}`}
                >
                  Shop {s.ml}ml
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="border-y border-[#e7dfcd] bg-[#f3efe4]">
        <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="text-[10.5px] font-[600] uppercase tracking-[0.24em] text-[#a08040]">About Huda Essence</div>
            <h3 className="mt-4 text-[40px] leading-[1.0] text-[#191510] lg:text-[52px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>We don't just copy.<br />We craft impressions.</h3>
            <p className="mx-auto mt-5 max-w-[600px] text-[15.5px] leading-relaxed text-[#5c5344]">
              Huda Essence is a Pakistani impression perfume brand that believes everyone deserves to smell amazing.
              We study the world's most iconic designer fragrances and recreate their scent profiles using premium oils.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-[960px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Premium Oils", "High-quality fragrance oils sourced for long-lasting performance."],
              ["Affordable Luxury", "Designer-inspired scents from just PKR 299 for 10ml."],
              ["Made for Pakistan", "Formulated to perform in our hot and humid climate."],
              ["Flat Delivery", `Flat PKR ${deliveryCharge} delivery charge within Karachi only.`],
              ["Cash on Delivery", "Pay in cash on delivery! Only delivery charges (PKR " + deliveryCharge + ") paid in advance via JazzCash, EasyPaisa, or Bank."],
            ].map(([t, s]) => (
              <div key={t} className="rounded-2xl border border-[#e5dcc6] bg-white/80 p-5 transition hover:border-[#cbb47f]">
                <div className="text-[19px] text-[#191510]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{t}</div>
                <div className="mt-1.5 text-[13px] leading-relaxed text-[#6b6153]">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEWS ═══════════ */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-[90px]">
        <div className="mb-12 text-center">
          <div className="text-[10.5px] font-[600] uppercase tracking-[0.24em] text-[#a08040]">Customer Love</div>
          <h3 className="mt-3 text-[38px] leading-[0.98] text-[#191510] lg:text-[48px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>What Our Customers Say</h3>
          <p className="mt-3 text-[14px] text-[#6b6153]"><span className="text-[#c9a24b]">★ 4.9</span> average rating from 5,000+ happy customers</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Fatima A.", city: "Karachi", text: "Tea Rosée is AMAZING! My friends thought I'm wearing an expensive imported perfume. Can't believe it's only PKR 1,299 for 50ml. Already ordered 3 more fragrances!", scent: "Tea Rosée • 50ml", stars: 5 },
            { name: "Ahmed K.", city: "Karachi", text: "Blue is my daily signature now. Lasts the entire day even in Karachi heat. Multiple compliments at office. Huda Essence quality is unreal at this price point.", scent: "Blue for Men • 100ml", stars: 5 },
            { name: "Sara M.", city: "Karachi", text: "Ordered Armani Code for my husband and Miss Dior for myself. Both are incredible! The packaging is beautiful, delivery was fast, and the scents last 6 to 8 hours.", scent: "Armani Code + Miss Dior", stars: 5 },
          ].map((r, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-[#e8e0cd] bg-white p-6">
              <div className="text-[15px] tracking-[0.2em] text-[#c9a24b]">{"★".repeat(r.stars)}</div>
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-[#3c3428]">"{r.text}"</p>
              <div className="mt-5 border-t border-[#efe8d6] pt-4">
                <div className="text-[13.5px] font-[600] text-[#191510]">{r.name} — {r.city}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[#a4977e]">{r.scent}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section className="border-y border-[#e7dfcd] bg-[#fbf9f4]">
        <div className="mx-auto max-w-[1320px] px-5 py-14 lg:px-10 lg:py-20">
          <div className="mb-10 text-center">
            <h3 className="text-[36px] leading-[0.98] text-[#191510] lg:text-[46px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Why Choose Huda Essence?</h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "💎", title: "Designer Quality", desc: "Premium impression oils that rival originals costing 10x more" },
              { emoji: "🇵🇰", title: "Made in Pakistan", desc: "Proudly crafted for Pakistani customers and our climate" },
              { emoji: "⏰", title: "Long Lasting", desc: "6 to 8 hours of beautiful fragrance performance" },
              { emoji: "🎁", title: "Perfect Gift", desc: "Beautiful packaging makes every order gift-ready" },
            ].map(item => (
              <div key={item.title} className="rounded-2xl border border-[#e8e0cd] bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(90,70,40,0.3)]">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f6efdd] text-[24px]">{item.emoji}</div>
                <div className="mt-4 text-[17px] font-[600] text-[#191510]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{item.title}</div>
                <div className="mt-2 text-[13px] leading-relaxed text-[#6b6153]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="bg-[#12100b] text-[#ece1c8]">
        <div className="mx-auto max-w-[900px] px-5 py-16 text-center lg:px-10 lg:py-[90px]">
          <div className="text-[10.5px] font-[600] uppercase tracking-[0.26em] text-[#cfae66]">Ready to smell amazing?</div>
          <h4 className="mt-4 text-[38px] leading-[1.0] lg:text-[50px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Order your Huda Essence<br />perfume today.</h4>
          <p className="mt-4 text-[15px] text-[#b3a486]">Delivery in Karachi only. Cash on Delivery available! Delivery charges advance.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full bg-[#e0bd6f] px-8 py-[15px] text-[11.5px] font-[700] uppercase tracking-[0.14em] text-[#1c1408] transition hover:bg-[#eccf85]">Shop All Perfumes</button>
            <a href={`https://wa.me/${whatsappNum}?text=Hi! I want to place an order from Huda Essence`} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-full border border-[#3d3320] px-8 py-[15px] text-[11.5px] font-[600] uppercase tracking-[0.12em] text-[#e5d3ac] transition hover:bg-[#1d1810]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              WhatsApp Order
            </a>
          </div>
          <div className="mt-7 text-[12px] tracking-[0.04em] text-[#8a7a5c]">10ml: <s className="opacity-70">Rs 500</s> <span className="font-[700] text-[#e0bd6f]">Rs 299</span> &nbsp;•&nbsp; 50ml: <s className="opacity-70">Rs 1,600</s> <span className="font-[700] text-[#e0bd6f]">Rs 1,299</span> &nbsp;•&nbsp; 100ml: <s className="opacity-70">Rs 3,000</s> <span className="font-[700] text-[#e0bd6f]">Rs 2,399</span></div>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section id="contact" className="mx-auto max-w-[1320px] px-5 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="text-[10.5px] font-[600] uppercase tracking-[0.24em] text-[#a08040]">Get in Touch</div>
            <h3 className="mt-3 text-[36px] leading-[1.0] text-[#191510] lg:text-[46px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Have a question?<br />We'd love to help.</h3>
            <div className="mt-8 space-y-5 text-[14.5px] text-[#3c3428]">
              {[
                { icon: "📱", label: "WhatsApp", val: `+${whatsappNum.replace(/(\d{2})(\d{3})(\d{7})/, "$1 $2 $3")}`, href: `https://wa.me/${whatsappNum}` },
                { icon: "📸", label: "Instagram", val: "@hudaessence2026", href: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=q1vsax1" },
                { icon: "📘", label: "Facebook", val: "Huda Essence", href: "https://www.facebook.com/share/18vFchSaVf/" },
                { icon: "📧", label: "Email", val: "hello@hudaessence.pk", href: "mailto:hello@hudaessence.pk" },
                { icon: "📍", label: "Location", val: "Karachi, Pakistan" },
                { icon: "⏰", label: "Hours", val: "Mon–Sat 11am–10pm PKT" },
              ].map(({ icon, label, val, href }) => {
                const Content = () => (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e5dcc6] bg-white text-[16px]">{icon}</span>
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-[700] uppercase tracking-[0.14em] text-[#191510]">
                        {label}
                        {href && <span className="font-normal text-[#a08040] opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">→</span>}
                      </div>
                      <div className="mt-0.5 text-[#6b6153] transition-colors duration-200 group-hover:text-[#8a6a33]">{val}</div>
                    </div>
                  </>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3.5 group cursor-pointer transition-transform duration-200 hover:translate-x-1">
                    <Content />
                  </a>
                ) : (
                  <div key={label} className="flex items-start gap-3.5">
                    <Content />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <form onSubmit={e => { e.preventDefault(); setToast("Message sent! We'll reply within 2 hours InshaAllah."); }} className="space-y-4 rounded-2xl border border-[#e8e0cd] bg-white p-6 lg:p-8">
              <div className="text-[21px] text-[#191510]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Send us a message</div>
              <input required type="text" placeholder="Your Name" className="w-full rounded-xl border border-[#e5dcc6] bg-[#fbf9f4] px-4 py-3.5 text-[14px] outline-none transition focus:border-[#b3924f]" />
              <input required type="tel" placeholder="Phone / WhatsApp Number" className="w-full rounded-xl border border-[#e5dcc6] bg-[#fbf9f4] px-4 py-3.5 text-[14px] outline-none transition focus:border-[#b3924f]" />
              <input type="email" placeholder="Email (optional)" className="w-full rounded-xl border border-[#e5dcc6] bg-[#fbf9f4] px-4 py-3.5 text-[14px] outline-none transition focus:border-[#b3924f]" />
              <textarea required rows={4} placeholder="Your message…" className="w-full resize-none rounded-xl border border-[#e5dcc6] bg-[#fbf9f4] px-4 py-3.5 text-[14px] outline-none transition focus:border-[#b3924f]" />
              <button className="w-full rounded-full bg-[#191510] py-[13px] text-[11.5px] font-[600] uppercase tracking-[0.14em] text-[#f0e6d2] transition hover:bg-[#2b241a]">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#12100b] text-[#b8a688]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 text-[13.5px] md:grid-cols-4 lg:px-10">
          <div>
            <div onClick={() => setAdminClicks(c => c + 1)} className="cursor-default"><Logo size="footer" /></div>
            <p className="mt-4 leading-relaxed text-[#8a7a5c]">Premium impression perfumes inspired by the world's finest designer fragrances. Made for Pakistan.</p>
            <div className="mt-6 flex gap-3">
              <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=q1vsax1" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#2c2517] flex items-center justify-center text-[#8a7a5c] hover:text-[#e9dcb8] hover:border-[#e9dcb8] hover:bg-[#1d1810] transition duration-200" title="Follow @hudaessence2026 on Instagram">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/share/18vFchSaVf/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#2c2517] flex items-center justify-center text-[#8a7a5c] hover:text-[#e9dcb8] hover:border-[#e9dcb8] hover:bg-[#1d1810] transition duration-200" title="Follow us on Facebook">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.625L17 8h-4V6.875C13 5.9 13.5 5.5 14.5 5.5h2.5V2h-3.625C9.75 2 9 3.5 9 5.625V8z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-[700] uppercase tracking-[0.18em] text-[#e9dcb8]">Shop</div>
            <ul className="space-y-2 text-[#9a8a6a]">
              <li><a href="#shop" className="hover:text-[#e9dcb8] transition">All Perfumes</a></li>
              {PRODUCTS.map(p => <li key={p.id}><a href="#shop" className="hover:text-[#e9dcb8] transition">{p.name}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-[700] uppercase tracking-[0.18em] text-[#e9dcb8]">Help</div>
            <ul className="space-y-2 text-[#9a8a6a]">
              <li>Shipping Policy</li>
              <li>Track Your Order</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-[700] uppercase tracking-[0.18em] text-[#e9dcb8]">Pricing</div>
            <ul className="space-y-2 text-[#9a8a6a]">
              <li>10ml — <s className="opacity-60">Rs 500</s> <span className="font-[700] text-[#e0bd6f]">Rs 299</span></li>
              <li>50ml — <s className="opacity-60">Rs 1,600</s> <span className="font-[700] text-[#e0bd6f]">Rs 1,299</span></li>
              <li>100ml — <s className="opacity-60">Rs 3,000</s> <span className="font-[700] text-[#e0bd6f]">Rs 2,399</span></li>
              <li className="pt-1 text-[#c9ab6c]">PKR {deliveryCharge} delivery (Karachi Only) • COD Available</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#241e12]">
          <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-4 px-5 py-5 text-[12px] text-[#7a6a4e] lg:px-10">
            <div>© {new Date().getFullYear()} Huda Essence — All rights reserved. Impression perfumes inspired by designers, not affiliated.</div>
            <div className="flex gap-5"><span>Privacy Policy</span><span>Terms</span></div>
          </div>
        </div>
      </footer>

      {/* ═══════════ MODALS / DRAWER ═══════════ */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative m-auto w-[min(1020px,96vw)] max-h-[92vh] overflow-auto rounded-3xl bg-[#fbf9f4] shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#e5dcc6] grid place-items-center text-[#725a3d] z-10 hover:bg-[#f5e5cc] transition text-[18px]">✕</button>
            <div className="grid md:grid-cols-[460px_1fr]">
              <div className="relative bg-[#f0e9d8]">
                <PerfumeImage product={modal} className="w-full h-[450px] md:h-full object-cover" />
                <div className="absolute left-5 top-5 flex gap-2">
                  {modal.bestseller && <span className="bg-[#191510]/90 text-[#e9dcb8] px-3 py-1.5 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-[600]">Bestseller</span>}
                  {modal.nouveau && <span className="bg-[#6e1e2a] text-white px-3 py-1.5 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-[600]">New</span>}
                </div>
              </div>
              <div className="p-7 md:p-9">
                <div className="text-[10.5px] tracking-[0.24em] text-[#a08040] uppercase font-[600]">
                  {modal.gender === "Men" ? "For Him" : modal.gender === "Women" ? "For Her" : "Unisex"} • {modal.family}
                </div>
                <h4 className="text-[38px] leading-[0.95] mt-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{modal.name}</h4>
                <div className="text-[14px] text-[#6a5037] mt-1">{modal.concentration}</div>
                <div className="mt-1 text-[13px] text-[#9a7f5f]"><Stars rating={modal.rating} /> {modal.rating} • {modal.reviews} reviews</div>
                <p className="mt-4 text-[15px] leading-relaxed text-[#4b3828]">{modal.story}</p>
                {/* notes */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                  <div className="bg-[#f5efe3] p-3.5 rounded-2xl border border-[#e8ded0] shadow-sm">
                    <div className="text-[10.5px] tracking-[0.18em] text-[#a08040] uppercase font-[700] mb-2 flex items-center gap-1.5">
                      <span className="text-[12px]">✨</span> Top Notes
                    </div>
                    {modal.top.map(n => <div key={n} className="text-[#4b3728] mb-1 font-[500] flex items-center gap-1.5"><span className="text-[#c2a265] text-[10px]">♦</span> {n}</div>)}
                  </div>
                  <div className="bg-[#f5efe3] p-3.5 rounded-2xl border border-[#e8ded0] shadow-sm">
                    <div className="text-[10.5px] tracking-[0.18em] text-[#a08040] uppercase font-[700] mb-2 flex items-center gap-1.5">
                      <span className="text-[12px]">🌿</span> Heart Notes
                    </div>
                    {modal.heart.map(n => <div key={n} className="text-[#4b3728] mb-1 font-[500] flex items-center gap-1.5"><span className="text-[#c2a265] text-[10px]">♦</span> {n}</div>)}
                  </div>
                  <div className="bg-[#f5efe3] p-3.5 rounded-2xl border border-[#e8ded0] shadow-sm">
                    <div className="text-[10.5px] tracking-[0.18em] text-[#a08040] uppercase font-[700] mb-2 flex items-center gap-1.5">
                      <span className="text-[12px]">🪵</span> Base Notes
                    </div>
                    {modal.base.map(n => <div key={n} className="text-[#4b3728] mb-1 font-[500] flex items-center gap-1.5"><span className="text-[#c2a265] text-[10px]">♦</span> {n}</div>)}
                  </div>
                </div>
                <div className="mt-5 text-[13.6px] text-[#5a452f] italic">{modal.mood}</div>
                {/* size picker */}
                <div className="mt-6">
                  <div className="text-[11px] tracking-[0.18em] text-[#9b7141] uppercase font-[600] mb-3">Select Your Size</div>
                  <div className="flex flex-wrap gap-3">
                    {modal.sizes.map(s => {
                      const orig = s.ml === 10 ? 500 : s.ml === 50 ? 1600 : s.ml === 100 ? 3000 : null;
                      return (
                        <button key={s.ml} onClick={() => setSizePick(s.ml)} className={`rounded-2xl px-5 py-4 border text-left min-w-[140px] transition relative ${sizePick === s.ml ? "border-[#b3924f] bg-[#faf3e3]" : "border-[#e5dcc6] bg-white hover:bg-[#fbf9f4]"}`}>
                          <div className="absolute -top-2.5 -right-2 bg-[#6e1e2a] text-white text-[9px] font-[700] px-2 py-0.5 rounded-full tracking-wider">SALE</div>
                          <div className="text-[15px] font-[700]">{s.ml} ml Perfume</div>
                          {orig && <div className="text-[12px] text-[#9a8c72] line-through">Original: Rs {orig.toLocaleString()}</div>}
                          <div className="text-[14px] font-[700] text-[#6e1e2a]">Sale: Rs {s.price.toLocaleString()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <button onClick={() => { addToCart(modal.id, sizePick); setModal(null); }} className="px-7 py-[14px] rounded-full bg-[#191510] text-[#f0e6d2] text-[14.5px] font-[600] hover:bg-[#2b241a] transition">
                    Add to Bag — {PKR(modal.sizes.find(s => s.ml === sizePick)?.price ?? modal.sizes[0].price)}
                  </button>
                  <a href={`https://wa.me/${whatsappNum}?text=Hi! I want to order ${modal.name} (${sizePick}ml) from Huda Essence`} target="_blank" rel="noopener" className="px-5 py-[14px] rounded-full bg-[#25D366] text-white text-[13.7px] font-[600] flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp
                  </a>
                  <button onClick={() => toggleWish(modal.id)} className="px-5 py-[14px] rounded-full border border-[#d9b97f] text-[13.7px]">
                    {wishlist.includes(modal.id) ? "♥ Saved" : "♡ Save"}
                  </button>
                </div>
                <div className="mt-6 text-[12.6px] text-[#6b6153] border-t border-[#efe8d6] pt-4 grid grid-cols-2 gap-3">
                  <div>✓ PKR {deliveryCharge} delivery (Karachi Only)</div>
                  <div>✓ Cash on Delivery Available</div>
                  <div>✓ Delivery charges advance only</div>
                  <div>✓ Premium quality oils</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ CART DRAWER ═══════════ */}
      <div className={`fixed inset-0 z-[70] ${cartOpen ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setCartOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-[430px] max-w-[96vw] bg-[#fbf9f4] shadow-2xl border-l border-[#e8e0cd] transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-16 px-6 border-b border-[#e8e0cd] flex items-center justify-between">
            <div className="text-[22px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Your Bag ({cartCount})</div>
            <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full hover:bg-[#f3efe4] grid place-items-center text-[#6b6153] transition text-[16px]">✕</button>
          </div>
          <div className="px-6 py-4 overflow-auto h-[calc(100%-270px)] space-y-4">
            {cart.length === 0 && (
              <div className="text-center py-16">
                <div className="text-[40px] mb-3">🧴</div>
                <div className="text-[#9a8062] text-[15px]">Your bag is empty.</div>
                <button onClick={() => { setCartOpen(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-4 px-5 py-2.5 rounded-full bg-[#191510] text-[#f0e6d2] text-[13.5px]">Shop Perfumes</button>
              </div>
            )}
            {cart.map((line, idx) => {
              const p = PRODUCTS.find(pp => pp.id === line.productId);
              if (!p) return null;
              const sz = p.sizes.find(s => s.ml === line.sizeMl) ?? p.sizes[0];
              return (
                <div key={`${line.productId}-${line.sizeMl}-${idx}`} className="flex gap-4 bg-white border border-[#ece3cf] rounded-2xl p-3">
                  <PerfumeImage product={p} className="w-[76px] h-[76px] object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[17px] font-[600] truncate" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{p.name}</div>
                    <div className="text-[12px] text-[#8d7253]">{line.sizeMl}ml • {p.concentration}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-[#dfc8a6] rounded-full">
                        <button onClick={() => setCart(c => c.map((l, i) => i === idx ? { ...l, qty: Math.max(1, l.qty - 1) } : l))} className="px-3 py-1 text-[#7b5f3f]">−</button>
                        <span className="px-2 text-[13px] w-7 text-center font-[600]">{line.qty}</span>
                        <button onClick={() => setCart(c => c.map((l, i) => i === idx ? { ...l, qty: l.qty + 1 } : l))} className="px-3 py-1 text-[#7b5f3f]">+</button>
                      </div>
                      <div className="text-[15px] font-[700]">{PKR(sz.price * line.qty)}</div>
                    </div>
                  </div>
                  <button onClick={() => setCart(c => c.filter((_, i) => i !== idx))} className="text-[#a4977e] text-[11px] self-start hover:text-[#6e1e2a] transition">✕</button>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#e8e0cd] bg-[#f5f1e6] px-6 py-5">
            {cart.length > 0 && (<>
              <div className="flex justify-between text-[14px] text-[#6d5437]"><span>Subtotal</span><span className="font-[600]">{PKR(cartTotal)}</span></div>
              <div className="flex justify-between text-[14px] text-[#6d5437] mt-1"><span>Delivery</span><span className="font-[600]">PKR {deliveryCharge}</span></div>
              <div className="flex justify-between text-[20px] font-[700] mt-3"><span>Total</span><span>{PKR(cartTotal + deliveryCharge)}</span></div>
              <button
                onClick={() => { setCheckoutOpen(true); setCheckoutStep(1); }}
                className="w-full mt-4 py-[14px] rounded-full bg-[#191510] text-[#f0e6d2] font-[700] text-[14px] flex items-center justify-center gap-2 hover:bg-[#2b241a] transition"
              >
                💳 Proceed to Checkout
              </button>
              <div className="text-[11.5px] text-center text-[#9a7d5c] mt-2">Cash on Delivery Available • Delivery Charges Advance (EasyPaisa / JazzCash / Bank)</div>
            </>)}
          </div>
        </aside>
      </div>

      {/* ═══════════ CHECKOUT MODAL ═══════════ */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[80] flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)} />
          <div className="relative m-auto w-[min(560px,96vw)] max-h-[94vh] overflow-auto rounded-3xl bg-[#fbf9f4] shadow-2xl">
            <button onClick={() => setCheckoutOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#e5dcc6] grid place-items-center text-[#725a3d] z-10 hover:bg-[#f5e5cc] transition text-[18px]">✕</button>

            {/* Header */}
            <div className="bg-[#12100b] text-[#ece1c8] px-7 py-5 rounded-t-3xl">
              <div className="text-[10px] tracking-[0.22em] uppercase font-[600] text-[#d2a75a]">Checkout</div>
              <div className="text-[26px] mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                {checkoutStep === 1 ? "Your Details" : "Payment & Confirmation"}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className={`flex items-center gap-1.5 text-[11px] font-[600] ${checkoutStep >= 1 ? "text-[#e0bd6f]" : "text-[#6b5a46]"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] ${checkoutStep >= 1 ? "bg-[#e0bd6f] text-[#1c1408]" : "bg-[#3a2b21] text-[#8a7054]"}`}>1</span>
                  Details
                </div>
                <div className={`w-8 h-px ${checkoutStep >= 2 ? "bg-[#e0bd6f]" : "bg-[#3a2b21]"}`}></div>
                <div className={`flex items-center gap-1.5 text-[11px] font-[600] ${checkoutStep >= 2 ? "text-[#e0bd6f]" : "text-[#6b5a46]"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] ${checkoutStep >= 2 ? "bg-[#e0bd6f] text-[#1c1408]" : "bg-[#3a2b21] text-[#8a7054]"}`}>2</span>
                  Payment
                </div>
              </div>
            </div>

            <div className="p-7">
              {/* ── Order Summary ── */}
              <div className="bg-white rounded-2xl border border-[#ece3cf] p-4 mb-6">
                <div className="text-[11px] tracking-[0.18em] text-[#9b7141] uppercase font-[600] mb-3">Order Summary</div>
                {cart.map((line, idx) => {
                  const p = PRODUCTS.find(pp => pp.id === line.productId);
                  if (!p) return null;
                  const sz = p.sizes.find(s => s.ml === line.sizeMl) ?? p.sizes[0];
                  return (
                    <div key={`${line.productId}-${line.sizeMl}-${idx}`} className="flex items-center gap-3 py-2 border-b border-[#f0e0c8] last:border-0">
                      <PerfumeImage product={p} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-[600] truncate">{p.name}</div>
                        <div className="text-[11px] text-[#8d7253]">{line.sizeMl}ml × {line.qty}</div>
                      </div>
                      <div className="text-[14px] font-[700] shrink-0">{PKR(sz.price * line.qty)}</div>
                    </div>
                  );
                })}
                <div className="mt-3 pt-3 border-t border-[#e8e0cd] space-y-1">
                  <div className="flex justify-between text-[13px] text-[#6d5437]"><span>Subtotal</span><span>{PKR(cartTotal)}</span></div>
                  <div className="flex justify-between text-[13px] text-[#6d5437]"><span>Delivery</span><span>PKR {deliveryCharge}</span></div>
                  <div className="flex justify-between text-[17px] font-[700] pt-1"><span>Total</span><span>{PKR(cartTotal + deliveryCharge)}</span></div>
                </div>
              </div>

              {/* ── STEP 1: Customer Details ── */}
              {checkoutStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">Full Name *</label>
                    <input
                      value={custName}
                      onChange={e => setCustName(e.target.value)}
                      placeholder="e.g. Ahmed Khan"
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#b3924f] transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">Phone / WhatsApp Number *</label>
                    <input
                      value={custPhone}
                      onChange={e => setCustPhone(e.target.value)}
                      placeholder="e.g. 0312-3456789"
                      type="tel"
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#b3924f] transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">Delivery Address *</label>
                    <textarea
                      value={custAddress}
                      onChange={e => setCustAddress(e.target.value)}
                      placeholder="House #, Street, Block, Area..."
                      rows={3}
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#b3924f] transition bg-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">City</label>
                    <input
                      value={custCity}
                      onChange={e => setCustCity(e.target.value)}
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#b3924f] transition bg-white"
                    />
                  </div>

                  <button
                    onClick={() => setCheckoutStep(2)}
                    disabled={!canProceedStep1}
                    className={`w-full py-[14px] rounded-full font-[700] text-[14px] mt-2 transition ${canProceedStep1 ? "bg-[#191510] text-[#f0e6d2] hover:bg-[#2b241a]" : "bg-[#ddd5c4] text-[#a09882] cursor-not-allowed"}`}
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* ── STEP 2: Payment ── */}
              {checkoutStep === 2 && (
                <div className="space-y-5">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-3 block">Select Payment Method *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(["cod", "easypaisa", "jazzcash", "bank"] as ("cod" | "easypaisa" | "jazzcash" | "bank")[]).map(method => (
                        <button
                          key={method}
                          onClick={() => setPayMethod(method)}
                          className={`rounded-xl py-3.5 px-2 border text-center transition ${payMethod === method ? "border-[#b3924f] bg-[#faf3e3]" : "border-[#e5dcc6] bg-white hover:bg-[#fbf9f4]"}`}
                        >
                          <div className="text-[20px]">{paymentAccounts[method].icon}</div>
                          <div className="text-[12px] font-[600] mt-1">{paymentAccounts[method].title}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Account Details */}
                  {payMethod === "cod" ? (
                    <div className="bg-[#1a3a1a] text-[#d4f5d4] rounded-2xl p-5">
                      <div className="text-[10px] tracking-[0.2em] uppercase font-[600] text-[#66bb6a] mb-2">
                        💵 Cash on Delivery
                      </div>
                      <div className="text-[13px] text-[#a5d6a7] mb-3 leading-relaxed">Pay <span className="font-[700] text-white">{PKR(cartTotal)}</span> in cash when your order is delivered.</div>
                      <div className="bg-[#0d290d] rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#81c784]">Product Amount (COD)</span>
                          <span className="text-[18px] font-[700] text-[#a5d6a7]">{PKR(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#2e5a2e]">
                          <span className="text-[12px] text-[#ffb74d] font-[600]">⚠️ Delivery Charges (Pay Now)</span>
                          <span className="text-[18px] font-[700] text-[#ffb74d]">PKR {deliveryCharge}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-[11.5px] text-[#81c784] bg-[#0d290d] rounded-lg p-3 border border-[#2e5a2e]">
                        📋 <span className="font-[600]">How it works:</span> Pay PKR {deliveryCharge} delivery charges in advance via EasyPaisa/JazzCash/Bank. Remaining {PKR(cartTotal)} you pay in cash on delivery.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#14100d] text-[#f6e7c9] rounded-2xl p-5">
                      <div className="text-[10px] tracking-[0.2em] uppercase font-[600] text-[#d2a75a] mb-2">
                        {paymentAccounts[payMethod].title} Account Details
                      </div>
                      <div className="text-[11px] text-[#c5ad88] mb-3">Transfer the exact amount below and take a screenshot</div>
                      <div className="bg-[#1e1812] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#9a8163]">Account</span>
                          <span className="text-[15px] font-[700] text-[#f6e8cc] tracking-wide">{paymentAccounts[payMethod].number}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] text-[#9a8163]">Name</span>
                          <span className="text-[14px] font-[600] text-[#e8d3b6]">{paymentAccounts[payMethod].name}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#3a2b21]">
                          <span className="text-[12px] text-[#b3924f] font-[600]">Amount to Transfer</span>
                          <span className="text-[20px] font-[700] text-[#e0bd6f]">{PKR(cartTotal + deliveryCharge)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screenshot Upload */}
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-2 block">{payMethod === "cod" ? "Upload Delivery Charges Screenshot (Optional for now)" : "Upload Payment Screenshot *"}</label>
                    <div
                      onClick={() => screenshotInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition hover:bg-[#fbf9f4] ${payScreenshot ? "border-[#4CAF50] bg-[#f0faf0]" : "border-[#d5c8ab] bg-white"
                        }`}
                    >
                      {payScreenshot ? (
                        <div>
                          <img src={payScreenshot} alt="Payment screenshot" className="max-h-[200px] mx-auto rounded-xl shadow-md mb-3" loading="lazy" />
                          <div className="text-[13px] text-[#4CAF50] font-[600]">✓ {payScreenshotName}</div>
                          <div className="text-[11px] text-[#8a7054] mt-1">Click to change</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[32px] mb-2">📸</div>
                          <div className="text-[14px] font-[600] text-[#5a4a38]">Click to Upload Screenshot</div>
                          <div className="text-[12px] text-[#9a8163] mt-1">PNG, JPG — Payment proof required</div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={screenshotInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { if (e.target.files?.[0]) handleScreenshotUpload(e.target.files[0]); }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="px-5 py-[14px] rounded-full border border-[#ddd2b8] text-[13.5px] font-[600] text-[#5c5344] hover:bg-[#f3efe4] transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        const orderItems = cart.map(l => {
                          const p = PRODUCTS.find(pp => pp.id === l.productId);
                          return `• ${p?.name} (${l.sizeMl}ml) x${l.qty}`;
                        }).join('\n');
                        const msg = `🛍️ *NEW ORDER — Huda Essence*\n\n` +
                          `👤 *Name:* ${custName}\n` +
                          `📱 *Phone:* ${custPhone}\n` +
                          `📍 *Address:* ${custAddress}, ${custCity}\n\n` +
                          `📦 *Order Items:*\n${orderItems}\n\n` +
                          `💰 Subtotal: ${PKR(cartTotal)}\n` +
                          `🚚 Delivery: PKR ${deliveryCharge}\n` +
                          (payMethod === "cod" 
                            ? `💵 *Payment: Cash on Delivery*\n` +
                              `⚠️ Delivery charges PKR ${deliveryCharge} paid in advance\n` +
                              `✅ *Total COD Amount: ${PKR(cartTotal)}*\n\n`
                            : `✅ *Total Paid: ${PKR(cartTotal + deliveryCharge)}*\n\n` +
                              `💳 *Payment:* ${paymentAccounts[payMethod].title}\n`) +
                          `📸 Screenshot uploaded in form\n\n` +
                          `Please confirm my order. JazakAllah! 🙏`;
                        window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, '_blank');
                        setToast("✅ Order submitted! We'll confirm on WhatsApp shortly InshaAllah.");
                        setCart([]);
                        setCartOpen(false);
                        resetCheckout();
                      }}
                      disabled={!canConfirmOrder}
                      className={`flex-1 py-[14px] rounded-full font-[700] text-[14px] flex items-center justify-center gap-2 transition ${canConfirmOrder ? "bg-[#25D366] text-white hover:bg-[#1fba59]" : "bg-[#d9ccba] text-[#a09080] cursor-not-allowed"}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      Confirm Order via WhatsApp
                    </button>
                  </div>

                  {!canConfirmOrder && (
                    <div className="text-[12px] text-center text-[#b07a28] bg-[#fff8ee] rounded-xl py-2.5 border border-[#ead6b8]">
                      ⚠️ {payMethod === "cod" ? "Please fill in your details to confirm order" : "Please upload your payment screenshot to confirm order"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TOAST ═══════════ */}
      <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] transition-all duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        <div className="bg-[#191510] text-[#efe3c8] px-6 py-3.5 rounded-full text-[13.5px] shadow-xl border border-[#332a1a]">{toast}</div>
      </div>

      {/* ═══════════ FLOATING WHATSAPP ═══════════ */}
      <a href={`https://wa.me/${whatsappNum}?text=Hi! I'm interested in Huda Essence perfumes`} target="_blank" rel="noopener"
        className="fixed bottom-6 right-6 z-50 w-[58px] h-[58px] rounded-full bg-[#25D366] grid place-items-center shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </a>

      {/* ═══════════ ADMIN PANEL ═══════════ */}
      {adminOpen && (
        adminAuth ? (
          <AdminPanel
            products={PRODUCTS}
            onSave={saveProducts}
            onClose={() => { setAdminOpen(false); setAdminAuth(false); setAdminPass(""); window.location.hash = ""; }}
            deliveryCharge={deliveryCharge}
            onDeliveryChange={saveDelivery}
            whatsapp={whatsappNum}
            onWhatsappChange={saveWhatsapp}
          />
        ) : (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-5">
            <div className="bg-[#fbf9f4] border border-[#e8e0cd] rounded-3xl max-w-[400px] w-full p-8 shadow-2xl text-center">
              <h3 className="text-[28px] mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Admin Access</h3>
              <p className="text-[13px] text-[#7a6652] mb-6">Enter password to manage products and store settings</p>
              <input
                type="password"
                placeholder="Enter password"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (adminPass === "Pakistan@321") {
                      setAdminAuth(true);
                    } else {
                      alert("Incorrect Password!");
                    }
                  }
                }}
                className="w-full border border-[#dcd2bc] rounded-xl px-4 py-3 text-[14px] text-center outline-none focus:border-[#b3924f] bg-white mb-4 font-mono"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setAdminOpen(false); setAdminPass(""); window.location.hash = ""; }}
                  className="flex-1 py-3 rounded-full border border-[#ddd2b8] text-[13.5px] font-[600] text-[#5c5344] hover:bg-[#f3efe4] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (adminPass === "Pakistan@321") {
                      setAdminAuth(true);
                    } else {
                      alert("Incorrect Password!");
                    }
                  }}
                  className="flex-1 py-3 rounded-full bg-[#191510] text-[#f0e6d2] text-[13.5px] font-[600] hover:bg-[#2b241a] transition"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
