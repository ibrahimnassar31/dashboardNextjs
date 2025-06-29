import { useMemo } from 'react';
import type { Task } from '@/lib/data';

export type SortKey = 'date' | 'priority' | 'status';

const priorityOrder: Record<string, number> = { 'عالية': 1, 'متوسطة': 2, 'منخفضة': 3 };
const statusOrder: Record<string, number> = { 'لم يبدأ': 1, 'قيد التنفيذ': 2, 'معلق': 3, 'مكتمل': 4 };

export function useSortedTasks(tasks: Task[], sortKey: SortKey) {
  return useMemo(() => {
    const sorted = [...tasks];
    if (sortKey === 'date') {
      sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortKey === 'priority') {
      sorted.sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99));
    } else if (sortKey === 'status') {
      sorted.sort((a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99));
    }
    return sorted;
  }, [tasks, sortKey]);
}
