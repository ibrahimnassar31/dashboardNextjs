import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (user: any) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export function UserForm({ onSubmit, onCancel, loading, error }: UserFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    skills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">الاسم</label>
        <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
        <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required type="email" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">القسم</label>
        <input name="department" value={form.department} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">الدور الوظيفي</label>
        <input name="role" value={form.role} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">المهارات (مفصولة بفاصلة)</label>
        <input name="skills" value={form.skills} onChange={handleChange} className="mt-1 block w-full border rounded px-3 py-2" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">إلغاء</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </div>
    </form>
  );
}
