'use client';

import { useState, useEffect, useRef } from "react";
import { BellIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function Header() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks'),
        ]);
        setProjects(await projectsRes.json());
        setTasks(await tasksRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const debouncedQuery = useDebounce(query, 400);

  // Filter logic
  const results = debouncedQuery
    ? [
        ...projects
          .filter((p) => p.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
          .map((p) => ({ type: "project", ...p })),
        ...tasks
          .filter((t) => t.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
          .map((t) => ({ type: "task", ...t })),

      ]
    : [];

  // Hide results on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    if (showResults) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showResults]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-lg relative">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="البحث في المشاريع والمهام..."
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              autoComplete="off"
            />
            {/* Results Dropdown */}
            {showResults && results.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-right">
                {results.map((item, idx) => (
                  <div
                    key={item.type + item.id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-right"
                    onMouseDown={() => {
                      setQuery(item.name);
                      setShowResults(false);
                      if (item.type === "project") {
                        router.push(`/projects/${item.id}`);
                      } else if (item.type === "task") {
                        router.push(`/tasks/${item.id}`);
                      }
                    }}
                  >
                    <div className="font-medium text-blue-600 flex items-center gap-2">
                      {item.type === "project" && "مشروع"}
                      {item.type === "task" && "مهمة"}
                      <span className="text-gray-800">: {item.name}</span>
                    </div>
                    {/* Extra info for each type */}
                    {item.type === "project" && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                        <span>الحالة: {item.status}</span>
                        <span>الأولوية: {item.priority}</span>
                        <span>التقدم: {item.progress}%</span>
                      </div>
                    )}
                    {item.type === "task" && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                        <span>الحالة: {item.status}</span>
                        <span>الأولوية: {item.priority}</span>
                        {item.projectName && <span>المشروع: {item.projectName}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* No results */}
            {showResults && debouncedQuery && results.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-500 p-4 text-center">
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 space-x-4 space-x-reverse">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">عرض الإشعارات</span>
            <BellIcon className="h-6 w-6" />
          </button>
          {/* User Avatar */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600  flex items-center justify-center">
              <span className="text-sm font-medium text-white">أ.م</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-700">أحمد محمد</p>
              <p className="text-xs text-gray-500">مدير المشروع</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}