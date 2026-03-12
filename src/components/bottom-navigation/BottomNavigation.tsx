import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { IconType } from 'react-icons';
import { FiHome, FiUser, FiHeart, FiShoppingBag, FiGrid } from 'react-icons/fi';
import { Collections } from '@/types';
import { NavLink } from '@/components';
import { CollectionsPage } from './CollectionsPage';
import { AccountMenuPage } from './AccountMenuPage';
import { useSession } from 'next-auth/react';

interface Props {
  navLinks: NavLink[];
  collections: Collections;
}

interface BottomTab {
  title: string;
  url: string;
  Icon: IconType;
}

export const BottomNavigation = ({ navLinks, collections }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [currentTab, setCurrentTab] = useState('');

  const bottomTabs: BottomTab[] = [
    { title: t('common:home'), url: '/', Icon: FiHome },
    { title: t('common:collections'), url: '/#collections', Icon: FiGrid },
    { title: t('common:cart'), url: '/cart', Icon: FiShoppingBag },
    { title: t('common:wishlist'), url: '/wishlist', Icon: FiHeart },
    { title: t('common:profile'), url: session ? '/#account' : '/signin', Icon: FiUser },
  ];

  const handleTabClick = (url: string) => {
    if (url === '/#collections') {
      setCurrentTab('/#collections');
      return;
    }
    if (url === '/#account' && session) {
      setCurrentTab('/#account');
      return;
    }
    
    // Normal navigation
    setCurrentTab('');
    router.push(url);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] h-16 bg-white drop-shadow-[0_-15px_20px_rgba(0,0,0,0.10)] md:hidden">
        <ul className="flex h-full">
          {bottomTabs.map((tab, index) => (
            <li key={index} className="flex-1">
              <button
                onClick={() => handleTabClick(tab.url)}
                className={`flex h-full w-full flex-col items-center justify-center text-xs font-medium text-neutral-700 hover:text-violet-700 ${
                  (router.pathname === tab.url || currentTab === tab.url) && 'text-violet-700'
                }`}
              >
                <tab.Icon size={'1.2rem'} />
                <span className="mt-1">{tab.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {currentTab === '/#collections' && (
        <CollectionsPage
          navLinks={navLinks}
          collections={collections}
          onPageClose={() => setCurrentTab('')}
        />
      )}
      {currentTab === '/#account' && session && (
        <AccountMenuPage
          onPageClose={() => setCurrentTab('')}
        />
      )}
    </>
  );
};
