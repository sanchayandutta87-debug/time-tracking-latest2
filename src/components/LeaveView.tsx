import React from 'react';
import { Search, Plus, ChevronRight, ArrowUpDown, FileText, Check, X } from 'lucide-react';

const leaveRequests = [
  {
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    type: 'Casual Leave',
    fromDate: '15 May 2025',
    toDate: '15 May 2025',
    duration: '1 Day',
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    type: 'Sick Leave',
    fromDate: '13 May 2025',
    toDate: '13 May 2025',
    duration: '1st Half',
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    name: 'Leon Baxter',
    role: 'Senior Manager',
    type: 'Maternity',
    fromDate: '11 May 2025',
    toDate: '11 Jul 2025',
    duration: '2 Months',
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    name: 'Karen Flores',
    role: 'SEO Analyst',
    type: 'Annual Leave',
    fromDate: '26 Apr 2025',
    toDate: '28 Apr 2025',
    duration: '3 Days',
    avatar: 'https://picsum.photos/seed/karen/40/40'
  },
  {
    name: 'Charles Cline',
    role: 'HR Assistant',
    type: 'Permission',
    fromDate: '24 Apr 2025',
    toDate: '24 Apr 2025',
    duration: '02:00 Hours',
    avatar: 'https://picsum.photos/seed/charles/40/40'
  }
];

export default function LeaveView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Leave</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Leave</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          Requested
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          Approved
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          Rejected
        </button>
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
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Type</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">From Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">To Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Duration</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Reason</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaveRequests.map((row, i) => (
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
                    <span className="text-sm text-gray-500 font-medium">{row.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.fromDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.toDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.duration}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <FileText size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all">
                        <Check size={16} />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-200 transition-all">
                        <X size={16} />
                      </button>
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
