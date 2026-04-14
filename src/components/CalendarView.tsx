import React from 'react';
import { ChevronLeft, ChevronRight, Plus, ChevronDown, ChevronRight as ChevronRightIcon, Settings } from 'lucide-react';

const categories = [
  { name: 'Meeting', color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-600' },
  { name: 'Office', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-600' },
  { name: 'Hiring', color: 'bg-green-100 text-green-600', dot: 'bg-green-600' },
  { name: 'Holiday', color: 'bg-pink-100 text-pink-600', dot: 'bg-pink-600' },
  { name: 'Employee', color: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-600' },
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
  // Generate calendar dates for April 2026
  // April 1st, 2026 is a Wednesday
  const calendarDays = [];
  
  // Previous month padding (March 2026 ends on Tuesday)
  calendarDays.push({ day: 29, current: false });
  calendarDays.push({ day: 30, current: false });
  calendarDays.push({ day: 31, current: false });
  
  // April days
  for (let i = 1; i <= 30; i++) {
    calendarDays.push({ day: i, current: true });
  }
  
  // Next month padding
  for (let i = 1; i <= 9; i++) {
    calendarDays.push({ day: i, current: false });
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Calendar</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRightIcon size={14} />
          <span>Applications</span>
          <ChevronRightIcon size={14} />
          <span className="text-gray-600">Calendar</span>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* Left Panel */}
        <div className="w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 mb-8 hover:bg-blue-700 transition-all">
              <Plus size={18} /> Create Event
            </button>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Events</h3>
              <ChevronDown size={14} className="text-gray-400" />
            </div>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.name} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer ${cat.color}`}>
                  <div className={`w-2 h-2 rounded-full ${cat.dot}`} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Main Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
          {/* Floating Settings Icon */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button className="bg-blue-600 text-white p-2 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all">
              <Settings size={20} />
            </button>
          </div>

          {/* Calendar Toolbar */}
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Today</button>
              <div className="flex bg-blue-600 text-white rounded-lg overflow-hidden">
                <button className="p-1.5 hover:bg-blue-700 border-r border-blue-500"><ChevronLeft size={18} /></button>
                <button className="p-1.5 hover:bg-blue-700"><ChevronRight size={18} /></button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">April 2026</h2>

            <div className="flex bg-blue-50 p-1 rounded-lg">
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium">Month</button>
              <button className="px-4 py-1.5 text-blue-600 hover:bg-white rounded-md text-sm font-medium transition-colors">Week</button>
              <button className="px-4 py-1.5 text-blue-600 hover:bg-white rounded-md text-sm font-medium transition-colors">Day</button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {days.map((day) => (
                <div key={day} className="p-4 text-center text-sm font-bold text-gray-800">
                  {day}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6">
              {calendarDays.map((item, index) => (
                <div 
                  key={index} 
                  className={`border-r border-b border-gray-100 p-2 min-h-[100px] ${!item.current ? 'bg-gray-50/30' : ''}`}
                >
                  <span className={`text-xs font-medium ${item.current ? 'text-gray-400' : 'text-gray-300'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
