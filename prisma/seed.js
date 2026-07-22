// Using bcryptjs to hash at runtime
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'shubham@samyak.com'
const ADMIN_NAME = 'Shubham Admin'
const ADMIN_PASSWORD = 'Password@samyak'

async function main() {
  const ADMIN_PASSWORD_HASH = await bcrypt.hash(ADMIN_PASSWORD, 10)

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
  console.log('   Password: ' + ADMIN_PASSWORD)
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
