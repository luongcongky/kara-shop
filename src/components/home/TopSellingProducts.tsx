import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CollectionType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { api } from '@/utils/api';
import { numberWithCommas } from '@/utils';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { Product } from '@/types';

interface TopSellingProductsProps {
  type: CollectionType;
  title: string;
}

export const TopSellingProducts: React.FC<TopSellingProductsProps> = ({ type, title }) => {
  const { t } = useTranslation('home');
  const { addItem } = useCart();
  const { data: products, isLoading } = api.product.getBestSelling.useQuery({ 
    type,
    take: 20 
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product as Product);
    toast.success(t('common.addedToCart') || 'Đã thêm vào giỏ hàng!');
  };

  if (isLoading) {
    return (
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-10 w-48 animate-pulse rounded bg-zinc-100 mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-80 w-64 shrink-0 animate-pulse rounded-3xl bg-zinc-50" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-zinc-50 py-4 md:py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-4 flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-4 md:mb-6 md:gap-4 md:pb-6 mx-auto">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 md:mr-4 md:h-10 md:w-10">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 animate-bounce md:h-6 md:w-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-1.568-4.594 3.75 3.75 0 00-.752 7.515A3.75 3.75 0 0012 18z" />
               </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-zinc-900 italic leading-tight md:text-2xl">
                {title}
              </h2>
              <p className="text-[7px] font-semibold uppercase tracking-widest text-orange-600 opacity-80 md:text-[9px]">
                {type === CollectionType.CAMERA ? t('bestSelling.cameraSubtitle') : t('bestSelling.lensSubtitle')}
              </p>
            </div>
          </div>
          <Link 
            href={`/products/${type.toLowerCase()}`} 
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-all hover:text-orange-500 md:text-xs"
          >
            {t('common.viewAll')} <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Layout: Flex scroll on mobile, Grid on desktop */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0">
          {products.map((product, idx) => (
            <div 
              key={product.id}
              className="group relative w-[calc(50%-4px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-white p-2 transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 border border-zinc-100 sm:w-[calc(50%-8px)] md:w-auto md:shrink md:rounded-[2rem] md:p-4"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            >
              {/* Anchor Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Image Wrapper */}
              <Link href={`/product/${product.id}/slug`} className="relative z-10 mb-2 sm:mb-4 flex h-24 sm:h-48 w-full items-center justify-center overflow-hidden rounded-lg sm:rounded-xl bg-zinc-50/50 p-0 sm:p-0 transition-transform group-hover:scale-105 duration-700">
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-32 bg-orange-500/10 blur-[40px] rounded-full group-hover:bg-orange-500/20 transition-colors" />
                
                <Image 
                  src={product.images[0]?.imageURL ? (product.images[0].imageURL.startsWith('http') ? product.images[0].imageURL : getCloudinaryUrl(product.images[0].imageURL)) : '/camera-placeholder.png'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:-rotate-3"
                />
              </Link>

              {/* Content */}
              <div className="relative z-10 flex flex-1 flex-col">
                <Link href={`/product/${product.id}/slug`} className="mb-2">
                  <h3 className="line-clamp-1 text-[10px] font-bold text-zinc-900 transition-colors group-hover:text-orange-600 sm:text-sm">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="mt-auto flex items-center justify-between pt-2 sm:pt-4">
                  <div className="flex flex-1 items-baseline overflow-hidden">
                    <span className="basis-[60%] shrink-0 text-[11px] sm:text-lg font-bold text-zinc-900 truncate">
                      {numberWithCommas(Math.floor(product.price))} đ
                    </span>
                    {product.originalPrice && (
                      <span className="basis-[40%] shrink-0 text-[7px] sm:text-[11px] font-semibold text-zinc-400 line-through decoration-orange-500/30 truncate">
                        {numberWithCommas(Math.floor(product.originalPrice))} đ
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-lg transition-all hover:bg-orange-500 hover:shadow-orange-500/30 active:scale-95 sm:h-10 sm:w-10 sm:rounded-xl"
                  >
                    <FiShoppingCart className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* View More Card - Adjusted to match layout */}
          <Link 
            href={`/products/${type.toLowerCase()}`}
            className="flex w-[calc(50%-4px)] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50/30 transition-all hover:border-orange-500/30 hover:bg-zinc-50 md:w-auto md:rounded-[2rem]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-zinc-50 text-zinc-400 transition-colors group-hover:text-orange-500 md:h-14 md:w-14">
              <FiArrowRight size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="mt-2 text-[8px] font-bold uppercase tracking-widest text-zinc-400 md:mt-4 md:text-xs">{t('common.viewAll')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
