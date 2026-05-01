'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase'
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

const caseTypes = [
  'تقويم شفاف تقليدي',
  'تقويم شفاف متقدم',
  'تصحيح بسيط',
  'تصحيح معقد',
  'إعادة علاج',
  'علاج مشترك (جراحة)',
  'حالة أطفال',
  'حالة بالغين',
  'أخرى',
]

export default function NewCasePage() {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    case_type: '',
    description: '',
    treatment_duration: '',
  })
  const [beforeImage, setBeforeImage] = useState<File | null>(null)
  const [afterImage, setAfterImage] = useState<File | null>(null)
  const [beforePreview, setBeforePreview] = useState('')
  const [afterPreview, setAfterPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientSupabase()
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'before') {
        setBeforeImage(file)
        setBeforePreview(reader.result as string)
      } else {
        setAfterImage(file)
        setAfterPreview(reader.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('case-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data } = supabase.storage.from('case-images').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Upload images
      let beforeImageUrl = null
      let afterImageUrl = null

      if (beforeImage) {
        beforeImageUrl = await uploadImage(beforeImage, 'before')
      }
      if (afterImage) {
        afterImageUrl = await uploadImage(afterImage, 'after')
      }

      // Create case
      const { error: insertError } = await supabase.from('cases').insert({
        patient_name: formData.patient_name,
        patient_age: parseInt(formData.patient_age),
        case_type: formData.case_type,
        description: formData.description,
        treatment_duration: formData.treatment_duration,
        before_image_url: beforeImageUrl,
        after_image_url: afterImageUrl,
        status: 'pending',
        created_by: user.id,
        doctor_name: user.user_metadata?.full_name || user.email,
      })

      if (insertError) throw insertError

      router.push('/cases')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الحالة')
    } finally {
      setLoading(false)
    }
  }

  const ImageUploadBox = ({
    type,
    preview,
    onClick,
  }: {
    type: 'before' | 'after'
    preview: string
    onClick: () => void
  }) => (
    <div
      onClick={onClick}
      className={`relative aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
        preview ? 'border-dental' : 'border-gray-300 hover:border-dental'
      }`}
    >
      {preview ? (
        <>
          <img src={preview} alt={type} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (type === 'before') {
                setBeforeImage(null)
                setBeforePreview('')
              } else {
                setAfterImage(null)
                setAfterPreview('')
              }
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <Upload className="h-10 w-10 mb-2" />
          <span className="text-sm font-medium">
            {type === 'before' ? 'صورة قبل العلاج' : 'صورة بعد العلاج'}
          </span>
          <span className="text-xs mt-1">اضغط للرفع</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cases" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">حالة جديدة</h1>
          <p className="text-gray-600 mt-1">أضف حالة تقويم شفاف جديدة</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">صور الحالة</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              ref={beforeInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'before')}
              className="hidden"
            />
            <input
              ref={afterInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'after')}
              className="hidden"
            />
            <ImageUploadBox
              type="before"
              preview={beforePreview}
              onClick={() => beforeInputRef.current?.click()}
            />
            <ImageUploadBox
              type="after"
              preview={afterPreview}
              onClick={() => afterInputRef.current?.click()}
            />
          </div>
        </div>

        {/* Patient Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات المريض</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">اسم المريض</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="input-field pr-11"
                  placeholder="اسم المريض"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">العمر</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.patient_age}
                  onChange={(e) => setFormData({ ...formData, patient_age: e.target.value })}
                  className="input-field pr-11"
                  placeholder="25"
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Case Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الحالة</h2>
          <div className="space-y-6">
            <div>
              <label className="label">نوع الحالة</label>
              <select
                value={formData.case_type}
                onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
                className="input-field"
                required
              >
                <option value="">اختر نوع الحالة</option>
                {caseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">مدة العلاج</label>
              <div className="relative">
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.treatment_duration}
                  onChange={(e) => setFormData({ ...formData, treatment_duration: e.target.value })}
                  className="input-field pr-11"
                  placeholder="مثال: 12 شهر"
                />
              </div>
            </div>

            <div>
              <label className="label">وصف الحالة</label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field pr-11 min-h-[120px] resize-none"
                  placeholder="وصف تفصيلي للحالة، التشخيص، وخطة العلاج..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              'حفظ الحالة'
            )}
          </button>
          <Link href="/cases" className="btn-secondary flex-1 text-center">
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  )
}
