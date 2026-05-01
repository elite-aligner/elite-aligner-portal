# Elite Aligner Portal

بوابة حالات التقويم الشفاف - منصة متخصصة لأطباء التقويم الشفاف

## المميزات

- ✅ تسجيل دخول وإنشاء حساب
- ✅ رفع حالات جديدة مع صور قبل/بعد
- ✅ معرض الحالات مع بحث وتصفية
- ✅ لوحة تحكم للأطباء
- ✅ نظام اعتماد/رفض الحالات
- ✅ تصميم عصري ومتجاوب (RTL)
- ✅ ربط كامل مع Supabase

## التقنيات

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database + Storage)
- Lucide Icons

## التثبيت

```bash
npm install
```

## الإعداد

1. أنشئ ملف `.env.local` وأضف:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

2. شغّل ملف SQL في Supabase SQL Editor: `supabase-setup.sql`

3. شغّل المشروع:

```bash
npm run dev
```

## البنية

```
app/
├── page.tsx          # الصفحة الرئيسية
├── layout.tsx        # التخطيط العام
├── login/page.tsx    # تسجيل الدخول
├── register/page.tsx # إنشاء حساب
├── dashboard/page.tsx # لوحة التحكم
├── cases/
│   ├── page.tsx      # قائمة الحالات
│   ├── new/page.tsx  # إضافة حالة جديدة
│   └── [id]/page.tsx # تفاصيل الحالة
components/
├── Navbar.tsx        # شريط التنقل
└── Toaster.tsx       # إشعارات
lib/
├── supabase.ts       # عميل Supabase
└── utils.ts          # أدوات مساعدة
types/
└── index.ts          # أنواع TypeScript
```

## الربط مع Vercel

1. ارفع المشروع على GitHub
2. اربط المستودع مع Vercel
3. أضف متغيرات البيئة في إعدادات Vercel
4. عيّن النطاق المخصص: www.elite-aligner.com
