import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import Countdown from 'react-countdown';
import { api } from '@/utils/api';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import { numberWithCommas } from '@/utils';

interface FlashSaleEditorProps {
  editMode: boolean;
  onDataChange: () => void;
}

interface FlashSaleFormData {
  id?: number;
  productId: number;
  salePrice: number;
  totalSlots: number;
  soldSlots: number;
  endTime: string;
  badge?: string;
}

interface CountdownProps {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const CountdownRenderer = ({ hours, minutes, seconds, completed }: CountdownProps) => {
  if (completed) {
    return <span className="text-red-600 font-bold uppercase animate-pulse">Ended</span>;
  }
  return (
    <div className="flex gap-2">
      {[
        { label: 'H', value: hours },
        { label: 'M', value: minutes },
        { label: 'S', value: seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-900 font-mono text-xl font-bold text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            {String(item.value).padStart(2, '0')}
          </div>
        </div>
      ))}
    </div>
  );
};

export const FlashSaleEditor = ({ editMode, onDataChange }: FlashSaleEditorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSaleFormData | null>(null);
  const { t } = useTranslation('home');

  const { data: flashSales, isLoading, refetch } = api.flashSale.getAll.useQuery();
  const { data: products } = api.product.adminAll.useQuery();

  const createMutation = api.flashSale.create.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
      setShowModal(false);
      setEditingFlashSale(null);
    },
  });

  const updateMutation = api.flashSale.update.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
      setShowModal(false);
      setEditingFlashSale(null);
    },
  });

  const deleteMutation = api.flashSale.delete.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
    },
  });

  const handleEdit = (flashSale: {
    id: number;
    productId: number;
    salePrice: number;
    totalSlots: number;
    soldSlots: number;
    endTime: Date | string;
    badge?: string | null;
  }) => {
    setEditingFlashSale({
      id: flashSale.id,
      productId: flashSale.productId,
      salePrice: flashSale.salePrice,
      totalSlots: flashSale.totalSlots,
      soldSlots: flashSale.soldSlots,
      endTime: new Date(flashSale.endTime).toISOString().slice(0, 16),
      badge: flashSale.badge || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingFlashSale({
      productId: 0,
      salePrice: 0,
      totalSlots: 10,
      soldSlots: 0,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      badge: 'hot',
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa flash sale này?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlashSale || editingFlashSale.productId === 0) return;

    const data = {
      ...editingFlashSale,
      endTime: new Date(editingFlashSale.endTime),
    };

    if (editingFlashSale.id) {
      updateMutation.mutate({ ...data, id: editingFlashSale.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const targetDate = flashSales && flashSales.length > 0 && flashSales[0]?.endTime
    ? new Date(flashSales[0].endTime)
    : new Date(Date.now() + 1000 * 60 * 60 * 24);

  if (isLoading) {
    return (
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid h-96 place-items-center rounded-3xl bg-white border border-zinc-100">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!flashSales || flashSales.length === 0) {
    return (
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-zinc-500 mb-4">Chưa có Flash Sale nào</p>
            {editMode && (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600"
              >
                <FiPlus />
                <span>Thêm Flash Sale</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center justify-between border-b border-zinc-200 pb-8 md:flex-row">
            <div className="mb-4 flex items-center md:mb-0">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 animate-bounce">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl italic">
                  Flash Sale
                </h2>
                <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider leading-none">
                  Limit Time Offer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-zinc-100">
                <span className="text-sm font-bold text-zinc-500 uppercase">Kết thúc trong</span>
                <Countdown date={targetDate} renderer={CountdownRenderer} />
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
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {flashSales.map((fs) => (
              <div key={fs.id} className="group relative overflow-hidden rounded-[2.5rem] bg-white p-6 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 border border-zinc-100">
                {editMode && (
                  <div className="absolute right-4 top-4 z-50 flex gap-2">
                    <button
                      onClick={() => handleEdit(fs)}
                      className="flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(fs.id)}
                      className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-sm font-bold text-white shadow-lg hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {fs.badge && (
                  <div className="absolute left-0 top-6 z-20">
                    <div className="bg-zinc-900 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white rounded-r-full shadow-lg border-l-4 border-orange-500">
                      {t(`common.${fs.badge}`)}
                    </div>
                  </div>
                )}

                <div className="relative z-10 mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50/50 p-4 transition-transform group-hover:scale-105 duration-700">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-32 bg-orange-500/10 blur-[40px] rounded-full group-hover:bg-orange-500/20 transition-colors" />

                  <Image
                    src={fs.product.images[0]?.imageURL ? (fs.product.images[0].imageURL.startsWith('http') ? fs.product.images[0].imageURL : getCloudinaryUrl(fs.product.images[0].imageURL)) : '/placeholder.png'}
                    alt={fs.product.name}
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:-rotate-3"
                  />

                  <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden">
                    <div className="absolute right-[-17px] top-[14px] w-[70px] rotate-45 bg-orange-500 py-1 text-center text-[10px] font-bold text-white shadow-md uppercase">
                      -{Math.round(((fs.product.price - fs.salePrice) / fs.product.price) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-4">
                  <h3 className="line-clamp-1 text-lg font-bold text-zinc-900 transition-colors group-hover:text-orange-600">
                    {fs.product.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-zinc-900">{numberWithCommas(fs.salePrice)} đ</span>
                    <span className="text-xs font-semibold text-zinc-400 line-through decoration-orange-500/30">{numberWithCommas(fs.product.price)} đ</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                        Còn {fs.totalSlots - fs.soldSlots} sản phẩm
                      </div>
                      <span className="text-orange-600 italic">Hurry Up!</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.4)] relative overflow-hidden"
                        style={{ width: `${(fs.soldSlots / fs.totalSlots) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move-stripe_1s_linear_infinite]" />
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
      {showModal && editingFlashSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-zinc-900">
                {editingFlashSale.id ? 'Chỉnh sửa Flash Sale' : 'Thêm Flash Sale mới'}
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
                  Sản phẩm
                </label>
                <select
                  value={editingFlashSale.productId}
                  onChange={(e) =>
                    setEditingFlashSale({ ...editingFlashSale, productId: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value={0}>-- Chọn sản phẩm --</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {numberWithCommas(product.price)} đ
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Giá sale
                  </label>
                  <input
                    type="number"
                    value={editingFlashSale.salePrice}
                    onChange={(e) =>
                      setEditingFlashSale({ ...editingFlashSale, salePrice: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Badge
                  </label>
                  <select
                    value={editingFlashSale.badge}
                    onChange={(e) =>
                      setEditingFlashSale({ ...editingFlashSale, badge: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none bg-white"
                  >
                    <option value="">-- Không có badge --</option>
                    <option value="hot">HOT</option>
                    <option value="new">NEW</option>
                    <option value="sale">SALE</option>
                    <option value="newArrival">Hàng mới về</option>
                    <option value="bestSeller">Bán chạy nhất</option>
                    <option value="dealerPrice">Giá Đại lý</option>
                    <option value="journalistPrivilege">Độc quyền nhà báo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Tổng số slot
                  </label>
                  <input
                    type="number"
                    value={editingFlashSale.totalSlots}
                    onChange={(e) =>
                      setEditingFlashSale({ ...editingFlashSale, totalSlots: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Đã bán
                  </label>
                  <input
                    type="number"
                    value={editingFlashSale.soldSlots}
                    onChange={(e) =>
                      setEditingFlashSale({ ...editingFlashSale, soldSlots: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={editingFlashSale.endTime}
                  onChange={(e) =>
                    setEditingFlashSale({ ...editingFlashSale, endTime: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  required
                />
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
                  {editingFlashSale.id ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
