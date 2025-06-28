import { getTask, getProject, getUsers } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon, UserIcon, CheckSquareIcon } from 'lucide-react';
import { getStatusColor, getPriorityColor } from '@/lib/taskUtils';

export default async function TaskDetailPage(props: any) {
  const params = await props.params;
  const task = await getTask(params.taskId);
  if (!task) notFound();
  const project = await getProject(task.projectId);
  const users = await getUsers();
  const assignedUser = users.find(u => u.id === task.assignedTo);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
        <Link href="/tasks" className="hover:text-gray-700">المهام</Link>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="text-gray-900">{task.name}</span>
      </nav>

      {/* Task Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.name}</h1>
            <p className="text-gray-600">{task.description}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">التقدم</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((task.completedHours / task.estimatedHours) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Task Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
            <div>
              <p className="text-sm text-gray-600">تاريخ الاستحقاق</p>
              <p className="font-medium">{new Date(task.dueDate).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 ml-3" />
            <div>
              <p className="text-sm text-gray-600">المسؤول</p>
              <p className="font-medium">{assignedUser ? assignedUser.name : 'غير محدد'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <CheckSquareIcon className="h-5 w-5 text-gray-400 ml-3" />
            <div>
              <p className="text-sm text-gray-600">المشروع</p>
              <p className="font-medium">{project ? project.name : 'غير محدد'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الوسوم</h3>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
