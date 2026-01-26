import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';

export const Promotions = () => {
  const { t } = useTranslation('home');

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center md:text-left">
          <span className="mb-3 block text-sm font-black uppercase tracking-[0.3em] text-orange-500">
            {t('promotions.promotions')}
          </span>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-900 md:text-5xl">
             {t('promotions.title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4 md:grid-rows-2">
          {/* Big Banner 1 */}
          <Link 
            href="/" 
            className="group relative col-span-2 row-span-2 overflow-hidden rounded-[2.5rem] bg-zinc-900 shadow-2xl transition-all hover:-translate-y-1 hover:shadow-orange-500/10"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
            <Image 
              src={getCloudinaryUrl('/assets/promo-banner-1.webp')} 
              alt="promo banner 1" 
              width={600} 
              height={600} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-10 left-10 z-20">
               <span className="mb-2 inline-block bg-white px-3 py-1 text-[10px] font-black uppercase text-zinc-900">New arrivals</span>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Premium Sony Collection</h3>
            </div>
          </Link>

          {/* Medium Banner 1 */}
          <Link 
            href="/" 
            className="group relative col-span-2 overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-xl transition-all hover:-translate-y-1"
          >
             <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-100/50 via-transparent to-transparent" />
            <Image 
              src={getCloudinaryUrl('/assets/promo-banner-4.webp')} 
              alt="promo banner 4" 
              width={600} 
              height={300} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
             <div className="absolute inset-y-0 left-10 z-20 flex flex-col justify-center">
               <h3 className="max-w-[150px] text-xl font-black text-zinc-900 uppercase leading-none tracking-tighter">Studio Gear Specials</h3>
            </div>
          </Link>

          {/* Small Banner 1 */}
          <Link 
            href="/" 
            className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-50 shadow-lg transition-all hover:-translate-y-1"
          >
            <Image 
              src={getCloudinaryUrl('/assets/promo-banner-2.webp')} 
              alt="promo banner 2" 
              width={300} 
              height={300} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
               <div className="rounded-full bg-white/20 backdrop-blur-md p-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
               </div>
            </div>
          </Link>

          {/* Small Banner 2 */}
          <Link 
            href="/" 
            className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-50 shadow-lg transition-all hover:-translate-y-1"
          >
            <Image 
              src={getCloudinaryUrl('/assets/promo-banner-3.webp')} 
              alt="promo banner 3" 
              width={300} 
              height={300} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
               <div className="rounded-full bg-white/20 backdrop-blur-md p-4 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
               </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
