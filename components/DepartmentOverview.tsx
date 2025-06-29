import React from 'react';

interface DepartmentOverviewProps {
  users: any[];
  userStats: any[];
}

export const DepartmentOverview: React.FC<DepartmentOverviewProps> = ({ users, userStats }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">الأقسام</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...new Set(users.map((user: any) => user.department))].map((department: string) => {
        const departmentUsers = users.filter((user: any) => user.department === department);
        const departmentStats = userStats.filter((user: any) => user.department === department);
        const totalTasks = departmentStats.reduce((sum: number, user: any) => sum + user.stats.totalTasks, 0);
        const completedTasks = departmentStats.reduce((sum: number, user: any) => sum + user.stats.completedTasks, 0);
        return (
          <div key={department} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{department}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>الأعضاء:</span>
                <span className="font-medium">{departmentUsers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>المهام:</span>
                <span className="font-medium">{totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>مكتملة:</span>
                <span className="font-medium text-green-600">{completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>معدل الإنجاز:</span>
                <span className="font-medium">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
