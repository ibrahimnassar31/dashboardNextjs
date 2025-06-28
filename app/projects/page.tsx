"use client";
import { useState, useEffect } from 'react';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { ProjectForm } from '@/components/ProjectForm';

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    }
    fetchProjects();
  }, []);

  const handleAddProject = async (newProject: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setProjects((prev) => [...prev, data.project]);
      } else {
        setError(data.error || 'حدث خطأ أثناء إضافة المشروع');
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)));
      } else {
        setError(data.error || 'حدث خطأ أثناء الحذف');
        throw new Error(data.error || 'حدث خطأ أثناء الحذف');
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المشاريع</h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة جميع المشاريع</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          مشروع جديد
        </button>
      </div>
      {/* Modal for adding new project */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setShowModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <h2 className="text-xl font-bold mb-8">إضافة مشروع جديد</h2>
            <ProjectForm
              onSubmit={handleAddProject}
              loading={loading}
              error={error}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
      {/* Projects Grid */}
      <ProjectsGrid projects={projects} onDelete={handleDeleteProject} />

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مشاريع</h3>
          <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء مشروع جديد.</p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => setShowModal(true)}>
              مشروع جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}