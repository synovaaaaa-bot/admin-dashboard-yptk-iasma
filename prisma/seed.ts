import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yptkiasma.org' },
    update: {},
    create: {
      email: 'admin@yptkiasma.org',
      name: 'Admin YPT Kiasma',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample news
  const news1 = await prisma.news.create({
    data: {
      title: 'Selamat Datang di YPT Kiasma',
      slug: 'selamat-datang-di-ypt-kiasma',
      content: '<p>Selamat datang di sistem admin YPT Kiasma. Gunakan dashboard ini untuk mengelola konten website.</p>',
      excerpt: 'Selamat datang di sistem admin YPT Kiasma',
      status: 'PUBLISHED',
      category: 'Pengumuman',
      tags: ['admin', 'welcome'],
      publishedAt: new Date(),
      authorId: admin.id,
    },
  })

  console.log('✅ Sample news created')

  // Create sample program
  const program1 = await prisma.program.create({
    data: {
      title: 'Program Pendidikan 2024',
      slug: 'program-pendidikan-2024',
      description: '<p>Program pendidikan untuk tahun 2024</p>',
      status: 'UPCOMING',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      location: 'Jakarta',
      maxParticipants: 100,
      authorId: admin.id,
    },
  })

  console.log('✅ Sample program created')

  // Create sample donor
  const donor1 = await prisma.donor.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '08123456789',
      address: 'Jakarta, Indonesia',
    },
  })

  console.log('✅ Sample donor created')

  // Create sample donation
  const donation1 = await prisma.donation.create({
    data: {
      amount: 500000,
      paymentMethod: 'Transfer Bank',
      status: 'VERIFIED',
      donorId: donor1.id,
      verifiedAt: new Date(),
    },
  })

  console.log('✅ Sample donation created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
