import React from 'react';
import { 
  ChevronRight, MoreVertical, Mic, Video, 
  MessageSquare, PhoneOff, Volume2, Smile, 
  Monitor, Settings
} from 'lucide-react';

export default function VoiceCallView() {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6 pt-4 shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Voice Call</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Voice Call</span>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-6 overflow-y-auto pb-6 relative">
        {/* Main Call Area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Top Bar */}
          <div className="flex justify-between items-center p-6 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/edward/48/48" 
                  alt="Edward Lietz" 
                  className="w-12 h-12 rounded-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Edward Lietz</h4>
                <p className="text-xs text-gray-400">+22-555-345-11</p>
              </div>
            </div>
            <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Central Call Interface */}
          <div className="relative h-[400px] bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-blue-100/50 flex items-center justify-center p-4">
                <img 
                  src="https://picsum.photos/seed/edward/300/300" 
                  alt="Edward Lietz" 
                  className="w-full h-full rounded-full object-cover shadow-xl" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
            <div className="mt-8 text-sm font-bold text-gray-800">
              01:45
            </div>

            {/* Small Floating User Avatar */}
            <div className="absolute bottom-8 right-8">
              <div className="w-16 h-16 rounded-xl border-2 border-blue-600 overflow-hidden shadow-lg">
                <img 
                  src="https://picsum.photos/seed/user/100/100" 
                  alt="User" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex justify-center items-center gap-4 mb-6 shrink-0">
          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Mic size={20} />
          </button>
          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Video size={20} />
          </button>
          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <MessageSquare size={20} />
          </button>
          <button className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
            <PhoneOff size={20} />
          </button>
          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Volume2 size={20} />
          </button>
          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Smile size={20} />
          </button>
          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
            <Monitor size={20} />
          </button>
        </div>

        {/* Floating Settings Button */}
        <button className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all z-10">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
