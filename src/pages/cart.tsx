import React from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { api } from '@/utils/api';
import { PrimaryLayout } from '@/layouts';
import { numberWithCommas } from '@/utils';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

const CartPage: NextPageWithLayout = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, isLoading: isCartLoading, clearCart } = useCart();
  const { status, data: session } = useSession();
  const router = useRouter();
  
  const [shippingName, setShippingName] = React.useState('');
  const [shippingPhone, setShippingPhone] = React.useState('');
  const [shippingAddress, setShippingAddress] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<'COD' | 'MOMO' | 'PAYOS'>('COD');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  // Pre-fill user data if available
  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name) setShippingName(session.user.name);
      // We don't have phone/address in user session by default, but if we did we would set it here
    }
  }, [session]);

  const createOrderMutation = api.order.create.useMutation({
    onSuccess: (data) => {
      clearCart();
      if (data.payUrl) {
         window.location.href = data.payUrl;
      } else {
         router.push(`/order/success?orderId=${data.orderId}`);
      }
    },
    onError: (error) => {
      setIsCheckingOut(false);
      alert(`Checkout failed: ${error.message}`);
    }
  });

  const handleCheckout = () => {
    if (status !== 'authenticated') {
      router.push('/signin?callbackUrl=/cart');
      return;
    }

    if (!shippingName || !shippingPhone || !shippingAddress) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setIsCheckingOut(true);
    createOrderMutation.mutate({
      shippingName,
      shippingPhone,
      shippingAddress,
      paymentMethod,
    });
  };

  if (isCartLoading && totalItems === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Giỏ hàng | KARA Shop</title>
      </Head>

      <div className="flex items-center gap-4 mb-10">
        <Link href="/products/camera" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200">
           <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Giỏ hàng của bạn</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white py-20 shadow-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-violet-50 text-violet-600">
             <FiShoppingBag size={48} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900">Giỏ hàng trống</h2>
          <p className="mb-8 text-gray-500">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link href="/products/camera" className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95">
             Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
               <div className="divide-y divide-gray-100">
                 {items.map((item) => (
                   <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-6 p-6 transition-colors hover:bg-zinc-50/50">
                      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2">
                         <Image 
                           src={item.product?.images[0]?.imageURL || '/camera-placeholder.png'} 
                           alt={item.product?.name || 'Product'} 
                           fill 
                           className="object-contain"
                           unoptimized
                         />
                      </div>
                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                        <div className="flex-1">
                          <Link href={`/product/${item.productId}/slug`} className="text-lg font-bold text-zinc-900 hover:text-violet-600 transition-colors line-clamp-2 leading-tight mb-1">
                             {item.product?.name}
                          </Link>
                          <p className="text-sm font-medium text-gray-500 line-clamp-1">
                             {item.product?.collections?.[0]?.collection?.name || 'Sản phẩm'}
                          </p>
                          <div className="mt-3 text-lg font-bold text-red-600">
                             {numberWithCommas(Math.floor(item.product?.price || 0))}đ
                          </div>
                        </div>

                        <div className="flex items-center gap-8 self-end sm:self-center">
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white p-1 shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold text-zinc-900 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.productId)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                            title="Xóa"
                          >
                             <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Shipping Info Form */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-sm">1</span>
                Thông tin giao hàng
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">Họ và tên</label>
                    <input 
                      type="text" 
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:border-violet-500 focus:bg-white focus:ring-violet-500"
                      placeholder="Nhập họ tên người nhận"
                    />
                 </div>
                 <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:border-violet-500 focus:bg-white focus:ring-violet-500"
                      placeholder="Nhập số điện thoại"
                    />
                 </div>
                 <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-gray-700">Địa chỉ nhận hàng</label>
                    <textarea 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:border-violet-500 focus:bg-white focus:ring-violet-500"
                      placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                    />
                 </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-4">
                 <Link href="/products/camera" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-2">
                    <FiArrowLeft /> Tiếp tục mua sắm
                 </Link>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
               <h3 className="text-xl font-bold text-zinc-900 mb-8 tracking-tight">Tổng cộng</h3>
               
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-medium">
                     <span>Tạm tính ({totalItems} món)</span>
                     <span>{numberWithCommas(Math.floor(totalPrice))}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium pb-4 border-b border-gray-100">
                     <span>Phí vận chuyển</span>
                     <span className="text-green-600 font-bold">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                     <span className="text-lg font-bold text-zinc-900">Thành tiền</span>
                     <div className="flex-col flex items-end">
                        <span className="text-3xl font-extrabold text-red-600 tracking-tight">
                           {numberWithCommas(Math.floor(totalPrice))}đ
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">(Đã bao gồm VAT)</p>
                     </div>
                  </div>
               </div>

               {/* Payment Method Selection */}
               <div className="mb-8 space-y-3">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xs">2</span>
                    Phương thức thanh toán
                  </h4>
                  
                  <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-600' : 'border-gray-200 hover:border-gray-300'}`}>
                     <input 
                       type="radio" 
                       name="paymentMethod" 
                       value="COD" 
                       checked={paymentMethod === 'COD'}
                       onChange={() => setPaymentMethod('COD')}
                       className="h-5 w-5 text-violet-600 border-gray-300 focus:ring-violet-600"
                     />
                     <div className="flex-1">
                        <span className="block font-bold text-zinc-900">Thanh toán khi nhận hàng (COD)</span>
                        <span className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi giao hàng</span>
                     </div>
                  </label>

                  <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === 'MOMO' ? 'border-pink-600 bg-pink-50/50 ring-1 ring-pink-600' : 'border-gray-200 hover:border-gray-300'}`}>
                     <input 
                       type="radio" 
                       name="paymentMethod" 
                       value="MOMO" 
                       checked={paymentMethod === 'MOMO'}
                       onChange={() => setPaymentMethod('MOMO')}
                       className="h-5 w-5 text-pink-600 border-gray-300 focus:ring-pink-600"
                     />
                     <div className="flex-1">
                        <span className="block font-bold text-zinc-900">Thanh toán qua Ví MoMo</span>
                        <span className="text-xs text-gray-500">Quét mã QR qua ứng dụng MoMo</span>
                     </div>
                     <div className="h-8 w-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        M
                     </div>
                  </label>

                  <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${paymentMethod === 'PAYOS' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
                     <input 
                       type="radio" 
                       name="paymentMethod" 
                       value="PAYOS" 
                       checked={paymentMethod === 'PAYOS'}
                       onChange={() => setPaymentMethod('PAYOS')}
                       className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-600"
                     />
                     <div className="flex-1">
                        <span className="block font-bold text-zinc-900">Thanh toán qua Timo / payOS</span>
                        <span className="text-xs text-gray-500">Chuyển khoản QR code nhanh chóng ({'>'} 2.000đ)</span>
                     </div>
                     <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        P
                     </div>
                  </label>
               </div>

               <button 
                 onClick={handleCheckout}
                 disabled={isCheckingOut || status === 'loading'}
                 className="w-full rounded-2xl bg-violet-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isCheckingOut ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    'ĐẶT HÀNG NGAY'
                  )}
               </button>
               
               {status !== 'authenticated' && (
                 <p className="mt-4 text-center text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                    * Bạn sẽ cần đăng nhập để hoàn tất thanh toán.
                 </p>
               )}

               <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium border-t border-gray-50 pt-6">
                     <span className="rounded-full bg-zinc-100 p-2">🛡️</span>
                     Thanh toán an toàn & bảo mật
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                     <span className="rounded-full bg-zinc-100 p-2">🚚</span>
                     Giao hàng nhanh toàn quốc
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CartPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Giỏ hàng', description: 'Giỏ hàng của bạn tại KARA Shop' }}>
      {page}
    </PrimaryLayout>
  );
};

export default CartPage;
