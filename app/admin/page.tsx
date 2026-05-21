// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, Eye, Download, Users, FolderOpen, CheckCircle, Clock, Search, ChevronLeft, ChevronRight, FileText, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 8;

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ نفس الكود الأصلي بالضبط - لم يتغير
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      
      if (userData.role !== 'admin') {
        router.push('/doctor');
        return;
      }

      setAdmin(userData);

      // ✅ الحل: قراءة الحالات من نفس مصدر Doctor (localStorage)
      const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
      storedCases.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      setCases(storedCases);

      // ✅ استخراج الأطباء من الحالات
      const uniqueDoctors = new Map();
      storedCases.forEach((c: any) => {
        const docId = c.user_id || c.doctor_id || 'unknown';
        if (!uniqueDoctors.has(docId)) {
          uniqueDoctors.set(docId, {
            id: docId,
            name: c.doctor_name || c.doctor?.name || 'غير معروف',
            email: c.doctor_email || c.doctor?.email || ''
          });
        }
      });
      setDoctors(Array.from(uniqueDoctors.values()));

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  // ✅ نفس handleLogout الأصلي بالضبط - لم يتغير
  const handleLogout = async () => {
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

  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const stats = {
    total: cases.length,
    active: cases.filter((c: any) => c.status === 'active').length,
    pending: cases.filter((c: any) => c.status === 'pending').length,
    completed: cases.filter((c: any) => c.status === 'completed').length,
    doctors: doctors.length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'manufacturing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'completed': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      case 'manufacturing': return 'bg-purple-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
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
      {/* Navbar - نفس التصميم الأصلي */}
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

        {/* Stats */}
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'الكل' },
                { value: 'active', label: 'نشطة' },
                { value: 'pending', label: 'قيد الانتظار' },
                { value: 'completed', label: 'مكتملة' },
                { value: 'rejected', label: 'مرفوضة' },
              ].map((f: any) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.value 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
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

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">جميع الحالات</h3>
            <span className="text-sm text-gray-500">{filteredCases.length} حالة</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">#</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المريض</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الطبيب</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-300" />
                      </div>
                      <p>لا توجد حالات</p>
                    </td>
                  </tr>
                ) : (
                  currentCases.map((caseItem: any, index: number) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-400 font-mono">{indexOfFirstCase + index + 1}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{caseItem.patient_name}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {caseItem.doctor_name || 'غير معروف'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(caseItem.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(caseItem.status)}`} />
                          {caseItem.status === 'active' ? 'نشطة' :
                           caseItem.status === 'completed' ? 'مكتملة' :
                           caseItem.status === 'pending' ? 'قيد الانتظار' :
                           caseItem.status === 'rejected' ? 'مرفوضة' :
                           caseItem.status === 'manufacturing' ? 'قيد التصنيع' :
                           'غير معروف'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString('ar-SA') : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            عرض
                          </button>
                          <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs flex items-center gap-1">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
              <div className="text-sm text-gray-500">
                عرض {indexOfFirstCase + 1} إلى {Math.min(indexOfLastCase, filteredCases.length)} من {filteredCases.length} حالة
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                  <ChevronRight className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Doctors Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">الأطباء المسجلين</h3>
            <span className="text-sm text-gray-500">{doctors.length} طبيب</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">#</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الاسم</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">البريد</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الحالات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">لا يوجد أطباء مسجلون</td>
                  </tr>
                ) : (
                  doctors.map((doctor: any, index: number) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-400 font-mono">{index + 1}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{doctor.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{doctor.email || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {cases.filter((c: any) => (c.user_id === doctor.id || c.doctor_name === doctor.name)).length} حالة
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}