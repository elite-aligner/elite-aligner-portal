'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'
import { Case } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import {
  Search,
  Filter,
  Plus,
  Image as ImageIcon,
  ArrowLeft,
  Eye,
  Calendar,
  User,
} from 'lucide-react'

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      fetchCases()
    }
    checkAuth()
  }, [])

  useEffect(() => {
    let filtered = cases

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.case_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    setFilteredCases(filtered)
  }, [searchQuery, statusFilter, cases])

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCases(data || [])
      setFilteredCases(data || [])
    } catch (error) {
      console.error('Error fetching cases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الحالات</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة حالات التقويم الشفاف</p>
        </div>
        <Link href="/cases/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="h-5 w-5" />
          حالة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pr-11"
              placeholder="البحث باسم المريض أو نوع الحالة..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">معتمدة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="card text-center py-16">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'لا توجد نتائج مطابقة للبحث'
              : 'لا توجد حالات مسجلة بعد'}
          </p>
          <Link href="/cases/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة حالة جديدة
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="card hover:shadow-lg transition-shadow group">
              {/* Images */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {caseItem.before_image_url ? (
                    <img
                      src={caseItem.before_image_url}
                      alt="قبل"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <div className="text-center text-xs text-gray-500 mt-1">قبل</div>
                </div>
                <div className="flex-1 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {caseItem.after_image_url ? (
                    <img
                      src={caseItem.after_image_url}
                      alt="بعد"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <div className="text-center text-xs text-gray-500 mt-1">بعد</div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{caseItem.patient_name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                    {getStatusLabel(caseItem.status)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {caseItem.patient_age} سنة
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(caseItem.created_at)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{caseItem.case_type}</p>

                <Link
                  href={`/cases/${caseItem.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 bg-gray-50 hover:bg-dental-light text-gray-700 hover:text-dental-dark rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
