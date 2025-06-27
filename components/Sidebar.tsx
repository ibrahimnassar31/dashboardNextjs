'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  FolderIcon, 
  CheckSquareIcon, 
  BarChart3Icon, 
  SettingsIcon,
  UsersIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: HomeIcon },
  { name: 'المشاريع', href: '/projects', icon: FolderIcon },
  { name: 'المهام', href: '/tasks', icon: CheckSquareIcon },
  { name: 'الفريق', href: '/team', icon: UsersIcon },
  { name: 'التقارير', href: '/reports', icon: BarChart3Icon },
  { name: 'الإعدادات', href: '/settings', icon: SettingsIcon },
];

const sidebarVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 70, damping: 14 } },
};

const mobileSidebarVariants = {
  hidden: { x: 300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 70, damping: 14 } },
  exit: { x: 300, opacity: 0, transition: { duration: 0.2 } },
};

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <motion.div
      className="flex flex-col flex-1 min-h-0"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
        <h1 className="text-xl font-bold text-white">لوحة المشاريع</h1>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              whileHover={{
                x: -3,
                boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
                scale: 1.03,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setOpen(false)} // Close sidebar on mobile after click
              >
                <item.icon className="ml-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.div>
  );

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white p-2 rounded shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-6 w-6 text-blue-600" />
      </button>

      {/* Sidebar for desktop */}
      <motion.div
        className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 right-0 z-40 bg-white shadow-lg"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {SidebarContent}
      </motion.div>

      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay background */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar overlay"
            />
            {/* Sidebar panel */}
            <motion.div
              className="relative w-64 h-full bg-white shadow-lg ml-auto flex flex-col"
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                className="absolute top-4 left-4 z-50 bg-white p-1 rounded"
                onClick={() => setOpen(false)}
                aria-label="Close sidebar"
              >
                <XIcon className="h-6 w-6 text-blue-600" />
              </button>
              {SidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}