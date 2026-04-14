import React from 'react';
import { 
  Search, Plus, ChevronRight, Clock, Calendar, 
  CheckCircle2, XCircle, ChevronDown, ArrowUpDown, 
  Trash2, UserPlus, History, FileText, CalendarDays
} from 'lucide-react';

const editStats = [
  { title: 'Edit Hours', value: '59h 25m', color: 'bg-amber-500', icon: <Clock size={18} /> },
  { title: 'Edit Hours Today', value: '02h 15m', color: 'bg-blue-600', icon: <History size={18} /> },
  { title: 'Approved Hours', value: '25h 21m', color: 'bg-emerald-500', icon: <CheckCircle2 size={18} /> },
  { title: 'Rejected Hours', value: '05h 10m', color: 'bg-red-500', icon: <XCircle size={18} /> },
  { title: 'Pending Approval', value: '15h 45m', color: 'bg-sky-500', icon: <Clock size={18} /> },
];

const timeLogs = [
  { start: '12:00 AM', end: '09:10 AM', total: '09h 10m 14s', project: 'Office Management', task: '-Not Working-', action: 'add' },
  { start: '09:10 AM', end: '09:17 AM', total: '00h 07m 21s', project: 'Clinic Management', task: 'Component Creation', action: 'delete' },
  { start: '09:17 AM', end: '11:19 AM', total: '02h 02m 26s', project: 'Chat & Call Mobile App', task: 'New Pages Design', action: 'delete' },
  { start: '11:19 AM', end: '11:30 AM', total: '00h 09m 17s', project: 'Travel Planning Website', task: '-Not Working-', action: 'add' },
  { start: '11:30 AM', end: '02:00 PM', total: '02h 30m 40s', project: 'Travel Planning Website', task: 'New Pages Design', action: 'delete' },
  { start: '02:00 PM', end: '02:30 PM', total: '00h 30m 15s', project: 'Travel Planning Website', task: '-Not Working-', action: 'add' },
  { start: '02:30 PM', end: '05:30 PM', total: '03h 00m 35s', project: 'Food Order App', task: 'New Pages Design', action: 'delete' },
  { start: '05:30 PM', end: '05:45 PM', total: '00h 15m 10s', project: 'Food Order App', task: '-Not Working-', action: 'add' },
  { start: '05:45 PM', end: '07:59 PM', total: '02h 14m 14s', project: 'Food Order App', task: 'New Pages Design', action: 'delete' },
  { start: '07:59 PM', end: '11:59 PM', total: '04h 00m 14s', project: 'Food Order App', task: '-Not Working-', action: 'add' },
];

export default function EditTimeView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Edit Time</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Edit Time</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {editStats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 mb-1">{stat.title}</p>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          <Clock size={16} /> Manual Time
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <History size={16} /> Waiting for approval
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <CheckCircle2 size={16} /> Approved Edit Time
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <FileText size={16} /> Manual Time Requests <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">5</span>
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <CalendarDays size={16} /> Schedule
        </button>
      </div>

      {/* Main Actions Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="bg-white flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 w-full lg:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Waiting for Approval Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-lg font-bold text-gray-800">Waiting for Approval</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm flex items-center gap-2 cursor-pointer">
              All Employees <ChevronDown size={14} />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm flex items-center gap-2 cursor-pointer">
              DD/MM/Y... <Calendar size={14} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="flex gap-8 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Working hours</p>
              <p className="text-sm font-black text-gray-900">06h 45m</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Edited hours</p>
              <p className="text-sm font-black text-gray-900">00h 45m</p>
            </div>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="relative mb-12">
          <div className="w-full h-8 bg-gray-50 rounded-lg flex overflow-hidden">
            <div className="w-[15%]" /> {/* 06-08 AM */}
            <div className="w-[10%] bg-emerald-500 border-r border-white/20" /> {/* 08-09 AM */}
            <div className="w-[15%] bg-amber-500 border-r border-white/20" /> {/* 09-11 AM */}
            <div className="w-[10%] bg-emerald-500 border-r border-white/20" /> {/* 11-12 PM */}
            <div className="w-[5%] bg-emerald-500 border-r border-white/20" /> {/* 12-12:30 PM */}
            <div className="w-[10%] bg-emerald-500 border-r border-white/20" /> {/* 12:30-02 PM */}
            <div className="w-[10%] bg-emerald-500 border-r border-white/20" /> {/* 02-04 PM */}
            <div className="w-[20%] bg-emerald-500" /> {/* 04-07 PM */}
          </div>
          <div className="flex justify-between mt-2 px-1">
            {['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'].map(time => (
              <span key={time} className="text-[10px] font-bold text-gray-400">{time}</span>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100">
                <th className="px-6 py-3 text-[11px] font-black text-gray-800 uppercase tracking-wider">Start Time (H)</th>
                <th className="px-6 py-3 text-[11px] font-black text-gray-800 uppercase tracking-wider">End Time (H)</th>
                <th className="px-6 py-3 text-[11px] font-black text-gray-800 uppercase tracking-wider">Total Time (H)</th>
                <th className="px-6 py-3 text-[11px] font-black text-gray-800 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-[11px] font-black text-gray-800 uppercase tracking-wider">Tasks</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {timeLogs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{log.start}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{log.end}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{log.total}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.project}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{log.task}</td>
                  <td className="px-6 py-4 text-right">
                    {log.action === 'add' ? (
                      <button className="text-blue-600 border border-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1 ml-auto">
                        <Plus size={14} /> Add Time
                      </button>
                    ) : (
                      <button className="text-red-500 border border-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-1 ml-auto">
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
