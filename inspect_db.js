import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  console.log('Inspecting User and Account tables...');
  const users = await prisma.user.findMany({ include: { accounts: true } });
  
  if (users.length === 0) {
    console.log('No users found.');
  } else {
    users.forEach(user => {
      console.log(`User: ${user.email} (ID: ${user.id})`);
      user.accounts.forEach(account => {
        console.log(`  Account: ${account.providerId} (ID: ${account.id})`);
        console.log(`  Password field present: ${!!account.password}`);
      });
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
