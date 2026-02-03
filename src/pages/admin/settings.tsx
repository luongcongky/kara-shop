import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Script from 'next/script';
import { PrimaryLayout } from '@/layouts';
import { api } from '@/utils/api';
import { isAdmin } from '@/utils/session';
import { FiSave, FiUpload, FiTrash2, FiSettings, FiPhone, FiFacebook } from 'react-icons/fi';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer'])),
    },
  };
};

const AdminSettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [config, setConfig] = useState({
    SYSTEM_LOGO: '',
    SYSTEM_NAME: '',
    HOTLINE: '',
    SOCIAL_ZALO: '',
    SOCIAL_FACEBOOK: '',
  });

  const { data: existingConfig, isLoading, refetch } = api.systemConfig.getAll.useQuery();

  useEffect(() => {
    if (existingConfig) {
      setConfig((prev) => {
        const newConfig = { ...prev };
        existingConfig.forEach((item: { key: string; value: string }) => {
          if (Object.keys(newConfig).includes(item.key)) {
            newConfig[item.key as keyof typeof newConfig] = item.value;
          }
        });
        return newConfig;
      });
    }
  }, [existingConfig]);

  const updateMutation = api.systemConfig.updateMany.useMutation({
    onSuccess: () => {
      alert('Cập nhật cấu hình thành công!');
      refetch();
    },
    onError: (err) => {
      alert('Lỗi: ' + err.message);
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/signin');
    } else if (status === 'authenticated' && !isAdmin(session)) {
      void router.push('/');
    }
  }, [session, status, router]);

  const handleUpload = () => {
    if (!window.cloudinary) return;

    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'kara-shop',
        sources: ['local', 'url'],
        multiple: false,
        folder: 'kara-shop/system',
        cropping: true,
        croppingAspectRatio: 1.0,
        showSkipCropButton: false, 
      },
      (error: unknown, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result && result.event === 'success') {
          setConfig((prev) => ({ ...prev, SYSTEM_LOGO: result.info.secure_url }));
        }
      }
    );
  };

  const handleSave = () => {
    const dataToSave = Object.entries(config).map(([key, value]) => ({
      key,
      value,
    }));
    updateMutation.mutate(dataToSave);
  };

  if (status === 'loading' || isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!isAdmin(session)) return null;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <FiSettings className="text-violet-600" />
              Cấu hình hệ thống
            </h1>
            <button
              onClick={handleSave}
              disabled={updateMutation.isLoading}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-violet-700 hover:shadow-lg disabled:opacity-70"
            >
              <FiSave className="text-lg" />
              <span>{updateMutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        
        {/* Branding Section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="mb-6 text-xl font-bold text-gray-800 border-b pb-4">Thông tin thương hiệu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Logo Upload */}
            <div>
              <label className="mb-3 block text-sm font-bold text-gray-700">Logo cửa hàng</label>
              <div className="flex flex-col gap-4">
                <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                  {config.SYSTEM_LOGO ? (
                    <div className="relative h-full w-full p-4">
                        <Image
                        src={config.SYSTEM_LOGO}
                        alt="Shop Logo"
                        fill
                        className="object-contain"
                        />
                        <button
                          onClick={() => setConfig(prev => ({ ...prev, SYSTEM_LOGO: '' }))}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                        >
                          <FiTrash2 size={16} />
                        </button>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <FiSettings size={32} className="mb-2 opacity-50" />
                      <span className="text-sm">Chưa có logo</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleUpload}
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:text-violet-600 transition-all"
                >
                  <FiUpload />
                  {config.SYSTEM_LOGO ? 'Thay đổi Logo' : 'Tải lên Logo'}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">* Khuyên dùng ảnh PNG trong suốt, kích thước tối thiểu 200x200px</p>
            </div>

            {/* Shop Name */}
            <div>
              <label className="mb-3 block text-sm font-bold text-gray-700">Tên cửa hàng</label>
              <input
                type="text"
                value={config.SYSTEM_NAME}
                onChange={(e) => setConfig(prev => ({ ...prev, SYSTEM_NAME: e.target.value }))}
                placeholder="Ví dụ: KARA Shop"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <p className="mt-2 text-xs text-gray-500">* Tên này sẽ hiển thị ở tiêu đề trang và chân trang.</p>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="mb-6 text-xl font-bold text-gray-800 border-b pb-4">Thông tin liên hệ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hotline */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                <FiPhone /> Hotline
              </label>
              <input
                type="text"
                value={config.HOTLINE}
                onChange={(e) => setConfig(prev => ({ ...prev, HOTLINE: e.target.value }))}
                placeholder="0987..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Zalo */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-xs">Zalo</span> Số điện thoại Zalo
              </label>
              <input
                type="text"
                value={config.SOCIAL_ZALO}
                onChange={(e) => setConfig(prev => ({ ...prev, SOCIAL_ZALO: e.target.value }))}
                placeholder="0987..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
               <p className="mt-2 text-xs text-gray-500">* Dùng để tạo link chat Zalo (zalo.me/sdt).</p>
            </div>

            {/* Facebook */}
            <div className="md:col-span-2">
              <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                <FiFacebook className="text-blue-600" /> Facebook Page ID / Link
              </label>
              <input
                type="text"
                value={config.SOCIAL_FACEBOOK}
                onChange={(e) => setConfig(prev => ({ ...prev, SOCIAL_FACEBOOK: e.target.value }))}
                placeholder="Ví dụ: 1000..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <p className="mt-2 text-xs text-gray-500">* Dùng để tạo link chat Messenger (m.me/id).</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// @ts-expect-error - Next.js page layout pattern
AdminSettingsPage.getLayout = function getLayout(page) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Cấu hình hệ thống | Admin',
        canonical: '/admin/settings',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default AdminSettingsPage;
