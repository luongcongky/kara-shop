import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PrimaryLayout } from '@/layouts';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { FiShoppingCart, FiPhone, FiCheckCircle, FiStar, FiChevronLeft, FiChevronRight, FiCheck, FiMinus, FiPlus } from 'react-icons/fi';
import clsx from 'clsx';
import { api } from '@/utils/api';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

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
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'reviews'>('info');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [quantity, setQuantity] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addItem } = useCart();

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
  const groupedSpecs = product.attributes?.reduce((acc, curr) => {
    const gName = (curr.groupName || "").trim();
    const groupName = gName || "Thông số đặc thù";
    
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push({ 
        label: curr.attributeName, 
        value: curr.attributeValue,
    });
    return acc;
  }, {} as Record<string, { label: string; value: string }[]>) || {};

  // Sort groups: Specific ones first, then others
  const groupOrder = ["Hình ảnh", "Quay phim", "Âm thanh", "Lấy nét", "Ánh sáng & Màn trập", "Màn hình", "Lưu trữ & Kết nối", "Đèn Flash", "Nguồn/Pin", "Vật lý"];
  const sortedGroupEntries = Object.entries(groupedSpecs).sort(([a], [b]) => {
    const indexA = groupOrder.indexOf(a);
    const indexB = groupOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const accessories = product.inclusions?.map((i) => i.itemName) || [];
  const reviews = product.reviews || [];

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
        const isCurrentlyExpanded = prev[group] !== false;
        return {
            ...prev,
            [group]: !isCurrentlyExpanded
        };
    });
  };

  const isGroupExpanded = (group: string) => expandedGroups[group] !== false; // Default to true if not set

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
        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            
            {/* Gallery Section */}
            <div className="lg:col-span-6 flex flex-col gap-6">
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

            {/* Product Info Section */}
            <div className="lg:col-span-6 flex flex-col gap-8">
                <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
                    <h1 className="text-2xl font-bold leading-tight text-zinc-900 tracking-tight">{product.name}</h1>
                    <div className="mt-4 flex items-center gap-4">
                         <div className="flex text-yellow-400">
                             {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < Math.floor(product.rate) ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4" />)}
                         </div>
                         <span className="text-sm font-medium text-gray-400">({reviews.length} reviews)</span>
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="flex items-center gap-3">
                                <span className="text-lg text-gray-400 line-through decoration-red-500/50">
                                    {formatCurrency(product.originalPrice)}
                                </span>
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                                    Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                            </div>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-red-600 tracking-tight">
                                {formatCurrency(product.price).replace('₫', '')}
                            </span>
                            <span className="text-2xl font-bold text-red-600 underline decoration-red-600/30">đ</span>
                        </div>
                    </div>

                    {/* Quantity Selector and Order Buttons */}
                    <div className="mt-8 flex flex-col gap-6">
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Số lượng:</span>
                            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-100 active:scale-95"
                                >
                                    <FiMinus />
                                </button>
                                <span className="w-12 text-center font-bold text-zinc-900">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-100 active:scale-95"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={() => addItem(product as unknown as Product, quantity)}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#d92d20] px-4 py-4 font-bold text-white transition-all hover:bg-red-700 hover:shadow-lg active:scale-95 text-sm"
                            >
                                <FiShoppingCart className="text-xl" /> THÊM VÀO GIỎ
                            </button>
                            <button 
                                onClick={() => {
                                    addItem(product as unknown as Product, quantity);
                                    router.push('/cart');
                                }}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d92d20] bg-white px-4 py-4 font-bold text-[#d92d20] transition-all hover:bg-red-50 active:scale-95 text-sm"
                            >
                                MUA NGAY
                            </button>
                        </div>
                        <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-blue-600 bg-[#f0f7ff] px-4 py-4 font-bold text-blue-700 transition-all hover:bg-blue-100 active:scale-95 text-sm">
                            <FiPhone className="text-xl" /> LIÊN HỆ GIÁ ĐẠI LÝ
                        </button>
                    </div>
                </div>

                {/* Warranty & Inclusions */}
                <div className="rounded-3xl border border-blue-100 bg-[#f0f7ff] px-8 py-6 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-blue-100/50 pb-4 mb-5">
                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                             <FiCheckCircle className="text-2xl" />
                         </div>
                         <div>
                             <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Cam kết</span>
                             <span className="text-base font-bold text-blue-900 leading-none">Bảo hành chính hãng 24 tháng</span>
                         </div>
                    </div>
                    {accessories.length > 0 && (
                        <div>
                            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-4">🎁 Trong hộp gồm:</h4>
                            <ul className="grid grid-cols-1 gap-3">
                                 {accessories.map((item, i) => (
                                     <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                         <FiCheck className="text-blue-500 shrink-0" />
                                         {item}
                                     </li>
                                 ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="mt-16">
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mb-8 space-x-8">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={clsx(
                        "pb-4 text-lg font-bold transition-all relative",
                        activeTab === 'info' ? "text-red-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Thông tin sản phẩm
                    {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full" />}
                </button>
                <button 
                    onClick={() => setActiveTab('specs')}
                    className={clsx(
                        "pb-4 text-lg font-bold transition-all relative",
                        activeTab === 'specs' ? "text-red-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Thông số kỹ thuật
                    {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full" />}
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={clsx(
                        "pb-4 text-lg font-bold transition-all relative",
                        activeTab === 'reviews' ? "text-red-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Kinh nghiệm từ khách hàng
                    {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full" />}
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm min-h-[400px]">
                {activeTab === 'info' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                )}
                {activeTab === 'specs' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col gap-8">
                            {sortedGroupEntries.map(([group, attributes], idx) => {
                                const expanded = isGroupExpanded(group);
                                return (
                                    <div key={idx} className="group/section overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                        {/* Category Header */}
                                        <button 
                                            onClick={() => toggleGroup(group)}
                                            className="flex w-full items-center justify-between px-8 py-5 text-left transition-colors hover:bg-zinc-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-6 w-1 rounded-full bg-red-600" />
                                                <h4 className="text-lg font-bold text-zinc-900 tracking-tight">{group}</h4>
                                            </div>
                                            <div className={clsx(
                                                "transform transition-transform duration-300",
                                                expanded ? "rotate-180" : "rotate-0"
                                            )}>
                                                <FiChevronRight className="text-xl text-zinc-400 rotate-90" />
                                            </div>
                                        </button>
                                        
                                        {/* Attributes List */}
                                        <div className={clsx(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                                        )}>
                                            <div className="divide-y divide-gray-100 border-t border-gray-50">
                                                {attributes.map((attr, i) => (
                                                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 group/row">
                                                        <dt className="md:col-span-4 bg-zinc-50/50 px-8 py-5 border-r border-gray-50 text-[15px] font-bold text-zinc-600 flex items-center transition-colors group-hover/row:text-zinc-700">
                                                            {attr.label}
                                                        </dt>
                                                        <dd className="md:col-span-8 px-8 py-5 text-[15px] font-semibold text-zinc-900 leading-relaxed whitespace-pre-line bg-white">
                                                            {attr.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {reviews.length > 0 ? reviews.map((review, i) => (
                                 <div key={i} className="flex gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                                     <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-inner border-2 border-zinc-100 font-bold text-xl text-red-600">
                                         {review.userName?.charAt(0).toUpperCase()}
                                     </div>
                                     <div className="flex-1">
                                         <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-gray-900 text-lg">{review.userName}</h4>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-white px-2 py-1 rounded-md border">{new Date(review.createdAt).toLocaleDateString()}</span>
                                         </div>
                                         <div className="mb-4 flex text-yellow-500">
                                             {[...Array(5)].map((_, s) => <FiStar key={s} fill={s < review.rating ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4" />)}
                                         </div>
                                         <p className="text-gray-700 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                                     </div>
                                 </div>
                             )) : (
                                <div className="col-span-1 md:col-span-2 py-16 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                                    <p className="text-zinc-400 italic font-bold">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.</p>
                                </div>
                             )}
                         </div>
                    </div>
                )}
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
