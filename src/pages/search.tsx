import React from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { api } from '@/utils/api';
import { PrimaryLayout } from '@/layouts';
import { ProductsList } from '@/components';
import { Pagination } from '@/components/ui';
import type { NextPageWithLayout } from './_app';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

const SearchPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { q, page = 1 } = router.query as { q: string; page: string };
  const { t } = useTranslation('common');

  const pageSize = 12;
  const { data, isLoading } = api.product.all.useQuery({
    search: q,
    page: Number(page),
  }, {
    enabled: !!q,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{q ? `${t('search')}: ${q}` : t('search')} | KARA Shop</title>
      </Head>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          {q ? (
            <>
              {t('search_results_for')}: <span className="text-violet-600 italic">&quot;{q}&quot;</span>
            </>
          ) : (
            t('search')
          )}
        </h1>
        {data && (
           <p className="mt-2 text-gray-500 font-medium">Tìm thấy {data.totalCount} sản phẩm</p>
        )}
      </div>

      <ProductsList products={data?.products} isLoading={isLoading} />

      {data && data.totalCount > pageSize && (
        <div className="mt-12 flex justify-center">
          <Pagination
            totalCount={data.totalCount}
            currentPage={Number(page)}
            pageSize={pageSize}
            onPageChange={(newPage) =>
              router.push({ query: { ...router.query, page: newPage } }, undefined, {
                shallow: true,
                scroll: true,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout 
      seo={{ 
        title: 'Tìm kiếm sản phẩm', 
        description: 'Tìm kiếm sản phẩm tại KARA Shop' 
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default SearchPage;
