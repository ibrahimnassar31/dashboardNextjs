"use client";
import { useState } from 'react';
import { EntityForm } from '@/components/EntityForm';
import { TasksSummaryCards } from '@/components/TasksSummaryCards';
import { TasksKanbanBoard } from '@/components/TasksKanbanBoard';
import { TasksTable } from '@/components/TasksTable';
import { useTasksData } from '@/hooks/useTasksData';
import { Toast } from '@/components/Toast';

export default function TasksPage() {
  const { tasks, setTasks, users, projects,  } = useTasksData();
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleAddTask = async (newTask: any) => {
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setTasks((prev: any) => [...prev, data.task]);
        showToast('تمت إضافة المهمة بنجاح', 'success');
      } else {
        setFormError(data.error || 'حدث خطأ أثناء إضافة المهمة');
        showToast(data.error || 'حدث خطأ أثناء إضافة المهمة', 'error');
      }
    } catch (err: any) {
      setFormError('حدث خطأ أثناء الاتصال بالخادم');
      showToast('حدث خطأ أثناء الاتصال بالخادم', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeleteLoading(taskId);
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTasks((prev: any) => prev.filter((t: any) => t.id !== taskId));
        showToast('تم حذف المهمة بنجاح', 'success');
      } else {
        showToast(data.error || 'حدث خطأ أثناء حذف المهمة', 'error');
      }
    } catch {
      showToast('حدث خطأ أثناء الاتصال بالخادم', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle status change from Kanban DND
  const handleTaskStatusChange = async (taskId: string, newStatus: string, newIndex: number) => {
    setTasks((prev: any[]) => {
      const taskIndex = prev.findIndex((t: any) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const updatedTask = { ...prev[taskIndex], status: newStatus };
      // Remove the task from its old position
      const tasksWithout = prev.filter((t: any) => t.id !== taskId);

      // Find all tasks with the new status
      const before = tasksWithout.filter((t: any) => t.status !== newStatus);
      const sameStatus = tasksWithout.filter((t: any) => t.status === newStatus);

      // Insert the updated task at the new index
      sameStatus.splice(newIndex, 0, updatedTask);

      return [...before, ...sameStatus];
    });

    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      showToast('تعذر تحديث حالة المهمة على الخادم', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المهام</h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة جميع المهام</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowModal(true)}>
          مهمة جديدة
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowModal(false)} aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md" onClick={e => e.stopPropagation()} tabIndex={-1}>
            <h2 className="text-xl font-bold mb-4">إضافة مهمة جديدة</h2>
            <EntityForm
              type="task"
              onSubmit={handleAddTask}
              loading={formLoading}
              error={formError}
              onCancel={() => setShowModal(false)}
              users={users}
              projects={projects}
            />
          </div>
        </div>
      )}

      {/* Tasks Summary */}
      <TasksSummaryCards tasks={tasks} />

      {/* Kanban Board */}
      <TasksKanbanBoard tasks={tasks} users={users} projects={projects} onDeleteTask={handleDeleteTask} onTaskStatusChange={handleTaskStatusChange} />

      {/* Task Table */}
      <TasksTable tasks={tasks} users={users} projects={projects} />
    </div>
  );
}