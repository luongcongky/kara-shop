import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { 
  HeroCarousel, 
  FlashSale, 
  Promotions, 
  Commitments, 
  TopSellingProducts 
} from '@/components';
import { PrimaryLayout } from '@/layouts';
import { CollectionType } from '@prisma/client';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

const Home: NextPageWithLayout = () => {
  const { t } = useTranslation('home');

  return (
    <div className="flex flex-col">
      {/* 1. Slider/Hero: Sản phẩm mới nhất */}
      <HeroCarousel />

      {/* 3. Flash Deal: Các Deal chớp nhoáng với Visual Anchor */}
      <div className="bg-zinc-100/50">
        <FlashSale />
      </div>

      {/* 4. Top Selling Cameras */}
      <TopSellingProducts 
        type={CollectionType.CAMERA} 
        title={t('bestSelling.cameraTitle')}
      />

      {/* 4. Top Selling Lenses */}
      <TopSellingProducts 
        type={CollectionType.LENS} 
        title={t('bestSelling.lensTitle')}
      />

      {/* 2. Icon Bar: 4 cam kết vàng */}
      <Commitments />

      {/* 5. Professional Services: Ưu đãi từ hệ thống */}
      <Promotions />
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'High-End Cameras & Electronics', canonical: '/' }}>
      {page}
    </PrimaryLayout>
  );
};

export default Home;
