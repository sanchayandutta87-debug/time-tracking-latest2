import React from 'react';
import { 
  ChevronRight, Plus, MoreVertical, MessageSquare, 
  Paperclip, Settings 
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  priorityColor: string;
  progress: number;
  progressColor: string;
  avatars: string[];
  comments: number;
  attachments: number;
  hasPlusOne?: boolean;
}

interface Column {
  id: string;
  title: string;
  count: number;
  tasks: Task[];
}

const kanbanData: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    count: 2,
    tasks: [
      {
        id: '1',
        title: 'Settings Page',
        description: 'Implement the settings page to manage user preferences',
        priority: 'Low',
        priorityColor: 'bg-green-500',
        progress: 0,
        progressColor: 'bg-gray-100',
        avatars: ['https://picsum.photos/seed/k1/24/24', 'https://picsum.photos/seed/k2/24/24'],
        comments: 0,
        attachments: 0,
        hasPlusOne: true,
      },
      {
        id: '2',
        title: 'Applications Page',
        description: 'Implement the Applications pages to manage tools for seamless productivity.',
        priority: 'Medium',
        priorityColor: 'bg-yellow-500',
        progress: 0,
        progressColor: 'bg-gray-100',
        avatars: ['https://picsum.photos/seed/k3/24/24', 'https://picsum.photos/seed/k4/24/24'],
        comments: 0,
        attachments: 0,
      }
    ]
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    count: 3,
    tasks: [
      {
        id: '3',
        title: 'Error Pages',
        description: 'Design and integrate custom error pages for user experience during issues.',
        priority: 'Medium',
        priorityColor: 'bg-yellow-500',
        progress: 40,
        progressColor: 'bg-purple-600',
        avatars: ['https://picsum.photos/seed/k5/24/24', 'https://picsum.photos/seed/k6/24/24', 'https://picsum.photos/seed/k7/24/24'],
        comments: 8,
        attachments: 3,
      },
      {
        id: '4',
        title: 'UI Pages',
        description: 'Develop and refine UI pages to ensure a user-friendly and intuitive interface',
        priority: 'Low',
        priorityColor: 'bg-green-500',
        progress: 70,
        progressColor: 'bg-orange-500',
        avatars: ['https://picsum.photos/seed/k8/24/24', 'https://picsum.photos/seed/k9/24/24'],
        comments: 10,
        attachments: 6,
      },
      {
        id: '5',
        title: 'Customizer',
        description: 'Build a customizer panel to allow users to personalize layout, theme, and UI settings',
        priority: 'High',
        priorityColor: 'bg-red-500',
        progress: 50,
        progressColor: 'bg-blue-600',
        avatars: ['https://picsum.photos/seed/k10/24/24', 'https://picsum.photos/seed/k11/24/24', 'https://picsum.photos/seed/k12/24/24'],
        comments: 12,
        attachments: 4,
      }
    ]
  },
  {
    id: 'completed',
    title: 'Completed',
    count: 2,
    tasks: [
      {
        id: '6',
        title: 'Dashboard',
        description: 'Create an interactive dashboard to display key metrics and system summaries',
        priority: 'Low',
        priorityColor: 'bg-green-500',
        progress: 100,
        progressColor: 'bg-green-500',
        avatars: ['https://picsum.photos/seed/k13/24/24', 'https://picsum.photos/seed/k14/24/24', 'https://picsum.photos/seed/k15/24/24'],
        comments: 15,
        attachments: 12,
      },
      {
        id: '7',
        title: 'Authentication Pages',
        description: 'Develop authentication pages including login, registration & password management',
        priority: 'Medium',
        priorityColor: 'bg-yellow-500',
        progress: 100,
        progressColor: 'bg-green-500',
        avatars: ['https://picsum.photos/seed/k16/24/24', 'https://picsum.photos/seed/k17/24/24', 'https://picsum.photos/seed/k18/24/24'],
        comments: 10,
        attachments: 6,
      }
    ]
  }
];

export default function KanbanView() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Kanban View</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Kanban View</span>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden relative">
        {/* Floating Settings Icon */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10">
          <button className="bg-blue-600 text-white p-2 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all">
            <Settings size={20} />
          </button>
        </div>

        {kanbanData.map((column) => (
          <div key={column.id} className="flex-1 flex flex-col min-w-[320px] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base">{column.title}</h3>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {column.count}
                </span>
              </div>
              <button className="p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors">
                <Plus size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {column.tasks.map((task) => (
                <div key={task.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${task.priorityColor}`}>
                      {task.priority}
                    </span>
                    <button className="p-1 text-gray-300 hover:text-gray-600 border border-gray-100 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <h4 className="font-bold text-gray-800 text-sm mb-2">{task.title}</h4>
                  <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-[11px] font-bold text-gray-400 mb-2">Progress : {task.progress}%</p>
                    <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${task.progressColor} transition-all duration-500`} 
                        style={{ width: `${task.progress}%` }} 
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {task.avatars.map((avatar, idx) => (
                        <img 
                          key={idx} 
                          src={avatar} 
                          alt="user" 
                          className="w-6 h-6 rounded-full border-2 border-white" 
                          referrerPolicy="no-referrer" 
                        />
                      ))}
                      {task.hasPlusOne && (
                        <div className="w-6 h-6 rounded-full bg-gray-800 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white relative z-10">
                          1+
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-bold">{task.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Paperclip size={14} />
                        <span className="text-[10px] font-bold">{task.attachments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all mt-4">
                <Plus size={18} /> New Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
