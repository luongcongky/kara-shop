import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlus, FiCopy, FiSearch } from 'react-icons/fi';
import { CollectionType } from '@prisma/client';
import { useDebounce } from '@/hooks';

import { isAdmin } from '@/utils/session';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer'])),
    },
  };
};

const ProductManagement: NextPageWithLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const utils = api.useContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<CollectionType | ''>('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'true' | 'false'>('all');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: products, isLoading } = api.product.adminAll.useQuery(
    {
      search: debouncedSearch || undefined,
      type: selectedType || undefined,
      published: publishedFilter === 'all' ? undefined : publishedFilter === 'true',
    },
    {
      enabled: isAdmin(session),
    }
  );

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      alert('Đã xóa sản phẩm thành công');
      void utils.product.adminAll.invalidate();
    },
    onError: (error) => {
      alert('Lỗi: ' + error.message);
    },
  });

  const duplicateProduct = api.product.duplicate.useMutation({
    onSuccess: () => {
      alert('Đã nhân bản sản phẩm thành công');
      void utils.product.adminAll.invalidate();
    },
    onError: (error) => {
      alert('Lỗi: ' + error.message);
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/signin');
    } else if (status === 'authenticated' && !isAdmin(session)) {
      void router.push('/');
    }
  }, [session, status, router]);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      deleteProduct.mutate({ id });
    }
  };

  const handleDuplicate = (id: number, name: string) => {
    if (confirm(`Bạn có muốn nhân bản sản phẩm "${name}" không?`)) {
      duplicateProduct.mutate({ id });
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!isAdmin(session)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700"
        >
          <FiPlus /> Thêm sản phẩm
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as CollectionType | '')}
        >
          <option value="">Tất cả danh mục</option>
          {Object.values(CollectionType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'true' | 'false')}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="true">Published</option>
          <option value="false">Rỗng</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedType('');
            setPublishedFilter('all');
          }}
          className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Tên sản phẩm</th>
              <th className="px-6 py-3">Giá</th>
              <th className="px-6 py-3">Giá gốc</th>
              <th className="px-6 py-3">Đánh giá</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{product.id}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.price)}
                </td>
                <td className="px-6 py-4">
                  {product.originalPrice ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.originalPrice) : '-'}
                </td>
                <td className="px-6 py-4">{product.rate} ⭐</td>
                <td className="px-6 py-4">
                  {product.published ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Rỗng
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleDuplicate(product.id, product.name)}
                      className="text-violet-600 hover:text-violet-800"
                      title="Nhân bản"
                    >
                      <FiCopy size={18} />
                    </button>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ProductManagement.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Quản lý sản phẩm | Admin',
        description: 'Quản lý danh sách sản phẩm',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default ProductManagement;
