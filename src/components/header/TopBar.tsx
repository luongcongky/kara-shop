import { useTranslation } from 'next-i18next';
// import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useRef, useState } from 'react';
// import { useRef } from 'react';
import type { IconType } from 'react-icons';
// import { FiChevronDown, FiPhone } from 'react-icons/fi';
import { FiPhone } from 'react-icons/fi';
import { BsFacebook, BsYoutube } from 'react-icons/bs';
import LiveStreamIcon from './LiveStreamIcon';
import { api } from '@/utils/api';

interface TopbarItemProps {
  label: string;
  url: string;
  Icon?: IconType;
}

const TopbarItem = ({ label, url, Icon }: TopbarItemProps) => (
  <li className="mx-1 pb-px md:mr-2.5 lg:[&:nth-of-type(3)]:mr-10 lg:[&:nth-of-type(5)]:mr-10">
    <Link
      href={url}
      className="flex items-center transition-colors hover:text-white"
    >
      {Icon && <Icon className="mx-1 md:text-sm"></Icon>}
      <span>{label}</span>
    </Link>
  </li>
);

export const TopBar = () => {
  // const [isLocaleSelectorOpen, setIsLocaleSelectorOpen] = useState(false);
  // const router = useRouter();
  const { t } = useTranslation('header');
  // const ref = useRef<HTMLDivElement>(null);

  // useClickAway(ref, () => setIsLocaleSelectorOpen(false));

  const topbarItems: TopbarItemProps[] = [
    { label: t('topbar.help'), url: '/info/how-it-works' },
    { label: t('topbar.phone'), url: 'tel:+0125258192502', Icon: FiPhone },
  ];

  const { data: configs } = api.systemConfig.getAll.useQuery();
  const { data: liveStatus } = api.youtube.getLiveStatus.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 5, // Check every 5 minutes
  });
  
  const getLink = (key: string, defaultValue: string) => {
    return configs?.find(c => c.key === key)?.value || defaultValue;
  };

  const socialLinks = [
    { 
      Icon: BsFacebook, 
      url: getLink('SOCIAL_FACEBOOK_PAGE', 'https://facebook.com'), 
      color: '#1877F2' 
    },
    { 
      Icon: BsYoutube, 
      url: getLink('SOCIAL_YOUTUBE', 'https://youtube.com'), 
      color: '#FF0000' 
    },
  ];

  return (
    <div className="bg-[#232323] text-[9px] text-gray-300 sm:text-[10px] md:text-xs">
      <div className="mx-auto flex flex-row items-center justify-between px-4 py-2 xl:container md:py-2.5">
        <p className="whitespace-nowrap pr-4">{t('topbar.discount')}</p>
        <ul className="flex items-center whitespace-nowrap md:ml-auto">
          {topbarItems.map(item => (
            <TopbarItem key={item.label} {...item} />
          ))}
        </ul>
        <div className="flex items-center gap-3 border-l border-gray-600 pl-4 ml-4">
          <LiveStreamIcon 
            isActive={!!liveStatus?.isActive} 
            videoId={liveStatus?.videoId || ""} 
          /> 
          {socialLinks.map(({ Icon, url, color }) => (
            <Link
              key={url}
              href={url}
              target="_blank"
              className="transition-opacity hover:opacity-80"
              style={{ color }}
            >
              <Icon size={16} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
