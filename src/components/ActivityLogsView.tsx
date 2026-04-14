import React from 'react';
import { 
  ChevronRight, LogIn, FileText, MessageSquare, 
  BarChart2, CreditCard, UserPlus, CheckCircle
} from 'lucide-react';

const activityLogs = [
  {
    date: 'Today',
    items: [
      {
        title: 'Checked In – Aug 7, 2025 at 9:07 AM',
        description: 'You successfully checked in today using the mobile app’s biometric system. Your working hours will be calculated from this timestamp. Don’t forget to check out before leaving to avoid discrepancies in attendance logs.',
        icon: <LogIn size={18} />,
        color: 'bg-blue-600',
      },
      {
        title: 'Leave Request Submitted – Casual Leave for Aug 9, 2025 at 03:14 PM',
        description: 'Your payslip for July 2025 has been generated and is available under the Payroll section. Please verify the salary breakdown and raise any queries before Aug 10.',
        icon: <FileText size={18} />,
        color: 'bg-orange-500',
      }
    ]
  },
  {
    date: 'Yesterday',
    items: [
      {
        title: 'Feedback Received - Aug 6, 2025 at 06:55 PM',
        description: 'Your team lead added feedback to your monthly check-in. Review it in the Feedback section.',
        icon: <MessageSquare size={18} />,
        color: 'bg-emerald-500',
      },
      {
        title: 'Performance Review Submitted - Aug 6, 2025 at 05:25 PM',
        description: 'You completed your Q2 FY25 self-assessment. Your manager will review it soon.',
        icon: <BarChart2 size={18} />,
        color: 'bg-purple-600',
      },
      {
        title: 'Bank Details Updated - Aug 6, 2025 at 04:23 PM',
        description: 'Your new salary bank account was saved successfully. All future salary transactions will be directed to this account.',
        icon: <CreditCard size={18} />,
        color: 'bg-pink-600',
      }
    ]
  },
  {
    date: 'Aug 3, 2025',
    items: [
      {
        title: 'Team Change Notified - Aug 3, 2025 at 04:23 PM',
        description: 'You’ve been moved to the Marketing & Outreach department. New reporting lines and goals are active from this date.',
        icon: <UserPlus size={18} />,
        color: 'bg-blue-500',
      },
      {
        title: 'Feedback Received - Aug 3, 2025 at 06:28 PM',
        description: 'Your team lead submitted monthly performance feedback. Check your Feedback tab for details and follow-up actions.',
        icon: <MessageSquare size={18} />,
        color: 'bg-emerald-500',
      },
      {
        title: 'Reimbursement Approved - Aug 3, 2025 at 04:50 PM',
        description: 'Your travel expense reimbursement of ₹1,200 was approved. It will be included in the upcoming payroll.',
        icon: <CheckCircle size={18} />,
        color: 'bg-indigo-600',
      }
    ]
  }
];

export default function ActivityLogsView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Activity Logs</span>
        </div>
      </div>

      <div className="max-w-6xl">
        {activityLogs.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-10 last:mb-0">
            <div className="mb-6">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                {group.date}
              </span>
            </div>

            <div className="relative ml-4 pl-8 border-l border-dashed border-gray-200 space-y-8">
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} className="relative">
                  {/* Timeline Dot/Icon */}
                  <div className={`absolute -left-[49px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${item.color} z-10`}>
                    {item.icon}
                  </div>

                  <div className="pt-0.5">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-4xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Load More Button */}
        <div className="flex justify-center mt-12 mb-8">
          <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
