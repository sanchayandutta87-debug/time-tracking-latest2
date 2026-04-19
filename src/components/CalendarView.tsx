import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, ChevronDown, ChevronRight as ChevronRightIcon, X, Calendar as CalendarIcon, Tag, MapPin, AlignLeft } from 'lucide-react';

const CATEGORIES = [
  { name: 'Meeting', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-600' },
  { name: 'Office', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-600' },
  { name: 'Hiring', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-600' },
  { name: 'Holiday', color: 'bg-pink-100 text-pink-700 border-pink-200', dot: 'bg-pink-600' },
  { name: 'Employee', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-600' },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    dateStr: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    category: 'Meeting',
    time: ''
  });

  // Derived state for Calendar rendering
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = useMemo(() => {
    const daysArray = [];

    // Prior Month Padding
    for (let i = 0; i < firstDayOfMonth; i++) {
       const historicDate = new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1);
       daysArray.push({
          dateObj: historicDate,
          day: historicDate.getDate(),
          isCurrentMonth: false,
          isToday: false
       });
    }

    // Current Month Days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
       const activeDate = new Date(currentYear, currentMonth, i);
       const isToday = activeDate.getDate() === today.getDate() && 
                       activeDate.getMonth() === today.getMonth() && 
                       activeDate.getFullYear() === today.getFullYear();
       
       daysArray.push({
          dateObj: activeDate,
          day: i,
          isCurrentMonth: true,
          isToday: isToday
       });
    }

    // Next Month Padding (ensure grid aligns to 6 rows / 42 cells total for uniformity)
    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
       const futureDate = new Date(currentYear, currentMonth + 1, i);
       daysArray.push({
          dateObj: futureDate,
          day: i,
          isCurrentMonth: false,
          isToday: false
       });
    }

    return daysArray;
  }, [currentMonth, currentYear, daysInMonth, firstDayOfMonth, daysInPrevMonth]);

  // Handlers
  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const handleToday = () => setCurrentDate(new Date());



  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventData.title || !newEventData.dateStr) return;

    // Convert local YYYY-MM-DD input to a proper midnight timestamp 
    const [year, month, day] = newEventData.dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const newEvent = {
      id: Date.now(),
      title: newEventData.title,
      date: dateObj.getTime(),
      category: newEventData.category,
      time: newEventData.time || 'All Day'
    };

    setEvents([...events, newEvent]);
    setIsEventModalOpen(false);
    setNewEventData({ ...newEventData, title: '', time: '' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/30 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Calendar</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRightIcon size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Applications</span>
          <ChevronRightIcon size={14} />
          <span className="text-gray-600 font-medium">Calendar</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-0">
            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 mb-8 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} /> Create Event
            </button>


          </div>
        </div>

        {/* Central Calendar Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-visible relative min-w-[700px]">
          {/* Calendar Toolbar */}
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleToday}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                Today
              </button>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 text-gray-600 transition-colors border-r border-gray-200">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 text-gray-600 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <h2 className="text-xl font-black text-gray-800 tracking-wider">
              {MONTHS[currentMonth]} {currentYear}
            </h2>

            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button className="px-5 py-1.5 bg-white text-gray-900 rounded-md text-sm font-bold shadow-sm">Month</button>
              <button className="px-5 py-1.5 text-gray-500 hover:text-gray-900 rounded-md text-sm font-bold transition-colors">Week</button>
            </div>
          </div>

          {/* Calendar Grid container */}
          <div className="flex-1 flex flex-col bg-gray-50/50">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="p-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6">
              {calendarDays.map((item, index) => {
                // Find events targeting this specific iteration's day block 
                const cellEvents = events.filter(ev => {
                   const evDate = new Date(ev.date);
                   return evDate.getDate() === item.dateObj.getDate() &&
                          evDate.getMonth() === item.dateObj.getMonth() &&
                          evDate.getFullYear() === item.dateObj.getFullYear();
                });

                return (
                  <div 
                    key={index} 
                    onClick={() => {
                        // Optional convenience: Clicking empty cell opens modal pre-filled with date
                        setNewEventData({...newEventData, 
                           dateStr: `${item.dateObj.getFullYear()}-${String(item.dateObj.getMonth()+1).padStart(2,'0')}-${String(item.dateObj.getDate()).padStart(2,'0')}`
                        });
                        setIsEventModalOpen(true);
                    }}
                    className={`border-r border-b border-gray-200 p-2 min-h-[120px] transition-colors cursor-pointer relative group ${
                       !item.isCurrentMonth ? 'bg-gray-100/50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                       <span className={`text-sm font-bold mb-2 flex items-center justify-center w-7 h-7 rounded-full ${
                          item.isToday 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : item.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                       }`}>
                         {item.day}
                       </span>

                       {/* Event Chips */}
                       <div className="space-y-1 overflow-y-auto flex-1 no-scrollbar pr-1">
                          {cellEvents.map(ev => {
                             const catTheme = CATEGORIES.find(c => c.name === ev.category);
                             return (
                               <div 
                                 key={ev.id} 
                                 onClick={(e) => e.stopPropagation()} // Prevent triggering cell's Add Event
                                 className={`px-2 py-1.5 rounded border text-xs font-bold truncate flex items-center justify-between shadow-sm cursor-default hover:opacity-80 transition-opacity ${catTheme?.color}`}
                                 title={`${ev.time} - ${ev.title}`}
                               >
                                  <span className="truncate">{ev.title}</span>
                               </div>
                             );
                          })}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>



      {/* Create Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsEventModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-800">Add New Event</h2>
              <button 
                onClick={() => setIsEventModalOpen(false)} 
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><AlignLeft size={16} className="text-gray-400"/> Event Title</label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  value={newEventData.title}
                  onChange={e => setNewEventData({...newEventData, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g., Weekly Team Sync"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><CalendarIcon size={16} className="text-gray-400"/> Date</label>
                  <input 
                    type="date" 
                    required
                    value={newEventData.dateStr}
                    onChange={e => setNewEventData({...newEventData, dateStr: e.target.value})}
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Tag size={16} className="text-gray-400"/> Category</label>
                  <div className="relative shadow-sm rounded-xl">
                    <select 
                      value={newEventData.category}
                      onChange={e => setNewEventData({...newEventData, category: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all bg-white"
                    >
                      {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> Time / Location (Optional)</label>
                <input 
                  type="text" 
                  value={newEventData.time}
                  onChange={e => setNewEventData({...newEventData, time: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g., 2:00 PM @ Conf Room A"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
