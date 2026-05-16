// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  Plus, 
  Eye, 
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  MoreHorizontal,
  Stethoscope,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

export default function DoctorPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const casesPerPage = 8;

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!storedUser || !token) { router.push('/login'); return; }
      const userData = JSON.parse(storedUser);
      if (userData.role === 'admin') { router.push('/dashboard'); return; }
      if (userData.role !== 'doctor') { router.push('/login'); return; }
      setDoctor(userData);
      const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
      const doctorCases = storedCases.filter((c: any) => c.user_id === userData.id || c.doctor_name === userData.name);
      doctorCases.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      setCases(doctorCases);
      setFilteredCases(doctorCases);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    let filtered = cases;
    if (searchQuery.trim()) {
      filtered = filtered.filter((c: any) => 
        c.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c: any) => c.status === statusFilter);
    }
    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, cases]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'manufacturing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
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

  // Pagination
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#0088a9]/20 border-t-[#0088a9] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]" dir="rtl">
      {/* Navbar Invisalign Style */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#0088a9] to-[#006d8a] rounded-lg flex items-center justify-center shadow-md">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-900 leading-tight">
                    Elite <span className="text-[#0088a9]">Aligner</span>
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Doctor Portal</span>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1 mr-8">
                <button className="px-4 py-2 text-sm font-medium text-[#0088a9] bg-[#0088a9]/5 rounded-lg border border-[#0088a9]/10">
                  Dashboard
                </button>
                <button 
                  onClick={() => router.push('/cases/new')}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0088a9] hover:bg-gray-50 rounded-lg transition-all"
                >
                  Submit Case
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0088a9] hover:bg-gray-50 rounded-lg transition-all">
                  Resources
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-6 h-6 bg-[#0088a9]/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-[#0088a9]">{doctor?.name?.charAt(0)}</span>
                </div>
                <span className="text-sm text-gray-700">Dr. {doctor?.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your patient cases</p>
          </div>
          <button 
            onClick={() => router.push('/cases/new')}
            className="flex items-center gap-2 px-6 py-3 bg-[#0088a9] text-white rounded-xl hover:bg-[#007a99] transition-all shadow-md shadow-[#0088a9]/20 font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Submit New Case
          </button>
        </div>

        {/* Stats Cards - Invisalign Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Cases', value: cases.length, color: 'bg-gray-900', textColor: 'text-gray-900' },
            { label: 'Active', value: cases.filter(c => c.status === 'active').length, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
            { label: 'Pending', value: cases.filter(c => c.status === 'pending').length, color: 'bg-amber-500', textColor: 'text-amber-600' },
            { label: 'Completed', value: cases.filter(c => c.status === 'completed').length, color: 'bg-blue-500', textColor: 'text-blue-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-2 h-8 ${stat.color} rounded-full`} />
                <span className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Status Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
                { value: 'rejected', label: 'Rejected' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === filter.value
                      ? 'bg-[#0088a9] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {statusFilter === filter.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#0088a9]/20 focus:border-[#0088a9] transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Cases Table - Invisalign Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Case ID</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 mb-2">No cases found</p>
                      <p className="text-sm text-gray-400">Submit your first case to get started</p>
                    </td>
                  </tr>
                ) : (
                  currentCases.map((caseItem: any, index: number) => (
                    <tr key={caseItem.id} className="hover:bg-[#0088a9]/5 transition-colors group">
                      <td className="px-4 py-4 text-sm text-gray-400 font-mono">
                        {indexOfFirstCase + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-[#0088a9]/10 to-[#0088a9]/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-[#0088a9]">
                              {caseItem.patient_name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{caseItem.patient_name}</p>
                            <p className="text-xs text-gray-400">Patient</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          #{caseItem.id?.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {new Date(caseItem.created_at).toLocaleDateString('en-CA')}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadge(caseItem.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(caseItem.status)}`} />
                          {caseItem.status?.charAt(0).toUpperCase() + caseItem.status?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {caseItem.case_type || 'Aligner'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => router.push(`/cases/${caseItem.id}`)}
                            className="p-2 text-[#0088a9] hover:bg-[#0088a9]/10 rounded-lg transition-colors"
                            title="View Case"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More"
                          >
                            <MoreHorizontal className="h-4 w-4" />
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
                Showing {indexOfFirstCase + 1} to {Math.min(indexOfLastCase, filteredCases.length)} of {filteredCases.length} cases
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-[#0088a9] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}