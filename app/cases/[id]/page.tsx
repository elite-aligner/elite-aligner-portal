// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'
import { Upload, X, ArrowLeft, User, Stethoscope, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const caseTypes = [
  'تقويم شفاف تقليدي',
  'تقويم شفاف متقدم',
  'تصحيح بسيط',
  'تصحيح معقد',
  'اعادة علاج',
  'علاج مشترك (جراحة)',
  'حالة اطفال',
  'حالة بالغين',
  'اخرى',
]

export default function NewCasePage() {
  const [patientName, setPatientName] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [caseType, setCaseType] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [upperJawStl, setUpperJawStl] = useState<File | null>(null)
  const [lowerJawStl, setLowerJawStl] = useState<File | null>(null)
  const [ctFile, setCtFile] = useState<File | null>(null)
  const [patientPhoto, setPatientPhoto] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const router = useRouter()

  const uploadFile = async (file: File, folder: string, userId: string) => {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const filePath = `${userId}/${folder}/${fileName}`
    
    const supabase = createClientSupabase()
    const { data, error } = await supabase.storage
      .from('cases')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    const { data: urlData } = supabase.storage
      .from('cases')
      .getPublicUrl(filePath)
    
    return urlData.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setUploadProgress('')

    try {
      const supabase = createClientSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('يجب تسجيل الدخول اولا')

      setUploadProgress('جاري رفع جميع الملفات معاً...')

      let upperJawUrl = ''
      let lowerJawUrl = ''
      let ctUrl = ''
      let photoUrl = ''

      const uploadPromises: Promise<void>[] = []

      if (upperJawStl) {
        uploadPromises.push(
          uploadFile(upperJawStl, 'upper-jaw', user.id).then(url => {
            upperJawUrl = url
          })
        )
      }

      if (lowerJawStl) {
        uploadPromises.push(
          uploadFile(lowerJawStl, 'lower-jaw', user.id).then(url => {
            lowerJawUrl = url
          })
        )
      }

      if (ctFile) {
        uploadPromises.push(
          uploadFile(ctFile, 'ct-scan', user.id).then(url => {
            ctUrl = url
          })
        )
      }

      if (patientPhoto) {
        uploadPromises.push(
          uploadFile(patientPhoto, 'photos', user.id).then(url => {
            photoUrl = url
          })
        )
      }

      await Promise.all(uploadPromises)

      setUploadProgress('تم رفع الملفات! جاري حفظ البيانات...')

      const { error: dbError } = await supabase.from('cases').insert({
        user_id: user.id,
        patient_name: patientName,
        doctor_name: doctorName,
        case_type: caseType,
        description: description,
        treatment_duration: duration,
        upper_jaw_stl_url: upperJawUrl,
        lower_jaw_stl_url: lowerJawUrl,
        ct_file_url: ctUrl,
        patient_photo_url: photoUrl,
        notes: notes,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`خطأ في قاعدة البيانات: ${dbError.message}`)
      }

      setSuccess(true)
      setUploadProgress('تم بنجاح!')
      
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 2000)

    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'حدث خطأ غير متوقع اثناء رفع الحالة')
    } finally {
      setLoading(false)
    }
  }

  const FileUploadBox = ({ 
    label, 
    accept, 
    file, 
    onChange, 
    icon: Icon,
    required = false 
  }: { 
    label: string
    accept: string
    file: File | null
    onChange: (file: File | null) => void
    icon: any
    required?: boolean
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-500'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const droppedFile = e.dataTransfer.files[0]
          if (droppedFile) onChange(droppedFile)
        }}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
          id={`upload-${label}`}
        />
        <label htmlFor={`upload-${label}`} className="cursor-pointer block">
          <Icon className={`h-10 w-10 mx-auto mb-3 ${file ? 'text-green-500' : 'text-gray-400'}`} />
          <p className={`font-medium ${file ? 'text-green-700' : 'text-gray-600'}`}>
            {file ? file.name : `انقر لرفع ${label}`}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {file ? `الحجم: ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'او اسحب الملف هنا'}
          </p>
        </label>
        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-3 text-red-600 text-sm flex items-center gap-1 mx-auto hover:text-red-700 transition-colors"
          >
            <X className="h-4 w-4" />
            إزالة الملف
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>العودة للوحة التحكم</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">رفع حالة جديدة</h1>
              <p className="text-xs text-gray-500">نظام Elite Aligner Portal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-green-700 font-medium">تم رفع الحالة بنجاح!</p>
              <p className="text-green-600 text-sm">جاري التحويل الى لوحة التحكم...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-red-700 font-medium">خطأ!</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {uploadProgress && !success && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            <p className="text-blue-700 font-medium">{uploadProgress}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">معلومات المريض</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المريض <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="محمد احمد"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الطبيب المعالج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="د. احمد علي"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">تفاصيل الحالة</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الحالة <span className="text-red-500">*</span>
                </label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                >
                  <option value="">اختر نوع الحالة</option>
                  {caseTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  مدة العلاج المتوقعة
                </label>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="مثال: 12-18 شهر"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف الحالة والتشخيص
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="وصف تفصيلي للحالة، التشخيص، وخطة العلاج المقترحة..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">الملفات المرفقة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadBox
                label="STL الفك العلوي (Upper Jaw)"
                accept=".stl,.obj"
                file={upperJawStl}
                onChange={setUpperJawStl}
                icon={Upload}
                required
              />
              <FileUploadBox
                label="STL الفك السفلي (Lower Jaw)"
                accept=".stl,.obj"
                file={lowerJawStl}
                onChange={setLowerJawStl}
                icon={Upload}
                required
              />
              <FileUploadBox
                label="CT Scan (الاشعة المقطعية)"
                accept=".dcm,.zip,.rar,.jpg,.png"
                file={ctFile}
                onChange={setCtFile}
                icon={FileText}
              />
              <FileUploadBox
                label="صورة المريض"
                accept=".jpg,.jpeg,.png"
                file={patientPhoto}
                onChange={setPatientPhoto}
                icon={Upload}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات اضافية للفني
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="اي ملاحظات خاصة تريد ايصالها للفني..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  رفع الحالة للمراجعة
                </>
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              الغاء
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}