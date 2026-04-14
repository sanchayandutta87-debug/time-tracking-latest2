import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, Calendar, FileText, Folder, 
  Notebook, CheckSquare, Kanban, Users, Mail, Phone, Video, 
  Mic, ChevronDown, ChevronRight, Box, Activity, Umbrella, 
  UserCheck, Receipt, Briefcase, FileCheck, Camera, Download, Clock,
  UserPlus, History, User, List, Bell, ClipboardList, Settings,
  Network, Orbit, SquarePen, LayoutGrid, PieChart, Shapes, Map
} from 'lucide-react';

export default function Sidebar({ currentView, onViewChange }: { currentView: string, onViewChange: (view: string) => void }) {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isBaseUIOpen, setIsBaseUIOpen] = useState(false);

  const reportSubItems = [
    { label: 'Reports', view: 'report-main' },
    { label: 'Timesheets', view: 'report-timesheets' },
    { label: 'Attendance', view: 'report-attendance' },
    { label: 'Activity Summary', view: 'report-activity-summary' },
    { label: 'Unusual Activity', view: 'report-unusual-activity' },
    { label: 'Hours Tracked', view: 'report-hours-tracked' },
    { label: 'Projects & Tasks', view: 'report-projects-tasks' },
    { label: 'Timeline', view: 'report-timeline' },
    { label: 'Manual Time', view: 'report-manual-time' },
    { label: 'Poor Time Use', view: 'report-poor-time-use' },
    { label: 'Web & App Usage', view: 'report-web-app-usage' },
    { label: 'Low Activity', view: 'report-low-activity' },
    { label: 'Idle Time', view: 'report-idle-time' },
    { label: 'Overtime Limit', view: 'report-overtime-limit' },
    { label: 'Working on Weekends', view: 'report-working-weekends' },
    { label: 'Expense Report', view: 'report-expense' },
  ];

  const baseUISubItems = [
    { label: 'Accordion', view: 'ui-accordion' },
    { label: 'Alerts', view: 'ui-alerts' },
    { label: 'Avatar', view: 'ui-avatar' },
    { label: 'Badges', view: 'ui-badges' },
    { label: 'Breadcrumb', view: 'ui-breadcrumb' },
    { label: 'Buttons', view: 'ui-buttons' },
    { label: 'Button Group', view: 'ui-button-group' },
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
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main</p>
        <nav className="space-y-1">
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
            <ChevronRight size={14} />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Applications</span>
              </div>
              <ChevronDown size={14} />
            </div>
            
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
              <NavItem label="Projects" active={currentView === 'projects'} onClick={() => onViewChange('projects')} />
              <NavItem label="Chat" active={currentView === 'chat'} onClick={() => onViewChange('chat')} />
              <NavItem label="Calendar" active={currentView === 'calendar'} onClick={() => onViewChange('calendar')} />
              <NavItem label="Invoices" active={currentView === 'invoices'} onClick={() => onViewChange('invoices')} />
              <NavItem label="File Manager" active={currentView === 'file-manager'} onClick={() => onViewChange('file-manager')} />
              <NavItem label="Notes" active={currentView === 'notes'} onClick={() => onViewChange('notes')} />
              <NavItem label="To Do" active={currentView === 'todo'} onClick={() => onViewChange('todo')} />
              <NavItem label="Kanban Board" active={currentView === 'kanban'} onClick={() => onViewChange('kanban')} />
              <NavItem label="Social Feed" active={currentView === 'social'} onClick={() => onViewChange('social')} />
              <NavItem label="Email" active={currentView === 'email'} onClick={() => onViewChange('email')} />
              <NavItem label="Contacts" active={currentView === 'contacts'} onClick={() => onViewChange('contacts')} />
              <NavItem label="Video Call" active={currentView === 'video-call'} onClick={() => onViewChange('video-call')} />
              <NavItem label="Voice Call" active={currentView === 'voice-call'} onClick={() => onViewChange('voice-call')} />
            </div>
          </div>
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Layouts</span>
            </div>
            <ChevronDown size={14} />
          </div>
          
          <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
            <div 
              onClick={() => onViewChange('mini-sidebar')}
              className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'mini-sidebar' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentView === 'mini-sidebar' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
              <span className={`${currentView === 'mini-sidebar' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
              <span className="text-sm">Mini Sidebar</span>
            </div>
            <div 
              onClick={() => onViewChange('hover-view')}
              className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'hover-view' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentView === 'hover-view' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
              <span className={`${currentView === 'hover-view' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
              <span className="text-sm">Hover View</span>
            </div>
            <div 
              onClick={() => onViewChange('hidden-menu')}
              className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'hidden-menu' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentView === 'hidden-menu' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
              <span className={`${currentView === 'hidden-menu' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
              <span className="text-sm">Hidden Menu</span>
            </div>
            <div 
              onClick={() => onViewChange('full-width')}
              className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'full-width' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentView === 'full-width' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
              <span className={`${currentView === 'full-width' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
              <span className="text-sm">Full Width</span>
            </div>
            <div 
              onClick={() => onViewChange('rtl-support')}
              className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'rtl-support' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentView === 'rtl-support' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
              <span className={`${currentView === 'rtl-support' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
              <span className="text-sm">RTL Support</span>
            </div>
            <div 
              onClick={() => onViewChange('dark-mode')}
              className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'dark-mode' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentView === 'dark-mode' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
              <span className={`${currentView === 'dark-mode' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
              <span className="text-sm">Dark Mode</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div 
            onClick={() => onViewChange('saas-landing')}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${currentView === 'saas-landing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <Box size={18} />
              <span className="text-sm font-medium">Saas Landing</span>
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Track</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('live-tracking')}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${currentView === 'live-tracking' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-3">
              <Activity size={18} />
              <span className="text-sm font-medium">Live Tracking</span>
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          </div>
          <div 
            onClick={() => onViewChange('timesheet')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'timesheet' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Calendar size={18} />
            <span className="text-sm font-medium">Timesheet</span>
          </div>
          <div 
            onClick={() => onViewChange('leave')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'leave' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Umbrella size={18} />
            <span className="text-sm font-medium">Leave</span>
          </div>
          <div 
            onClick={() => onViewChange('attendance')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'attendance' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <UserCheck size={18} />
            <span className="text-sm font-medium">Attendance</span>
          </div>
          <div 
            onClick={() => onViewChange('expense')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'expense' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Receipt size={18} />
            <span className="text-sm font-medium">Expense</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Manage</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('manage-projects')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'manage-projects' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Briefcase size={18} />
            <span className="text-sm font-medium">Projects</span>
          </div>
          <div 
            onClick={() => onViewChange('tasks')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'tasks' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <FileCheck size={18} />
            <span className="text-sm font-medium">Tasks</span>
          </div>
          <div 
            onClick={() => onViewChange('screenshots')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'screenshots' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Camera size={18} />
            <span className="text-sm font-medium">Screenshots</span>
          </div>
          <div 
            onClick={() => onViewChange('edit-time')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'edit-time' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Clock size={18} />
            <span className="text-sm font-medium">Edit Time</span>
          </div>
          <div 
            onClick={() => onViewChange('download')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'download' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Download</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Workforce</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('employees')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'employees' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <User size={18} />
            <span className="text-sm font-medium">Employees</span>
          </div>
          <div 
            onClick={() => onViewChange('teams')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'teams' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Users size={18} />
            <span className="text-sm font-medium">Teams</span>
          </div>
          <div 
            onClick={() => onViewChange('clients')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'clients' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Users size={18} />
            <span className="text-sm font-medium">Clients</span>
          </div>
          <div className="mt-1">
            <div 
              onClick={() => onViewChange('user-management')}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${currentView.startsWith('user-') || currentView === 'roles-permissions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <UserPlus size={18} />
                <span className="text-sm font-medium">User</span>
              </div>
              <ChevronDown size={14} />
            </div>
            
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
              <div 
                onClick={() => onViewChange('user-list')}
                className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'user-list' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {currentView === 'user-list' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
                <span className={`${currentView === 'user-list' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
                <span className="text-sm">User</span>
              </div>
              <div 
                onClick={() => onViewChange('roles-permissions')}
                className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === 'roles-permissions' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {currentView === 'roles-permissions' && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
                <span className={`${currentView === 'roles-permissions' ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
                <span className="text-sm">Roles & Permission</span>
              </div>
            </div>
          </div>
          <div 
            onClick={() => onViewChange('activity-logs')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'activity-logs' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <List size={18} />
            <span className="text-sm font-medium">Activity Logs</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">Administrator</p>
        <nav className="space-y-1">
          <div 
            onClick={() => onViewChange('notifications')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'notifications' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Bell size={18} />
            <span className="text-sm font-medium">Notifications</span>
          </div>
          <div 
            onClick={() => onViewChange('invoices')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'invoices' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <FileText size={18} />
            <span className="text-sm font-medium">Invoices</span>
          </div>
          <div className="mt-1">
            <div 
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${currentView.startsWith('report-') || isReportsOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={18} />
                <span className="text-sm font-medium">Reports</span>
              </div>
              {isReportsOpen || currentView.startsWith('report-') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {(isReportsOpen || currentView.startsWith('report-')) && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                {reportSubItems.map((item) => (
                  <div 
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === item.view ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {currentView === item.view && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
                    <span className={`${currentView === item.view ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
                    <span className={`text-sm ${currentView === item.view ? 'text-blue-600' : ''}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div 
            onClick={() => onViewChange('settings')}
            className={`flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer ${currentView === 'settings' ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">UI Interface</p>
        <nav className="space-y-1">
          <div className="mt-1">
            <div 
              onClick={() => setIsBaseUIOpen(!isBaseUIOpen)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${currentView.startsWith('ui-') || isBaseUIOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Network size={18} />
                <span className="text-sm font-medium">Base UI</span>
              </div>
              {isBaseUIOpen || currentView.startsWith('ui-') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {(isBaseUIOpen || currentView.startsWith('ui-')) && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                {baseUISubItems.map((item) => (
                  <div 
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${currentView === item.view ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {currentView === item.view && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
                    <span className={`${currentView === item.view ? 'text-blue-600' : 'text-gray-300'} font-bold mr-1`}>−</span>
                    <span className={`text-sm ${currentView === item.view ? 'text-blue-600' : ''}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Orbit size={18} />
              <span className="text-sm font-medium">Advanced UI</span>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <SquarePen size={18} />
              <span className="text-sm font-medium">Forms</span>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <LayoutGrid size={18} />
              <span className="text-sm font-medium">Tables</span>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <PieChart size={18} />
              <span className="text-sm font-medium">Charts</span>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Shapes size={18} />
              <span className="text-sm font-medium">Icons</span>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Map size={18} />
              <span className="text-sm font-medium">Widgets</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function LayoutSubItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-2 pl-6 cursor-pointer text-gray-500 hover:text-gray-700">
      <span className="text-gray-300 font-bold mr-1">−</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function NavItem({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-2 pl-6 cursor-pointer relative ${active ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {active && <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full" />}
      <span className="text-sm">{label}</span>
    </div>
  );
}
