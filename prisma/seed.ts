import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create or update users
  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@kfc.com' },
    update: {},
    create: {
      email: 'cashier@kfc.com',
      name: 'Lishan B.',
      password: 'password123',
      role: 'CASHIER',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@kfc.com' },
    update: {},
    create: {
      email: 'manager@kfc.com',
      name: 'Manager M.',
      password: 'password123',
      role: 'MANAGER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kfc.com' },
    update: {},
    create: {
      email: 'admin@kfc.com',
      name: 'Super Admin',
      password: 'password123',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Users verified/created');

  // Check if menu items exist
  const existingMenuCount = await prisma.menuItem.count();
  if (existingMenuCount === 0) {
    await prisma.menuItem.createMany({
      data: [
        { name: 'Zinger Burger', price: 450, category: 'BURGERS', description: 'Spicy chicken burger' },
        { name: 'Chicken Pieces (4pc)', price: 380, category: 'CHICKEN', description: '4 pieces of fried chicken' },
        { name: 'Chicken Pieces (6pc)', price: 550, category: 'CHICKEN', description: '6 pieces of fried chicken' },
        { name: 'Colonel Burger', price: 400, category: 'BURGERS', description: 'Classic chicken burger' },
        { name: 'Twister Wrap', price: 420, category: 'BURGERS', description: 'Chicken wrap' },
        { name: 'Coca Cola', price: 50, category: 'DRINKS', description: '330ml bottle' },
        { name: 'Sprite', price: 50, category: 'DRINKS', description: '330ml bottle' },
        { name: 'Fanta', price: 50, category: 'DRINKS', description: '330ml bottle' },
        { name: 'French Fries', price: 80, category: 'EXTRAS', description: 'Crispy fries' },
        { name: 'Coleslaw', price: 70, category: 'EXTRAS', description: 'Fresh coleslaw' },
      ],
    });
    console.log('✅ Menu items created');
  } else {
    console.log(`✅ Menu items already exist (${existingMenuCount} items)`);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
