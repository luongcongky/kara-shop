import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Countdown from 'react-countdown';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { numberWithCommas } from '@/utils';
import { api } from '@/utils/api';

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
          <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-900 font-mono text-xl font-bold text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            {String(item.value).padStart(2, '0')}
          </div>
        </div>
      ))}
    </div>
  );
};

export const FlashSale = () => {
  const { t } = useTranslation('home');
  const { data: flashSales, isLoading } = api.flashSale.getActive.useQuery();

  const targetDate = React.useMemo(() => {
    if (flashSales && flashSales.length > 0 && flashSales[0]?.endTime) {
      return new Date(flashSales[0].endTime);
    }
    return new Date(Date.now() + 1000 * 60 * 60 * 24);
  }, [flashSales]);

  if (isLoading) {
    return (
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid h-96 place-items-center rounded-3xl bg-white border border-zinc-100">
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!flashSales || flashSales.length === 0) return null;

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
              <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl italic">
                {t('flashSale.title')}
              </h2>
              <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider leading-none">
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
          {flashSales.map((fs) => (
            <div key={fs.id} className="group relative overflow-hidden rounded-[2.5rem] bg-white p-6 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 border border-zinc-100">
              {/* Anchor Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Badge */}
              {fs.badge && (
                <div className="absolute left-0 top-6 z-10">
                  <div className="bg-zinc-900 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white rounded-r-full shadow-lg border-l-4 border-orange-500">
                    {t(`common.${fs.badge}`)}
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="relative z-10 mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50/50 p-4 transition-transform group-hover:scale-105 duration-700">
                 {/* Item Reflection Effect */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-32 bg-orange-500/10 blur-[40px] rounded-full group-hover:bg-orange-500/20 transition-colors" />

                <Image
                  src={fs.product.images[0]?.imageURL ? (fs.product.images[0].imageURL.startsWith('http') ? fs.product.images[0].imageURL : getCloudinaryUrl(fs.product.images[0].imageURL)) : '/placeholder.png'}
                  alt={fs.product.name}
                  width={200}
                  height={200}
                  className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:-rotate-3"
                />
                
                {/* Discount Ribbon */}
                <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden">
                  <div className="absolute right-[-17px] top-[14px] w-[70px] rotate-45 bg-orange-500 py-1 text-center text-[10px] font-bold text-white shadow-md uppercase">
                    -{Math.round(((fs.product.price - fs.salePrice) / fs.product.price) * 100)}%
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="relative z-10 space-y-4">
                <h3 className="line-clamp-1 text-lg font-bold text-zinc-900 transition-colors group-hover:text-orange-600">
                  {fs.product.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-zinc-900">{numberWithCommas(fs.salePrice)} đ</span>
                  <span className="text-xs font-semibold text-zinc-400 line-through decoration-orange-500/30">{numberWithCommas(fs.product.price)} đ</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                    <div className="flex items-center gap-1.5">
                       <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                       {t('flashSale.onlyLeft', { count: fs.totalSlots - fs.soldSlots })}
                    </div>
                    <span className="text-orange-600 italic">Hurry Up!</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.4)] relative overflow-hidden"
                      style={{ width: `${(fs.soldSlots / fs.totalSlots) * 100}%` }}
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move-stripe_1s_linear_infinite]" />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/product/${fs.productId}/slug`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-zinc-900 py-4 text-xs font-bold text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30"
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
