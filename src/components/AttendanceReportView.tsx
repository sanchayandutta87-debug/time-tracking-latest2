import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Download, 
  Clock, Filter, ChevronDown, CheckCircle2, XCircle, 
  AlertCircle, Coffee, FileText, Printer
} from 'lucide-react';

interface AttendanceRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  shiftStart: string;
  actualStart: string;
  shiftEnd: string;
  minHours: string;
  actualWorked: string;
  breakTime: string;
  attendanceStatus: 'Present' | 'Absent' | 'Late' | 'Holiday' | 'Half Day';
}

const attendanceData: AttendanceRecord[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    shiftStart: '09:00 AM',
    actualStart: '08:41 AM',
    shiftEnd: '06:30 PM',
    minHours: '08h 00m',
    actualWorked: '10h 30m 42s',
    breakTime: '01h 10m',
    attendanceStatus: 'Holiday'
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'offline',
    shiftStart: '09:00 AM',
    actualStart: '09:15 AM',
    shiftEnd: '06:00 PM',
    minHours: '08h 00m',
    actualWorked: '07h 45m 12s',
    breakTime: '01h 00m',
    attendanceStatus: 'Late'
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'online',
    shiftStart: '09:00 AM',
    actualStart: '08:55 AM',
    shiftEnd: '06:00 PM',
    minHours: '08h 00m',
    actualWorked: '08h 05m 30s',
    breakTime: '00h 55m',
    attendanceStatus: 'Present'
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'offline',
    shiftStart: '09:00 AM',
    actualStart: '-',
    shiftEnd: '-',
    minHours: '08h 00m',
    actualWorked: '00h 00m 00s',
    breakTime: '00h 00m',
    attendanceStatus: 'Absent'
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    shiftStart: '09:00 AM',
    actualStart: '09:02 AM',
    shiftEnd: '06:15 PM',
    minHours: '08h 00m',
    actualWorked: '08h 13m 15s',
    breakTime: '01h 00m',
    attendanceStatus: 'Present'
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'offline',
    shiftStart: '09:00 AM',
    actualStart: '09:45 AM',
    shiftEnd: '06:30 PM',
    minHours: '08h 00m',
    actualWorked: '07h 45m 00s',
    breakTime: '01h 00m',
    attendanceStatus: 'Half Day'
  }
];

export default function AttendanceReportView() {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = attendanceData.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: AttendanceRecord['attendanceStatus']) => {
    switch (status) {
      case 'Present': return 'bg-emerald-500 text-white';
      case 'Absent': return 'bg-red-500 text-white';
      case 'Late': return 'bg-orange-500 text-white';
      case 'Holiday': return 'bg-purple-500 text-white';
      case 'Half Day': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Attendance Report</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Present</p>
            <h3 className="text-xl font-bold text-gray-800">124</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Absent</p>
            <h3 className="text-xl font-bold text-gray-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Late</p>
            <h3 className="text-xl font-bold text-gray-800">08</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <Coffee size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">On Leave</p>
            <h3 className="text-xl font-bold text-gray-800">05</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('day')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'day' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Day
          {activeTab === 'day' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'week' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Week
          {activeTab === 'week' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('month')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'month' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Month
          {activeTab === 'month' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10">
              <option>All Employees</option>
              <option>Shaun Farley</option>
              <option>Jenny Ellis</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative flex-1 lg:flex-none">
            <input 
              type="date" 
              className="w-full lg:w-48 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors" title="Print">
              <Printer size={18} />
            </button>
            <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors" title="Export PDF">
              <FileText size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Shift Start Time</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actual Start Time</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Shift End Time</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Min Hours</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actual Hours Worked</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Break Time</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={record.avatar} 
                          alt={record.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${record.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{record.name}</h4>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{record.shiftStart}</td>
                  <td className="p-4 text-sm text-gray-600">{record.actualStart}</td>
                  <td className="p-4 text-sm text-gray-600">{record.shiftEnd}</td>
                  <td className="p-4 text-sm text-gray-600">{record.minHours}</td>
                  <td className="p-4 text-sm text-gray-600">{record.actualWorked}</td>
                  <td className="p-4 text-sm text-gray-600">{record.breakTime}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(record.attendanceStatus)}`}>
                      {record.attendanceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xs text-gray-400 font-medium">Showing 1 to 6 of 124 entries</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-bold text-gray-400 hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold shadow-lg shadow-blue-100">1</button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">2</button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">3</button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}
