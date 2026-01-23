import Image from 'next/image';
import Link from 'next/link';
import { capitalizeFirstLetter } from '@/utils';
import { Collections } from '@/types';
import { CollectionType } from '@prisma/client';

interface Props {
  type: CollectionType;
  collections: Collections;
  onShowMenu: () => void;
  onCloseMenu: () => void;
}



export const MegaMenu = ({
  type,
  collections,
  onShowMenu,
  onCloseMenu,
}: Props) => {
  const mainCategories = collections?.filter(c => !c.parentId && c.slug !== 'new-and-trending-root');
  const trendingCategories = collections?.filter(c => c.slug === 'new-and-trending-root');

  // Removed debug logs
  if (trendingCategories && trendingCategories.length > 0) {
      // console.log('Found Trending Root:', trendingCategories[0]);
  }

  const typeInLowerCase = type.toString().toLowerCase();

  return (
    <div
      onMouseEnter={onShowMenu}
      onMouseLeave={onCloseMenu}
      className="absolute z-[500] w-full border-t border-solid border-neutral-200 bg-white shadow-md shadow-neutral-300"
    >
      <div className="mx-auto flex max-w-7xl">
        <div className="flex flex-1">
          <div className="ml-4 py-8">
            <Link
              href="/"
              onClick={onCloseMenu}
              className="text-sm font-bold uppercase leading-4 tracking-widest text-neutral-800 hover:underline"
            >
              New & Trending
            </Link>
            {trendingCategories?.map(collection => (
              <ul key={collection.id} className="pt-2">
                {collection.children
                  .filter(subCollection => subCollection.types.includes(type))
                  .map((subCollection, index) => (
                    <li key={index}>
                      <Link
                        href={`/products/${typeInLowerCase}/${subCollection.slug}`}
                        className="mb-1.5 text-xs font-normal text-neutral-700 hover:underline"
                        onClick={onCloseMenu}
                      >
                        {subCollection.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            ))}
            <Link href="/" onClick={onCloseMenu}>
              <Image
                priority
                src="/assets/offer.webp"
                alt="offer"
                width={150}
                height={100}
                quality={100}
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-[3] border-l border-solid shadow-neutral-300">
          {mainCategories &&
            mainCategories.map(collection => (
              <div
                key={collection.id}
                className="ml-4 w-full max-w-[150px] py-8"
              >
                <Link
                  href={`/products/${typeInLowerCase}/${collection.slug}`}
                  onClick={onCloseMenu}
                  className="text-sm font-bold uppercase leading-4 tracking-widest text-neutral-800 hover:underline"
                >
                  {collection.name}
                </Link>
                <ul className="pt-2">
                  {collection.children
                    .filter(subCollection => subCollection.types.includes(type))
                    .map(subCollection => (
                      <li key={subCollection.id}>
                        <Link
                          href={`/products/${typeInLowerCase}/${subCollection.slug}`}
                          className="mb-1.5 text-xs font-normal text-neutral-700 hover:underline"
                          onClick={onCloseMenu}
                        >
                          {subCollection.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
      <div className="border-t border-solid shadow-neutral-300">
        <div className="mx-auto flex max-w-7xl">
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              className="ml-4 w-full max-w-[150px] py-3 text-xs font-bold text-neutral-800 hover:underline"
              onClick={onCloseMenu}
            >
              Sale
            </Link>
          </div>
          <div className="flex flex-[3] items-center">
            {['shoes', 'clothing', 'accessories', 'sport', ''].map(
              (item, index) => (
                <Link
                  key={index}
                  href={`/products/${typeInLowerCase}/${item}`}
                  className="ml-4 w-full max-w-[150px] py-3 text-xs font-bold text-neutral-800 hover:underline"
                  onClick={onCloseMenu}
                >
                  {`All ${capitalizeFirstLetter(
                    typeInLowerCase
                  )}'s ${capitalizeFirstLetter(item)}`}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
