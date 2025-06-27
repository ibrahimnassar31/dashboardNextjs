import { getProjectStats } from '@/lib/data';
import { FolderIcon, CheckSquareIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';

async function DashboardStats() {
  const stats = await getProjectStats();

  const statCards = [
    {
      title: 'إجمالي المشاريع',
      value: stats.totalProjects,
      icon: FolderIcon,
      color: 'bg-blue-500',
      subtext: `${stats.completedProjects} مكتمل`
    },
    {
      title: 'إجمالي المهام',
      value: stats.totalTasks,
      icon: CheckSquareIcon,
      color: 'bg-green-500',
      subtext: `${stats.completedTasks} مكتمل`
    },
    {
      title: 'المهام قيد التنفيذ',
      value: stats.inProgressTasks,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      subtext: `${stats.pendingTasks} معلق`
    },
    {
      title: 'متوسط التقدم',
      value: `${stats.averageProgress}%`,
      icon: TrendingUpIcon,
      color: 'bg-purple-500',
      subtext: 'عبر جميع المشاريع'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.subtext}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">نظرة عامة على المشاريع والمهام</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المشاريع الحديثة</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">إعادة تصميم الموقع الرئيسي</p>
                <p className="text-sm text-gray-600">65% مكتمل</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">حملة تسويقية جديدة</p>
                <p className="text-sm text-gray-600">100% مكتمل</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">المهام القادمة</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-r-4 border-yellow-400">
              <div>
                <p className="font-medium text-gray-900">تطوير واجهة المستخدم</p>
                <p className="text-sm text-gray-600">مستحق في 20 يونيو</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                عالية
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-r-4 border-blue-400">
              <div>
                <p className="font-medium text-gray-900">ربط الـ API</p>
                <p className="text-sm text-gray-600">مستحق في 5 يوليو</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                متوسطة
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
