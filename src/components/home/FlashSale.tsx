import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Countdown from 'react-countdown';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { numberWithCommas } from '@/utils';

const FLASH_SALE_PRODUCTS = [
  {
    id: 50,
    name: 'Sony Alpha A6400',
    price: 25517454,
    salePrice: 20990000,
    image: '/camera_sample_ulxm5p.png',
    totalSlots: 5,
    soldSlots: 2,
    badge: 'journalistPrivilege'
  },
  {
    id: 47,
    name: 'Canon EOS R8',
    price: 27490000,
    salePrice: 24500000,
    image: '/camera_sample_ulxm5p.png',
    totalSlots: 3,
    soldSlots: 0,
    badge: 'dealerPrice'
  },
  {
    id: 49,
    name: 'Fujifilm X-T5',
    price: 48490000,
    salePrice: 42990000,
    image: '/camera_sample_ulxm5p.png',
    totalSlots: 10,
    soldSlots: 7,
    badge: 'bestSeller'
  }
];

interface CountdownProps {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const CountdownRenderer = ({ hours, minutes, seconds, completed }: CountdownProps) => {
  if (completed) {
    return <span className="text-red-600 font-bold uppercase animate-pulse">Ended</span>;
  }
  return (
    <div className="flex gap-2">
      {[
        { label: 'H', value: hours },
        { label: 'M', value: minutes },
        { label: 'S', value: seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-900 font-mono text-xl font-black text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            {String(item.value).padStart(2, '0')}
          </div>
        </div>
      ))}
    </div>
  );
};

export const FlashSale = () => {
  const { t } = useTranslation('home');
  const targetDate = React.useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 24), []);

  return (
    <section className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center justify-between border-b border-zinc-200 pb-8 md:flex-row">
          <div className="mb-4 flex items-center md:mb-0">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 md:text-4xl italic">
                {t('flashSale.title')}
              </h2>
              <p className="text-sm font-bold text-orange-600 uppercase tracking-widest leading-none">
                 Limit Time Offer
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-zinc-100">
            <span className="text-sm font-bold text-zinc-500 uppercase">{t('flashSale.endsIn')}</span>
            <Countdown date={targetDate} renderer={CountdownRenderer} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {FLASH_SALE_PRODUCTS.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-3xl bg-white p-6 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 border border-zinc-100">
              {/* Badge */}
              <div className="absolute left-0 top-6 z-10">
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white rounded-r-full shadow-lg border-l-4 border-orange-500">
                  {t(`common.${product.badge}`)}
                </div>
              </div>

              {/* Image */}
              <div className="relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 p-4 transition-transform group-hover:scale-105 duration-500">
                <Image
                  src={getCloudinaryUrl(product.image)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain drop-shadow-xl"
                />
                
                {/* Discount Ribbon */}
                <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden">
                  <div className="absolute right-[-17px] top-[14px] w-[70px] rotate-45 bg-orange-500 py-1 text-center text-[10px] font-black text-white shadow-md uppercase">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <h3 className="line-clamp-1 text-lg font-bold text-zinc-900 transition-colors group-hover:text-orange-600">
                  {product.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-zinc-900">{numberWithCommas(product.salePrice)} đ</span>
                  <span className="text-xs font-bold text-zinc-400 line-through decoration-orange-500/50">{numberWithCommas(product.price)} đ</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                    <span>{t('flashSale.onlyLeft', { count: product.totalSlots - product.soldSlots })}</span>
                    <span className="text-orange-600 italic">Hurry Up!</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 border border-zinc-50">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                      style={{ width: `${(product.soldSlots / product.totalSlots) * 100}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/product/${product.id}/slug`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-zinc-900 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  {t('common.shopNow')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
