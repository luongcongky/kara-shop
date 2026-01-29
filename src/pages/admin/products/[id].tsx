import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import { CollectionType, ProductColor } from '@prisma/client';
import Image from 'next/image';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/admin/Editor'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">Đang tải trình soạn thảo...</div>
});
import { FiUpload, FiPlus, FiTrash2, FiCheck, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { isAdmin } from '@/utils/session';



export const getServerSideProps: GetServerSideProps = async ({ params, locale = 'en' }) => {
  return {
    props: {
        id: params?.id || null,
        ...(await serverSideTranslations(locale, ['common', 'header', 'footer'])),
    },
  };
};

const STEPS = [
  'Thông tin cơ bản',
  'Hình ảnh sản phẩm',
  'Bảo hành & Phụ kiện',
  'Mô tả sản phẩm',
  'Thông số kỹ thuật'
];

const COLOR_LABELS: Record<string, string> = {
  BLACK: 'Đen',
  WHITE: 'Trắng',
  GRAY: 'Xám'
};

const NewProduct: NextPageWithLayout<{ id: string }> = ({ id: propId }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const idFromQuery = router.query.id as string | undefined;
  const id = propId || idFromQuery;
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(0);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepsContainerRef.current) {
      const activeStep = stepsContainerRef.current.children[currentStep] as HTMLElement;
      if (activeStep) {
        activeStep.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentStep]);

  const scrollSteps = (direction: 'left' | 'right') => {
    if (stepsContainerRef.current) {
      const scrollAmount = 200;
      stepsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  // Attribute group management
  const [attributeGroups, setAttributeGroups] = useState<string[]>(['Hiệu năng', 'Màn hình', 'Kết nối', 'Pin & Sạc', 'Thiết kế']);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState('');
  
  // Staging for new attribute
  const [tempAttributeName, setTempAttributeName] = useState('');
  const [tempAttributeValue, setTempAttributeValue] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    rate: 5,
    published: false,
    types: [] as CollectionType[],
    colors: [] as ProductColor[],
    collectionIds: [] as number[],
    images: [] as { imageURL: string; imageBlur: string }[],
    inclusions: [] as { itemName: string }[],
    attributes: [] as { attributeName: string; attributeValue: string; groupName?: string }[],
  });

  const { data: collections } = api.collection.all.useQuery();
  const { data: productData, isLoading: isLoadingProduct } = api.product.getById.useQuery(
    { id: Number(id) },
    { enabled: isEdit && !!id }
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/signin');
    } else if (status === 'authenticated' && !isAdmin(session)) {
      void router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (isEdit && productData && !isDataInitialized) {
      console.log('[DEBUG] productData received:', productData);
      
      // Extract unique groups from existing attributes
      const existingGroups = productData.attributes
        .map(attr => attr.groupName)
        .filter((g): g is string => !!g && g.trim() !== '');
      const uniqueGroups = Array.from(new Set(existingGroups));
      
      // Merge with default groups
      setAttributeGroups(prev => {
        const merged = new Set([...prev, ...uniqueGroups]);
        return Array.from(merged);
      });

      // Collapse all existing groups by default
      setCollapsedGroups(new Set(uniqueGroups));
      
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice || 0,
        rate: productData.rate,
        published: productData.published,
        types: (productData.types as CollectionType[]) || [],
        colors: (productData.colors as ProductColor[]) || [],
        collectionIds: productData.collections.map((c) => c.collectionId),
        images: productData.images.map(img => ({ 
          imageURL: img.imageURL, 
          imageBlur: img.imageBlur 
        })),
        inclusions: productData.inclusions.map(inc => ({ itemName: inc.itemName })),
        attributes: productData.attributes.map(attr => ({
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue,
          groupName: attr.groupName || undefined
        })),
      });
      setIsDataInitialized(true);
    }
  }, [isEdit, productData, isDataInitialized]);

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      alert('Tạo sản phẩm thành công!');
      void router.push('/admin/products');
    },
    onError: (err) => alert('Lỗi: ' + err.message),
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      alert('Cập nhật sản phẩm thành công!');
      void router.push('/admin/products');
    },
    onError: (err) => alert('Lỗi: ' + err.message),
  });

  const deleteImage = api.cloudinary.deleteImage.useMutation();
  const deleteImageRecord = api.product.deleteImageRecord.useMutation();
  const addImageRecord = api.product.addImageRecord.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateProduct.mutate({ id: Number(id), ...formData });
    } else {
      createProduct.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'originalPrice' || name === 'rate') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiselect = (name: keyof typeof formData, value: string | number) => {
    setFormData((prev) => {
      const current = prev[name] as (string | number)[];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((i) => i !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleUpload = () => {
    if (window.cloudinary) {
      window.cloudinary.openUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: 'kara-shop',
          sources: ['local', 'url', 'camera'],
          multiple: true,
          folder: `kara-shop/products/${id}`,
        },
        (error: unknown, result: { event: string; info: { secure_url: string } }) => {
          if (!error && result && result.event === 'success') {
            const newImage = {
                imageURL: result.info.secure_url,
                imageBlur: '',
            };

            // Sync with DB immediately if in edit mode
            if (isEdit && id) {
              void addImageRecord.mutate({
                productId: Number(id),
                imageURL: newImage.imageURL,
                imageBlur: newImage.imageBlur,
              });
            }

            setFormData(prev => ({
              ...prev,
              images: [...prev.images, newImage],
            }));
          }
        }
      );
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index]?.imageURL;
    if (!imageUrl) return;

    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xoá hình ảnh này? Hành động này sẽ xoá file vĩnh viễn trên Cloudinary.'
    );

    if (!confirmed) return;

    try {
      // Delete from Cloudinary
      await deleteImage.mutateAsync({ imageUrl });
      
      // Delete from Database
      await deleteImageRecord.mutateAsync({ imageUrl });
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Có lỗi xảy ra khi xoá hình ảnh trên Cloudinary.');
    }
  };

  const addInclusion = () => {
    setFormData(prev => ({
      ...prev,
      inclusions: [{ itemName: '' }, ...prev.inclusions]
    }));
  };

  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...formData.inclusions];
    newInclusions[index]!.itemName = value;
    setFormData(prev => ({ ...prev, inclusions: newInclusions }));
  };

  const removeInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const addAttribute = (groupName: string) => {
    if (!groupName) return alert('Vui lòng chọn nhóm tính năng');
    if (!tempAttributeName.trim()) return alert('Vui lòng nhập tên thông số');
    if (!tempAttributeValue.trim()) return alert('Vui lòng nhập giá trị');

    setFormData(prev => ({
      ...prev,
      attributes: [{ 
        attributeName: tempAttributeName.trim(), 
        attributeValue: tempAttributeValue.trim(), 
        groupName 
      }, ...prev.attributes]
    }));

    // Clear temp fields
    setTempAttributeName('');
    setTempAttributeValue('');
  };

  const updateAttribute = (index: number, field: keyof typeof formData.attributes[0], value: string) => {
    const newAttributes = [...formData.attributes];
    const attr = newAttributes[index];
    if (attr) {
      if (field === 'attributeName') attr.attributeName = value;
      else if (field === 'attributeValue') attr.attributeValue = value;
      else if (field === 'groupName') {
        attr.groupName = value;
        // Add new group to list if it doesn't exist
        if (value && !attributeGroups.includes(value)) {
          setAttributeGroups(prev => [...prev, value]);
        }
      }
    }
    setFormData(prev => ({ ...prev, attributes: newAttributes }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };
  
  const moveAllAttributesToGroup = (fromGroup: string | undefined, toGroup: string) => {
    if (!toGroup || fromGroup === toGroup) return;
    
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map(attr => 
        (attr.groupName === fromGroup || (!attr.groupName && !fromGroup)) 
          ? { ...attr, groupName: toGroup } 
          : attr
      )
    }));
  };
  
  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };
  
  const handleGroupChange = (value: string) => {
    if (value === 'ADD_NEW_GROUP') {
      const newName = window.prompt('Nhập tên nhóm tính năng mới:');
      if (newName && newName.trim()) {
        const trimmedName = newName.trim();
        if (!attributeGroups.includes(trimmedName)) {
          setAttributeGroups(prev => [...prev, trimmedName]);
        }
        setSelectedGroup(trimmedName);
        
        // Auto-expand
        setCollapsedGroups(prev => {
          const newSet = new Set(prev);
          newSet.delete(trimmedName);
          return newSet;
        });
      } else {
        // If cancelled or empty, default to first item if available
        if (attributeGroups.length > 0) {
          setSelectedGroup(attributeGroups[0] || '');
        } else {
          setSelectedGroup('');
        }
      }
      return;
    }

    setSelectedGroup(value);
    
    // Auto-expand the selected group
    if (value && collapsedGroups.has(value)) {
      setCollapsedGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(value);
        return newSet;
      });
    }
    
    // Scroll to group after a short delay
    if (value) {
      setTimeout(() => {
        const element = document.getElementById(`group-${value}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.name) return alert('Vui lòng nhập tên sản phẩm');
    if (currentStep === 1 && formData.images.length === 0) return alert('Vui lòng upload ít nhất 1 hình ảnh');
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (status === 'loading' || (isEdit && isLoadingProduct)) {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  return (
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h1>

        {/* Step Indicator */}
        <div className="relative mb-10 group">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scrollSteps('left')}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-all"
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Scrollable Steps Container */}
          <div 
            ref={stepsContainerRef}
            className="flex items-center justify-between overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          >
            {STEPS.map((step, index) => (
              <div key={index} className="flex min-w-fit items-center flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    index <= currentStep
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {index < currentStep ? <FiCheck /> : index + 1}
                </div>
                <div className="ml-3 mr-6">
                  <p className={`text-xs font-bold uppercase ${index <= currentStep ? 'text-violet-600' : 'text-gray-500'}`}>
                    Bước {index + 1}
                  </p>
                  <p className="text-sm font-medium whitespace-nowrap">{step}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 w-10 bg-gray-200 mr-6 ${index < currentStep ? 'bg-violet-600' : ''}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scrollSteps('right')}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-all"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-xl shadow-gray-200 border border-gray-100">
          
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên sản phẩm..."
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Giá bán (VND) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Giá niêm yết (VND)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Đánh giá mặc định (1-5)</label>
                  <input
                    type="number"
                    name="rate"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="published" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">Công khai ngay</label>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-gray-700">Màu sắc khả dụng</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(ProductColor).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleMultiselect('colors', color)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-all ${
                              formData.colors.includes(color)
                                ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300'
                            }`}
                          >
                            {COLOR_LABELS[color] || color}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-semibold text-gray-700">Loại sản phẩm</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(CollectionType).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleMultiselect('types', type)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-all ${
                              formData.types.includes(type)
                                ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">Bộ sưu tập</label>
                    <div className="flex flex-wrap gap-2">
                      {collections?.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => handleMultiselect('collectionIds', col.id)}
                          className={`rounded-lg px-4 py-1.5 text-xs font-bold border transition-all ${
                            formData.collectionIds.includes(col.id)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Images */}
          {currentStep === 1 && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Hình ảnh sản phẩm</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {formData.images.map((img, index) => (
                  <div key={index} className="group relative w-full h-0 pb-[100%] overflow-hidden rounded-2xl border-2 border-gray-100 bg-gray-50 shadow-sm transition-all hover:shadow-md">
                    <Image 
                      src={img.imageURL} 
                      alt={`Product ${index}`} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 768px) 50vw, 20vw"
                      priority={index < 4}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleUpload}
                  className="relative w-full h-0 pb-[100%] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-violet-500 hover:bg-violet-50 transition-all group"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                      <FiUpload className="text-violet-600" size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 group-hover:text-violet-600">Thêm hình ảnh</span>
                  </div>
                </button>
              </div>
              <p className="text-sm text-gray-400 italic font-medium">* Bạn nên upload ít nhất 3-5 ảnh để sản phẩm trông chuyên nghiệp hơn.</p>
            </div>
          )}

          {/* Step 3: Warranty & Inclusions */}
          {currentStep === 2 && (
            <div className="animate-fadeIn space-y-8">
              <h2 className="text-xl font-bold text-gray-800">Bảo hành & Phụ kiện đi kèm</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Danh sách phụ kiện</label>
                  <button
                    type="button"
                    onClick={addInclusion}
                    className="flex items-center gap-1.5 text-sm font-bold text-violet-600 hover:text-violet-700"
                  >
                    <FiPlus /> Thêm phụ kiện
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.inclusions.map((inc, index) => (
                    <div key={index} className="flex gap-3 animate-slideIn">
                      <input
                        type="text"
                        value={inc.itemName}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                        placeholder="Ví dụ: Sạc dự phòng, Bao da..."
                        className="flex-1 rounded-xl border border-gray-200 p-3 shadow-sm focus:border-violet-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeInclusion(index)}
                        className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-gray-50 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {formData.inclusions.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">Chưa có thông tin phụ kiện.</p>
                  )}
                </div>
              </div>

              {/* Special inclusion for warranty */}
              <div className="pt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">Thông tin bảo hành (Tùy chọn)</label>
                <input
                    type="text"
                    placeholder="Ví dụ: Bảo hành 12 tháng chính hãng..."
                    className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:border-violet-500 outline-none"
                    onBlur={() => {
                       // Logic to save as an attribute if needed or just use a specific field
                    }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Description */}
          {currentStep === 3 && (
            <div className="animate-fadeIn space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Mô tả chi tiết sản phẩm</h2>
              <div>
                <Editor 
                  content={formData.description}
                  onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                  placeholder="Nhập mô tả chi tiết, đặc điểm nổi bật của sản phẩm..."
                  productId={id}
                />
              </div>
            </div>
          )}

          {/* Step 5: Specifications */}
          {currentStep === 4 && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Thông số kỹ thuật</h2>
              </div>

              {/* Add New Group and Attribute Section - STICKY */}
              <div className="sticky top-0 z-10 -mx-6 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-4 rounded-b-2xl shadow-sm">
                <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-5 border border-violet-100 shadow-sm">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_2fr_3fr_auto] items-end">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Nhóm thông số</label>
                      <select
                        value={selectedGroup}
                        onChange={(e) => handleGroupChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-violet-500 outline-none shadow-sm"
                      >
                        <option value="">-- Chọn nhóm --</option>
                        {attributeGroups.map(group => {
                          const count = formData.attributes.filter(attr => attr.groupName === group).length;
                          return (
                            <option key={group} value={group}>
                              {group} {count > 0 ? `(${count} thông số)` : ''}
                            </option>
                          );
                        })}
                        <option value="ADD_NEW_GROUP" className="font-bold text-violet-600">+ Thêm nhóm tính năng mới</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Tên thông số</label>
                      <input
                        type="text"
                        value={tempAttributeName}
                        onChange={(e) => setTempAttributeName(e.target.value)}
                        placeholder="Ví dụ: Cảm biến"
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-violet-500 outline-none shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Giá trị</label>
                      <input
                        type="text"
                        value={tempAttributeValue}
                        onChange={(e) => setTempAttributeValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addAttribute(selectedGroup)}
                        placeholder="Ví dụ: Full-frame 33MP"
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-violet-500 outline-none shadow-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => addAttribute(selectedGroup)}
                      className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-violet-700 hover:shadow-md flex items-center gap-2 h-[46px]"
                    >
                      <FiPlus /> Thêm
                    </button>
                  </div>
                </div>
              </div>

              {/* Grouped Attributes Display */}
              <div className="space-y-4">
                {attributeGroups.map(groupName => {
                  const groupAttrs = formData.attributes.filter(attr => attr.groupName === groupName);
                  if (groupAttrs.length === 0) return null;
                  
                  const isCollapsed = collapsedGroups.has(groupName);
                  
                  return (
                    <div key={groupName} id={`group-${groupName}`} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm scroll-mt-4">
                      {/* Group Header */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => toggleGroupCollapse(groupName)}
                          className="flex items-center gap-3 flex-1"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 font-bold text-sm">
                            {groupAttrs.length}
                          </div>
                          <h3 className="text-base font-bold text-gray-800">{groupName}</h3>
                          <FiChevronDown 
                            className={`text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} 
                            size={20} 
                          />
                        </button>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold uppercase text-gray-400">Chuyển toàn bộ sang:</label>
                          <select
                            onChange={(e) => moveAllAttributesToGroup(groupName, e.target.value)}
                            className="text-xs rounded-lg border border-gray-200 bg-white p-1.5 focus:border-violet-500 outline-none"
                            value={groupName}
                          >
                            <option value={groupName}>-- Chọn nhóm --</option>
                            {attributeGroups.filter(g => g !== groupName).map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Group Content */}
                      {!isCollapsed && (
                        <div className="p-4 space-y-3 bg-white">
                          {groupAttrs.map((attr) => {
                            const index = formData.attributes.indexOf(attr);
                            return (
                              <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_2.5fr_1fr_auto] items-end p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div>
                                  <label className="mb-1.5 block text-[10px] font-bold uppercase text-gray-400">Tên thông số</label>
                                  <input
                                    type="text"
                                    value={attr.attributeName}
                                    onChange={(e) => updateAttribute(index, 'attributeName', e.target.value)}
                                    placeholder="Ví dụ: Cảm biến"
                                    className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm focus:border-violet-500 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[10px] font-bold uppercase text-gray-400">Giá trị</label>
                                  <input
                                    type="text"
                                    value={attr.attributeValue}
                                    onChange={(e) => updateAttribute(index, 'attributeValue', e.target.value)}
                                    placeholder="Ví dụ: Full-frame 33MP"
                                    className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm focus:border-violet-500 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[10px] font-bold uppercase text-gray-400">Nhóm</label>
                                  <select
                                    value={attr.groupName || ''}
                                    onChange={(e) => updateAttribute(index, 'groupName', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm focus:border-violet-500 outline-none"
                                  >
                                    <option value="">-- Chọn --</option>
                                    {attributeGroups.map(group => (
                                      <option key={group} value={group}>{group}</option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttribute(index)}
                                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Ungrouped Attributes */}
                {(() => {
                  const ungrouped = formData.attributes.filter(attr => !attr.groupName || attr.groupName.trim() === '');
                  if (ungrouped.length === 0) return null;
                  
                  return (
                    <div className="border border-dashed border-gray-300 rounded-2xl overflow-hidden bg-gray-50">
                      <div className="flex items-center justify-between p-4 bg-yellow-50 border-b border-yellow-100">
                        <h3 className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold">
                            {ungrouped.length}
                          </span>
                          Chưa phân nhóm
                        </h3>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold uppercase text-yellow-700">Chuyển toàn bộ sang:</label>
                          <select
                            onChange={(e) => moveAllAttributesToGroup(undefined, e.target.value)}
                            className="text-xs rounded-lg border border-yellow-200 bg-white p-1.5 focus:border-yellow-500 outline-none"
                            value=""
                          >
                            <option value="">-- Chọn nhóm --</option>
                            {attributeGroups.map(group => (
                              <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {ungrouped.map((attr) => {
                          const index = formData.attributes.indexOf(attr);
                          return (
                            <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_2.5fr_1fr_auto] items-end p-3 rounded-xl bg-white border border-gray-200">
                              <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase text-gray-400">Tên thông số</label>
                                <input
                                  type="text"
                                  value={attr.attributeName}
                                  onChange={(e) => updateAttribute(index, 'attributeName', e.target.value)}
                                  placeholder="Ví dụ: Cảm biến"
                                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-violet-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase text-gray-400">Giá trị</label>
                                <input
                                  type="text"
                                  value={attr.attributeValue}
                                  onChange={(e) => updateAttribute(index, 'attributeValue', e.target.value)}
                                  placeholder="Ví dụ: Full-frame 33MP"
                                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-violet-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase text-gray-400">Gán nhóm</label>
                                <select
                                  value={attr.groupName || ''}
                                  onChange={(e) => updateAttribute(index, 'groupName', e.target.value)}
                                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-violet-500 outline-none"
                                >
                                  <option value="">-- Chọn --</option>
                                  {attributeGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttribute(index)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
                
                {formData.attributes.length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 mb-2">Chưa có thông số kỹ thuật.</p>
                    <p className="text-xs text-gray-400">Chọn nhóm và bấm &quot;Thêm thông số&quot; để bắt đầu.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="sticky bottom-0 z-20 -mx-6 mt-8 border-t border-gray-100 bg-white/90 px-6 pb-6 pt-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl justify-between">
              <button
                type="button"
                onClick={currentStep === 0 ? () => router.back() : prevStep}
                className="rounded-xl border border-gray-300 px-8 py-3 text-sm font-bold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                {currentStep === 0 ? 'Thoát' : 'Quay lại'}
              </button>
              <div className="flex gap-4">
                {currentStep < STEPS.length - 1 ? (
                  <>
                    {currentStep >= 1 && (
                      <button
                        key="btn-quick-save"
                        type="submit"
                        disabled={updateProduct.isLoading}
                        className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50"
                      >
                        {updateProduct.isLoading ? 'Đang lưu...' : 'Lưu ngay'}
                      </button>
                    )}
                    <button
                      key="btn-next"
                      type="button"
                      onClick={nextStep}
                      className="rounded-xl bg-violet-600 px-10 py-3 text-sm font-bold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200"
                    >
                      Tiếp theo
                    </button>
                  </>
                ) : (
                  <button
                    key="btn-submit"
                    type="submit"
                    disabled={createProduct.isLoading || updateProduct.isLoading}
                    className="flex items-center gap-2 rounded-xl bg-black px-10 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-xl disabled:opacity-50"
                  >
                    {(createProduct.isLoading || updateProduct.isLoading) && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    {isEdit ? 'Cập nhật sản phẩm' : 'Hoàn tất & Đăng'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </>
  );
};

NewProduct.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: 'Thêm/Sửa sản phẩm | Admin',
        description: 'Quản lý thông tin sản phẩm',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default NewProduct;
