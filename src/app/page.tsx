'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#E4002B] to-[#C4002B] flex items-center justify-center p-4">
      <div className="text-center max-w-4xl w-full">
        {/* Logo/Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4">CASHFLOW PRO</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-red-100">KFC Cash Management System</p>
        </div>

        {/* Cashier Button */}
        <div className="space-y-4">
          <Link 
            href="/cashier/pos"
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-6 bg-white text-[#E4002B] rounded-xl font-bold text-lg sm:text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 w-full sm:w-auto"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            CASHIER PORTAL
          </Link>

          {/* Other roles */}
          <div className="pt-6 sm:pt-8 space-y-3">
            <Link 
              href="/manager/dashboard"
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              MANAGER PORTAL
            </Link>

            <Link 
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SUPER ADMIN
            </Link>
            
            <button 
              disabled
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3 sm:py-4 bg-gray-400 text-white rounded-xl font-semibold text-base sm:text-lg opacity-50 cursor-not-allowed w-full sm:w-auto"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">WAITER PORTAL</span>
              <span className="sm:hidden">WAITER</span>
              <span className="text-xs">(Coming Soon)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-red-100 text-xs sm:text-sm">
          <p>© 2024 Kuku Fried Chicken - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
