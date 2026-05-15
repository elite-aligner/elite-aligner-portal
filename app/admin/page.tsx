// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, Eye, Download, Users, FolderOpen, CheckCircle, Clock } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientSupabase();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!adminData || adminData.role !== 'admin') {
        router.push('/doctor');
        return;
      }

      setAdmin(adminData);

      const { data: casesData } = await supabase
        .from('cases')
        .select('*, doctors(name, email)')
        .order('created_at', { ascending: false });

      setCases(casesData || []);

      const { data: doctorsData } = await supabase
        .from('doctors')
        .select('id, name, email, role')
        .eq('role', 'doctor');

      setDoctors(doctorsData || []);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClientSupabase();
    await supabase.auth.signOut();
    
    document.cookie = 'elite-aligner-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'elite-aligner-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    localStorage.removeItem('elite-aligner-user');
    router.push('/login');
  };

  const filteredCases = cases.filter((c: any) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery && !c.patient_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: cases.length,
    active: cases.filter((c: any) => c.status === 'active').length,
    pending: cases.filter((c: any) => c.status === 'pending').length,
    completed: cases.filter((c: any) => c.status === 'completed').length,
    doctors: doctors.length
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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-amber-600" />
              <span className="text-xl font-bold text-gray-900">
                Elite <span className="text-amber-600">Aligner</span>
              </span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium mr-2">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{admin?.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الأدمن</h1>
          <p className="text-gray-500 mt-1">إدارة الحالات والأطباء</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'إجمالي الحالات', count: stats.total, icon: FolderOpen, color: 'bg-blue-500' },
            { label: 'نشطة', count: stats.active, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'قيد الانتظار', count: stats.pending, icon: Clock, color: 'bg-amber-500' },
            { label: 'مكتملة', count: stats.completed, icon: CheckCircle, color: 'bg-purple-500' },
            { label: 'الأطباء', count: stats.doctors, icon: Users, color: 'bg-slate-500' },
          ].map((stat: any) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'pending', 'completed'].map((f: any) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'الكل' : f === 'active' ? 'نشطة' : f === 'pending' ? 'قيد الانتظار' : 'مكتملة'}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="بحث باسم المريض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">جميع الحالات</h3>
            <span className="text-sm text-gray-500">{filteredCases.length} حالة</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">رقم الحالة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المريض</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الطبيب</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المرحلة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      لا توجد حالات
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((caseItem: any) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{caseItem.id?.slice(-8)}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{caseItem.patient_name}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {caseItem.doctors?.name || 'غير معروف'}
                        <div className="text-xs text-gray-400">{caseItem.doctors?.email}</div>
                      </td>
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
                      <td className="px-4 py-4 text-sm text-gray-600">{caseItem.stage || '-'}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-900">الأطباء المسجلين</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الاسم</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">البريد</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الحالات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.map((doctor: any) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{doctor.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{doctor.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {cases.filter((c: any) => c.doctor_id === doctor.id).length} حالة
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}