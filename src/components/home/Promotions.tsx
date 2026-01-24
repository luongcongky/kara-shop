import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { getCloudinaryUrl } from '@/utils/cloudinary';

export const Promotions = () => {
  const { t } = useTranslation('home');

  return (
    <div className="bg-white">
      <div className="mx-auto flex flex-col items-center px-4 py-10 md:container">
        <span className="mb-4 text-sm font-bold uppercase text-violet-700">
          {t('promotions.promotions')}
        </span>
        <h2 className="mb-6 text-center text-3xl font-bold text-black md:text-4xl">
          {t('promotions.title')}
        </h2>
        <div className="grid w-full max-w-[1150px] gap-3 md:grid-cols-4">
          <Link href="/" className="col-span-2">
            <Image src={getCloudinaryUrl('/assets/promo-banner-1.webp')} alt="promo banner 1 image" width={560} height={250} />
          </Link>
          <Link href="/" className="row-span-2">
            <Image src={getCloudinaryUrl('/assets/promo-banner-2.webp')} alt="promo banner 2 image" width={270} height={250} />
          </Link>
          <Link href="/" className="row-span-2">
            <Image src={getCloudinaryUrl('/assets/promo-banner-3.webp')} alt="promo banner 3 image" width={270} height={250} />
          </Link>
          <Link href="/" className="col-span-2">
            <Image src={getCloudinaryUrl('/assets/promo-banner-4.webp')} alt="promo banner 4 image" width={560} height={250} />
          </Link>
        </div>
      </div>
    </div>
  );
};
