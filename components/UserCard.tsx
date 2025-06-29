import React, { useState } from 'react';
import { MailIcon, BriefcaseIcon, Trash2Icon } from 'lucide-react';

interface UserCardProps {
  user: any;
  onRemove?: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onRemove }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (onRemove) onRemove(user.id);
    setShowConfirm(false);
  };

  const handleCancel = () => setShowConfirm(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {/* Remove Icon */}
      {onRemove && (
        <button
          className="absolute top-3 left-3 text-red-500 hover:text-red-700 p-1 rounded-full focus:outline-none"
          title="حذف العضو"
          onClick={handleRemoveClick}
        >
          <Trash2Icon className="w-5 h-5" />
        </button>
      )}
      {/* User Header */}
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-lg font-medium text-white">
            {user.name.split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        <div className="mr-4">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
      </div>
      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MailIcon className="h-4 w-4 ml-2" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <BriefcaseIcon className="h-4 w-4 ml-2" />
          <span>{user.department}</span>
        </div>
      </div>
      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">المهارات</p>
        <div className="flex flex-wrap gap-1">
          {user.skills.map((skill: string) => (
            <span key={skill} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
      {/* Performance Stats */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{user.stats.totalTasks}</p>
            <p className="text-xs text-gray-600">إجمالي المهام</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{user.stats.completedTasks}</p>
            <p className="text-xs text-gray-600">مكتملة</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{user.stats.inProgressTasks}</p>
            <p className="text-xs text-gray-600">قيد التنفيذ</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${user.stats.overdueTasks > 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {user.stats.overdueTasks}
            </p>
            <p className="text-xs text-gray-600">متأخرة</p>
          </div>
        </div>
        {/* Completion Rate */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">معدل الإنجاز</span>
            <span className="text-sm font-medium text-gray-900">{user.stats.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                user.stats.completionRate >= 80 ? 'bg-green-500' :
                user.stats.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{width: `${user.stats.completionRate}%`}}
            ></div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors">
          عرض المهام
        </button>
        <button className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors">
          الملف الشخصي
        </button>
      </div>
      {/* Confirm Remove Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={handleCancel} aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
            <p className="text-lg font-semibold text-gray-900 mb-4">هل أنت متأكد أنك تريد حذف هذا العضو؟</p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleConfirm}
              >نعم، حذف</button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={handleCancel}
              >إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
