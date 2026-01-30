import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { FiArrowLeft, FiTag } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale = 'vi', params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'article'])),
      slug: params?.slug as string,
    },
    revalidate: 60,
  };
};

const ArticleDetail: NextPageWithLayout<{ slug: string }> = ({ slug }) => {
  const { data: article, isLoading, isError } = api.context.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !article || article.status !== 'published') {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center px-4">
        <div className="h-24 w-24 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300">
          <FiTag size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Bài viết không tồn tại</h2>
          <p className="text-zinc-500 mt-2">Nội dung bạn đang tìm kiếm có thể đã bị xóa hoặc chưa được công khai.</p>
        </div>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:bg-orange-500 shadow-xl"
        >
          <FiArrowLeft />
          Quay lại trang chủ
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 lg:py-20">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Bordered Article Container */}
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm">
          <div className="p-6 lg:p-8 pb-0">
            {/* Subject (Title) - Moved to top, font-size +2 vs content (14px+2px=16px) */}
            <div className="flex justify-between items-baseline gap-4">
              <h1 className="text-[17px] font-bold leading-tight text-zinc-900 tracking-tight flex-1">
                {article.title}
              </h1>
              
              {/* Author and Date - Top right, italic, faded, no bold/caps */}
              <div className="text-right italic text-zinc-400 text-xs shrink-0">
                <span>{article.author?.name || 'Admin'}</span>
                <span className="mx-2">/</span>
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

          {/* Featured Image (Thumbnail) - Below Metadata */}
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
            {/* Main Content */}
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
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif !important;
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
        /* List and Indentation fixes */
        .preview-content ul, .preview-content ol {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
          padding-left: 1.5rem !important;
        }
        .preview-content li {
          margin-bottom: 0.25rem !important;
        }
        .preview-content ul[data-type="taskList"] { 
          list-style: none; 
          padding: 0 !important; 
          margin-left: 0 !important; 
        }
        .preview-content ul[data-type="taskList"] li { 
          display: flex; 
          align-items: flex-start; 
          gap: 0.75rem; 
          margin-bottom: 0.5rem !important; 
        }
        .preview-content ul[data-type="taskList"] input[type="checkbox"] { 
          margin-top: 0.25rem; 
          height: 1rem; 
          width: 1rem; 
          border-radius: 0.25rem; 
          accent-color: #f97316; 
        }
      `}</style>
    </div>
  );
};

ArticleDetail.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Bài viết | KARRA',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default ArticleDetail;
