import React from 'react';
import { 
  ChevronRight, Plus, Mail, Star, Trash2, 
  ChevronDown, Settings, MoreVertical, ListFilter
} from 'lucide-react';

const navItems = [
  { icon: <Mail size={18} />, label: 'All Tasks', count: 6, active: true },
  { icon: <Star size={18} />, label: 'Starred' },
  { icon: <Trash2 size={18} />, label: 'Trash' },
];

const priorities = [
  { label: 'Low', color: 'bg-green-500' },
  { label: 'Medium', color: 'bg-yellow-500' },
  { label: 'High', color: 'bg-red-500' },
];

const tasks = [
  { title: 'Update calendar and schedule', createdDate: '20 Jun 2025', status: 'Completed', statusColor: 'bg-green-500', dueDate: '25 Jun 2025', progress: 80 },
  { title: 'Finalize project proposal', createdDate: '15 Jun 2025', status: 'On Hold', statusColor: 'bg-pink-500', dueDate: '20 Jun 2025', progress: 60 },
  { title: 'Submit to supervisor by EOD', createdDate: '02 Jun 2025', status: 'Pending', statusColor: 'bg-purple-500', dueDate: '07 Jun 2025', progress: 50 },
  { title: 'Prepare presentation slides', createdDate: '24 May 2025', status: 'Completed', statusColor: 'bg-green-500', dueDate: '30 May 2025', progress: 100 },
  { title: 'Check and respond to emails', createdDate: '18 May 2025', status: 'Pending', statusColor: 'bg-purple-500', dueDate: '07 Jun 2025', progress: 55 },
  { title: 'Daily admin tasks organized', createdDate: '13 May 2025', status: 'Inprogress', statusColor: 'bg-blue-500', dueDate: '18 May 2025', progress: 80 },
  { title: 'Verify insurance eligibility', createdDate: '25 Apr 2025', status: 'Completed', statusColor: 'bg-green-500', dueDate: '27 Apr 2025', progress: 70 },
  { title: 'Send lab results to patient portal', createdDate: '17 Apr 2025', status: 'Pending', statusColor: 'bg-purple-500', dueDate: '27 Apr 2025', progress: 50 },
  { title: 'Keep tasks clear and specific', createdDate: '01 Mar 2025', status: 'Completed', statusColor: 'bg-green-500', dueDate: '05 Mar 2025', progress: 100 },
  { title: 'Use reminders for anything time', createdDate: '21 Mar 2025', status: 'Inprogress', statusColor: 'bg-blue-500', dueDate: '25 Mar 2025', progress: 40 },
];

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="currentColor"
          strokeWidth="2.5"
          fill="transparent"
          className="text-gray-100"
        />
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="currentColor"
          strokeWidth="2.5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-orange-400"
        />
      </svg>
    </div>
  );
};

export default function TodoView() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Todo</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Todo</span>
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

            <div className="pt-6 border-t border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h4 className="text-sm font-bold text-gray-400">Priority</h4>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                {priorities.map((p) => (
                  <div key={p.label} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-2 h-2 rounded-full ${p.color}`} />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between cursor-pointer">
                <h4 className="text-sm font-bold text-gray-400">Categories</h4>
                <ChevronDown size={16} className="text-gray-400" />
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

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">Todo</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">565</span>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <ListFilter size={14} /> Sort By : Newest <ChevronDown size={14} />
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="p-4 font-bold text-gray-800 text-sm">Task Title</th>
                  <th className="p-4 font-bold text-gray-800 text-sm">Created Date</th>
                  <th className="p-4 font-bold text-gray-800 text-sm">Status</th>
                  <th className="p-4 font-bold text-gray-800 text-sm">Due Date</th>
                  <th className="p-4 font-bold text-gray-800 text-sm">Progress</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <span className="text-sm text-gray-500 font-medium">{task.title}</span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm font-medium">{task.createdDate}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded text-[10px] font-bold text-white ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm font-medium">{task.dueDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <CircularProgress percentage={task.progress} />
                        <span className="text-sm font-bold text-gray-800">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
