import { getProjects } from '@/lib/data';
import Link from 'next/link';
import { CalendarIcon, UsersIcon, DollarSignIcon } from 'lucide-react';

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'عالية':
      return 'bg-red-100 text-red-800';
    case 'متوسطة':
      return 'bg-yellow-100 text-yellow-800';
    case 'منخفضة':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'مكتمل':
      return 'bg-green-100 text-green-800';
    case 'قيد التقدم':
      return 'bg-blue-100 text-blue-800';
    case 'مخطط':
      return 'bg-gray-100 text-gray-800';
    case 'معلق':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المشاريع</h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة جميع المشاريع</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          مشروع جديد
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              {/* Project Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {project.name}
                </h3>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">التقدم</span>
                  <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${project.progress}%`}}
                  ></div>
                </div>
              </div>

              {/* Project Meta */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 ml-2" />
                  <span>من {new Date(project.startDate).toLocaleDateString('ar-SA')} إلى {new Date(project.endDate).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4 ml-2" />
                  <span>{project.team.length} عضو في الفريق</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSignIcon className="h-4 w-4 ml-2" />
                  <span>{project.budget.toLocaleString()} ريال</span>
                </div>
              </div>

              {/* Tasks Summary */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المهام</span>
                  <span className="font-medium text-gray-900">{project.tasks.length} مهام</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مشاريع</h3>
          <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء مشروع جديد.</p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              مشروع جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}