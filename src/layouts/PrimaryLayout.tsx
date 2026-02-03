import React from 'react';
import { api } from '@/utils/api';
import { NextSeo, type NextSeoProps } from 'next-seo';
import { Header, Footer, StickyContact } from '@/components';
import { CompareBar } from '@/components/compare/CompareBar';

interface PrimaryLayoutProps extends React.PropsWithChildren {
  seo: NextSeoProps;
}

export const PrimaryLayout = ({ seo, children }: PrimaryLayoutProps) => {
  const { data } = api.collection.all.useQuery();
  const { data: systemConfig } = api.systemConfig.getAll.useQuery();

  const logoUrl = systemConfig?.find((item: { key: string; value: string }) => item.key === 'SYSTEM_LOGO')?.value;

  return (
    <>
      <NextSeo noindex={true} nofollow={true} {...seo} />
      <div className="min-h-screen">
        <Header collections={data} logoUrl={logoUrl} />
        {children}
      </div>
      <StickyContact />
      <CompareBar />
      <Footer logoUrl={logoUrl} />
    </>
  );
};
