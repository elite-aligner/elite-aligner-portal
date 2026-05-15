// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const TABS = [
  { id: 'digital-setups', label: 'Digital Setups' },
  { id: 'details', label: 'Details' },
  { id: 'records', label: 'Records' },
  { id: 'chat', label: 'Chat' },
  { id: 'history', label: 'History' },
  { id: 'shipments', label: 'Shipments' },
];

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('digital-setups');
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    const cases = JSON.parse(localStorage.getItem('elite-aligner-cases') || '[]');
    const found = cases.find((c: any) => c.id === params.id);
    if (found) setCaseData(found);
  }, [params.id]);

  if (!caseData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full bg-white" />
            <h1 className="text-lg font-bold">Elite Aligner</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Dr. {caseData.doctorName}</span>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Patient Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
              {caseData.patientName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{caseData.patientName}</h2>
              <p className="text-sm text-gray-500">{caseData.gender} | DOB: {caseData.dob}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {caseData.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Refinements
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Retainers
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Missing Aligner
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'digital-setups' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Digital Setups</h3>
                <div className="space-y-4">
                  {[
                    { version: 'Revision 2', package: 'Lite Dual Arch', approval: 'Approved' },
                    { version: 'Revision 1', package: 'Lite Dual Arch', approval: 'Pending' },
                  ].map((setup, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{setup.version}</p>
                        <p className="text-sm text-gray-500">{setup.package}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          setup.approval === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {setup.approval}
                        </span>
                        <Link 
                          href={`/viewer/${caseData.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          👁 View 3D
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(caseData.prescription || {}).map(([key, value]) => (
                      key !== 'doNotMove' && key !== 'avoidAttachments' && key !== 'extract' && key !== 'keepSpaces' && (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium text-gray-900">{value as string}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Chief Complaint</h3>
                  <p className="text-gray-600">{caseData.prescription?.chiefComplaint || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                  <p className="text-gray-600">{caseData.prescription?.additionalNotes || 'N/A'}</p>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Impressions</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium text-gray-700">Upper Impression</p>
                    <p className="text-sm text-gray-500">{caseData.impressions?.upperStl || 'Not uploaded'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium text-gray-700">Lower Impression</p>
                    <p className="text-sm text-gray-500">{caseData.impressions?.lowerStl || 'Not uploaded'}</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">Images</h3>
                <div className="grid grid-cols-4 gap-4">
                  {caseData.images && Object.entries(caseData.images).map(([key, url]) => (
                    <div key={key} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={url as string} alt={key} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="text-center py-12 text-gray-500">
                Chat functionality coming soon...
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Case Created</p>
                    <p className="text-sm text-gray-500">{caseData.createdAt}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipments' && (
              <div className="text-center py-12 text-gray-500">
                No shipments yet...
              </div>
            )}
          </div>
        </div>

        {/* Archive Button */}
        <div className="mt-6 text-right">
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            🗑 Archive Case
          </button>
        </div>
      </main>
    </div>
  );
}