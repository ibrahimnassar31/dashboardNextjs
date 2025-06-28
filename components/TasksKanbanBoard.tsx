import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import type { Task, User, Project } from '@/lib/data';

const STATUS_LABELS = ['لم يبدأ', 'قيد التنفيذ', 'معلق', 'مكتمل'];

interface TasksKanbanBoardProps {
  tasks: Task[];
  users: User[];
  projects: Project[];
  onDeleteTask?: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, newStatus: string, newIndex: number) => void;
}

export function TasksKanbanBoard({ tasks, users, projects, onDeleteTask, onTaskStatusChange }: TasksKanbanBoardProps) {
  const [deleteModalTaskId, setDeleteModalTaskId] = useState<string | null>(null);
  const [deleteModalTaskName, setDeleteModalTaskName] = useState<string | null>(null);

  // Memoize columns to avoid unnecessary recalculations
  const columns = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    STATUS_LABELS.forEach(status => {
      grouped[status] = tasks.filter(t => t.status === status);
    });
    return grouped;
  }, [tasks]);

  const handleTrashClick = useCallback((taskId: string, taskName: string) => {
    setDeleteModalTaskId(taskId);
    setDeleteModalTaskName(taskName);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (onDeleteTask && deleteModalTaskId) {
      onDeleteTask(deleteModalTaskId);
    }
    setDeleteModalTaskId(null);
    setDeleteModalTaskName(null);
  }, [onDeleteTask, deleteModalTaskId]);

  const handleCancelDelete = useCallback(() => {
    setDeleteModalTaskId(null);
    setDeleteModalTaskName(null);
  }, []);

  // Only for local UI feedback, not for persistence
  const [localColumns, setLocalColumns] = useState<Record<string, Task[]>>(columns);
  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const sourceCol = Array.from(localColumns[source.droppableId]);
    const destCol = Array.from(localColumns[destination.droppableId]);
    const [removed] = sourceCol.splice(source.index, 1);
    removed.status = destination.droppableId;
    destCol.splice(destination.index, 0, removed);
    const newColumns = {
      ...localColumns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    };
    setLocalColumns(newColumns);
    if (onTaskStatusChange) {
      onTaskStatusChange(removed.id, destination.droppableId, destination.index);
    }
  }, [localColumns, onTaskStatusChange]);

  return (
    <>
      {deleteModalTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={handleConfirmDelete} aria-modal="true" role="dialog">
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {STATUS_LABELS.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gray-50 rounded-lg p-4 min-h-[300px] transition-shadow ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{status}</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{localColumns[status]?.length || 0}</span>
                  </div>
                  <div className="space-y-3">
                    {localColumns[status]?.map((task, idx) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        users={users}
                        projects={projects}
                        index={idx}
                        onDeleteTask={handleTrashClick}
                      />
                    ))}
                    {provided.placeholder}
                    {(!localColumns[status] || localColumns[status].length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">لا توجد مهام</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
