import type { NextPageWithLayout } from './_app';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FiAward, FiCompass, FiUsers, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'about'])),
    },
  };
};

const AboutUs: NextPageWithLayout = () => {
  const { t } = useTranslation('about');
  const router = useRouter();
  const { data: aboutMe, isLoading, isError } = api.context.getAboutMe.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-xl" />
      </div>
    );
  }

  if (isError || !aboutMe) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center px-4">
        <div className="h-24 w-24 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-400 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Thông tin đang được cập nhật</h2>
          <p className="text-zinc-500 max-w-md mx-auto line-height-relaxed">Chúng tôi đang chuẩn bị nội dung tốt nhất để giới thiệu với bạn. Vui lòng quay lại sau nhé!</p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="group mt-2 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-bold text-white transition-all hover:bg-orange-500 hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1"
        >
          Quay lại trang chủ
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sticky Back Button */}
      <Link 
        href="/"
        className="fixed top-1/2 -translate-y-1/2 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-white backdrop-blur-xl transition-all hover:bg-orange-500 hover:border-orange-500 hover:scale-110 shadow-2xl group"
        title="Quay lại"
      >
        <FiArrowLeft size={24} className="transition-transform group-hover:-translate-x-1" />
      </Link>

      {/* Premium Hero Header */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-zinc-950 py-16 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-orange-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <div 
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md mb-8"
              data-aos="fade-down"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                {t('heroBadge')}
              </span>
            </div>
            
            <h1 
              className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:leading-[1.1]"
              data-aos="zoom-out-up"
              data-aos-duration="1000"
            >
              {aboutMe.title}
            </h1>
            
            <div 
              className="mt-12 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
              data-aos="stretch-x" 
              data-aos-delay="400"
            />
          </div>
        </div>
      </section>

      {/* Brand Intro & Stats Section */}
      <section className="relative z-20 -mt-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Intro Card */}
            <div 
              className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 lg:p-16 shadow-2xl shadow-zinc-200/50 flex flex-col justify-center"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-6 leading-tight">
                {t('introTitle')}
              </h2>
              <p className="text-xl text-zinc-500 leading-relaxed font-medium">
                {t('introDesc')}
              </p>
            </div>

            {/* Quick Stats Column */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                { label: t('stats.products'), value: '500+', color: 'bg-orange-50 text-orange-600' },
                { label: t('stats.customers'), value: '10K+', color: 'bg-violet-50 text-violet-600' },
                { label: t('stats.years'), value: '05+', color: 'bg-emerald-50 text-emerald-600' }
              ].map((stat, idx) => (
                <div 
                  key={stat.label}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-zinc-200/30 flex flex-col items-center justify-center text-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
                  data-aos="fade-left"
                  data-aos-delay={300 + (idx * 100)}
                >
                  <span className={`mb-1 text-3xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</span>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Brand Story Section */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Left Column: Headline/Badge */}
            <div className="lg:w-1/3 shrink-0" data-aos="fade-up">
              <div className="sticky top-32">
                 <div className="inline-block py-1 border-b-4 border-orange-500 mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Our Story</span>
                 </div>
                 <h3 className="text-3xl font-bold text-zinc-900 leading-tight">Hành trình phát triển</h3>
                 <p className="mt-6 text-zinc-500 font-medium">Tìm hiểu thêm về cách chúng tôi xây dựng KARRA từ một ý tưởng nhỏ thành biểu tượng của sự tinh tế.</p>
              </div>
            </div>

            {/* Right Column: Dynamic Content Container */}
            <div className="lg:w-2/3">
              <div 
                className="prose prose-zinc prose-lg lg:prose-xl max-w-none preview-content brand-story-content" 
                data-aos="fade-up" 
                data-aos-delay="200"
                dangerouslySetInnerHTML={{ __html: aboutMe.content }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-zinc-900 text-white rounded-[3rem] lg:rounded-[5rem] mx-4 lg:mx-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
           <span className="text-[20vw] font-black text-white leading-none whitespace-nowrap">VALUES • VALUES • VALUES</span>
        </div>
        
        <div className="container relative z-10 mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-20 tracking-tight" data-aos="fade-up">
            {t('valuesTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: FiAward, title: t('values.qualityTitle'), desc: t('values.qualityDesc') },
              { icon: FiCompass, title: t('values.designTitle'), desc: t('values.designDesc') },
              { icon: FiUsers, title: t('values.communityTitle'), desc: t('values.communityDesc') }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center group"
                data-aos="fade-up"
                data-aos-delay={idx * 150}
              >
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-zinc-800 text-orange-500 shadow-2xl transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white group-hover:-rotate-12 group-hover:scale-110">
                  <item.icon size={40} strokeWidth={1.5} />
                </div>
                <h4 className="mb-4 text-2xl font-bold">{item.title}</h4>
                <p className="text-zinc-400 font-medium leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center">
        <h3 className="text-2xl font-bold text-zinc-900 mb-8" data-aos="fade-up">Bạn đã sẵn sàng nâng tầm trải nghiệm?</h3>
        <Link 
          href="/products/camera"
          className="inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-10 py-5 font-bold text-white shadow-2xl shadow-orange-500/40 transition-all hover:bg-orange-600 hover:-translate-y-1"
          data-aos="zoom-in"
        >
          Khám phá bộ sưu tập
          <FiArrowRight size={20} />
        </Link>
      </section>

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
          color: inherit;
        }
        .preview-content strong, .preview-content b {
          font-weight: 700 !important;
        }
        .preview-content {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif !important;
          font-size: 16px !important;
        }
        .preview-content p {
          margin-bottom: 2em;
          line-height: 2;
          color: inherit;
        }
        .preview-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          color: inherit;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .preview-content h3 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          color: inherit;
          letter-spacing: -0.01em;
        }
        .preview-content img {
          border-radius: 3rem;
          margin: 4rem 0;
          box-shadow: 0 40px 80px -20px rgb(0 0 0 / 0.2);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .preview-content img:hover {
          transform: scale(1.02);
        }
        .preview-content blockquote {
          border-left: 8px solid #f97316;
          padding: 2.5rem 3rem;
          background: white;
          border-radius: 0 2rem 2rem 0;
          font-style: italic;
          color: #18181b;
          font-weight: 500;
          box-shadow: 0 20px 40px -10px rgb(0 0 0 / 0.05);
          margin: 3rem 0;
        }
        
        /* Custom dynamic content tweaks */
        .brand-story-content {
          color: #3f3f46;
        }

        /* Task List styling */
        .preview-content ul[data-type="taskList"] { list-style: none; padding: 0; margin-left: 0; }
        .preview-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 1.25rem; margin-bottom: 1rem; }
        .preview-content ul[data-type="taskList"] input[type="checkbox"] { margin-top: 0.6rem; height: 1.4rem; width: 1.4rem; border-radius: 0.5rem; border-color: #d4d4d8; accent-color: #f97316; }

        /* Animation utilities */
        [data-aos="stretch-x"] {
          transform: scaleX(0);
          transition-property: transform;
        }
        [data-aos="stretch-x"].aos-animate {
          transform: scaleX(1);
        }
      `}</style>
    </div>
  );
};

AboutUs.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Về chúng tôi | KARRA',
        description: 'Đội ngũ KARRA - Crafting Quality Daily Essentials',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default AboutUs;
