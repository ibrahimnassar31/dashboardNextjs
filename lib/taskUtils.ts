import type { Task } from '@/lib/data';

export function getStatusColor(status: string) {
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

export function getPriorityColor(priority: string) {
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

export function isOverdue(dueDate: string, status?: string): boolean {
  return new Date(dueDate) < new Date() && status !== 'مكتمل';
}
