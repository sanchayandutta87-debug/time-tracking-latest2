import React from 'react';
import { Search, Calendar, Camera, Clock, Sun, ChevronRight, MapPin } from 'lucide-react';

const trackingData = [
  {
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    clockIn: '09:45 AM',
    app: { name: 'Google Docs', domain: 'docs.google.com', color: 'bg-blue-500' },
    project: 'Office Management',
    task: 'Creating Application Modules',
    location: '11.016844 / 76.955833',
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    clockIn: '09:20 AM',
    app: { name: 'Figma', domain: 'figma.com', color: 'bg-purple-500' },
    project: 'Service Management App',
    task: 'Creating Application Modules',
    location: '11.016844 / 76.955833',
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    name: 'Leon Baxter',
    role: 'Senior Manager',
    clockIn: '09:30 AM',
    app: { name: 'Google', domain: 'google.com', color: 'bg-red-500' },
    project: 'Advanced Booking System',
    task: 'Develop Workflows & Rules',
    location: '11.016844 / 76.955833',
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    name: 'Karen Flores',
    role: 'SEO Analyst',
    clockIn: '09:00 AM',
    app: { name: 'Adobe-Illustrator', domain: 'adobe.com', color: 'bg-orange-500' },
    project: 'Food Order App',
    task: 'Ad Setup & Campaign Management',
    location: '11.016844 / 76.955833',
    avatar: 'https://picsum.photos/seed/karen/40/40'
  },
  {
    name: 'Charles Cline',
    role: 'HR Assistant',
    clockIn: '09:10 AM',
    app: { name: 'Gmail', domain: 'mail.google.com', color: 'bg-red-600' },
    project: 'Truelysell',
    task: 'Integration & API Testing',
    location: '11.016844 / 76.955833',
    avatar: 'https://picsum.photos/seed/charles/40/40'
  },
  {
    name: 'Aliza Duncan',
    role: 'Application Designer',
    clockIn: '09:13 AM',
    app: { name: 'Jira', domain: 'atlassian.com', color: 'bg-blue-600' },
    project: 'Dreamschat',
    task: 'Performance Monitoring & Optimization',
    location: '11.016844 / 76.955833',
    avatar: 'https://picsum.photos/seed/aliza/40/40'
  }
];

export default function LiveTrackingView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Live Tracking</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Live Tracking</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          <Sun size={18} />
          Live Tracking
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <Clock size={18} />
          Last 5 Minutes
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="relative w-full md:w-48">
          <input 
            type="text" 
            placeholder="dd/mm/yyyy" 
            className="w-full border border-gray-100 rounded-lg py-2.5 px-4 text-sm outline-none bg-white shadow-sm pr-10"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Clock In</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Web App / Applications</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Project & Task</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Lat / Lan</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {trackingData.map((row, i) => (
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
                    <span className="text-sm text-gray-500 font-medium">{row.clockIn}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden`}>
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${row.app.domain}&sz=32`} 
                          alt={row.app.name}
                          className="w-5 h-5"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-800">{row.app.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{row.project}</p>
                      <p className="text-xs text-gray-400">{row.task}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.location}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                      <Camera size={14} />
                      Take Screenshot
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
