import React from 'react';
import { 
  ChevronRight, Plus, Phone, MessageSquare, Video, 
  MoreVertical, LayoutGrid, List, Settings 
} from 'lucide-react';

const contacts = [
  { id: 1, name: 'James Jackson', email: 'jamesjackson@example.com', avatar: 'https://picsum.photos/seed/james/64/64' },
  { id: 2, name: 'Robin Coffin', email: 'robin@example.com', avatar: 'https://picsum.photos/seed/robin/64/64' },
  { id: 3, name: 'Vincent Thornburg', email: 'vincent@example.com', avatar: 'https://picsum.photos/seed/vincent/64/64' },
  { id: 4, name: 'Fran Faulkner', email: 'franfaulkner@example.com', avatar: 'https://picsum.photos/seed/fran/64/64' },
  { id: 5, name: 'Ernestine Waller', email: 'Waller@example.com', avatar: 'https://picsum.photos/seed/ernestine/64/64' },
  { id: 6, name: 'Jared Adams', email: 'jaredadams@example.com', avatar: 'https://picsum.photos/seed/jared/64/64' },
  { id: 7, name: 'Reyna Pelfrey', email: 'renyapelfrey@example.com', avatar: 'https://picsum.photos/seed/reyna/64/64' },
  { id: 8, name: 'Rafael Lowe', email: 'rafeallowe@example.com', avatar: 'https://picsum.photos/seed/rafael/64/64' },
  { id: 9, name: 'Enrique Ratcliff', email: 'enrique@example.com', avatar: 'https://picsum.photos/seed/enrique/64/64' },
  { id: 10, name: 'Elizabeth Pegues', email: 'elizabeth@example.com', avatar: 'https://picsum.photos/seed/elizabeth/64/64' },
  { id: 11, name: 'Jenna Alford', email: 'jennaalford@example.com', avatar: 'https://picsum.photos/seed/jenna/64/64' },
  { id: 12, name: 'Teresa Boggs', email: 'teresaboggs@example.com', avatar: 'https://picsum.photos/seed/teresa/64/64' },
];

export default function ContactsView() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6 pt-4">
        <h1 className="text-xl font-bold text-gray-800">Contact</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Contact</span>
        </div>
      </div>

      <div className="px-6 pb-12 flex flex-col gap-6 overflow-y-auto relative">
        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
            <Plus size={18} /> New Contact
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-blue-600 text-white rounded-lg shadow-md">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 bg-white border border-gray-100 text-gray-400 rounded-lg hover:bg-gray-50 transition-colors">
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 mb-6">
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className="w-12 h-12 rounded-xl object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{contact.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{contact.email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <MessageSquare size={16} />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Video size={16} />
                  </button>
                </div>
                <button className="p-2 border border-gray-100 rounded-lg text-gray-300 hover:text-gray-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Settings Button */}
        <button className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all z-10">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
