/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ProjectTable from './components/ProjectTable';
import ChatView from './components/ChatView';
import CalendarView from './components/CalendarView';
import InvoicesView from './components/InvoicesView';
import FileManagerView from './components/FileManagerView';
import NotesView from './components/NotesView';
import TodoView from './components/TodoView';
import KanbanView from './components/KanbanView';
import SocialFeedView from './components/SocialFeedView';
import EmailView from './components/EmailView';
import ContactsView from './components/ContactsView';
import VideoCallView from './components/VideoCallView';
import VoiceCallView from './components/VoiceCallView';
import SaasLandingView from './components/SaasLandingView';
import AdminDashboardView from './components/AdminDashboardView';
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
import UserListView from './components/UserListView';
import RolesPermissionsView from './components/RolesPermissionsView';
import ActivityLogsView from './components/ActivityLogsView';
import NotificationsView from './components/NotificationsView';
import ReportsOverviewView from './components/ReportsOverviewView';
import TimeSheetReportView from './components/TimeSheetReportView';
import AttendanceReportView from './components/AttendanceReportView';
import ActivitySummaryView from './components/ActivitySummaryView';
import UnusualActivityView from './components/UnusualActivityView';
import HoursTrackedView from './components/HoursTrackedView';
import ProjectsTasksReportView from './components/ProjectsTasksReportView';
import TimelineReportView from './components/TimelineReportView';
import ManualTimeReportView from './components/ManualTimeReportView';
import PoorTimeUseView from './components/PoorTimeUseView';
import WebAppUsageView from './components/WebAppUsageView';
import LowActivityView from './components/LowActivityView';
import IdleTimeReportView from './components/IdleTimeReportView';
import OvertimeLimitView from './components/OvertimeLimitView';
import WorkingOnWeekendsView from './components/WorkingOnWeekendsView';
import ExpenseReportView from './components/ExpenseReportView';
import SettingsView from './components/SettingsView';
import ScreenshotsView from './components/ScreenshotsView';
import EditTimeView from './components/EditTimeView';
import DownloadView from './components/DownloadView';
import AccordionView from './components/AccordionView';
import AlertsView from './components/AlertsView';
import AvatarView from './components/AvatarView';
import BadgesView from './components/BadgesView';
import BreadcrumbView from './components/BreadcrumbView';
import ButtonsView from './components/ButtonsView';
import ButtonGroupView from './components/ButtonGroupView';
import { Search, Plus, Box, Users, UserCheck, UserPlus, List, Grid, ChevronRight, Menu, Bell, Moon, Globe, Settings as SettingsIcon } from 'lucide-react';

const stats = [
  { title: 'Total Projects', value: '2520', change: '+15.2%', color: '#3b82f6', icon: <Box size={18} />, data: [{value: 10}, {value: 20}, {value: 15}, {value: 30}, {value: 25}, {value: 35}] },
  { title: 'Active', value: '2502', change: '+11.3%', color: '#f59e0b', icon: <Users size={18} />, data: [{value: 10}, {value: 15}, {value: 12}, {value: 25}, {value: 20}, {value: 30}] },
  { title: 'InProgress', value: '350', change: '+13.5%', color: '#3b82f6', icon: <UserCheck size={18} />, data: [{value: 5}, {value: 15}, {value: 10}, {value: 20}, {value: 18}, {value: 25}] },
  { title: 'Completed', value: '170', change: '-1.2%', color: '#10b981', icon: <UserPlus size={18} />, data: [{value: 5}, {value: 8}, {value: 6}, {value: 12}, {value: 10}, {value: 15}] },
];

export default function App() {
  const [currentView, setCurrentView] = useState('projects');

  return (
    <div className={`flex min-h-screen font-sans ${currentView === 'dark-mode' ? 'bg-[#0a0a1a] text-white' : 'bg-gray-50 text-gray-900'}`} dir={currentView === 'rtl-support' ? 'rtl' : 'ltr'}>
      {currentView !== 'hidden-menu' && currentView !== 'full-width' && currentView !== 'rtl-support' && currentView !== 'dark-mode' && currentView !== 'saas-landing' && (
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      )}
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        {currentView !== 'saas-landing' && (
          <header className={`${currentView === 'dark-mode' ? 'bg-[#0a0a1a] border-gray-800' : 'bg-white border-gray-100'} border-b h-16 flex items-center justify-between px-6 shrink-0`}>
            <div className="flex items-center gap-4 flex-1">
              {(currentView === 'hidden-menu' || currentView === 'full-width' || currentView === 'rtl-support' || currentView === 'dark-mode') && (
                <div className={`flex items-center gap-2 ${currentView === 'rtl-support' ? 'ml-4' : 'mr-4'}`}>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Box size={20} />
                  </div>
                  <span className={`text-lg font-bold ${currentView === 'dark-mode' ? 'text-white' : 'text-gray-800'}`}>Dreams Timer</span>
                </div>
              )}
              <button 
                onClick={() => (currentView === 'hidden-menu' || currentView === 'full-width' || currentView === 'rtl-support' || currentView === 'dark-mode') && setCurrentView('mini-sidebar')}
                className={`p-2 rounded-lg ${currentView === 'dark-mode' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <Menu size={20} />
              </button>
              <div className="relative w-64">
                <Search className={`absolute ${currentView === 'rtl-support' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
                <input 
                  type="text" 
                  placeholder="Search Keyword" 
                  className={`w-full border rounded-lg py-2 ${currentView === 'rtl-support' ? 'pr-10 pl-16' : 'pl-10 pr-16'} text-sm outline-none focus:ring-1 focus:ring-blue-500 ${currentView === 'dark-mode' ? 'bg-[#15152b] border-gray-800 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-100 text-gray-900'}`} 
                />
                <span className={`absolute ${currentView === 'rtl-support' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[10px] font-bold border px-1.5 py-0.5 rounded uppercase ${currentView === 'dark-mode' ? 'text-gray-400 border-gray-700 bg-[#0a0a1a]' : 'text-gray-400 border-gray-200 bg-white'}`}>ctrl + K</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className={`p-2 rounded-lg relative ${currentView === 'dark-mode' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}>
                <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-5 h-auto rounded-sm" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
              <button className={`p-2 rounded-lg ${currentView === 'dark-mode' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}>
                <Moon size={20} />
              </button>
              <button className={`p-2 rounded-lg relative ${currentView === 'dark-mode' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}>
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
              <div className={`w-8 h-8 rounded-full border overflow-hidden cursor-pointer ${currentView === 'dark-mode' ? 'border-gray-800' : 'border-gray-200'}`}>
                <img src="https://picsum.photos/seed/james/40/40" alt="User" referrerPolicy="no-referrer" />
              </div>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${currentView === 'saas-landing' ? 'p-0' : 'p-8'}`}>
          {currentView === 'projects' ? (
            <ManageProjectsView />
          ) : currentView === 'chat' ? (
            <ChatView />
          ) : currentView === 'calendar' ? (
            <CalendarView />
          ) : currentView === 'invoices' ? (
            <InvoicesView />
          ) : currentView === 'file-manager' ? (
            <FileManagerView />
          ) : currentView === 'notes' ? (
            <NotesView />
          ) : currentView === 'todo' ? (
            <TodoView />
          ) : currentView === 'kanban' ? (
            <KanbanView />
          ) : currentView === 'social' ? (
            <SocialFeedView />
          ) : currentView === 'email' ? (
            <EmailView />
          ) : currentView === 'contacts' ? (
            <ContactsView />
          ) : currentView === 'video-call' ? (
            <VideoCallView />
          ) : currentView === 'voice-call' ? (
            <VoiceCallView />
          ) : currentView === 'saas-landing' ? (
            <SaasLandingView />
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
          ) : currentView === 'user-list' ? (
            <UserListView />
          ) : currentView === 'roles-permissions' ? (
            <RolesPermissionsView />
          ) : currentView === 'activity-logs' ? (
            <ActivityLogsView />
          ) : currentView === 'notifications' ? (
            <NotificationsView />
          ) : currentView === 'report-main' ? (
            <ReportsOverviewView />
          ) : currentView === 'report-timesheets' ? (
            <TimeSheetReportView />
          ) : currentView === 'report-attendance' ? (
            <AttendanceReportView />
          ) : currentView === 'report-activity-summary' ? (
            <ActivitySummaryView />
          ) : currentView === 'report-unusual-activity' ? (
            <UnusualActivityView />
          ) : currentView === 'report-hours-tracked' ? (
            <HoursTrackedView />
          ) : currentView === 'report-projects-tasks' ? (
            <ProjectsTasksReportView />
          ) : currentView === 'report-timeline' ? (
            <TimelineReportView />
          ) : currentView === 'report-manual-time' ? (
            <ManualTimeReportView />
          ) : currentView === 'report-poor-time-use' ? (
            <PoorTimeUseView />
          ) : currentView === 'report-web-app-usage' ? (
            <WebAppUsageView />
          ) : currentView === 'report-low-activity' ? (
            <LowActivityView />
          ) : currentView === 'report-idle-time' ? (
            <IdleTimeReportView />
          ) : currentView === 'report-overtime-limit' ? (
            <OvertimeLimitView />
          ) : currentView === 'report-working-weekends' ? (
            <WorkingOnWeekendsView />
          ) : currentView === 'report-expense' ? (
            <ExpenseReportView />
          ) : currentView === 'settings' ? (
            <SettingsView />
          ) : currentView === 'ui-accordion' ? (
            <div className="p-8">
              <AccordionView />
            </div>
          ) : currentView === 'ui-alerts' ? (
            <div className="p-8">
              <AlertsView />
            </div>
          ) : currentView === 'ui-avatar' ? (
            <div className="p-8">
              <AvatarView />
            </div>
          ) : currentView === 'ui-badges' ? (
            <div className="p-8">
              <BadgesView />
            </div>
          ) : currentView === 'ui-breadcrumb' ? (
            <div className="p-8">
              <BreadcrumbView />
            </div>
          ) : currentView === 'ui-buttons' ? (
            <div className="p-8">
              <ButtonsView />
            </div>
          ) : currentView === 'ui-button-group' ? (
            <div className="p-8">
              <ButtonGroupView />
            </div>
          ) : currentView.startsWith('ui-') ? (
            <div className="p-8">
               <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-gray-800 capitalize">{currentView.replace('ui-', '').replace('-', ' ')}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>UI Interface</span>
                  <ChevronRight size={14} />
                  <span>Base UI</span>
                  <ChevronRight size={14} />
                  <span className="text-gray-600 capitalize">{currentView.replace('ui-', '').replace('-', ' ')}</span>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{currentView.replace('ui-', '').replace('-', ' ')} Component</h2>
                <p className="text-gray-500">This component is part of the Base UI interface. Detailed documentation and examples will be available soon.</p>
              </div>
            </div>
          ) : currentView === 'user-management' || currentView === 'invoices' || currentView === 'reports' || currentView.startsWith('report-') ? (
            <div className="p-8">
               <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-gray-800 capitalize">{currentView.replace('-', ' ')}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Home</span>
                  <ChevronRight size={14} />
                  <span className="text-gray-600 capitalize">{currentView.replace('-', ' ')}</span>
                </div>
              </div>
              <AdminDashboardView />
            </div>
          ) : currentView === 'mini-sidebar' || currentView === 'hover-view' || currentView === 'hidden-menu' || currentView === 'full-width' || currentView === 'rtl-support' || currentView === 'dark-mode' ? (
            <AdminDashboardView isRTL={currentView === 'rtl-support'} isDarkMode={currentView === 'dark-mode'} />
          ) : (
            <AdminDashboardView />
          )}
        </main>
        
        {/* Floating Settings Button */}
        <button className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all z-50">
          <SettingsIcon size={20} className="animate-spin-slow" />
        </button>
      </div>
    </div>
  );
}
