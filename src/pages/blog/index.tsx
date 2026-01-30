import React, { useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { FiCalendar, FiArrowRight, FiSearch, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { ContextType } from '@prisma/client';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'blog'])),
    },
    revalidate: 60,
  };
};

const BlogList: NextPageWithLayout = () => {
  const { t } = useTranslation('blog');
  const [search, setSearch] = useState('');
  
  const { data: blogs, isLoading } = api.context.getAll.useQuery({
    type: ContextType.BLOG,
    status: 'published',
    search: search || undefined
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const heroBlog = blogs?.[0];
  const secondaryBlogs = blogs?.slice(1, 4) || [];
  const remainingBlogs = blogs?.slice(4) || [];

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      <div className="container mx-auto px-4 pt-12">
        <div className="rounded-[3rem] border border-zinc-200 bg-white p-8 lg:p-16 shadow-xl shadow-zinc-200/50">
          {blogs && blogs.length > 0 ? (
            <div className="space-y-12">
              {/* Top Section: Hero + Secondary Grid */}
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Feature Article (Hero) */}
                {heroBlog && (
                  <div className="lg:col-span-6">
                    <Link 
                      href={`/articles/${heroBlog.slug}`}
                      className="group block"
                    >
                      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-3xl bg-zinc-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-orange-500/10">
                        {heroBlog.thumbnail && (
                          <Image 
                            src={heroBlog.thumbnail} 
                            alt={heroBlog.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute left-4 top-4 rounded-full bg-orange-600/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                          {t('hero_tag')}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
                          <span className="flex items-center gap-1.5"><FiCalendar size={14} /> {new Date(heroBlog.updatedAt).toLocaleDateString('vi-VN')}</span>
                          <span className="h-3 w-px bg-zinc-200" />
                          <span className="font-semibold text-orange-600">{heroBlog.type}</span>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-orange-600 lg:text-3xl">
                          {heroBlog.title}
                        </h2>
                        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500 lg:text-base">
                          {heroBlog.content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 transition-all group-hover:gap-4 group-hover:text-orange-600">
                          {t('read_more')} <FiArrowRight className="text-orange-500" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Sidebar Secondary Stories */}
                <div className="space-y-8 lg:col-span-6 lg:border-l lg:border-zinc-100 lg:pl-12">
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-zinc-900">{t('latest_news')}</h3>
                    <div className="mt-2 h-1 w-12 rounded-full bg-orange-500" />
                  </div>
                  
                  {/* Search at Top of Sidebar */}
                  <div className="relative mb-10">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder={t('search_placeholder')}
                      className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-orange-500/5 shadow-inner"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-8">
                    {secondaryBlogs.map((item) => (
                      <Link key={item.id} href={`/articles/${item.slug}`} className="group flex gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                          {item.thumbnail && (
                            <Image 
                              src={item.thumbnail} 
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-center py-1">
                          <span className="mb-2 text-[11px] font-medium text-zinc-400">
                            {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                          <h4 className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug lg:text-lg">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main News Feed (Grid Style) */}
              <div className="border-t border-zinc-100 pt-16">
                <div className="mb-12 flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-zinc-900">{t('all_posts')}</h2>
                   <div className="h-px flex-1 bg-zinc-100 mx-8 hidden lg:block" />
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                  {remainingBlogs.map((blog) => (
                    <Link 
                      key={blog.id} 
                      href={`/articles/${blog.slug}`}
                      className="group"
                    >
                      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-3xl bg-zinc-50 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-zinc-200/50">
                        {blog.thumbnail && (
                          <Image 
                            src={blog.thumbnail} 
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute right-4 top-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-zinc-600">
                           {blog.type}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
                          <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(blog.updatedAt).toLocaleDateString('vi-VN')}</span>
                          <span className="text-zinc-200">•</span>
                          <span className="font-semibold text-zinc-500">{blog.author?.name || 'Admin'}</span>
                        </div>
                        <h3 className="text-lg font-bold leading-tight text-zinc-900 transition-colors group-hover:text-orange-600 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-zinc-500 leading-relaxed">
                          {blog.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-full bg-zinc-100 p-8 text-zinc-400">
                <FiMessageSquare size={64} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-zinc-900">{t('no_posts')}</h3>
              <p className="text-zinc-500 max-w-sm">
                Chúng tôi sẽ sớm đăng tải những bài viết thú vị. Hãy quay lại sau nhé!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BlogList.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Blog & Tin tức | KARRA',
        description: 'Tổng hợp các bài viết chia sẻ kiến thức, mẹo vặt và tin tức mới nhất từ KARRA shop',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default BlogList;
