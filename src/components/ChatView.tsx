import React from 'react';
import { Search, Plus, Phone, Video, Info, MoreVertical, Image as ImageIcon, Smile, Send, CheckCheck, ChevronRight } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Mark Smith', message: 'Hey Sam! Did you Ch...', time: '10:10 AM', status: 'read', online: true, avatar: 'https://picsum.photos/seed/mark/40/40' },
  { id: 2, name: 'Eugene Sikora', message: 'How are your Today', time: '08:26 AM', unread: 5, online: false, avatar: 'https://picsum.photos/seed/eugene/40/40' },
  { id: 3, name: 'Robert Fassett', message: 'Here are some of ve...', time: 'yesterday', unread: 5, online: true, avatar: 'https://picsum.photos/seed/robert/40/40' },
  { id: 4, name: 'Andrew Fletcher', message: 'Use tools like Trello...', time: 'yesterday', online: false, avatar: 'https://picsum.photos/seed/andrew/40/40' },
];

const messages = [
  { id: 1, sender: 'Mark Smith', time: '02:39 PM', text: 'Hey mark! Did you check out the new logo design?', isMe: false, avatar: 'https://picsum.photos/seed/mark/40/40' },
  { id: 2, sender: 'You', time: '02:39 PM', text: 'Not yet. Can you send it here?', isMe: true, avatar: 'https://picsum.photos/seed/james/40/40' },
  { id: 3, sender: 'Mark Smith', time: '02:39 PM', text: 'Sure! Please check the below logo Attached!!!', isMe: false, avatar: 'https://picsum.photos/seed/mark/40/40', attachments: [
    { id: 1, color: 'bg-lime-400', label: 'Nguyen.' },
    { id: 2, color: 'bg-teal-900', label: 'Logo' }
  ]},
];

export default function ChatView() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Chat</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Chat</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/james/40/40" alt="James Hong" className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-sm text-gray-800">James Hong</p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Admin</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white p-1.5 rounded-md shadow-lg shadow-blue-100">
                <Plus size={18} />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search Keyword" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <p className="text-sm font-bold text-gray-800 mb-4">All Messages</p>
              <div className="space-y-1">
                {contacts.map(contact => (
                  <div key={contact.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${contact.id === 1 ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <div className="relative">
                      <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                      {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="font-bold text-sm text-gray-800 truncate">{contact.name}</p>
                        <p className="text-[10px] text-gray-400">{contact.time}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate">{contact.message}</p>
                        {contact.unread ? (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{contact.unread}</span>
                        ) : contact.status === 'read' ? (
                          <CheckCheck size={14} className="text-green-500" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Window Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="https://picsum.photos/seed/mark/40/40" alt="Mark Smith" className="w-10 h-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">Mark Smith</p>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <Phone size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <Video size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <Info size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full border border-gray-100 self-start" referrerPolicy="no-referrer" />
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className={`flex items-center gap-2 mb-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <p className="text-xs font-bold text-gray-800">{msg.sender}</p>
                    <p className="text-[10px] text-gray-400">● {msg.time}</p>
                    {msg.isMe && <CheckCheck size={12} className="text-green-500" />}
                  </div>
                  <div className="flex items-center gap-2 group">
                    {!msg.isMe && <button className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={14} className="text-gray-400" /></button>}
                    <div className={`p-4 rounded-xl text-sm shadow-sm ${msg.isMe ? 'bg-white text-gray-700 border border-gray-100 rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                      {msg.text}
                      {msg.attachments && (
                        <div className="flex gap-3 mt-4">
                          {msg.attachments.map(att => (
                            <div key={att.id} className={`w-16 h-16 rounded-lg ${att.color} flex items-center justify-center text-[10px] text-white font-bold shadow-sm`}>
                              {att.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.isMe && <button className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={14} className="text-gray-400" /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-3">
            <div className="flex-1 relative">
              <input type="text" placeholder="Type Something..." className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <ImageIcon size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <Smile size={18} />
              </button>
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <MoreVertical size={18} />
              </button>
              <button className="bg-blue-600 text-white p-2.5 rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
