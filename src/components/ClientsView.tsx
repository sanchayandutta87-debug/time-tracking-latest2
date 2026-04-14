import React from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, List, Grid, 
  ArrowUpDown, Users, UserCheck, UserX, Archive,
  TrendingUp, TrendingDown
} from 'lucide-react';

const clientStats = [
  { 
    title: 'Total Clients', 
    value: '3500', 
    change: '12.5%', 
    trend: 'up',
    color: 'bg-blue-600', 
    icon: <Users size={20} /> 
  },
  { 
    title: 'Active Clients', 
    value: '2900', 
    change: '15.5%', 
    trend: 'up',
    color: 'bg-emerald-500', 
    icon: <UserCheck size={20} /> 
  },
  { 
    title: 'Inactive Clients', 
    value: '450', 
    change: '15.5%', 
    trend: 'up',
    color: 'bg-orange-500', 
    icon: <UserX size={20} /> 
  },
  { 
    title: 'Archived Clients', 
    value: '150', 
    change: '10.5%', 
    trend: 'down',
    color: 'bg-pink-600', 
    icon: <Archive size={20} /> 
  },
];

const clientsData = [
  {
    name: 'Brian Thompson',
    country: 'UK',
    company: 'Collins Group',
    email: 'brian@example.com',
    phone: '+1 212 555 0145',
    projects: 5,
    createdDate: '24 Dec 2025',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/brian/40/40'
  },
  {
    name: 'Florence Haith',
    country: 'Germany',
    company: 'NovaTech Solutions',
    email: 'florence@example.com',
    phone: '+1 310 555 0190',
    projects: 8,
    createdDate: '10 Dec 2025',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/florence/40/40'
  },
  {
    name: 'Jerry Palmer',
    country: 'Finland',
    company: 'NovaTech Solutions',
    email: 'jerry@example.com',
    phone: '+1 415 555 0122',
    projects: 6,
    createdDate: '27 Nov 2025',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/jerry/40/40'
  },
  {
    name: 'Mark Brainerd',
    country: 'Canada',
    company: 'AlphaGrid Networks',
    email: 'mark@example.com',
    phone: '+1 646 555 0167',
    projects: 4,
    createdDate: '27 Nov 2025',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/mark/40/40'
  },
  {
    name: 'Roy Thomas',
    country: 'France',
    company: 'MartiTech',
    email: 'roy@example.com',
    phone: '+1 702 555 0181',
    projects: 3,
    createdDate: '06 Nov 2025',
    status: 'Inactive',
    avatar: 'https://picsum.photos/seed/roy/40/40'
  }
];

export default function ClientsView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Clients</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {clientStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.color} shadow-${stat.color.split('-')[1]}-100 transform group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 w-fit`}>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Last month</span>
            </div>
          </div>
        ))}
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
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Client</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Company Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Email Address</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Phone</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">No of Projects</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Created Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clientsData.map((client, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={client.avatar} 
                          alt={client.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{client.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{client.company}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{client.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{client.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{client.projects}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{client.createdDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {client.status}
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
