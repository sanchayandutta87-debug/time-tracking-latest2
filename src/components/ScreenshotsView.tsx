import React from 'react';
import { 
  Search, ChevronRight, Calendar, ChevronDown, Download, 
  Trash2, Clock, Activity, Keyboard, MousePointer2 
} from 'lucide-react';

const screenshotData = [
  {
    app: 'Email',
    appName: 'Email',
    iconColor: 'text-red-500',
    time: '09:00 AM',
    activity: '60%',
    name: 'James Anderson',
    keyboard: 40,
    mouse: 60,
    image: 'https://picsum.photos/seed/email/400/250'
  },
  {
    app: 'Freepik',
    appName: 'Freepik',
    iconColor: 'text-blue-500',
    time: '08:58 AM',
    activity: '86%',
    name: 'James Anderson',
    keyboard: 70,
    mouse: 80,
    image: 'https://picsum.photos/seed/freepik/400/250'
  },
  {
    app: 'Visual Composer',
    appName: 'Visual Composer',
    iconColor: 'text-indigo-500',
    time: '08:56 AM',
    activity: '87%',
    name: 'James Anderson',
    keyboard: 80,
    mouse: 75,
    image: 'https://picsum.photos/seed/visual/400/250'
  },
  {
    app: 'Dribble',
    appName: 'Dribble',
    iconColor: 'text-pink-500',
    time: '08:54 AM',
    activity: '73%',
    name: 'James Anderson',
    keyboard: 60,
    mouse: 70,
    image: 'https://picsum.photos/seed/dribble/400/250'
  },
  {
    app: 'Google',
    appName: 'Google',
    iconColor: 'text-yellow-500',
    time: '08:52 AM',
    activity: '53%',
    name: 'James Anderson',
    keyboard: 45,
    mouse: 50,
    image: 'https://picsum.photos/seed/google/400/250'
  },
  {
    app: 'Dribble',
    appName: 'Dribble',
    iconColor: 'text-pink-500',
    time: '08:50 AM',
    activity: '53%',
    name: 'James Anderson',
    keyboard: 40,
    mouse: 55,
    image: 'https://picsum.photos/seed/dribble2/400/250'
  },
  {
    app: 'Visual Composer',
    appName: 'Visual Composer',
    iconColor: 'text-indigo-500',
    time: '08:48 AM',
    activity: '53%',
    name: 'James Anderson',
    keyboard: 50,
    mouse: 45,
    image: 'https://picsum.photos/seed/visual2/400/250'
  },
  {
    app: 'Google',
    appName: 'Google',
    iconColor: 'text-yellow-500',
    time: '08:46 AM',
    activity: '53%',
    name: 'James Anderson',
    keyboard: 45,
    mouse: 50,
    image: 'https://picsum.photos/seed/google2/400/250'
  }
];

export default function ScreenshotsView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Screenshots</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Screenshots</span>
        </div>
      </div>

      {/* Top Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="bg-white flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full lg:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm flex items-center gap-2 cursor-pointer">
            All Employees <ChevronDown size={14} />
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm flex items-center gap-2 cursor-pointer">
            Select date <Calendar size={14} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Time Range Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">08:00 AM - 09:00 AM</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Calendar size={14} />
            <span>05 Jan 2025</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm font-bold text-gray-500">Select All</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {screenshotData.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group">
            {/* Card Header */}
            <div className="p-3 flex justify-between items-center border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded flex items-center justify-center bg-gray-50 ${item.iconColor}`}>
                  <Activity size={12} />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.appName}</span>
              </div>
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </div>

            {/* Image Section */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.appName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md shadow-sm hover:bg-emerald-100 transition-colors">
                  <Download size={14} />
                </button>
                <button className="p-1.5 bg-red-50 text-red-600 rounded-md shadow-sm hover:bg-red-100 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Clock size={12} />
                  {item.time}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <Activity size={12} />
                  {item.activity}
                </div>
              </div>
              
              <p className="text-sm font-bold text-gray-800 mb-4">{item.name}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Keyboard size={14} className="text-gray-400" />
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.keyboard}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer2 size={14} className="text-gray-400" />
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.mouse}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
