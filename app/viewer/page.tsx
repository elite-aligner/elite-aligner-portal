// @ts-nocheck
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X, ExternalLink, ArrowRight, Box, FileText } from 'lucide-react';
import STLViewer from '../../components/STLViewer';

function ViewerContent() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParam = searchParams.get('url') || '';
    setUrl(decodeURIComponent(urlParam));
    setLoading(false);
  }, [searchParams]);

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex flex-col relative overflow-hidden" dir="rtl">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header - نفس تصميم البوابة */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full object-cover shadow-lg" />
          <div>
            <h1 className="text-lg font-bold text-white">
              Elite <span className="text-green-400">Aligner</span>
            </h1>
            <p className="text-xs text-green-200/60">3D Viewer</p>
          </div>
        </div>
        <div className="flex gap-2">
          {url.startsWith('http') && (
            <button 
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              فتح في الموقع الأصلي
            </button>
          )}
          <button 
            onClick={handleGoBack}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative p-4">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
            <p className="text-green-200">جاري التحميل...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 m-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Box className="h-10 w-10 text-green-400" />
            </div>
            <p className="text-white text-lg mb-2">لا يمكن عرض الرابط داخل الموقع</p>
            <p className="text-green-200/60 text-sm mb-6 text-center max-w-md">{url}</p>
            <button 
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
            >
              <ExternalLink className="h-5 w-5" />
              فتح في نافذة جديدة
            </button>
          </div>
        ) : url.startsWith('http') ? (
          <div className="absolute inset-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <iframe 
              src={url} 
              className="w-full h-full"
              allow="fullscreen"
              onError={() => setError(true)}
            />
          </div>
        ) : url ? (
          <div className="absolute inset-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <STLViewer url={url} />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-green-400" />
            </div>
            <p className="text-white text-lg mb-2">لا يوجد رابط للعرض</p>
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <ArrowRight className="h-5 w-5" />
              العودة للحالات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-green-200 text-lg">جاري التحميل...</p>
        </div>
      </div>
    }>
      <ViewerContent />
    </Suspense>
  );
}