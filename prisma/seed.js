// Self-contained seed — no bcryptjs needed at runtime.
// Password hash was pre-generated with: bcrypt.hash('Samyak@2025', 10)
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Pre-hashed password: Samyak@2025
const ADMIN_EMAIL = 'admin@samyak.org'
const ADMIN_NAME = 'Samyak Admin'
const ADMIN_PASSWORD_HASH = '$2b$10$iF4zdSmnH/VRP407vd3Q..BDXfWhUsl5CxAva3DCJGkxID6.P9KoW'

async function main() {
  const admin = await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: ADMIN_PASSWORD_HASH,
      name: ADMIN_NAME,
    },
    create: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD_HASH,
      name: ADMIN_NAME,
    },
  })

  console.log('✅ Admin seeded successfully:')
  console.log('   Email:    ' + admin.email)
  console.log('   Name:     ' + admin.name)
  console.log('   Password: Samyak@2025')
  console.log('')
  console.log('🔒 Change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
