import { useState, useEffect, useCallback } from 'react';
import type { Task, User, Project } from '@/lib/data';

export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, usersRes, projectsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/users'),
        fetch('/api/projects'),
      ]);
      setTasks(await tasksRes.json());
      setUsers(await usersRes.json());
      setProjects(await projectsRes.json());
    } catch (err) {
      setError('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { tasks, setTasks, users, projects, loading, error, reload: fetchData };
}
