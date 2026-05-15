// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCasePage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('elite-aligner-user') || '{}');
      
      const newCase = {
        id: Date.now().toString(),
        patientName,
        doctorEmail: user.email,
        doctorName: user.name,
        createdAt: new Date().toLocaleDateString('ar-SA'),
        status: 'pending'
      };

      // ✅ حفظ في localStorage (حالات الطبيب فقط)
      const existingCases = JSON.parse(localStorage.getItem('elite-aligner-cases') || '[]');
      localStorage.setItem('elite-aligner-cases', JSON.stringify([...existingCases, newCase]));

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">إضافة حالة جديدة</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المريض
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="اسم المريض الكامل"
              required
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-2">رفع ملف STL (اختياري)</p>
            <p className="text-sm text-gray-400">يمكنك رفع الملف لاحقاً</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ الحالة'}
          </button>
        </form>
      </div>
    </div>
  );
}