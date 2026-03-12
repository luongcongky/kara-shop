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
    <div className="flex gap-1 sm:gap-2">
      {[
        { label: 'H', value: hours },
        { label: 'M', value: minutes },
        { label: 'S', value: seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded bg-zinc-900 font-mono text-base sm:text-xl font-bold text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
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
    <section className="bg-zinc-50 py-4 md:py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-4 flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-4 md:mb-6 md:gap-4 md:pb-6 mx-auto">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 md:mr-4 md:h-10 md:w-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 animate-bounce md:h-6 md:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-zinc-900 italic leading-tight md:text-2xl">
                {t('flashSale.title')}
              </h2>
              <p className="text-[7px] font-semibold uppercase tracking-widest text-orange-600 opacity-80 md:text-[9px]">
                 Limit Time Offer
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-100 bg-white p-1.5 px-2 shadow-sm sm:gap-3 sm:p-3 sm:px-5">
            <span className="text-[8px] font-bold uppercase tracking-tight text-zinc-400 sm:text-[10px]">{t('flashSale.endsIn')}</span>
            <Countdown date={targetDate} renderer={CountdownRenderer} />
          </div>
        </div>

        {/* Flex scroll on mobile, Grid on desktop */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
          {flashSales.map((fs) => (
            <div key={fs.id} className="group relative w-[calc(50%-4px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-white p-2 transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 border border-zinc-100 sm:w-[calc(50%-8px)] md:w-auto md:shrink md:rounded-[2rem] md:p-4">
              {/* Anchor Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Badge */}
                <div className="absolute left-0 top-4 z-20 md:top-6">
                  <div className="bg-zinc-900 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-white rounded-r-full shadow-lg border-l-2 border-orange-500 md:px-4 md:py-2 md:text-[10px] md:border-l-4">
                    {t(`common.${fs.badge}`)}
                  </div>
                </div>

              {/* Image */}
              <div className="relative z-10 mb-2 sm:mb-4 flex h-28 sm:h-36 w-full items-center justify-center overflow-hidden rounded-lg sm:rounded-xl bg-zinc-50/50 p-10 sm:p-3 transition-transform group-hover:scale-105 duration-700">
                 {/* Item Reflection Effect */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-32 bg-orange-500/10 blur-[40px] rounded-full group-hover:bg-orange-500/20 transition-colors" />

                <Image
                  src={fs.product.images[0]?.imageURL ? (fs.product.images[0].imageURL.startsWith('http') ? fs.product.images[0].imageURL : getCloudinaryUrl(fs.product.images[0].imageURL)) : '/camera-placeholder.png'}
                  alt={fs.product.name}
                  width={200}
                  height={200}
                  className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:-rotate-3"
                />
                
                {/* Discount Ribbon */}
                <div className="absolute right-0 top-0 h-12 w-12 overflow-hidden md:h-16 md:w-16">
                  <div className="absolute right-[-14px] top-[10px] w-[55px] rotate-45 bg-orange-500 py-0.5 text-center text-[7px] font-bold text-white shadow-md uppercase md:right-[-17px] md:top-[14px] md:w-[70px] md:py-1 md:text-[10px]">
                    -{Math.round(((fs.product.price - fs.salePrice) / fs.product.price) * 100)}%
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="relative z-10 space-y-4">
                <h3 className="line-clamp-1 text-[10px] font-bold text-zinc-900 transition-colors group-hover:text-orange-600 sm:text-sm">
                  {fs.product.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-sm sm:text-lg font-bold text-zinc-900">{numberWithCommas(fs.salePrice)} đ</span>
                  <span className="text-xs sm:text-base font-semibold text-zinc-400 line-through decoration-orange-500/30">{numberWithCommas(fs.product.price)} đ</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-tight sm:text-[11px]">
                    <div className="flex items-center gap-1.5">
                       <span className="flex h-1 w-1 rounded-full bg-orange-500 animate-pulse sm:h-1.5 sm:w-1.5" />
                       {t('flashSale.onlyLeft', { count: fs.totalSlots - fs.soldSlots })}
                    </div>
                    <span className="text-orange-600 italic hidden sm:inline">Hurry Up!</span>
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
                  className="mt-2 flex w-full items-center justify-center rounded-lg bg-zinc-900 py-1.5 text-[8px] font-bold text-white transition-all hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/30 sm:mt-4 sm:rounded-xl sm:py-3 sm:text-[10px]"
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
