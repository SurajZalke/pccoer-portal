import React, { useState } from 'react';
import { User, UserRole, NotificationItem } from '../../types';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Trophy, 
  Sun, 
  Moon, 
  GraduationCap, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  FlaskConical, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  onOpenLiveQuiz: () => void;
  onOpenAiAssistant: () => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onNavigatePortfolio: () => void;
  onNavigateAnalytics?: () => void;
  onNavigateAdmin?: () => void;
  notifications: NotificationItem[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  onOpenLiveQuiz,
  onOpenAiAssistant,
  onOpenSearch,
  onNavigateHome,
  onNavigatePortfolio,
  onNavigateAnalytics,
  onNavigateAdmin,
  notifications,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Official PCCOER Branding */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-900 via-rose-800 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                PCCOER
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-rose-900 text-white font-mono tracking-wider">
                CONNECT
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase font-mono">
              Learn · Practice · Connect · Grow
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search notes, virtual practicals, PYQs, faculty...</span>
            </span>
            <kbd className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Quiz Direct Trigger */}
          <button
            onClick={onOpenLiveQuiz}
            className="py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="Live Quiz Engine (Code: CHEM26)"
          >
            <Trophy className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Live Quiz</span>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          </button>

          {/* PCCOER AI Trigger */}
          <button
            onClick={onOpenAiAssistant}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-950/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PCCOER AI</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Campus Notifications</span>
                  <span className="text-[10px] text-rose-800 dark:text-rose-400 font-bold">{unreadCount} Unread</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                      <p className="text-[11px] text-slate-500 leading-tight">{n.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Role Switcher & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-xl object-cover"
              />
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-mono uppercase text-rose-800 dark:text-rose-400 font-semibold">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 space-y-2 z-50 text-xs">
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-rose-800 dark:text-rose-400 mt-1 uppercase font-semibold">
                    Role: {currentUser.role}
                  </div>
                </div>

                <div className="pt-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider px-2 mb-1">
                    Switch Test Persona
                  </div>

                  <button
                    onClick={() => { onSwitchRole('student'); setShowRoleMenu(false); }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                      currentUser.role === 'student' ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Student: Suraj Zalke</span>
                    {currentUser.role === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-700" />}
                  </button>

                  <button
                    onClick={() => { onSwitchRole('teacher'); setShowRoleMenu(false); }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                      currentUser.role === 'teacher' ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Teacher: Prof. Dr. Aarti Sharma</span>
                    {currentUser.role === 'teacher' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-700" />}
                  </button>

                  <button
                    onClick={() => { onSwitchRole('admin'); setShowRoleMenu(false); }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                      currentUser.role === 'admin' ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Admin: Dr. Harish Kulkarni</span>
                    {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-700" />}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  {currentUser.role === 'student' && (
                    <button
                      onClick={() => { onNavigatePortfolio(); setShowRoleMenu(false); }}
                      className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      View Academic Portfolio
                    </button>
                  )}

                  {currentUser.role === 'teacher' && onNavigateAnalytics && (
                    <button
                      onClick={() => { onNavigateAnalytics(); setShowRoleMenu(false); }}
                      className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      Instructor Analytics Console
                    </button>
                  )}

                  {currentUser.role === 'admin' && onNavigateAdmin && (
                    <button
                      onClick={() => { onNavigateAdmin(); setShowRoleMenu(false); }}
                      className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      System Administration
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
