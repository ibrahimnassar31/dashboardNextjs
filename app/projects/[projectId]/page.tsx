import { getProject, getTasksByProject, getUsers } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon, UsersIcon, DollarSignIcon, CheckSquareIcon } from 'lucide-react';

function getStatusColor(status: string) {
  switch (status) {
    case 'مكتمل':
      return 'bg-green-100 text-green-800';
    case 'قيد التنفيذ':
      return 'bg-blue-100 text-blue-800';
    case 'مخطط':
      return 'bg-gray-100 text-gray-800';
    case 'معلق':
      return 'bg-yellow-100 text-yellow-800';
    case 'لم يبدأ':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

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

export default async function ProjectDetailPage(props: any) {
  const params = await props.params;
  const project = await getProject(params.projectId);
  
  if (!project) {
    notFound();
  }

  const tasks = await getTasksByProject(params.projectId);
  const users = await getUsers();
  
  // Get team members details
  const teamMembers = users.filter(user => project.team.includes(user.id));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
        <Link href="/projects" className="hover:text-gray-700">المشاريع</Link>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="text-gray-900 pr-1">{project.name}</span>
      </nav>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">التقدم الإجمالي</span>
            <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{width: `${project.progress}%`}}
            ></div>
          </div>
        </div>

        {/* Project Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
            <div>
              <p className="text-sm text-gray-600">المدة الزمنية</p>
              <p className="font-medium">
                {new Date(project.startDate).toLocaleDateString('ar-SA')} - {new Date(project.endDate).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <DollarSignIcon className="h-5 w-5 text-gray-400 ml-3" />
            <div>
              <p className="text-sm text-gray-600">الميزانية</p>
              <p className="font-medium">{project.budget.toLocaleString()} ريال</p>
            </div>
          </div>
          <div className="flex items-center">
            <CheckSquareIcon className="h-5 w-5 text-gray-400 ml-3" />
            <div>
              <p className="text-sm text-gray-600">المهام</p>
              <p className="font-medium">{tasks.length} مهام</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">مهام المشروع</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => {
                const assignedUser = users.find(user => user.id === task.assignedTo);
                return (
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span>المسؤول: {assignedUser?.name}</span>
                        <span>الاستحقاق: {new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex gap-1">
                        {task.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Task Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">التقدم</span>
                        <span className="text-xs text-gray-900">
                          {task.completedHours}/{task.estimatedHours} ساعة
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{width: `${(task.completedHours / task.estimatedHours) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Members Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">فريق العمل</h3>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات المشروع</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي المهام</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المهام المكتملة</span>
                <span className="font-medium text-green-600">
                  {tasks.filter(t => t.status === 'مكتمل').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">قيد التنفيذ</span>
                <span className="font-medium text-blue-600">
                  {tasks.filter(t => t.status === 'قيد التنفيذ').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">معلقة</span>
                <span className="font-medium text-yellow-600">
                  {tasks.filter(t => t.status === 'معلق').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي الساعات</span>
                <span className="font-medium">
                  {tasks.reduce((sum, t) => sum + t.estimatedHours, 0)} ساعة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}