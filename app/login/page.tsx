// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ✅ التحقق من Supabase أولاً
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (doctor) {
        // ✅ طبيب موجود في Supabase
        localStorage.setItem('user', JSON.stringify({
          id: doctor.id,
          email: doctor.email,
          name: doctor.name,
          role: doctor.role
        }))
        localStorage.setItem('token', doctor.role + '-token-' + Date.now())

        if (doctor.role === 'admin') {
          window.location.href = '/dashboard'
        } else {
          window.location.href = '/doctor'
        }
        return
      }

      // ❌ لا يوجد في Supabase — تحقق من LocalStorage (للأطباء القدامى)
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]')
      const localDoctor = doctors.find((d: any) => d.email === email && d.password === password)
      
      if (localDoctor) {
        localStorage.setItem('user', JSON.stringify({
          id: localDoctor.id,
          email: localDoctor.email,
          name: localDoctor.name,
          role: 'doctor'
        }))
        localStorage.setItem('token', 'doctor-token-' + Date.now())
        window.location.href = '/doctor'
        return
      }

      setError('Invalid email or password')

    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden flex items-center justify-center p-4" dir="rtl">
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img src="/logo.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Elite Aligner" className="w-24 h-24 mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Elite <span className="text-green-500">Aligner</span>
          </h1>
          <p className="text-gray-300 text-sm">PMC - Professional Medical Center</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white text-center mb-6">تسجيل الدخول</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-xl mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full pr-10 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-10 pl-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <a href="/forgot-password" className="text-green-400 hover:text-green-300 transition-colors">
                نسيت كلمة المرور؟
              </a>
              <a href="/register-doctor" className="text-green-400 hover:text-green-300 transition-colors">
                تسجيل طبيب جديد
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Elite Aligner Portal ©️ 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}