# 🚀 Backend Setup Guide - KFC Cash Management System

## Overview
This guide will help you set up the complete backend for the KFC Cash Management System using:
- **Next.js API Routes** - Backend endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **NextAuth.js** - Authentication with role-based access

---

## 📋 Prerequisites

1. **PostgreSQL installed** on your system
   ```bash
   # Check if PostgreSQL is installed
   psql --version
   
   # If not installed on Ubuntu/Debian:
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # Start PostgreSQL service
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Node.js 20+** and npm installed

---

## 🗄️ Step 1: Database Setup

### 1.1 Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE kfc_cash_db;
CREATE USER kfc_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kfc_cash_db TO kfc_user;
\q
```

### 1.2 Update .env File

Update your `.env` file with the actual database credentials:

```env
DATABASE_URL="postgresql://kfc_user:your_secure_password@localhost:5432/kfc_cash_db?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# App Settings
VAT_RATE=0.15
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🔧 Step 2: Install Dependencies

```bash
cd KFC-cash-management

# Install authentication packages
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Prisma is already installed
```

---

## 📊 Step 3: Initialize Database with Prisma

### 3.1 Generate Prisma Client
```bash
npx prisma generate
```

### 3.2 Push Schema to Database
```bash
npx prisma db push
```

### 3.3 Seed Initial Data (Optional)
```bash
npx prisma db seed
```

### 3.4 Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```
This opens a web interface at `http://localhost:5555` to view/edit data.

---

## 🔐 Step 4: Test Authentication

### 4.1 Create First Admin User

You can use Prisma Studio or run this script:

```bash
node scripts/create-admin.js
```

Or manually in Prisma Studio:
1. Open `http://localhost:5555`
2. Go to `User` model
3. Add new record:
   - email: `admin@kfc.com`
   - name: `Admin User`
   - password: `$2a$10$...` (hashed password)
   - role: `ADMIN`

---

## 🧪 Step 5: Test API Endpoints

### 5.1 Test Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kfc.com","password":"password123"}'
```

### 5.2 Test Orders API
```bash
# Create Order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"menuItemId": "chicken-1", "quantity": 2, "price": 1450}
    ],
    "paymentChannel": "CASH",
    "waiter": "Desalegn"
  }'

# Get Orders
curl http://localhost:3000/api/orders
```

### 5.3 Test Menu API
```bash
# Get Menu Items
curl http://localhost:3000/api/menu

# Create Menu Item (requires auth)
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Item",
    "price": 500,
    "category": "CHICKEN"
  }'
```

---

## 📁 Backend File Structure

```
src/
├── app/
│   └── api/                    # API Routes
│       ├── auth/              # NextAuth endpoints
│       │   └── [...nextauth]/route.ts
│       ├── orders/            # Order management
│       │   └── route.ts
│       ├── menu/              # Menu management
│       │   └── route.ts
│       ├── expenses/          # Expense tracking
│       │   └── route.ts
│       └── users/             # User management
│           └── route.ts
│
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # NextAuth config
│   └── validations.ts         # Zod schemas
│
└── middleware.ts              # API protection
```

---

## 🔑 Step 6: Protected Routes

The middleware automatically protects routes:

- `/api/orders` - Requires authentication
- `/api/menu` - ADMIN only for POST/PUT/DELETE
- `/api/expenses` - Requires authentication
- `/api/users` - ADMIN only

---

## 🚀 Step 7: Connect Frontend to Backend

### Update Frontend to Use API

In your frontend components, replace localStorage with API calls:

```typescript
// Before (localStorage)
const [orders, setOrders] = useState([]);

// After (API)
const fetchOrders = async () => {
  const response = await fetch('/api/orders');
  const data = await response.json();
  setOrders(data);
};
```

---

## 📊 Step 8: Database Migrations

When you change the schema:

```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Apply to production
npx prisma migrate deploy
```

---

## 🔍 Step 9: Monitoring & Debugging

### View Logs
```bash
# Prisma query logs
npx prisma studio

# API logs
# Check terminal where npm run dev is running
```

### Common Issues

**Issue: Connection refused**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql
```

**Issue: Authentication failed**
```bash
# Check DATABASE_URL in .env
# Make sure user has correct permissions
```

**Issue: Prisma Client not generated**
```bash
# Regenerate
npx prisma generate
```

---

## 📝 Step 10: Testing Checklist

- [ ] PostgreSQL database created
- [ ] Prisma schema pushed to database
- [ ] Admin user created
- [ ] Can login via NextAuth
- [ ] API endpoints return data
- [ ] Protected routes require authentication
- [ ] Frontend can fetch from API
- [ ] Orders can be created and retrieved
- [ ] Menu items can be managed
- [ ] Expenses can be recorded

---

## 🎯 Next Steps

1. **Seed Sample Data**
   ```bash
   npx prisma db seed
   ```

2. **Connect Frontend Forms**
   - Update POS to call `/api/orders` on finalize
   - Update expenses page to call `/api/expenses`
   - Update menu management to call `/api/menu`

3. **Add Real-time Features** (Optional)
   - WebSockets for live order updates
   - Server-Sent Events for notifications

4. **Deploy to Production**
   - Set up production database
   - Update environment variables
   - Deploy to Vercel/AWS

---

## 📚 Useful Commands

```bash
# Prisma
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create & apply migration
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema without migration
npx prisma db pull             # Pull schema from existing DB

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server

# Database
psql -U kfc_user -d kfc_cash_db  # Connect to database
```

---

## ✅ Success Indicators

You'll know the backend is working when:

1. ✅ Prisma Studio shows all tables
2. ✅ You can create users
3. ✅ You can login and receive session
4. ✅ API returns JSON responses
5. ✅ Frontend can create/read/update/delete data
6. ✅ Authentication protects sensitive routes

---

**Need Help?**
- Check Prisma logs: `npx prisma studio`
- Check API logs: Terminal where dev server runs
- Database issues: Check PostgreSQL logs

**Ready to proceed!** 🚀
