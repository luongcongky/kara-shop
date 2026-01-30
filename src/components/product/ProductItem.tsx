import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useRef, useEffect } from 'react';
import { BsStarFill, BsChevronLeft, BsChevronRight, BsHeart, BsSearch, BsHandbag } from 'react-icons/bs';
import { Product } from '@/types';
import { numberWithCommas } from '@/utils';

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent`;

export const Skeleton = () => {
  return (
    <div className="rounded-2xl bg-white p-2">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-2xl bg-neutral-200">
        <div className={`h-full w-full ${shimmer}`} />
      </div>
      <div className="my-3 space-y-3 px-1">
        <div className="flex gap-2">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`h-[40px] w-[40px] rounded-full bg-neutral-200 border-2 border-neutral-100 ${shimmer}`}
              ></div>
            ))}
        </div>
        <div className={`h-4 w-full rounded-lg bg-neutral-200 ${shimmer}`} />
        <div className={`h-4 w-1/2 rounded-lg bg-neutral-200 ${shimmer}`} />
        <div className="flex justify-between">
          <div className={`h-4 w-1/3 rounded-lg bg-neutral-200 ${shimmer}`} />
          <div className={`h-4 w-1/3 rounded-lg bg-neutral-200 ${shimmer}`} />
        </div>
      </div>
    </div>
  );
};

export const ProductItem = ({
  id,
  name,
  price,
  originalPrice,
  rate,
  images,
  collections,
  currentSlug,
}: Product & { currentSlug?: string }) => {
  const [currentImage, setCurrentImage] = useState(images[0]?.imageURL || '/camera-placeholder.png');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const displayName = useMemo(() => {
    if (currentSlug) {
      const currentCollection = collections.find(c => c.collection.slug === currentSlug);
      if (currentCollection) return currentCollection.collection.name;
    }
    return collections[0]?.collection.name;
  }, [collections, currentSlug]);

  const handleImageError = (imageURL: string) => {
    setFailedImages(prev => new Set(prev).add(imageURL));
    if (currentImage === imageURL) {
      setCurrentImage('/camera-placeholder.png');
    }
  };

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentIndex = images.findIndex((img) => img.imageURL === currentImage);
    const activeThumbnail = thumbnailRefs.current[currentIndex];

    if (activeThumbnail && thumbnailContainerRef.current) {
      activeThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentImage, images]);

  const productLink = `/product/${id}/slug`;

  const currentIndex = images.findIndex((img) => img.imageURL === currentImage);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentImage(images[prevIndex]?.imageURL || '/camera-placeholder.png');
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentImage(images[nextIndex]?.imageURL || '/camera-placeholder.png');
  };

  return (
    <div className="group relative rounded-2xl bg-white p-2 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      <div className="aspect-w-1 aspect-h-1 relative w-full overflow-hidden rounded-2xl bg-neutral-50 shadow-inner">
        <div className="flex h-full w-full flex-col p-3">
          <Link href={productLink} className="relative block h-full w-full">
              {images.map(({ imageURL, imageBlur }) => (
                <Image
                  key={imageURL}
                  src={failedImages.has(imageURL) ? '/camera-placeholder.png' : imageURL}
                  alt={`${name} image`}
                  className={clsx('absolute h-full w-full object-contain duration-700', {
                    'opacity-100': currentImage === imageURL,
                    'opacity-0': currentImage !== imageURL,
                  })}
                  width={350}
                  height={350}
                  placeholder="blur"
                  blurDataURL={imageBlur}
                  unoptimized
                  onError={() => handleImageError(imageURL)}
                />
              ))}
            </Link>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-[65%] z-30 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-zinc-800 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white group-hover:opacity-100 lg:left-4"
                aria-label="Previous image"
              >
                <BsChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-[65%] z-30 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-zinc-800 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white group-hover:opacity-100 lg:right-4"
                aria-label="Next image"
              >
                <BsChevronRight size={16} />
              </button>
            </>
          )}

          {/* Quick Action Icons */}
          <div className="absolute right-2 top-2 z-30 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:right-4 lg:top-4">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-800 shadow-md transition-all duration-200 hover:bg-orange-500 hover:text-white"
              title="Yêu thích"
            >
              <BsHeart size={18} />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-800 shadow-md transition-all duration-200 hover:bg-orange-500 hover:text-white"
              title="Xem nhanh"
            >
              <BsSearch size={18} />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-800 shadow-md transition-all duration-200 hover:bg-orange-500 hover:text-white"
              title="Thêm vào giỏ"
            >
              <BsHandbag size={18} />
            </button>
          </div>

          {originalPrice && originalPrice > price && (
            <div className="absolute left-3 top-3 z-20 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
               -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-1 py-4">
        {/* Thumbnail Selector */}
        <div 
          ref={thumbnailContainerRef}
          className="no-scrollbar flex gap-2 overflow-x-auto pb-1 scroll-smooth"
        >
          {images.map(({ imageURL, imageBlur }, index) => (
            <button
              key={index}
              ref={(el) => (thumbnailRefs.current[index] = el)}
              className={clsx(
                'h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full border-2 transition-all duration-200',
                currentImage === imageURL
                  ? 'border-orange-500 scale-105 z-10'
                  : 'border-neutral-100 hover:border-neutral-300'
              )}
              onClick={() => setCurrentImage(imageURL)}
            >
              <Image
                src={failedImages.has(imageURL) ? '/camera-placeholder.png' : imageURL}
                alt={`${name} image ${index + 1}`}
                className="object-cover"
                width={40}
                height={40}
                placeholder="blur"
                blurDataURL={imageBlur}
                unoptimized
                onError={() => handleImageError(imageURL)}
              />
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-base font-medium">{name}</h2>
          <h3 className="text-xs font-normal capitalize text-neutral-400">
            {displayName}
          </h3>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-red-600">
              {numberWithCommas(Math.floor(price))}đ
            </span>
            <div className="flex items-center gap-1">
              <BsStarFill className="mb-0.5 text-xs text-yellow-400" />
              <span className="text-sm font-semibold text-neutral-500">{rate}</span>
            </div>
          </div>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-neutral-400 line-through">
               {numberWithCommas(Math.floor(originalPrice))}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
