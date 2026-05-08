import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, Calendar, FileText, Folder, 
  Notebook, CheckSquare, Kanban, Users, Mail, Phone, Video, 
  Mic, ChevronDown, ChevronRight, Box, Activity, Umbrella, 
  UserCheck, Receipt, Briefcase, FileCheck, Camera, Download, Clock,
  UserPlus, History, User, List, Bell, ClipboardList, Settings,
  Network, Orbit, SquarePen, LayoutGrid, PieChart, Shapes, Map, Lock, Shield
} from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  collapsed = false, 
  setCollapsed 
}: { 
  currentView: string, 
  onViewChange: (view: string) => void,
  collapsed?: boolean,
  setCollapsed?: (collapsed: boolean) => void
}) {
  const { darkMode } = useAppContext();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Role Detection
  const isAdmin = currentUser?.role?.trim().toLowerCase() === 'administrator';
  const isEmployee = currentUser?.role?.trim().toLowerCase() === 'employee';
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
    <div className={`${collapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-black border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-600'} h-screen flex flex-col border-r overflow-y-auto transition-all duration-300`}>
      <div className="p-4">
        <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '...' : 'Main'}
        </p>
        <nav className="space-y-1">
          {isAdmin && (
            <div 
              onClick={() => handleDashboardSwitch('admin-dashboard')}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'admin-dashboard' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? 'Admin Dashboard' : ''}
            >
              <Shield size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Admin Dashboard</span>}
            </div>
          )}
          <div 
            onClick={() => handleDashboardSwitch('user-dashboard')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'user-dashboard' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'User Dashboard' : ''}
          >
            <LayoutGrid size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">User Dashboard</span>}
          </div>
          
        </nav>

        {/* ===== USER SPECIFIC ITEMS ===== */}
        {(isUserMode || !isAdmin) && (
          <nav className="space-y-1 mt-6">
            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? '...' : 'Self Service'}
            </p>
            <SidebarItem icon={<UserCheck size={18} />} label="Attendance" active={currentView === 'attendance'} onClick={() => onViewChange('attendance')} darkMode={darkMode} collapsed={collapsed} />
            <SidebarItem icon={<Umbrella size={18} />} label="Leave" active={currentView === 'leave'} onClick={() => onViewChange('leave')} darkMode={darkMode} collapsed={collapsed} />
            <SidebarItem icon={<Briefcase size={18} />} label="Projects" active={currentView === 'projects'} onClick={() => onViewChange('projects')} darkMode={darkMode} collapsed={collapsed} />
            <SidebarItem icon={<Activity size={18} />} label="Live Tracking" active={currentView === 'live-tracking'} onClick={() => onViewChange('live-tracking')} darkMode={darkMode} collapsed={collapsed} />
            <SidebarItem icon={<Folder size={18} />} label="File Manager" active={currentView === 'file-manager'} onClick={() => onViewChange('file-manager')} darkMode={darkMode} collapsed={collapsed} />
          </nav>
        )}

        {/* ===== ADMIN SPECIFIC ITEMS ===== */}
        {isAdmin && (
          <>
            <div className="mt-8 mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ${collapsed ? 'text-center' : ''}`}>
                {collapsed ? '...' : 'Administration'}
              </p>
              <div 
                onClick={() => onViewChange('file-manager')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'file-manager' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <Folder size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">File Manager</span>}
              </div>
            </div>

            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? '...' : 'Track'}
            </p>
            <nav className="space-y-1">
              <div 
                onClick={() => onViewChange('live-tracking')}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${currentView === 'live-tracking' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Activity size={18} className="shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">Live Tracking</span>}
                </div>
                {!collapsed && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>}
              </div>
              <div 
                onClick={() => onViewChange('leave')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'leave' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <Umbrella size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Leave</span>}
              </div>
              <div 
                onClick={() => onViewChange('attendance')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'attendance' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <UserCheck size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Attendance</span>}
              </div>
            </nav>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Manage</p>
            <nav className="space-y-1">
              <div 
                onClick={() => onViewChange('projects')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'projects' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <Briefcase size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Projects</span>}
              </div>
            </nav>

            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? '...' : 'Workforce'}
            </p>
            <nav className="space-y-1">
              <div 
                onClick={() => onViewChange('employees')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'employees' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <User size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Employees</span>}
              </div>
              <div 
                onClick={() => onViewChange('teams')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'teams' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <Users size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Teams</span>}
              </div>
              <div 
                onClick={() => onViewChange('clients')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'clients' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <Users size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Clients</span>}
              </div>
              <div 
                onClick={() => onViewChange('activity-logs')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'activity-logs' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
              >
                <List size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Activity Logs</span>}
              </div>
            </nav>
          </>
        )}


        {!isAuthenticated && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Authentication</p>
            <nav className="space-y-1">
              <div 
                onClick={() => onViewChange('register')}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${currentView === 'register' ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')}`}
              >
                <UserPlus size={18} />
                <span className="text-sm font-medium">Register</span>
              </div>
            </nav>
          </>
        )}

        {isAdmin && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Administrator</p>
            <nav className="space-y-1">
              <div 
                className={`flex items-center justify-between p-2 rounded-lg opacity-50 cursor-not-allowed ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList size={18} />
                  <span className="text-sm font-medium">Reports</span>
                </div>
                <div className="bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Locked
                </div>
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

function SidebarItem({ 
  icon, 
  label, 
  active = false, 
  onClick, 
  darkMode = false,
  collapsed = false
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onClick?: () => void, 
  darkMode?: boolean,
  collapsed?: boolean
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${active ? (darkMode ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-black' : 'text-gray-600 hover:bg-white')} ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? label : ''}
    >
      <div className="shrink-0">{icon}</div>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
