import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
// import { api } from '@/utils/api'; // api was unused
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FiSave, FiEdit2, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { BannerEditor } from '@/components/admin/BannerEditor';
import { FlashSaleEditor } from '@/components/admin/FlashSaleEditor';
import { PromotionEditor } from '@/components/admin/PromotionEditor';
import { Commitments } from '@/components';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'home'])),
    },
  };
};

const AdminHomepage: NextPageWithLayout = () => {
  const [hasChanges, setHasChanges] = useState(false);
  const [editMode, setEditMode] = useState({
    banner: false,
    flashSale: false,
    promotion: false,
  });

  const handleSaveAll = async () => {
    // This will be handled by individual editor components
    setHasChanges(false);
    alert('Tất cả thay đổi đã được lưu thành công!');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
      {/* Admin Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Edit Mode Toggles */}
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, banner: !prev.banner }))
                }
                className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[10px] md:px-4 md:text-xs font-bold transition-all ${
                  editMode.banner
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <FiEdit2 />
                <span className="truncate">Banner</span>
              </button>
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, flashSale: !prev.flashSale }))
                }
                className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[10px] md:px-4 md:text-xs font-bold transition-all ${
                  editMode.flashSale
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <FiEdit2 />
                <span className="truncate">Flash Sale</span>
              </button>
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, promotion: !prev.promotion }))
                }
                className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[10px] md:px-4 md:text-xs font-bold transition-all ${
                  editMode.promotion
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <FiEdit2 />
                <span className="truncate">Ưu đãi</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveAll}
                disabled={!hasChanges}
                className={`flex items-center justify-center gap-2 rounded-lg p-2 md:px-6 md:py-3 text-xs md:text-sm font-bold text-white transition-all ${
                  hasChanges
                    ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
                    : 'bg-zinc-300 cursor-not-allowed'
                }`}
                title="Lưu tất cả"
              >
                <FiSave className="text-base md:text-lg" />
                <span className="hidden md:inline">Lưu tất cả</span>
              </button>
              <Link
                href="/admin/settings"
                className="flex items-center justify-center gap-2 rounded-lg bg-zinc-600 p-2 md:px-4 md:py-3 text-xs md:text-sm font-bold text-white transition-all hover:bg-zinc-700 hover:shadow-lg"
                title="Cấu hình"
              >
                <FiSettings className="text-base md:text-lg" />
                <span className="hidden md:inline">Cấu hình</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex flex-col">
        {/* 1. Banner Section */}
        <BannerEditor
          editMode={editMode.banner}
          onDataChange={() => setHasChanges(true)}
        />

        {/* 2. Commitments (không chỉnh sửa) */}
        <Commitments />

        {/* 3. Flash Sale Section */}
        <div className="bg-zinc-100/50">
          <FlashSaleEditor
            editMode={editMode.flashSale}
            onDataChange={() => setHasChanges(true)}
          />
        </div>

        {/* 4. Promotions Section */}
        <PromotionEditor
          editMode={editMode.promotion}
          onDataChange={() => setHasChanges(true)}
        />
      </div>
    </div>
  );
};

AdminHomepage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Quản lý Homepage | Admin',
        canonical: '/admin/homepage',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default AdminHomepage;
