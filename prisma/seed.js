const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@samyak.org'
  const password = 'Samyak@2025'
  const name = 'Samyak Admin'

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Upsert: create if not exists, update if exists
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
    },
    create: {
      email,
      password: hashedPassword,
      name,
    },
  })

  console.log('✅ Admin seeded successfully:')
  console.log(`   Email:    ${admin.email}`)
  console.log(`   Name:     ${admin.name}`)
  console.log(`   Password: ${password}`)
  console.log('\n🔒 Change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
