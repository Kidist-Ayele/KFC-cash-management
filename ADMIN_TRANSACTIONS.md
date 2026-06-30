# Admin Transactions Page

## Overview
The Super Admin can now view all transactions from all branches in a single consolidated view.

## Location
- **Route**: `/admin/transactions`
- **Navigation**: Second item in Admin sidebar (after Dashboard)

## Features

### 1. Summary Cards (Top)
- **Total Revenue**: Sum of all transactions
- **Total Orders**: Count of all orders
- **Average Order Value**: Revenue / Orders
- **Total VAT**: Sum of all VAT collected

### 2. Filters
- **Branch Filter**: View all branches or select specific branch
- **Payment Method Filter**: Filter by CASH, TELEBIRR, KUKU_CBE, SAMUEL_CBE
- **Date Range Filter**: Today, Yesterday, This Week, This Month, Custom Range
- **Search Box**: Search by Order Number or Cashier name

### 3. Transactions Table

#### Desktop View
Full table with columns:
- Order Number
- Branch Name
- Cashier Name
- Waiter Name
- Number of Items
- Subtotal Amount
- VAT Amount
- Total Amount
- Payment Method (with colored badges)
- Timestamp
- Actions (View Details button)

#### Mobile View
Card layout showing:
- Order number and branch at top
- Timestamp
- Payment method badge
- Cashier and waiter info
- Items count and subtotal
- Total amount prominently displayed
- VAT amount
- Details button

### 4. Export Functionality
- Export to Excel button (UI ready, backend integration needed)

## Data Flow

### Current (Mock Data)
```typescript
{
  id: '1',
  orderNumber: 'ORDER#001',
  branch: 'Main Branch',
  cashier: 'Cashier A',
  waiter: 'Desalegn',
  items: 3,
  subtotal: 680,
  vat: 102,
  total: 782,
  paymentMethod: 'TELEBIRR',
  status: 'COMPLETED',
  timestamp: '2024-06-30 14:30:00',
}
```

### Future (API Integration)
```typescript
// GET /api/admin/transactions?branch=all&date=today&payment=all
// Returns: { transactions: [], summary: {} }
```

## Components

### Main Page
- `src/app/admin/transactions/page.tsx`
- Handles state management, filtering logic
- Calculates summary statistics

### Table Component
- `src/components/admin/AllTransactionsTable.tsx`
- Responsive desktop/mobile views
- Payment method color coding
- Empty state handling

## Color Coding

### Payment Methods
- **Cash**: Green (`bg-green-100 text-green-700`)
- **Telebirr**: Blue (`bg-blue-100 text-blue-700`)
- **Kuku CBE**: Purple (`bg-purple-100 text-purple-700`)
- **Samuel CBE**: Orange (`bg-orange-100 text-orange-700`)

## Responsive Design
- **Mobile** (< 1024px): Card view with vertical layout
- **Desktop** (≥ 1024px): Full table view with horizontal scroll

## Difference from Audit Logs

### Transactions Page
- Shows **financial operations** (orders, sales, payments)
- Branch-level visibility
- Payment method tracking
- Revenue and VAT calculations
- Used for accounting and financial reporting

### Audit Logs Page
- Shows **system actions** (user created, menu updated, settings changed)
- Security and compliance tracking
- Who did what, when
- Used for security audits and compliance

## Future Enhancements
1. Real-time updates (WebSocket)
2. Transaction details modal (order items breakdown)
3. Refund/void functionality
4. Print receipt capability
5. Advanced date range picker
6. CSV/Excel export implementation
7. Email transaction reports
8. Chart visualizations (revenue trends)
