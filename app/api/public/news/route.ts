import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')

    const news = await prisma.news.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    })

    // Convert to frontend format compatible with YPT Kiasma website
    const posts = news.map(newsItem => ({
      id: newsItem.id,
      title: newsItem.title,
      excerpt: newsItem.excerpt || extractExcerpt(newsItem.content),
      category: newsItem.category || 'umum',
      date: newsItem.publishedAt?.toISOString() || newsItem.createdAt.toISOString(),
      author: newsItem.author.name,
      featured: false, // Can be customized based on your logic
      imageUrl: newsItem.featuredImage || '/images/default-news.jpg',
      content: convertHTMLToArray(newsItem.content),
      sourceLinks: extractSourceLinks(newsItem.content)
    }))

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching public news:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch news',
        data: []
      },
      { status: 500 }
    )
  }
}

// Helper functions
function extractExcerpt(html: string, maxLength: number = 150): string {
  const text = html.replace(/<[^>]*>/g, '').trim()
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...'
    : text
}

function convertHTMLToArray(html: string): string[] {
  // Remove HTML tags and split by paragraphs
  const text = html.replace(/<[^>]*>/g, '')
  const paragraphs = text.split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  return paragraphs.length > 0 ? paragraphs : [text]
}

function extractSourceLinks(html: string): Array<{ platform: string; url: string }> {
  const links: Array<{ platform: string; url: string }> = []
  
  // Extract links from HTML
  const urlRegex = /https?:\/\/[^\s<>"]+/g
  const urls = html.match(urlRegex) || []
  
  urls.forEach(url => {
    if (url.includes('instagram.com')) {
      links.push({ platform: 'instagram', url })
    } else if (url.includes('facebook.com')) {
      links.push({ platform: 'facebook', url })
    } else if (url.includes('threads.net')) {
      links.push({ platform: 'threads', url })
    }
  })
  
  return links
}
