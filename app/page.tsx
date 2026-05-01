import Link from 'next/link'
import { Smile, Shield, Share2, Users } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'أمان وحماية',
      description: 'حماية كاملة لبيانات المرضى وخصوصية الحالات',
    },
    {
      icon: Share2,
      title: 'مشاركة سهلة',
      description: 'شارك حالاتك مع الزملاء والمتخصصين بسهولة',
    },
    {
      icon: Users,
      title: 'مجتمع متخصص',
      description: 'تواصل مع أطباء التقويم الشفاف حول العالم',
    },
    {
      icon: Smile,
      title: 'نتائج مبهرة',
      description: 'وثق وشارك نتائج علاجاتك مع صور قبل وبعد',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dental-light to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8">
              <Smile className="h-5 w-5 text-dental" />
              <span className="text-sm font-medium text-gray-600">بوابة حالات التقويم الشفاف</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              شارك حالاتك
              <span className="text-dental"> باحترافية</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              منصة متخصصة لأطباء التقويم الشفاف لمشاركة الحالات، 
              تبادل الخبرات، وتوثيق النتائج بأعلى معايير الجودة والخصوصية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-primary text-center text-lg px-8 py-4">
                تسجيل الدخول
              </Link>
              <Link href="/cases" className="btn-secondary text-center text-lg px-8 py-4">
                تصفح الحالات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا Elite Aligner؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              منصة مصممة خصيصاً لتلبية احتياجات أطباء التقويم الشفاف
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-dental-light rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-7 w-7 text-dental" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card">
              <div className="text-4xl font-bold text-dental mb-2">500+</div>
              <div className="text-gray-600">حالة مسجلة</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-dental mb-2">150+</div>
              <div className="text-gray-600">طبيب مشترك</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-dental mb-2">98%</div>
              <div className="text-gray-600">نسبة الرضا</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
