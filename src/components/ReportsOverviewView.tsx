import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Clock, Calendar, Activity, ShieldAlert, 
  Hourglass, CheckSquare, Layout, MousePointer2, Globe, 
  ZapOff, Moon, FileText, Search, Filter, ArrowUpRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAppContext } from '../context/AppContext';
import { attendanceData } from './AttendanceReportView';
import { unusualActivityData } from './UnusualActivityView';
import { hoursTrackedData } from './HoursTrackedView';
import { timelineData } from './TimelineReportView';
import { poorTimeData } from './PoorTimeUseView';
import { lowActivityData } from './LowActivityView';
import { idleTimeData } from './IdleTimeReportView';
import { overtimeData } from './OvertimeLimitView';
import { weekendWorkData } from './WorkingOnWeekendsView';
import { supabase } from '../utils/supabase';

const reportTypes = [
  {
    title: 'Timesheet Report',
    description: 'Tracks and summarizes employees working hours Over period.',
    icon: <Clock size={18} />,
    category: 'Attendance',
    viewId: 'report-timesheets'
  },
  {
    title: 'Attendance',
    description: 'Track employee presence, late check-ins, absences & workhours.',
    icon: <Calendar size={18} />,
    category: 'Attendance',
    viewId: 'report-attendance'
  },

  {
    title: 'Unusual Activity',
    description: 'Tracks anomalies in employee work patterns or security events.',
    icon: <ShieldAlert size={18} />,
    category: 'Security',
    viewId: 'report-unusual-activity'
  },
  {
    title: 'Hours Tracked',
    description: 'Tracking project progress and time spent.',
    icon: <Hourglass size={18} />,
    category: 'Projects',
    viewId: 'report-hours-tracked'
  },
  {
    title: 'Projects',
    description: 'Tracking project progress and time spent.',
    icon: <CheckSquare size={18} />,
    category: 'Projects',
    viewId: 'projects'
  },

  {
    title: 'Timeline',
    description: 'Perfect for tracking milestones, deadlines and progress.',
    icon: <Layout size={18} />,
    category: 'Projects',
    viewId: 'report-timeline'
  },
  {
    title: 'Poor Time Use',
    description: 'Waste time on unproductive tasks, distractions and inefficiency.',
    icon: <Clock size={18} />,
    category: 'Performance',
    viewId: 'report-poor-time-use'
  },

  {
    title: 'Low Activity',
    description: 'Indicates minimal engagement or productivity in situations.',
    icon: <ZapOff size={18} />,
    category: 'Performance',
    viewId: 'report-low-activity'
  },
  {
    title: 'Idle Time',
    description: 'Periods of inactivity or unproductive moments.',
    icon: <Moon size={18} />,
    category: 'Performance',
    viewId: 'report-idle-time'
  },
  {
    title: 'Overtime Limit',
    description: 'Maximum hours worked beyond regular schedule.',
    icon: <Clock size={18} />,
    category: 'Attendance',
    viewId: 'report-overtime-limit'
  },
  {
    title: 'Working on Weekends',
    description: 'Involves Employee outside the typical Monday-Friday schedule.',
    icon: <Calendar size={18} />,
    category: 'Attendance',
    viewId: 'report-weekend-work'
  },

];

export default function ReportsOverviewView({ onViewChange }: { onViewChange?: (view: string) => void }) {
  const { darkMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleGeneratePDF = async (e: React.MouseEvent, reportTitle: string) => {
    e.stopPropagation();
    
    if (reportTitle === 'Attendance') {
      // Fetch live data for PDF
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          users:user_id (
            full_name
          )
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching data for PDF:', error);
        alert('Failed to fetch data for PDF.');
        return;
      }

      const formattedData = (data || []).map(record => {
        const user = record.users as any;
        const checkInTime = record.check_in ? new Date(record.check_in) : null;
        const checkOutTime = record.check_out ? new Date(record.check_out) : null;
        
        let totalWorkedStr = '00h 00m 00s';
        if (checkInTime && checkOutTime) {
          const diffMs = checkOutTime.getTime() - checkInTime.getTime();
          let totalSeconds = Math.floor(diffMs / 1000);
          if (record.break_time === '01h 00m') totalSeconds = Math.max(0, totalSeconds - 3600);

          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          totalWorkedStr = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        }

        const formatTime = (dateStr: string | null) => {
          if (!dateStr) return '--:--';
          return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        };

        return {
          name: user?.full_name || 'Unknown',
          shiftStart: record.shift_start || '09:00 AM',
          shiftEnd: record.shift_end || '06:00 PM',
          minHours: record.min_hours || '08h 00m',
          actualWorked: totalWorkedStr,
          breakTime: record.break_time || '00h 00m',
          attendanceStatus: record.is_late ? 'Late' : (record.check_in ? 'Present' : 'Absent')
        };
      });

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Attendance Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(37, 99, 235); // blue-600
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Shift Start', 45, 42);
      doc.text('Shift End', 70, 42);
      doc.text('Min Hours', 95, 42);
      doc.text('Actual Hours', 120, 42);
      doc.text('Break Time', 150, 42);
      doc.text('Status', 175, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      formattedData.forEach((record, index) => {
        // Background for alternating rows
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); // gray-50
          doc.rect(14, yPos - 6, 182, 12, 'F');
        }
        
        let shortName = record.name;
        if (shortName.length > 15) shortName = shortName.substring(0, 15) + '...';
        
        doc.text(shortName, 16, yPos);
        doc.text(record.shiftStart, 45, yPos);
        doc.text(record.shiftEnd, 70, yPos);
        doc.text(record.minHours, 95, yPos);
        doc.text(record.actualWorked, 120, yPos);
        doc.text(record.breakTime, 150, yPos);
        
        // Status Colors
        if (record.attendanceStatus === 'Present') {
          doc.setTextColor(16, 185, 129); // emerald
        } else if (record.attendanceStatus === 'Absent') {
          doc.setTextColor(239, 68, 68); // red
        } else if (record.attendanceStatus === 'Late') {
          doc.setTextColor(245, 158, 11); // amber
        } else {
          doc.setTextColor(59, 130, 246); // blue
        }
        
        doc.text(record.attendanceStatus.toUpperCase(), 175, yPos);
        doc.setTextColor(33, 37, 41); // reset
        
        yPos += 12;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Unusual Activity') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Unusual Activity Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(220, 38, 38); // red-600 for security
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Severity', 50, 42);
      doc.text('Activity', 80, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      unusualActivityData.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, 16, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        
        // Color code severity
        if (record.severity === 'High') {
          doc.setTextColor(220, 38, 38); // Red
        } else if (record.severity === 'Medium') {
          doc.setTextColor(234, 88, 12); // Orange
        } else {
          doc.setTextColor(37, 99, 235); // Blue
        }
        doc.text(record.severity, 50, yPos);
        
        doc.setTextColor(33, 37, 41);
        
        // Split text for activity to prevent overflow
        const splitActivity = doc.splitTextToSize(record.activity, 110);
        doc.text(splitActivity, 80, yPos);
        
        yPos += 16;
        
        // Handle page break
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Unusual_Activity_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Hours Tracked') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Hours Tracked Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(37, 99, 235); // blue-600
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Date', 16, 42);
      doc.text('Project', 45, 42);
      doc.text('Details', 95, 42);
      doc.text('Time Tracked', 145, 42);
      doc.text('Productivity', 175, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      hoursTrackedData.forEach((record, index) => {
        const splitProject = doc.splitTextToSize(record.project, 45);
        const splitTask = doc.splitTextToSize(record.task, 45);
        const maxLines = Math.max(splitProject.length, splitTask.length);
        const rowHeight = maxLines * 5 + 7;
        
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, rowHeight, 'F');
        }
        
        doc.text(record.date, 16, yPos);
        doc.text(splitProject, 45, yPos);
        doc.text(splitTask, 95, yPos);
        doc.text(record.timeTracked, 145, yPos);
        
        // Color coding productivity
        if (record.activePercentage >= 80) {
          doc.setTextColor(16, 185, 129); // emerald-500
        } else if (record.activePercentage >= 60) {
          doc.setTextColor(245, 158, 11); // amber-500
        } else {
          doc.setTextColor(239, 68, 68); // red-500
        }
        doc.text(`${record.activePercentage}% Active`, 175, yPos);
        doc.setTextColor(33, 37, 41); // reset
        
        yPos += rowHeight;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Hours_Tracked_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Timeline') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Timeline & Progress Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(37, 99, 235); // blue-600
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Project', 50, 42);
      doc.text('Milestone', 95, 42);
      doc.text('Deadline', 140, 42);
      doc.text('Worked', 175, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      timelineData.forEach((record, index) => {
        const splitProject = doc.splitTextToSize(record.project, 40);
        const splitMilestone = doc.splitTextToSize(record.milestone, 40);
        const maxLines = Math.max(splitProject.length, splitMilestone.length);
        const rowHeight = maxLines * 5 + 7;
        
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, rowHeight, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        doc.text(splitProject, 50, yPos);
        doc.text(splitMilestone, 95, yPos);
        
        // Color coding deadline
        doc.setTextColor(239, 68, 68); // Red
        doc.text(record.deadline, 140, yPos);
        
        doc.setTextColor(33, 37, 41); // reset
        doc.text(record.timeWorked, 175, yPos);
        
        yPos += rowHeight;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Timeline_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Poor Time Use') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Poor Time Use Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(249, 115, 22); // orange-500
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Distraction', 50, 42);
      doc.text('Category', 95, 42);
      doc.text('Severity', 140, 42);
      doc.text('Wasted Time', 170, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      poorTimeData.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, 12, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        doc.text(record.website, 50, yPos);
        doc.text(record.category, 95, yPos);
        
        // Color coding severity
        if (record.severity === 'High') {
          doc.setTextColor(220, 38, 38); // Red
        } else if (record.severity === 'Medium') {
          doc.setTextColor(234, 88, 12); // Orange
        } else {
          doc.setTextColor(37, 99, 235); // Blue
        }
        doc.text(record.severity, 140, yPos);
        
        doc.setTextColor(33, 37, 41); // reset
        doc.text(record.duration, 170, yPos);
        
        yPos += 12;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Poor_Time_Use_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Low Activity') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Low Activity Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(71, 85, 105); // slate-600
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Status', 70, 42);
      doc.text('Activity Level', 110, 42);
      doc.text('Total Time', 165, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      lowActivityData.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, 12, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        
        // Status color
        if (record.status === 'online') {
          doc.setTextColor(16, 185, 129); // emerald-500
        } else {
          doc.setTextColor(239, 68, 68); // red-500
        }
        doc.text(record.status, 70, yPos);
        doc.setTextColor(33, 37, 41);
        
        // Activity Color
        if (record.percentage < 10) {
          doc.setTextColor(239, 68, 68); // red
        } else if (record.percentage < 20) {
          doc.setTextColor(245, 158, 11); // amber
        } else {
          doc.setTextColor(59, 130, 246); // blue
        }
        doc.text(`${record.percentage.toFixed(2)}% Active`, 110, yPos);
        doc.setTextColor(33, 37, 41);
        
        doc.text(record.totalTime, 165, yPos);
        
        yPos += 12;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Low_Activity_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Idle Time') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Idle Time & Inactivity Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(15, 23, 42); // slate-900 (dark navy)
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Status', 70, 42);
      doc.text('Total Idle Time', 110, 42);
      doc.text('Idle Sessions', 160, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      idleTimeData.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, 12, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        
        // Status
        if (record.status === 'online') {
          doc.setTextColor(16, 185, 129); // emerald-500
        } else {
          doc.setTextColor(239, 68, 68); // red-500
        }
        doc.text(record.status, 70, yPos);
        doc.setTextColor(33, 37, 41);
        
        // Idle Time coloring based on length
        const hours = parseInt(record.totalIdleTime.split('h')[0]);
        if (hours >= 8) {
          doc.setTextColor(239, 68, 68); // Red for very high idle
        } else if (hours >= 5) {
          doc.setTextColor(245, 158, 11); // Amber for medium
        }
        doc.text(record.totalIdleTime, 110, yPos);
        doc.setTextColor(33, 37, 41);
        
        doc.text(`${record.sessions.length} sessions`, 160, yPos);
        
        yPos += 12;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Idle_Time_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Overtime Limit') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Overtime Limit Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(79, 70, 229); // indigo-600
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Severity', 70, 42);
      doc.text('Total Overtime', 115, 42);
      doc.text('Overtime Sessions', 160, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      overtimeData.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, 12, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        
        // Severity color
        if (record.severity === 'high') {
          doc.setTextColor(220, 38, 38); // red
        } else if (record.severity === 'medium') {
          doc.setTextColor(234, 88, 12); // orange
        } else {
          doc.setTextColor(37, 99, 235); // blue
        }
        doc.text(record.severity.toUpperCase(), 70, yPos);
        doc.setTextColor(33, 37, 41);
        
        doc.text(record.totalOvertime, 115, yPos);
        doc.text(`${record.sessions.length} sessions`, 160, yPos);
        
        yPos += 12;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Overtime_Limit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportTitle === 'Working on Weekends') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Working on Weekends Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Generated on: ${today}`, 14, 28);
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(59, 130, 246); // blue-500
      doc.rect(14, 35, 182, 10, 'F');
      
      doc.text('Name', 16, 42);
      doc.text('Status', 70, 42);
      doc.text('Compliance', 105, 42);
      doc.text('Total Time', 140, 42);
      doc.text('Weekend Sessions', 170, 42);
      
      // Table Rows
      doc.setTextColor(33, 37, 41);
      let yPos = 52;
      
      weekendWorkData.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); 
          doc.rect(14, yPos - 6, 182, 12, 'F');
        }
        
        doc.text(record.name, 16, yPos);
        
        // Status color
        if (record.status === 'online') {
          doc.setTextColor(16, 185, 129); // emerald-500
        } else {
          doc.setTextColor(239, 68, 68); // red-500
        }
        doc.text(record.status, 70, yPos);
        doc.setTextColor(33, 37, 41);
        
        // Compliance color
        if (record.compliance === 'compliant') {
          doc.setTextColor(16, 185, 129); // emerald
        } else {
          doc.setTextColor(245, 158, 11); // amber
        }
        doc.text(record.compliance.toUpperCase(), 105, yPos);
        doc.setTextColor(33, 37, 41);
        
        doc.text(record.totalTime, 140, yPos);
        doc.text(`${record.sessions.length} sessions`, 170, yPos);
        
        yPos += 12;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      doc.save(`Weekend_Work_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } else {
      alert(`PDF Generation for ${reportTitle} is not yet implemented.`);
    }
  };


  const categories = ['All', 'Attendance', 'Performance', 'Projects', 'Security'];

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: '0h',
    activeProjects: 0,
    teamEfficiency: '92%',
    pendingReports: 0
  });

  const fetchSummaryStats = async () => {
    setIsLoading(true);
    try {
      const { data: entries, error: entError } = await supabase
        .from('time_entries')
        .select('duration_seconds, project_id');

      if (entError) throw entError;

      const totalSec = (entries || []).reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
      const projectIds = new Set((entries || []).map(e => e.project_id).filter(Boolean));

      setStats({
        totalHours: `${Math.floor(totalSec / 3600)}h`,
        activeProjects: projectIds.size,
        teamEfficiency: '94%', // Placeholder for complex calc
        pendingReports: 3
      });
    } catch (err) {
      console.error('Summary stats error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryStats();
  }, []);

  const filteredReports = reportTypes.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || report.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tracked</p>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalHours}</h3>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Projects</p>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.activeProjects}</h3>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Efficiency</p>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.teamEfficiency}</h3>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Review</p>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.pendingReports}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-8 transition-colors duration-500`}>
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                darkMode ? 'bg-black border-gray-800 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
            <Filter size={16} className="text-gray-400 mr-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map((report, index) => (
          <div 
            key={index} 
            onClick={() => report.viewId && onViewChange && onViewChange(report.viewId)}
            className={`group p-6 rounded-xl border shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden ${
              darkMode ? 'bg-black border-gray-800 hover:border-blue-900 hover:shadow-blue-900/10' : 'bg-white border-gray-100 hover:shadow-xl hover:border-blue-100'
            }`}
          >
            {/* Hover Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-bold group-hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>{report.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{report.category}</span>
              </div>
              <ArrowUpRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
            </div>
            
            <p className={`text-xs leading-relaxed line-clamp-2 transition-colors ${darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}`}>
              {report.description}
            </p>

            <div 
              className={`mt-6 pt-4 border-t flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}
              onClick={(e) => handleGeneratePDF(e, report.title)}
            >
              <span className="text-[10px] font-bold text-blue-600 uppercase">Generate Report</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-5 h-5 rounded-full border-2 bg-gray-200 ${darkMode ? 'border-black' : 'border-white'}`} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className={`text-center py-20 rounded-xl border border-dashed ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Search size={24} className="text-gray-300" />
          </div>
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>No reports found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-6 text-blue-600 text-sm font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
