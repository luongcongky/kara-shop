import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
  rate,
  images,
  collection,
}: Product) => {
  const [currentImage, setCurrentImage] = useState(images[0]?.imageURL || '/camera-placeholder.png');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageURL: string) => {
    setFailedImages(prev => new Set(prev).add(imageURL));
    if (currentImage === imageURL) {
      setCurrentImage('/camera-placeholder.png');
    }
  };

  const productLink = `/product/${id}/slug`;

  return (
    <div className="group rounded-2xl bg-white p-2">
      <div className="relative h-[400px] overflow-hidden rounded-2xl transition sm:h-[330px]">
        <Link href={productLink} className="relative block h-full w-full">
          {images.map(({ imageURL, imageBlur }) => (
            <Image
              key={imageURL}
              src={failedImages.has(imageURL) ? '/camera-placeholder.png' : imageURL}
              alt={`${name} image`}
              className={clsx('absolute h-full w-full object-cover duration-700 ', {
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
      </div>
      <div className="mb-1 mt-2 space-y-4 px-1">
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
            {collection.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">
            {numberWithCommas(Math.floor(price))} VND
          </h3>
          <div className="flex items-center justify-center text-xs font-medium text-neutral-500">
            <BsStarFill size="11px" className="mr-1 text-yellow-400" />
            <h4>{rate} (69 Reviews)</h4>
          </div>
        </div>
      </div>
      
      {/* Marketing Stickers */}
      {rate >= 4.5 && (
        <div className="absolute left-4 top-4 z-10">
          <span className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
            <BsStarFill size="10px" className="text-white" />
            Top Rated
          </span>
        </div>
      )}
      {price > 30000000 && (
        <div className="absolute right-4 top-4 z-10">
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg border border-zinc-700">
             Dealer Price
          </span>
        </div>
      )}
    </div>
  );
};
