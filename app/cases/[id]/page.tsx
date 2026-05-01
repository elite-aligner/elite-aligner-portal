'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'
import { Case } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Image as ImageIcon,
  Edit,
  Trash2,
} from 'lucide-react'

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [caseItem, setCaseItem] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClientSupabase()
  const caseId = params.id as string

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (caseId) {
        fetchCase()
      }
    }
    init()
  }, [caseId])

  const fetchCase = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single()

      if (error) throw error
      setCaseItem(data)
    } catch (error) {
      console.error('Error fetching case:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: 'approved' | 'rejected') => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status })
        .eq('id', caseId)

      if (error) throw error
      setCaseItem((prev) => (prev ? { ...prev, status } : null))
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteCase = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الحالة؟')) return

    try {
      const { error } = await supabase.from('cases').delete().eq('id', caseId)
      if (error) throw error
      router.push('/cases')
    } catch (error) {
      console.error('Error deleting case:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental"></div>
      </div>
    )
  }

  if (!caseItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">الحالة غير موجودة</p>
        <Link href="/cases" className="btn-primary mt-4 inline-block">
          العودة للحالات
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === caseItem.created_by

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cases" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الحالة</h1>
          <p className="text-gray-600 mt-1">{caseItem.patient_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(caseItem.status)}`}>
            {getStatusLabel(caseItem.status)}
          </span>
        </div>
      </div>

      {/* Images */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">صور الحالة</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {caseItem.before_image_url ? (
                <img
                  src={caseItem.before_image_url}
                  alt="قبل العلاج"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span>لا توجد صورة قبل</span>
                </div>
              )}
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mt-2">قبل العلاج</p>
          </div>
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {caseItem.after_image_url ? (
                <img
                  src={caseItem.after_image_url}
                  alt="بعد العلاج"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <span>لا توجد صورة بعد</span>
                </div>
              )}
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mt-2">بعد العلاج</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات الحالة</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">اسم المريض</p>
                <p className="font-medium text-gray-900">{caseItem.patient_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">العمر</p>
                <p className="font-medium text-gray-900">{caseItem.patient_age} سنة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">مدة العلاج</p>
                <p className="font-medium text-gray-900">{caseItem.treatment_duration || 'غير محدد'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">نوع الحالة</p>
                <p className="font-medium text-gray-900">{caseItem.case_type}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">الطبيب المعالج</p>
                <p className="font-medium text-gray-900">{caseItem.doctor_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">تاريخ الإضافة</p>
                <p className="font-medium text-gray-900">{formatDate(caseItem.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {caseItem.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-2">وصف الحالة</p>
                <p className="text-gray-700 leading-relaxed">{caseItem.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {isOwner && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إجراءات</h2>
          <div className="flex flex-wrap gap-3">
            {caseItem.status === 'pending' && (
              <>
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  اعتماد الحالة
                </button>
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  رفض الحالة
                </button>
              </>
            )}
            <button
              onClick={deleteCase}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors mr-auto"
            >
              <Trash2 className="h-4 w-4" />
              حذف الحالة
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
