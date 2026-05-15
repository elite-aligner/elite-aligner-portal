// @ts-nocheck
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" dir="rtl">
      {/* خلفية الشعار */}
      <div className="absolute inset-0 opacity-10">
        <img src="/logo.png" alt="" className="w-full h-full object-contain" />
      </div>
      
      {/* محتوى */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* الشعار */}
        <div className="text-center mb-12">
          <img src="/logo.png" alt="Elite Aligner" className="w-32 h-32 mx-auto mb-6 rounded-full" />
          <h1 className="text-5xl font-bold text-white mb-4">
            Elite <span className="text-green-500">Aligner</span>
          </h1>
          <p className="text-xl text-gray-300">PMC - Professional Medical Center</p>
        </div>

        {/* نبذة تعريفية */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">من نحن</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Elite Aligner هي شركة رائدة في مجال تقويم الأسنان الشفاف. نقدم حلولاً متقدمة للأطباء 
            والمرضى على حد سواء، مع تقنيات ثلاثية الأبعاد لتحليل الحالات وإنتاج تقويم مخصص 
            بجودة عالية.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-green-500/20 rounded-xl p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">تقنية 3D</h3>
              <p className="text-gray-300">تحليل دقيق للحالات باستخدام تقنية الماسح الضوئي</p>
            </div>
            <div className="bg-green-500/20 rounded-xl p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">جودة عالية</h3>
              <p className="text-gray-300">تقويم شفاف مصنوع من أفضل المواد الطبية</p>
            </div>
            <div className="bg-green-500/20 rounded-xl p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">دعم كامل</h3>
              <p className="text-gray-300">فريق متخصص لمساعدة الأطباء في كل خطوة</p>
            </div>
          </div>
        </div>

        {/* زر الانتقال للبورتال */}
        <div className="text-center">
          <Link 
            href="/login"
            className="inline-block px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30"
          >
            دخول البوابة الطبية
          </Link>
          <p className="text-gray-400 mt-4">للأطباء المسجلين فقط</p>
        </div>
      </div>
    </div>
  );
}