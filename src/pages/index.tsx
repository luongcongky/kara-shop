import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '@/server/api/root';
import { createInnerTRPCContext } from '@/server/api/trpc';
import superjson from 'superjson';
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
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  // Prefetch data for Home page components
  await Promise.all([
    helpers.banner.getAll.prefetch({ type: 'HERO' }),
    helpers.flashSale.getActive.prefetch(),
    helpers.product.getBestSelling.prefetch({ type: CollectionType.CAMERA, take: 20 }),
    helpers.product.getBestSelling.prefetch({ type: CollectionType.LENS, take: 20 }),
    helpers.systemConfig.getByKey.prefetch({ key: 'SYSTEM_NAME' }),
  ]);

  return {
    props: {
      trpcState: helpers.dehydrate(),
      ...(await serverSideTranslations(locale)),
    },
    revalidate: 60, // Revalidate every 60 seconds
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
