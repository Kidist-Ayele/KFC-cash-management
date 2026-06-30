'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function CashierSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.push('/');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#E4002B]">Cashier Portal</h2>
        <p className="text-sm text-gray-600 mt-1">Cash Management System</p>
      </div>
      
      <nav className="flex-1 p-4">
        <Link 
          href="/cashier/pos" 
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-2 ${
            isActive('/cashier/pos') 
              ? 'bg-[#E4002B] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-medium">Point of Sale</span>
        </Link>
        
        <Link 
          href="/cashier/dailylog" 
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-2 ${
            isActive('/cashier/dailylog') 
              ? 'bg-[#E4002B] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">Daily Log</span>
        </Link>
        
        <Link 
          href="/cashier/expenses" 
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg ${
            isActive('/cashier/expenses') 
              ? 'bg-[#E4002B] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-medium">Expenses</span>
        </Link>
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
        <Link href="/cashier/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#E4002B] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Lishan B.</p>
            <p className="text-xs text-gray-500">CASHIER</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
