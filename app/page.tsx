export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              {/* الشعار */}
              <img src="/logo.png" alt="Elite Aligner" className="h-10 w-10 rounded-full" />
              <span className="text-2xl font-bold text-gray-900">
                Elite <span className="text-teal-500">Aligner</span>
              </span>
            </div>
            {/* زر دخول الأطباء */}
            <div className="flex items-center gap-4">
              <a href="/login" className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                دخول الأطباء
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            شارك حالاتك باحترافية
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            منصة Elite Aligner تتيح للأطباء مشاركة حالات تقويم الأسنان بسهولة واحترافية
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/register-doctor" className="px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors text-lg">
              تسجيل طبيب جديد
            </a>
            <a href="/login" className="px-8 py-4 border-2 border-teal-500 text-teal-500 rounded-xl hover:bg-teal-50 transition-colors text-lg">
              دخول الأطباء
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-teal-500 mb-2">98%</div>
              <div className="text-gray-600">نسبة الرضا</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-teal-500 mb-2">+150</div>
              <div className="text-gray-600">طبيب مشترك</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-teal-500 mb-2">+500</div>
              <div className="text-gray-600">حالة ناجحة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            لماذا Elite Aligner؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">رفع سهل</h3>
              <p className="text-gray-600 text-sm">شارك ملفات STL وصور بسهولة</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">أمان تام</h3>
              <p className="text-gray-600 text-sm">حماية كاملة لبيانات المرضى</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">متابعة ذكية</h3>
              <p className="text-gray-600 text-sm">تتبع حالة كل مريض بسهولة</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">وصول عالمي</h3>
              <p className="text-gray-600 text-sm">شارك الحالات مع أي طبيب</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ابدأ الآن مع Elite Aligner
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            انضم لشبكة أطباء تقويم الأسنان الأكبر في المنطقة
          </p>
          <a href="/register-doctor" className="px-8 py-4 bg-white text-teal-500 rounded-xl hover:bg-gray-100 transition-colors text-lg font-bold">
            سجل كطبيب
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Elite Aligner - منصة تقويم الأسنان الاحترافية
          </p>
        </div>
      </footer>
    </div>
  );
}