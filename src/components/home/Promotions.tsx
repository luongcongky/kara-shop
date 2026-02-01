import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

const PROMO_DATA = [
  {
    title: 'Bảo hành 24 tháng',
    subtitle: 'An tâm tuyệt đối',
    desc: 'Chính sách bảo hành mở rộng cho tất cả dòng máy Mirrorless.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
    link: '/warranty',
    badge: 'Chính hãng',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    title: 'Trả góp 0% lãi suất',
    subtitle: 'Sở hữu ngay',
    desc: 'Hỗ trợ trả góp qua thẻ tín dụng và công ty tài chính.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop',
    link: '/installments',
    badge: 'Tiết kiệm',
    color: 'from-orange-500 to-red-600',
  },
  {
    title: 'Vệ sinh máy miễn phí',
    subtitle: 'Dịch vụ chuyên nghiệp',
    desc: 'Tặng gói vệ sinh cảm biến và ống kính trọn đời.',
    image: 'https://images.unsplash.com/photo-1564466021183-59691557262a?q=80&w=800&auto=format&fit=crop',
    link: '/services',
    badge: 'Quà tặng',
    color: 'from-emerald-600 to-teal-700',
  },
];

export const Promotions = () => {

  return (
    <section className="bg-zinc-900 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center" data-aos="fade-up">
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-orange-500">Dịch vụ đặc biệt</span>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Ưu đãi độc quyền tại KARA</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PROMO_DATA.map((promo, index) => (
            <Link 
              key={index} 
              href={promo.link}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${promo.color} p-8 text-white shadow-2xl transition-all hover:-translate-y-2 hover:shadow-orange-500/10`}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Background Highlight */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-colors" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4">
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    {promo.badge}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">{promo.subtitle}</h4>
                  <h3 className="text-3xl font-bold leading-tight">{promo.title}</h3>
                </div>

                <p className="mb-8 flex-1 text-sm font-medium text-white/80 line-clamp-2">
                  {promo.desc}
                </p>

                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-black/20 shadow-inner">
                  <Image 
                    src={promo.image} 
                    alt={promo.title}
                    fill
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 text-xs font-bold">
                       Xem chi tiết <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
