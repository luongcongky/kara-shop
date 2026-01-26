import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const FEATURED_PRODUCTS = [
  {
    id: 50,
    name: 'Sony Alpha A6400',
    subtitle: 'Mirrorless Camera with E 18-135mm Lens',
    discount: 'Giảm giá 15%',
    image: '/camera_sample_ulxm5p.png', // Using the cloudinary path from dump
    color: 'bg-zinc-900',
    textColor: 'text-white',
    buttonColor: 'bg-orange-500',
  },
  {
    id: 47,
    name: 'Canon EOS R8',
    subtitle: 'The Lightest Full-Frame Camera',
    discount: 'Đặc quyền Nhà báo',
    image: '/camera_sample_ulxm5p.png',
    color: 'bg-white',
    textColor: 'text-black',
    buttonColor: 'bg-blue-600',
  },
  {
    id: 49,
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

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-white">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, bulletActiveClass: 'swiper-pagination-bullet-active !bg-orange-500' }}
        loop={true}
        className="h-full w-full"
      >
        {FEATURED_PRODUCTS.map((product) => (
          <SwiperSlide key={product.id}>
            <div className={`flex h-full w-full flex-col md:flex-row ${product.color}`}>
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center md:items-start md:px-20 md:text-left">
                <span className={`mb-4 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${product.textColor} border border-current opacity-70`}>
                  {product.discount}
                </span>
                <h2 className={`mb-2 text-4xl font-black tracking-tight md:text-6xl ${product.textColor}`}>
                  {product.name}
                </h2>
                <p className={`mb-8 text-lg font-medium opacity-80 md:text-xl ${product.textColor}`}>
                  {product.subtitle}
                </p>
                <Link
                  href={`/product/${product.id}/slug`}
                  className={`${product.buttonColor} flex items-center rounded-sm px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-105 hover:brightness-110 active:scale-95`}
                >
                  <FiShoppingCart className="mr-3 text-lg" />
                  {t('common.shopNow')}
                </Link>
              </div>
              <div className="relative flex flex-1 items-center justify-center p-8 md:p-0">
                <div className="relative h-[80%] w-[80%] transition-transform duration-700 hover:scale-110">
                   <Image
                    src={product.image.startsWith('http') ? product.image : getCloudinaryUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
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
