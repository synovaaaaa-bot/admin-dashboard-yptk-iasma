import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // Filter by status if provided

    const where: any = {}
    if (status) {
      where.status = status.toUpperCase()
    }

    const programs = await prisma.program.findMany({
      where,
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Convert to frontend format compatible with YPT Kiasma website
    const frontendPrograms = programs.map(program => ({
      id: program.id,
      title: program.title,
      description: stripHTML(program.description),
      category: determineProgramCategory(program.title),
      imageUrl: program.featuredImage || '/images/default-program.jpg',
      status: mapProgramStatus(program.status),
      date: program.startDate?.toISOString() || program.createdAt.toISOString(),
      location: program.location || 'Bukittinggi',
      details: {
        startDate: program.startDate?.toISOString(),
        endDate: program.endDate?.toISOString(),
        maxParticipants: program.maxParticipants,
        registeredCount: program._count.registrations
      }
    }))

    return NextResponse.json({
      success: true,
      data: frontendPrograms,
      count: frontendPrograms.length,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching public programs:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch programs',
        data: []
      },
      { status: 500 }
    )
  }
}

// Helper functions
function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function mapProgramStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'UPCOMING': 'upcoming',
    'RUNNING': 'active',
    'COMPLETED': 'completed'
  }
  return statusMap[status] || 'upcoming'
}

function determineProgramCategory(title: string): string {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('pendidikan') || lowerTitle.includes('beasiswa')) {
    return 'program-pendidikan'
  } else if (lowerTitle.includes('santunan') || lowerTitle.includes('donasi')) {
    return 'donasi-santunan'
  } else if (lowerTitle.includes('bencana') || lowerTitle.includes('bantuan')) {
    return 'bantuan-bencana'
  } else if (lowerTitle.includes('air bersih')) {
    return 'bantuan-air-bersih'
  } else if (lowerTitle.includes('majelis') || lowerTitle.includes('taklim')) {
    return 'kegiatan-majelis-taklim'
  } else if (lowerTitle.includes('material') || lowerTitle.includes('infrastruktur')) {
    return 'bantuan-material'
  }
  
  return 'program-umum'
}
