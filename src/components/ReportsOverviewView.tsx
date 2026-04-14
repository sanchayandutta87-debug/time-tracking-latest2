import React, { useState } from 'react';
import { 
  ChevronRight, Clock, Calendar, Activity, ShieldAlert, 
  Hourglass, CheckSquare, Layout, MousePointer2, Globe, 
  ZapOff, Moon, FileText, Search, Filter, ArrowUpRight
} from 'lucide-react';

const reportTypes = [
  {
    title: 'Timesheet Report',
    description: 'Tracks and summarizes employees working hours Over period.',
    icon: <Clock size={18} />,
    category: 'Attendance'
  },
  {
    title: 'Attendance',
    description: 'Track employee presence, late check-ins, absences & workhours.',
    icon: <Calendar size={18} />,
    category: 'Attendance'
  },
  {
    title: 'Activity Summary',
    description: 'Provides an overview of employee or project-related activities.',
    icon: <Activity size={18} />,
    category: 'Performance'
  },
  {
    title: 'Unusual Activity',
    description: 'Tracks anomalies in employee work patterns or security events.',
    icon: <ShieldAlert size={18} />,
    category: 'Security'
  },
  {
    title: 'Hours Tracked',
    description: 'Tracking project progress, assigned tasks, and time spent.',
    icon: <Hourglass size={18} />,
    category: 'Projects'
  },
  {
    title: 'Projects & Tasks',
    description: 'Tracking project progress, assigned tasks, and time spent.',
    icon: <CheckSquare size={18} />,
    category: 'Projects'
  },
  {
    title: 'Timeline',
    description: 'Perfect for tracking milestones, deadlines and progress.',
    icon: <Layout size={18} />,
    category: 'Projects'
  },
  {
    title: 'Manual Time',
    description: 'Track manually logged hours for who need to record work.',
    icon: <MousePointer2 size={18} />,
    category: 'Attendance'
  },
  {
    title: 'Poor Time Use',
    description: 'Waste time on unproductive tasks, distractions and inefficiency.',
    icon: <Clock size={18} />,
    category: 'Performance'
  },
  {
    title: 'Web & App Usage',
    description: 'Connects people, services, and information instantly.',
    icon: <Globe size={18} />,
    category: 'Activity'
  },
  {
    title: 'Low Activity',
    description: 'Indicates minimal engagement or productivity in situations.',
    icon: <ZapOff size={18} />,
    category: 'Performance'
  },
  {
    title: 'Idle Time',
    description: 'Periods of inactivity or unproductive moments.',
    icon: <Moon size={18} />,
    category: 'Performance'
  },
  {
    title: 'Overtime Limit',
    description: 'Maximum hours worked beyond regular schedule.',
    icon: <Clock size={18} />,
    category: 'Attendance'
  },
  {
    title: 'Working on Weekends',
    description: 'Involves Employee outside the typical Monday-Friday schedule.',
    icon: <Calendar size={18} />,
    category: 'Attendance'
  },
  {
    title: 'Expense Report',
    description: 'Tracks expenditures for reimbursement purposes.',
    icon: <FileText size={18} />,
    category: 'Financial'
  }
];

export default function ReportsOverviewView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Attendance', 'Performance', 'Projects', 'Financial', 'Security', 'Activity'];

  const filteredReports = reportTypes.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || report.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
            <Filter size={16} className="text-gray-400 mr-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map((report, index) => (
          <div 
            key={index} 
            className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            {/* Hover Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{report.title}</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{report.category}</span>
              </div>
              <ArrowUpRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 group-hover:text-gray-600 transition-colors">
              {report.description}
            </p>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] font-bold text-blue-600 uppercase">Generate Report</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold">No reports found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-6 text-blue-600 text-sm font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
