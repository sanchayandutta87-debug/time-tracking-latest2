import React, { useState } from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, 
  Users, Archive, UserPlus, ChevronDown
} from 'lucide-react';

const usersData = [
  {
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    lastPunchIn: '11 May 2025, 12:00 PM',
    level: 'User',
    reportingOfficer: 'Wayne Martino',
    screenshot: true,
    manualTime: true,
    permanentTask: true,
    status: 'Active'
  },
  {
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    lastPunchIn: '10 May 2025, 10:00 AM',
    level: 'Manager',
    reportingOfficer: 'Treva Gattis',
    screenshot: true,
    manualTime: true,
    permanentTask: true,
    status: 'Active'
  },
  {
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    lastPunchIn: '09 May 2025, 09:10 AM',
    level: 'Admin',
    reportingOfficer: 'Frances Mann',
    screenshot: true,
    manualTime: true,
    permanentTask: false,
    status: 'Inactive'
  },
  {
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    lastPunchIn: '09 May 2025, 09:30 AM',
    level: 'User',
    reportingOfficer: 'Shane Anderson',
    screenshot: false,
    manualTime: false,
    permanentTask: true,
    status: 'Active'
  },
  {
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    lastPunchIn: '08 May 2025, 11:00 AM',
    level: 'User',
    reportingOfficer: 'Calvin Callaway',
    screenshot: true,
    manualTime: true,
    permanentTask: true,
    status: 'Active'
  },
  {
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    lastPunchIn: '11 May 2025, 08:00 AM',
    level: 'User',
    reportingOfficer: 'Adam Jordan',
    screenshot: true,
    manualTime: true,
    permanentTask: true,
    status: 'Active'
  },
  {
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza2/40/40',
    lastPunchIn: '07 May 2025, 09:00 AM',
    level: 'User',
    reportingOfficer: 'Matthew Keiser',
    screenshot: true,
    manualTime: true,
    permanentTask: true,
    status: 'Active'
  }
];

export default function UserListView() {
  const [activeTab, setActiveTab] = useState('Users List');

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Users</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Users</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('Users List')}
          className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${activeTab === 'Users List' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Users size={18} />
          Users List
          {activeTab === 'Users List' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('Archived')}
          className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${activeTab === 'Archived' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Archive size={18} />
          Archived
          {activeTab === 'Archived' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('Invite Status')}
          className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${activeTab === 'Invite Status' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <UserPlus size={18} />
          Invite Status
          {activeTab === 'Invite Status' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full lg:w-64 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <span className="text-gray-400">⇅</span> Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
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
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Last Punch In</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Level</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Reporting Officer</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Screenshot</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Manual Time</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Permanent Task</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usersData.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{user.lastPunchIn}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <button className="flex items-center justify-between gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 min-w-[100px]">
                        {user.level}
                        <ChevronDown size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{user.reportingOfficer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Toggle checked={user.screenshot} />
                  </td>
                  <td className="px-6 py-4">
                    <Toggle checked={user.manualTime} />
                  </td>
                  <td className="px-6 py-4">
                    <Toggle checked={user.permanentTask} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
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

function Toggle({ checked }: { checked: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </div>
  );
}
