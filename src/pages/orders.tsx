import React, { useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { numberWithCommas } from '@/utils';
import { FiPackage, FiCalendar, FiDollarSign, FiMapPin, FiPhone, FiUser, FiShoppingBag, FiSearch, FiX, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import { NextPageWithLayout } from './_app';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PAID: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  PAID: 'Đã thanh toán',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
};

const statusIcons: Record<OrderStatus, string> = {
  PENDING: '⏳',
  PAID: '💳',
  SHIPPED: '🚚',
  DELIVERED: '✅',
  CANCELLED: '❌',
};

const OrdersPage: NextPageWithLayout = () => {
  const { status } = useSession();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, isLoading, refetch } = api.order.getMyOrders.useQuery(
    {
      status: selectedStatus,
      search: searchQuery || undefined,
      limit,
      offset,
    },
    {
      enabled: status === 'authenticated',
    }
  );

  // Manually define the order type since tRPC inference is missing the relation
  type OrderWithItems = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: OrderStatus;
    totalAmount: number;
    paymentMethod: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    payOSOrderCode: number | null;
    items: {
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        images: { imageURL: string }[];
      };
    }[];
  };

  const cancelOrderMutation = api.order.cancelOrder.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/orders');
    }
  }, [status, router]);

  // Reset offset when filters change
  React.useEffect(() => {
    setOffset(0);
  }, [selectedStatus, searchQuery]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      cancelOrderMutation.mutate({ orderId });
    }
  };

  const handleReorder = async () => {
    // This would add items back to cart
    // For now, we'll just show an alert
    alert('Tính năng đặt lại đơn hàng sẽ được cập nhật sớm!');
  };

  const clearFilters = () => {
    setSelectedStatus(undefined);
    setSearchQuery('');
    setOffset(0);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const hasActiveFilters = selectedStatus !== undefined || searchQuery !== '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Đơn hàng của tôi | TUNG Shop</title>
      </Head>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-violet-300'
              }`}
            >
              {statusIcons[status]} {statusLabels[status]}
            </button>
          ))}
          <button
            onClick={() => setSelectedStatus(undefined)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedStatus === undefined
                ? 'bg-violet-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-violet-300'
            }`}
          >
            Tất cả ({data?.total || 0})
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <FiX size={16} />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      {data && data.orders.length > 0 ? (
        <>
          <div className="space-y-6">
            {data.orders.map((order) => {
              const orderWithItems = order as unknown as OrderWithItems;
              return (
              <div key={orderWithItems.id} className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <FiPackage size={24} className="text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900">Đơn hàng #{order.id.slice(0, 8)}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar size={14} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-4 py-2 text-sm font-bold ${statusColors[order.status as OrderStatus]}`}>
                        {statusIcons[order.status as OrderStatus]} {statusLabels[order.status as OrderStatus]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 space-y-6">
                  {/* Shipping Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FiMapPin size={16} />
                        Thông tin giao hàng
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <FiUser size={14} className="mt-0.5 shrink-0" />
                          <span>{orderWithItems.shippingName}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FiPhone size={14} className="mt-0.5 shrink-0" />
                          <span>{orderWithItems.shippingPhone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FiMapPin size={14} className="mt-0.5 shrink-0" />
                          <span>{orderWithItems.shippingAddress}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FiDollarSign size={16} />
                        Thanh toán
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Phương thức:</span>{' '}
                          {orderWithItems.paymentMethod === 'COD' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-800">
                              💵 Tiền mặt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs font-bold text-pink-800">
                              💳 {orderWithItems.paymentMethod}
                            </span>
                          )}
                        </p>
                        <p className="text-lg">
                          <span className="font-medium">Tổng tiền:</span>{' '}
                          <span className="font-bold text-red-600">{numberWithCommas(Math.floor(orderWithItems.totalAmount))}đ</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <FiShoppingBag size={16} />
                      Sản phẩm ({orderWithItems.items.length})
                    </h4>
                    <div className="space-y-3">
                      {orderWithItems.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-sm">
                          {item.product.images[0] && (
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white p-1">
                              <Image
                                src={item.product.images[0].imageURL}
                                alt={item.product.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-zinc-900 line-clamp-2 mb-1">{item.product.name}</h5>
                            <p className="text-sm text-gray-600">
                              {numberWithCommas(Math.floor(item.price))}đ × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-red-600">{numberWithCommas(Math.floor(item.price * item.quantity))}đ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    {orderWithItems.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(orderWithItems.id)}
                        disabled={cancelOrderMutation.isLoading}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 border border-red-200 transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiXCircle size={16} />
                        Hủy đơn hàng
                      </button>
                    )}
                    {orderWithItems.status === 'DELIVERED' && (
                      <button
                        onClick={() => handleReorder()}
                        className="flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 text-sm font-bold text-violet-600 border border-violet-200 transition-all hover:bg-violet-100"
                      >
                        <FiRefreshCw size={16} />
                        Đặt lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data.total > limit && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="rounded-lg bg-white px-6 py-3 font-medium text-gray-700 border border-gray-200 transition-all hover:border-violet-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang trước
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Trang {Math.floor(offset / limit) + 1} / {Math.ceil(data.total / limit)}
              </span>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={!data.hasMore}
                className="rounded-lg bg-white px-6 py-3 font-medium text-gray-700 border border-gray-200 transition-all hover:border-violet-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white py-20 shadow-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <FiPackage size={48} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900">
            {hasActiveFilters ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng nào'}
          </h2>
          <p className="mb-8 text-gray-500">
            {hasActiveFilters ? 'Thử thay đổi bộ lọc hoặc tìm kiếm khác' : 'Bạn chưa đặt đơn hàng nào.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95"
            >
              Xóa bộ lọc
            </button>
          ) : (
            <Link href="/products/camera" className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95">
              Bắt đầu mua sắm
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Đơn hàng của tôi', description: 'Quản lý đơn hàng của bạn' }}>
      {page}
    </PrimaryLayout>
  );
};

export default OrdersPage;
