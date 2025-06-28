import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarIcon, UserIcon, ClockIcon, Trash2Icon } from 'lucide-react';
import type { Task, User, Project } from '@/lib/data';
import { getPriorityColor, isOverdue } from '@/lib/taskUtils';

const STATUS_LABELS = ['لم يبدأ', 'قيد التنفيذ', 'معلق', 'مكتمل'];

interface TasksKanbanBoardProps {
  tasks: Task[];
  users: User[];
  projects: Project[];
  onDeleteTask?: (taskId: string) => void;
}

export function TasksKanbanBoard({ tasks, users, projects, onDeleteTask }: TasksKanbanBoardProps) {
  const [deleteModalTaskId, setDeleteModalTaskId] = useState<string | null>(null);
  const [deleteModalTaskName, setDeleteModalTaskName] = useState<string | null>(null);

  const handleTrashClick = (taskId: string, taskName: string) => {
    setDeleteModalTaskId(taskId);
    setDeleteModalTaskName(taskName);
  };

  const handleConfirmDelete = () => {
    if (onDeleteTask && deleteModalTaskId) {
      onDeleteTask(deleteModalTaskId);
    }
    setDeleteModalTaskId(null);
    setDeleteModalTaskName(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalTaskId(null);
    setDeleteModalTaskName(null);
  };

  const tasksByStatus = STATUS_LABELS.map(status => ({
    status,
    tasks: tasks.filter(t => t.status === status),
  }));

  return (
    <>
      {deleteModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm" onClick={e => e.stopPropagation()} tabIndex={-1}>
            <h2 className="text-lg font-bold mb-4 text-center">تأكيد حذف المهمة</h2>
            <p className="mb-6 text-center text-gray-700">هل أنت متأكد أنك تريد حذف المهمة <span className="font-semibold text-red-600">{deleteModalTaskName}</span>؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={handleCancelDelete}>إلغاء</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={handleConfirmDelete}>حذف</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {tasksByStatus.map(({ status, tasks: statusTasks }) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{statusTasks.length}</span>
            </div>
            <div className="space-y-3">
              {statusTasks.map((task) => {
                const assignedUser = users.find((user) => user.id === task.assignedTo);
                const project = projects.find((project) => project.id === task.projectId);
                const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'مكتمل';
                return (
                  <div key={task.id} className="relative group">
                    {/* Trash icon in top left */}
                    {onDeleteTask && (
                      <button
                        type="button"
                        className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                        aria-label="حذف المهمة"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrashClick(task.id, task.name);
                        }}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    )}
                    <Link href={`/tasks/${task.id}`} className="block" tabIndex={0} aria-label={`تفاصيل المهمة ${task.name}`}>
                      <div className={`bg-white rounded-lg p-4 shadow-sm border-r-4 hover:shadow-md transition-shadow cursor-pointer group-hover:ring-2 group-hover:ring-blue-400 ${getPriorityColor(task.priority)}`}>
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 line-clamp-2">{task.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{project?.name}</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center">
                            <UserIcon className="h-3 w-3 ml-1" />{assignedUser?.name}
                          </span>
                        </div>
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {task.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{tag}</span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">التقدم</span>
                            <span className="text-xs text-gray-900">{Math.round((task.completedHours / task.estimatedHours) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{width: `${(task.completedHours / task.estimatedHours) * 100}%`}}></div>
                          </div>
                        </div>
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
                        <div className="flex justify-between items-center mt-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          <div className="flex items-center text-xs text-gray-600">
                            <ClockIcon className="h-3 w-3 ml-1" />
                            <span>{task.completedHours}/{task.estimatedHours}س</span>
                          </div>
                        </div>
                      </div>
                    </Link>
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
    </>
  );
}
