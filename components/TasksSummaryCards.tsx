import React from 'react';
import type { Task } from '@/lib/data';

const STATUS_LABELS = ['لم يبدأ', 'قيد التنفيذ', 'معلق', 'مكتمل'];

export function TasksSummaryCards({ tasks }: { tasks: Task[] }) {
  const tasksByStatus = STATUS_LABELS.map(status => ({
    status,
    count: tasks.filter(t => t.status === status).length,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {tasksByStatus.map(({ status, count }) => (
        <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{status}</span>
            <span className="text-2xl font-bold text-gray-900">{count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
