'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase';

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClientSupabase();
      
      // 1. إنشاء حساب في Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. إضافة الطبيب في جدول doctors
      const { error: dbError } = await supabase.from('doctors').insert({
        id: authData.user?.id,
        email,
        name,
        role: 'doctor',
      });

      if (dbError) throw dbError;

      // 3. التوجيه لصفحة الطبيب
      router.push('/doctor');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* الشعار */}
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            Elite <span className="text-blue-600">Aligner</span>
          </h1>
          <p className="text-gray-500 mt-2">تسجيل طبيب جديد</p>
        </div>

        {/* نموذج التسجيل */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="الاسم الكامل"
              required
            />
          </div>

          {/* البريد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* زر التسجيل */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل طبيب'}
          </button>

          {/* خطأ */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>

        {/* رابط تسجيل الدخول */}
        <p className="text-center text-gray-500 mt-6">
          لديك حساب؟{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}