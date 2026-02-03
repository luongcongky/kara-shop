import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Transition, Menu } from '@headlessui/react';
import { IconType } from 'react-icons';
import { FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Search } from './Search';
import { TopBar } from './TopBar';
import { MegaMenu } from './MegaMenu';
import { Collections } from '@/types';
import { BottomNavigation } from '@/components';
import { useSession, signOut } from 'next-auth/react';
import { CollectionType } from '@prisma/client';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export interface NavLink {
  name: 'camera' | 'lens' | 'sale' | 'blog' | 'contacts';
  href: string;
  collapsible?: boolean;
}

export const navLinks: NavLink[] = [
  // { name: 'clothes', href: '/products/clothes', collapsible: true },
  // { name: 'women', href: '/products/women', collapsible: true },
  { name: 'camera', href: '/products/camera', collapsible: true },
  { name: 'lens', href: '/products/lens', collapsible: true },
  { name: 'sale', href: '/promotions' },
  { name: 'blog', href: '/blog' },
  { name: 'contacts', href: '/contacts' },
];

export const sideNavLinks: [string, IconType][] = [
  ['/wishlist', FiHeart],
  ['/cart', FiShoppingBag],
  ['/signin', FiUser],
];

export const Header = ({ collections, logoUrl }: { collections: Collections; logoUrl?: string }) => {
  const { t } = useTranslation('header');

  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const totalWishlistItems = wishlistItems.length;
  console.log('Session Data:', session);

  const [hoveredNavLink, setHoveredNavLink] = useState<NavLink | null>();

  const handleShowMenu = (navLink: NavLink) => setHoveredNavLink(navLink);
  const handleCloseMenu = () => setHoveredNavLink(null);

  return (
    <header>
      <TopBar />
      <div className="relative h-14 bg-white shadow-md shadow-gray-200 z-[60]">
        <div className="mx-auto flex h-full items-center px-4 xl:container">
          <div className="mr-5 flex shrink-0 items-center">
            <Link href="/">
              <Image
                priority
                src={logoUrl || "/logo.png"}
                alt="logo"
                width={100}
                height={35}
                quality={100}
                className="object-contain"
              />
            </Link>
          </div>
          <ul className="ml-auto hidden h-full md:flex">
            {navLinks.map((item, index) => (
              <li
                className={`font-medium text-neutral-700 transition-colors ${
                  hoveredNavLink === item && 'bg-violet-100 text-violet-700'
                }`}
                key={index}
                onMouseEnter={() => handleShowMenu(item)}
                onMouseLeave={handleCloseMenu}
              >
                <Link
                  href={item.href}
                  className="flex h-full items-center px-5"
                  onClick={handleCloseMenu}
                >
                  {t(item.name)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="ml-auto flex flex-1 items-center justify-end md:flex max-w-[800px]">
            <Search onSearch={value => console.log(value)} />
            {sideNavLinks
              .filter(([url]) => !session || url !== '/signin')
              .map(([url, Icon]) => (
                <Link key={url} href={url} className="ml-5 hidden md:block">
                  <div className="relative">
                    <Icon
                      className="text-neutral-700 transition-colors hover:text-violet-700"
                      size="20px"
                    />
                    {url === '/cart' && totalItems > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {totalItems}
                      </span>
                    )}
                    {url === '/wishlist' && totalWishlistItems > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {totalWishlistItems}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            {session && (
              <Menu as="div" className="relative ml-5 hidden md:block">
                <Menu.Button className="flex rounded-full border border-solid border-violet-700 p-[2px]">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="user profile image"
                      width={30}
                      height={30}
                      className="overflow-hidden rounded-full"
                      quality={100}
                    />
                  ) : (
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <FiUser />
                    </div>
                  )}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700`}
                          >
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={session.user?.role === 'ADMIN' ? '/admin/orders' : '/orders'}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700`}
                          >
                            Quản lý đơn hàng
                          </Link>
                        )}
                      </Menu.Item>
                      {session.user?.role === 'ADMIN' && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/admin/products"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Quản lý sản phẩm
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/admin/homepage"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Quản lý trang Home
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/admin/context"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Quản lý bài viết
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </ul>
        </div>
        <Transition show={Boolean(hoveredNavLink?.collapsible)}>
          {hoveredNavLink && (
            <MegaMenu
              type={
                hoveredNavLink.name === 'camera'
                  ? CollectionType.CAMERA
                  : hoveredNavLink.name === 'lens'
                  ? CollectionType.LENS
                  : CollectionType.OTHERS
              }
              collections={collections}
              onShowMenu={() => handleShowMenu(hoveredNavLink)}
              onCloseMenu={handleCloseMenu}
            />
          )}
        </Transition>
      </div>
      <BottomNavigation navLinks={navLinks} collections={collections} />
    </header>
  );
};
