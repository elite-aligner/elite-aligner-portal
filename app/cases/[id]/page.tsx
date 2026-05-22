// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowRight, 
  Eye, 
  Download, 
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle2,
  MessageSquare,
  History,
  Truck,
  Archive,
  Stethoscope,
  Image as ImageIcon,
  Box,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const TABS = [
  { id: 'digital-setups', label: 'Digital Setups', icon: Box },
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'records', label: 'Records', icon: ImageIcon },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'history', label: 'History', icon: History },
  { id: 'shipments', label: 'Shipments', icon: Truck },
];

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('digital-setups');
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cases = JSON.parse(localStorage.getItem('cases') || '[]');
    const found = cases.find((c: any) => c.id === params.id);
    if (found) {
      setCaseData(found);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">الحالة غير موجودة</p>
          <button 
            onClick={() => router.push('/doctor')}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            العودة للحالات
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'نشطة',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'completed':
        return {
          label: 'مكتملة',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500'
        };
      default:
        return {
          label: 'قيد الانتظار',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500'
        };
    }
  };

  const statusConfig = getStatusConfig(caseData.status);

  // ✅ فتح العارض مع URL
  const handleView3D = (fileName: string) => {
    if (!fileName) return;
    const viewerUrl = `/viewer?url=${encodeURIComponent(`/files/${fileName}`)}`;
    window.open(viewerUrl, '_blank');
  };

  // ✅ تحميل الملف
  const handleDownload = (fileName: string) => {
    if (!fileName) return;
    const link = document.createElement('a');
    link.href = `/files/${fileName}`;
    link.download = fileName;
    link.click();
  };

  // ✅ الحصول على اسم ملف STL
  const getStlFileName = (position: 'upper' | 'lower') => {
    // التحقق من جميع المفاتيح الممكنة
    const keys = position === 'upper' 
      ? ['upper_stl', 'upperStl', 'upper-stl', 'upperStlUrl']
      : ['lower_stl', 'lowerStl', 'lower-stl', 'lowerStlUrl'];
    
    for (const key of keys) {
      if (caseData[key] && caseData[key] !== '') return caseData[key];
      if (caseData.impressions?.[key] && caseData.impressions[key] !== '') return caseData.impressions[key];
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20" dir="rtl">
      {/* Navbar احترافي */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full object-contain shadow-lg" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight">
                  Elite <span className="text-green-600">Aligner</span>
                </span>
                <span className="text-xs text-gray-500">بوابة تقويم الأسنان</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/doctor')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all text-sm font-medium"
              >
                <ArrowRight className="h-4 w-4" />
                العودة للحالات
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* بطاقة المريض الاحترافية */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-green-700 font-bold text-2xl shadow-sm">
                {caseData.patientName?.charAt(0) || caseData.patient_name?.charAt(0) || 'م'}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {caseData.patientName || caseData.patient_name || 'مريض'}
                  </h2>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color} w-fit`}>
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    د. {caseData.doctorName || caseData.doctor_name || 'طبيب'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(caseData.createdAt || caseData.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-medium">
                    {caseData.gender || 'غير محدد'}
                  </span>
                  {caseData.dob && (
                    <span className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-medium">
                      DOB: {caseData.dob}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                Refinements
              </button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                Retainers
              </button>
              <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                Missing Aligner
              </button>
            </div>
          </div>
        </div>

        {/* التبويبات الاحترافية */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Digital Setups */}
            {activeTab === 'digital-setups' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Digital Setups</h3>
                  <span className="text-sm text-gray-500">الإعدادات الرقمية للحالة</span>
                </div>
                <div className="space-y-4">
                  {[
                    { version: 'Revision 2', package: 'Lite Dual Arch', approval: 'Approved', date: '2026-05-10', fileName: getStlFileName('upper') },
                    { version: 'Revision 1', package: 'Lite Dual Arch', approval: 'Pending', date: '2026-05-05', fileName: '' },
                  ].map((setup, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/80 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Box className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{setup.version}</p>
                          <p className="text-sm text-gray-500">{setup.package}</p>
                          <p className="text-xs text-gray-400 mt-1">{setup.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          setup.approval === 'Approved' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {setup.approval === 'Approved' ? 'معتمد' : 'قيد المراجعة'}
                        </span>
                        {setup.fileName && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView3D(setup.fileName)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-medium shadow-sm shadow-green-500/20"
                            >
                              <Eye className="h-4 w-4" />
                              عرض 3D
                              <ExternalLink className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDownload(setup.fileName)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium border border-gray-200"
                            >
                              <Download className="h-4 w-4" />
                              تحميل
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            {activeTab === 'details' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    التعليمات الطبية
                  </h3>
                  <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(caseData.prescription || {}).map(([key, value]) => (
                        key !== 'doNotMove' && key !== 'avoidAttachments' && key !== 'extract' && key !== 'keepSpaces' && (
                          <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500 capitalize text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="font-semibold text-gray-900 text-sm">{value as string}</span>
                          </div>
                        )
                      ))}
                      {(!caseData.prescription || Object.keys(caseData.prescription).length === 0) && (
                        <p className="text-gray-400 col-span-2 text-center py-4">لا توجد تعليمات مسجلة</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      الشكوى الرئيسية
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {caseData.prescription?.chiefComplaint || caseData.chiefComplaint || 'غير مسجل'}
                    </p>
                  </div>

                  <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      ملاحظات إضافية
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {caseData.prescription?.additionalNotes || caseData.additionalNotes || 'لا توجد ملاحظات'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Records - المُصلح */}
            {activeTab === 'records' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Box className="h-5 w-5 text-green-600" />
                    الملفات ثلاثية الأبعاد (STL)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* الفك العلوي */}
                    <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6 text-center hover:border-green-200 transition-colors">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Box className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">الفك العلوي</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {getStlFileName('upper') ? '✓ ملف متوفر' : 'لم يتم الرفع'}
                      </p>
                      {getStlFileName('upper') && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView3D(getStlFileName('upper')!)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            عرض 3D
                            <ExternalLink className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDownload(getStlFileName('upper')!)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium border border-gray-200"
                          >
                            <Download className="h-4 w-4" />
                            تحميل
                          </button>
                        </div>
                      )}
                    </div>

                    {/* الفك السفلي */}
                    <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6 text-center hover:border-green-200 transition-colors">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Box className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">الفك السفلي</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {getStlFileName('lower') ? '✓ ملف متوفر' : 'لم يتم الرفع'}
                      </p>
                      {getStlFileName('lower') && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleView3D(getStlFileName('lower')!)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            عرض 3D
                            <ExternalLink className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDownload(getStlFileName('lower')!)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium border border-gray-200"
                          >
                            <Download className="h-4 w-4" />
                            تحميل
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                    الصور
                  </h3>
                  {caseData.images && Object.keys(caseData.images).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(caseData.images).map(([key, url]) => (
                        <div key={key} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer">
                          <img 
                            src={url as string} 
                            alt={key} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-12 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">لا توجد صور مرفوعة</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat */}
            {activeTab === 'chat' && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg mb-2">الدردشة</p>
                <p className="text-gray-400 text-sm">سيتم تفعيل هذه الميزة قريباً...</p>
              </div>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-green-600" />
                  سجل الحالة
                </h3>
                <div className="relative">
                  <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 relative">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4 flex-1">
                        <p className="font-bold text-gray-900">تم إنشاء الحالة</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(caseData.createdAt || caseData.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipments */}
            {activeTab === 'shipments' && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg mb-2">الشحنات</p>
                <p className="text-gray-400 text-sm">لا توجد شحنات مسجلة بعد...</p>
              </div>
            )}
          </div>
        </div>

        {/* زر الأرشفة */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all border border-red-100 font-medium">
            <Archive className="h-4 w-4" />
            أرشفة الحالة
          </button>
        </div>
      </main>
    </div>
  );
}