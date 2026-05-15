// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff } from 'lucide-react';

// ✅ عميل Supabase مباشرة في المتصفح
const supabase = createClient(
  'https://sknybbyxencuhbenshk.supabase.co',
  'sb_publishable_TqgzLzUYs9Hn9jyIAXUCOg_9TlGXlNO'
);

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
      if (password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      // ✅ إنشاء مستخدم في Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('فشل إنشاء المستخدم');

      // ✅ إضافة للجدول doctors
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert([{ 
          id: authData.user.id,
          email, 
          name, 
          role: 'doctor' 
        }]);

      if (doctorError) throw new Error(doctorError.message);

      alert('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول');
      router.push('/login');
      
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex