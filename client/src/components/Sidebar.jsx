import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Start Interview', path: '/interview/setup', icon: PlusCircle },
    { name: 'History', path: '/interviews', icon: History },
  ];

  return (
    <aside className="w-56 bg-white border-r border-[#E8DEC8] min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#F7F3EB] text-[#B87D4B] border border-[#E8DEC8] font-semibold'
                    : 'text-[#7A6B5D] hover:text-[#2B1E16] hover:bg-[#FBF8F3]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
