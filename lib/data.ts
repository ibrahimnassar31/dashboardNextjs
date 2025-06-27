import { promises as fs } from 'fs';
import path from 'path';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  team: string[];
  tasks: string[];
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
  estimatedHours: number;
  completedHours: number;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  skills: string[];
  tasksCompleted: number;
  currentTasks: number;
}

export async function getProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find(project => project.id === id) || null;
}

export async function getTasks(): Promise<Task[]> {
  const filePath = path.join(process.cwd(), 'data', 'tasks.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function getTask(id: string): Promise<Task | null> {
  const tasks = await getTasks();
  return tasks.find(task => task.id === id) || null;
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter(task => task.projectId === projectId);
}

export async function getUsers(): Promise<User[]> {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function getUser(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(user => user.id === id) || null;
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter(task => task.assignedTo === userId);
}

// Statistics functions
export async function getProjectStats() {
  const projects = await getProjects();
  const tasks = await getTasks();
  
  return {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'مكتمل').length,
    inProgressProjects: projects.filter(p => p.status === 'قيد التقدم').length,
    plannedProjects: projects.filter(p => p.status === 'مخطط').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'مكتمل').length,
    inProgressTasks: tasks.filter(t => t.status === 'قيد التنفيذ').length,
    pendingTasks: tasks.filter(t => t.status === 'معلق').length,
    notStartedTasks: tasks.filter(t => t.status === 'لم يبدأ').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    averageProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };
}