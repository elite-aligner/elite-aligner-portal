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
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'manufacturing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full bg-white" />
            <div>
              <h1 className="text-lg font-bold">Elite Aligner</h1>
              <p className="text-xs text-green-200">PMC - Professional Medical Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Dr. {user.name}</span>
            {user?.email === 'panorama_farea@outlook.com' && (
              <Link 
                href="/admin"
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                Admin
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-2 flex gap-6">
          <Link href="/dashboard" className="text-green-600 font-bold border-b-2 border-green-600 pb-2">
            Dashboard
          </Link>
          <Link href="/dashboard/new-case" className="text-gray-600 hover:text-green-600 pb-2">
            + Submit New Case
          </Link>
          <Link href="/account" className="text-gray-600 hover:text-green-600 pb-2">
            My Account
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'All Cases', count: cases.length, color: 'bg-gray-500' },
            { label: 'Active', count: cases.filter(c => c.status === 'active').length, color: 'bg-green-500' },
            { label: 'Pending', count: cases.filter(c => c.status === 'pending').length, color: 'bg-yellow-500' },
            { label: 'Completed', count: cases.filter(c => c.status === 'completed').length, color: 'bg-blue-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                {stat.count}
              </div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'pending', 'active', 'completed', 'rejected', 'archived'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  filter === f 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No cases found. <Link href="/dashboard/new-case" className="text-green-600 hover:underline">Add your first case</Link>
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem, index) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/cases/${caseItem.id}`} className="flex items-center gap-3 hover:opacity-80">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">
                          {caseItem.patientName?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 hover:text-green-600">{caseItem.patientName}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <Link href={`/cases/${caseItem.id}`} className="hover:text-green-600">
                        #{caseItem.id?.slice(-10)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{caseItem.createdAt}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link 
                          href={`/cases/${caseItem.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          👁
                        </Link>
                        <Link 
                          href={`/viewer/${caseItem.id}`}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="3D View"
                        >
                          🦷
                        </Link>
                        <button 
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                          onClick={() => {
                            const newCases = cases.filter(c => c.id !== caseItem.id);
                            localStorage.setItem('elite-aligner-cases', JSON.stringify(newCases));
                            setCases(newCases);
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}