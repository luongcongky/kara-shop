import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { api } from '@/utils/api';
import { numberWithCommas } from '@/utils';
import { getCloudinaryUrl } from '@/utils/cloudinary';

export const FeaturedProductGrid = () => {
  const { data: products, isLoading } = api.product.all.useQuery({ types: 'CAMERA' });

  if (isLoading || !products) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col items-end justify-between border-b border-zinc-100 pb-10 md:flex-row">
          <div className="mb-6 md:mb-0">
             <span className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-orange-500">Bộ sưu tập nổi bật</span>
             <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl italic">Bắt trọn khoảnh khắc</h2>
          </div>
          <Link href="/products/camera" className="group flex items-center gap-2 text-sm font-bold text-zinc-400 transition-colors hover:text-orange-500">
            Xem tất cả sản phẩm <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Featured Block */}
          <div 
            className="group relative h-[400px] overflow-hidden rounded-[2.5rem] bg-zinc-900 lg:col-span-12 lg:h-[500px]"
            data-aos="fade-up"
          >
            <Image 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop" 
              alt="Featured Lifestyle"
              fill
              className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center md:items-start md:text-left">
              <div className="max-w-xl">
                 <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">Hot Release 2026</span>
                 <h3 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">Sáng tạo không giới hạn với Sony Alpha</h3>
                 <p className="mb-10 text-lg font-medium text-white/70">Dòng máy ảnh Mirrorless chuyên nghiệp với khả năng lấy nét ánh mắt thời gian thực và quay video 4K HDR.</p>
                 <Link 
                  href="/products/camera/sony-alpha" 
                  className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-sm font-bold text-black transition-all hover:bg-orange-500 hover:text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                 >
                   Khám phá ngay <FiArrowRight />
                 </Link>
              </div>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-12 lg:grid-cols-4 mt-6">
             {products.products.slice(0, 4).map((product, idx) => (
                <div 
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-100 bg-white p-4 transition-all hover:shadow-2xl hover:shadow-zinc-200/50"
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                >
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-zinc-50 p-6">
                    <Image 
                      src={product.images[0]?.imageURL ? (product.images[0].imageURL.startsWith('http') ? product.images[0].imageURL : getCloudinaryUrl(product.images[0].imageURL)) : '/camera-placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="mb-2 line-clamp-1 text-sm font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-red-600">{numberWithCommas(Math.floor(product.price))}đ</span>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white transition-all hover:bg-orange-500 active:scale-90">
                       <FiShoppingCart size={18} />
                    </button>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};
