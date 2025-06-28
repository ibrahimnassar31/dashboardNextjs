'use client';

import { CalendarIcon, UsersIcon, DollarSignIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPriorityColor, getStatusColor } from '@/lib/taskUtils';

interface Project {
  id: string;
  name: string;
  description: string;
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  status: 'مكتمل' | 'قيد التقدم' | 'مخطط' | 'معلق';
  progress: number;
  startDate: string;
  endDate: string;
  team: { id: string; name: string }[];
  budget: number;
  tasks: { id: string; name: string }[];
}

interface DeleteModalProps {
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  projectName: string;
}

function DeleteModal({ loading, error, onCancel, onConfirm, projectName }: DeleteModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, loading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onCancel}
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <Trash2Icon className="mx-auto mb-4 h-8 w-8 text-red-500" aria-hidden="true" />
        <h3 id="delete-modal-title" className="text-lg font-bold mb-2 text-gray-900">
          تأكيد حذف المشروع
        </h3>
        <p id="delete-modal-desc" className="mb-4 text-gray-600">
          هل أنت متأكد أنك تريد حذف المشروع "{projectName}"؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
            disabled={loading}
            aria-label="إلغاء حذف المشروع"
          >
            إلغاء
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white font-bold shadow hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading}
            aria-label={`حذف المشروع ${projectName}`}
          >
            {loading ? 'جاري الحذف...' : 'حذف'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProjectsGridProps {
  projects: Project[];
  onDelete?: (id: string) => Promise<void>;
}

export const ProjectsGrid = React.memo(function ProjectsGrid({ projects, onDelete }: ProjectsGridProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = useCallback(
    async (projectId: string) => {
      if (!onDelete) {
        setDeleteId(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await onDelete(projectId);
        setDeleteId(null);
      } catch (e: any) {
        setError(e?.message || 'حدث خطأ أثناء الحذف');
      } finally {
        setLoading(false);
      }
    },
    [onDelete]
  );

  if (!projects.length) {
    return (
      <div className="text-center text-gray-500 py-8" role="alert">
        لا توجد مشاريع لعرضها
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="relative group">
            <button
              className="absolute top-3 left-3 z-10 p-1 rounded-full bg-white shadow hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
              title={`حذف المشروع ${project.name}`}
              onClick={() => setDeleteId(project.id)}
              type="button"
              aria-label={`حذف المشروع ${project.name}`}
            >
              <Trash2Icon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </button>
            {/* بطاقة المشروع */}
            <Link href={`/projects/${project.id}`} aria-label={`عرض تفاصيل المشروع ${project.name}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        project.priority
                      )}`}
                    >
                      {project.priority}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">التقدم</span>
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                    <span>
                      من {new Date(project.startDate).toLocaleDateString('ar-SA')} إلى{' '}
                      {new Date(project.endDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                    <span>{project.team.length} عضو في الفريق</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSignIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                    <span>{project.budget.toLocaleString('ar-SA')} ريال</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المهام</span>
                    <span className="font-medium text-gray-900">{project.tasks.length} مهام</span>
                  </div>
                </div>
              </div>
            </Link>
            {/* نافذة تأكيد الحذف */}
            <AnimatePresence>
              {deleteId === project.id && (
                <DeleteModal
                  loading={loading}
                  error={error}
                  onCancel={() => setDeleteId(null)}
                  onConfirm={() => handleConfirmDelete(project.id)}
                  projectName={project.name}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </>
  );
});