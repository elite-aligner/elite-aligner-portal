'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'
import { Case } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderOpen,
  Clock,
  CheckCircle,
  Plus,
  TrendingUp,
  Users,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
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
      setUser(user)
      fetchCases()
    }
    checkAuth()
  }, [])

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const casesData = data || []
      setCases(casesData)
      setStats({
        total: casesData.length,
        pending: casesData.filter((c: Case) => c.status === 'pending').length,
        approved: casesData.filter((c: Case) => c.status === 'approved').length,
        rejected: casesData.filter((c: Case) => c.status === 'rejected').length,
      })
    } catch (error) {
      console.error('Error fetching cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'إجمالي الحالات', value: stats.total, icon: FolderOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'قيد المراجعة', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'معتمدة', value: stats.approved, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'مرفوضة', value: stats.rejected, icon: TrendingUp, color: 'bg-red-50 text-red-600' },
  ]

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
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-1">مرحباً بك، {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <Link href="/cases/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="h-5 w-5" />
          حالة جديدة
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Cases */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">أحدث الحالات</h2>
          <Link href="/cases" className="text-dental hover:text-dental-dark text-sm font-medium flex items-center gap-1">
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد حالات مسجلة بعد</p>
            <Link href="/cases/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة أول حالة
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المريض</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">نوع الحالة</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الحالة</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">التاريخ</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 5).map((caseItem) => (
                  <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{caseItem.patient_name}</div>
                      <div className="text-sm text-gray-500">{caseItem.patient_age} سنة</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{caseItem.case_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {getStatusLabel(caseItem.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(caseItem.created_at)}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="text-dental hover:text-dental-dark text-sm font-medium"
                      >
                        عرض التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
