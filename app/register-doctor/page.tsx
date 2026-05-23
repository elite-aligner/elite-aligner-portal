'use client'

import { useState } from 'react'

export default function RegisterDoctorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    clinic: '',
    specialty: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // ✅ محاولة Supabase silently (بدون خطأ إذا فشل)
      try {
        const { createClientSupabase } = await import('@/lib/supabase')
        const supabase = createClientSupabase()
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: 'doctor',
              clinic: formData.clinic,
              specialty: formData.specialty,
              phone: formData.phone
            }
          }
        })

        if (!authError && authData.user) {
          await supabase.from('doctors').insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            role: 'doctor',
            phone: formData.phone,
            clinic: formData.clinic,
            specialty: formData.specialty
          })
        }
      } catch (supabaseErr) {
        console.log('Supabase failed, using localStorage only:', supabaseErr)
      }

      // ✅ حفظ في localStorage دائماً
      const doctors = JSON.parse(localStorage.getItem('doctors') || '[]')
      
      if (doctors.find((d: any) => d.email === formData.email)) {
        setError('Email already registered')
        setLoading(false)
        return
      }

      const newDoctor = {
        id: 'doctor-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        clinic: formData.clinic,
        specialty: formData.specialty,
        password: formData.password,
        role: 'doctor',
        createdAt: new Date().toISOString()
      }

      doctors.push(newDoctor)
      localStorage.setItem('doctors', JSON.stringify(doctors))

      // ✅ تسجيل دخول تلقائي
      localStorage.setItem('user', JSON.stringify({
        id: newDoctor.id,
        email: newDoctor.email,
        name: newDoctor.name,
        role: 'doctor'
      }))
      localStorage.setItem('token', 'doctor-token-' + Date.now())

      setSuccess(true)

    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <div className="text-green-500 text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created. You can now login.
          </p>
          <a href="/doctor" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Doctor Registration</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Clinic Name</label>
            <input
              type="text"
              name="clinic"
              value={formData.clinic}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Specialty</label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Specialty</option>
              <option value="orthodontics">Orthodontics</option>
              <option value="general">General Dentistry</option>
              <option value="prosthodontics">Prosthodontics</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password * (min 6 chars)</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/login" className="text-green-600 hover:text-green-500 text-sm">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  )
}