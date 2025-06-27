import { getUsers, getTasksByUser, getProjects } from '@/lib/data';
import { MailIcon, BriefcaseIcon, CheckSquareIcon, ClockIcon } from 'lucide-react';

export default async function TeamPage() {
  const users = await getUsers();
  const projects = await getProjects();

  // Get user statistics
  const userStats = await Promise.all(
    users.map(async (user) => {
      const userTasks = await getTasksByUser(user.id);
      const completedTasks = userTasks.filter(task => task.status === 'مكتمل');
      const inProgressTasks = userTasks.filter(task => task.status === 'قيد التنفيذ');
      const overdueTasks = userTasks.filter(task => 
        new Date(task.dueDate) < new Date() && task.status !== 'مكتمل'
      );
      
      return {
        ...user,
        stats: {
          totalTasks: userTasks.length,
          completedTasks: completedTasks.length,
          inProgressTasks: inProgressTasks.length,
          overdueTasks: overdueTasks.length,
          completionRate: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
        }
      };
    })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">فريق العمل</h1>
          <p className="text-gray-600 mt-2">إدارة أعضاء الفريق ومتابعة أدائهم</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          إضافة عضو جديد
        </button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي الأعضاء</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckSquareIcon className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المهام المكتملة</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.reduce((sum, user) => sum + user.stats.completedTasks, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.reduce((sum, user) => sum + user.stats.inProgressTasks, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userStats.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* User Header */}
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MailIcon className="h-4 w-4 ml-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BriefcaseIcon className="h-4 w-4 ml-2" />
                <span>{user.department}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">المهارات</p>
              <div className="flex flex-wrap gap-1">
                {user.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{user.stats.totalTasks}</p>
                  <p className="text-xs text-gray-600">إجمالي المهام</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{user.stats.completedTasks}</p>
                  <p className="text-xs text-gray-600">مكتملة</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{user.stats.inProgressTasks}</p>
                  <p className="text-xs text-gray-600">قيد التنفيذ</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${user.stats.overdueTasks > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {user.stats.overdueTasks}
                  </p>
                  <p className="text-xs text-gray-600">متأخرة</p>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">معدل الإنجاز</span>
                  <span className="text-sm font-medium text-gray-900">{user.stats.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      user.stats.completionRate >= 80 ? 'bg-green-500' :
                      user.stats.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{width: `${user.stats.completionRate}%`}}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors">
                عرض المهام
              </button>
              <button className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors">
                الملف الشخصي
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Departments Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الأقسام</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...new Set(users.map(user => user.department))].map((department) => {
            const departmentUsers = users.filter(user => user.department === department);
            const departmentStats = userStats.filter(user => user.department === department);
            const totalTasks = departmentStats.reduce((sum, user) => sum + user.stats.totalTasks, 0);
            const completedTasks = departmentStats.reduce((sum, user) => sum + user.stats.completedTasks, 0);
            
            return (
              <div key={department} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{department}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>الأعضاء:</span>
                    <span className="font-medium">{departmentUsers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المهام:</span>
                    <span className="font-medium">{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مكتملة:</span>
                    <span className="font-medium text-green-600">{completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل الإنجاز:</span>
                    <span className="font-medium">
                      {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}