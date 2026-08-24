import React from 'react';

export function CategoryIcon({ category, className = 'w-5 h-5' }: { category: string; className?: string }) {
  const norm = category?.toUpperCase();

  switch (norm) {
    case 'SHAWARMA':
      // Wrap / Roll SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );
    case 'ROASTED':
    case 'CRISPY':
      // Chicken / Drumstick SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4c-3.5 0-6 2.5-6 6 0 2.5 1.5 4.5 3.5 5.5l-1.5 4.5h8l-1.5-4.5c2-.99 3.5-3 3.5-5.5 0-3.5-2.5-6-6-6z" />
        </svg>
      );
    case 'BURGER':
      // Burger SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 11h14M5 15h14M6 8a6 6 0 0112 0H6zm1 9a2 2 0 002 2h6a2 2 0 002-2H7z" />
        </svg>
      );
    case 'FISH':
      // Fish SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4C8 4 4 8 4 12s4 8 8 8c3 0 6-2 8-5l-4-3 4-3c-2-3-5-5-8-5z" />
        </svg>
      );
    case 'PIZZA':
      // Pizza slice SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3L3 18a14 14 0 0018 0L12 3zm0 6a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
        </svg>
      );
    case 'DRINKS':
      // Drink cup with straw SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 8h12l-1.5 12h-9L6 8zm10-5l-4 5m0-5h4" />
        </svg>
      );
    case 'EXTRAS':
    default:
      // Box / Package SVG icon
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
  }
}
