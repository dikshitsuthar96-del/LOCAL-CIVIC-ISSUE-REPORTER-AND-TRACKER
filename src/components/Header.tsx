import React from 'react';
import { Landmark, Bell, PlusCircle, ListFilter, Cpu, PlayCircle, RotateCcw } from 'lucide-react';
import { NotificationItem } from '../types.js';

interface HeaderProps {
  activeTab: 'report' | 'dashboard' | 'agents' | 'simulator';
  setActiveTab: (tab: 'report' | 'dashboard' | 'agents' | 'simulator') => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onResetData: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onOpenNotifications,
  onResetData,
  isResetting,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & City ID */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-neutral-900">CivicPulse</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-neutral-600 hidden sm:block">Municipal Issue Reporter &amp; Autonomous Agent Tracker</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-report-btn"
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'report'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Tracker &amp; Feed</span>
              <span className="sm:hidden">Tracker</span>
            </button>

            <button
              id="nav-agents-btn"
              onClick={() => setActiveTab('agents')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">Agent Graphs</span>
              <span className="sm:hidden">Agents</span>
            </button>

            <button
              id="nav-simulator-btn"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Status Simulator</span>
              <span className="sm:hidden">Simulate</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            <button
              id="notifications-toggle-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-hidden"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Reset Data Button */}
            <button
              id="reset-demo-data-btn"
              onClick={onResetData}
              disabled={isResetting}
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg border border-neutral-200"
              title="Reset complaints and notifications to default sample seed"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Seed</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
