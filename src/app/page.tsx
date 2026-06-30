'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#E4002B] to-[#C4002B] flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">CASHFLOW PRO</h1>
          <p className="text-2xl text-red-100">KFC Cash Management System</p>
        </div>

        {/* Cashier Button */}
        <div className="space-y-4">
          <Link 
            href="/cashier/pos"
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#E4002B] rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            CASHIER PORTAL
          </Link>

          {/* Placeholder for future roles */}
          <div className="pt-8 space-y-3">
            <button 
              disabled
              className="inline-flex items-center gap-3 px-12 py-4 bg-gray-400 text-white rounded-xl font-semibold text-lg opacity-50 cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              MANAGER PORTAL
              <span className="text-xs">(Coming Soon)</span>
            </button>
            
            <button 
              disabled
              className="inline-flex items-center gap-3 px-12 py-4 bg-gray-400 text-white rounded-xl font-semibold text-lg opacity-50 cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ADMIN PORTAL
              <span className="text-xs">(Coming Soon)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-red-100 text-sm">
          <p>© 2024 Kuku Fried Chicken - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
