import { useState } from 'react';
import Image from 'next/image';
import { FiArrowRight, FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { api } from '@/utils/api';

interface PromotionEditorProps {
  editMode: boolean;
  onDataChange: () => void;
}

interface PromotionFormData {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  badge: string;
  color: string;
}

export const PromotionEditor = ({ editMode, onDataChange }: PromotionEditorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionFormData | null>(null);

  const { data: promotions, isLoading, refetch } = api.promotion.getAllAdmin.useQuery();
  const { data: contexts } = api.context.getAll.useQuery({});

  const createMutation = api.promotion.create.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
      setShowModal(false);
      setEditingPromotion(null);
    },
  });

  const updateMutation = api.promotion.update.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
      setShowModal(false);
      setEditingPromotion(null);
    },
  });

  const deleteMutation = api.promotion.delete.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
    },
  });

  const handleEdit = (promotion: PromotionFormData) => {
    setEditingPromotion({
      id: promotion.id,
      title: promotion.title,
      subtitle: promotion.subtitle,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      linkUrl: promotion.linkUrl,
      badge: promotion.badge,
      color: promotion.color,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingPromotion({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      badge: '',
      color: 'from-blue-600 to-indigo-700',
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa ưu đãi này?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotion) return;

    if (editingPromotion.id) {
      updateMutation.mutate({ ...editingPromotion, id: editingPromotion.id });
    } else {
      createMutation.mutate({
        ...editingPromotion,
        order: promotions?.length || 0,
      });
    }
  };

  const displayPromotions = promotions || [];

  if (isLoading) {
    return (
      <section className="bg-zinc-900 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid h-96 place-items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-zinc-900 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div className="text-center flex-1">
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-orange-500">
                Dịch vụ đặc biệt
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                Ưu đãi độc quyền tại KARA
              </h2>
            </div>
            {editMode && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-orange-600"
              >
                <FiPlus />
                <span>Thêm</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {displayPromotions.map((promo) => (
              <div
                key={promo.id}
                className={`group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${promo.color} p-8 text-white shadow-2xl transition-all hover:-translate-y-2 hover:shadow-orange-500/10`}
              >
                {editMode && (
                  <div className="absolute right-4 top-4 z-50 flex gap-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-sm font-bold text-white shadow-lg hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-colors" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4">
                    <span className="rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                      {promo.badge}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
                      {promo.subtitle}
                    </h4>
                    <h3 className="text-3xl font-bold leading-tight">{promo.title}</h3>
                  </div>

                  <p className="mb-8 flex-1 text-sm font-medium text-white/80 line-clamp-2">
                    {promo.description}
                  </p>

                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-black/20 shadow-inner">
                    <Image
                      src={promo.imageUrl}
                      alt={promo.title}
                      fill
                      className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        Xem chi tiết <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && editingPromotion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-zinc-900">
                {editingPromotion.id ? 'Chỉnh sửa Ưu đãi' : 'Thêm Ưu đãi mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 hover:bg-zinc-100"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={editingPromotion.title}
                  onChange={(e) =>
                    setEditingPromotion({ ...editingPromotion, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Phụ đề
                </label>
                <input
                  type="text"
                  value={editingPromotion.subtitle}
                  onChange={(e) =>
                    setEditingPromotion({ ...editingPromotion, subtitle: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editingPromotion.description}
                  onChange={(e) =>
                    setEditingPromotion({ ...editingPromotion, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              {/* Hidden Image URL Input - Auto populated */}
              <input type="hidden" value={editingPromotion.imageUrl} />

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Liên kết bài viết (Tự động lấy ảnh thumbnail)
                </label>
                <select
                  value={editingPromotion.linkUrl}
                  onChange={(e) => {
                    const selectedLink = e.target.value;
                    const selectedContext = contexts?.find(c => `/articles/${c.slug}` === selectedLink);
                    
                    setEditingPromotion({ 
                      ...editingPromotion, 
                      linkUrl: selectedLink,
                      imageUrl: selectedContext?.thumbnail || editingPromotion.imageUrl
                    });
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">-- Chọn bài viết --</option>
                  {contexts?.map((ctx) => (
                    <option key={ctx.id} value={`/articles/${ctx.slug}`}>
                      {ctx.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={editingPromotion.badge}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, badge: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="Chính hãng, Tiết kiệm..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Màu gradient
                  </label>
                  <select
                    value={editingPromotion.color}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, color: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="from-blue-600 to-indigo-700">Xanh dương</option>
                    <option value="from-orange-500 to-red-600">Cam đỏ</option>
                    <option value="from-emerald-600 to-teal-700">Xanh lá</option>
                    <option value="from-purple-600 to-pink-600">Tím hồng</option>
                    <option value="from-yellow-500 to-orange-600">Vàng cam</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
                >
                  {editingPromotion.id ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
