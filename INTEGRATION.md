# Integrasi Admin Dashboard dengan Website YPT Kiasma

## 🎯 Overview

Dokumen ini menjelaskan cara menghubungkan **Admin Dashboard** (Next.js) dengan **Website YPT Kiasma** (React/Vite) yang sudah ada di https://yptkiasma.vercel.app

## 📊 Mapping Data Structure

### Perbandingan Struktur Data

| Admin Dashboard | Website Frontend | Mapping Status |
|-----------------|------------------|----------------|
| `News` | `Post` | ✅ Compatible |
| `Program` | `Program` | ✅ Compatible |
| `Donation` | N/A | ➕ New Feature |
| `Donor` | N/A | ➕ New Feature |

### 1. News/Posts Mapping

**Admin Dashboard (Database):**
```typescript
interface News {
  id: string
  title: string
  slug: string
  content: string        // HTML
  excerpt: string
  featuredImage: string
  category: string
  tags: string[]
  status: NewsStatus
  publishedAt: Date
  author: User
}
```

**Website Frontend (Collection):**
```typescript
interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  featured: boolean
  imageUrl: string
  content: string[]      // Array of paragraphs
  sourceLinks: SourceLink[]
}
```

**Mapping Strategy:**
```typescript
// Convert News to Post format
function newsToPost(news: News): Post {
  return {
    id: news.id,
    title: news.title,
    excerpt: news.excerpt || '',
    category: news.category || 'umum',
    date: news.publishedAt.toISOString(),
    author: news.author.name,
    featured: news.status === 'PUBLISHED',
    imageUrl: news.featuredImage || '',
    content: convertHTMLToArray(news.content),
    sourceLinks: extractSourceLinks(news.content)
  }
}
```

### 2. Programs Mapping

**Admin Dashboard (Database):**
```typescript
interface Program {
  id: string
  title: string
  slug: string
  description: string    // HTML
  featuredImage: string
  startDate: Date
  endDate: Date
  location: string
  maxParticipants: number
  status: ProgramStatus
}
```

**Website Frontend (Collection):**
```typescript
interface Program {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  status: 'active' | 'completed' | 'upcoming'
  date: string
  location: string
}
```

**Mapping Strategy:**
```typescript
function programToFrontend(program: Program): FrontendProgram {
  return {
    id: program.id,
    title: program.title,
    description: stripHTML(program.description),
    category: 'program',
    imageUrl: program.featuredImage || '',
    status: mapProgramStatus(program.status),
    date: program.startDate.toISOString(),
    location: program.location || ''
  }
}

function mapProgramStatus(status: ProgramStatus): string {
  const mapping = {
    'UPCOMING': 'upcoming',
    'RUNNING': 'active',
    'COMPLETED': 'completed'
  }
  return mapping[status]
}
```

## 🔌 Cara Integrasi

### Option 1: Public API Endpoints (Recommended)

Buat public API endpoints yang bisa diakses website frontend.

#### 1. Buat Public API Routes

Create file: `app/api/public/news/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const news = await prisma.news.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 20
    })

    // Convert to frontend format
    const posts = news.map(newsToPost)

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

function newsToPost(news: any) {
  return {
    id: news.id,
    title: news.title,
    excerpt: news.excerpt || '',
    category: news.category || 'umum',
    date: news.publishedAt?.toISOString() || new Date().toISOString(),
    author: news.author.name,
    featured: false,
    imageUrl: news.featuredImage || '',
    content: convertHTMLToArray(news.content),
    sourceLinks: []
  }
}

function convertHTMLToArray(html: string): string[] {
  // Simple conversion: strip HTML and split by paragraph
  const text = html.replace(/<[^>]*>/g, '')
  return text.split('\n').filter(p => p.trim().length > 0)
}
```

Create file: `app/api/public/programs/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const frontendPrograms = programs.map(programToFrontend)

    return NextResponse.json(frontendPrograms)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

function programToFrontend(program: any) {
  return {
    id: program.id,
    title: program.title,
    description: program.description.replace(/<[^>]*>/g, ''),
    category: 'program',
    imageUrl: program.featuredImage || '',
    status: mapProgramStatus(program.status),
    date: program.startDate?.toISOString() || new Date().toISOString(),
    location: program.location || ''
  }
}

function mapProgramStatus(status: string): string {
  const mapping: Record<string, string> = {
    'UPCOMING': 'upcoming',
    'RUNNING': 'active',
    'COMPLETED': 'completed'
  }
  return mapping[status] || 'upcoming'
}
```

#### 2. Update CORS Settings

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow CORS for public API
        source: '/api/public/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

#### 3. Update Website Frontend

Modify website's data fetching (in React app):

Create: `src/services/api.ts`
```typescript
const API_BASE_URL = 'https://your-admin-dashboard.vercel.app/api/public'

export async function fetchPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/news`)
    if (!response.ok) throw new Error('Failed to fetch posts')
    return await response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Fallback to static data
    return posts // existing static data
  }
}

export async function fetchPrograms() {
  try {
    const response = await fetch(`${API_BASE_URL}/programs`)
    if (!response.ok) throw new Error('Failed to fetch programs')
    return await response.json()
  } catch (error) {
    console.error('Error fetching programs:', error)
    return programs // existing static data
  }
}
```

Update components to use API:
```typescript
// src/pages/BeritaPage.tsx
import { useEffect, useState } from 'react'
import { fetchPosts } from '@/services/api'

export default function BeritaPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      const data = await fetchPosts()
      setPosts(data)
      setLoading(false)
    }
    loadPosts()
  }, [])

  // ... rest of component
}
```

### Option 2: JSON Export/Import

Jika tidak ingin setup API real-time, bisa export data sebagai JSON.

#### 1. Buat Export Feature di Admin Dashboard

Create: `app/api/export/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all published data
    const [news, programs] = await Promise.all([
      prisma.news.findMany({
        where: { status: 'PUBLISHED' },
        include: { author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.program.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Convert to frontend format
    const exportData = {
      posts: news.map(newsToPost),
      programs: programs.map(programToFrontend),
      exportedAt: new Date().toISOString()
    }

    return NextResponse.json(exportData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}
```

#### 2. Add Export Button to Dashboard

Create: `app/dashboard/export/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiDownload } from 'react-icons/fi'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/export')
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ypt-kiasma-data-${Date.now()}.json`
      a.click()
      
      alert('Data berhasil di-export!')
    } catch (error) {
      alert('Gagal export data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Export Data</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600 mb-4">
          Export semua data yang sudah dipublikasi untuk website frontend.
        </p>
        <button
          onClick={handleExport}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiDownload size={20} />
          {loading ? 'Exporting...' : 'Export Data'}
        </button>
      </div>
    </div>
  )
}
```

## 🚀 Deployment Strategy

### Step 1: Deploy Admin Dashboard
```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod

# Note the deployment URL
# Example: https://ypt-kiasma-admin.vercel.app
```

### Step 2: Update Website Frontend
```bash
# Clone website repository
git clone https://github.com/synovaaaaa-bot/Yptkiasma.git

# Update API_BASE_URL in src/services/api.ts
API_BASE_URL = 'https://ypt-kiasma-admin.vercel.app/api/public'

# Deploy
vercel --prod
```

## 📝 Checklist Integrasi

- [ ] Setup database dengan data awal
- [ ] Deploy admin dashboard ke Vercel
- [ ] Create public API endpoints
- [ ] Configure CORS settings
- [ ] Test API endpoints dengan Postman/Thunder Client
- [ ] Update website frontend untuk fetch dari API
- [ ] Test integrasi end-to-end
- [ ] Update data di admin dashboard
- [ ] Verify data muncul di website frontend

## 🔐 Security Notes

- Public API hanya return data yang sudah PUBLISHED
- Admin API tetap protected dengan NextAuth
- CORS hanya untuk GET requests
- Rate limiting bisa ditambahkan jika perlu

## 📞 Support

Jika ada pertanyaan tentang integrasi:
- Email: admin@yptkiasma.org
- Documentation: README.md

---

**Berkah untuk Umat! 🌟**
