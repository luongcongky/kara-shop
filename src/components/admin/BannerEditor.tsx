import { useState } from 'react';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiUpload, FiExternalLink } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { api } from '@/utils/api';
import { getCloudinaryUrl } from '@/utils/cloudinary';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface BannerEditorProps {
  editMode: boolean;
  onDataChange: () => void;
}

interface BannerFormData {
  id?: number;
  title: string;
  subtitle: string;
  discount: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
  productId?: number;
}

interface BannerSource {
  id: number;
  title: string;
  subtitle: string | null;
  discount: string | null;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
  productId: number | null;
}

export const BannerEditor = ({ editMode, onDataChange }: BannerEditorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerFormData | null>(null);
  const [localBanners, setLocalBanners] = useState<BannerSource[]>([]);

  const { data: products } = api.product.adminAll.useQuery();

  const { data: banners, isLoading, refetch } = api.banner.getAllAdmin.useQuery(
    { type: 'HERO' },
    {
      onSuccess: (data) => {
        setLocalBanners(data);
      },
    }
  );

  const createMutation = api.banner.create.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
      setShowModal(false);
      setEditingBanner(null);
    },
  });

  const updateMutation = api.banner.update.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
      setShowModal(false);
      setEditingBanner(null);
    },
  });

  const deleteMutation = api.banner.delete.useMutation({
    onSuccess: () => {
      refetch();
      onDataChange();
    },
  });
  
  const deleteCloudinaryImage = api.cloudinary.deleteImage.useMutation();
  const deleteCloudinaryFolder = api.cloudinary.deleteFolder.useMutation();

  const handleEdit = (banner: BannerSource) => {
    setEditingBanner({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle || '',
      discount: banner.discount || '',
      imageUrl: banner.imageUrl,
      bgColor: banner.bgColor,
      textColor: banner.textColor,
      buttonColor: banner.buttonColor,
      productId: banner.productId ?? undefined,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingBanner({
      title: '',
      subtitle: '',
      discount: '',
      imageUrl: '',
      bgColor: 'bg-zinc-900',
      textColor: 'text-white',
      buttonColor: 'bg-orange-500',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      const bannerToDelete = localBanners.find(b => b.id === id);
      if (bannerToDelete) {
        // Delete image first and wait
        if (bannerToDelete.imageUrl.includes('cloudinary.com')) {
          try {
            await deleteCloudinaryImage.mutateAsync({ imageUrl: bannerToDelete.imageUrl });
          } catch (err) {
            console.error("Failed to delete image:", err);
          }
        }
        
        // Then delete the folder
        const folderPath = `kara-shop/system/banners/${bannerToDelete.title.trim()}`;
        if (bannerToDelete.title.trim()) {
          try {
            await deleteCloudinaryFolder.mutateAsync({ folderPath });
          } catch (err) {
            console.error("Failed to delete folder:", err);
          }
        }
      }
      deleteMutation.mutate({ id });
    }
  };

  const handleUpload = () => {
    if (!window.cloudinary || !editingBanner) return;

    const folder = editingBanner.title.trim() 
      ? `kara-shop/system/banners/${editingBanner.title.trim()}`
      : 'kara-shop/system/banners/new';

    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'kara-shop',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        folder: folder,
        clientAllowedFormats: ["png", "gif", "jpeg", "webp"],
      },
      async (error: Error | null, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result && result.event === 'success') {
          const oldImageUrl = editingBanner.imageUrl;
          const newImageUrl = result.info.secure_url;

          setEditingBanner(prev => prev ? { ...prev, imageUrl: newImageUrl } : null);

          // Delete old image from Cloudinary if it's a Cloudinary URL
          if (oldImageUrl && oldImageUrl.includes('cloudinary.com') && oldImageUrl !== newImageUrl) {
            deleteCloudinaryImage.mutate({ imageUrl: oldImageUrl });
          }
        }
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (editingBanner.id) {
      updateMutation.mutate({ ...editingBanner, id: editingBanner.id });
    } else {
      createMutation.mutate({
        ...editingBanner,
        type: 'HERO',
        order: localBanners.length,
      });
    }
  };

  const displayBanners = localBanners.length > 0 ? localBanners : banners || [];

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center bg-zinc-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[600px] w-full overflow-hidden bg-white">
        {editMode && (
          <div className="absolute right-4 top-4 z-50">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-orange-600 transition-all"
            >
              <FiPlus />
              <span>Thêm Banner</span>
            </button>
          </div>
        )}

        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-orange-500',
          }}
          loop={true}
          className="h-full w-full"
        >
          {displayBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className={`relative h-full w-full overflow-hidden ${banner.bgColor}`}>
                {editMode && (
                  <div className="absolute left-4 top-4 z-50 flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-sm font-bold text-white shadow-lg hover:bg-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
                <div className={`absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl ${banner.textColor === 'text-white' ? 'bg-white/10' : 'bg-orange-500/10'}`} />
                <div className={`absolute -left-20 -bottom-20 h-96 w-96 rounded-full blur-3xl ${banner.textColor === 'text-white' ? 'bg-black/20' : 'bg-orange-500/5'}`} />

                <div className="mx-auto flex h-full max-w-7xl flex-col items-center px-4 md:flex-row md:px-12 lg:px-20 relative z-10">
                  <div className="z-10 flex flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
                    <span className="mb-6 inline-block rounded-full bg-gradient-to-r from-orange-600 to-orange-400 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] transition-all hover:scale-105">
                      <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      {banner.discount || 'New Arrival'}
                    </span>
                    <h2 className={`mb-4 text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-6xl ${banner.textColor}`}>
                      {banner.title}
                    </h2>
                    <p className={`mb-10 max-w-lg text-lg font-medium opacity-70 md:text-xl lg:text-2xl ${banner.textColor}`}>
                      {banner.subtitle}
                    </p>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center p-8 md:p-12 lg:p-16">
                    <div className={`absolute h-[60%] w-[60%] rounded-full opacity-20 blur-[100px] ${banner.textColor === 'text-white' ? 'bg-white' : 'bg-orange-500'}`} />
                    <Image
                      src={banner.imageUrl.startsWith('http') ? banner.imageUrl : getCloudinaryUrl(banner.imageUrl)}
                      alt={banner.title}
                      width={800}
                      height={800}
                      className="z-20 h-auto w-full max-w-[550px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                      priority
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-pagination-bullet {
            width: 40px;
            height: 4px;
            border-radius: 0;
            background: #ccc;
            opacity: 0.5;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}</style>
      </section>

      {/* Modal */}
      {showModal && editingBanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-zinc-900">
                {editingBanner.id ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
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
                  value={editingBanner.title}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
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
                  value={editingBanner.subtitle}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Badge/Discount
                </label>
                <input
                  type="text"
                  value={editingBanner.discount}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, discount: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  URL Hình ảnh
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingBanner.imageUrl}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, imageUrl: e.target.value })
                    }
                    className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="https://... hoặc /camera_sample.png"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-900 transition-all"
                  >
                    <FiUpload />
                    <span className="hidden sm:inline">Tải ảnh lên</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Sản phẩm liên kết (Product ID)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={editingBanner.productId || ''}
                      onChange={(e) =>
                        setEditingBanner({ ...editingBanner, productId: e.target.value ? Number(e.target.value) : undefined })
                      }
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none bg-white appearance-none"
                    >
                      <option value="">-- Không liên kết sản phẩm --</option>
                      {products?.map((product) => (
                        <option key={product.id} value={product.id}>
                          #{product.id} - {product.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-700">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  {editingBanner.productId && (
                    <button
                      type="button"
                      onClick={() => window.open(`/product/${editingBanner.productId}/slug`, '_blank')}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-all"
                      title="Xem chi tiết sản phẩm"
                    >
                      <FiExternalLink />
                      <span>Go</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Màu nền
                  </label>
                  <select
                    value={editingBanner.bgColor}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, bgColor: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="bg-zinc-900">Đen</option>
                    <option value="bg-white">Trắng</option>
                    <option value="bg-zinc-100">Xám nhạt</option>
                    <option value="bg-blue-900">Xanh đậm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Màu chữ
                  </label>
                  <select
                    value={editingBanner.textColor}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, textColor: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="text-white">Trắng</option>
                    <option value="text-black">Đen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Màu nút
                  </label>
                  <select
                    value={editingBanner.buttonColor}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, buttonColor: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="bg-orange-500">Cam</option>
                    <option value="bg-blue-600">Xanh</option>
                    <option value="bg-zinc-800">Xám đậm</option>
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
                  {editingBanner.id ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
