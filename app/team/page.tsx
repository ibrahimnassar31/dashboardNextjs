'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TeamOverview } from '@/components/TeamOverview';
import { UserCard } from '@/components/UserCard';
import { DepartmentOverview } from '@/components/DepartmentOverview';

const UserForm = dynamic(() => import('@/components/UserForm').then(mod => mod.UserForm), { ssr: false });

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      setUsers(usersData);
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();
      setProjects(projectsData);
    };
    fetchData();
  }, [showModal]);

  const userStats = users.map((user: any) => {
    const userTasks = user.tasks || [];
    const completedTasks = userTasks.filter((task: any) => task.status === 'مكتمل');
    const inProgressTasks = userTasks.filter((task: any) => task.status === 'قيد التنفيذ');
    const overdueTasks = userTasks.filter((task: any) =>
      new Date(task.dueDate) < new Date() && task.status !== 'مكتمل'
    );
    return {
      ...user,
      stats: {
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
      }
    };
  });

  const handleAddUser = async (user: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
      } else {
        setError(data.error || 'حدث خطأ أثناء إضافة العضو');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // Remove user handler
  const handleRemoveUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false); 
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        setUsers(usersData);
      } else {
        setError(data.error || 'حدث خطأ أثناء حذف العضو');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">فريق العمل</h1>
          <p className="text-gray-600 mt-2">إدارة أعضاء الفريق ومتابعة أدائهم</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowModal(true)}>
          إضافة عضو جديد
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowModal(false)} aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md" onClick={e => e.stopPropagation()} tabIndex={-1}>
            <h2 className="text-xl font-bold mb-4">إضافة عضو جديد</h2>
            <UserForm onSubmit={handleAddUser} onCancel={() => setShowModal(false)} loading={loading} error={error} />
          </div>
        </div>
      )}

      {/* Team Overview */}
      <TeamOverview
        usersCount={users.length}
        completedTasks={userStats.reduce((sum: number, user: any) => sum + user.stats.completedTasks, 0)}
        inProgressTasks={userStats.reduce((sum: number, user: any) => sum + user.stats.inProgressTasks, 0)}
      />

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userStats.map((user: any) => (
          <UserCard key={user.id} user={user} onRemove={handleRemoveUser} />
        ))}
      </div>

      {/* Departments Overview */}
      <DepartmentOverview users={users} userStats={userStats} />
    </div>
  );
}