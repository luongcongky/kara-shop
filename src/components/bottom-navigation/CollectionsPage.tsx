import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FiX } from 'react-icons/fi';
import { Collections } from '@/types';
import { NavLink } from '@/components';
import { Accordion } from '@/components/ui';
import { CollectionType } from '@prisma/client';

interface Props {
  navLinks: NavLink[];
  collections: Collections;
  onPageClose: () => void;
}

export const CollectionsPage = ({
  navLinks,
  collections,
  onPageClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 top-0 z-[100] h-full w-full overflow-y-auto bg-white px-5 pt-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-medium">{t('common:collections')}</h2>
        <FiX
          className="cursor-pointer"
          size="1.5rem"
          data-testid="close"
          onClick={onPageClose}
        />
      </div>
      <ul className="mt-5 flex flex-col px-2">
        {navLinks.map((item, index) => (
          <li
            key={index}
            className="border-b border-solid border-neutral-100 font-medium text-neutral-800"
          >
            {item.collapsible ? (
              <Accordion>
                <Accordion.Header>{t(`header:${item.name}`)}</Accordion.Header>
                <Accordion.Body className="px-2 text-sm">
                  <ul>
                    {collections &&


                      collections.map((collection) => {
                        // Determine target type based on navigation item
                        let targetType: CollectionType | null = null;
                        if (item.name === 'camera') targetType = CollectionType.CAMERA;
                        else if (item.name === 'lens') targetType = CollectionType.LENS;

                        // Identify if this is a legacy navigation item (not camera/lens)
                        // If logic expands, add more types. 
                        // Currently only Camera/Lens are collapsible.
                        
                        // Strict Parent Filter: 
                        // Only show this collection if the PARENT itself matches the target type.
                        if (targetType && !collection.types.includes(targetType)) {
                          return null;
                        }

                        // Secondary Children Filter:
                        // If parent matches (or no target type defined), filter its children.
                        const filteredChildren = collection.children.filter((subCollection) => {
                           if (!targetType) return true; // Show all if no target type
                           const match = subCollection.types.includes(targetType);
                           return match;
                        });

                        // If no children match, also hide (unless we want to show empty parents?)
                        // Let's hide empty parents to be clean.
                        if (filteredChildren.length === 0) {
                             return null;
                        }

                        return (
                          <li
                            key={collection.id}
                            className="block border-b border-solid border-neutral-100"
                          >
                            <Accordion>
                              <Accordion.Header>
                                {collection.name}
                              </Accordion.Header>
                              <Accordion.Body className="px-2 text-xs">
                                <ul>
                                  {filteredChildren.map((subCollection) => (
                                    <li
                                      key={subCollection.id}
                                      className="block border-b border-solid border-neutral-100 py-2"
                                    >
                                      <Link
                                        href={`/products/${item.name}/${subCollection.slug}`}
                                        onClick={onPageClose}
                                      >
                                        <h3>{subCollection.name}</h3>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </Accordion.Body>
                            </Accordion>
                          </li>
                        );
                      })}
                  </ul>
                </Accordion.Body>
              </Accordion>
            ) : (
              <Link
                href={item.href}
                className="block py-4"
                onClick={onPageClose}
              >
                <h3>{t(`header:${item.name}`)}</h3>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
