
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { PrimaryLayout } from '@/layouts';
import { ReactElement } from 'react';
import { FiCheckCircle, FiShoppingBag, FiHome } from 'react-icons/fi';
import { NextPageWithLayout } from '../_app';

const OrderSuccessPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { orderId, resultCode, message } = router.query;
  const isSuccess = resultCode === '0' || resultCode === undefined; // Default to success if no code (COD)

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Đặt hàng thành công | KARA Shop</title>
      </Head>

      <div className="mx-auto w-full max-w-md text-center">
        {isSuccess ? (
            <>
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <FiCheckCircle size={48} />
                </div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">Đặt hàng thành công!</h1>
                <p className="mb-8 text-gray-500">
                  Cảm ơn bạn đã mua sắm tại KARA Shop. <br />
                  Mã đơn hàng của bạn là: <span className="font-bold text-zinc-900">#{orderId}</span>
                </p>
                <div className="space-y-3">
                    <Link 
                        href="/products/camera" 
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95"
                    >
                        <FiShoppingBag /> Tiếp tục mua sắm
                    </Link>
                    <Link 
                        href="/" 
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                    >
                        <FiHome /> Về trang chủ
                    </Link>
                </div>
            </>
        ) : (
             <>
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <FiCheckCircle size={48} className="rotate-45" /> 
                  {/* Using CheckCircle rotated as X or use another icon if available */}
                </div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">Thanh toán thất bại</h1>
                <p className="mb-8 text-gray-500">
                  Giao dịch không thành công. <br />
                  Lỗi: <span className="font-medium text-red-600">{message || 'Đã có lỗi xảy ra'}</span>
                </p>
                <div className="space-y-3">
                    <Link 
                        href="/cart" 
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95"
                    >
                         Quay lại giỏ hàng
                    </Link>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

OrderSuccessPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Đặt hàng thành công', description: 'Cảm ơn bạn đã mua hàng' }}>
      {page}
    </PrimaryLayout>
  );
};

export default OrderSuccessPage;
