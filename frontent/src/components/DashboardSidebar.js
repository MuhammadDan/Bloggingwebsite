'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardSidebar({ user, isOpen, onClose, isAdmin }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navItems = isAdmin
    ? [
        { label: 'Dashboard', href: '/admin/dashboard', icon: '⊞' },
        { label: 'Blog Posts', href: '/admin/dashboard', icon: '📖' },
        { label: 'Comments', href: '/admin/dashboard', icon: '💬' },
      ]
    : [
        { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
        { label: 'Blog Posts', href: '/dashboard/articles', icon: '📖' },
        { label: 'Comments', href: '/dashboard/comments', icon: '💬' },
      ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-white border-r border-slate-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center px-5 pt-7 pb-5 border-b border-slate-100">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover mb-3 ring-2 ring-blue-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <p className="font-semibold text-sm text-gray-900 text-center">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-400 mt-0.5 text-center break-all">{user?.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <a
                key={label}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 w-full transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}