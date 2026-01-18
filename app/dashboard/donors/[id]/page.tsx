'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FiArrowLeft, FiEdit } from 'react-icons/fi'

interface Donor {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  createdAt: string
  donations: Array<{
    id: string
    amount: number
    status: string
    paymentMethod: string
    donatedAt: string
  }>
}

export default function DonorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonor = async () => {
    try {
      const response = await axios.get(`/api/donors/${params.id}`)
      setDonor(response.data)
    } catch (error) {
      console.error('Error fetching donor:', error)
      alert('Gagal mengambil data donatur')
      router.push('/dashboard/donors')
    } finally {
      setLoading(false)
    }
    }
    fetchDonor()
  }, [params.id, router])

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

  const getTotalDonation = () => {
    if (!donor) return 0
    return donor.donations
      .filter(d => d.status === 'VERIFIED')
      .reduce((sum, d) => sum + d.amount, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!donor) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/donors"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{donor.name}</h1>
            <p className="text-gray-500 mt-2">Detail Donatur</p>
          </div>
        </div>
        <Link
          href={`/dashboard/donors/${donor.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiEdit size={20} />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donor Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Donatur</h2>
            
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900 font-medium">{donor.email || '-'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Telepon</label>
              <p className="text-gray-900 font-medium">{donor.phone || '-'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Alamat</label>
              <p className="text-gray-900 font-medium">{donor.address || '-'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Terdaftar Sejak</label>
              <p className="text-gray-900 font-medium">{formatDate(donor.createdAt)}</p>
            </div>

            <div className="pt-4 border-t">
              <label className="text-sm text-gray-500">Total Donasi (Terverifikasi)</label>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalDonation())}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Jumlah Transaksi</label>
              <p className="text-xl font-semibold text-gray-900">{donor.donations.length} donasi</p>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Donasi</h2>
            
            {donor.donations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada riwayat donasi</p>
            ) : (
              <div className="space-y-3">
                {donor.donations.map((donation) => (
                  <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{formatCurrency(donation.amount)}</p>
                        <p className="text-sm text-gray-500">{donation.paymentMethod}</p>
                        <p className="text-sm text-gray-500">{formatDate(donation.donatedAt)}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
