import React from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { numberWithCommas } from '@/utils';
import { FiPackage, FiCalendar, FiDollarSign, FiMapPin, FiPhone, FiUser, FiShoppingBag } from 'react-icons/fi';
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
  const { data: orders, isLoading } = api.order.getMyOrders.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=/orders');
    }
  }, [status, router]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Đơn hàng của tôi | KARA Shop</title>
      </Head>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
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
                        <span>{order.shippingName}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiPhone size={14} className="mt-0.5 shrink-0" />
                        <span>{order.shippingPhone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiMapPin size={14} className="mt-0.5 shrink-0" />
                        <span>{order.shippingAddress}</span>
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
                        {order.paymentMethod === 'COD' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-800">
                            💵 Tiền mặt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs font-bold text-pink-800">
                            💳 MoMo
                          </span>
                        )}
                      </p>
                      <p className="text-lg">
                        <span className="font-medium">Tổng tiền:</span>{' '}
                        <span className="font-bold text-red-600">{numberWithCommas(Math.floor(order.totalAmount))}đ</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <FiShoppingBag size={16} />
                    Sản phẩm ({order.items.length})
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white py-20 shadow-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <FiPackage size={48} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900">Chưa có đơn hàng nào</h2>
          <p className="mb-8 text-gray-500">Bạn chưa đặt đơn hàng nào.</p>
          <Link href="/products/camera" className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95">
            Bắt đầu mua sắm
          </Link>
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
