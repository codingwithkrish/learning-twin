import React from 'react';
import { 
  LayoutDashboard, 
  Share2, 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  Plus, 
  Settings, 
  Accessibility,
  LogOut
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

const Sidebar = ({ activePage, setActivePage, onNewSession }) => {
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'sessions', label: 'Sessions', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside aria-label="Main Navigation" className="w-64 h-screen bg-surface-lowest border-r border-white/5 flex flex-col p-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-primary-indigo rounded-xl flex items-center justify-center">
          <Share2 className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">Learning Twin</h1>
          <p className="text-xs text-on-surface/50">AI TUTOR</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              activePage === item.id 
                ? "bg-primary-indigo/10 text-primary-indigo border border-primary-indigo/20 shadow-lg shadow-primary-indigo/5"
                : "text-on-surface/60 hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <item.icon size={20} aria-hidden="true" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="px-4 mb-8">
        <button 
          onClick={onNewSession}
          className="w-full py-4 bg-primary-indigo text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-indigo/80 shadow-lg shadow-primary-indigo/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>New Session</span>
        </button>
      </div>
      </nav>

      {/* Footer Nav */}
      <div className="mt-auto space-y-2 border-t border-white/5 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface/60 hover:bg-surface-container rounded-xl transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface/60 hover:bg-surface-container rounded-xl transition-all">
          <Accessibility size={20} />
          <span className="font-medium">Accessibility</span>
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-error/60 hover:bg-error/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
