import React from 'react';
import { useInput } from '@/hooks/useInput';
import { InputField, TextareaField } from '@/components/FormFields';

interface EntityFormProps {
  type: 'project' | 'task';
  onSubmit: (data: any) => void;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  users?: any[];
  projects?: any[];
}

export function EntityForm({ type, onSubmit, loading, error, onCancel, users = [], projects = [] }: EntityFormProps) {
  // Common fields
  const name = useInput('');
  const description = useInput('');
  const priority = useInput('');
  const status = useInput('');

  // Project fields
  const startDate = useInput('');
  const endDate = useInput('');
  const budget = useInput('');

  // Task fields
  const dueDate = useInput('');
  const assignedTo = useInput('');
  const projectId = useInput('');
  const estimatedHours = useInput('');
  const tags = useInput('');

  // Patch for select fields: override onChange to accept HTMLSelectElement
  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => assignedTo.setValue(e.target.value);
  const handleProjectIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => projectId.setValue(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'project') {
      onSubmit({
        name: name.value,
        description: description.value,
        priority: priority.value,
        status: status.value,
        startDate: startDate.value,
        endDate: endDate.value,
        budget: Number(budget.value),
        team: [],
        progress: 0,
        tasks: [],
      });
    } else {
      onSubmit({
        name: name.value,
        description: description.value,
        priority: priority.value,
        status: status.value,
        dueDate: dueDate.value,
        assignedTo: assignedTo.value,
        projectId: projectId.value,
        estimatedHours: Number(estimatedHours.value),
        completedHours: 0,
        tags: tags.value.split(',').map((t: string) => t.trim()).filter(Boolean),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-8 border border-blue-200 relative animate-fadeIn"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 rounded-full p-3 shadow-lg animate-bounce">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1 5h-2v6h6v-2h-4V7Z"/></svg>
      </div>
      <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight drop-shadow-sm">
        {type === 'project' ? 'إضافة مشروع جديد' : 'إضافة مهمة جديدة'}
      </h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        <InputField {...name} name="name" placeholder={type === 'project' ? 'اسم المشروع' : 'اسم المهمة'} required />
        <TextareaField {...description} name="description" placeholder={type === 'project' ? 'وصف المشروع' : 'وصف المهمة'} required />
        <div className="flex gap-2">
          <InputField {...priority} name="priority" placeholder="الأولوية (عالية/متوسطة/منخفضة)" required className="flex-1" />
          <InputField {...status} name="status" placeholder={type === 'project' ? 'الحالة (مخطط/قيد التنفيذ/مكتمل/معلق)' : 'الحالة (لم يبدأ/قيد التنفيذ/مكتمل/معلق)'} required className="flex-1" />
        </div>
        {type === 'project' ? (
          <>
            <div className="flex gap-2">
              <InputField {...startDate} name="startDate" type="date" required className="flex-1" />
              <InputField {...endDate} name="endDate" type="date" required className="flex-1" />
            </div>
            <InputField {...budget} name="budget" type="number" placeholder="الميزانية" required />
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <InputField {...dueDate} name="dueDate" type="date" required className="flex-1" />
              <InputField {...estimatedHours} name="estimatedHours" type="number" placeholder="عدد الساعات المقدرة" required className="flex-1" />
            </div>
            <div className="flex gap-2">
              <select value={assignedTo.value} onChange={handleAssignedToChange} name="assignedTo" required className="flex-1 rounded-xl px-4 py-2 bg-gradient-to-r from-blue-50 to-white text-gray-800 shadow focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:bg-white border-0 outline-none">
                <option value="">اختر المسؤول</option>
                {users.map((user: any) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <select value={projectId.value} onChange={handleProjectIdChange} name="projectId" required className="flex-1 rounded-xl px-4 py-2 bg-gradient-to-r from-blue-50 to-white text-gray-800 shadow focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:bg-white border-0 outline-none">
                <option value="">اختر المشروع</option>
                {projects.map((project: any) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <InputField {...tags} name="tags" placeholder="الوسوم (مفصولة بفاصلة)" />
          </>
        )}
      </div>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition" onClick={onCancel}>
          إلغاء
        </button>
        <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition" disabled={loading}>
          {loading ? (type === 'project' ? 'جاري الإضافة...' : 'جاري الإضافة...') : (type === 'project' ? 'إضافة' : 'إضافة المهمة')}
        </button>
      </div>
      <style jsx>{`
        .loader {
          border-width: 2px;
          border-style: solid;
          border-color: #fff transparent #fff transparent;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </form>
  );
}
