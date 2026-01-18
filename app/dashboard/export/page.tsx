'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiDownload, FiCopy, FiExternalLink } from 'react-icons/fi'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const [apiUrls] = useState({
    news: `${window.location.origin}/api/public/news`,
    programs: `${window.location.origin}/api/public/programs`,
    albums: `${window.location.origin}/api/public/albums`,
  })

  const handleExport = async (endpoint: string, filename: string) => {
    setLoading(true)
    try {
      const response = await axios.get(endpoint)
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}-${Date.now()}.json`
      a.click()
      window.URL.revokeObjectURL(url)
      
      alert('Data berhasil di-export!')
    } catch (error) {
      console.error('Export error:', error)
      alert('Gagal export data')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('URL berhasil di-copy!')
  }

  const testAPI = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Export & API Integration</h1>
        <p className="text-gray-500 mt-2">Export data atau gunakan API endpoints untuk integrasi dengan website frontend</p>
      </div>

      {/* API Endpoints Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">🔗 Public API Endpoints</h2>
        <p className="text-blue-700 text-sm mb-4">
          API endpoints ini dapat diakses dari website frontend YPT Kiasma untuk menampilkan data real-time.
        </p>
        <div className="bg-white rounded-lg p-4 font-mono text-sm space-y-2">
          <div>
            <strong>Base URL:</strong> {window.location.origin}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* News/Berita */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📰 Berita</h3>
          
          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <label className="text-gray-500 block mb-1">API Endpoint:</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-xs break-all">
                  /api/public/news
                </code>
                <button
                  onClick={() => copyToClipboard(apiUrls.news)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy URL"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => testAPI(apiUrls.news)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <FiExternalLink size={16} />
              Test API
            </button>
            <button
              onClick={() => handleExport(apiUrls.news, 'berita')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm disabled:opacity-50"
            >
              <FiDownload size={16} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Programs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Program</h3>
          
          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <label className="text-gray-500 block mb-1">API Endpoint:</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-xs break-all">
                  /api/public/programs
                </code>
                <button
                  onClick={() => copyToClipboard(apiUrls.programs)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy URL"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => testAPI(apiUrls.programs)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <FiExternalLink size={16} />
              Test API
            </button>
            <button
              onClick={() => handleExport(apiUrls.programs, 'program')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm disabled:opacity-50"
            >
              <FiDownload size={16} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Albums/Gallery */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Galeri</h3>
          
          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <label className="text-gray-500 block mb-1">API Endpoint:</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-xs break-all">
                  /api/public/albums
                </code>
                <button
                  onClick={() => copyToClipboard(apiUrls.albums)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy URL"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => testAPI(apiUrls.albums)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <FiExternalLink size={16} />
              Test API
            </button>
            <button
              onClick={() => handleExport(apiUrls.albums, 'galeri')}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm disabled:opacity-50"
            >
              <FiDownload size={16} />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📖 Cara Integrasi dengan Website Frontend</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">1. Buat Service untuk Fetch Data</h3>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-xs">
{`// src/services/api.ts
const API_BASE = '${window.location.origin}/api/public'

export async function fetchNews() {
  const res = await fetch(\`\${API_BASE}/news\`)
  return res.json()
}

export async function fetchPrograms() {
  const res = await fetch(\`\${API_BASE}/programs\`)
  return res.json()
}`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">2. Gunakan di Component</h3>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-xs">
{`// src/pages/BeritaPage.tsx
import { fetchNews } from '@/services/api'

useEffect(() => {
  fetchNews().then(data => {
    setPosts(data.data) // data.data karena response wrapped
  })
}, [])`}
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">3. Query Parameters</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><code>?limit=10</code> - Batasi jumlah data</li>
              <li><code>?status=active</code> - Filter by status (untuk programs)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Documentation Link */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-4">
          Untuk dokumentasi lengkap, lihat file <code className="bg-white px-2 py-1 rounded">INTEGRATION.md</code>
        </p>
        <a
          href="https://github.com/synovaaaaa-bot/Yptkiasma"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <FiExternalLink size={16} />
          Repository Website Frontend
        </a>
      </div>
    </div>
  )
}
