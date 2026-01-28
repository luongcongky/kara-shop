import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { api } from '@/utils/api';

export const Promotions = () => {
  const { t } = useTranslation('home');
  const { data: banners, isLoading } = api.banner.getAll.useQuery({ type: 'PROMOTION' });

  if (isLoading) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid h-96 place-items-center rounded-[2.5rem] bg-zinc-50/50">
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg" />
          </div>
        </div>
      </section>
    );
  }

  // If no dynamic banners, could optionally return null or fall back
  if (!banners || banners.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center md:text-left" data-aos="fade-up">
          <span className="mb-3 block text-sm font-black uppercase tracking-[0.3em] text-orange-500">
            {t('promotions.promotions')}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tighter text-zinc-900 md:text-4xl">
             {t('promotions.title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4 md:grid-rows-2">
          {banners.map((banner, index) => {
            const isBig = index === 0;
            const isMedium = index === 1;
            const isSmall = index > 1;

            return (
              <Link 
                key={banner.id}
                href={banner.linkUrl ?? `/product/${banner.productId}/slug`} 
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isBig ? 'col-span-2 row-span-2 shadow-orange-500/10' : 
                  isMedium ? 'col-span-2' : 'col-span-1'
                } ${banner.bgColor}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 z-10 opacity-60 transition-opacity group-hover:opacity-40 ${
                  isBig ? 'bg-gradient-to-t from-black/80 via-transparent to-transparent' : 
                  isMedium ? 'bg-gradient-to-r from-black/30 via-transparent to-transparent' : ''
                }`} />

                <Image 
                  src={banner.imageUrl.startsWith('http') ? banner.imageUrl : getCloudinaryUrl(banner.imageUrl)} 
                  alt={banner.title} 
                  width={isBig || isMedium ? 600 : 300} 
                  height={isBig ? 600 : 300} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Content */}
                <div className={`absolute z-20 ${
                  isBig ? 'bottom-10 left-10' : 
                  isMedium ? 'inset-y-0 left-10 flex flex-col justify-center' :
                  'inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                }`}>
                   {isSmall ? (
                     <div className="rounded-full bg-white/20 backdrop-blur-md p-5 text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                     </div>
                   ) : (
                     <div className="max-w-[250px]">
                        <span className={`mb-3 inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest ${banner.textColor === 'text-white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                          {banner.subtitle}
                        </span>
                        <h3 className={`text-xl lg:text-2xl font-extrabold uppercase leading-tight tracking-tighter ${banner.textColor}`}>
                          {banner.title}
                        </h3>
                     </div>
                   )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
