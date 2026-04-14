import React from 'react';
import { 
  ChevronRight, Plus, Inbox, Star, Clock, Send, 
  FileText, AlertCircle, MessageSquare, Calendar, 
  ChevronDown, Archive, Trash2, ShieldAlert, 
  MoreVertical, Search, Settings
} from 'lucide-react';

const mailNav = [
  { icon: <Inbox size={18} />, label: 'Inbox', count: 6, active: true },
  { icon: <Star size={18} />, label: 'Starred' },
  { icon: <Clock size={18} />, label: 'Snoozed' },
  { icon: <Send size={18} />, label: 'Sent' },
  { icon: <FileText size={18} />, label: 'Drafts' },
  { icon: <AlertCircle size={18} />, label: 'Important' },
  { icon: <MessageSquare size={18} />, label: 'Chats' },
  { icon: <Calendar size={18} />, label: 'Scheduled' },
];

const emails = [
  {
    id: 1,
    sender: 'Sarah, me (7)',
    avatar: 'https://picsum.photos/seed/sarah/32/32',
    subject: '[Reminder] Client Meeting at 3 PM Today',
    snippet: 'Hi John, just a quick reminder about our meeting with...',
    time: '4:15 PM',
    starred: false,
  },
  {
    id: 2,
    sender: 'Mike, team (5)',
    avatar: 'https://picsum.photos/seed/mike/32/32',
    subject: 'Submit Project Proposal',
    snippet: 'Hi Team, please ensure that your sections of the ...',
    time: '5:00 PM',
    starred: false,
  },
  {
    id: 3,
    sender: 'Anna',
    avatar: 'https://picsum.photos/seed/anna/32/32',
    subject: 'Team Outing Next Friday',
    snippet: 'Hello Everyone, we’re planning a team outing next Friday...',
    time: '1:00 PM',
    starred: false,
    tag: { label: 'Marketing', color: 'bg-blue-500' },
  },
  {
    id: 4,
    sender: 'Tom',
    avatar: 'https://picsum.photos/seed/tom/32/32',
    subject: '[Update] New Design Guidelines Available',
    snippet: 'Hi all, the new design guidelines have been finalized...',
    time: '3:30 PM',
    starred: false,
    tag: { label: 'Client', color: 'bg-orange-400' },
  },
  {
    id: 5,
    sender: 'Lisa',
    avatar: 'https://picsum.photos/seed/lisa/32/32',
    subject: '[Event] Webinar on Social Media Strategy',
    snippet: 'Don’t forget to register for our webinar covering advanced...',
    time: '2:45 PM',
    starred: false,
  },
  {
    id: 6,
    sender: 'Jason, me (9)',
    avatar: 'https://picsum.photos/seed/jason/32/32',
    subject: '[Reminder] Sales Targets Review',
    snippet: 'Hey Team, please prepare your sales reports for the review...',
    time: '10:00 AM',
    starred: false,
  },
  {
    id: 7,
    sender: 'Emily',
    avatar: 'https://picsum.photos/seed/emily/32/32',
    subject: '[Alert] System Maintenance Scheduled',
    snippet: 'Dear Team, please be aware that there will be system...',
    time: '12:00 AM',
    starred: false,
    tag: { label: 'Personal', color: 'bg-emerald-500' },
  },
];

export default function EmailView() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6 pt-4">
        <h1 className="text-xl font-bold text-gray-800">Email</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Email</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden border-t border-gray-100">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-100 flex flex-col p-4 gap-4 overflow-y-auto">
          <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
            <Plus size={18} /> Compose New
          </button>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600">
              <span>Mail</span>
              <ChevronDown size={14} />
            </div>
            {mailNav.map((item) => (
              <div 
                key={item.label} 
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.count && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600">
              <span>Others</span>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600">
              <span>Labels</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <div className="flex items-center gap-1 ml-2">
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                  <Archive size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                  <ShieldAlert size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-4 pr-10 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => (
              <div 
                key={email.id} 
                className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors group"
              >
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0" />
                <Star size={18} className={`shrink-0 ${email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                <img src={email.avatar} alt={email.sender} className="w-8 h-8 rounded-full shrink-0" referrerPolicy="no-referrer" />
                <div className="w-32 shrink-0">
                  <span className="text-sm font-medium text-gray-700 truncate block">{email.sender}</span>
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800 truncate shrink-0">{email.subject}</span>
                  <span className="text-sm text-gray-400 truncate">{email.snippet}</span>
                </div>
                {email.tag && (
                  <span className={`${email.tag.color} text-white text-[10px] font-bold px-2 py-0.5 rounded shrink-0`}>
                    {email.tag.label}
                  </span>
                )}
                <div className="w-20 text-right shrink-0">
                  <span className="text-xs font-bold text-gray-800">{email.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Settings Button */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
