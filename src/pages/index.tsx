import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  HeroCarousel, 
  FlashSale, 
  Promotions, 
  Commitments 
} from '@/components';
import { PrimaryLayout } from '@/layouts';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

const Home: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Slider/Hero: Sản phẩm mới nhất */}
      <HeroCarousel />

      {/* 2. Icon Bar: 4 cam kết vàng */}
      <Commitments />

      {/* 3. Flash Deal: Các Deal chớp nhoáng với Visual Anchor */}
      <div className="bg-zinc-100/50">
        <FlashSale />
      </div>

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
