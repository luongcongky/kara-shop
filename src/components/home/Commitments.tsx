import React from 'react';
import { FiShield, FiRotateCcw, FiTruck, FiCreditCard } from 'react-icons/fi';
export const Commitments = () => {

  const items = [
    {
      icon: FiShield,
      title: 'Bảo hành 24 tháng',
      desc: 'Chính hãng từ nhà sản xuất',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: FiRotateCcw,
      title: 'Đổi trả 7 ngày',
      desc: 'Lỗi là đổi mới ngay lập tức',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      icon: FiCreditCard,
      title: 'Trả góp 0%',
      desc: 'Thủ tục nhanh, xét duyệt sớm',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      icon: FiTruck,
      title: 'Giao hàng 2h',
      desc: 'Nội thành nhận hàng siêu tốc',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div 
              key={index}
              className="group flex items-center gap-5 rounded-3xl border border-zinc-100 bg-zinc-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <item.icon size={28} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
                <p className="text-xs font-medium text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
