import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiCopy } from 'react-icons/fi';
import { isAdmin } from '@/utils/session';
import { ContextType } from '@prisma/client';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'header', 'footer', 'admin'])),
    },
  };
};

const ContextManagement: NextPageWithLayout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const utils = api.useContext();
  
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ContextType | undefined>(undefined);

  const { data: contexts, isLoading } = api.context.getAll.useQuery(
    { search, type: selectedType },
    { enabled: status === 'authenticated' && isAdmin(session) }
  );

  const deleteMutation = api.context.delete.useMutation({
    onSuccess: () => {
      alert('Đã xóa bài viết thành công');
      void utils.context.getAll.invalidate();
    },
    onError: (error) => {
      alert('Lỗi: ' + error.message);
    },
  });

  const duplicateMutation = api.context.duplicate.useMutation({
    onSuccess: () => {
      alert('Đã tạo bản sao bài viết thành công');
      void utils.context.getAll.invalidate();
    },
    onError: (error) => {
      alert('Lỗi khi tạo bản sao: ' + error.message);
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/signin');
    } else if (status === 'authenticated' && !isAdmin(session)) {
      void router.push('/');
    }
  }, [session, status, router]);

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicate = (id: number) => {
    duplicateMutation.mutate({ id });
  };

  if (status === 'loading' || isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!isAdmin(session)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Quản lý bài viết</h1>
        <Link
          href="/admin/context/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:-translate-y-0.5"
        >
          <FiPlus /> Thêm bài viết
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết (Tiêu đề, Slug)..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-12 pr-4 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm min-w-[180px]"
          value={selectedType || ''}
          onChange={(e) => setSelectedType(e.target.value ? (e.target.value as ContextType) : undefined)}
        >
          <option value="">Tất cả phân loại</option>
          {Object.values(ContextType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tiêu đề - Slug</th>
              <th className="px-6 py-4">Phân loại</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Người tạo</th>
              <th className="px-6 py-4">Ngày cập nhật</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {contexts?.map((item) => (
              <tr key={item.id} className="group transition-colors hover:bg-orange-50/30">
                <td className="px-6 py-5 text-sm font-medium text-zinc-400">{item.id}</td>
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">{item.title}</span>
                      <span className="text-xs text-zinc-400">{item.slug}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
                    item.status === 'published' ? 'bg-green-100 text-green-700' : 
                    item.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-zinc-600">
                  {item.author?.name || '---'}
                </td>
                <td className="px-6 py-5 text-sm text-zinc-500">
                   {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/context/${item.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-blue-600 transition-all hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm"
                      title="Sửa bài viết"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(item.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm"
                      title="Tạo bản sao"
                      disabled={duplicateMutation.isLoading}
                    >
                      <FiCopy size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-red-600 transition-all hover:bg-red-50 hover:border-red-200 hover:shadow-sm"
                      title="Xóa bài viết"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {contexts?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-2">
                      <div className="h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                         <FiSearch size={32} />
                      </div>
                      <p className="text-zinc-500 font-medium">Không tìm thấy bài viết nào.</p>
                      <Link href="/admin/context/new" className="text-orange-500 font-bold hover:underline">Tạo bài viết mới ngay</Link>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ContextManagement.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Quản lý bài viết | Admin',
        description: 'Quản lý bài viết, tin khuyến mãi, tuyển dụng',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default ContextManagement;
