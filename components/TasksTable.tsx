import React from 'react';
import Link from 'next/link';
import type { Task, User, Project } from '@/lib/data';
import { getStatusColor, getPriorityColor, isOverdue } from '@/lib/taskUtils';

export function TasksTable({ tasks, users, projects }: { tasks: Task[]; users: User[]; projects: Project[] }) {
  return (
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المهمة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشروع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسؤول</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاستحقاق</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقدم</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => {
              const assignedUser = users.find((user) => user.id === task.assignedTo);
              const project = projects.find((project) => project.id === task.projectId);
              const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'مكتمل';
              const progress = Math.round((task.completedHours / task.estimatedHours) * 100);
              return (
                <Link key={task.id} href={`/tasks/${task.id}`} passHref legacyBehavior>
                  <tr className="hover:bg-blue-50 cursor-pointer" tabIndex={0} aria-label={`تفاصيل المهمة ${task.name}`}>
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
                          <span className="text-xs font-medium text-white">{assignedUser?.name?.split(' ').map((n: string) => n[0]).join('')}</span>
                        </div>
                        <div className="mr-3">
                          <div className="text-sm text-gray-900">{assignedUser?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isTaskOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>{new Date(task.dueDate).toLocaleDateString('ar-SA')}{isTaskOverdue && <span className="mr-1">⚠️</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 ml-3">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
                        </div>
                        <span className="text-sm text-gray-900">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
