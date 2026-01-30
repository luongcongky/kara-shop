import React from 'react';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { FiTag, FiCalendar, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { ContextType } from '@prisma/client';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'promotions'])),
    },
    revalidate: 60,
  };
};

const PromotionsList: NextPageWithLayout = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { data: promotions, isLoading } = api.context.getAll.useQuery({
    type: ContextType.PROMOTION,
    status: 'published',
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 py-10 text-white lg:py-16">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-600 blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-600 blur-[120px]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <span className="mb-2 inline-block text-[11px] font-semibold text-orange-500">
              Khuyến mãi đặc biệt
            </span>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ưu đãi hấp dẫn nhất dành cho bạn
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Khám phá các chương trình khuyến mãi đang diễn ra tại KARRA. Hãy đăng ký nhận bản tin để không bỏ lỡ bất kỳ cơ hội mua sắm giá hời nào.
            </p>
          </div>
        </div>
      </section>

      {/* Promotions Slider Section */}
      <section className="container mx-auto -mt-10 px-4">
        {promotions && promotions.length > 0 ? (
          <div className="group relative">
            {/* Navigation Buttons */}
            <div className="absolute -top-16 right-0 z-20 flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-lg transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-90"
                aria-label="Scroll left"
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-lg transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-90"
                aria-label="Scroll right"
              >
                <FiChevronRight size={20} />
              </button>
            </div>

            {/* Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="no-scrollbar flex gap-6 overflow-x-auto pb-8"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {promotions.map((promotion, index) => (
                <Link 
                  key={promotion.id} 
                  href={`/promotions/${promotion.slug}`}
                  className="group/card relative flex w-[85%] flex-none flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-zinc-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 sm:w-[45%] lg:w-[31%]"
                  style={{ scrollSnapAlign: 'start' }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {promotion.thumbnail ? (
                      <Image 
                        src={promotion.thumbnail} 
                        alt={promotion.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center text-zinc-300">
                        <FiTag size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover/card:opacity-100" />
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <div className="mb-4 flex items-center gap-3 text-xs font-semibold text-zinc-400">
                      <FiCalendar size={14} className="text-orange-500" />
                      {new Date(promotion.updatedAt).toLocaleDateString('vi-VN')}
                    </div>
                    <h2 className="mb-4 text-xl font-bold text-zinc-900 line-clamp-2 leading-tight group-hover/card:text-orange-600 transition-colors">
                      {promotion.title}
                    </h2>
                    <div className="mt-auto flex items-center gap-2 font-bold text-zinc-900 group-hover/card:gap-4 transition-all">
                      Xem chi tiết <FiArrowRight className="text-orange-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-zinc-100 p-8 text-zinc-400">
              <FiTag size={48} />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-zinc-900">Chưa có khuyến mãi nào</h3>
            <p className="text-zinc-500">Chúng tôi sẽ sớm cập nhật các chương trình ưu đãi mới nhất.</p>
          </div>
        )}
      </section>
    </div>
  );
};

PromotionsList.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Khuyến mãi | KARRA',
        description: 'Tổng hợp các chương trình khuyến mãi mới nhất từ KARRA shop',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default PromotionsList;
