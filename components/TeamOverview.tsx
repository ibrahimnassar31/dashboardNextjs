import React from 'react';
import { BriefcaseIcon, CheckSquareIcon, ClockIcon } from 'lucide-react';

interface TeamOverviewProps {
  usersCount: number;
  completedTasks: number;
  inProgressTasks: number;
}

export const TeamOverview: React.FC<TeamOverviewProps> = ({ usersCount, completedTasks, inProgressTasks }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="bg-blue-500 p-3 rounded-lg">
          <BriefcaseIcon className="h-6 w-6 text-white" />
        </div>
        <div className="mr-4">
          <p className="text-sm font-medium text-gray-600">إجمالي الأعضاء</p>
          <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="bg-green-500 p-3 rounded-lg">
          <CheckSquareIcon className="h-6 w-6 text-white" />
        </div>
        <div className="mr-4">
          <p className="text-sm font-medium text-gray-600">المهام المكتملة</p>
          <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="bg-yellow-500 p-3 rounded-lg">
          <ClockIcon className="h-6 w-6 text-white" />
        </div>
        <div className="mr-4">
          <p className="text-sm font-medium text-gray-600">قيد التنفيذ</p>
          <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
        </div>
      </div>
    </div>
  </div>
);
