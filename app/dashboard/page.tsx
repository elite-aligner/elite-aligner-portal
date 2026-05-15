// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      // ✅ قراءة الدور من الكوكيز
      const cookies = document.cookie.split(';');
      const roleCookie = cookies.find(c => c.trim().startsWith('elite-aligner-role='));
      const role = roleCookie ? decodeURIComponent(roleCookie.split('=')[1]) : null;

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/doctor');
      }
    };

    checkRole();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">جاري التوجيه...</div>
    </div>
  );
}