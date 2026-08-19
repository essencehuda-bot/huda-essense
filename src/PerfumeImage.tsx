import { useState, useEffect } from 'react';
import { ProductData } from './AdminPanel';

type Product = ProductData;

// Global in-memory cache to prevent reloading the same product multiple times
const imageCache: Record<string, string> = {};

interface Props {
  product: Product;
  className?: string;
  onClick?: () => void;
}

export default function PerfumeImage({ product, className, onClick }: Props) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // If already cached, use immediately
    if (imageCache[product.id]) {
      setSrc(imageCache[product.id]);
      return;
    }

    // All images are pre-rendered AI-generated luxury bottle photos
    // Just load the image directly from the product's image path
    const imgSrc = product.image || `/images/huda-essence-${product.id}.jpg`;
    
    const img = new Image();
    img.onload = () => {
      imageCache[product.id] = imgSrc;
      setSrc(imgSrc);
    };
    img.onerror = () => {
      // Fallback: try alternate path
      const fallback = `/images/huda-essence-${product.id}.jpg`;
      imageCache[product.id] = fallback;
      setSrc(fallback);
    };
    img.src = imgSrc;
  }, [product]);

  return src ? (
    <img src={src} alt={product.name} className={className} onClick={onClick} loading="lazy" />
  ) : (
    // Placeholder while loading
    <div className={`bg-[#1a1a1a] animate-pulse ${className}`} onClick={onClick} />
  );
}
