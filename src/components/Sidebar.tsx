import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, Calendar, FileText, Folder, 
  Notebook, CheckSquare, Kanban, Users, Mail, Phone, Video, 
  Mic, ChevronDown, ChevronRight, Box, Activity, Umbrella, 
  UserCheck, Receipt, Briefcase, FileCheck, Camera, Download, Clock,
  UserPlus, History, User, List, Bell, ClipboardList, Settings,
  Network, Orbit, SquarePen, LayoutGrid, PieChart, Shapes, Map, Lock
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';

export default function Sidebar({ currentView, onViewChange }: { currentView: string, onViewChange: (view: string) => void }) {
  const { darkMode } = useAppContext();
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isBaseUIOpen, setIsBaseUIOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isUserReportsOpen, setIsUserReportsOpen] = useState(false);

  const isDashboardActive = currentView === 'admin-dashboard' || currentView === 'user-dashboard';

  // User-mode views: when user navigates to user-dashboard or any user-specific view
  const userViews = ['user-dashboard','timesheet','attendance','leave','projects','tasks','report-main','report-timesheets','report-attendance','report-activity-summary','report-web-app-usage'];
  const isUserMode = currentView === 'user-dashboard' || (userViews.includes(currentView) && !['admin-dashboard'].includes(currentView) && localStorage.getItem('dashboardMode') === 'user');

  // Persist mode
  const handleDashboardSwitch = (view: string) => {
    localStorage.setItem('dashboardMode', view === 'user-dashboard' ? 'user' : 'admin');
    onViewChange(view);
  };

  const reportSubItems = [
    { label: 'Reports', view: 'report-main' },
    { label: 'Timesheets', view: 'report-timesheets' },
    { label: 'Attendance', view: 'report-attendance' },
    { label: 'Activity Summary', view: 'report-activity-summary' },
    { label: 'Web & App Usage', view: 'report-web-app-usage' },
  ];

  const baseUISubItems = [
    { label: 'Alerts', view: 'ui-alerts' },
    { label: 'Avatar', view: 'ui-avatar' },
    { label: 'Card', view: 'ui-card' },
    { label: 'Carousel', view: 'ui-carousel' },
    { label: 'Collapse', view: 'ui-collapse' },
    { label: 'Dropdowns', view: 'ui-dropdowns' },
    { label: 'Ratio', view: 'ui-ratio' },
    { label: 'Grid', view: 'ui-grid' },
    { label: 'Images', view: 'ui-images' },
    { label: 'Links', view: 'ui-links' },
    { label: 'List Group', view: 'ui-list-group' },
    { label: 'Modals', view: 'ui-modals' },
    { label: 'Offcanvas', view: 'ui-offcanvas' },
    { label: 'Pagination', view: 'ui-pagination' },
    { label: 'Placeholders', view: 'ui-placeholders' },
    { label: 'Progress', view: 'ui-progress' },
    { label: 'Scrollspy', view: 'ui-scrollspy' },
    { label: 'Spinner', view: 'ui-spinner' },
    { label: 'Tabs', view: 'ui-tabs' },
    { label: 'Toasts', view: 'ui-toasts' },
    { label: 'Tooltips', view: 'ui-tooltips' },
    { label: 'Typography', view: 'ui-typography' },
    { label: 'Utilities', view: 'ui-utilities' },
  ];

  return (
    <div className={`w-64 ${darkMode ? 'bg-black border-gray-800 text-gray-300' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'} h-screen flex flex-col border-r overflow-y-auto transition-colors duration-500`}>
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main</p>
        <nav className="space-y-1">
          <div className="mt-1">
            <div 
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${isDashboardActive || isDashboardOpen ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              {isDashboardOpen || isDashboardActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {(isDashboardOpen || isDashboardActive) && (
              <div className={`ml-4 mt-1 space-y-1 border-l-2 ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
                <div 
                  onClick={() => handleDashboardSwitch('admin-dashboard')}
                  className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative transition-all ${currentView === 'admin-dashboard' ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
                >
                  {currentView === 'admin-dashboard' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-full" />}
                  <span className={`${currentView === 'admin-dashboard' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'} font-bold mr-1`}>−</span>
                  <span className="text-sm">Admin Dashboard</span>
                </div>
                <div 
                  onClick={() => handleDashboardSwitch('user-dashboard')}
                  className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative transition-all ${currentView === 'user-dashboard' ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
                >
                  {currentView === 'user-dashboard' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-full" />}
                  <span className={`${currentView === 'user-dashboard' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'} font-bold mr-1`}>−</span>
                  <span className="text-sm">User Dashboard</span>
                </div>
              </div>
            )}
          </div>
          
        </nav>

        {/* ===== USER MODE SIDEBAR ===== */}
        {isUserMode && (
          <>
            <nav className="space-y-1 mt-6">
              <SidebarItem icon={<Calendar size={18} />} label="Timesheet" active={currentView === 'timesheet'} onClick={() => onViewChange('timesheet')} darkMode={darkMode} />
              <SidebarItem icon={<UserCheck size={18} />} label="Attendance" active={currentView === 'attendance'} onClick={() => onViewChange('attendance')} darkMode={darkMode} />
              <SidebarItem icon={<Umbrella size={18} />} label="Leave" active={currentView === 'leave'} onClick={() => onViewChange('leave')} darkMode={darkMode} />
              <SidebarItem icon={<Briefcase size={18} />} label="Projects" active={currentView === 'projects'} onClick={() => onViewChange('projects')} darkMode={darkMode} />
              <SidebarItem icon={<FileCheck size={18} />} label="Tasks" active={currentView === 'tasks'} onClick={() => onViewChange('tasks')} darkMode={darkMode} />
              
              {/* Reports with sub-items */}
              <div className="mt-1">
                <div 
                  onClick={() => setIsUserReportsOpen(!isUserReportsOpen)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${currentView.startsWith('report-') || isUserReportsOpen ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black')}`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList size={18} />
                    <span className="text-sm font-medium">Reports</span>
                  </div>
                  {isUserReportsOpen || currentView.startsWith('report-') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                {(isUserReportsOpen || currentView.startsWith('report-')) && (
                  <div className={`ml-4 mt-1 space-y-1 border-l-2 ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
                    {reportSubItems.map((item) => (
                      <div key={item.view} onClick={() => onViewChange(item.view)} className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative transition-all ${currentView === item.view ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}>
                        {currentView === item.view && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-full" />}
                        <span className={`${currentView === item.view ? 'text-blue-500' : (darkMode ? 'text-gray-700' : 'text-gray-300')} font-bold mr-1`}>−</span>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Account</p>
            <nav className="space-y-1">
              <SidebarItem icon={<User size={18} />} label="Profile" active={currentView === 'profile'} onClick={() => onViewChange('profile')} darkMode={darkMode} />
            </nav>

          </>
        )}

        {/* ===== ADMIN MODE SIDEBAR ===== */}
        {!isUserMode && (
          <>
          <div className="mt-4">
            <div className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Applications</span>
              </div>
              <ChevronDown size={14} />
            </div>
            
            <div className={`ml-4 mt-1 space-y-1 border-l-2 ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
              <NavItem label="Chat" active={currentView === 'chat'} onClick={() => onViewChange('chat')} darkMode={darkMode} />
              <NavItem label="Invoices" active={currentView === 'invoices'} onClick={() => onViewChange('invoices')} darkMode={darkMode} />
              <NavItem label="File Manager" active={currentView === 'file-manager'} onClick={() => onViewChange('file-manager')} darkMode={darkMode} />
              <NavItem label="Notes" active={currentView === 'notes'} onClick={() => onViewChange('notes')} darkMode={darkMode} />
            </div>
          </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Track</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('live-tracking')}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${currentView === 'live-tracking' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <div className="flex items-center gap-3">
              <Activity size={18} />
              <span className="text-sm font-medium">Live Tracking</span>
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          </div>
          <div 
            onClick={() => onViewChange('leave')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'leave' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <Umbrella size={18} />
            <span className="text-sm font-medium">Leave</span>
          </div>
          <div 
            onClick={() => onViewChange('attendance')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'attendance' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <UserCheck size={18} />
            <span className="text-sm font-medium">Attendance</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Manage</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('tasks')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'tasks' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <FileCheck size={18} />
            <span className="text-sm font-medium">Tasks</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Workforce</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('employees')}
            className={`flex items-center gap-3 p-2 text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black rounded-lg cursor-pointer ${currentView === 'employees' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <User size={18} />
            <span className="text-sm font-medium">Employees</span>
          </div>
          <div 
            onClick={() => onViewChange('teams')}
            className={`flex items-center gap-3 p-2 text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black rounded-lg cursor-pointer ${currentView === 'teams' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <Users size={18} />
            <span className="text-sm font-medium">Teams</span>
          </div>
          <div 
            onClick={() => onViewChange('clients')}
            className={`flex items-center gap-3 p-2 text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black rounded-lg cursor-pointer ${currentView === 'clients' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <Users size={18} />
            <span className="text-sm font-medium">Clients</span>
          </div>

          <div 
            onClick={() => onViewChange('activity-logs')}
            className={`flex items-center gap-3 p-2 text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black rounded-lg cursor-pointer ${currentView === 'activity-logs' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}`}
          >
            <List size={18} />
            <span className="text-sm font-medium">Activity Logs</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Account</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('profile')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'profile' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <User size={18} />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Authentication</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('register')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'register' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <UserPlus size={18} />
            <span className="text-sm font-medium">Register</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Administrator</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('invoices')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'invoices' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <FileText size={18} />
            <span className="text-sm font-medium">Invoices</span>
          </div>
          <div className="mt-1">
            <div 
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${currentView.startsWith('report-') || isReportsOpen ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={18} />
                <span className="text-sm font-medium">Reports</span>
              </div>
              {isReportsOpen || currentView.startsWith('report-') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {(isReportsOpen || currentView.startsWith('report-')) && (
              <div className={`ml-4 mt-1 space-y-1 border-l-2 ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
                {reportSubItems.map((item) => (
                  <div 
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative transition-all ${currentView === item.view ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
                  >
                    {currentView === item.view && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-full" />}
                    <span className={`${currentView === item.view ? 'text-blue-500' : (darkMode ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300')} font-bold mr-1`}>−</span>
                    <span className={`text-sm ${currentView === item.view ? 'text-blue-500' : (darkMode ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400')}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div 
            onClick={() => onViewChange('settings')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'settings' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black')}`}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

          </>
        )}
      </div>
    </div>
  );
}

function LayoutSubItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-2 pl-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200">
      <span className="text-gray-300 font-bold mr-1">−</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function NavItem({ label, active = false, onClick, darkMode = false }: { label: string, active?: boolean, onClick?: () => void, darkMode?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative transition-all ${active ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
    >
      {active && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-full" />}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, darkMode = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, darkMode?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${active ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black')}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
