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
      {/* زر دخول الأطباء فقط */}
      <div className="flex items-center gap-4">
        <a href="/login" className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
          دخول الأطباء
        </a>
      </div>
    </div>
  </div>
</nav>