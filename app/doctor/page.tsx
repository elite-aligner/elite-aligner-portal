'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, Plus, Eye, Download } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase';

interface CaseItem {
  id: string;
  patient_name: string;
  status: string;
  stage: string;
  created_at: string;
}

export default function DoctorPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // جلب بيانات الطبيب
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!doctorData) {
        router.push('/login');
        return;
      }

      setDoctor(doctorData);

      // جلب حالات الطبيب فقط
      const { data: casesData } = await supabase
        .from('cases')
        .select('*')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false });

      setCases(casesData || []);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    const supabase = createClientSupabase();
    supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Elite <span className="text-blue-600">Aligner</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{doctor?.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">حالاتي</h1>
          <button 
            onClick={() => router.push('/cases/new')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            رفع حالة جديدة
          </button>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">رقم الحالة</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المريض</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المرحلة</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{caseItem.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{caseItem.patient_name}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      caseItem.status === 'active' ? 'bg-green-100 text-green-700' :
                      caseItem.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {caseItem.status === 'active' ? 'نشطة' :
                       caseItem.status === 'completed' ? 'مكتملة' : 'قيد الانتظار'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{caseItem.stage}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(caseItem.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        عرض
                      </button>
                      <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        تحميل
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}