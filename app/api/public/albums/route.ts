import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get programs with images for gallery albums
    const programs = await prisma.program.findMany({
      where: {
        featuredImage: {
          not: null
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 12
    })

    // Convert to album format compatible with YPT Kiasma website
    const albums = programs.map((program, index) => ({
      id: program.id,
      title: program.title,
      description: stripHTML(program.description).substring(0, 150),
      coverImage: program.featuredImage || '',
      imageCount: 1, // Can be expanded if you add multiple images per program
      category: determineProgramCategory(program.title),
      date: program.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: albums,
      count: albums.length,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching albums:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch albums',
        data: []
      },
      { status: 500 }
    )
  }
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
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
