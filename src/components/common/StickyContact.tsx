import React from 'react';
import Image from 'next/image';
import { FaFacebookMessenger, FaPhoneAlt } from 'react-icons/fa';
import { api } from '@/utils/api';

const ZaloIcon = ({ className }: { className?: string }) => (
  <Image
    src="https://i0.wp.com/help.zalo.me/wp-content/uploads/2023/08/cropped-hinhZalo-2.png?fit=177%2C177&ssl=1"
    alt="Zalo"
    width={48}
    height={48}
    className={className}
    unoptimized
  />
);


interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  colorClass?: string;
  bgGradient?: string;
}

const ContactItem = ({ icon, title, subtitle, href, colorClass, bgGradient }: ContactItemProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-48 items-center gap-3 rounded-2xl bg-white p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${colorClass}`}
        style={{ background: bgGradient }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800 group-hover:text-amber-600">
          {title}
        </span>
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
    </a>
  );
};

export const StickyContact = () => {
  const { data: configData, isLoading } = api.systemConfig.getAll.useQuery();
  
  // Extract settings from config
  const config = React.useMemo(() => {
    if (!configData) return { zalo: '', facebook: '', hotline: '' };
    
    const configMap = configData.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
    
    return {
      zalo: configMap['SOCIAL_ZALO'] || '',
      facebook: configMap['SOCIAL_FACEBOOK'] || '',
      hotline: configMap['HOTLINE'] || '',
    };
  }, [configData]);

  // Don't render if still loading or no contact info configured
  if (isLoading || (!config.zalo && !config.facebook && !config.hotline)) {
    return null;
  }

  return (
    <div className="fixed right-4 top-1/2 z-[100] flex -translate-y-1/2 flex-col gap-4">
      {/* Messenger - only show if Facebook page ID is configured */}
      {config.facebook && (
        <ContactItem
          title="Chat Facebook"
          subtitle="(8h-23h)"
          href={`https://m.me/${config.facebook}`}
          icon={<FaFacebookMessenger className="h-6 w-6" />}
          bgGradient="linear-gradient(45deg, #00B2FF 0%, #006AFF 100%)"
        />
      )}

      {/* Zalo - only show if Zalo phone is configured */}
      {config.zalo && (
        <ContactItem
          title="Chat Zalo"
          subtitle="(8h-23h)"
          href={`https://zalo.me/${config.zalo}`}
          icon={<ZaloIcon className="h-12 w-12" />}
          colorClass="!bg-transparent !p-0" 
        />
      )}

      {/* Hotline - only show if hotline is configured */}
      {config.hotline && (
        <ContactItem
          title="Hotline Tư Vấn"
          subtitle="(8h-21h)"
          href={`tel:${config.hotline}`}
          icon={<FaPhoneAlt className="h-5 w-5" />}
          colorClass="bg-red-500"
        />
      )}
    </div>
  );
};
