import React from 'react';
import { 
  ChevronRight, Plus, Maximize2, Mic, Video, 
  MessageSquare, PhoneOff, Volume2, Smile, 
  Monitor, Settings, AudioLines
} from 'lucide-react';

const participants = [
  { id: 1, name: 'Rosa Shelby', avatar: 'https://picsum.photos/seed/rosa/300/300', color: 'bg-yellow-400' },
  { id: 2, name: 'Allen Snyder', avatar: 'https://picsum.photos/seed/allen/300/300', color: 'bg-purple-400', speaking: true },
  { id: 3, name: 'Charlotte Ayala', avatar: 'https://picsum.photos/seed/charlotte/300/300', color: 'bg-blue-400' },
  { id: 4, name: 'Andrew Foster', avatar: 'https://picsum.photos/seed/andrew/300/300', color: 'bg-red-500' },
];

export default function VideoCallView() {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6 pt-4 shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Video Call</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Video Call</span>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-6 overflow-y-auto pb-6 relative">
        {/* Toolbar */}
        <div className="flex justify-start shrink-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add Participant
          </button>
        </div>

        {/* Main Video Area */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video bg-gray-900 shrink-0">
          <img 
            src="https://picsum.photos/seed/rachael/1280/720" 
            alt="Main Video" 
            className="w-full h-full object-cover opacity-80" 
            referrerPolicy="no-referrer" 
          />
          
          {/* Overlay Info */}
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
              Rachael Thomas
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
              01:45
            </div>
          </div>

          <button className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-gray-900 shadow-sm transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Participant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          {participants.map((p) => (
            <div key={p.id} className={`relative rounded-2xl overflow-hidden aspect-square ${p.color} border border-gray-100 shadow-sm group`}>
              <img 
                src={p.avatar} 
                alt={p.name} 
                className="w-full h-full object-cover mix-blend-multiply opacity-90" 
                referrerPolicy="no-referrer" 
              />
              {p.speaking && (
                <div className="absolute top-4 left-4 text-white">
                  <AudioLines size={20} />
                </div>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white py-2 rounded-lg text-center shadow-sm">
                <span className="text-xs font-bold text-gray-800">{p.name}</span>
              </div>
            </div>
          ))}
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
