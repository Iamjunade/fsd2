import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Beaker, Trophy, User, LogOut, LogIn, Terminal, Layers, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { getLabs, Lab } from '../services/labService';

import { BlackScreenToggle } from './BlackScreenToggle';

export const Layout: React.FC = () => {
  const { user, profile, login, logout } = useAuth();
  const location = useLocation();
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    const fetchLabs = async () => {
      const fetchedLabs = await getLabs();
      setLabs(fetchedLabs);
    };
    fetchLabs();
  }, []);

  const getLabIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return Terminal;
      case 'Layers': return Layers;
      case 'Search': return Search;
      default: return Beaker;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex">
      <BlackScreenToggle />
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800/50 border-r border-slate-700/50 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="font-bold text-xl text-white">L</span>
          </div>
          <h1 className="font-bold text-xl tracking-wide">LabLink</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <h2 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Engineering Labs
            </h2>
            <nav className="space-y-2">
              {labs.map((lab) => {
                const isActive = location.pathname.startsWith(`/labs/${lab.id}`);
                const Icon = getLabIcon(lab.iconName);
                return (
                  <Link
                    key={lab.id}
                    to={`/labs/${lab.id}`}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm truncate">{lab.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          {user ? (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{profile?.username || user.displayName}</span>
                <span className="text-xs text-indigo-400 font-mono">{profile?.points || 0} pts</span>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition-all"
            >
              <LogIn size={18} />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm text-white">L</span>
            </div>
            <h1 className="font-bold text-lg">LabLink</h1>
          </div>
          {user ? (
            <button onClick={logout} className="text-slate-400"><LogOut size={20} /></button>
          ) : (
            <button onClick={login} className="text-indigo-400"><LogIn size={20} /></button>
          )}
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50 flex justify-around p-3 z-50">
        <Link
          to="/labs"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
            location.pathname.startsWith('/labs') ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Beaker size={20} />
          <span className="text-[10px] font-medium">Labs</span>
        </Link>
      </nav>
    </div>
  );
};
