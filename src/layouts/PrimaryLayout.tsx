import React from 'react';
import { api } from '@/utils/api';
import { NextSeo, type NextSeoProps } from 'next-seo';
import { Header, Footer, StickyContact } from '@/components';
import { CompareBar } from '@/components/compare/CompareBar';

interface PrimaryLayoutProps extends React.PropsWithChildren {
  seo: NextSeoProps;
}

export const PrimaryLayout = ({ seo, children }: PrimaryLayoutProps) => {
  const { data } = api.collection.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const { data: systemConfig } = api.systemConfig.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const logoUrl = systemConfig?.find((item: { key: string; value: string }) => item.key === 'SYSTEM_LOGO')?.value;
  const brandName = systemConfig?.find((item: { key: string; value: string }) => item.key === 'SYSTEM_NAME')?.value || 'Shop';

  const dynamicSeo = {
    ...seo,
    title: seo.title?.includes(brandName) ? seo.title : `${seo.title} | ${brandName}`,
  };

  return (
    <>
      <NextSeo noindex={true} nofollow={true} {...dynamicSeo} />
      <div className="min-h-screen">
        <Header collections={data} logoUrl={logoUrl} brandName={brandName} />
        {children}
      </div>
      <StickyContact />
      <CompareBar />
      <Footer logoUrl={logoUrl} brandName={brandName} />
    </>
  );
};
