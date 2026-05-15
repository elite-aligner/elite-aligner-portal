// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // ✅ تخزين التوكن في الكوكيز
      if (data.session?.access_token) {
        const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
        document.cookie = `elite-aligner-auth-token=${encodeURIComponent(data.session.access_token)}; expires=${expires}; path=/; SameSite=Lax`;
      }

      // ✅ تخزين الدور في الكوكيز (مهم للـ Middleware!)
      if (data.user?.role) {
        const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
        document.cookie = `elite-aligner-role=${encodeURIComponent(data.user.role)}; expires=${expires}; path=/; SameSite=Lax`;
      }

      // ✅ تخزين في LocalStorage للاستخدام في الصفحات
      localStorage.setItem('elite-aligner-user', JSON.stringify(data.user));

      // ✅ التوجيه حسب الدور
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/doctor');
      }
      
    } catch (err: any) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* خلفية الشعار */}
      <div className="absolute inset-0 opacity-5">
        <img src="/logo.png" alt="" className="w-full h-full object-contain" />
      </div>
      
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src="/logo.png" alt="Elite Aligner" className="w-16 h-16 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Elite <span className="text-green-500">Aligner</span>
          </h1>
          <p className="text-gray-500 mt-2">تسجيل دخول الأطباء</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            ليس لديك حساب؟{' '}
            <a href="/register-doctor" className="text-green-600 hover:underline font-medium">
              تسجيل طبيب جديد
            </a>
          </p>
          <p className="text-gray-400 text-xs">
            <a href="/" className="hover:text-gray-600">
              العودة للصفحة الرئيسية
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}