import React from 'react';
import { 
  ChevronRight, Check, Trash2, Clock
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'registration',
    user: {
      name: 'New user registered',
      email: 'emma@example.com',
      avatar: 'https://picsum.photos/seed/emma/40/40',
    },
    content: 'A new user (emma@example.com) signed up at 09:23 AM',
    time: 'Just Now',
    hasActions: true,
    unread: true,
  },
  {
    id: 2,
    type: 'product',
    user: {
      name: 'Elizabeth Olsen',
      avatar: 'https://picsum.photos/seed/elizabeth/40/40',
    },
    content: 'added a new product category Desktop Computers',
    time: '4 min ago',
    unread: true,
  },
  {
    id: 3,
    type: 'sales',
    user: {
      name: 'Minerva Rameriz',
      avatar: 'https://picsum.photos/seed/minerva/40/40',
    },
    content: 'added a new sales list for January Month',
    time: '6 min ago',
    unread: false,
  },
  {
    id: 4,
    type: 'invoice',
    user: {
      name: 'Lesley Grauer',
      avatar: 'https://picsum.photos/seed/lesley/40/40',
    },
    content: 'has updated invoice #987654',
    time: '12 min ago',
    unread: false,
  },
  {
    id: 5,
    type: 'time',
    user: {
      name: 'Carl Evans',
      initials: 'CE',
      color: 'bg-emerald-500',
    },
    content: 'adjust the time for Management Project',
    time: '2 days ago',
    unread: false,
  }
];

export default function NotificationsView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">All Notifications</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">All Notifications</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800">Total Unread : 02</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Check size={16} /> Mark all as read
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-100">
            <Trash2 size={16} /> Delete all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 transition-all hover:shadow-md ${notification.unread ? 'ring-1 ring-blue-100' : ''}`}
          >
            {/* Avatar or Initials */}
            {notification.user.avatar ? (
              <img 
                src={notification.user.avatar} 
                alt={notification.user.name} 
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full ${notification.user.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {notification.user.initials}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-bold text-gray-900">{notification.user.name}</span>{' '}
                    {notification.content.split(' ').map((word, i) => {
                      // Simple bolding logic for specific keywords from screenshot
                      const boldWords = ['Desktop', 'Computers', 'January', 'Month', '#987654', 'Management', 'Project'];
                      return boldWords.includes(word) ? (
                        <span key={i} className="font-bold text-gray-900">{word} </span>
                      ) : (
                        <span key={i}>{word} </span>
                      );
                    })}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{notification.time}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {notification.hasActions && (
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors">
                      Decline
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-100">
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
