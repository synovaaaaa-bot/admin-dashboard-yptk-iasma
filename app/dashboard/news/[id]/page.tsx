'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi'

interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  category: string | null
  tags: string[]
  status: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author: {
    name: string
    email: string
  }
}

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get(`/api/news/${params.id}`)
      setNews(response.data)
    } catch (error) {
      console.error('Error fetching news:', error)
      alert('Gagal mengambil data berita')
      router.push('/dashboard/news')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return

    try {
      await axios.delete(`/api/news/${params.id}`)
      alert('Berita berhasil dihapus')
      router.push('/dashboard/news')
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Gagal menghapus berita')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!news) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/news"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detail Berita</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/news/${news.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiEdit size={20} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiTrash2 size={20} />
            Hapus
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Featured Image */}
        {news.featuredImage && (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={news.featuredImage}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`px-3 py-1 text-xs rounded-full ${
              news.status === 'PUBLISHED' 
                ? 'bg-green-100 text-green-700' 
                : news.status === 'DRAFT'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {news.status === 'PUBLISHED' ? 'Dipublikasi' : 
               news.status === 'DRAFT' ? 'Draft' : 'Diarsipkan'}
            </span>
            {news.category && (
              <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {news.category}
              </span>
            )}
            {news.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{news.title}</h1>

          {/* Excerpt */}
          {news.excerpt && (
            <p className="text-lg text-gray-600 italic">{news.excerpt}</p>
          )}

          {/* Author & Date */}
          <div className="flex gap-4 text-sm text-gray-500 pb-4 border-b">
            <div>
              <span className="font-medium">Penulis:</span> {news.author.name}
            </div>
            <div>
              <span className="font-medium">Dibuat:</span> {formatDate(news.createdAt)}
            </div>
            {news.publishedAt && (
              <div>
                <span className="font-medium">Dipublikasi:</span> {formatDate(news.publishedAt)}
              </div>
            )}
          </div>

          {/* Content */}
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Footer Info */}
          <div className="pt-4 border-t text-sm text-gray-500">
            <p>Terakhir diupdate: {formatDate(news.updatedAt)}</p>
            <p className="mt-1">Slug: {news.slug}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
