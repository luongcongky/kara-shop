import Link from 'next/link';
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
  const mainCategories = collections?.filter(
    (c) => !c.parentId && c.slug !== 'new-and-trending-root' && c.types.includes(type)
  );
  const trendingCategories = collections?.filter((c) => c.slug === 'new-and-trending-root');

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
              href={`/products/${typeInLowerCase}/new-and-trending-root`}
              onClick={onCloseMenu}
              className="text-sm font-bold uppercase leading-4 tracking-wider text-neutral-800 hover:underline"
            >
              New & Trending
            </Link>
            {trendingCategories?.map((collection) => (
              <ul key={collection.id} className="pt-2">
                {collection.children
                  // .filter((subCollection) => subCollection.types.includes(type)) // Removed to make New & Trending common
                  .map((subCollection, index: number) => (
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

          </div>
        </div>
        <div className="flex flex-[3] border-l border-solid shadow-neutral-300">
          {mainCategories &&
            mainCategories.map((collection) => (
              <div
                key={collection.id}
                className="ml-4 w-full max-w-[150px] py-8"
              >
                <Link
                  href={`/products/${typeInLowerCase}/${collection.slug}`}
                  onClick={onCloseMenu}
                  className="text-sm font-bold uppercase leading-4 tracking-wider text-neutral-800 hover:underline"
                >
                  {collection.name}
                </Link>
                <ul className="pt-2">
                  {collection.children
                    .filter((subCollection) => subCollection.types.includes(type))
                    .map((subCollection) => (
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

    </div>
  );
};
