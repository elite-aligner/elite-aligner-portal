// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('elite-aligner-user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    const allCases = JSON.parse(localStorage.getItem('elite-aligner-cases') || '[]');
    const userCases = allCases.filter((c: any) => c.doctorEmail === JSON.parse(userData).email);
    setCases(userCases);
  }, [router]);

  const filteredCases = cases.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery && !c.patientName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('elite-aligner-auth-token');
    localStorage.removeItem('elite-aligner-user');
    document.cookie = 'elite-aligner-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'manufacturing': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-slate-100 text-slate-800 border-slate-200',
      'rejected': 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      'active': '●',
      'pending': '◐',
      'manufacturing': '⚙',
      'completed': '✓',
      'rejected': '✕',
    };
    return icons[status] || '○';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Elite Aligner</h1>
              <p className="text-xs text-slate-500">Professional Clear Aligner Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-slate-600">Online</span>
            </div>
            
            <span className="text-sm font-medium text-slate-700">Dr. {user.name}</span>
            
            {user?.email === 'panorama_farea@outlook.com' && (
              <Link 
                href="/admin"
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium shadow-md"
              >
                Admin Panel
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <Link href="/dashboard" className="py-4 text-emerald-600 font-bold border-b-2 border-emerald-500">
              Dashboard
            </Link>
            <Link href="/dashboard/new-case" className="py-4 text-slate-500 hover:text-emerald-600 font-medium transition-colors">
              + New Case
            </Link>
            <Link href="/account" className="py-4 text-slate-500 hover:text-emerald-600 font-medium transition-colors">
              My Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, Dr. {user.name}!</h2>
              <p className="text-emerald-100">You have {cases.length} active cases in your dashboard</p>
            </div>
            <Link 
              href="/dashboard/new-case"
              className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-md"
            >
              + Submit New Case
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Cases', 
              count: cases.length, 
              color: 'bg-slate-500',
              icon: '📋',
              trend: '+12%'
            },
            { 
              label: 'Active', 
              count: cases.filter(c => c.status === 'active').length, 
              color: 'bg-emerald-500',
              icon: '●',
              trend: '+5%'
            },
            { 
              label: 'Pending', 
              count: cases.filter(c => c.status === 'pending').length, 
              color: 'bg-amber-500',
              icon: '◐',
              trend: '+2%'
            },
            { 
              label: 'Completed', 
              count: cases.filter(c => c.status === 'completed').length, 
              color: 'bg-blue-500',
              icon: '✓',
              trend: '+8%'
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.count}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
              <div className={`w-full h-1 ${stat.color} rounded-full mt-3 opacity-20`}></div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'pending', 'manufacturing', 'completed', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    filter === f 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Cases' : f}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 pl-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Patient Cases</h3>
            <span className="text-sm text-slate-500">{filteredCases.length} cases found</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">📋</div>
                      <p className="text-slate-500 mb-2">No cases found</p>
                      <Link href="/dashboard/new-case" className="text-emerald-600 hover:underline font-medium">
                        Submit your first case
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((caseItem, index) => (
                    <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                            {caseItem.patientName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{caseItem.patientName}</div>
                            <div className="text-xs text-slate-500">{caseItem.gender || 'N/A'} • {caseItem.dob || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          #{caseItem.id?.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                          <span>{getStatusIcon(caseItem.status)}</span>
                          {caseItem.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {caseItem.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link 
                            href={`/cases/${caseItem.id}`}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link 
                            href={`/viewer/${caseItem.id}`}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="3D View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                            </svg>
                          </Link>
                          <button 
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                            title="Delete"
                            onClick={() => {
                              if (confirm('Delete this case?')) {
                                const newCases = cases.filter(c => c.id !== caseItem.id);
                                localStorage.setItem('elite-aligner-cases', JSON.stringify(newCases));
                                setCases(newCases);
                              }
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/dashboard/new-case" className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
              <span className="text-2xl">➕</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Submit New Case</h3>
            <p className="text-sm text-slate-500">Upload scans and submit a new aligner case</p>
          </Link>
          
          <div className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Treatment Plans</h3>
            <p className="text-sm text-slate-500">View and approve treatment plans</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Shipments</h3>
            <p className="text-sm text-slate-500">Track aligner shipments and deliveries</p>
          </div>
        </div>
      </main>
    </div>
  );
}