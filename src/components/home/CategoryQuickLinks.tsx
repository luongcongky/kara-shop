import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  {
    name: 'Máy ảnh',
    slug: 'camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=256&auto=format&fit=crop',
  },
  {
    name: 'Ống kính',
    slug: 'lens',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=256&auto=format&fit=crop',
  },
  {
    name: 'Phụ kiện',
    slug: 'accessory',
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=256&auto=format&fit=crop',
  },
  {
    name: 'Flycam',
    slug: 'drone',
    image: 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=256&auto=format&fit=crop',
  },
  {
    name: 'Gimbal',
    slug: 'gimbal',
    image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=256&auto=format&fit=crop',
  },
  {
    name: 'Đèn Studio',
    slug: 'lighting',
    image: 'https://images.unsplash.com/photo-1590432135017-d1a153b6fa6c?q=80&w=256&auto=format&fit=crop',
  },
];

export const CategoryQuickLinks = () => {

  return (
    <section className="bg-zinc-50/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Khám phá theo danh mục</h2>
          <div className="mt-2 mx-auto h-1 w-20 rounded-full bg-orange-500"></div>
        </div>

        <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
          {CATEGORIES.map((cat, index) => (
            <Link 
              key={cat.slug} 
              href={`/products/${cat.slug}`}
              className="group flex flex-col items-center gap-4 text-center"
              data-aos="zoom-in"
              data-aos-delay={index * 50}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white bg-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-orange-500/20 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                <Image 
                  src={cat.image} 
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-orange-500/0 transition-colors group-hover:bg-orange-500/10" />
              </div>
              <span className="text-sm font-bold text-zinc-700 transition-colors group-hover:text-orange-600 sm:text-base">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
