import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import { useTranslation, Trans } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';

export const Hero = () => {
  const { t } = useTranslation('home');

  return (
    <div className="overflow-hidden bg-gray-100">
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col px-4 md:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center pt-10 md:items-start md:px-4 md:pt-0">
          <span
            data-aos="fade-down"
            data-aos-delay="200"
            className="mb-2.5 rounded-md bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-600 md:mb-5"
          >
            {t('hero.discount')}
          </span>
          <h2
            data-aos="fade-right"
            data-aos-delay="300"
            className="mb-5 text-center text-[2.5rem] font-bold leading-tight text-black md:text-left md:text-5xl"
          >
            <Trans
              i18nKey="hero.title"
              t={t}
              components={{
                1: <span className="text-violet-700" />,
                2: <span className="text-red-600" />,
              }}
            />
          </h2>
          <div
            data-aos="fade-right"
            data-aos-delay="400"
            className="font-regular mb-5 text-center text-lg leading-tight text-neutral-700 md:mb-10 md:text-left"
          >
            <ul className="list-inside list-disc">
              {(t('hero.description', { returnObjects: true }) as string[]).map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>
          <Link
            href={''}
            data-aos="fade-up"
            data-aos-delay="500"
            className="mb-10 flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/50 transition-all duration-300 hover:from-violet-700 hover:to-blue-700 hover:shadow-xl hover:shadow-violet-600/60 hover:scale-105"
          >
            <FiShoppingCart className="text-lg" />
            <span className="ml-2">{t('hero.shop')}</span>
          </Link>
          <div
            className="mb-5 flex w-full flex-wrap justify-center md:justify-between"
            data-aos-delay="600"
            data-aos="fade"
          >
            {['canon', 'sony', 'nikon', 'fuji'].map((brand, index) => (
              <Image
                priority
                key={index}
                src={getCloudinaryUrl(`/assets/${brand}.svg`)}
                alt={`${brand} brand`}
                width={100}
                height={50}
                className={'mx-4 my-1'}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-end justify-start">
          <Image
            priority
            src={getCloudinaryUrl('/assets/hero.webp')}
            alt="hero"
            quality={100}
            width={550}
            height={550}
            data-aos="fade-up"
          />
        </div>
      </div>
    </div>
  );
};
