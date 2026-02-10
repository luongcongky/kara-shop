import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { ContextType } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'next-i18next';

const slugToTypeMap: Record<string, ContextType> = {
  'about-me': ContextType.ABOUT_ME,
  'terms-of-use': ContextType.TERMS_OF_USE,
  'privacy-policy': ContextType.PRIVACY_POLICY,
  'how-it-works': ContextType.HOW_IT_WORKS,
  'contact-us': ContextType.CONTACT_US,
  'career': ContextType.JOB,
  '24h-service': ContextType.SERVICE_24H,
  'quick-chat': ContextType.QUICK_CHAT,
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(slugToTypeMap).map((slug) => ({ params: { type: slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale = 'vi', params }) => {
  const slug = params?.type as string;
  const type = slugToTypeMap[slug];
  
  if (!type) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'article'])),
      type,
    },
    revalidate: 60,
  };
};

const InfoPage: NextPageWithLayout<{ type: ContextType }> = ({ type }) => {
  const { t } = useTranslation('common');
  const { data: article, isLoading } = api.context.getLatestByType.useQuery(
    { type },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center bg-zinc-50/50 px-4 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-orange-50/50 shadow-sm border border-orange-100">
           <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500">
             <span className="text-2xl font-bold text-orange-500">!</span>
           </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
          {t('no_content_title')}
        </h1>
        <p className="mb-10 max-w-md text-[15px] leading-relaxed text-zinc-400">
          {t('no_content_desc')}
        </p>
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-2xl bg-zinc-900 px-10 py-5 font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-2xl hover:shadow-zinc-900/20 active:scale-95"
        >
          {t('back_to_home')}
          <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 lg:py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm">
          <div className="p-6 lg:p-8 pb-0">
            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4">
              <h1 className="text-[17px] font-bold leading-tight text-zinc-900 tracking-tight flex-1">
                {article.title}
              </h1>
              
              <div className="italic text-zinc-400 text-xs shrink-0 flex items-center gap-2">
                <span>Admin</span>
                <span>/</span>
                <span>
                  {new Date(article.updatedAt).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {article.thumbnail && (
            <div className="mt-4 relative aspect-[21/9] w-full border-y border-zinc-100 bg-zinc-50">
              <Image 
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8 lg:p-12 pt-8">
            <article 
              className="prose prose-zinc prose-lg lg:prose-xl max-w-none preview-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .preview-content.prose {
          --tw-prose-body: #3f3f46;
          --tw-prose-headings: #18181b;
          --tw-prose-bold: #18181b;
          --tw-prose-bullets: #d4d4d8;
          --tw-prose-counters: #d4d4d8;
          --tw-prose-quotes: #18181b;
          --tw-prose-captions: #71717a;
          --tw-prose-hr: #f4f4f5;
          color: #3f3f46;
          max-width: none;
        }
        .preview-content {
          font-family: ui-sans-serif, system-ui, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        .preview-content > * + * {
          margin-top: 0.75rem !important;
        }
        .preview-content p {
          margin-top: 0 !important;
          margin-bottom: 0.75rem !important;
          line-height: inherit;
        }
        .preview-content strong, .preview-content b {
          font-weight: 700 !important;
          color: #18181b;
        }
        .preview-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          color: #18181b;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .preview-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #18181b;
        }
        .preview-content img {
          border-radius: 1rem;
          margin: 1.5rem 0 !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        .preview-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding: 1rem 1.5rem;
          font-style: normal;
          color: #71717a;
          margin: 1.5rem 0 !important;
          background: #fafafa;
          border-radius: 0.5rem;
        }
        .preview-content ul, .preview-content ol {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
          padding-left: 1.5rem !important;
        }
        .preview-content li {
          margin-bottom: 0.25rem !important;
        }
      `}</style>
    </div>
  );
};

InfoPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Thông tin | KARRA',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default InfoPage;
