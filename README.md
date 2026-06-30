# KFC Cash Management System

A modern, role-based cash management system for Kuku Fried Chicken restaurant built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

### Cashier Portal
- **Point of Sale (POS)**: Fast order creation with real-time cart management
- **Daily Log**: Complete transaction overview with analytics
- **Expense Tracking**: Record and manage restaurant expenses
- **Profile Management**: User settings and activity summary

### Key Capabilities
- ✅ Multi-payment support (Telebirr, Kuku CBE, Samuel CBE, Cash)
- ✅ Automatic VAT calculation (15%)
- ✅ Waiter performance tracking
- ✅ Transaction filtering and search
- ✅ Payment method analytics
- ✅ Real-time order management

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **UI Components**: Custom components + Shadcn/ui

## 📁 Project Structure

```
src/
├── app/
│   ├── cashier/              # Cashier role routes
│   │   ├── pos/              # Point of Sale
│   │   ├── dailylog/         # Daily transaction log
│   │   ├── expenses/         # Expense tracking
│   │   └── profile/          # Profile settings
│   └── page.tsx              # Landing page
├── components/
│   ├── cashier/              # POS-specific components
│   ├── dailylog/             # Daily log components
│   ├── expenses/             # Expense components
│   ├── profile/              # Profile components (reusable)
│   ├── shared/               # Shared components (sidebar, header)
│   └── ui/                   # Base UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── types/                    # TypeScript types
└── constants/                # Static data (menu, payments)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kfc-cash-management.git
cd kfc-cash-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/kfc_db"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

### Colors
- **Primary Red**: `#E4002B` (KFC brand color)
- **Hover Red**: `#C4002B`
- **Yellow Accent**: `#FCD116`

### Component Philosophy
- **Page files**: State management and business logic only (~50-150 lines)
- **Components**: UI rendering and presentation
- **Reusable**: Components work across different roles

## 📊 Current Status

### ✅ Completed
- Landing page with role selection
- Complete cashier portal (POS, Daily Log, Expenses, Profile)
- Component-based architecture
- Responsive design
- Mock data implementation

### 🚧 Coming Soon
- Backend API integration
- Database connectivity
- Manager role portal
- Admin dashboard
- Authentication & authorization
- Real-time updates
- CSV export functionality

## 🗂️ Database Schema

```prisma
- User (id, email, name, role, password)
- MenuItem (id, name, price, category)
- Order (id, orderNumber, total, status, paymentChannel)
- OrderItem (id, orderId, menuItemId, quantity, price)
- Expense (id, description, amount, category)
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: Your Name
- **Restaurant**: Kuku Fried Chicken

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent ORM

---

**Note**: This is the frontend implementation. Backend API integration is in progress.
