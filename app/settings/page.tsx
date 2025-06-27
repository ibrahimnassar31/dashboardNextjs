import { UserIcon, BellIcon, ShieldIcon, PaletteIcon, DatabaseIcon, DownloadIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-600 mt-2">إدارة تفضيلات النظام والحساب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Menu */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h3>
          <nav className="space-y-2">
            <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md">
              <UserIcon className="ml-3 h-4 w-4" />
              الملف الشخصي
            </a>
            <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              <BellIcon className="ml-3 h-4 w-4" />
              الإشعارات
            </a>
            <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              <ShieldIcon className="ml-3 h-4 w-4" />
              الأمان
            </a>
            <a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              <PaletteIcon className="ml-3 h-4 w-4" />
              المظهر
            </a>
            <a href="#data" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
              <DatabaseIcon className="ml-3 h-4 w-4" />
              البيانات
            </a>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div id="profile" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الملف الشخصي</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-xl font-medium text-white">أ.م</span>
                </div>
                <div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    تغيير الصورة
                  </button>
                  <button className="mr-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                    إزالة
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                  <input
                    type="text"
                    defaultValue="أحمد"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم العائلة</label>
                  <input
                    type="text"
                    defaultValue="محمد"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    defaultValue="ahmed@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المسمى الوظيفي</label>
                  <input
                    type="text"
                    defaultValue="مدير المشروع"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">النبذة التعريفية</label>
                <textarea
                  rows={3}
                  defaultValue="مدير مشاريع خبير في إدارة الفرق وتطوير البرمجيات"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                حفظ التغييرات
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات المهام الجديدة</p>
                  <p className="text-sm text-gray-600">تلقي إشعار عند إضافة مهمة جديدة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">تذكيرات المواعيد النهائية</p>
                  <p className="text-sm text-gray-600">تذكير قبل انتهاء موعد المهام</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-gray-600">تلقي تحديثات عبر البريد الإلكتروني</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div id="security" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الأمان</h3>
            <div className="space-y-4">
              <button className="w-full text-right bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">تغيير كلمة المرور</p>
                    <p className="text-sm text-gray-600">آخر تغيير منذ 3 أشهر</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="w-full text-right bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">المصادقة الثنائية</p>
                    <p className="text-sm text-gray-600">غير مفعل</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="w-full text-right bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">الجلسات النشطة</p>
                    <p className="text-sm text-gray-600">عرض وإدارة الجلسات</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Appearance Settings */}
          <div id="appearance" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المظهر</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المظهر</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>فاتح</option>
                  <option>داكن</option>
                  <option>تلقائي</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>العربية</option>
                  <option>English</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>توقيت الرياض (GMT+3)</option>
                  <option>توقيت القاهرة (GMT+2)</option>
                  <option>توقيت دبي (GMT+4)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div id="data" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة البيانات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">تصدير البيانات</p>
                  <p className="text-sm text-gray-600">تحميل نسخة من جميع بياناتك</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <DownloadIcon className="h-4 w-4 ml-2" />
                  تصدير
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">النسخ الاحتياطي</p>
                  <p className="text-sm text-gray-600">آخر نسخة احتياطية: اليوم</p>
                </div>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                  إنشاء نسخة
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">حذف الحساب</p>
                  <p className="text-sm text-gray-600">حذف دائم لجميع البيانات</p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}