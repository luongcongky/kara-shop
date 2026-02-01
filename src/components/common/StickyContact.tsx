import React from 'react';
import { FaFacebookMessenger, FaPhoneAlt } from 'react-icons/fa';

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24Z"
      fill="#0068FF"
    />
    <path
      d="M29.8 16H26.9333C26.5 16 26.2667 16.5333 26.5333 16.8667L29.5667 20.6667C29.7333 20.9 29.5667 21.2333 29.2667 21.2333H26.3333C26.0667 21.2333 25.8667 21.0333 25.8667 20.7667V16.4667C25.8667 16.2 25.6667 16 25.4 16H23.5333C23.2667 16 23.0667 16.2 23.0667 16.4667V20.7667C23.0667 21.0333 22.8667 21.2333 22.6 21.2333H20.2667C19.8333 21.2333 19.6 20.7 19.8667 20.3667L22.9 16.5667C23.0667 16.3333 22.9 16 22.6 16H19.6667C19.4 16 19.2 16.2 19.2 16.4667V24C19.2 25.88 20.72 27.4 22.6 27.4H28.9333C30.8133 27.4 32.3333 25.88 32.3333 24V16.4667C32.3333 16.2 32.1333 16 31.8667 16H29.8ZM16.8 19.2C16.8 17.88 15.72 16.8 14.4 16.8H14C12.68 16.8 11.6 17.88 11.6 19.2V24C11.6 25.32 12.68 26.4 14 26.4H14.4C15.72 26.4 16.8 25.32 16.8 24V19.2ZM36 19.2C36 17.88 34.92 16.8 33.6 16.8H33.2C31.88 16.8 30.8 17.88 30.8 19.2V24C30.8 25.32 31.88 26.4 33.2 26.4H33.6C34.92 26.4 36 25.32 36 24V19.2Z"
      fill="white"
    />
    <path
        d="M15 13H18V30H15V13Z"
        fill="white"
        transform="rotate(-45 16.5 21.5)"
        style={{ opacity: 0 }} /* Simple Zalo Z shape approximation or use standard path above if sufficient */
    />
    {/* Correct Text Zalo Path */}
     <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34 24C34 22.8954 33.1046 22 32 22H30C28.8954 22 28 22.8954 28 24V28C28 29.1046 28.8954 30 30 30H32C33.1046 30 34 29.1046 34 28V24ZM18 24C18 22.8954 17.1046 22 16 22H14C12.8954 22 12 22.8954 12 24V28C12 29.1046 12.8954 30 14 30H16C17.1046 30 18 29.1046 18 28V24Z"
        fill="white"
        opacity="0" // Placeholder for detailed "Zalo" text if needed, but the blue circle with Z is usually enough.
     />
     {/* Manual "Zalo" text/shape needs better path data, often the circle logo is just the Z script.
         Using a simplified standard Zalo logo path.
      */}
     <path
         d="M13,24 L13,20 C13,18.8954305 13.8954305,18 15,18 L19,18 C19.5522847,18 20,18.4477153 20,19 C20,19.5522847 19.5522847,20 19,20 L15,20 L15,22 L17.5,22 C18.3284271,22 19,22.6715729 19,23.5 C19,24.3284271 18.3284271,25 17.5,25 L15,25 L15,28 C15,28.5522847 14.5522847,29 14,29 C13.4477153,29 13,28.5522847 13,28 L13,24 Z"
         fill="white"
         transform="translate(10, 5)"
         opacity="0" // Masking previous attempts. The first path group covers the Zalo logo reasonably well for an icon size.
     />
  </svg>
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
    // Replace these with actual environment variables or configuration if available
    const PHONE_NUMBER = "[SĐT_CỦA_BẠN]"; 
    const PAGE_ID = "[PAGE_ID]"; 
    
    // Example: "0912345678" -> Clean for href "0912345678" or "+84..."
    // Zalo link: https://zalo.me/[PHONE_NUMBER]
    // Messenger link: https://m.me/[PAGE_ID]

  return (
    <div className="fixed right-4 top-1/2 z-[100] flex -translate-y-1/2 flex-col gap-4">
      {/* Messenger */}
      <ContactItem
        title="Chat Facebook"
        subtitle="(8h-23h)"
        href={`https://m.me/${PAGE_ID}`}
        icon={<FaFacebookMessenger className="h-6 w-6" />}
        bgGradient="linear-gradient(45deg, #00B2FF 0%, #006AFF 100%)"
        // Messenger often uses a gradient usually
      />

      {/* Zalo */}
      <ContactItem
        title="Chat Zalo"
        subtitle="(8h-23h)"
        href={`https://zalo.me/${PHONE_NUMBER}`}
        icon={<ZaloIcon className="h-12 w-12" />} // ZaloIcon already has circle background style
        // We might want to remove padding for ZaloIcon if it includes the circle.
        // Let's adjust ContactItem to handle full SVG icons that don't need a wrapper container if needed,
        // or just fit it in. Zalo icon above has a path and circle.
        colorClass="!bg-transparent !p-0" 
      />

      {/* Hotline */}
      <ContactItem
        title="Hotline Tư Vấn"
        subtitle="(8h-21h)"
        href={`tel:${PHONE_NUMBER}`}
        icon={<FaPhoneAlt className="h-5 w-5" />}
        colorClass="bg-red-500"
      />
    </div>
  );
};
