import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'Shop',
  titleTemplate: '%s | Shop',
  description:
    'Shop - Chuyên cung cấp máy ảnh và ống kính chính hãng, giá tốt nhất thị trường',
  canonical: 'https://kara-shop.vercel.app/',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://kara-shop.vercel.app/',
    siteName: 'Shop',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default config;
