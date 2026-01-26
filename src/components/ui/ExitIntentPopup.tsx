import { useState, useEffect } from 'react';
import { FiX, FiGift } from 'react-icons/fi';

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseOut);
    return () => document.removeEventListener('mouseleave', handleMouseOut);
  }, [hasShown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-zinc-100">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-6 top-6 z-10 rounded-full bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-orange-500 hover:text-white"
        >
          <FiX size={20} />
        </button>

        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-white shadow-lg shadow-orange-500/40 transform -rotate-12 group-hover:rotate-0 transition-transform">
            <FiGift size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-white">
            Dành riêng cho bạn
          </h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
             Exclusive Offer
          </p>
        </div>

        <div className="p-10 text-center">
          <p className="mb-8 text-lg font-medium text-zinc-600 leading-relaxed">
             Nhập mã <span className="font-black text-zinc-900 underline decoration-orange-500 decoration-4">TUNGSONY</span> để nhận ưu đãi <span className="text-orange-600 font-bold">Giá Đại lý cấp 1</span> ngay hôm nay.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full rounded-2xl bg-zinc-900 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-orange-500 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
          >
            Nhận ưu đãi ngay
          </button>
          <p className="mt-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">
            * Chỉ áp dụng cho 5 đơn hàng đầu tiên trong ngày
          </p>
        </div>
      </div>
    </div>
  );
};
