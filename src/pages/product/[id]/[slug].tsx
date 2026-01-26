import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PrimaryLayout } from '@/layouts';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { FiShoppingCart, FiPhone, FiCheckCircle, FiStar, FiChevronLeft, FiChevronRight, FiPlus, FiMinus } from 'react-icons/fi';
import clsx from 'clsx';
import { api } from '@/utils/api';

export const getServerSideProps: GetServerSideProps = async ({ locale = 'en', query }) => {
  return {
    props: {
        id: parseInt(query.id as string),
      ...(await serverSideTranslations(locale)),
    },
  };
};

const ProductDetail: NextPageWithLayout<{ id: number }> = ({ id }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [isWarrantyExpanded, setIsWarrantyExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading } = api.product.getById.useQuery({ id });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  if (isLoading) return (
      <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
  );

  if (!product) return <div className="text-center py-20 font-bold text-xl">Sản phẩm không tồn tại (ID: {id})</div>;

  const images = product.images || [];
  const specs = product.attributes?.map((a) => ({ 
    label: a.attributeName, 
    value: a.attributeValue 
  })) || [];
  const accessories = product.inclusions?.map((i) => i.itemName) || [];
  const reviews = product.reviews || [];

  const scrollThumbnails = (direction: 'left' | 'right') => {
    let nextIndex = selectedImage;
    if (direction === 'left') {
        nextIndex = Math.max(0, selectedImage - 1);
    } else {
        nextIndex = Math.min(images.length - 1, selectedImage + 1);
    }

    if (nextIndex !== selectedImage) {
        setSelectedImage(nextIndex);
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const thumbnailWidth = 80 + 16;
            container.scrollTo({
                left: nextIndex * thumbnailWidth - (container.offsetWidth / 2) + (thumbnailWidth / 2),
                behavior: 'smooth'
            });
        }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Unified 2nd Grid for Detail Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start relative">
            
            {/* Left Column: Gallery & Description (Balanced to 6/12) */}
            <div className="lg:col-span-6 flex flex-col gap-16">
                {/* Gallery Rail */}
                <div className="flex flex-col gap-6">
                    <div className="relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm" style={{ aspectRatio: '1 / 1' }}>
                        <div 
                            className="flex h-full w-full transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${selectedImage * 100}%)` }}
                        >
                            {images.map((img, idx) => (
                                <div key={idx} className="relative h-full w-full flex-shrink-0">
                                    <Image src={img.imageURL} alt={`${product.name} ${idx}`} fill className="object-contain p-8" priority={idx === 0} unoptimized />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnails row */}
                    <div className="relative flex items-center group px-1">
                        <button onClick={() => scrollThumbnails('left')} className="absolute -left-2 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 group-hover:flex">
                            <FiChevronLeft className="text-lg text-gray-600" />
                        </button>
                        <div ref={scrollContainerRef} className="no-scrollbar flex flex-nowrap gap-3 overflow-x-auto scroll-smooth py-1">
                            {images.map((img, idx) => (
                                <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 ${selectedImage === idx ? 'border-orange-500 ring-4 ring-orange-100' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <Image src={img.imageURL} alt={`thumb ${idx}`} fill className="object-contain p-2" unoptimized />
                                </button>
                            ))}
                        </div>
                        <button onClick={() => scrollThumbnails('right')} className="absolute -right-2 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 group-hover:flex">
                            <FiChevronRight className="text-lg text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Long Description */}
                <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
                    <h2 className="mb-8 text-2xl font-bold text-zinc-900 border-b pb-5 tracking-tight px-2">Chi tiết sản phẩm</h2>
                    <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed px-2" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
            </div>

            {/* Right Column: Info, Warranty, and Sticky Specs (Balanced to 6/12) */}
            <div className="lg:col-span-6 flex flex-col gap-8">
                {/* Info Card */}
                <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
                    <h1 className="text-2xl font-bold leading-tight text-zinc-900 tracking-tight">{product.name}</h1>
                    <div className="mt-4 flex items-center gap-4">
                         <div className="flex text-yellow-400">
                             {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < Math.floor(product.rate) ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4" />)}
                         </div>
                         <span className="text-sm font-medium text-gray-400">({reviews.length} reviews)</span>
                    </div>
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-red-600 tracking-tight">{formatCurrency(product.price).replace('₫', '')}</span>
                        <span className="text-2xl font-bold text-red-600 underline">đ</span>
                    </div>
                    {/* Buttons in a single row */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#d92d20] px-4 py-4 font-bold tracking-wide text-white transition-all hover:bg-red-700 hover:shadow-lg active:scale-95 uppercase text-sm">
                            <FiShoppingCart className="text-xl" /> MUA NGAY
                        </button>
                        <button className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-blue-600 bg-[#f0f7ff] px-4 py-4 font-bold tracking-wide text-blue-700 transition-all hover:bg-blue-100 active:scale-95 uppercase text-sm">
                            <FiPhone className="text-xl" /> LIÊN HỆ GIÁ ĐẠI LÝ
                        </button>
                    </div>
                </div>

                {/* Warranty & Accessories Card */}
                <div className={clsx(
                    "rounded-3xl border px-8 py-5 shadow-sm transition-all duration-500",
                    isWarrantyExpanded ? "bg-white border-blue-200 ring-4 ring-blue-50/50" : "bg-[#f0f7ff] border-blue-100"
                )}>
                    <div className="flex items-center justify-between gap-4 border-b border-blue-100/50 pb-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <FiCheckCircle className="text-xl" />
                            </div>
                            <span className="text-sm font-bold text-blue-900 uppercase tracking-wider">Bảo hành chính hãng 24 tháng</span>
                        </div>
                        <button 
                            onClick={() => setIsWarrantyExpanded(!isWarrantyExpanded)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-red-600 transition-all shadow-md transform hover:scale-110 active:scale-90"
                            title={isWarrantyExpanded ? "Collapse" : "Extend"}
                        >
                            {isWarrantyExpanded ? <FiMinus className="text-lg" /> : <FiPlus className="text-lg" />}
                        </button>
                    </div>
                    {isWarrantyExpanded && accessories.length > 0 && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h4 className="text-sm font-bold text-gray-700 mb-4 tracking-tight">🎁 Trong hộp gồm:</h4>
                            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                 {accessories.map((item, i) => (
                                     <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                                         <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                         {item}
                                     </li>
                                 ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Technical Specs Card (Sticky Behavior) */}
                <div className="sticky top-24 mt-8">
                    <div className={clsx(
                        "rounded-3xl px-8 py-5 shadow-sm transition-all duration-700 border",
                        isSpecsExpanded ? "bg-white border-zinc-200 ring-4 ring-zinc-50/50" : "bg-white border-gray-100"
                    )}>
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Thông số kỹ thuật</h3>
                            <button 
                                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-red-600 transition-all shadow-md transform hover:scale-110 active:scale-90"
                                title={isSpecsExpanded ? "Collapse" : "Extend"}
                            >
                                {isSpecsExpanded ? <FiMinus className="text-lg" /> : <FiPlus className="text-lg" />}
                            </button>
                        </div>
                        <dl className="space-y-5 flex flex-col">
                            {isSpecsExpanded && specs.map((spec, i) => (
                                <div key={i} className="flex flex-col border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-3">{spec.label}</dt>
                                    <dd className="text-sm font-semibold text-zinc-800 leading-snug">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        {/* Reviews Section at the very bottom */}
        <div className="mt-20 rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
             <h2 className="mb-10 text-3xl font-bold text-zinc-900 border-b pb-6 tracking-tight">Kinh nghiệm từ khách hàng</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {reviews.length > 0 ? reviews.map((review, i) => (
                     <div key={i} className="flex gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-inner border-2 border-zinc-100 font-black text-xl text-red-600">
                             {review.userName?.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 text-lg">{review.userName}</h4>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border">{new Date(review.createdAt).toLocaleDateString()}</span>
                             </div>
                             <div className="mb-4 flex text-yellow-500">
                                 {[...Array(5)].map((_, s) => <FiStar key={s} fill={s < review.rating ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4" />)}
                             </div>
                             <p className="text-gray-700 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                         </div>
                     </div>
                 )) : <div className="col-span-2 py-16 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200"><p className="text-zinc-400 italic font-bold">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.</p></div>}
             </div>
        </div>
    </div>
  );
};

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Chi tiết sản phẩm', description: 'Trang chi tiết sản phẩm' }}>
      {page}
    </PrimaryLayout>
  );
};

export default ProductDetail;
