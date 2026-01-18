import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
      include: {
        donor: true,
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(donation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch donation' },
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
    const { amount, paymentMethod, status, notes } = body

    const updateData: any = {
      amount: parseFloat(amount),
      paymentMethod,
      status,
      notes,
    }

    // Set verifiedAt when status changes to VERIFIED
    if (status === 'VERIFIED') {
      updateData.verifiedAt = new Date()
    }

    const donation = await prisma.donation.update({
      where: { id: params.id },
      data: updateData,
      include: {
        donor: true,
      }
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error updating donation:', error)
    return NextResponse.json(
      { error: 'Failed to update donation' },
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

    await prisma.donation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Donation deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete donation' },
      { status: 500 }
    )
  }
}
