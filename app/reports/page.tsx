import { getProjectStats, getProjects, getTasks, getUsers } from '@/lib/data';
import ChartsSection from '@/components/ChartsSection';

export default async function ReportsPage() {
  const stats = await getProjectStats();
  const projects = await getProjects();
  const tasks = await getTasks();
  const users = await getUsers();

  // Prepare data for charts
  const projectsByStatus = [
    { name: 'مكتمل', value: stats.completedProjects, color: '#10B981' },
    { name: 'قيد التقدم', value: stats.inProgressProjects, color: '#3B82F6' },
    { name: 'مخطط', value: stats.plannedProjects, color: '#6B7280' },
  ];

  const tasksByStatus = [
    { name: 'مكتمل', value: stats.completedTasks, color: '#10B981' },
    { name: 'قيد التنفيذ', value: stats.inProgressTasks, color: '#3B82F6' },
    { name: 'معلق', value: stats.pendingTasks, color: '#F59E0B' },
    { name: 'لم يبدأ', value: stats.notStartedTasks, color: '#6B7280' },
  ];

  const projectProgressData = projects.map(project => ({
    name: project.name,
    progress: project.progress,
    budget: project.budget / 1000, // Convert to thousands
  }));

  // Tasks by priority
  const tasksByPriority = [
    { 
      name: 'عالية', 
      value: tasks.filter(t => t.priority === 'عالية').length,
      color: '#EF4444'
    },
    { 
      name: 'متوسطة', 
      value: tasks.filter(t => t.priority === 'متوسطة').length,
      color: '#F59E0B'
    },
    { 
      name: 'منخفضة', 
      value: tasks.filter(t => t.priority === 'منخفضة').length,
      color: '#10B981'
    },
  ];

  // Team performance data
  const teamPerformanceData = await Promise.all(
    users.map(async (user) => {
      const userTasks = tasks.filter(task => task.assignedTo === user.id);
      const completedTasks = userTasks.filter(task => task.status === 'مكتمل');
      
      return {
        name: user.name,
        completed: completedTasks.length,
        total: userTasks.length,
        rate: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
      };
    })
  );

  const monthlyProgress = [
    { month: 'يناير', projects: 2, tasks: 8 },
    { month: 'فبراير', projects: 3, tasks: 12 },
    { month: 'مارس', projects: 2, tasks: 15 },
    { month: 'أبريل', projects: 4, tasks: 18 },
    { month: 'مايو', projects: 3, tasks: 22 },
    { month: 'يونيو', projects: 3, tasks: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600 mt-2">تحليل الأداء والإنتاجية</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            تصدير التقرير
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            طباعة
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل إنجاز المشاريع</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((stats.completedProjects / stats.totalProjects) * 100)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل إنجاز المهام</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الميزانيات</p>
              <p className="text-2xl font-bold text-purple-600">
                {(stats.totalBudget / 1000).toFixed(0)}k ريال
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط التقدم</p>
              <p className="text-2xl font-bold text-orange-600">{stats.averageProgress}%</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection 
        projectsByStatus={projectsByStatus}
        tasksByStatus={tasksByStatus}
        projectProgressData={projectProgressData}
        tasksByPriority={tasksByPriority}
        teamPerformanceData={teamPerformanceData}
        monthlyProgress={monthlyProgress}
      />

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تحليل المشاريع</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.status}</p>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{project.progress}%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${project.progress}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء الفريق</h3>
          <div className="space-y-4">
            {teamPerformanceData.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.completed}/{member.total} مهام</p>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{member.rate}%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        member.rate >= 80 ? 'bg-green-500' :
                        member.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{width: `${member.rate}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}