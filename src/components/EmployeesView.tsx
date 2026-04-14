import React from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, List, Grid, 
  Calendar, ArrowUpDown, Users, UserCheck, UserX, Archive,
  TrendingUp, TrendingDown
} from 'lucide-react';

const employeeStats = [
  { 
    title: 'Total Employees', 
    value: '2520', 
    change: '22.5%', 
    trend: 'up',
    color: 'bg-purple-600', 
    icon: <Users size={20} /> 
  },
  { 
    title: 'Active Employees', 
    value: '2000', 
    change: '15.2%', 
    trend: 'up',
    color: 'bg-emerald-500', 
    icon: <UserCheck size={20} /> 
  },
  { 
    title: 'Inactive Employees', 
    value: '350', 
    change: '16.3%', 
    trend: 'up',
    color: 'bg-orange-500', 
    icon: <UserX size={20} /> 
  },
  { 
    title: 'Archived Employees', 
    value: '170', 
    change: '10.5%', 
    trend: 'down',
    color: 'bg-pink-600', 
    icon: <Archive size={20} /> 
  },
];

const employees = [
  {
    name: 'Shaun Farley',
    role: 'Frontend Developer',
    team: 'UX Research',
    location: 'Remote',
    email: 'shaurn@example.com',
    phone: '+1 578 209 4965',
    experience: '2 years',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    name: 'Jenny Ellis',
    role: 'DevOps Engineer',
    team: 'DevOps',
    location: 'Office',
    email: 'jenny@example.com',
    phone: '+1 278 301 7284',
    experience: '5 years',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    name: 'Leon Baxter',
    role: 'Test Lead',
    team: 'Testing',
    location: 'Office',
    email: 'leon@example.com',
    phone: '+1 212 555 0173',
    experience: '6 years',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    name: 'Adrian Travon',
    role: 'Cloud Architect',
    team: 'Cloud Computing',
    location: 'Remote',
    email: 'adrian@example.com',
    phone: '+1 310 555 0148',
    experience: '4 years',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/adrian/40/40'
  },
  {
    name: 'Charles Cline',
    role: 'Security Engineer',
    team: 'Cybersecurity',
    location: 'Remote',
    email: 'charles@example.com',
    phone: '+1 646 555 0125',
    experience: '7 years',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/charles/40/40'
  }
];

export default function EmployeesView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Employees</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {employeeStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color} shadow-${stat.color.split('-')[1]}-100`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
              {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
        <button className="pb-4 text-blue-600 font-bold border-b-2 border-blue-600 text-sm">
          Active Employees
        </button>
        <button className="pb-4 text-gray-500 font-bold hover:text-gray-700 text-sm">
          Deactivated Employees
        </button>
        <button className="pb-4 text-gray-500 font-bold hover:text-gray-700 text-sm">
          Archived Employees
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 w-full lg:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button className="p-1.5 bg-gray-900 text-white rounded-md">
              <List size={18} />
            </button>
            <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-md">
              <Grid size={18} />
            </button>
          </div>

          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" /> 08 Apr 26 - 08 Apr 26
          </button>

          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
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
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Team</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Work Location</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Email Address</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Phone Number</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Experience</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{emp.team}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{emp.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{emp.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{emp.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{emp.experience}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                      {emp.status}
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
