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
      // التحقق من localStorage أولاً (من تسجيل الدخول المؤقت)
      const localUser = localStorage.getItem('user')
      if (localUser) {
        setUser(JSON.parse(localUser))
        fetchCases()
        setLoading(false)
        return
      }

      // إذا لا يوجد، تحقق من Supabase Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchCases()
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cases:', error)
      return
    }

    setCases(data || [])
    
    // Calculate stats
    const total = data?.length || 0
    const pending = data?.filter((c: Case) => c.status === 'pending').length || 0
    const approved = data?.filter((c: Case) => c.status === 'approved').length || 0
    const rejected = data?.filter((c: Case) => c.status === 'rejected').length || 0

    setStats({ total, pending, approved, rejected })
  }

  const handleLogout = async () => {
    localStorage.removeItem('user')
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-dental hover:text-dental-dark">
                <ArrowLeft className="h-5 w-5" />
                <span>العودة للرئيسية</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email || 'مستخدم'}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-gray-600">إجمالي الحالات</p>
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-gray-600">قيد الانتظار</p>
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-gray-600">معتمدة</p>
              </div>
            </div>
          </div>

          <div className="card bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-gray-600">مرفوضة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">الحالات</h2>
          <Link href="/upload" className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            رفع حالة جديدة
          </Link>
        </div>

        {/* Cases Table */}
        <div className="card bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المريض</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{caseItem.patient_name}</p>
                        <p className="text-sm text-gray-500">{caseItem.doctor_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                      {getStatusLabel(caseItem.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(caseItem.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/view/${caseItem.id}`}
                      className="text-dental hover:text-dental-dark font-medium"
                    >
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cases.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد حالات بعد</p>
              <Link href="/upload" className="text-dental hover:text-dental-dark mt-2 inline-block">
                رفع حالة جديدة
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}