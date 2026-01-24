import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'KARA Shop',
  titleTemplate: '%s | KARA Shop',
  description:
    'KARA Shop - Chuyên cung cấp máy ảnh và ống kính chính hãng, giá tốt nhất thị trường',
  canonical: 'https://kara-shop-tungjournalist.vercel.app/',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://kara-shop-tungjournalist.vercel.app/',
    siteName: 'KARA Shop',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default config;
