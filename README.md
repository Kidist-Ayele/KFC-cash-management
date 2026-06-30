# KFC Cash Management System

A comprehensive cash management system for KFC restaurants built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## 🚀 Features

### Cashier Portal
- **Point of Sale (POS)**: Process orders with real-time calculations
- **Daily Log**: View transaction history and analytics
- **Expenses Management**: Track and manage restaurant expenses
- **Profile Management**: Update personal information

### Manager Portal
- **Dashboard**: Overview of restaurant performance
- **Menu Management**: Add, edit, and manage menu items
- **Staff Management**: Manage cashiers and waiters
- **Reports & Analytics**: Comprehensive business insights

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd KFC-cash-management
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

## 📱 User Roles

### Cashier
- Access: `/cashier`
- Credentials: (Set up in database)

### Manager
- Access: `/manager`
- Credentials: (Set up in database)

## 🗄️ Database Schema

The system uses the following main models:
- **User**: System users with role-based access
- **MenuItem**: Restaurant menu items
- **Order**: Customer orders
- **OrderItem**: Individual items in orders

## 📦 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── cashier/           # Cashier portal
│   └── manager/           # Manager portal
├── components/            # React components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
└── types/                 # TypeScript types
```

## 🚀 Deployment

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 📝 License

Private project - All rights reserved

## 👥 Support

For support, contact your system administrator.
