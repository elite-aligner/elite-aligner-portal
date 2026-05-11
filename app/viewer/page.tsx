// app/viewer/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, X, ExternalLink } from 'lucide-react';
import STLViewer from '../../components/STLViewer';

export default function ViewerPage() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const urlParam = searchParams.get('url') || '';
    setUrl(decodeURIComponent(urlParam));
  }, [searchParams]);

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Elite Aligner</h1>
            <p className="text-xs text-gray-500">3D Viewer</p>
          </div>
        </div>
        <div className="flex gap-2">
          {url.startsWith('http') && (
            <button 
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              فتح في الموقع الأصلي
            </button>
          )}
          <button 
            onClick={() => window.close()} 
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <p className="text-gray-600 mb-4">لا يمكن عرض الرابط داخل الموقع</p>
            <button 
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <ExternalLink className="h-5 w-5" />
              فتح في نافذة جديدة
            </button>
            <p className="text-xs text-gray-400 mt-4">{url}</p>
          </div>
        ) : url.startsWith('http') ? (
          <iframe 
            src={url} 
            className="w-full h-full"
            allow="fullscreen"
            onError={() => setError(true)}
          />
        ) : url ? (
          <STLViewer url={url} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">لا يوجد رابط للعرض</p>
          </div>
        )}
      </div>
    </div>
  );
}