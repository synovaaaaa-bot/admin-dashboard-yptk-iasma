import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        include: {
          donations: {
            select: {
              amount: true,
              status: true,
            }
          },
          _count: {
            select: {
              donations: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.donor.count(),
    ])

    return NextResponse.json({
      data: donors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch donors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, address } = body

    const donor = await prisma.donor.create({
      data: {
        name,
        email,
        phone,
        address,
      }
    })

    return NextResponse.json(donor, { status: 201 })
  } catch (error) {
    console.error('Error creating donor:', error)
    return NextResponse.json(
      { error: 'Failed to create donor' },
      { status: 500 }
    )
  }
}
