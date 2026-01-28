import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { BsStarFill } from 'react-icons/bs';
import { Product } from '@/types';
import { numberWithCommas } from '@/utils';

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent`;

export const Skeleton = () => {
  return (
    <div className="rounded-2xl bg-white p-2">
      <div className={`h-[350px] rounded-2xl bg-neutral-200 ${shimmer}`} />
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

  const productLink = `/product/${id}/slug`;

  return (
    <div className="group relative rounded-2xl bg-white p-2">
      <div className="relative h-[400px] overflow-hidden rounded-2xl bg-neutral-50 p-3 transition sm:h-[330px]">
        <Link href={productLink} className="relative block h-full w-full">
          {images.map(({ imageURL, imageBlur }) => (
            <Image
              key={imageURL}
              src={failedImages.has(imageURL) ? '/camera-placeholder.png' : imageURL}
              alt={`${name} image`}
              className={clsx('absolute h-full w-full object-contain duration-700 ', {
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
        {originalPrice && originalPrice > price && (
          <div className="absolute left-3 top-3 z-20 rounded-lg bg-red-600 px-2 py-1 text-xs font-black text-white shadow-lg">
             -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 px-1 py-4">
        {/* Thumbnail Selector */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {images.map(({ imageURL, imageBlur }, index) => (
            <button
              key={index}
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
            <span className="text-lg font-black text-red-600">
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
