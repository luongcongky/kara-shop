import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import Image from 'next/image';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import { isAdmin } from '@/utils/session';
import { ContextType } from '@prisma/client';
import dynamic from 'next/dynamic';
import { FiChevronLeft, FiSave, FiUpload, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import Script from 'next/script';

const Editor = dynamic(() => import('@/components/admin/Editor'), { ssr: false });

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'admin'])),
    },
  };
};

const NewContext: NextPageWithLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const utils = api.useUtils();
  
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    type: ContextType;
    content: string;
    thumbnail: string;
    status: string;
    metadata: string;
  }>({
    title: '',
    slug: '',
    type: ContextType.PROMOTION,
    content: '',
    thumbnail: '',
    status: 'draft',
    metadata: '{}',
  });


  const createMutation = api.context.create.useMutation({
    onSuccess: () => {
      alert('Tạo bài viết thành công');
      void utils.context.getAll.invalidate();
      void router.push('/admin/context');
    },
    onError: (error) => {
      alert('Lỗi: ' + error.message);
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/signin');
    } else if (status === 'authenticated' && !isAdmin(session)) {
      void router.push('/');
    }
  }, [session, status, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let metadataJson = {};
    try {
      metadataJson = JSON.parse(formData.metadata);
    } catch (e) {
      alert('Metadata phải là định dạng JSON hợp lệ');
      return;
    }

    createMutation.mutate({
      ...formData,
      metadata: metadataJson,
    });
  };

  const deleteImage = api.cloudinary.deleteImage.useMutation();

  const handleThumbnailUpload = () => {
    if (window.cloudinary) {
      window.cloudinary.openUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: 'kara-shop',
          sources: ['local', 'url'],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1.777,
          showSkipCropButton: false,
          clientAllowedFormats: ["png", "gif", "jpeg", "webp"],
          maxFileSize: 2000000,
          folder: 'kara-shop/articles',
        },
        async (error: Error | null, result: { event: string; info: { secure_url: string } }) => {
          if (!error && result && result.event === 'success') {
            const oldThumbnail = formData.thumbnail;
            const newThumbnail = result.info.secure_url;

            // Update local state first
            setFormData(prev => ({ ...prev, thumbnail: newThumbnail }));

            // If there was an old thumbnail, delete it from Cloudinary
            if (oldThumbnail && oldThumbnail !== newThumbnail) {
              try {
                await deleteImage.mutateAsync({ imageUrl: oldThumbnail });
              } catch (err) {
                console.error("Failed to delete old thumbnail:", err);
              }
            }
          }
        }
      );
    }
  };

  const handleRemoveThumbnail = async () => {
    if (formData.thumbnail) {
      if (confirm('Bạn có chắc chắn muốn xóa ảnh này không? Ảnh sẽ bị xóa vĩnh viễn khỏi Cloudinary.')) {
        try {
          await deleteImage.mutateAsync({ imageUrl: formData.thumbnail });
          setFormData(prev => ({ ...prev, thumbnail: '' }));
        } catch (err) {
          console.error("Failed to remove thumbnail:", err);
          alert("Lỗi khi xóa ảnh khỏi Cloudinary");
        }
      }
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!isAdmin(session)) {
    return null;
  }

  return (
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/context"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 shadow-sm"
            >
              <FiChevronLeft size={20} />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Tạo bài viết mới</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              <FiSave size={18} /> {createMutation.isLoading ? 'Đang lưu...' : 'Lưu bài viết'}
            </button>
          </div>
        </div>
        {/* Top Section: Basic Info & Actions */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-200/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-zinc-700">Tiêu đề bài viết</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 px-4 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm"
                placeholder="Nhập tiêu đề bài viết..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={generateSlug}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Phân loại</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 px-4 outline-none transition-all focus:border-orange-500 shadow-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ContextType })}
              >
                {Object.values(ContextType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Trạng thái</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 px-4 outline-none transition-all focus:border-orange-500 shadow-sm"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Bản nháp (Draft)</option>
                <option value="published">Công khai (Published)</option>
                <option value="archived">Lưu trữ (Archived)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-50 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Đường dẫn thân thiện (Slug)</label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 px-4 transition-all focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 shadow-sm">
                <span className="shrink-0 text-zinc-400">/articles/</span>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent outline-none text-zinc-900"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Section - Simplified */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-200/50">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleThumbnailUpload}
              className="group relative flex h-32 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-all hover:border-orange-500 hover:bg-orange-50"
            >
              {formData.thumbnail ? (
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <Image 
                    src={formData.thumbnail} 
                    alt="Thumbnail Preview" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <FiUpload className="text-white" size={24} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-orange-500">
                  <FiUpload size={32} />
                  <span className="text-xs font-bold uppercase tracking-wider">Upload Thumbnail</span>
                </div>
              )}
            </button>
            
            {formData.thumbnail && (
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Thumbnail URL</p>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
                  >
                    <FiTrash2 size={12} />
                    Xóa ảnh
                  </button>
                </div>
                <code className="text-[10px] text-zinc-500 break-all bg-zinc-50 p-2 rounded-lg border border-zinc-100 block">
                  {formData.thumbnail}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Simplified header */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <div className="min-h-[600px] shadow-2xl shadow-zinc-200/50 rounded-2xl border border-zinc-100">
              <Editor 
                content={formData.content} 
                onChange={(content) => setFormData({ ...formData, content })} 
              />
            </div>
          </div>
        </div>
      </form>

    </div>
  </>
  );
};

NewContext.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Thêm bài viết mới | Admin',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default NewContext;
