import React from 'react';
import { 
  ChevronRight, Plus, Mail, Star, Trash2, FileText, 
  MoreVertical, ChevronDown, Settings 
} from 'lucide-react';

const navItems = [
  { icon: <Mail size={18} />, label: 'All Notes', count: 6, active: true },
  { icon: <Star size={18} />, label: 'Starred' },
  { icon: <Trash2 size={18} />, label: 'Trash' },
  { icon: <FileText size={18} />, label: 'Draft' },
];

const labels = [
  { label: 'Low', color: 'bg-green-500' },
  { label: 'Medium', color: 'bg-yellow-500' },
  { label: 'High', color: 'bg-red-500' },
];

const notes = [
  { 
    title: 'Meeting with Product Team', 
    description: 'Discuss dashboard revamp and analytics tracking.', 
    priority: 'Low', 
    priorityColor: 'bg-green-500', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p1/32/32'
  },
  { 
    title: 'Submit Quarterly Report', 
    description: 'Compile a comprehensive report for covering sales performance.', 
    priority: 'Low', 
    priorityColor: 'bg-green-500', 
    starred: true,
    avatar: 'https://picsum.photos/seed/p2/32/32'
  },
  { 
    title: 'Follow-up with HR', 
    description: 'Review and verify the current onboarding status of all hires.', 
    priority: 'Medium', 
    priorityColor: 'bg-fuchsia-600', 
    starred: true,
    avatar: 'https://picsum.photos/seed/p3/32/32'
  },
  { 
    title: 'Design Feedback Notes', 
    description: 'Adjust the form layout to reduce vertical and horizontal spacing', 
    priority: 'Medium', 
    priorityColor: 'bg-fuchsia-600', 
    starred: true,
    avatar: 'https://picsum.photos/seed/p4/32/32'
  },
  { 
    title: 'Call Vendor Support', 
    description: 'The printer maintenance issue is still pending requires attention.', 
    priority: 'High', 
    priorityColor: 'bg-red-500', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p5/32/32'
  },
  { 
    title: 'Give me the staff guide', 
    description: 'The patient contacted us to request a rescheduling.', 
    priority: 'Low', 
    priorityColor: 'bg-green-500', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p6/32/32'
  },
  { 
    title: 'Insurance Update', 
    description: 'We have received the updated insurance card from the patient.', 
    priority: 'High', 
    priorityColor: 'bg-red-500', 
    starred: true,
    avatar: 'https://picsum.photos/seed/p7/32/32'
  },
  { 
    title: 'Staff Reminder', 
    description: 'A reminder was sent to the team regarding the scheduled meeting', 
    priority: 'Medium', 
    priorityColor: 'bg-fuchsia-600', 
    starred: true,
    avatar: 'https://picsum.photos/seed/p8/32/32'
  },
  { 
    title: 'General Task Tracking', 
    description: 'Printer cartridges and paper stock have been ordered.', 
    priority: 'High', 
    priorityColor: 'bg-red-500', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p9/32/32'
  },
  { 
    title: 'Insurance Inquiry', 
    description: 'Patient called to check status of last insurance claim for lab tests. Patien...', 
    priority: 'Low', 
    priorityColor: 'bg-green-500', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p10/32/32'
  },
  { 
    title: 'Maintenance Request', 
    description: 'Noted recurring jam in front desk printer. Called vendor support.', 
    priority: 'High', 
    priorityColor: 'bg-red-500', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p11/32/32'
  },
  { 
    title: 'Internal Task', 
    description: 'Ordered toner, copy paper, and cleaning supplies.', 
    priority: 'Medium', 
    priorityColor: 'bg-fuchsia-600', 
    starred: false,
    avatar: 'https://picsum.photos/seed/p12/32/32'
  },
];

export default function NotesView() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Notes</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Notes</span>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 mb-6 hover:bg-blue-700 transition-all">
              <Plus size={18} /> Add Task
            </button>

            <nav className="space-y-1 mb-8">
              {navItems.map((item) => (
                <div key={item.label} className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
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
            </nav>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h4 className="text-sm font-bold text-gray-400">Labels</h4>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                {labels.map((label) => (
                  <div key={label.label} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-2 h-2 rounded-full ${label.color}`} />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{label.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 pb-12 relative">
          {/* Floating Settings Icon */}
          <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10">
            <button className="bg-blue-600 text-white p-2 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all">
              <Settings size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col group hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${note.priorityColor}`}>
                    {note.priority}
                  </span>
                  <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
                </div>
                
                <h3 className="font-bold text-gray-800 text-base mb-2">{note.title}</h3>
                <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2">
                  {note.description}
                </p>

                <div className="mt-auto flex justify-between items-center">
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-lg border border-gray-100 transition-colors ${note.starred ? 'bg-yellow-50 border-yellow-100' : 'hover:bg-gray-50'}`}>
                      <Star size={16} className={note.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} />
                    </button>
                    <button className="p-2 rounded-lg border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-colors">
                      <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <img src={note.avatar} alt="user" className="w-8 h-8 rounded-lg border border-gray-100" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
