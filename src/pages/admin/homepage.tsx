import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
// import { api } from '@/utils/api'; // api was unused
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FiSave, FiEdit2 } from 'react-icons/fi';
// import Link from 'next/link';
import { BannerEditor } from '@/components/admin/BannerEditor';
import { FlashSaleEditor } from '@/components/admin/FlashSaleEditor';
import { PromotionEditor } from '@/components/admin/PromotionEditor';
import { Commitments } from '@/components';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer'])),
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
      {/* Admin Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Edit Mode Toggles */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, banner: !prev.banner }))
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  editMode.banner
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <FiEdit2 />
                <span>Chỉnh sửa Banner</span>
              </button>
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, flashSale: !prev.flashSale }))
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  editMode.flashSale
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <FiEdit2 />
                <span>Chỉnh sửa Flash Sale</span>
              </button>
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, promotion: !prev.promotion }))
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  editMode.promotion
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <FiEdit2 />
                <span>Chỉnh sửa Ưu đãi</span>
              </button>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={!hasChanges}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-all ${
                hasChanges
                  ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
                  : 'bg-zinc-300 cursor-not-allowed'
              }`}
            >
              <FiSave className="text-lg" />
              <span>Lưu tất cả thay đổi</span>
            </button>
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
