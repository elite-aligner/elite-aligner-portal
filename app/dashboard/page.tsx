// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('elite-aligner-user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // ✅ جلب حالات الطبيب فقط (من localStorage)
    const allCases = JSON.parse(localStorage.getItem('elite-aligner-cases') || '[]');
    const userCases = allCases.filter((c: any) => c.doctorEmail === JSON.parse(userData).email);
    setCases(userCases);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('elite-aligner-auth-token');
    localStorage.removeItem('elite-aligner-user');
    document.cookie = 'elite-aligner-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full" />
            <h1 className="text-xl font-bold text-gray-900">
              Elite <span className="text-green-500">Aligner</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">مرحباً، Dr. {user.name}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm mb-2">الحالات النشطة</h3>
            <p className="text-3xl font-bold text-green-600">{cases.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm mb-2">الحالات المكتملة</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm mb-2">الحالات الجديدة</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>

        {/* زر إضافة حالة جديدة */}
        <div className="mb-8">
          <Link 
            href="/dashboard/new-case"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
          >
            + إضافة حالة جديدة
          </Link>
        </div>

        {/* قائمة الحالات */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">حالاتي</h2>
          </div>
          
          {cases.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">لا توجد حالات مسجلة</p>
              <Link 
                href="/dashboard/new-case"
                className="text-green-600 hover:underline"
              >
                إضافة أول حالة
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {cases.map((caseItem) => (
                <div key={caseItem.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">{caseItem.patientName}</h4>
                    <p className="text-sm text-gray-500">{caseItem.createdAt}</p>
                  </div>
                  <Link 
                    href={`/viewer/${caseItem.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    عرض 3D
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}