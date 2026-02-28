import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import NextImage from 'next/image';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlus, FiCopy, FiSearch, FiChevronDown } from 'react-icons/fi';
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

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
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
              <th className="px-6 py-3">Hình ảnh</th>
              <th className="px-6 py-3">Tên sản phẩm</th>
              <th className="px-6 py-3">Danh mục</th>
              <th className="px-6 py-3">Giá</th>
              <th className="px-6 py-3">Giá gốc</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{product.id}</td>
                <td className="px-6 py-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-100 bg-white">
                    {product.images && product.images[0] ? (
                      <NextImage
                        src={product.images[0].imageURL}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px] text-gray-400">
                        No img
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                <td className="px-6 py-4">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                            group inline-flex items-center gap-1 rounded bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700 transition-colors hover:bg-violet-100 focus:outline-none
                            ${open ? 'bg-violet-100' : ''}
                          `}
                        >
                          <span>{product.types.length > 0 ? `${product.types.length} Danh mục` : 'Chọn danh mục'}</span>
                          <FiChevronDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                        </Popover.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-xl bg-white p-3 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="space-y-2">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Chọn danh mục</p>
                              <div className="max-h-60 overflow-y-auto pr-1">
                                {Object.values(CollectionType).map((type) => {
                                  const isSelected = product.types.includes(type);
                                  return (
                                    <label
                                      key={type}
                                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50"
                                    >
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                        checked={isSelected}
                                        onChange={() => {
                                          const newTypes = isSelected
                                            ? product.types.filter((t) => t !== type)
                                            : [...product.types, type];
                                          updateProduct.mutate({
                                            id: product.id,
                                            types: newTypes,
                                          });
                                        }}
                                      />
                                      <span className="text-sm text-gray-700">{type}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.types.slice(0, 2).map((type) => (
                      <span key={type} className="rounded bg-gray-50 px-1.5 py-0.5 text-[8px] font-medium text-gray-500">
                        {type}
                      </span>
                    ))}
                    {product.types.length > 2 && (
                      <span className="rounded bg-gray-50 px-1.5 py-0.5 text-[8px] font-medium text-gray-500">
                        +{product.types.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-zinc-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.price)}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {product.originalPrice ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.originalPrice) : '-'}
                </td>
                <td className="px-6 py-4">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={product.published}
                      onChange={(e) => {
                        updateProduct.mutate({
                          id: product.id,
                          published: e.target.checked,
                        });
                      }}
                      disabled={updateProduct.isLoading}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {product.published ? 'Published' : 'Rỗng'}
                    </span>
                  </label>
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
