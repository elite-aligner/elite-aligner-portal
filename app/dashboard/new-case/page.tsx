// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Eye, FileBox } from 'lucide-react';

export default function NewCasePage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [upperJaw, setUpperJaw] = useState<File | null>(null);
  const [lowerJaw, setLowerJaw] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('elite-aligner-user') || '{}');
      
      // ✅ إنشاء معرف فريد للحالة
      const caseId = Date.now().toString();
      
      const newCase = {
        id: caseId,
        patientName,
        upperJawFile: upperJaw ? upperJaw.name : null,
        lowerJawFile: lowerJaw ? lowerJaw.name : null,
        notes,
        doctorEmail: user.email,
        doctorName: user.name,
        createdAt: new Date().toLocaleDateString('ar-SA'),
        status: 'pending',
        previewUrl: `/viewer/${caseId}`
      };

      // ✅ حفظ في localStorage
      const existingCases = JSON.parse(localStorage.getItem('elite-aligner-cases') || '[]');
      localStorage.setItem('elite-aligner-cases', JSON.stringify([...existingCases, newCase]));

      // ✅ إنشاء رابط المعاينة
      setPreviewUrl(`/viewer/${caseId}`);

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir="rtl">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full" />
            <h1 className="text-xl font-bold text-white">
              Elite <span className="text-green-400">Aligner</span>
            </h1>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">إضافة حالة جديدة</h1>
        
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* اسم المريض */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المريض *
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
              placeholder="اسم المريض الكامل"
              required
            />
          </div>

          {/* رفع ملفات STL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* فك علوي */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors bg-gray-50">
              <FileBox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">الفك العلوي</h3>
              <p className="text-gray-500 mb-4">رفع ملف STL للفك العلوي</p>
              <input
                type="file"
                accept=".stl"
                onChange={(e) => setUpperJaw(e.target.files?.[0] || null)}
                className="hidden"
                id="upper-jaw"
              />
              <label 
                htmlFor="upper-jaw"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 ml-2" />
                {upperJaw ? upperJaw.name : 'اختيار الملف'}
              </label>
            </div>

            {/* فك سفلي */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors bg-gray-50">
              <FileBox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">الفك السفلي</h3>
              <p className="text-gray-500 mb-4">رفع ملف STL للفك السفلي</p>
              <input
                type="file"
                accept=".stl"
                onChange={(e) => setLowerJaw(e.target.files?.[0] || null)}
                className="hidden"
                id="lower-jaw"
              />
              <label 
                htmlFor="lower-jaw"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 ml-2" />
                {lowerJaw ? lowerJaw.name : 'اختيار الملف'}
              </label>
            </div>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات الطبيب
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 h-32 resize-none"
              placeholder="أي ملاحظات إضافية عن الحالة..."
            />
          </div>

          {/* معاينة 3D */}
          {previewUrl && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">جاهز للمعاينة ثلاثية الأبعاد</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(previewUrl)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  عرض 3D
                </button>
              </div>
            </div>
          )}

          {/* أزرار */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 shadow-lg font-bold"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ الحالة'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}