'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ChartsSectionProps {
  projectsByStatus: { name: string; value: number; color: string }[];
  tasksByStatus: { name: string; value: number; color: string }[];
  projectProgressData: { name: string; progress: number; budget: number }[];
  tasksByPriority: { name: string; value: number; color: string }[];
  teamPerformanceData: { name: string; completed: number; total: number; rate: number }[];
  monthlyProgress: { month: string; projects: number; tasks: number }[];
}

export default function ChartsSection({
  projectsByStatus,
  tasksByStatus,
  projectProgressData,
  tasksByPriority,
  teamPerformanceData,
  monthlyProgress
}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Projects by Status - Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المشاريع حسب الحالة</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={projectsByStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {projectsByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks by Status - Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المهام حسب الحالة</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tasksByStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Progress - Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تقدم المشاريع</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#10B981" name="التقدم %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks by Priority - Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المهام حسب الأولوية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={tasksByPriority}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {tasksByPriority.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Team Performance - Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء الفريق</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#10B981" name="مكتملة" />
            <Bar dataKey="total" fill="#3B82F6" name="إجمالي" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Progress - Line Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">التقدم الشهري</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="projects" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="المشاريع"
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="#10B981" 
              strokeWidth={2}
              name="المهام"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}