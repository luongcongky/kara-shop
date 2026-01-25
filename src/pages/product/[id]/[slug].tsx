import type { GetStaticProps, GetStaticPaths } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PrimaryLayout } from '@/layouts';
// import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { FiShoppingCart, FiPhone, FiCheckCircle, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Image paths for product
const CLOUDINARY_URL = 'https://res.cloudinary.com/dibypjlfc/image/upload/v1769221642/camera_sample_ulxm5p.png';
const cameraFront = CLOUDINARY_URL;
const cameraAngle = CLOUDINARY_URL;
const cameraBack = CLOUDINARY_URL;

// MOCK DATA
const MOCK_PRODUCT = {
  id: 50,
  name: 'Sony Alpha a7 IV Mirrorless Digital Camera with 28-70mm Lens',
  price: 59990000,
  originalPrice: 64990000,
  description: `
    <p>The Sony Alpha a7 IV is an all-arounder that pushes outside of the basic capabilities of what a full-frame mirrorless camera can do.</p>
    <p>The 33MP Exmor R CMOS sensor is paired with the BIONZ XR processor to achieve high-speed shooting up to 10 fps and 4K 60p video recording, along with broad sensitivity up to ISO 51200 and a wide 15+ stop dynamic range.</p>
    <br/>
    <p>Beyond image quality, the sensor and processor also enable an advanced AI-based AF system that supports Real-time Eye AF and Real-time Tracking for intuitive AF control and subject tracking.</p>
  `,
  images: [
    cameraFront,
    cameraAngle,
    cameraBack,
    cameraFront
  ],
  warranty: '24 Months Genuine Warranty',
  accessories: [
    'Full box with body and lens',
    'Rechargeable Battery NP-FZ100',
    'AC Adapter',
    'Shoulder Strap',
    'Body Cap',
    'Accessory Shoe Cap',
    'Eyepiece Cup',
    'USB-A to USB-C Cable (USB 3.2)'
  ],
  specs: [
    { label: 'Sensor Type', value: '33MP Full-Frame Exmor R CMOS' },
    { label: 'Image Processor', value: 'BIONZ XR' },
    { label: 'ISO Sensitivity', value: '100-51200 (Exp: 50-204800)' },
    { label: 'Viewfinder', value: '3.68m-Dot EVF with 120fps Refresh Rate' },
    { label: 'LCD Screen', value: '3.0" 1.03m-Dot Vari-Angle Touchscreen LCD' },
    { label: 'Continuous Shooting', value: 'Up to 10 fps' },
    { label: 'Video Recording', value: '4K 60p 10-Bit, S-Cinetone' },
    { label: 'Connectivity', value: 'Wi-Fi 5GHz, Bluetooth 5.0, USB 3.2 Gen 2' }
  ],
  reviews: [
    {
      user: 'Nguyen Van A',
      rating: 5,
      date: '2023-11-20',
      comment: 'Excellent camera! The autofocus is incredibly fast and the image quality is superb.'
    },
    {
      user: 'Tran Thi B',
      rating: 4,
      date: '2023-12-05',
      comment: 'Great hybrid camera for both photo and video. Battery life could be better though.'
    },
    {
      user: 'Le Van C',
      rating: 5,
      date: '2024-01-10',
      comment: 'Best upgrade from a7 III. The new menu system is a life saver.'
    }
  ]
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [], // No paths pre-rendered for this mock page
        fallback: 'blocking' // Generate on demand
    }
}

const ProductDetail: NextPageWithLayout = () => {
  // const { t } = useTranslation('common');
  const [selectedImage, setSelectedImage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  const scrollThumbnails = (direction: 'left' | 'right') => {
    let nextIndex = selectedImage;
    if (direction === 'left') {
        nextIndex = Math.max(0, selectedImage - 1);
    } else {
        nextIndex = Math.min(MOCK_PRODUCT.images.length - 1, selectedImage + 1);
    }

    if (nextIndex !== selectedImage) {
        setSelectedImage(nextIndex);
        
        // Scroll thumbnail into view
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const thumbnailWidth = 80 + 16; // width + gap
            container.scrollTo({
                left: nextIndex * thumbnailWidth - (container.offsetWidth / 2) + (thumbnailWidth / 2),
                behavior: 'smooth'
            });
        }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Section: Gallery & Info */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            
            {/* Product Gallery */}
            <div className="flex flex-col gap-6">
                
                {/* Main Image Slider Area */}
                <div className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm" style={{ aspectRatio: '1 / 1' }}>
                    <div 
                        className="flex h-full w-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${selectedImage * 100}%)` }}
                    >
                        {MOCK_PRODUCT.images.map((img, idx) => (
                            <div key={idx} className="relative h-full w-full flex-shrink-0">
                                <Image 
                                    src={img} 
                                    alt={`${MOCK_PRODUCT.name} ${idx}`} 
                                    fill
                                    className="object-contain p-6"
                                    priority={idx === 0}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sliding Horizontal Boxed Thumbnails */}
                <div className="relative flex items-center group">
                    {/* Left Button */}
                    <button 
                        onClick={() => scrollThumbnails('left')}
                        className="absolute -left-4 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 group-hover:flex sm:-left-6"
                    >
                        <FiChevronLeft className="text-lg text-gray-600" />
                    </button>

                    <div 
                        ref={scrollContainerRef}
                        className="no-scrollbar flex flex-nowrap gap-4 overflow-x-auto scroll-smooth py-1"
                    >
                        {MOCK_PRODUCT.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 ${
                                    selectedImage === idx 
                                    ? 'border-blue-600 shadow-sm' 
                                    : 'border-gray-100 hover:border-gray-300'
                                }`}
                            >
                                <Image 
                                    src={img} 
                                    alt={`thumbnail ${idx}`} 
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            </button>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button 
                        onClick={() => scrollThumbnails('right')}
                        className="absolute -right-4 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 group-hover:flex sm:-right-6"
                    >
                        <FiChevronRight className="text-lg text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900">{MOCK_PRODUCT.name}</h1>
                
                <div className="mt-4 flex items-center gap-2">
                     <div className="flex text-yellow-500">
                         {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                     </div>
                     <span className="text-sm text-gray-500">({MOCK_PRODUCT.reviews.length} reviews)</span>
                </div>

                <div className="mt-6 flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-red-600">
                        {formatCurrency(MOCK_PRODUCT.price)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(MOCK_PRODUCT.originalPrice)}
                    </span>
                    <span className="rounded bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-800">
                        -8%
                    </span>
                </div>

                {/* Warranty & Accessories Box */}
                <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-6">
                    <div className="flex items-center gap-3">
                        <FiCheckCircle className="text-xl text-blue-600" />
                        <span className="font-semibold text-gray-900">{MOCK_PRODUCT.warranty}</span>
                    </div>
                    
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-900">🎁 In the Box:</h4>
                        <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                             {MOCK_PRODUCT.accessories.map((item, i) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                     <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-blue-400" />
                                     {item}
                                 </li>
                             ))}
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-bold text-white transition hover:bg-red-700">
                        <FiShoppingCart className="text-xl" />
                        BUY NOW
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-blue-600 px-8 py-4 font-bold text-blue-600 transition hover:bg-blue-50">
                        <FiPhone className="text-xl" />
                        CALL FOR PRICE
                    </button>
                </div>
                
                 <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                    <ul className="mt-4 space-y-2">
                         {MOCK_PRODUCT.specs.slice(0, 4).map((spec, i) => (
                              <li key={i} className="flex gap-2 text-sm text-gray-600">
                                  <strong className="min-w-[120px] text-gray-900">{spec.label}:</strong>
                                  <span>{spec.value}</span>
                              </li>
                         ))}
                    </ul>
                 </div>
            </div>
        </div>

        {/* Bottom Section: Details & Specs */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
             {/* Left Column: Description & Reviews */}
             <div className="lg:col-span-2">
                 {/* Description */}
                 <div className="rounded-xl border border-gray-100 p-6 shadow-sm">
                     <h2 className="mb-6 text-2xl font-bold text-gray-900 border-b pb-4">Product Description</h2>
                     <div 
                        className="prose max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT.description }}
                     />
                 </div>

                 {/* Reviews */}
                 <div className="mt-12 rounded-xl border border-gray-100 p-6 shadow-sm">
                      <h2 className="mb-6 text-2xl font-bold text-gray-900 border-b pb-4">Customer Reviews</h2>
                      <div className="space-y-8">
                          {MOCK_PRODUCT.reviews.map((review, i) => (
                              <div key={i} className="flex gap-4">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
                                      {review.user.charAt(0)}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-900">{review.user}</h4>
                                      <div className="my-1 flex text-yellow-400">
                                          {[...Array(5)].map((_, s) => (
                                              <FiStar key={s} fill={s < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                                          ))}
                                      </div>
                                      <p className="mt-1 text-sm text-gray-600">{review.date}</p>
                                      <p className="mt-2 text-gray-800">{review.comment}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                 </div>
             </div>

             {/* Right Column: Technical Specs */}
             <div className="lg:col-span-1">
                 <div className="sticky top-24 rounded-xl bg-gray-50 p-6 shadow-sm">
                     <h3 className="mb-6 text-xl font-bold text-gray-900">Technical Specifications</h3>
                     <dl className="space-y-4">
                         {MOCK_PRODUCT.specs.map((spec, i) => (
                             <div key={i} className="flex flex-col border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                 <dt className="text-sm font-medium text-gray-500">{spec.label}</dt>
                                 <dd className="mt-1 text-base font-semibold text-gray-900">{spec.value}</dd>
                             </div>
                         ))}
                     </dl>
                 </div>
             </div>
        </div>
    </div>
  );
};

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      seo={{
        title: MOCK_PRODUCT.name,
        description: 'Product Detail',
        canonical: 'https://karashop.vercel.app/product/50/slug',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default ProductDetail;
