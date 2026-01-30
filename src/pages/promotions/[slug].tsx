import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { FiCalendar, FiUser, FiArrowLeft, FiTag } from 'react-icons/fi';
import Link from 'next/link';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale = 'vi', params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'promotions'])),
      slug: params?.slug as string,
    },
    revalidate: 60,
  };
};

const PromotionDetail: NextPageWithLayout<{ slug: string }> = ({ slug }) => {
  const { data: promotion, isLoading, isError } = api.context.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !promotion || promotion.status !== 'published' || promotion.type !== 'PROMOTION') {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center px-4">
        <div className="h-24 w-24 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300">
          <FiTag size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Khuyến mãi không tồn tại</h2>
          <p className="text-zinc-500 mt-2">Chương trình khuyến mãi bạn đang tìm kiếm có thể đã kết thúc hoặc không tồn tại.</p>
        </div>
        <Link 
          href="/promotions"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:bg-orange-500 shadow-xl"
        >
          <FiArrowLeft />
          Xem các khuyến mãi khác
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Back Button */}
      <Link 
        href="/promotions"
        className="fixed top-1/2 -translate-y-1/2 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-white backdrop-blur-xl transition-all hover:bg-orange-500 hover:border-orange-500 hover:scale-110 shadow-2xl group"
        title="Quay lại"
      >
        <FiArrowLeft size={24} className="transition-transform group-hover:-translate-x-1" />
      </Link>

      {/* Dynamic Header Section */}
      <section className="relative bg-zinc-950 py-12 text-white lg:py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-6 text-xs font-black uppercase tracking-[0.2em] text-orange-500">
              <span className="rounded-full bg-orange-500/10 px-3 py-1 border border-orange-500/20">
                {promotion.type}
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                <FiCalendar className="text-orange-500" />
                {new Date(promotion.updatedAt).toLocaleDateString('vi-VN')}
              </div>
              {promotion.author?.name && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <FiUser className="text-orange-500" />
                  {promotion.author.name}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl tracking-tight">
              {promotion.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4">
        <article 
          className="prose prose-zinc prose-lg lg:prose-xl max-w-none py-10 lg:py-16 preview-content"
          dangerouslySetInnerHTML={{ __html: promotion.content }}
        />
      </div>

      <style jsx global>{`
        .preview-content.prose {
          --tw-prose-body: currentColor;
          --tw-prose-headings: currentColor;
          --tw-prose-bold: currentColor;
          --tw-prose-bullets: currentColor;
          --tw-prose-counters: currentColor;
          --tw-prose-quotes: currentColor;
          --tw-prose-captions: currentColor;
          --tw-prose-hr: currentColor;
          color: #27272a;
        }
        .preview-content strong, .preview-content b {
          font-weight: 700 !important;
        }
        .preview-content {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif !important;
          font-size: 18px !important;
        }
        .preview-content p, .preview-content li, .preview-content div {
          margin-top: 0 !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.4 !important;
          color: inherit;
        }
        .preview-content > * + * {
          margin-top: 0.75rem;
        }
        .preview-content h2, .preview-content h3, .preview-content h4 {
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.2 !important;
        }
        .preview-content ul, .preview-content ol {
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
        }
        .preview-content h2 {
          font-size: 2.25rem;
          font-weight: 900;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          color: #18181b;
          letter-spacing: -0.04em;
          line-height: 1.2;
        }
        .preview-content h3 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          color: #18181b;
        }
        .preview-content img {
          border-radius: 2rem;
          margin: 4rem 0;
          box-shadow: 0 30px 60px -15px rgb(0 0 0 / 0.15);
        }
        .preview-content blockquote {
          border-left: 6px solid #f97316;
          padding: 2rem 2.5rem;
          background: #fafafa;
          border-radius: 0 1.5rem 1.5rem 0;
          font-style: italic;
          color: #3f3f36;
          margin: 3rem 0;
        }
        /* Task List styling */
        .preview-content ul[data-type="taskList"] { list-style: none; padding: 0; margin-left: 0; }
        .preview-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem; }
        .preview-content ul[data-type="taskList"] input[type="checkbox"] { margin-top: 0.5rem; height: 1.25rem; width: 1.25rem; border-radius: 0.375rem; border-color: #d4d4d8; accent-color: #f97316; }
      `}</style>
    </div>
  );
};

PromotionDetail.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Chi tiết khuyến mãi | KARRA',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default PromotionDetail;
