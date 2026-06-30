'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: 'cashier' | 'manager' | 'admin';
  navItems: NavItem[];
  userName: string;
  userRole: string;
}

export function Sidebar({ role, navItems, userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.push('/');
    }
  };

  const isActive = (path: string) => pathname === path;

  const roleColors = {
    cashier: 'text-[#E4002B]',
    manager: 'text-blue-600',
    admin: 'text-purple-600',
  };

  const roleLabels = {
    cashier: 'Cashier Portal',
    manager: 'Manager Portal',
    admin: 'Admin Portal',
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 border-b border-gray-200 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-200">
          <img 
            src="/kfc.png" 
            alt="Kuku Fried Chicken" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-bold text-[#E4002B] text-center">
          Kuku Fried Chicken
        </h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{roleLabels[role]}</p>
      </div>
      
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-2 ${
              isActive(item.href) 
                ? `bg-[#E4002B] text-white` 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Logout Button */}
      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link href={`/${role}/profile`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className={`w-10 h-10 rounded-full bg-[#E4002B] flex items-center justify-center text-white font-bold`}>
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-gray-500 uppercase">{userRole}</p>
          </div>
        </Link>
      </div>
    </aside>
    </>
  );
}
