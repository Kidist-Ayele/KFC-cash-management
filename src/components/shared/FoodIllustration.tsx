import React from 'react';

export function FoodIllustration({ name, category, className = 'w-10 h-10' }: { name?: string; category: string; className?: string }) {
  const n = (name || '').toLowerCase();
  const c = (category || '').toUpperCase();

  // 1. Specific drink / item checks
  if (n.includes('shake') || n.includes('chocolate')) {
    // Milkshake with whipped cream & straw
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <path d="M16 20h16l-3 22H19L16 20z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 20c0-4 3-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="2.5" />
        <path d="M26 6l4 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="12" r="2" fill="currentColor" />
        <path d="M18 28h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
    );
  }

  if (n.includes('mojito')) {
    // Mojito glass with mint & lime
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <path d="M15 14h18l-2 26H17L15 14z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M22 8l8 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M19 18c2-2 5-2 7 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('water')) {
    // Water bottle / drop
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <rect x="18" y="14" width="12" height="26" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 14V8h8v6" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 22c-2 2.5-3 4-3 5.5a3 3 0 006 0c0-1.5-1-3-3-5.5z" fill="currentColor" />
      </svg>
    );
  }

  if (n.includes('soft drink') || n.includes('soda') || n.includes('bottle')) {
    // Glass soda bottle
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none">
        <path d="M21 8h6v5l3 5v20a2 2 0 01-2 2H20a2 2 0 01-2-2V18l3-5V8z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 26h12" stroke="currentColor" strokeWidth="2" />
        <path d="M20 32h8" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // 2. Category-based illustrations
  switch (c) {
    case 'SHAWARMA':
      // Delicious folded Wrap / Burrito / Shawarma roll
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <rect x="12" y="14" width="24" height="20" rx="10" transform="rotate(-25 24 24)" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
          <path d="M16 28l16-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 34l12-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="18" r="2" fill="currentColor" />
          <circle cx="34" cy="23" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'ROASTED':
    case 'CRISPY':
      // Roasted chicken drumstick & roasted feast
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <path d="M29 13c-4-4-10-3-13 1s-2 9 2 13l4 4 11-11-4-7z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="22" cy="20" r="2.5" fill="currentColor" />
          <path d="M32 31l5 5m-1 3a2.5 2.5 0 11-3.5-3.5 2.5 2.5 0 114 1z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 19c-1 3 0 6 2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'BURGER':
      // Stacked gourmet burger (top bun with sesame, patty, cheese, bottom bun)
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <path d="M11 20c0-6.5 5.8-11 13-11s13 4.5 13 11H11z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="18" cy="15" r="1" fill="currentColor" />
          <circle cx="24" cy="13" r="1" fill="currentColor" />
          <circle cx="30" cy="15" r="1" fill="currentColor" />
          <path d="M9 25h30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 25l4 4 4-4 4 4 4-4 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="11" y="31" width="26" height="5" rx="2.5" fill="currentColor" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );

    case 'FISH':
      // Whole grilled fish with fins and gills
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <path d="M9 24c8-9 22-9 30 0-8 9-22 9-30 0z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M39 24l7-5v10l-7-5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="16" cy="22" r="1.5" fill="currentColor" />
          <path d="M22 19c2 3 2 7 0 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 20c1.5 2 1.5 6 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'PIZZA':
      // Pizza slice with pepperoni
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <path d="M12 11l23 7-13 22L12 11z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M12 11c7-2 16 0 23 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="21" cy="21" r="2.5" fill="currentColor" />
          <circle cx="25" cy="29" r="2" fill="currentColor" />
          <circle cx="17" cy="28" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'DRINKS':
      // Fresh cocktail / juice glass with fruit wedge & straw
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <path d="M14 18h20l-3 20H17L14 18z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M12 18h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 8l5 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="27" r="3" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );

    case 'EXTRAS':
    default:
      // Food box / Takeaway package
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
          <rect x="11" y="18" width="26" height="20" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
          <path d="M7 18l5-6h24l5 6" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 18v20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );
  }
}
