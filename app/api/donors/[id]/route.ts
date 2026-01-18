import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const donor = await prisma.donor.findUnique({
      where: { id: params.id },
      include: {
        donations: {
          orderBy: { donatedAt: 'desc' }
        }
      }
    })

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(donor)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch donor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const donor = await prisma.donor.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        address,
      }
    })

    return NextResponse.json(donor)
  } catch (error) {
    console.error('Error updating donor:', error)
    return NextResponse.json(
      { error: 'Failed to update donor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.donor.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Donor deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete donor' },
      { status: 500 }
    )
  }
}
