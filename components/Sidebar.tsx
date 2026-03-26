import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, Settings, LogOut, Beaker } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Labs', path: '/labs', icon: Beaker },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
           <span className="font-bold text-xl">L</span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">LabLink</h1>
          <p className="text-xs text-slate-400">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 text-slate-400 hover:text-white px-4 py-2 w-full hover:bg-slate-800 rounded-xl transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center space-x-3 text-red-400 hover:text-red-300 px-4 py-2 w-full mt-1 hover:bg-red-900/20 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">Target: May 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
