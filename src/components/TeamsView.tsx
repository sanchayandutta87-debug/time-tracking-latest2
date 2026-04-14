import React from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, List, Grid, 
  ArrowUpDown, TrendingUp, TrendingDown
} from 'lucide-react';

const teamsData = [
  {
    name: 'UX Research',
    shortName: 'UR',
    color: 'bg-blue-50 text-blue-600',
    lead: 'John Mitchell',
    leadAvatar: 'https://picsum.photos/seed/john/40/40',
    members: 4,
    performance: 97,
    trend: 'up',
    hours: '458h 00m',
    createdDate: '24 Dec 2025',
    status: 'Active'
  },
  {
    name: 'DevOps',
    shortName: 'DO',
    color: 'bg-red-50 text-red-600',
    lead: 'Lisa Thompson',
    leadAvatar: 'https://picsum.photos/seed/lisa/40/40',
    members: 5,
    performance: 84,
    trend: 'up',
    hours: '988h 00m',
    createdDate: '10 Dec 2025',
    status: 'Active'
  },
  {
    name: 'Testing',
    shortName: 'TS',
    color: 'bg-amber-50 text-amber-600',
    lead: 'Michael Rodriguez',
    leadAvatar: 'https://picsum.photos/seed/michael/40/40',
    members: 3,
    performance: 64,
    trend: 'up',
    hours: '699h 00m',
    createdDate: '27 Nov 2025',
    status: 'Active'
  },
  {
    name: 'Cloud Computing',
    shortName: 'CC',
    color: 'bg-rose-50 text-rose-600',
    lead: 'Sarah Lee',
    leadAvatar: 'https://picsum.photos/seed/sarah/40/40',
    members: 6,
    performance: 44,
    trend: 'down',
    hours: '36h 00m',
    createdDate: '27 Nov 2025',
    status: 'Active'
  },
  {
    name: 'Cybersecurity',
    shortName: 'CS',
    color: 'bg-emerald-50 text-emerald-600',
    lead: 'Natalie Brooks',
    leadAvatar: 'https://picsum.photos/seed/natalie/40/40',
    members: 4,
    performance: 45,
    trend: 'down',
    hours: '96h 00m',
    createdDate: '06 Nov 2025',
    status: 'Active'
  },
  {
    name: 'Data & Analytics',
    shortName: 'DA',
    color: 'bg-orange-50 text-orange-600',
    lead: 'David Nguyen',
    leadAvatar: 'https://picsum.photos/seed/david/40/40',
    members: 5,
    performance: 48,
    trend: 'down',
    hours: '48h 00m',
    createdDate: '25 Oct 2025',
    status: 'Active'
  },
  {
    name: 'IT Support',
    shortName: 'IT',
    color: 'bg-yellow-50 text-yellow-600',
    lead: 'Emilen Parker',
    leadAvatar: 'https://picsum.photos/seed/emilen/40/40',
    members: 3,
    performance: 29,
    trend: 'down',
    hours: '99h 00m',
    createdDate: '14 Oct 2025',
    status: 'Active'
  },
  {
    name: 'Networking',
    shortName: 'NK',
    color: 'bg-green-50 text-green-600',
    lead: 'Jason Carter',
    leadAvatar: 'https://picsum.photos/seed/jason/40/40',
    members: 4,
    performance: 35,
    trend: 'down',
    hours: '79h 00m',
    createdDate: '03 Oct 2025',
    status: 'Inactive'
  }
];

export default function TeamsView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Teams</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Teams</span>
        </div>
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
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Team Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Team Lead</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Members</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Performance</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Total Worked Hours</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Created Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {teamsData.map((team, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${team.color}`}>
                        {team.shortName}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={team.leadAvatar} 
                        alt={team.lead} 
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-sm font-bold text-gray-700">{team.lead}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {[1, 2, 3].map((m) => (
                        <img 
                          key={m}
                          src={`https://picsum.photos/seed/member${m+i}/32/32`} 
                          alt="Member" 
                          className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white -ml-2">
                        +{team.members - 3 > 0 ? team.members - 3 : 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-bold ${team.trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {team.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {team.performance}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{team.hours}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{team.createdDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${team.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {team.status}
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
