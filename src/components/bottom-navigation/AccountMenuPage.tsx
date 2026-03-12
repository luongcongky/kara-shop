import Link from 'next/link';
import { FiX, FiUser, FiShoppingBag, FiPackage, FiLayout, FiFileText, FiLogOut } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';

interface Props {
  onPageClose: () => void;
}

export const AccountMenuPage = ({ onPageClose }: Props) => {
  const { data: session } = useSession();

  if (!session) return null;

  const isAdmin = session.user?.role === 'ADMIN';

  const menuItems = [
    {
      title: 'Thông tin cá nhân',
      href: '/profile',
      icon: FiUser,
    },
    {
      title: 'Quản lý đơn hàng',
      href: isAdmin ? '/admin/orders' : '/orders',
      icon: FiShoppingBag,
    },
  ];

  const adminItems = [
    {
      title: 'Quản lý sản phẩm',
      href: '/admin/products',
      icon: FiPackage,
    },
    {
      title: 'Quản lý trang Home',
      href: '/admin/homepage',
      icon: FiLayout,
    },
    {
      title: 'Quản lý bài viết',
      href: '/admin/context',
      icon: FiFileText,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 top-0 z-[100] h-full w-full overflow-y-auto bg-white px-5 pt-5 pb-20 animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-zinc-900">Tài khoản</h2>
        <button 
          onClick={onPageClose}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <FiX size="1.5rem" className="text-zinc-500" />
        </button>
      </div>

      <div className="space-y-8">
        {/* User Info / Profile Section */}
        <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-lg">
            {session.user?.name?.[0] || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">{session.user?.name}</h3>
            <p className="text-sm text-zinc-500 line-clamp-1">{session.user?.email}</p>
          </div>
        </div>

        {/* General Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2">Cá nhân</h4>
          <ul className="grid gap-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onPageClose}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 text-zinc-700">
                    <item.icon className="text-zinc-400 group-hover:text-violet-600 transition-colors" size="1.2rem" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Links */}
        {isAdmin && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 px-2">Quản trị viên</h4>
            <ul className="grid gap-1">
              {adminItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onPageClose}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 text-zinc-700">
                      <item.icon className="text-zinc-400 group-hover:text-orange-600 transition-colors" size="1.2rem" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Logout Section */}
        <div className="pt-4 border-t border-zinc-100">
          <button
            onClick={() => {
              onPageClose();
              signOut();
            }}
            className="flex w-full items-center gap-4 rounded-xl p-4 text-red-600 hover:bg-red-50 transition-colors font-bold"
          >
            <FiLogOut size="1.2rem" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};
