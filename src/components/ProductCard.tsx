import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatPrice } from '../lib/utils';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  color: string;
  dia: number;
  bc: number;
  power: string;
  duration: string;
  price: number;
  images: string[];
  shortDescription: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F5E6E0] hover:shadow-xl hover:shadow-[#D4A373]/5 transition-all duration-500"
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-[#D4A373] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
            {product.brand}
          </span>
          {product.duration && (
            <span className="bg-[#1A1A1A]/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
              {product.duration}
            </span>
          )}
        </div>
        <button className="absolute bottom-4 right-4 p-3 bg-white text-[#1A1A1A] rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#D4A373] hover:text-white">
          <ShoppingCart size={20} />
        </button>
      </Link>
      
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-1 text-[#D4A373]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < (product.rating || 5) ? "currentColor" : "none"} />
          ))}
          <span className="text-gray-400 text-[10px] ml-1">({product.reviewsCount || 0})</span>
        </div>
        
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 group-hover:text-[#D4A373] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.shortDescription}</p>
        </Link>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-serif font-bold text-[#1A1A1A]">{formatPrice(product.price)}</span>
          <div className="flex gap-2">
            <div className={cn("w-3 h-3 rounded-full border border-gray-100", 
              product.color === 'Nâu' ? 'bg-[#8B4513]' : 
              product.color === 'Đen' ? 'bg-black' : 
              product.color === 'Xám' ? 'bg-gray-400' : 'bg-blue-400'
            )} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
