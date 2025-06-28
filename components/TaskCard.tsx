import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';
import { Trash2Icon, UserIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { getPriorityColor, isOverdue } from '@/lib/taskUtils';
import type { Task, User, Project } from '@/lib/data';

interface TaskCardProps {
  task: Task;
  users: User[];
  projects: Project[];
  index: number;
  onDeleteTask?: (taskId: string, taskName: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, users, projects, index, onDeleteTask }) => {
  const assignedUser = users.find((user) => user.id === task.assignedTo);
  const project = projects.find((project) => project.id === task.projectId);
  const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'مكتمل';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative group ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
          style={provided.draggableProps.style}
        >
          {onDeleteTask && (
            <button
              type="button"
              className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
              aria-label="حذف المهمة"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id, task.name);
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
      )}
    </Draggable>
  );
});
TaskCard.displayName = 'TaskCard';
