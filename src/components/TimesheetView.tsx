import React from 'react';
import { Search, Calendar, ChevronRight, ChevronDown } from 'lucide-react';

const timesheetData = [
  {
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    totalTime: '08h 15m',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    timeline: [
      { start: '10 AM', end: '11:30 AM', type: 'active' },
      { start: '11:30 AM', end: '11:45 AM', type: 'break' },
      { start: '11:45 AM', end: '01:30 PM', type: 'active' },
      { start: '01:45 PM', end: '03:15 PM', type: 'active' },
      { start: '03:30 PM', end: '05:00 PM', type: 'active' },
      { start: '05:15 PM', end: '08:30 PM', type: 'active' },
    ]
  },
  {
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    totalTime: '09h 20m',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    timeline: [
      { start: '10 AM', end: '11:00 AM', type: 'active' },
      { start: '11:15 AM', end: '01:15 PM', type: 'active' },
      { start: '01:30 PM', end: '03:30 PM', type: 'active' },
      { start: '03:45 PM', end: '05:15 PM', type: 'active' },
      { start: '05:30 PM', end: '08:30 PM', type: 'active' },
    ]
  },
  {
    name: 'Leon Baxter',
    role: 'Senior Manager',
    totalTime: '08h 00m',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    timeline: [
      { start: '10 AM', end: '11:45 AM', type: 'active' },
      { start: '12:00 PM', end: '01:45 PM', type: 'active' },
      { start: '02:00 PM', end: '03:45 PM', type: 'active' },
      { start: '03:45 PM', end: '04:15 PM', type: 'break' },
      { start: '04:15 PM', end: '08:30 PM', type: 'active' },
    ]
  },
  {
    name: 'Karen Flores',
    role: 'SEO Analyst',
    totalTime: '08h 25m',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    timeline: [
      { start: '09:45 AM', end: '11:15 AM', type: 'active' },
      { start: '11:30 AM', end: '12:00 PM', type: 'meeting' },
      { start: '12:00 PM', end: '12:15 PM', type: 'break' },
      { start: '12:15 PM', end: '01:45 PM', type: 'active' },
      { start: '02:00 PM', end: '03:30 PM', type: 'active' },
      { start: '03:45 PM', end: '08:45 PM', type: 'active' },
    ]
  },
  {
    name: 'Charles Cline',
    role: 'HR Assistant',
    totalTime: '08h 15m',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    timeline: [
      { start: '09:45 AM', end: '11:30 AM', type: 'active' },
      { start: '11:45 AM', end: '12:30 PM', type: 'active' },
      { start: '12:45 PM', end: '02:30 PM', type: 'active' },
      { start: '02:45 PM', end: '05:45 PM', type: 'active' },
      { start: '06:00 PM', end: '07:30 PM', type: 'active' },
      { start: '07:45 PM', end: '08:45 PM', type: 'active' },
    ]
  },
  {
    name: 'Aliza Duncan',
    role: 'Application Designer',
    totalTime: '08h 30m',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    timeline: [
      { start: '09:45 AM', end: '11:30 AM', type: 'active' },
      { start: '11:45 AM', end: '12:00 PM', type: 'break' },
      { start: '12:00 PM', end: '01:45 PM', type: 'active' },
      { start: '02:00 PM', end: '04:45 PM', type: 'active' },
      { start: '05:00 PM', end: '08:45 PM', type: 'active' },
    ]
  }
];

const hours = ['06 AM', '08 AM', '10 AM', '12 PM', '02 PM', '04 PM', '06 PM', '08 PM', '10 PM', '12 AM', '02 AM', '04 AM'];

export default function TimesheetView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Timesheet</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Timesheet</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          By Day
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          By Week
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <div className="w-full border border-gray-100 rounded-lg py-2.5 px-4 text-sm bg-white shadow-sm flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">All Employees</span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>
          
          <div className="relative w-full md:w-48">
            <input 
              type="text" 
              placeholder="Select date" 
              className="w-full border border-gray-100 rounded-lg py-2.5 px-4 text-sm outline-none bg-white shadow-sm pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-sm font-bold text-gray-800 w-64">Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 w-32">Total Time (H)</th>
                {hours.map((hour, i) => (
                  <th key={i} className="px-2 py-4 text-xs font-bold text-gray-800 text-center">{hour}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {timesheetData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={row.avatar} 
                          alt={row.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{row.name}</p>
                        <p className="text-xs text-blue-600 font-medium">{row.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.totalTime}</span>
                  </td>
                  <td colSpan={hours.length} className="px-4 py-4 relative">
                    <div className="h-8 bg-gray-50/50 rounded-lg w-full flex items-center gap-1 px-1">
                      {/* Visual Timeline Bars */}
                      <div className="flex-1 h-full flex items-center gap-1 relative">
                        {/* This is a simplified representation of the timeline bars */}
                        <div className="w-[10%] h-full"></div> {/* Offset to ~10 AM */}
                        <div className="w-[15%] h-6 bg-emerald-500 rounded-full"></div>
                        <div className="w-[2%] h-6 bg-amber-400 rounded-full"></div>
                        <div className="w-[18%] h-6 bg-emerald-500 rounded-full"></div>
                        <div className="w-[3%] h-6 bg-emerald-500 rounded-full"></div>
                        <div className="w-[15%] h-6 bg-emerald-500 rounded-full"></div>
                        <div className="w-[15%] h-6 bg-emerald-500 rounded-full"></div>
                        <div className="w-[25%] h-6 bg-emerald-500 rounded-full"></div>
                        
                        {/* Specific coloring for Karen Flores as seen in screenshot */}
                        {row.name === 'Karen Flores' && (
                          <div className="absolute inset-0 flex items-center gap-1 px-1">
                             <div className="w-[10%] h-full"></div>
                             <div className="w-[15%] h-6 bg-emerald-500 rounded-full"></div>
                             <div className="w-[4%] h-6 bg-indigo-600 rounded-full"></div>
                             <div className="w-[2%] h-6 bg-emerald-500 rounded-full"></div>
                             <div className="w-[2%] h-6 bg-amber-400 rounded-full"></div>
                             <div className="w-[15%] h-6 bg-emerald-500 rounded-full"></div>
                             <div className="w-[15%] h-6 bg-emerald-500 rounded-full"></div>
                             <div className="w-[35%] h-6 bg-emerald-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
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
