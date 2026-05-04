import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ProjectTable from './components/ProjectTable';
import ChatView from './components/ChatView';
import InvoicesView from './components/InvoicesView';
import FileManagerView from './components/FileManagerView';
import NotesView from './components/NotesView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProfileView from './components/ProfileView';

import SaasLandingView from './components/SaasLandingView';
import AdminDashboardView from './components/AdminDashboardView';
import UserDashboardView from './components/UserDashboardView';
import LiveTrackingView from './components/LiveTrackingView';
import TimesheetView from './components/TimesheetView';
import LeaveView from './components/LeaveView';
import AttendanceView from './components/AttendanceView';
import ExpenseView from './components/ExpenseView';
import ManageProjectsView from './components/ManageProjectsView';
import TasksView from './components/TasksView';
import EmployeesView from './components/EmployeesView';
import TeamsView from './components/TeamsView';
import ClientsView from './components/ClientsView';
import RolesPermissionsView from './components/RolesPermissionsView';
import ActivityLogsView from './components/ActivityLogsView';
import ReportsOverviewView from './components/ReportsOverviewView';
import TimeSheetReportView from './components/TimeSheetReportView';
import AttendanceReportView from './components/AttendanceReportView';
import ActivitySummaryView from './components/ActivitySummaryView';
import WebAppUsageView from './components/WebAppUsageView';
import SettingsView from './components/SettingsView';
import ScreenshotsView from './components/ScreenshotsView';
import EditTimeView from './components/EditTimeView';
import DownloadView from './components/DownloadView';
import AlertsView from './components/AlertsView';
import AvatarView from './components/AvatarView';
import UnusualActivityView from './components/UnusualActivityView';
import HoursTrackedView from './components/HoursTrackedView';
import TimelineReportView from './components/TimelineReportView';
import PoorTimeUseView from './components/PoorTimeUseView';
import LowActivityView from './components/LowActivityView';
import IdleTimeReportView from './components/IdleTimeReportView';
import OvertimeLimitView from './components/OvertimeLimitView';
import WorkingOnWeekendsView from './components/WorkingOnWeekendsView';
import { Search, Plus, Box, Users, UserCheck, UserPlus, List, Grid, ChevronRight, Menu, Bell, Moon, Sun, Globe, Settings as SettingsIcon, LogOut, User, Clock, X, Activity, Umbrella } from 'lucide-react';

const stats = [
  { title: 'Total Projects', value: '2520', change: '+15.2%', color: '#3b82f6', icon: <Box size={18} />, data: [{value: 10}, {value: 20}, {value: 15}, {value: 30}, {value: 25}, {value: 35}] },
  { title: 'Active', value: '2502', change: '+11.3%', color: '#f59e0b', icon: <Users size={18} />, data: [{value: 10}, {value: 15}, {value: 12}, {value: 25}, {value: 20}, {value: 30}] },
  { title: 'InProgress', value: '350', change: '+13.5%', color: '#3b82f6', icon: <UserCheck size={18} />, data: [{value: 5}, {value: 15}, {value: 10}, {value: 20}, {value: 18}, {value: 25}] },
  { title: 'Completed', value: '170', change: '-1.2%', color: '#10b981', icon: <UserPlus size={18} />, data: [{value: 5}, {value: 8}, {value: 6}, {value: 12}, {value: 10}, {value: 15}] },
];

import { useAppContext } from './context/AppContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentView, setCurrentView] = useState(() => {
    // 1. Check URL first
    const path = window.location.pathname.replace('/', '');
    if (path && path !== '') return path;

    // 2. Restore session on page refresh
    const session = localStorage.getItem('tt_session');
    if (session) {
      const mode = localStorage.getItem('dashboardMode') || 'admin';
      return mode === 'user' ? 'user-dashboard' : 'admin-dashboard';
    }
    return 'login';
  });

  // Sync URL -> currentView
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (path && path !== currentView) {
      setCurrentView(path);
    } else if (location.pathname === '/' && currentView === 'login') {
      // Default to login if root and login
    }
  }, [location.pathname]);

  // Sync currentView -> URL
  useEffect(() => {
    const currentPath = location.pathname.replace('/', '');
    if (currentView !== currentPath) {
      navigate(`/${currentView}`, { replace: true });
    }
  }, [currentView, navigate]);

  const { darkMode, setDarkMode } = useAppContext();
  const { currentUser, isAuthenticated, logout, isLoading: authLoading, setIsLoading, updatePresence } = useAuth();

  // Presence Update Loop
  useEffect(() => {
    if (isAuthenticated) {
      updatePresence();
      const interval = setInterval(() => {
        updatePresence();
      }, 120000); // 2 minutes
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, updatePresence]);

  // Header Interactive States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active Timer State
  const [activeSeconds, setActiveSeconds] = useState(0);
  const lastActivityTimeRef = useRef(Date.now());

  // Notifications State — starts empty, populated by real events
  const [notifications, setNotifications] = useState<any[]>([]);

  // Global Keyboard Shortcuts & Activity Tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      lastActivityTimeRef.current = Date.now();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    const handleActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Timer & Inactivity Logic
  useEffect(() => {
    if (currentView === 'saas-landing') {
      setActiveSeconds(0);
      return;
    }

    lastActivityTimeRef.current = Date.now(); // Reset on login

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityTimeRef.current > 10 * 60 * 1000) { // 10 minutes
        setCurrentView('saas-landing');
        alert('You have been automatically logged out due to 10 minutes of inactivity.');
      } else {
        setActiveSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentView]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds: number) => {
    const hours = seconds / 3600;
    if (hours < 5) return 'text-yellow-500';
    if (hours >= 5 && hours <= 9) return 'text-emerald-500';
    return 'text-red-500';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your session...</p>
          <button 
            onClick={() => {
              // Manual override: force loading off
              setIsLoading(false);
            }}
            className="mt-4 text-xs text-gray-400 hover:text-blue-500 underline"
          >
            Taking too long? Click here to skip.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-white dark:bg-black text-gray-900 dark:text-white'}`} dir={currentView === 'rtl-support' ? 'rtl' : 'ltr'}>
      {currentView !== 'hidden-menu' && currentView !== 'full-width' && currentView !== 'rtl-support' && currentView !== 'saas-landing' && currentView !== 'login' && currentView !== 'register' && (
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      )}
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navigation Bar */}
        {currentView !== 'saas-landing' && currentView !== 'login' && currentView !== 'register' && (
          <header className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800'} border-b h-16 flex items-center justify-between px-6 shrink-0 transition-colors duration-500 relative z-30`}>
            <div className="flex items-center gap-4 flex-1">
              {(currentView === 'hidden-menu' || currentView === 'full-width' || currentView === 'rtl-support' || currentView === 'dark-mode') && (
                <div className={`flex items-center gap-2 ${currentView === 'rtl-support' ? 'ml-4' : 'mr-4'}`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Box size={20} />
                  </div>
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800 dark:text-white'}`}>CodeXConquer</span>
                </div>
              )}
              <button 
                onClick={() => (currentView === 'hidden-menu' || currentView === 'full-width' || currentView === 'rtl-support' || currentView === 'dark-mode') && setCurrentView('mini-sidebar')}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-black text-gray-400' : 'hover:bg-white dark:bg-black text-gray-500 dark:text-gray-400'}`}
              >
                <Menu size={20} />
              </button>
              <div className="relative w-64 group">
                <Search className={`absolute ${currentView === 'rtl-support' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500`} size={18} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search Keyword" 
                  className={`w-full border rounded-lg py-2 ${currentView === 'rtl-support' ? 'pr-10 pl-16' : 'pl-10 pr-16'} text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${darkMode ? 'bg-black border-gray-800 text-white placeholder-gray-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'}`} 
                />
                <span className={`absolute ${currentView === 'rtl-support' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[10px] font-bold border px-1.5 py-0.5 rounded uppercase pointer-events-none transition-colors ${darkMode ? 'text-gray-400 border-gray-700 bg-black' : 'text-gray-400 border-gray-200 dark:border-gray-700 bg-white dark:bg-black'}`}>ctrl + K</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative">
              {/* Active Timer (Background Tracking) */}
              <div 
                className="relative flex items-center justify-center p-2 cursor-help" 
                title="System actively tracking session"
              >
                <div className={`w-2.5 h-2.5 rounded-full z-10 ${darkMode ? 'border-[1.5px] border-[#0a0a1a]' : 'border-[1.5px] border-white'} ${
                  activeSeconds < 5 * 3600 ? 'bg-yellow-500' :
                  activeSeconds <= 9 * 3600 ? 'bg-emerald-500' :
                  'bg-red-500'
                }`}></div>
                <div className={`absolute w-2.5 h-2.5 rounded-full animate-ping opacity-60 ${
                  activeSeconds < 5 * 3600 ? 'bg-yellow-500' :
                  activeSeconds <= 9 * 3600 ? 'bg-emerald-500' :
                  'bg-red-500'
                }`}></div>
              </div>



              
              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${darkMode ? 'bg-black border border-gray-700 text-blue-300' : 'bg-[#f4f6f9] border border-transparent text-slate-500 hover:bg-[#eef1f5] hover:text-slate-700'}`}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
              </button>
              
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                  className={`p-2 rounded-lg relative transition-colors hover:scale-105 active:scale-95 ${isNotificationsOpen ? (darkMode ? 'bg-black text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'hover:bg-black text-gray-400' : 'hover:bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400')}`}
                >
                  <Bell size={20} className={isNotificationsOpen ? 'animate-swing' : ''} />
                  <span className={`absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 ${darkMode ? 'border-black' : 'border-white'} rounded-full ${notifications.filter(n => !n.read).length > 0 ? 'animate-pulse' : 'hidden'}`}></span>
                </button>

                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <div className={`absolute top-full right-0 mt-3 w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden transform origin-top transition-all animate-fade-in-down ${darkMode ? 'bg-black border-gray-800' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800'}`}>
                      <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black/50'}`}>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">Notifications</h3>
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{notifications.filter(n => !n.read).length} New</span>
                          )}
                        </div>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <button 
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-900 hover:text-gray-800 dark:text-white'}`}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => { setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n)); setCurrentView('activity-logs'); setIsNotificationsOpen(false); }}
                            className={`p-4 border-b last:border-0 cursor-pointer transition-colors group relative ${darkMode ? 'border-gray-800 hover:bg-gray-900/50' : 'border-gray-50 hover:bg-blue-50/30'} ${!notif.read ? (darkMode ? 'bg-blue-900/5' : 'bg-blue-50/40') : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className="relative shrink-0">
                                <img src={notif.avatar} alt={notif.user} className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${darkMode ? 'border-black' : 'border-white'} ${notif.iconBg}`}>
                                  {notif.icon}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-snug mb-1 ${!notif.read ? 'font-semibold' : 'font-normal'} ${darkMode ? 'text-gray-200' : 'text-gray-800 dark:text-white'}`}>
                                  <span className="font-bold">{notif.user}</span>{' '}<span className={darkMode ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>{notif.message}</span>
                                </p>
                                <p className={`text-[11px] font-medium ${darkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>{notif.time}</p>
                              </div>
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2 animate-pulse" />}
                              <button 
                                onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.filter(n => n.id !== notif.id)); }}
                                className={`absolute top-3 right-3 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-600 dark:text-gray-400' : 'hover:bg-gray-200 text-gray-400'}`}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        )) : (
                          <div className="py-12 text-center">
                            <Bell size={28} className={`mx-auto mb-3 ${darkMode ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'}`} />
                            <p className={`text-sm font-bold ${darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`}>All caught up!</p>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>No new notifications</p>
                          </div>
                        )}
                      </div>
                      <div 
                        onClick={() => { setCurrentView('activity-logs'); setIsNotificationsOpen(false); }}
                        className={`p-3 text-center border-t text-sm font-bold text-blue-600 hover:underline cursor-pointer ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}
                      >
                        View All Activity
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative ml-2">
                <div 
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-full border-2 transition-all hover:scale-105 ${isProfileOpen ? 'border-blue-500' : (darkMode ? 'border-gray-800 hover:border-gray-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300')}`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-sm font-bold">{(currentUser?.fullName || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className={`absolute top-full right-0 mt-3 w-56 rounded-2xl border shadow-2xl z-50 overflow-hidden transform origin-top transition-all animate-fade-in-down ${darkMode ? 'bg-black border-gray-800' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800'}`}>
                      <div className={`p-4 border-b text-center ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black/50'}`}>
                        <div className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white dark:border-gray-800 shadow-sm overflow-hidden bg-blue-600 flex items-center justify-center">
                          {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-white text-2xl font-bold">{(currentUser?.fullName || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-base mb-1">{currentUser?.fullName || 'User'}</h3>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{currentUser?.email || ''}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <button 
                          onClick={() => { setCurrentView('profile'); setIsProfileOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-900 hover:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-900'}`}
                        >
                          <User size={16} /> My Profile
                        </button>
                        <button 
                          onClick={() => { setCurrentView('settings'); setIsProfileOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-900 hover:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-900'}`}
                        >
                          <SettingsIcon size={16} /> Account Settings
                        </button>
                      </div>
                      <div className={`p-2 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
                        <button 
                          onClick={async () => {
                              setIsProfileOpen(false);
                              setActiveSeconds(0);
                              await logout();
                              setCurrentView('login');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </header>
        )}

        {/* Main Content Area */}
        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-500 ${currentView === 'saas-landing' ? 'p-0' : 'p-8'}`}>

          {currentView === 'login' ? (
            <LoginView onViewChange={setCurrentView} />
          ) : currentView === 'register' ? (
            <RegisterView onViewChange={setCurrentView} />
          ) : currentView === 'admin-dashboard' ? (
            <AdminDashboardView />
          ) : currentView === 'user-dashboard' ? (
            <UserDashboardView />
          ) : currentView === 'profile' ? (
            <ProfileView />
          ) : currentView === 'projects' ? (
            <ManageProjectsView />
          ) : currentView === 'chat' ? (
            <ChatView />
          ) : currentView === 'invoices' ? (
            <InvoicesView />
          ) : currentView === 'file-manager' ? (
            <FileManagerView />
          ) : currentView === 'notes' ? (
            <NotesView />


          ) : currentView === 'saas-landing' ? (
            <SaasLandingView onViewChange={setCurrentView} />
          ) : currentView === 'live-tracking' ? (
            <LiveTrackingView />
          ) : currentView === 'timesheet' ? (
            <TimesheetView />
          ) : currentView === 'leave' ? (
            <LeaveView />
          ) : currentView === 'attendance' ? (
            <AttendanceView />
          ) : currentView === 'expense' ? (
            <ExpenseView />
          ) : currentView === 'manage-projects' ? (
            <ManageProjectsView />
          ) : currentView === 'tasks' ? (
            <TasksView />
          ) : currentView === 'screenshots' ? (
            <ScreenshotsView />
          ) : currentView === 'edit-time' ? (
            <EditTimeView />
          ) : currentView === 'download' ? (
            <DownloadView />
          ) : currentView === 'employees' ? (
            <EmployeesView />
          ) : currentView === 'teams' ? (
            <TeamsView />
          ) : currentView === 'clients' ? (
            <ClientsView />
          ) : currentView === 'roles-permissions' ? (
            <RolesPermissionsView />
          ) : currentView === 'activity-logs' ? (
            <ActivityLogsView />
          ) : currentView === 'report-main' ? (
            <ReportsOverviewView onViewChange={setCurrentView} />
          ) : currentView === 'report-timesheets' ? (
            <TimeSheetReportView />
          ) : currentView === 'report-attendance' ? (
            <AttendanceReportView />
          ) : currentView === 'report-activity-summary' ? (
            <ActivitySummaryView />
          ) : currentView === 'report-web-app-usage' ? (
            <WebAppUsageView />
          ) : currentView === 'report-unusual-activity' ? (
            <UnusualActivityView />
          ) : currentView === 'report-hours-tracked' ? (
            <HoursTrackedView />
          ) : currentView === 'report-timeline' ? (
            <TimelineReportView />
          ) : currentView === 'report-poor-time-use' ? (
            <PoorTimeUseView />
          ) : currentView === 'report-low-activity' ? (
            <LowActivityView />
          ) : currentView === 'report-idle-time' ? (
            <IdleTimeReportView />
          ) : currentView === 'report-overtime-limit' ? (
            <OvertimeLimitView />
          ) : currentView === 'report-weekend-work' ? (
            <WorkingOnWeekendsView />
          ) : currentView === 'settings' ? (
            <SettingsView />
          ) : currentView === 'ui-alerts' ? (
            <div className="p-8">
              <AlertsView />
            </div>
          ) : currentView === 'ui-avatar' ? (
            <div className="p-8">
              <AvatarView />
            </div>
          ) : currentView.startsWith('ui-') ? (
            <div className="p-8">
               <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{currentView.replace('ui-', '').replace('-', ' ')}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>UI Interface</span>
                  <ChevronRight size={14} />
                  <span>Base UI</span>
                  <ChevronRight size={14} />
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{currentView.replace('ui-', '').replace('-', ' ')}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-black p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{currentView.replace('ui-', '').replace('-', ' ')} Component</h2>
                <p className="text-gray-500 dark:text-gray-400">This component is part of the Base UI interface. Detailed documentation and examples will be available soon.</p>
              </div>
            </div>
          ) : currentView === 'user-management' || currentView === 'invoices' || currentView === 'reports' || currentView.startsWith('report-') ? (
            <div className="p-8">
               <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{currentView.replace('-', ' ')}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Home</span>
                  <ChevronRight size={14} />
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{currentView.replace('-', ' ')}</span>
                </div>
              </div>
              <AdminDashboardView isDarkMode={darkMode} />
            </div>
          ) : currentView === 'mini-sidebar' || currentView === 'hover-view' || currentView === 'hidden-menu' || currentView === 'full-width' || currentView === 'rtl-support' || currentView === 'dark-mode' ? (
            <AdminDashboardView isRTL={currentView === 'rtl-support'} isDarkMode={darkMode} />
          ) : (
            <AdminDashboardView isDarkMode={darkMode} />
          )}
        </main>
        

      </div>
    </div>
  );
}
