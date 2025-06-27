import { getTasks, getUsers, getProjects } from '@/lib/data';
import { CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';

function getStatusColor(status: string) {
  switch (status) {
    case 'مكتمل':
      return 'bg-green-100 text-green-800';
    case 'قيد التنفيذ':
      return 'bg-blue-100 text-blue-800';
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
      return 'bg-red-100 text-red-800 border-red-200';
    case 'متوسطة':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'منخفضة':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export default async function TasksPage() {
  const tasks = await getTasks();
  const users = await getUsers();
  const projects = await getProjects();

  // Group tasks by status
  const tasksByStatus = {
    'لم يبدأ': tasks.filter(t => t.status === 'لم يبدأ'),
    'قيد التنفيذ': tasks.filter(t => t.status === 'قيد التنفيذ'),
    'معلق': tasks.filter(t => t.status === 'معلق'),
    'مكتمل': tasks.filter(t => t.status === 'مكتمل'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المهام</h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة جميع المهام</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          مهمة جديدة
        </button>
      </div>

      {/* Tasks Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{status}</span>
              <span className="text-2xl font-bold text-gray-900">{statusTasks.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {statusTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {statusTasks.map((task) => {
                const assignedUser = users.find(user => user.id === task.assignedTo);
                const project = projects.find(project => project.id === task.projectId);
                const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'مكتمل';
                
                return (
                  <div 
                    key={task.id} 
                    className={`bg-white rounded-lg p-4 shadow-sm border-r-4 hover:shadow-md transition-shadow cursor-pointer ${getPriorityColor(task.priority)}`}
                  >
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{task.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                    </div>

                    {/* Project */}
                    <div className="mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {project?.name}
                      </span>
                    </div>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">التقدم</span>
                        <span className="text-xs text-gray-900">
                          {Math.round((task.completedHours / task.estimatedHours) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{width: `${(task.completedHours / task.estimatedHours) * 100}%`}}
                        ></div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center">
                        <UserIcon className="h-3 w-3 ml-1" />
                        <span>{assignedUser?.name}</span>
                      </div>
                      <div className={`flex items-center ${isTaskOverdue ? 'text-red-600' : ''}`}>
                        <CalendarIcon className="h-3 w-3 ml-1" />
                        <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                        {isTaskOverdue && <span className="mr-1">⚠️</span>}
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex justify-between items-center mt-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center text-xs text-gray-600">
                        <ClockIcon className="h-3 w-3 ml-1" />
                        <span>{task.completedHours}/{task.estimatedHours}س</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">لا توجد مهام</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task List View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">جميع المهام</h3>
          <div className="flex gap-2">
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>ترتيب حسب التاريخ</option>
              <option>ترتيب حسب الأولوية</option>
              <option>ترتيب حسب الحالة</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المهمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المشروع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المسؤول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الأولوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الاستحقاق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقدم
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => {
                const assignedUser = users.find(user => user.id === task.assignedTo);
                const project = projects.find(project => project.id === task.projectId);
                const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'مكتمل';
                const progress = Math.round((task.completedHours / task.estimatedHours) * 100);
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-600">{project?.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {assignedUser?.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="mr-3">
                          <div className="text-sm text-gray-900">{assignedUser?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isTaskOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                      {isTaskOverdue && <span className="mr-1">⚠️</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 ml-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${progress}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}