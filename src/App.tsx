import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import Logo from './Logo';
import AdminPanel, { ProductData } from './AdminPanel';

/* ── types ─────────────────────────────────────────── */
type Product = ProductData;

/* ── PKR formatter ────────────────────────────────── */
const PKR = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;

/* ── All 12 Products (Matched) ──────────────────── */
const DEFAULT_PRODUCTS: Product[] = [
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
    "mood": "fresh • clean • commanding",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/bleu-de-chanel.png",
    "bestseller": true,
    "rating": 4.88,
    "reviews": 1356,
    "story": "A tribute to masculine freedom. Our Bleu impression is crisp, powerful, and impossibly versatile — from the boardroom to formal evenings. Designed to last in Pakistan's warm weather."
  },
  {
    "id": "blue-for-men",
    "name": "Blue for Men",
    "inspiredBy": "Sauvage by Dior",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Fougère",
    "top": [
      "Calabrian Bergamot",
      "Pepper"
    ],
    "heart": [
      "Sichuan Pepper",
      "Lavender",
      "Pink Pepper",
      "Vetiver",
      "Patchouli"
    ],
    "base": [
      "Ambroxan",
      "Cedar",
      "Labdanum"
    ],
    "mood": "raw • wild • magnetic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/blue-for-men.png",
    "bestseller": true,
    "rating": 4.91,
    "reviews": 1420,
    "story": "The ultimate modern masculine signature. An explosive blast of fresh bergamot and raw ambroxan. A fragrance that projects confidence and turns heads wherever you go."
  },
  {
    "id": "one-million",
    "name": "One Million",
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
      "Rose"
    ],
    "base": [
      "Amber",
      "Leather",
      "Woody Notes",
      "Patchouli"
    ],
    "mood": "bold • luxurious • nocturnal",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/one-million.png",
    "bestseller": true,
    "rating": 4.85,
    "reviews": 980,
    "story": "The scent of success and luxury. A rich, spicy-sweet blend of cinnamon, leather, and blood mandarin that projects beautifully in evening weather and festive gatherings."
  },
  {
    "id": "kouros",
    "name": "Kouros",
    "inspiredBy": "Kouros by Yves Saint Laurent",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Fougère",
    "top": [
      "Artemisia",
      "Coriander",
      "Clary Sage",
      "Bergamot"
    ],
    "heart": [
      "Carnation",
      "Cinnamon",
      "Jasmine",
      "Geranium"
    ],
    "base": [
      "Musk",
      "Civet",
      "Oakmoss",
      "Amber",
      "Tonka Bean"
    ],
    "mood": "powerful • classic • masculine",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/kouros.png",
    "rating": 4.87,
    "reviews": 1067,
    "story": "A bold statement of masculinity and power. This iconic aromatic fougère blends sharp herbs and warm spices with a deep, animalic base. A legend for the confident man."
  },
  {
    "id": "coco-mademoiselle",
    "name": "Coco Mademoiselle",
    "inspiredBy": "Coco Mademoiselle by Chanel",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Amber Floral",
    "top": [
      "Orange",
      "Mandarin Orange",
      "Bergamot",
      "Orange Blossom"
    ],
    "heart": [
      "Turkish Rose",
      "Jasmine",
      "Mimosa",
      "Ylang-Ylang"
    ],
    "base": [
      "Patchouli",
      "White Musk",
      "Vanilla",
      "Vetiver",
      "Tonka Bean"
    ],
    "mood": "elegant • chic • captivating",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/coco-mademoiselle.png",
    "bestseller": true,
    "rating": 4.93,
    "reviews": 1150,
    "story": "A spirited and voluptuous fragrance. Sparkly orange notes meet a clear heart of rose and jasmine, settling on a rich, refined patchouli base. The essence of a bold, free woman."
  },
  {
    "id": "janan-j",
    "name": "Janan J.",
    "inspiredBy": "Janan by J.",
    "gender": "Men",
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
    "mood": "bold • smoky • alluring",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/janan-j.png",
    "rating": 4.82,
    "reviews": 640,
    "story": "A Pakistani legend reimagined. This intense, smoky-spicy blend captures the essence of Janan with bold oud undertones and warm amber. A signature scent for the confident man."
  },
  {
    "id": "secret-women",
    "name": "Secret Women",
    "inspiredBy": "Secret Women by Huda Essence",
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
    "mood": "addictive • warm • seductive",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/secret-women.png",
    "bestseller": true,
    "rating": 4.94,
    "reviews": 1450,
    "story": "A highly addictive feminine fragrance. The rich, energizing scent of black coffee combined with sweet vanilla and white florals. Bold, mysterious, and unforgettable."
  },
  {
    "id": "blue-lady",
    "name": "Blue Lady",
    "inspiredBy": "Blue Lady by Huda Essence",
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
    "mood": "garden • rich • white floral",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/blue-lady.png",
    "nouveau": true,
    "rating": 4.87,
    "reviews": 678,
    "story": "A rich white floral garden in a bottle. Blue Lady delivers that lush, creamy tuberose and jasmine experience — like walking through an enchanted flower garden at dusk."
  },
  {
    "id": "miss-dior",
    "name": "Miss Dior",
    "inspiredBy": "Miss Dior by Christian Dior",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral Chypre",
    "top": [
      "Blood Orange",
      "Mandarin",
      "Rose"
    ],
    "heart": [
      "Peony",
      "Lily of the Valley",
      "Iris"
    ],
    "base": [
      "Patchouli",
      "Musk",
      "Rosewood"
    ],
    "mood": "feminine • fresh • romantic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/miss-dior.png",
    "nouveau": true,
    "rating": 4.91,
    "reviews": 856,
    "story": "A modern feminine icon. Our Miss Dior impression captures the romantic freshness of peony and rose, balanced with a warm patchouli base — perfect for the woman who is effortlessly chic."
  },
  {
    "id": "arabian-gourmand",
    "name": "Arabian Gourmand",
    "inspiredBy": "Arabian Gourmand by Huda Essence",
    "gender": "Men",
    "concentration": "Extrait de Parfum",
    "family": "Oriental Gourmand",
    "top": [
      "Saffron",
      "Cinnamon",
      "Cardamom"
    ],
    "heart": [
      "Oud",
      "Rose",
      "Jasmine"
    ],
    "base": [
      "Amber",
      "Vanilla",
      "Sandalwood",
      "Musk"
    ],
    "mood": "rich • warm • opulent",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/arabian-gourmand.png",
    "nouveau": true,
    "rating": 4.84,
    "reviews": 490,
    "story": "A luxurious ode to Arabian perfumery. Rich saffron and oud meet warm vanilla and amber in this opulent gourmand masterpiece. Perfect for those who appreciate depth and tradition."
  },
  {
    "id": "one-man-show",
    "name": "One Man Show",
    "inspiredBy": "One Man Show by Jacques Bogart",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Fougère",
    "top": [
      "Bergamot",
      "Lemon",
      "Basil",
      "Artemisia"
    ],
    "heart": [
      "Cedar",
      "Carnation",
      "Cinnamon",
      "Jasmine"
    ],
    "base": [
      "Musk",
      "Amber",
      "Oakmoss",
      "Patchouli",
      "Vanilla"
    ],
    "mood": "classic • refined • timeless",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/one-man-show.png",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 730,
    "story": "A classic gentleman's fragrance that never goes out of style. Fresh herbs and warm spices settle into a rich, mossy base — the signature scent of a true showman."
  },
  {
    "id": "red-rose",
    "name": "Red Rose",
    "inspiredBy": "Red Rose by Huda Essence",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral Oriental",
    "top": [
      "Rose",
      "Saffron",
      "Raspberry"
    ],
    "heart": [
      "Turkish Rose",
      "Oud",
      "Jasmine"
    ],
    "base": [
      "Amber",
      "Musk",
      "Sandalwood",
      "Vanilla"
    ],
    "mood": "romantic • passionate • luxurious",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/red-rose.png",
    "nouveau": true,
    "rating": 4.92,
    "reviews": 385,
    "story": "A passionate symphony of the finest Turkish roses blended with precious oud and warm saffron. Red Rose is for the woman who commands attention — bold, feminine, and unforgettable."
  },
  {
    "id": "noir",
    "name": "Noir",
    "inspiredBy": "Noir by Huda Essence",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Woody Aromatic",
    "top": [
      "Bergamot",
      "Black Pepper",
      "Cardamom"
    ],
    "heart": [
      "Iris",
      "Violet Leaf",
      "Cedar"
    ],
    "base": [
      "Leather",
      "Vetiver",
      "Benzoin",
      "Tonka Bean"
    ],
    "mood": "dark • mysterious • powerful",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/noir.png",
    "bestseller": true,
    "rating": 4.88,
    "reviews": 612,
    "story": "The essence of midnight elegance. Noir wraps you in a seductive cloak of smoky leather, deep vetiver, and dark spices. A bold signature for the man who owns every room he walks into."
  },
  {
    "id": "emerald",
    "name": "Emerald",
    "inspiredBy": "Emerald by Huda Essence",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Fresh Woody",
    "top": [
      "Green Apple",
      "Bergamot",
      "Mint"
    ],
    "heart": [
      "Vetiver",
      "Geranium",
      "Green Tea"
    ],
    "base": [
      "Cedar",
      "Musk",
      "Oakmoss",
      "Amber"
    ],
    "mood": "fresh • earthy • sophisticated",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/emerald.png",
    "nouveau": true,
    "rating": 4.85,
    "reviews": 290,
    "story": "A breath of fresh air inspired by lush green forests. Emerald combines crisp green apple and mint with deep woody vetiver and cedar — perfect for the modern gentleman who values nature and refinement."
  },
  {
    "id": "gold-oud",
    "name": "Gold Oud",
    "inspiredBy": "Gold Oud by Huda Essence",
    "gender": "Unisex",
    "concentration": "Extrait de Parfum",
    "family": "Oriental Woody",
    "top": [
      "Saffron",
      "Rose",
      "Bergamot"
    ],
    "heart": [
      "Oud",
      "Amber",
      "Jasmine"
    ],
    "base": [
      "Sandalwood",
      "Vanilla",
      "Musk",
      "Patchouli"
    ],
    "mood": "opulent • royal • timeless",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/gold-oud.png",
    "bestseller": true,
    "rating": 4.95,
    "reviews": 478,
    "story": "Liquid gold in a bottle. Gold Oud is a majestic blend of precious oud, saffron, and royal amber — crafted for those who appreciate the finer things. A timeless unisex masterpiece for grand occasions."
  },
  {
    "id": "purple-musk",
    "name": "Purple Musk",
    "inspiredBy": "Purple Musk by Huda Essence",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral Musk",
    "top": [
      "Plum",
      "Blackcurrant",
      "Pink Pepper"
    ],
    "heart": [
      "Lavender",
      "Iris",
      "Violet",
      "Peony"
    ],
    "base": [
      "White Musk",
      "Cashmere Wood",
      "Vanilla",
      "Ambrette"
    ],
    "mood": "dreamy • enchanting • feminine",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/purple-musk.png",
    "nouveau": true,
    "rating": 4.89,
    "reviews": 345,
    "story": "A dreamy, enchanting fragrance that feels like a walk through a moonlit lavender garden. Purple Musk layers rich plum and violet with soft cashmere musk — irresistibly feminine and hauntingly beautiful."
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
    "mood": "warm • sweet • irresistible",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/stronger-with-you.png",
    "bestseller": true,
    "rating": 4.91,
    "reviews": 920,
    "story": "A warm, addictive embrace in a bottle. Sweet chestnut and vanilla merge with spicy cardamom for a scent that draws people closer. The ultimate date night fragrance for the modern romantic."
  },
  {
    "id": "black-afghano",
    "name": "Black Afghano",
    "inspiredBy": "Black Afghano by Nasomatto",
    "gender": "Unisex",
    "concentration": "Extrait de Parfum",
    "family": "Woody Oriental",
    "top": [
      "Cannabis",
      "Oud",
      "Tobacco"
    ],
    "heart": [
      "Incense",
      "Hashish",
      "Resins"
    ],
    "base": [
      "Oud",
      "Dark Woods",
      "Musk",
      "Amber"
    ],
    "mood": "dark • intense • hypnotic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/black-afghano.png",
    "nouveau": true,
    "rating": 4.87,
    "reviews": 310,
    "story": "Enter the dark side of perfumery. Black Afghano is a deep, hypnotic elixir of smoky oud, dark resins, and mysterious incense. Not for the faint-hearted — this is pure olfactory art."
  },
  {
    "id": "poison",
    "name": "Poison",
    "inspiredBy": "Poison by Christian Dior",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Amber Spicy",
    "top": [
      "Plum",
      "Coriander",
      "Wildberry"
    ],
    "heart": [
      "Tuberose",
      "Carnation",
      "Opopanax",
      "Cinnamon"
    ],
    "base": [
      "Amber",
      "Sandalwood",
      "Musk",
      "Oud"
    ],
    "mood": "seductive • dangerous • intoxicating",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/poison.png",
    "nouveau": true,
    "rating": 4.86,
    "reviews": 560,
    "story": "Dangerously addictive. Poison is a bold, intoxicating blend of dark plum, heady tuberose, and warm amber that lingers in every room you leave. A legendary fragrance for the fearless woman."
  },
  {
    "id": "hawas",
    "name": "Hawas",
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
    "mood": "fresh • aquatic • powerful",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/hawas.png",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 870,
    "story": "A fresh aquatic powerhouse from the Arabian perfumery world. Hawas combines crisp marine notes with warm amber and ambroxan for a beast-mode projection that lasts all day in Pakistan's heat."
  },
  {
    "id": "ysl-homme",
    "name": "YSL Homme",
    "inspiredBy": "La Nuit de L'Homme by YSL",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Amber Fougère",
    "top": [
      "Cardamom",
      "Bergamot",
      "Cedar"
    ],
    "heart": [
      "Lavender",
      "Cumin",
      "Violet"
    ],
    "base": [
      "Vetiver",
      "Caraway",
      "Cedarwood"
    ],
    "mood": "suave • seductive • sophisticated",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/ysl-homme.png",
    "nouveau": true,
    "rating": 4.88,
    "reviews": 645,
    "story": "The art of French seduction. YSL Homme is a sophisticated, magnetic blend of fresh cardamom and lavender over warm cedarwood — designed for the man who captivates without effort."
  },
  {
    "id": "good-girl",
    "name": "Good Girl",
    "inspiredBy": "Good Girl by Carolina Herrera",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Amber Floral",
    "top": [
      "Almond",
      "Coffee",
      "Bergamot"
    ],
    "heart": [
      "Tuberose",
      "Jasmine Sambac",
      "Bulgarian Rose"
    ],
    "base": [
      "Tonka Bean",
      "Cocoa",
      "Vanilla",
      "Sandalwood",
      "Cedar"
    ],
    "mood": "bold • glamorous • dual-natured",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/good-girl.png",
    "bestseller": true,
    "rating": 4.94,
    "reviews": 1120,
    "story": "Every woman has a good and a bad side. This iconic fragrance captures both — sweet jasmine and cocoa meet bold coffee and tonka bean. A glamorous, confident scent for the woman who breaks the rules."
  },
  {
    "id": "komei-j",
    "name": "Komei J.",
    "inspiredBy": "Komei J. Signature",
    "gender": "Unisex",
    "concentration": "Eau de Parfum",
    "family": "Woody Floral",
    "top": [
      "Citrus",
      "Spices"
    ],
    "heart": [
      "Floral Notes",
      "Woody Notes"
    ],
    "base": [
      "Musk",
      "Amber"
    ],
    "mood": "elegant • sophisticated • modern",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/komei-j.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 120,
    "story": "A sophisticated blend that leaves a lasting impression."
  },
  {
    "id": "chanel-05",
    "name": "Chanel 05",
    "inspiredBy": "Chanel N°5",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral Aldehyde",
    "top": [
      "Aldehydes",
      "Ylang-Ylang",
      "Neroli"
    ],
    "heart": [
      "Jasmine",
      "Rose",
      "Iris"
    ],
    "base": [
      "Sandalwood",
      "Vanilla",
      "Vetiver"
    ],
    "mood": "classic • elegant • timeless",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/chanel-05.jpeg",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 1800,
    "story": "The ultimate timeless classic. A beautifully complex and elegant floral bouquet."
  },
  {
    "id": "gucci-bloom",
    "name": "Gucci Bloom",
    "inspiredBy": "Gucci Bloom",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "White Floral",
    "top": [
      "Rangoon Creeper"
    ],
    "heart": [
      "Tuberose",
      "Jasmine"
    ],
    "base": [
      "Honeysuckle"
    ],
    "mood": "floral • rich • enchanting",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/gucci-bloom.jpeg",
    "bestseller": false,
    "rating": 4.85,
    "reviews": 650,
    "story": "A rich white floral scent that transports you to a beautiful garden."
  },
  {
    "id": "lacoste-white",
    "name": "Lacoste White",
    "inspiredBy": "Eau de Lacoste L.12.12 Blanc",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Woody Floral",
    "top": [
      "Grapefruit",
      "Rosemary",
      "Cardamom"
    ],
    "heart": [
      "Ylang-Ylang",
      "Tuberose"
    ],
    "base": [
      "Cedar",
      "Leather",
      "Vetiver"
    ],
    "mood": "fresh • sporty • clean",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/lacoste-white.jpeg",
    "bestseller": false,
    "rating": 4.7,
    "reviews": 430,
    "story": "A fresh, crisp scent capturing the spirit of the iconic white polo shirt."
  },
  {
    "id": "armani-mania",
    "name": "Armani Mania",
    "inspiredBy": "Armani Mania",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Woody Spicy",
    "top": [
      "Mandarin",
      "Saffron"
    ],
    "heart": [
      "Cedar",
      "Vetiver"
    ],
    "base": [
      "Amber",
      "Musk"
    ],
    "mood": "charismatic • warm • elegant",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/armani-mania.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 500,
    "story": "A charismatic and elegant fragrance with warm, spicy woody notes."
  },
  {
    "id": "ladies-spl",
    "name": "Ladies SPL",
    "inspiredBy": "Auralis Ladies Special",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Fruity Floral",
    "top": [
      "Red Berries",
      "Citrus"
    ],
    "heart": [
      "Rose",
      "Peony"
    ],
    "base": [
      "Musk",
      "Vanilla"
    ],
    "mood": "sweet • vibrant • joyful",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/ladies-spl.jpeg",
    "bestseller": false,
    "rating": 4.6,
    "reviews": 210,
    "story": "A sweet and joyful scent made specially for vibrant women."
  },
  {
    "id": "romance",
    "name": "Romance",
    "inspiredBy": "Romance For Her",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral",
    "top": [
      "Rose",
      "Chamomile"
    ],
    "heart": [
      "Lily",
      "Lotus"
    ],
    "base": [
      "Patchouli",
      "Oakmoss"
    ],
    "mood": "romantic • soft • charming",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/romance.jpeg",
    "bestseller": false,
    "rating": 4.75,
    "reviews": 320,
    "story": "A timeless romantic fragrance celebrating the essence of love."
  },
  {
    "id": "khamrah-latafa",
    "name": "Khamrah",
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
    "mood": "sweet • boozy • warm",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/khamrah-latafa.jpeg",
    "bestseller": true,
    "rating": 4.88,
    "reviews": 800,
    "story": "A sweet, warm, and inviting fragrance perfect for cozy evenings."
  },
  {
    "id": "armani-code",
    "name": "Armani Code",
    "inspiredBy": "Armani Code",
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
    "mood": "mysterious • seductive • sophisticated",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/armani-code-whatsapp.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 950,
    "story": "A mysterious, sophisticated, and utterly seductive fragrance."
  },
  {
    "id": "imperial-valley",
    "name": "Imperial Valley",
    "inspiredBy": "Imperial Valley",
    "gender": "Unisex",
    "concentration": "Eau de Parfum",
    "family": "Woody Aromatic",
    "top": [
      "Bergamot",
      "Green Notes"
    ],
    "heart": [
      "Woody Notes",
      "Patchouli"
    ],
    "base": [
      "Amber",
      "Musk"
    ],
    "mood": "fresh • green • majestic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/imperial-valley.jpeg",
    "bestseller": false,
    "rating": 4.7,
    "reviews": 140,
    "story": "A majestic green and woody fragrance reminiscent of lush valleys."
  },
  {
    "id": "gucci-rush",
    "name": "Gucci Rush",
    "inspiredBy": "Gucci Rush",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Chypre Fruity",
    "top": [
      "Peach",
      "California Gardenia"
    ],
    "heart": [
      "Coriander",
      "Damask Rose",
      "Jasmine"
    ],
    "base": [
      "Patchouli",
      "Vanilla",
      "Vetiver"
    ],
    "mood": "bold • modern • intoxicating",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/gucci-rush.jpeg",
    "bestseller": false,
    "rating": 4.85,
    "reviews": 530,
    "story": "An intoxicating and bold modern fragrance that leaves an unforgettable trail."
  },
  {
    "id": "prada-paradoxe",
    "name": "Prada Paradoxe",
    "inspiredBy": "Prada Paradoxe",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Amber Floral",
    "top": [
      "Pear",
      "Tangerine",
      "Bergamot"
    ],
    "heart": [
      "Orange Blossom",
      "Neroli",
      "Jasmine"
    ],
    "base": [
      "Vanilla",
      "Amber",
      "White Musk"
    ],
    "mood": "sweet • floral • contemporary",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/prada-paradoxe.jpeg",
    "bestseller": false,
    "rating": 4.82,
    "reviews": 620,
    "story": "A contemporary floral amber fragrance expressing the essence of modern femininity."
  },
  {
    "id": "fogg-black",
    "name": "Fogg Black",
    "inspiredBy": "Fogg Black",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic",
    "top": [
      "Citrus",
      "Spicy Notes"
    ],
    "heart": [
      "Herbal Notes",
      "Floral Notes"
    ],
    "base": [
      "Woody Notes",
      "Musk"
    ],
    "mood": "bold • dark • intense",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/fogg-black.jpeg",
    "bestseller": false,
    "rating": 4.5,
    "reviews": 300,
    "story": "A bold, intense fragrance that lasts all day long."
  },
  {
    "id": "eternity-men",
    "name": "Eternity Men",
    "inspiredBy": "Calvin Klein Eternity for Men",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Fougère",
    "top": [
      "Lavender",
      "Lemon",
      "Bergamot",
      "Mandarin"
    ],
    "heart": [
      "Sage",
      "Juniper Berries",
      "Basil",
      "Geranium"
    ],
    "base": [
      "Sandalwood",
      "Vetiver",
      "Musk",
      "Amber"
    ],
    "mood": "fresh • classic • reliable",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/eternity-men.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 700,
    "story": "A classic aromatic fougère that stands the test of time. Fresh, crisp, and reliable."
  },
  {
    "id": "oud-and-rose",
    "name": "Oud & Rose",
    "inspiredBy": "Oud Ispahan",
    "gender": "Unisex",
    "concentration": "Eau de Parfum",
    "family": "Amber Floral",
    "top": [
      "Labdanum"
    ],
    "heart": [
      "Rose",
      "Patchouli",
      "Saffron"
    ],
    "base": [
      "Agarwood (Oud)",
      "Sandalwood",
      "Cedar"
    ],
    "mood": "rich • smoky • luxurious",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/oud-and-rose.jpeg",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 1100,
    "story": "A luxurious combination of rich smoky oud and velvety rose."
  },
  {
    "id": "bombshell",
    "name": "Bombshell",
    "inspiredBy": "Victoria Secret Bombshell",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral Fruity",
    "top": [
      "Passionfruit",
      "Grapefruit",
      "Pineapple"
    ],
    "heart": [
      "Peony",
      "Vanilla Orchid",
      "Red Berries"
    ],
    "base": [
      "Musk",
      "Woody Notes",
      "Oakmoss"
    ],
    "mood": "glamorous • confident • sexy",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/bombshell.jpeg",
    "bestseller": true,
    "rating": 4.8,
    "reviews": 340,
    "story": "A glamorous and confident floral fruity scent."
  },
  {
    "id": "zarar-silver",
    "name": "Zarar Silver",
    "inspiredBy": "Zarar Silver",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Aquatic",
    "top": [
      "Citrus",
      "Aquatic Notes"
    ],
    "heart": [
      "Spicy Notes",
      "Herbal Notes"
    ],
    "base": [
      "Woody Notes",
      "Musk"
    ],
    "mood": "fresh • energetic • masculine",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/zarar-silver.jpeg",
    "bestseller": false,
    "rating": 4.6,
    "reviews": 210,
    "story": "A fresh and energetic scent for the active man."
  },
  {
    "id": "sabaya",
    "name": "Sabaya",
    "inspiredBy": "Al-Rehab Sabaya",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral",
    "top": [
      "Citrus",
      "Rose"
    ],
    "heart": [
      "Green Notes",
      "Floral Notes"
    ],
    "base": [
      "Musk",
      "Agarwood"
    ],
    "mood": "sweet • floral • delightful",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/sabaya.jpeg",
    "bestseller": false,
    "rating": 4.7,
    "reviews": 450,
    "story": "A delightful and sweet floral fragrance."
  },
  {
    "id": "dior-sauvage-new",
    "name": "Dior Sauvage",
    "inspiredBy": "Dior Sauvage",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Fougere",
    "top": [
      "Calabrian Bergamot",
      "Pepper"
    ],
    "heart": [
      "Sichuan Pepper",
      "Lavender",
      "Pink Pepper",
      "Vetiver",
      "Patchouli",
      "Geranium",
      "Elemi"
    ],
    "base": [
      "Ambroxan",
      "Cedar",
      "Labdanum"
    ],
    "mood": "fresh • spicy • noble",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/dior-sauvage-new.jpeg",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 1200,
    "story": "A radically fresh composition, raw and noble all at once."
  },
  {
    "id": "bacarat-rouge-540",
    "name": "Baccarat Rouge 540",
    "inspiredBy": "Baccarat Rouge 540",
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
    "mood": "radiant • complex • luxurious",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/bacarat-rouge-540.jpeg",
    "bestseller": true,
    "rating": 4.95,
    "reviews": 980,
    "story": "A luminous and sophisticated fragrance that lays on the skin like an amber floral and woody breeze."
  },
  {
    "id": "mika",
    "name": "Mika",
    "inspiredBy": "Mika",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral",
    "top": [
      "Citrus"
    ],
    "heart": [
      "Floral Notes"
    ],
    "base": [
      "Musk"
    ],
    "mood": "soft • feminine • delicate",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/mika.jpeg",
    "bestseller": false,
    "rating": 4.5,
    "reviews": 150,
    "story": "A delicate and soft feminine fragrance."
  },
  {
    "id": "wasim-akram-502",
    "name": "Wasim Akram 502",
    "inspiredBy": "Wasim Akram 502",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Woody",
    "top": [
      "Citrus",
      "Spices"
    ],
    "heart": [
      "Woody Notes"
    ],
    "base": [
      "Musk",
      "Amber"
    ],
    "mood": "sporty • classic • strong",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/wasim-akram-502.jpeg",
    "bestseller": false,
    "rating": 4.7,
    "reviews": 310,
    "story": "A classic and sporty fragrance inspired by the legend."
  },
  {
    "id": "gucci-flora",
    "name": "Gucci Flora",
    "inspiredBy": "Gucci Flora",
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
      "Rose"
    ],
    "base": [
      "Sandalwood",
      "Patchouli",
      "Pink Pepper"
    ],
    "mood": "elegant • sensual • floral",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/gucci-flora-azzaro-wanted.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 420,
    "story": "An elegant and sensual floral bouquet."
  },
  {
    "id": "azzaro-wanted",
    "name": "Azzaro Wanted",
    "inspiredBy": "Azzaro Wanted",
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
    "mood": "bold • magnetic • irresistible",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/gucci-flora-azzaro-wanted.jpeg",
    "bestseller": false,
    "rating": 4.75,
    "reviews": 380,
    "story": "A bold, magnetic, and irresistible fragrance for the confident man."
  },
  {
    "id": "burberry-hero",
    "name": "Burberry Hero",
    "inspiredBy": "Burberry Hero",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Woody Spicy",
    "top": [
      "Bergamot"
    ],
    "heart": [
      "Juniper",
      "Black Pepper"
    ],
    "base": [
      "Atlas Cedar",
      "Virginian Cedar",
      "Himalayan Cedar"
    ],
    "mood": "modern • strong • earthy",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/burberry-hero-silver-creed.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 500,
    "story": "A modern and earthy scent celebrating strength and subtlety."
  },
  {
    "id": "silver-creed",
    "name": "Silver Creed",
    "inspiredBy": "Silver Mountain Water Creed",
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
    "mood": "crisp • fresh • mountain-air",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/burberry-hero-silver-creed.jpeg",
    "bestseller": false,
    "rating": 4.85,
    "reviews": 620,
    "story": "A crisp and fresh scent inspired by the exhilaration of mountain air."
  },
  {
    "id": "oud-and-rose-new",
    "name": "Oud & Rose (Special)",
    "inspiredBy": "Oud Ispahan",
    "gender": "Unisex",
    "concentration": "Eau de Parfum",
    "family": "Amber Floral",
    "top": [
      "Labdanum"
    ],
    "heart": [
      "Rose",
      "Patchouli",
      "Saffron"
    ],
    "base": [
      "Agarwood (Oud)",
      "Sandalwood",
      "Cedar"
    ],
    "mood": "rich • smoky • luxurious",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/oud-and-rose-new.jpeg",
    "bestseller": false,
    "rating": 4.9,
    "reviews": 400,
    "story": "A special luxurious edition of rich smoky oud and velvety rose."
  },
  {
    "id": "issey-miyake",
    "name": "Issey Miyake Men",
    "inspiredBy": "L'Eau d'Issey Pour Homme",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Woody Aquatic",
    "top": [
      "Yuzu",
      "Lemon",
      "Bergamot",
      "Lemon Verbena",
      "Mandarin Orange",
      "Cypress",
      "Calone",
      "Coriander",
      "Tarragon",
      "Sage"
    ],
    "heart": [
      "Blue Lotus",
      "Nutmeg",
      "Lily-of-the-Valley",
      "Saffron",
      "Ceylon Cinnamon",
      "Bourbon Geranium",
      "Mignonette"
    ],
    "base": [
      "Tahitian Vetiver",
      "Musk",
      "Cedar",
      "Sandalwood",
      "Tobacco",
      "Amber"
    ],
    "mood": "fresh • timeless • aquatic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/issey-miyake.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 750,
    "story": "A timeless aquatic fragrance that is fresh, vibrant and elegant."
  },
  {
    "id": "ameer-ul-oud",
    "name": "Ameer ul Oud",
    "inspiredBy": "Ameer Al Oudh",
    "gender": "Unisex",
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
    "mood": "warm • sweet • oriental",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/ameer-ul-oud.jpeg",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 1100,
    "story": "A warm and sweet oriental fragrance featuring deep oud notes."
  },
  {
    "id": "cigar",
    "name": "Cigar",
    "inspiredBy": "Remy Latour Cigar",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Aromatic Fruity",
    "top": [
      "Plum",
      "Pineapple",
      "Pear",
      "Amalfi Lemon",
      "Bergamot"
    ],
    "heart": [
      "Bay Leaf",
      "Marigold",
      "Geranium",
      "Jasmine"
    ],
    "base": [
      "Tobacco",
      "Patchouli",
      "Sandalwood",
      "Virginia Cedar",
      "Musk"
    ],
    "mood": "masculine • rich • classic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/cigar.jpeg",
    "bestseller": false,
    "rating": 4.7,
    "reviews": 520,
    "story": "A classic and rich masculine fragrance with distinctive tobacco notes."
  },
  {
    "id": "jasmine-des-anges",
    "name": "Jasmine Des Anges",
    "inspiredBy": "Jasmin Des Anges Dior",
    "gender": "Women",
    "concentration": "Eau de Parfum",
    "family": "Floral",
    "top": [
      "Bergamot"
    ],
    "heart": [
      "Jasmine",
      "Apricot",
      "Osmanthus",
      "Peach"
    ],
    "base": [
      "White Musk",
      "Vanilla"
    ],
    "mood": "sweet • floral • divine",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/jasmine-des-anges.jpeg",
    "bestseller": false,
    "rating": 4.85,
    "reviews": 360,
    "story": "A divine floral fragrance bursting with late-summer jasmine."
  },
  {
    "id": "gucci-guilty",
    "name": "Gucci Guilty",
    "inspiredBy": "Gucci Guilty Pour Homme",
    "gender": "Men",
    "concentration": "Eau de Parfum",
    "family": "Woody Aromatic",
    "top": [
      "Lavender",
      "Lemon"
    ],
    "heart": [
      "Orange Blossom"
    ],
    "base": [
      "Cedar",
      "Patchouli",
      "Vanilla"
    ],
    "mood": "provocative • seductive • modern",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/gucci-guilty.jpeg",
    "bestseller": false,
    "rating": 4.8,
    "reviews": 810,
    "story": "A provocative and seductive modern fragrance."
  },
  {
    "id": "invictus",
    "name": "Invictus",
    "inspiredBy": "Paco Rabanne Invictus",
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
    "mood": "fresh • victorious • dynamic",
    "sizes": [
      {
        "ml": 10,
        "price": 300
      },
      {
        "ml": 50,
        "price": 1300
      },
      {
        "ml": 100,
        "price": 2500
      }
    ],
    "image": "/images/invictus.jpeg",
    "bestseller": true,
    "rating": 4.9,
    "reviews": 1400,
    "story": "A fresh and dynamic fragrance that embodies victory."
  }
];

/* ── cart line ─────────────────────────────────────── */
type CartLine = { productId: string; sizeMl: number; qty: number };

/* ── star component ──────────────────────────────── */
const Stars = ({ rating }: { rating: number }) => (
  <span className="text-[#d4a04a]">
    {"★".repeat(Math.floor(rating))}
    {rating % 1 >= 0.5 && "½"}
  </span>
);

/* ── Seamless Video Component ───────────────────── */
const SeamlessHeroVideo = () => {
  return (
    <>
      <video src="/hero-mobile-video.mp4" autoPlay muted loop playsInline className="md:hidden absolute inset-0 w-full h-full object-cover" />
      <video src="/huda-essence-hero-video.mp4" autoPlay muted loop playsInline className="hidden md:block absolute inset-0 w-full h-full object-cover" />
    </>
  );
};

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
  const [payMethod, setPayMethod] = useState<"easypaisa" | "jazzcash" | "bank">("easypaisa");
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
  const canConfirmOrder = canProceedStep1 && payScreenshot !== null;

  const paymentAccounts = {
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
    <div className="min-h-screen bg-[#faf7f2] text-[#1b1714]">



      {/* ═══════════ HEADER ═══════════ */}
      <header className="sticky top-0 z-40 bg-[#faf7f2ee] backdrop-blur-xl border-b border-[#e7dcc9]">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 h-[78px] flex items-center justify-between gap-6">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-9 h-9 grid place-items-center">
            <div className="w-5">
              <div className={`h-[1.8px] bg-[#221e19] transition-all ${mobileMenu ? "rotate-45 translate-y-[5.4px]" : "mb-1.5"}`}></div>
              <div className={`h-[1.8px] bg-[#221e19] transition-opacity ${mobileMenu ? "opacity-0" : "mb-1.5"}`}></div>
              <div className={`h-[1.8px] bg-[#221e19] transition-all ${mobileMenu ? "-rotate-45 -translate-y-[5.4px]" : ""}`}></div>
            </div>
          </button>

          <div className="flex items-center gap-12">
            <a href="#">
              <Logo />
            </a>
            <nav className="hidden lg:flex items-center gap-[28px] text-[13.6px] tracking-[0.04em] text-[#38312a]">
              <a href="#shop" className="hover:text-[#b07a28] transition font-[500]">Shop All</a>
              <button onClick={() => { setGender("Men"); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#b07a28] transition">For Him</button>
              <button onClick={() => { setGender("Women"); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#b07a28] transition">For Her</button>
              <button onClick={() => { setGender("Unisex"); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#b07a28] transition">Unisex</button>
              <a href="#about" className="hover:text-[#b07a28] transition">About Us</a>
              <a href="#contact" className="hover:text-[#b07a28] transition">Contact</a>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center border border-[#d9c9b2] rounded-full pl-4 pr-2 py-[9px] bg-white/60 min-w-[220px]">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search perfumes…"
                className="bg-transparent outline-none text-[13.5px] w-full placeholder-[#a08e77]"
              />
              <svg className="text-[#a78a63] mr-1 shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </div>

            <button onClick={() => { }} aria-label="wishlist" className="relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.6 1.6-1.6 4.1 0 5.7l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.1 0-5.7Z" /></svg>
              {wishlist.length > 0 && <span className="absolute -top-2 -right-2 w-[16px] h-[16px] text-[10px] grid place-items-center rounded-full bg-[#7b1d2a] text-white">{wishlist.length}</span>}
            </button>

            <button onClick={() => setCartOpen(true)} aria-label="cart" className="relative">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 min-w-[18px] px-[5px] h-[18px] text-[10px] grid place-items-center rounded-full bg-[#b07a28] text-white font-[600]">{cartCount}</span>}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden bg-[#faf7f2] border-t border-[#e7dcc9] px-5 py-5 space-y-4 text-[15px] text-[#3a3028]">
            <a href="#shop" onClick={() => setMobileMenu(false)} className="block">Shop All Perfumes</a>
            <button onClick={() => { setGender("Men"); setMobileMenu(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block w-full text-left">For Him</button>
            <button onClick={() => { setGender("Women"); setMobileMenu(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block w-full text-left">For Her</button>
            <button onClick={() => { setGender("Unisex"); setMobileMenu(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="block w-full text-left">Unisex</button>
            <a href="#about" onClick={() => setMobileMenu(false)} className="block">About Us</a>
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block">Contact</a>
            <div className="pt-3 border-t border-[#e1d0b8]">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search perfumes…"
                className="w-full border border-[#e0cbaa] rounded-full px-4 py-3 text-[14px] outline-none bg-white"
              />
            </div>
          </div>
        )}
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f5ebd9] to-[#faf7f2] border-b border-[#ebdcb9]">
        {/* Ambient luxury glow blobs */}
        <div className="absolute top-[-150px] left-[-150px] w-[350px] h-[350px] rounded-full bg-[#ebd9c1]/60 blur-[100px] pointer-events-none animate-blob-1"></div>
        <div className="absolute right-[-100px] bottom-[-100px] w-[300px] h-[300px] rounded-full bg-[#ebd3b6]/50 blur-[80px] pointer-events-none animate-blob-2"></div>
        <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-[#7b1d2a]/5 blur-[100px] pointer-events-none animate-blob-3"></div>

        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-10 lg:py-[68px] grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.20em] text-[#a36f24] uppercase font-[500]">
              <span className="w-[38px] h-px bg-[#d2b280]"></span>
              Pakistan Ka Pasandeeda Impression House
            </div>
            <h1 className="text-[46px] sm:text-[58px] lg:text-[74px] leading-[0.92] tracking-[-0.015em] mt-6 bg-gradient-to-r from-[#1a1311] via-[#8c6b3e] to-[#1a1311] bg-clip-text text-transparent animate-[gradient_8s_ease_infinite] bg-[length:200%_auto]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Designer Khushbuein.<br />
              <em className="font-[350] italic text-[#7b1d2a]" style={{ fontFamily: '"Fraunces", serif' }}>Sasti Qeemat Mein.</em><br />
              Sirf Aap Ke Liye.
            </h1>
            <p className="mt-[22px] text-[17px] leading-relaxed text-[#4d4339] max-w-[540px]">
              Huda Essence duniya ki mashhoor tareen designer fragrances se mutassir ho kar premium impression perfumes tayar karta hai.
              Bilkul wahi khushbu — magar aadhi qeemat mein.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="relative overflow-hidden px-[28px] py-[15px] rounded-full bg-[#1b1411] text-[#f8efe0] text-[14px] tracking-[0.07em] uppercase font-[600] hover:bg-[#2a1f18] transition hover:shadow-[0_10px_30px_rgba(27,20,17,0.3)] hover:-translate-y-0.5"
              >
                Shop Collection →
              </button>
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener" className="px-[28px] py-[15px] rounded-full border border-[#d2be9d] text-[14px] tracking-[0.04em] bg-white/70 hover:bg-white transition flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                WhatsApp Order
              </a>
            </div>


          </div>

          <div className="relative">
            <div className="rounded-[28px] overflow-hidden bg-[#ede4d6] shadow-[0_40px_90px_rgba(100,72,40,0.18)] relative h-[480px] lg:h-[580px]">
              {/* Seamless looping dual-video component */}
              <SeamlessHeroVideo />
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-[#19130d55] via-transparent to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BAR ═══════════ */}
      <div className="border-y border-[#e5d8c3] bg-[#f5eee2]">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-5 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "✨", title: "Premium Quality", sub: "Long-lasting fragrances" },
            { icon: "🚚", title: `PKR ${deliveryCharge} Delivery`, sub: "Karachi Only" },
            { icon: "💳", title: "Prepayment Required", sub: "JazzCash / EasyPaisa / Bank" },
          ].map(t => (
            <div key={t.title} className="flex flex-col items-center gap-1">
              <span className="text-[22px]">{t.icon}</span>
              <div className="text-[13px] font-[600] text-[#2e2418]">{t.title}</div>
              <div className="text-[11.5px] text-[#7a6549]">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ SHOP ALL PRODUCTS ═══════════ */}
      <section id="shop" ref={shopRef} className="mx-auto max-w-[1320px] px-5 lg:px-10 py-14 lg:py-[80px]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-[#b07a28] uppercase font-[600]">Our Collection</div>
            <h2 className="text-[42px] lg:text-[56px] leading-[0.95] mt-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Shop Huda Essence
            </h2>
            <p className="text-[15.5px] text-[#5a4a38] mt-2 max-w-[520px]">
              {PRODUCTS.length} premium impression perfumes. All sizes, one simple price in PKR.
            </p>
          </div>
        </div>

        {/* filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 mt-4">
          <div className="flex items-center gap-1 bg-white rounded-full border border-[#e2cfb4] p-1">
            {(["All", "Men", "Women", "Unisex"] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-4 py-[9px] rounded-full text-[13.5px] transition font-[500] ${gender === g ? "bg-[#1b1310] text-[#f7e8cf]" : "text-[#5b4733] hover:bg-[#f6ead6]"}`}
              >{g === "All" ? "All" : g === "Men" ? "For Him" : g === "Women" ? "For Her" : "Unisex"}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12.5px] text-[#7a6247]">Sort</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="border border-[#e0ccab] rounded-full bg-white px-3 py-[9px] text-[13px] outline-none"
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
              {group.title && <h3 className="text-[34px] mb-6 text-[#2a221b] border-b border-[#ebdcb9] pb-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{group.title}</h3>}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {group.items.map(p => (
                  <div key={p.id} className="group bg-white rounded-[26px] border border-[#ead9bf] overflow-hidden hover:shadow-[0_30px_80px_rgba(120,90,40,0.18)] hover:-translate-y-1.5 transition-all duration-500">
                    <div className="relative overflow-hidden">
                      <img src={p.image} alt={p.name} className="h-[400px] w-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {p.bestseller && <span className="bg-[#19120d] text-[#f4e2c2] px-3.5 py-1.5 rounded-full text-[10.5px] tracking-[0.1em] font-[600] uppercase">Bestseller</span>}
                        {p.nouveau && <span className="bg-[#7b1d2a] text-white px-3.5 py-1.5 rounded-full text-[10.5px] tracking-[0.1em] font-[600] uppercase">New</span>}
                      </div>
                      <button
                        onClick={() => toggleWish(p.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 grid place-items-center border border-[#efdcc1] hover:scale-110 transition-transform"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill={wishlist.includes(p.id) ? "#b32d3a" : "none"} stroke={wishlist.includes(p.id) ? "#b32d3a" : "#5b4b3a"} strokeWidth="1.7"><path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.6 1.6-1.6 4.1 0 5.7l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.1 0-5.7Z" /></svg>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-2 justify-center">
                          {p.sizes.map(s => (
                            <button key={s.ml} onClick={() => addToCart(p.id, s.ml)} className="px-3 py-2 rounded-xl bg-white/95 text-[12.5px] font-[600] text-[#2a1c11] hover:bg-[#f5e5c8] transition">
                              {s.ml}ml — {PKR(s.price)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pb-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[26px] leading-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{p.name}</h3>
                          <div className="text-[12.5px] text-[#7a6652] mt-0.5">{p.gender === "Men" ? "For Him" : p.gender === "Women" ? "For Her" : "Unisex"} • {p.family}</div>
                        </div>
                        <div className="text-right text-[12px] text-[#6e5c47] shrink-0">
                          <Stars rating={p.rating} /> {p.rating}<br />
                          <span className="text-[11px] text-[#9a8363]">{p.reviews} reviews</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[12.8px] text-[#6f5d48] italic">{p.mood}</div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {p.sizes.map(s => (
                          <div key={s.ml} className="bg-[#faf5ed] rounded-xl py-2 border border-[#efe0c9]">
                            <div className="text-[10.5px] text-[#a08060] uppercase tracking-wider">{s.ml}ml</div>
                            <div className="text-[14px] font-[700]">{PKR(s.price)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center gap-2.5">
                        <button onClick={() => setModal(p)} className="flex-1 py-[12px] rounded-full bg-[#1b1310] text-[#f6e7cc] text-[13.5px] font-[600] hover:bg-[#2a1f16] transition">View Details</button>
                        <button onClick={() => addToCart(p.id)} className="px-5 py-[12px] rounded-full border border-[#dfc8a2] text-[13.5px] font-[600] text-[#5d4628] hover:bg-[#fff6e7] transition">+ Bag</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#9b8163] text-[16px]">No perfumes match your search. Try a different filter.</div>
        )}
      </section>

      {/* ═══════════ PRICING BANNER ═══════════ */}
      <section className="bg-[#15110e] text-[#f0e3cb]">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-16 lg:py-24">
          <div className="text-center max-w-[800px] mx-auto">
            <div className="text-[11px] tracking-[0.24em] text-[#d2a75a] uppercase font-[600]">Simple & Honest Pricing</div>
            <h3 className="text-[44px] lg:text-[58px] leading-[0.95] mt-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              One price for every fragrance.
            </h3>
            <p className="mt-4 text-[16px] text-[#d8c8b2] max-w-[540px] mx-auto leading-relaxed">
              No hidden charges. No confusing tiers. Every Huda Essence perfume is the same price — pick your size.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-5 max-w-[820px] mx-auto">
            {[
              { ml: 10, price: 300, label: "Travel Size", desc: "Perfect for trying a new scent or keeping in your bag" },
              { ml: 50, price: 1300, label: "Most Popular", desc: "The sweet spot — lasts 2–3 months with daily wear", popular: true },
              { ml: 100, price: 2500, label: "Best Value", desc: "Maximum value — 5+ months of your signature scent" },
            ].map(s => (
              <div key={s.ml} className={`rounded-[24px] p-6 text-center border ${s.popular ? "bg-[#2e2117] border-[#c99a4a] scale-[1.04]" : "bg-[#1e1812] border-[#3a2b21]"}`}>
                {s.popular && <div className="text-[10px] tracking-[0.22em] text-[#e8c06f] uppercase font-[700] mb-3">⭐ Most Popular</div>}
                <div className="text-[18px] text-[#dcc7a8] font-[500]">{s.label}</div>
                <div className="text-[52px] font-[700] text-[#f6e8cc] mt-2 leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  PKR {s.price.toLocaleString()}
                </div>
                <div className="text-[16px] text-[#c5ad88] mt-1">{s.ml} ml</div>
                <div className="text-[13px] text-[#a08a6c] mt-3 leading-relaxed">{s.desc}</div>
                <button
                  onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className={`mt-5 w-full py-[12px] rounded-full text-[13.5px] font-[600] ${s.popular ? "bg-[#e8c06f] text-[#1a1008]" : "bg-[#3a2b21] text-[#e8d3b6] border border-[#4d3828]"}`}
                >
                  Shop {s.ml}ml →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="bg-[#f1e6d4] border-y border-[#dfceb2]">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-16 lg:py-24">
          <div className="text-center max-w-[760px] mx-auto">
            <div className="text-[11px] tracking-[0.22em] text-[#a06e26] uppercase font-[600]">About Huda Essence</div>
            <h3 className="text-[44px] lg:text-[56px] leading-[0.95] mt-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>We don't just copy.<br />We craft impressions.</h3>
            <p className="mt-5 text-[16.5px] leading-relaxed text-[#514233] max-w-[600px] mx-auto">
              Huda Essence is a Pakistani impression perfume brand that believes everyone deserves to smell amazing.
              We study the world's most iconic designer fragrances and recreate their scent profiles using premium oils.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[960px] mx-auto">
            {[
              ["Premium Oils", "High-quality fragrance oils sourced for long-lasting performance."],
              ["Affordable Luxury", "Designer-inspired scents from just PKR 300 for 10ml."],
              ["Made for Pakistan", "Formulated to perform in our hot and humid climate."],
              ["Flat Delivery", `Flat PKR ${deliveryCharge} delivery charge within Karachi only.`],
              ["Prepayment Required", "Payment via JazzCash, EasyPaisa, or Bank Transfer."],
            ].map(([t, s]) => (
              <div key={t} className="bg-white/70 rounded-2xl p-5 border border-[#e4d0b2]">
                <div className="text-[20px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{t}</div>
                <div className="text-[13.5px] text-[#5d4934] mt-1.5 leading-relaxed">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEWS ═══════════ */}
      <section className="mx-auto max-w-[1320px] px-5 lg:px-10 py-16 lg:py-[80px]">
        <div className="text-center mb-12">
          <div className="text-[11px] tracking-[0.22em] text-[#b07a28] uppercase font-[600]">Customer Love</div>
          <h3 className="text-[42px] lg:text-[52px] leading-[0.95] mt-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>What Our Customers Say</h3>
          <p className="text-[15px] text-[#6d5840] mt-2">⭐ 4.9 average rating from 5,000+ happy customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Fatima A.", city: "Karachi", text: "Tea Rose is AMAZING! My friends thought I'm wearing an expensive imported perfume. Can't believe it's only PKR 1,300 for 50ml. Already ordered 3 more fragrances!", scent: "Tea Rose • 50ml", stars: 5 },
            { name: "Ahmed K.", city: "Karachi", text: "Blue is my daily signature now. Lasts the entire day even in Karachi heat. Multiple compliments at office. Huda Essence quality is unreal at this price point.", scent: "Blue for Men • 100ml", stars: 5 },
            { name: "Sara M.", city: "Karachi", text: "Ordered Armani Code for my husband and Miss Dior for myself. Both are incredible! The packaging is beautiful, delivery was fast, and the scents last 8+ hours.", scent: "Armani Code + Miss Dior", stars: 5 },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-[#ead6b8] p-6">
              <div className="text-[#c68f2a] text-[16px]">{"★".repeat(r.stars)}</div>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#3a2c1f]">"{r.text}"</p>
              <div className="mt-5 pt-4 border-t border-[#f0e0c8]">
                <div className="text-[14px] font-[600] text-[#4c3725]">{r.name} — {r.city}</div>
                <div className="text-[12.5px] text-[#85684b]">{r.scent}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section className="bg-[#f5ecdd] border-y border-[#e1ccaa]">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-14 lg:py-20">
          <div className="text-center mb-10">
            <h3 className="text-[40px] lg:text-[48px] leading-[0.95]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Why Choose Huda Essence?</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "💎", title: "Designer Quality", desc: "Premium impression oils that rival originals costing 10x more" },
              { emoji: "🇵🇰", title: "Made in Pakistan", desc: "Proudly crafted for Pakistani customers and our climate" },
              { emoji: "⏰", title: "Long Lasting", desc: "6-10+ hours of beautiful fragrance performance" },
              { emoji: "🎁", title: "Perfect Gift", desc: "Beautiful packaging makes every order gift-ready" },
            ].map(item => (
              <div key={item.title} className="text-center bg-white rounded-2xl p-6 border border-[#e4d0b2]">
                <div className="text-[36px] mb-3">{item.emoji}</div>
                <div className="text-[18px] font-[600]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{item.title}</div>
                <div className="text-[13.5px] text-[#6d5841] mt-2 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="bg-[#18120f] text-[#f6e7cb]">
        <div className="mx-auto max-w-[900px] px-5 lg:px-10 py-16 lg:py-[80px] text-center">
          <div className="text-[11px] tracking-[0.24em] text-[#d8a757] uppercase font-[600]">Ready to smell amazing?</div>
          <h4 className="text-[42px] lg:text-[54px] mt-3 leading-[0.98]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Order your Huda Essence<br />perfume today.</h4>
          <p className="mt-4 text-[#d6c1a3] text-[16px]">Delivery in Karachi only. Prepayment required.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-[15px] rounded-full bg-[#e3b96a] text-[#24160c] font-[700] text-[15px] hover:bg-[#f0cc80] transition">Shop All Perfumes →</button>
            <a href={`https://wa.me/${whatsappNum}?text=Hi! I want to place an order from Huda Essence`} target="_blank" rel="noopener" className="px-8 py-[15px] rounded-full border border-[#4b3728] text-[#f2dbc0] text-[15px] flex items-center gap-2 hover:bg-[#241a12] transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              WhatsApp Order
            </a>
          </div>
          <div className="mt-6 text-[12.5px] text-[#b99c77]">10ml PKR 300 • 50ml PKR 1,300 • 100ml PKR 2,500 — same price for every fragrance</div>
        </div>
      </section>

      {/* ═══════════ CONTACT ═══════════ */}
      <section id="contact" className="mx-auto max-w-[1320px] px-5 lg:px-10 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-[#b07a28] uppercase font-[600]">Get in Touch</div>
            <h3 className="text-[40px] lg:text-[48px] leading-[0.95] mt-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Have a question?<br />We'd love to help.</h3>
            <div className="mt-6 space-y-4 text-[15px] text-[#4b3828]">
              {[
                ["📱", "WhatsApp", `+${whatsappNum.replace(/(\d{2})(\d{3})(\d{7})/, "$1 $2 $3")}`],
                ["📧", "Email", "hello@hudaessence.pk"],
                ["📍", "Location", "Karachi, Pakistan"],
                ["⏰", "Hours", "Mon–Sat 11am–10pm PKT"],
              ].map(([icon, label, val]) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-[20px]">{icon}</span>
                  <div><div className="font-[600]">{label}</div><div className="text-[#7a6548]">{val}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <form onSubmit={e => { e.preventDefault(); setToast("Message sent! We'll reply within 2 hours InshaAllah."); }} className="bg-white rounded-[24px] border border-[#e6d4b8] p-6 lg:p-8 space-y-4">
              <div className="text-[20px] font-[600]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Send us a message</div>
              <input required type="text" placeholder="Your Name" className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-[#fdfaf5]" />
              <input required type="tel" placeholder="Phone / WhatsApp Number" className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-[#fdfaf5]" />
              <input type="email" placeholder="Email (optional)" className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-[#fdfaf5]" />
              <textarea required rows={4} placeholder="Your message…" className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-[#fdfaf5] resize-none" />
              <button className="w-full py-[13px] rounded-full bg-[#1b1310] text-[#f6e7cc] font-[600] text-[14px] hover:bg-[#2a1f16] transition">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#14100d] text-[#d8c5a8]">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-14 grid md:grid-cols-4 gap-10 text-[13.7px]">
          <div>
            <div onClick={() => setAdminClicks(c => c + 1)} className="cursor-default"><Logo size="footer" /></div>
            <p className="mt-4 text-[#9a836a] leading-relaxed">Premium impression perfumes inspired by the world's finest designer fragrances. Made for Pakistan.</p>
          </div>
          <div>
            <div className="font-[650] mb-3 text-[#f0dcc0]">Shop</div>
            <ul className="space-y-2 text-[#a89070]">
              <li><a href="#shop" className="hover:text-[#f0dcc0] transition">All Perfumes</a></li>
              {PRODUCTS.map(p => <li key={p.id}><a href="#shop" className="hover:text-[#f0dcc0] transition">{p.name}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="font-[650] mb-3 text-[#f0dcc0]">Help</div>
            <ul className="space-y-2 text-[#a89070]">
              <li>Shipping Policy</li>
              <li>Track Your Order</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div>
            <div className="font-[650] mb-3 text-[#f0dcc0]">Pricing (PKR)</div>
            <ul className="space-y-2 text-[#a89070]">
              <li>10ml — PKR 300</li>
              <li>50ml — PKR 1,300</li>
              <li>100ml — PKR 2,500</li>
              <li className="pt-1 text-[#c9a86c]">PKR {deliveryCharge} delivery (Karachi Only) • Prepayment only</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2a2018]">
          <div className="mx-auto max-w-[1320px] px-5 lg:px-10 py-5 flex flex-wrap justify-between gap-4 text-[12px] text-[#7a6548]">
            <div>© {new Date().getFullYear()} Huda Essence — All rights reserved. Impression perfumes inspired by designers, not affiliated.</div>
            <div className="flex gap-5"><span>Privacy Policy</span><span>Terms</span></div>
          </div>
        </div>
      </footer>

      {/* ═══════════ MODALS / DRAWER ═══════════ */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative m-auto w-[min(1020px,96vw)] max-h-[92vh] overflow-auto rounded-[28px] bg-[#faf6ef] shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#e1ccab] grid place-items-center text-[#725a3d] z-10 hover:bg-[#f5e5cc] transition text-[18px]">✕</button>
            <div className="grid md:grid-cols-[460px_1fr]">
              <div className="relative bg-[#efe3d1]">
                <img src={modal.image} alt={modal.name} className="w-full h-[450px] md:h-full object-cover" />
                <div className="absolute left-5 top-5 flex gap-2">
                  {modal.bestseller && <span className="bg-[#17120e] text-[#f7e5c6] px-3 py-1.5 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-[600]">Bestseller</span>}
                  {modal.nouveau && <span className="bg-[#7d1927] text-white px-3 py-1.5 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-[600]">New</span>}
                </div>
              </div>
              <div className="p-7 md:p-9">
                <div className="text-[11px] tracking-[0.22em] text-[#b38132] uppercase font-[600]">
                  {modal.gender === "Men" ? "For Him" : modal.gender === "Women" ? "For Her" : "Unisex"} • {modal.family}
                </div>
                <h4 className="text-[38px] leading-[0.95] mt-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{modal.name}</h4>
                <div className="text-[14px] text-[#6a5037] mt-1">{modal.concentration}</div>
                <div className="mt-1 text-[13px] text-[#9a7f5f]"><Stars rating={modal.rating} /> {modal.rating} • {modal.reviews} reviews</div>
                <p className="mt-4 text-[15px] leading-relaxed text-[#4b3828]">{modal.story}</p>
                {/* notes */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-[13px]">
                  <div>
                    <div className="text-[10.5px] tracking-[0.16em] text-[#a38153] uppercase font-[600] mb-2">Top</div>
                    {modal.top.map(n => <div key={n} className="text-[#4b3728] mb-1">• {n}</div>)}
                  </div>
                  <div>
                    <div className="text-[10.5px] tracking-[0.16em] text-[#a38153] uppercase font-[600] mb-2">Heart</div>
                    {modal.heart.map(n => <div key={n} className="text-[#4b3728] mb-1">• {n}</div>)}
                  </div>
                  <div>
                    <div className="text-[10.5px] tracking-[0.16em] text-[#a38153] uppercase font-[600] mb-2">Base</div>
                    {modal.base.map(n => <div key={n} className="text-[#4b3728] mb-1">• {n}</div>)}
                  </div>
                </div>
                <div className="mt-5 text-[13.6px] text-[#5a452f] italic">{modal.mood}</div>
                {/* size picker */}
                <div className="mt-6">
                  <div className="text-[11px] tracking-[0.18em] text-[#9b7141] uppercase font-[600] mb-3">Select Your Size</div>
                  <div className="flex flex-wrap gap-3">
                    {modal.sizes.map(s => (
                      <button key={s.ml} onClick={() => setSizePick(s.ml)} className={`rounded-2xl px-5 py-4 border text-left min-w-[130px] transition ${sizePick === s.ml ? "border-[#c99a4a] bg-[#fff4df] shadow-inner" : "border-[#e2ccaa] bg-white hover:bg-[#fffaf0]"}`}>
                        <div className="text-[15px] font-[700]">{s.ml} ml</div>
                        <div className="text-[14px] text-[#6a5338] font-[600]">{PKR(s.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <button onClick={() => { addToCart(modal.id, sizePick); setModal(null); }} className="px-7 py-[14px] rounded-full bg-[#201711] text-[#f8e8c8] text-[14.5px] font-[600] hover:bg-[#2e221a] transition">
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
                <div className="mt-6 text-[12.6px] text-[#7c6348] border-t border-[#e5d0b2] pt-4 grid grid-cols-2 gap-3">
                  <div>✓ PKR {deliveryCharge} delivery (Karachi Only)</div>
                  <div>✓ Prepayment Required</div>
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
        <aside className={`absolute right-0 top-0 h-full w-[430px] max-w-[96vw] bg-[#fcf8f1] shadow-2xl border-l border-[#e6d2b3] transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-16 px-6 border-b border-[#e6d2b3] flex items-center justify-between">
            <div className="text-[22px]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Your Bag ({cartCount})</div>
            <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full hover:bg-[#f0e0c6] grid place-items-center text-[#7a6147] transition text-[16px]">✕</button>
          </div>
          <div className="px-6 py-4 overflow-auto h-[calc(100%-270px)] space-y-4">
            {cart.length === 0 && (
              <div className="text-center py-16">
                <div className="text-[40px] mb-3">🧴</div>
                <div className="text-[#9a8062] text-[15px]">Your bag is empty.</div>
                <button onClick={() => { setCartOpen(false); shopRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-4 px-5 py-2.5 rounded-full bg-[#1b1310] text-[#f6e7cc] text-[13.5px]">Shop Perfumes</button>
              </div>
            )}
            {cart.map((line, idx) => {
              const p = PRODUCTS.find(pp => pp.id === line.productId);
              if (!p) return null;
              const sz = p.sizes.find(s => s.ml === line.sizeMl) ?? p.sizes[0];
              return (
                <div key={`${line.productId}-${line.sizeMl}-${idx}`} className="flex gap-4 bg-white border border-[#edd8b8] rounded-2xl p-3">
                  <img src={p.image} alt="" className="w-[76px] h-[76px] object-cover rounded-xl shrink-0" />
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
                  <button onClick={() => setCart(c => c.filter((_, i) => i !== idx))} className="text-[#b98b6a] text-[11px] self-start hover:text-[#7b1d2a] transition">✕</button>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#e6d2b3] bg-[#faf3e5] px-6 py-5">
            {cart.length > 0 && (<>
              <div className="flex justify-between text-[14px] text-[#6d5437]"><span>Subtotal</span><span className="font-[600]">{PKR(cartTotal)}</span></div>
              <div className="flex justify-between text-[14px] text-[#6d5437] mt-1"><span>Delivery</span><span className="font-[600]">PKR {deliveryCharge}</span></div>
              <div className="flex justify-between text-[20px] font-[700] mt-3"><span>Total</span><span>{PKR(cartTotal + deliveryCharge)}</span></div>
              <button
                onClick={() => { setCheckoutOpen(true); setCheckoutStep(1); }}
                className="w-full mt-4 py-[14px] rounded-full bg-[#1a120e] text-[#f6e5c7] font-[700] text-[14px] flex items-center justify-center gap-2 hover:bg-[#2a1f16] transition"
              >
                💳 Proceed to Checkout
              </button>
              <div className="text-[11.5px] text-center text-[#9a7d5c] mt-2">Prepayment Required • EasyPaisa • JazzCash • Bank Transfer</div>
            </>)}
          </div>
        </aside>
      </div>

      {/* ═══════════ CHECKOUT MODAL ═══════════ */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[80] flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)} />
          <div className="relative m-auto w-[min(560px,96vw)] max-h-[94vh] overflow-auto rounded-[28px] bg-[#faf6ef] shadow-2xl">
            <button onClick={() => setCheckoutOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#e1ccab] grid place-items-center text-[#725a3d] z-10 hover:bg-[#f5e5cc] transition text-[18px]">✕</button>

            {/* Header */}
            <div className="bg-[#14100d] text-[#f6e7c9] px-7 py-5 rounded-t-[28px]">
              <div className="text-[10px] tracking-[0.22em] uppercase font-[600] text-[#d2a75a]">Checkout</div>
              <div className="text-[26px] mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                {checkoutStep === 1 ? "Your Details" : "Payment & Confirmation"}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className={`flex items-center gap-1.5 text-[11px] font-[600] ${checkoutStep >= 1 ? "text-[#e8c06f]" : "text-[#6b5a46]"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] ${checkoutStep >= 1 ? "bg-[#e8c06f] text-[#1a1008]" : "bg-[#3a2b21] text-[#8a7054]"}`}>1</span>
                  Details
                </div>
                <div className={`w-8 h-px ${checkoutStep >= 2 ? "bg-[#e8c06f]" : "bg-[#3a2b21]"}`}></div>
                <div className={`flex items-center gap-1.5 text-[11px] font-[600] ${checkoutStep >= 2 ? "text-[#e8c06f]" : "text-[#6b5a46]"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] ${checkoutStep >= 2 ? "bg-[#e8c06f] text-[#1a1008]" : "bg-[#3a2b21] text-[#8a7054]"}`}>2</span>
                  Payment
                </div>
              </div>
            </div>

            <div className="p-7">
              {/* ── Order Summary ── */}
              <div className="bg-white rounded-2xl border border-[#ead6b8] p-4 mb-6">
                <div className="text-[11px] tracking-[0.18em] text-[#9b7141] uppercase font-[600] mb-3">Order Summary</div>
                {cart.map((line, idx) => {
                  const p = PRODUCTS.find(pp => pp.id === line.productId);
                  if (!p) return null;
                  const sz = p.sizes.find(s => s.ml === line.sizeMl) ?? p.sizes[0];
                  return (
                    <div key={`${line.productId}-${line.sizeMl}-${idx}`} className="flex items-center gap-3 py-2 border-b border-[#f0e0c8] last:border-0">
                      <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-[600] truncate">{p.name}</div>
                        <div className="text-[11px] text-[#8d7253]">{line.sizeMl}ml × {line.qty}</div>
                      </div>
                      <div className="text-[14px] font-[700] shrink-0">{PKR(sz.price * line.qty)}</div>
                    </div>
                  );
                })}
                <div className="mt-3 pt-3 border-t border-[#e6d2b3] space-y-1">
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
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">Phone / WhatsApp Number *</label>
                    <input
                      value={custPhone}
                      onChange={e => setCustPhone(e.target.value)}
                      placeholder="e.g. 0312-3456789"
                      type="tel"
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">Delivery Address *</label>
                    <textarea
                      value={custAddress}
                      onChange={e => setCustAddress(e.target.value)}
                      placeholder="House #, Street, Block, Area..."
                      rows={3}
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-1.5 block">City</label>
                    <input
                      value={custCity}
                      onChange={e => setCustCity(e.target.value)}
                      className="w-full border border-[#e4d0b2] rounded-xl px-4 py-3.5 text-[14px] outline-none focus:border-[#c9a06a] transition bg-white"
                    />
                  </div>

                  <button
                    onClick={() => setCheckoutStep(2)}
                    disabled={!canProceedStep1}
                    className={`w-full py-[14px] rounded-full font-[700] text-[14px] mt-2 transition ${canProceedStep1 ? "bg-[#1b1310] text-[#f6e7cc] hover:bg-[#2a1f16]" : "bg-[#d9ccba] text-[#a09080] cursor-not-allowed"}`}
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
                    <div className="grid grid-cols-3 gap-2">
                      {(["easypaisa", "jazzcash", "bank"] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setPayMethod(method)}
                          className={`rounded-xl py-3.5 px-2 border text-center transition ${payMethod === method ? "border-[#c99a4a] bg-[#fff4df] shadow-inner" : "border-[#e2ccaa] bg-white hover:bg-[#fffaf0]"}`}
                        >
                          <div className="text-[20px]">{paymentAccounts[method].icon}</div>
                          <div className="text-[12px] font-[600] mt-1">{paymentAccounts[method].title}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Account Details */}
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
                        <span className="text-[12px] text-[#c99a4a] font-[600]">Amount to Transfer</span>
                        <span className="text-[20px] font-[700] text-[#e8c06f]">{PKR(cartTotal + deliveryCharge)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="text-[12px] tracking-[0.1em] text-[#8a7054] uppercase font-[600] mb-2 block">Upload Payment Screenshot *</label>
                    <div
                      onClick={() => screenshotInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition hover:bg-[#fff8ee] ${payScreenshot ? "border-[#4CAF50] bg-[#f0faf0]" : "border-[#dcc49f] bg-white"
                        }`}
                    >
                      {payScreenshot ? (
                        <div>
                          <img src={payScreenshot} alt="Payment screenshot" className="max-h-[200px] mx-auto rounded-xl shadow-md mb-3" />
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
                      className="px-5 py-[14px] rounded-full border border-[#dcc49f] text-[13.5px] font-[600] text-[#5d4628] hover:bg-[#fff6e7] transition"
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
                          `✅ *Total Paid: ${PKR(cartTotal + deliveryCharge)}*\n\n` +
                          `💳 *Payment:* ${paymentAccounts[payMethod].title}\n` +
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
                      ⚠️ Please upload your payment screenshot to confirm order
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
        <div className="bg-[#1a140f] text-[#f7e6c5] px-6 py-3.5 rounded-full text-[13.5px] shadow-xl border border-[#3b2b1c]">{toast}</div>
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
            <div className="bg-[#faf7f2] border border-[#ead9bf] rounded-[28px] max-w-[400px] w-full p-8 shadow-2xl text-center">
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
                className="w-full border border-[#d8c4a0] rounded-xl px-4 py-3 text-[14px] text-center outline-none focus:border-[#b89050] bg-white mb-4 font-mono"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setAdminOpen(false); setAdminPass(""); window.location.hash = ""; }}
                  className="flex-1 py-3 rounded-full border border-[#dcc49f] text-[13.5px] font-[600] text-[#5d4628] hover:bg-[#fff6e7] transition"
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
                  className="flex-1 py-3 rounded-full bg-[#1b1310] text-[#f6e7cc] text-[13.5px] font-[600] hover:bg-[#2a1f16] transition"
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