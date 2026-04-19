import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Info, MoreVertical, 
  Image as ImageIcon, Smile, Send, CheckCheck, 
  ChevronRight, X, Copy, Trash2, FileText, Link, Bell, BellOff 
} from 'lucide-react';

const initialContacts = [
  { id: 1, name: 'Mark Smith', message: 'Hey Sam! Did you Ch...', time: '10:10 AM', status: 'read', online: true, avatar: 'https://picsum.photos/seed/mark/40/40' },
  { id: 2, name: 'Eugene Sikora', message: 'How are your Today', time: '08:26 AM', unread: 5, online: false, avatar: 'https://picsum.photos/seed/eugene/40/40' },
  { id: 3, name: 'Robert Fassett', message: 'Here are some of ve...', time: 'yesterday', unread: 5, online: true, avatar: 'https://picsum.photos/seed/robert/40/40' },
  { id: 4, name: 'Andrew Fletcher', message: 'Use tools like Trello...', time: 'yesterday', online: false, avatar: 'https://picsum.photos/seed/andrew/40/40' },
];

const initialMessagesData: Record<number, any[]> = {
  1: [
    { id: 1, sender: 'Mark Smith', time: '02:39 PM', text: 'Hey mark! Did you check out the new logo design?', isMe: false, avatar: 'https://picsum.photos/seed/mark/40/40' },
    { id: 2, sender: 'You', time: '02:39 PM', text: 'Not yet. Can you send it here?', isMe: true, avatar: 'https://picsum.photos/seed/james/40/40' },
    { id: 3, sender: 'Mark Smith', time: '02:39 PM', text: 'Sure! Please check the below logo Attached!!!', isMe: false, avatar: 'https://picsum.photos/seed/mark/40/40', attachments: [
      { id: 1, color: 'bg-lime-400', label: 'Nguyen.' },
      { id: 2, color: 'bg-teal-900', label: 'Logo' }
    ]},
  ],
  2: [
    { id: 1, sender: 'Eugene Sikora', time: '08:00 AM', text: 'How are your Today', isMe: false, avatar: 'https://picsum.photos/seed/eugene/40/40' },
  ],
  3: [],
  4: [],
};

const mockSharedMedia = [
  'https://picsum.photos/seed/m1/100/100',
  'https://picsum.photos/seed/m2/100/100',
  'https://picsum.photos/seed/m3/100/100',
  'https://picsum.photos/seed/m4/100/100',
  'https://picsum.photos/seed/m5/100/100',
  'https://picsum.photos/seed/m6/100/100',
];

const EMOJI_LIST = ['😀', '😂', '😍', '👍', '🔥', '✨', '🙌', '🎉', '💡', '✅', '🚀', '❤️', '🤔', '😎', '😢', '💯'];

export default function ChatView() {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContactId, setActiveContactId] = useState(1);
  const [messages, setMessages] = useState<Record<number, any[]>>(initialMessagesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [activeMessageOptions, setActiveMessageOptions] = useState<number | null>(null);

  // Functional features state
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isNotificationsMuted, setIsNotificationsMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const currentMessages = messages[activeContactId] || [];

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      isMe: true,
      avatar: 'https://picsum.photos/seed/james/40/40'
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));

    setContacts(prev => prev.map(c => 
      c.id === activeContactId ? { ...c, message: inputText, time: 'Just now' } : c
    ));

    setInputText('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newMessage = {
          id: Date.now(),
          sender: 'You',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: '',
          imageUrl: imageUrl, 
          isMe: true,
          avatar: 'https://picsum.photos/seed/james/40/40'
        };
        setMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), newMessage]
        }));
        setContacts(prev => prev.map(c => 
          c.id === activeContactId ? { ...c, message: '📷 Image Sent', time: 'Just now' } : c
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleDeleteMessage = (msgId: number) => {
    setMessages(prev => ({
      ...prev,
      [activeContactId]: prev[activeContactId].filter(m => m.id !== msgId)
    }));
    setActiveMessageOptions(null);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setActiveMessageOptions(null);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const newId = Date.now();
    const newContact = {
      id: newId,
      name: newContactName,
      message: 'New conversation started',
      time: 'Just now',
      online: Math.random() > 0.5,
      avatar: `https://picsum.photos/seed/${newId}/40/40`
    };

    setContacts([newContact, ...contacts]);
    setMessages(prev => ({ ...prev, [newId]: [] }));
    setIsAddContactModalOpen(false);
    setNewContactName('');
    setActiveContactId(newId);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
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
        <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/james/40/40" alt="James Hong" className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-sm text-gray-800">James Hong</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Admin</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddContactModalOpen(true)}
                className="bg-blue-600 text-white p-2 rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Keyword" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">All Messages</p>
              <div className="space-y-1">
                {filteredContacts.map(contact => (
                  <div 
                    key={contact.id} 
                    onClick={() => setActiveContactId(contact.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${contact.id === activeContactId ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="relative shrink-0">
                      <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                      {contact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`font-bold text-sm truncate ${contact.id === activeContactId ? 'text-blue-700' : 'text-gray-800'}`}>{contact.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium shrink-0">{contact.time}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${contact.id === activeContactId ? 'text-blue-600/70' : 'text-gray-500'}`}>{contact.message}</p>
                        {contact.unread ? (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{contact.unread}</span>
                        ) : 'status' in contact && contact.status === 'read' ? (
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

        {/* Chat Area & Header & Info Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Chat Window */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden relative border-r border-gray-100">
            {/* Chat Window Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                  {activeContact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{activeContact.name}</p>
                  <p className={`text-[10px] font-bold ${activeContact.online ? 'text-green-500' : 'text-gray-400'}`}>
                    {activeContact.online ? '● Online' : '● Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsInfoOpen(!isInfoOpen)}
                  className={`p-2 rounded-lg transition-colors border ${isInfoOpen ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm' : 'text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                >
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/20 relative">
              {currentMessages.length > 0 ? (
                currentMessages.map(msg => (
                  <div key={msg.id} className={`flex gap-4 group ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full border border-gray-100 self-start shrink-0" referrerPolicy="no-referrer" />
                    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div className={`flex items-center gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        <p className="text-[10px] font-bold text-gray-800">{msg.sender}</p>
                        <p className="text-[10px] text-gray-400">● {msg.time}</p>
                        {msg.isMe && <CheckCheck size={12} className="text-green-500" />}
                      </div>
                      <div className="flex items-center gap-2 relative">
                        {!msg.isMe && (
                           <div className="relative">
                              <button 
                                onClick={() => setActiveMessageOptions(activeMessageOptions === msg.id ? null : msg.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                              >
                                <MoreVertical size={14} className="text-gray-400" />
                              </button>
                              {activeMessageOptions === msg.id && (
                                <div className="absolute left-0 bottom-full mb-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-bottom-2">
                                   <button onClick={() => handleCopyMessage(msg.text)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                                      <Copy size={12} /> Copy
                                   </button>
                                   <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                                      <Trash2 size={12} /> Delete
                                   </button>
                                </div>
                              )}
                           </div>
                        )}
                        <div className={`p-3 rounded-2xl text-sm shadow-sm transition-all ${msg.isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                          {msg.imageUrl ? (
                             <img src={msg.imageUrl} alt="Sent" className="max-w-xs rounded-lg shadow-sm mb-1" />
                          ) : msg.text}
                          {msg.attachments && (
                            <div className="flex gap-3 mt-3">
                              {msg.attachments.map(att => (
                                <div key={att.id} className={`w-14 h-14 rounded-lg ${att.color} flex items-center justify-center text-[10px] text-white font-bold shadow-sm cursor-pointer hover:opacity-80 transition-opacity`}>
                                  {att.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {msg.isMe && (
                           <div className="relative">
                              <button 
                                onClick={() => setActiveMessageOptions(activeMessageOptions === msg.id ? null : msg.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                              >
                                <MoreVertical size={14} className="text-gray-400" />
                              </button>
                              {activeMessageOptions === msg.id && (
                                <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-bottom-2">
                                   <button onClick={() => handleCopyMessage(msg.text)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                                      <Copy size={12} /> Copy
                                   </button>
                                   <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                                      <Trash2 size={12} /> Delete
                                   </button>
                                </div>
                              )}
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Send size={32} className="text-gray-200" />
                   </div>
                   <p className="text-sm font-medium">Start a new conversation with {activeContact.name}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex items-center gap-3 shrink-0 relative">
              {/* Emoji Picker */}
              {isEmojiPickerOpen && (
                 <>
                   <div className="fixed inset-0 z-[70]" onClick={() => setIsEmojiPickerOpen(false)}></div>
                   <div className="absolute bottom-20 right-4 z-[80] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-4">
                      {EMOJI_LIST.map(emoji => (
                        <button 
                          key={emoji}
                          type="button" 
                          onClick={() => addEmoji(emoji)}
                          className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                   </div>
                 </>
              )}

              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Type Something..." 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" 
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-gray-100"
                >
                  <ImageIcon size={20} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`p-2.5 rounded-xl transition-all border ${isEmojiPickerOpen ? 'bg-amber-50 text-amber-500 border-amber-100' : 'text-gray-400 border-gray-100 hover:bg-amber-50'}`}
                >
                  <Smile size={20} />
                </button>
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Send size={22} />
                </button>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          {isInfoOpen && (
            <div className="w-80 bg-white shadow-xl animate-in slide-in-from-right duration-300 border-l border-gray-100 flex flex-col shrink-0">
               <div className="p-6 flex flex-col items-center border-b border-gray-100">
                  <img 
                    src={activeContact.avatar} 
                    alt={activeContact.name} 
                    className="w-24 h-24 rounded-full border-4 border-gray-50 mb-4 shadow-sm" 
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-lg font-black text-gray-800">{activeContact.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Product Manager</p>
                  
                  <div className="flex items-center gap-3 w-full">
                     <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100">Profile</button>
                     <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100">Shared</button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div>
                     <h4 className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Shared Media <span className="text-blue-600 normal-case cursor-pointer hover:underline">View All</span>
                     </h4>
                     <div className="grid grid-cols-3 gap-2">
                        {mockSharedMedia.map((url, i) => (
                          <img key={i} src={url} alt="Shared" className="w-full aspect-square rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
                        ))}
                     </div>
                  </div>

                  <div>
                     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Shared Files</h4>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all group">
                           <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              <FileText size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">Project_Assets.zip</p>
                              <p className="text-[10px] text-gray-400">12.5 MB • 2 days ago</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all group">
                           <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                              <Link size={18} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">Dashboard_Mockups_V2</p>
                              <p className="text-[10px] text-gray-400">figma.com • Oct 12</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-4">
                     <button 
                        onClick={() => setIsNotificationsMuted(!isNotificationsMuted)}
                        className={`flex items-center justify-between w-full p-3 rounded-xl transition-all border ${isNotificationsMuted ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                     >
                        <div className="flex items-center gap-3">
                           {isNotificationsMuted ? <BellOff size={18} /> : <Bell size={18} />}
                           <span className="text-xs font-bold">Mute Notifications</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isNotificationsMuted ? 'bg-amber-400' : 'bg-gray-300'}`}>
                           <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isNotificationsMuted ? 'right-0.5' : 'left-0.5'}`}></div>
                        </div>
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddContactModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add New Contact</h2>
              <button onClick={() => setIsAddContactModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="p-6">
              <input 
                type="text" 
                required
                autoFocus
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                placeholder="Enter contact name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none mb-6"
              />
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Start Chatting
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
