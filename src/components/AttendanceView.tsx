import React from 'react';
import { Search, Plus, ChevronRight, ArrowUpDown, MoreVertical, Home, Building2, Users, UserCheck, UserX, Clock } from 'lucide-react';

const attendanceStats = [
  { title: 'Total Attendance', value: '2520', icon: <Users size={20} />, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
  { title: 'Total Present', value: '2502', icon: <UserCheck size={20} />, bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
  { title: 'Total Absentees', value: '65', icon: <UserX size={20} />, bgColor: 'bg-red-50', textColor: 'text-red-600' },
  { title: 'Total Late Login', value: '15', icon: <Clock size={20} />, bgColor: 'bg-gray-50', textColor: 'text-gray-600' },
];

const attendanceData = [
  {
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    date: '24 Dec 2025',
    clockIn: '09:05 AM',
    clockOut: '07:40 PM',
    location: 'Remote',
    totalWorked: '09h 45m',
    isLate: false,
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    date: '10 Dec 2025',
    clockIn: '09:20 AM',
    clockOut: '07:45 PM',
    location: 'Office',
    totalWorked: '09h 10m',
    isLate: true,
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    name: 'Leon Baxter',
    role: 'Senior Manager',
    date: '27 Nov 2025',
    clockIn: '09:30 AM',
    clockOut: '07:15 PM',
    location: 'Office',
    totalWorked: '09h 14m',
    isLate: true,
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    name: 'Karen Flores',
    role: 'SEO Analyst',
    date: '27 Nov 2025',
    clockIn: '09:01 AM',
    clockOut: '08:30 PM',
    location: 'Office',
    totalWorked: '09h 11m',
    isLate: false,
    avatar: 'https://picsum.photos/seed/karen/40/40'
  },
  {
    name: 'Charles Cline',
    role: 'HR Assistant',
    date: '06 Nov 2025',
    clockIn: '08:50 AM',
    clockOut: '08:40 PM',
    location: 'Office',
    totalWorked: '09h 12m',
    isLate: false,
    avatar: 'https://picsum.photos/seed/charles/40/40'
  },
  {
    name: 'Aliza Duncan',
    role: 'Application Designer',
    date: '25 Oct 2025',
    clockIn: '08:45 AM',
    clockOut: '08:00 PM',
    location: 'Office',
    totalWorked: '08h 15m',
    isLate: false,
    avatar: 'https://picsum.photos/seed/aliza/40/40'
  }
];

export default function AttendanceView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Attendance</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {attendanceStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bgColor} ${stat.textColor} rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="bg-white border border-gray-100 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Clock In</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Clock Out</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Location</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Total Worked (H)</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendanceData.map((row, i) => (
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
                    <span className="text-sm text-gray-500 font-medium">{row.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${row.isLate ? 'text-red-500' : 'text-gray-500'}`}>
                      {row.clockIn}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.clockOut}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg w-fit">
                      {row.location === 'Remote' ? (
                        <Home size={14} className="text-gray-400" />
                      ) : (
                        <Building2 size={14} className="text-gray-400" />
                      )}
                      <span className="text-xs font-bold text-gray-600">{row.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-900">{row.totalWorked}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
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
