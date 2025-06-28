import React from 'react';
import { useInput } from '@/hooks/useInput';
import { InputField, TextareaField } from '@/components/FormFields';

export function ProjectForm({ onSubmit, loading, error, onCancel }: {
  onSubmit: (data: any) => void,
  loading: boolean,
  error: string | null,
  onCancel: () => void
}) {
  const name = useInput('');
  const description = useInput('');
  const priority = useInput('');
  const status = useInput('');
  const startDate = useInput('');
  const endDate = useInput('');
  const budget = useInput('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
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
      }}
      className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-8 border border-blue-200 relative animate-fadeIn"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 rounded-full p-3 shadow-lg animate-bounce">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1 5h-2v6h6v-2h-4V7Z"/></svg>
      </div>
      <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center tracking-tight drop-shadow-sm">إضافة مشروع جديد</h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        <InputField {...name} name="name" placeholder="اسم المشروع" required />
        <TextareaField {...description} name="description" placeholder="وصف المشروع" required />
        <div className="flex gap-2">
          <InputField {...priority} name="priority" placeholder="الأولوية (عالية/متوسطة/منخفضة)" required className="flex-1" />
          <InputField {...status} name="status" placeholder="الحالة (مخطط/قيد التنفيذ/مكتمل/معلق)" required className="flex-1" />
        </div>
        <div className="flex gap-2">
          <InputField {...startDate} name="startDate" type="date" required className="flex-1" />
          <InputField {...endDate} name="endDate" type="date" required className="flex-1" />
        </div>
        <InputField {...budget} name="budget" type="number" placeholder="الميزانية" required />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition" onClick={onCancel}>
          إلغاء
        </button>
        <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2"><span className="loader border-t-2 border-b-2 border-white rounded-full w-4 h-4 animate-spin"></span> جاري الإضافة...</span>
          ) : 'إضافة'}
        </button>
      </div>
      {error && <div className="text-red-600 mt-4 text-center font-semibold animate-pulse">{error}</div>}
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
