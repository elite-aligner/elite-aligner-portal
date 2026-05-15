// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCasePage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('elite-aligner-user') || '{}');
      
      const newCase = {
        id: Date.now().toString(),
        patientName,
        phone,
        email,
        age,
        notes,
        doctorEmail: user.email,
        doctorName: user.name,
        createdAt: new Date().toLocaleDateString('ar-SA'),
        status: 'pending'
      };

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
          {/* اسم المريض */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المريض *
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

          {/* رقم الهاتف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="05xxxxxxxx"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="example@email.com"
            />
          </div>

          {/* العمر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العمر
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="25"
              min="1"
              max="120"
            />
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-32 resize-none"
              placeholder="أي ملاحظات إضافية عن الحالة..."
            />
          </div>

          {/* رفع ملف STL */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500 mb-2">رفع ملف STL (اختياري)</p>
            <p className="text-sm text-gray-400">يمكنك رفع الملف لاحقاً</p>
            <input type="file" accept=".stl" className="hidden" />
          </div>

          {/* زر الحفظ */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 shadow-lg font-bold"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ الحالة'}
          </button>
        </form>
      </div>
    </div>
  );
}