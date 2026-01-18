'use client'

import { useEffect, useState } from 'react'
import { FiFileText, FiCalendar, FiUsers, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi'
import axios from 'axios'

interface Stats {
  counts: {
    news: number
    programs: number
    donors: number
    donations: number
    pendingDonations: number
    verifiedDonations: number
  }
  totalDonationAmount: number
  recentNews: Array<{
    id: string
    title: string
    status: string
    createdAt: string
  }>
  recentDonations: Array<{
    id: string
    amount: number
    status: string
    donatedAt: string
    donor: {
      name: string
    }
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const statCards = [
    {
      title: 'Total Berita',
      value: stats?.counts.news || 0,
      icon: FiFileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Program',
      value: stats?.counts.programs || 0,
      icon: FiCalendar,
      color: 'bg-green-500',
    },
    {
      title: 'Total Donatur',
      value: stats?.counts.donors || 0,
      icon: FiUsers,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Donasi',
      value: formatCurrency(stats?.totalDonationAmount || 0),
      icon: FiDollarSign,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Selamat datang di admin dashboard YPT Kiasma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Donation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Donasi</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiClock className="text-yellow-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Menunggu Verifikasi</p>
                  <p className="text-sm text-gray-500">Donasi pending</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {stats?.counts.pendingDonations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Terverifikasi</p>
                  <p className="text-sm text-gray-500">Donasi sudah diverifikasi</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {stats?.counts.verifiedDonations || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Donasi Terbaru</h2>
          <div className="space-y-3">
            {stats?.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{donation.donor.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(donation.donatedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(donation.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    donation.status === 'VERIFIED' 
                      ? 'bg-green-100 text-green-700' 
                      : donation.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {donation.status === 'VERIFIED' ? 'Terverifikasi' : 
                     donation.status === 'PENDING' ? 'Pending' : 'Ditolak'}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentDonations || stats.recentDonations.length === 0) && (
              <p className="text-center text-gray-500 py-4">Belum ada donasi</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Berita Terbaru</h2>
        <div className="space-y-3">
          {stats?.recentNews.map((news) => (
            <div key={news.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{news.title}</p>
                <p className="text-sm text-gray-500">{formatDate(news.createdAt)}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                news.status === 'PUBLISHED' 
                  ? 'bg-green-100 text-green-700' 
                  : news.status === 'DRAFT'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {news.status === 'PUBLISHED' ? 'Dipublikasi' : 
                 news.status === 'DRAFT' ? 'Draft' : 'Diarsipkan'}
              </span>
            </div>
          ))}
          {(!stats?.recentNews || stats.recentNews.length === 0) && (
            <p className="text-center text-gray-500 py-4">Belum ada berita</p>
          )}
        </div>
      </div>
    </div>
  )
}
