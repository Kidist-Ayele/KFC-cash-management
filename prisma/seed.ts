import { PrismaClient } from '@prisma/client';
import { INITIAL_MENU_ITEMS } from '../src/constants/menu';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default users
  await prisma.user.upsert({
    where: { email: 'cashier@kfc.com' },
    update: {},
    create: {
      email: 'cashier@kfc.com',
      name: 'Lishan B.',
      password: 'password123',
      role: 'CASHIER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@kfc.com' },
    update: {},
    create: {
      email: 'manager@kfc.com',
      name: 'Manager M.',
      password: 'password123',
      role: 'MANAGER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@kfc.com' },
    update: {},
    create: {
      email: 'admin@kfc.com',
      name: 'Super Admin',
      password: 'password123',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Users verified');

  // Seed Waiters
  const waiters = ['Desalegn', 'Marta', 'Serkalem', 'Abebe'];
  for (const name of waiters) {
    await prisma.waiter.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
  }
  console.log('✅ Waiters created/verified');

  // Insert all menu items from kuku-kfc.vercel.app
  console.log(`📦 Seeding ${INITIAL_MENU_ITEMS.length} menu items from digital menu...`);
  for (const item of INITIAL_MENU_ITEMS) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description || null,
        isAvailable: true,
      },
    });
  }

  console.log('🎉 Seeding complete with live KUKU digital menu!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
