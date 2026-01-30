import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { api } from '@/utils/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Keep FEATURED_PRODUCTS as fallback
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    productId: 50,
    name: 'Sony Alpha A6400',
    subtitle: 'Mirrorless Camera with E 18-135mm Lens',
    discount: 'Giảm giá 15%',
    image: '/camera_sample_ulxm5p.png',
    color: 'bg-zinc-900',
    textColor: 'text-white',
    buttonColor: 'bg-orange-500',
  },
  {
    id: 2,
    productId: 47,
    name: 'Canon EOS R8',
    subtitle: 'The Lightest Full-Frame Camera',
    discount: 'Đặc quyền Nhà báo',
    image: '/camera_sample_ulxm5p.png',
    color: 'bg-white',
    textColor: 'text-black',
    buttonColor: 'bg-blue-600',
  },
  {
    id: 3,
    productId: 49,
    name: 'Fujifilm X-T5',
    subtitle: 'Photography First. Retro Style.',
    discount: 'Hàng mới về',
    image: '/camera_sample_ulxm5p.png',
    color: 'bg-zinc-100',
    textColor: 'text-black',
    buttonColor: 'bg-zinc-800',
  }
];

export const HeroCarousel = () => {
  const { t } = useTranslation('home');
  const { data: banners, isLoading } = api.banner.getAll.useQuery({ type: 'HERO' });

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center bg-zinc-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const products = banners && banners.length > 0 
    ? banners.map(b => ({
        id: b.id, // Use Banner ID instead of Product ID to ensure uniqueness
        productId: b.productId ?? 0,
        name: b.title,
        subtitle: b.subtitle ?? '',
        discount: b.discount ?? '',
        image: b.imageUrl,
        color: b.bgColor,
        textColor: b.textColor,
        buttonColor: b.buttonColor,
      })) 
    : FALLBACK_PRODUCTS;

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-white">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, bulletActiveClass: 'swiper-pagination-bullet-active !bg-orange-500' }}
        loop={true}
        className="h-full w-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className={`relative h-full w-full overflow-hidden ${product.color}`}>
              {/* Texture Overlay */}
              <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              {/* Spotlight Effect */}
              <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />

              {/* Decorative background elements */}
              <div className={`absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl ${product.textColor === 'text-white' ? 'bg-white/10' : 'bg-orange-500/10'}`} />
              <div className={`absolute -left-20 -bottom-20 h-96 w-96 rounded-full blur-3xl ${product.textColor === 'text-white' ? 'bg-black/20' : 'bg-orange-500/5'}`} />

              <div className="mx-auto flex h-full max-w-7xl flex-col items-center px-4 md:flex-row md:px-12 lg:px-20 relative z-10">
                <div className="z-10 flex flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
                  <span 
                    className={`mb-6 inline-block rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest ${product.textColor === 'text-white' ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'} border backdrop-blur-md shadow-xl`}
                    data-aos="fade-up"
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                    {product.discount || 'New Arrival'}
                  </span>
                  <h2 
                    className={`mb-4 text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-6xl ${product.textColor}`}
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    {product.name}
                  </h2>
                  <p 
                    className={`mb-10 max-w-lg text-lg font-medium opacity-70 md:text-xl lg:text-2xl ${product.textColor}`}
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    {product.subtitle}
                  </p>
                  <Link
                    href={`/product/${product.productId}/slug`}
                    className={`${product.buttonColor} group relative flex items-center overflow-hidden rounded-full px-12 py-5 text-xs font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95`}
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
                    <FiShoppingCart className="mr-3 text-xl transition-transform duration-300 group-hover:rotate-12" />
                    <span className="relative">{t('common.shopNow')}</span>
                  </Link>
                </div>

                <div className="relative flex flex-1 items-center justify-center p-8 md:p-12 lg:p-16">
                  {/* Image Glow Effect */}
                  <div className={`absolute h-[60%] w-[60%] rounded-full opacity-20 blur-[100px] ${product.textColor === 'text-white' ? 'bg-white' : 'bg-orange-500'}`} />
                  
                  <div 
                    className="relative flex h-full w-full items-center justify-center transition-all duration-1000"
                    data-aos="zoom-in-up"
                    data-aos-duration="1200"
                  >
                     <Image
                      src={product.image.startsWith('http') ? product.image : getCloudinaryUrl(product.image)}
                      alt={product.name}
                      width={800}
                      height={800}
                      className="z-20 h-auto w-full max-w-[550px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 40px;
          height: 4px;
          border-radius: 0;
          background: #ccc;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};
