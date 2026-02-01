import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PrimaryLayout } from '@/layouts/PrimaryLayout';
import { ProductItem, Skeleton } from '@/components/product/ProductItem';
import { api } from '@/utils/api';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/types';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import React from 'react';

const WishlistPage = () => {

  const { wishlistItems, isLoading: isWishlistLoading } = useWishlist();
  
  const { data: products, isLoading: isProductsLoading } = api.product.getProductsByIds.useQuery(
    { ids: wishlistItems },
    { enabled: wishlistItems.length > 0 }
  );

  const isLoading = isWishlistLoading || (wishlistItems.length > 0 && isProductsLoading);

  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-4">
      <div className="mx-auto xl:container">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-neutral-800">
          <FiHeart className="text-red-500 fill-red-500" />
          Sản phẩm yêu thích ({wishlistItems.length})
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : wishlistItems.length > 0 && products ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductItem key={product.id} {...(product as Product)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-100">
            <div className="bg-neutral-50 p-6 rounded-full mb-6">
              <FiHeart size={48} className="text-neutral-300" />
            </div>
            <p className="text-xl text-neutral-500 mb-8">Danh mục yêu thích trống</p>
            <Link 
              href="/products/camera" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-orange-200"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

WishlistPage.getLayout = (page: React.ReactElement) => (
  <PrimaryLayout seo={{ title: 'Danh sách yêu thích', description: 'Sản phẩm bạn đã yêu thích' }}>{page}</PrimaryLayout>
);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'wishlist'])),
  },
});

export default WishlistPage;
