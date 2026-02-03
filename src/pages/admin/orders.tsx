import React, { useState } from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { api } from '@/utils/api';
import { numberWithCommas } from '@/utils';
import { FiPackage, FiUser, FiCalendar, FiDollarSign, FiChevronDown, FiSettings } from 'react-icons/fi';
import { isAdmin } from '@/utils/session';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer'])),
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
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const AdminOrdersPage: NextPageWithLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading, refetch } = api.order.getAllOrders.useQuery(
    {
      status: selectedStatus,
      limit,
      offset,
    },
    {
      enabled: isAdmin(session),
    }
  );

  const updateStatusMutation = api.order.updateOrderStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (confirm(`Xác nhận thay đổi trạng thái đơn hàng thành "${statusLabels[newStatus]}"?`)) {
      updateStatusMutation.mutate({ orderId, status: newStatus });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/signin');
    } else if (status === 'authenticated' && !isAdmin(session)) {
      void router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!isAdmin(session)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
              <p className="text-gray-600">Xem và quản lý tất cả đơn hàng của khách hàng</p>
            </div>
            <Link
              href="/admin/homepage"
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg"
            >
              <FiPackage />
              <span>Quản lý Homepage</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-lg bg-zinc-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-zinc-700 hover:shadow-lg"
            >
              <FiSettings />
              <span>Cấu hình</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedStatus(undefined)}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedStatus === undefined
                ? 'bg-violet-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-violet-300'
            }`}
          >
            Tất cả ({data?.total || 0})
          </button>
          {(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-violet-300'
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
          </div>
        ) : data && data.orders.length > 0 ? (
          <div className="space-y-4">
            {data.orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">#{order.id.slice(0, 8)}</h3>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[order.status as OrderStatus]}`}>
                        {statusLabels[order.status as OrderStatus]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiUser size={16} />
                        <span>{order.user.name || order.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiDollarSign size={16} />
                        <span className="font-bold text-red-600">{numberWithCommas(Math.floor(order.totalAmount))}đ</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update Dropdown */}
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      disabled={updateStatusMutation.isLoading}
                      className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 transition-all hover:border-violet-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                    >
                      {(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 text-sm font-bold text-gray-700">Thông tin giao hàng</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Người nhận:</span> {order.shippingName}</p>
                    <p><span className="font-medium">SĐT:</span> {order.shippingPhone}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
                    <p><span className="font-medium">Thanh toán:</span> {order.paymentMethod === 'COD' ? 'Tiền mặt' : 'MoMo'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                    <FiPackage size={16} />
                    Sản phẩm ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-3">
                        {item.product.images[0] && (
                          <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={item.product.images[0].imageURL}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            {numberWithCommas(Math.floor(item.price))}đ × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{numberWithCommas(Math.floor(item.price * item.quantity))}đ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {data.total > limit && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 border border-gray-200 transition-all hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {Math.floor(offset / limit) + 1} / {Math.ceil(data.total / limit)}
                </span>
                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={!data.hasMore}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 border border-gray-200 transition-all hover:border-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
            <FiPackage size={64} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium text-gray-500">Không có đơn hàng nào</p>
          </div>
        )}
    </div>
  );
};

AdminOrdersPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Quản lý đơn hàng | Admin',
        description: 'Quản lý đơn hàng của khách hàng',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default AdminOrdersPage;
