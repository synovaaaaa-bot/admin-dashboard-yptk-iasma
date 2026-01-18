import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get counts
    const [
      newsCount,
      programCount,
      donorCount,
      donationCount,
      pendingDonations,
      verifiedDonations,
    ] = await Promise.all([
      prisma.news.count(),
      prisma.program.count(),
      prisma.donor.count(),
      prisma.donation.count(),
      prisma.donation.count({ where: { status: 'PENDING' } }),
      prisma.donation.count({ where: { status: 'VERIFIED' } }),
    ])

    // Get total donation amount
    const totalDonations = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'VERIFIED',
      }
    })

    // Get monthly donations for current year
    const currentYear = new Date().getFullYear()
    const monthlyDonations = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "donatedAt") as month,
        SUM(amount) as total
      FROM "Donation"
      WHERE EXTRACT(YEAR FROM "donatedAt") = ${currentYear}
      AND status = 'VERIFIED'
      GROUP BY EXTRACT(MONTH FROM "donatedAt")
      ORDER BY month
    `

    // Get recent activities
    const recentNews = await prisma.news.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      }
    })

    const recentDonations = await prisma.donation.findMany({
      take: 5,
      orderBy: { donatedAt: 'desc' },
      include: {
        donor: {
          select: {
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      counts: {
        news: newsCount,
        programs: programCount,
        donors: donorCount,
        donations: donationCount,
        pendingDonations,
        verifiedDonations,
      },
      totalDonationAmount: totalDonations._sum.amount || 0,
      monthlyDonations,
      recentNews,
      recentDonations,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
