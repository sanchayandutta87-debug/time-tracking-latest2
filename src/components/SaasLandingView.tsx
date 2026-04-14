import React, { useState } from 'react';
import { 
  Check, Play, Users, Zap, Shield, 
  BarChart3, Globe, ArrowRight, Star,
  Menu, X, Box, Clock, Layout, 
  FileText, Calendar, DollarSign, 
  TrendingUp, Search, Bell, Moon,
  ChevronRight, ChevronLeft, Plus,
  Monitor, Smartphone, Mail, Settings,
  Activity, PieChart, Briefcase, Lock,
  Notebook, Phone, LayoutDashboard, List,
  Umbrella, UserCheck, Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminDashboardView from './AdminDashboardView';

export default function SaasLandingView() {
  const [activeTab, setActiveTab] = useState('time');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tabs = [
    { id: 'time', label: 'Time & Tracking' },
    { id: 'manage', label: 'Manage & Approvals' },
    { id: 'admin', label: 'Administrator & Settings' },
    { id: 'people', label: 'Peoples & Management' },
  ];

  const features = [
    { 
      icon: <Clock className="text-blue-600" />, 
      title: 'Flexible Time Tracker', 
      desc: 'Every team member can track work time, whether in-office or remote, part-time or full-time, by hour or project.' 
    },
    { 
      icon: <Layout className="text-emerald-600" />, 
      title: 'Maximize Productivity', 
      desc: 'Increased workload visibility enables you to boost productivity to 90%+ by eliminating roadblocks and creating more focus time.' 
    },
    { 
      icon: <DollarSign className="text-orange-600" />, 
      title: 'Project Budgeting', 
      desc: 'Stay on top of each project and visualize progress in the way that works best for you. Allocate time resources wisely to hit deadlines.' 
    },
    { 
      icon: <BarChart3 className="text-purple-600" />, 
      title: 'Performance insights', 
      desc: 'Having your team\'s work data provides you with performance insights to assign resources wisely and get the best out of their work.' 
    },
  ];

  const reports = [
    { icon: <FileText size={20} />, title: 'Timesheet Report', desc: 'Tracks and summarizes employees working hours over period.' },
    { icon: <Clock size={20} />, title: 'Poor Time Use', desc: 'Waste time on unproductive tasks, distractions and inefficiency.' },
    { icon: <Calendar size={20} />, title: 'Hours Tracked', desc: 'Tracking project progress, assigned tasks, and time spent.' },
    { icon: <Globe size={20} />, title: 'Web & App Usage', desc: 'Connects people, services, and information instantly.' },
    { icon: <Calendar size={20} />, title: 'Attendance', desc: 'Track employee presence, late check-ins, absences & workhours.' },
    { icon: <Briefcase size={20} />, title: 'Projects & Tasks', desc: 'Effortlessly manage projects and tasks in one centralized platform for streamlined workflow.' },
    { icon: <TrendingUp size={20} />, title: 'Activity Summary', desc: 'Provides an overview of employee or project-related activities.' },
    { icon: <Layout size={20} />, title: 'Timeline', desc: 'Perfect for tracking milestones, deadlines and progress.' },
    { icon: <Activity size={20} />, title: 'Unusual Activity', desc: 'Tracks anomalies in employee work patterns or security events.' },
    { icon: <Notebook size={20} />, title: 'Manual Time', desc: 'Track manually logged hours for who need to record work.' },
  ];

  const testimonials = [
    { name: 'David Anderson', role: 'Marketing Manager', text: 'I love the instant transfer feature! It makes sending money to friends and family so easy.', avatar: 'https://picsum.photos/seed/david/100/100' },
    { name: 'James Carter', role: 'Graphic Designer', text: 'The budgeting tools are fantastic. They\'ve really helped me keep track of my Time!', avatar: 'https://picsum.photos/seed/james/100/100' },
    { name: 'Jane Doe', role: 'Data Scientist', text: 'I\'ve never felt more secure about my online. The features are top-notch!', avatar: 'https://picsum.photos/seed/jane/100/100' },
    { name: 'Danica Valdez', role: 'Accountant', text: 'Setting up my account was so quick and easy. I was amazed at how fast everything was!', avatar: 'https://picsum.photos/seed/danica/100/100' },
    { name: 'Brian Ramirez', role: 'Financial Analyst', text: 'This banking app has completely changed how I manage my finances.', avatar: 'https://picsum.photos/seed/brian/100/100' },
  ];

  const pricingPlans = [
    { name: 'Free', price: '0', desc: 'Best for personal use', features: ['Task Management', 'Project Planning', 'Team Collaboration', 'Notifications', 'What you get'] },
    { name: 'Starter', price: '8', desc: 'Best for personal use', features: ['Kanban Boards', 'Gantt Charts', 'Resource Allocation', 'Calendar Integration', 'Progress Tracking'] },
    { name: 'Business', price: '16', desc: 'Best for personal use', popular: true, features: ['Customizable Workflows', 'Reporting and Analytics', 'Document Management', 'Agile Methodology', 'Issue Tracking'] },
    { name: 'Enterprise', price: 'Custom', desc: 'Best for personal use', features: ['SSO', 'All integrations', 'Client Collaboration 2FA', 'Advanced Project Plan', 'Mobile App Integration'] },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Clock size={20} />
          </div>
          <span className="text-2xl font-black text-[#0a0a1a] tracking-tighter">Dreams Timer</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'Features', 'Demo', 'Pricing', 'Downloads', 'Resources', 'Contact Us'].map((item) => (
            <a key={item} href="#" className="text-[15px] font-bold text-gray-600 hover:text-blue-600 transition-colors">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-lg text-[15px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Login</button>
          <button className="px-6 py-2.5 rounded-lg text-[15px] font-bold text-white bg-black hover:bg-gray-900 transition-all">Start Free Trial</button>
          <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />
          <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-lg text-[15px] font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all">
            <Calendar size={18} /> Book a Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-20 pb-32 overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-100 shadow-sm text-[#0a0a1a] text-sm font-bold mb-8">
              <span className="text-orange-500">🔥</span> Workforce Productivity Analytics Software
            </div>
            
            <h1 className="text-5xl lg:text-[72px] font-black text-[#1a1a3a] leading-[1.05] mb-8 tracking-tight">
              AI Powered Real-Time Insights <span className="text-orange-500">for Smarter Workflows.</span>
            </h1>
            
            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-xl font-medium">
              Maximize productivity with our intuitive web-based time-tracker perfect for remote work, team management, and tracking billable hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-lg text-lg font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 group">
                Start track time for Free
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <img key={i} src={`https://picsum.photos/seed/user${i}/48/48`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <div>
                  <div className="flex text-orange-400 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-[15px] font-bold text-gray-800">5000+ Reviews</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:translate-x-12"
          >
            <div className="bg-white rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transform lg:rotate-[-1deg] flex h-[600px]">
              {/* Mock Sidebar for Preview */}
              <div className="w-64 border-r border-gray-100 bg-white p-6 shrink-0 hidden md:block">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Clock size={18} />
                  </div>
                  <span className="text-lg font-black text-[#0a0a1a] tracking-tighter">Dreams Timer</span>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={18} /> Dashboard
                        </div>
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                      <div className="pl-11 space-y-3">
                        <p className="text-sm font-bold text-blue-600">Admin Dashboard</p>
                        <p className="text-sm font-medium text-gray-400">User Dashboard</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4 pl-3">
                      <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-3"><Box size={18} /> Application</div>
                        <ChevronRight size={14} />
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-3"><Layout size={18} /> Layouts</div>
                        <ChevronRight size={14} />
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Globe size={18} /> Saas Landing</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Track</p>
                    <div className="space-y-4 pl-3">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Activity size={18} /> Live Tracking</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><FileText size={18} /> Timesheet</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Calendar size={18} /> Leave</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Users size={18} /> Attendance</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><DollarSign size={18} /> Expense</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Manage</p>
                    <div className="space-y-4 pl-3">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Box size={18} /> Projects</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><List size={18} /> Tasks</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Monitor size={18} /> Screenshots</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Clock size={18} /> Edit Time</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><TrendingUp size={18} /> Download</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Workforce</p>
                    <div className="space-y-4 pl-3">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Users size={18} /> Employees</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Users size={18} /> Teams</div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500"><Users size={18} /> Clients</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="flex-1 overflow-hidden pointer-events-none bg-gray-50">
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <Menu size={20} className="text-gray-400" />
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search Keyword" className="bg-gray-50 border border-gray-100 rounded-lg py-2 pl-10 pr-20 text-sm w-80" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400">
                        ctrl + K
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Bell size={20} className="text-gray-400" />
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white shadow-sm" />
                  </div>
                </div>
                <div className="scale-[0.85] origin-top-left w-[118%] h-full">
                  <AdminDashboardView />
                </div>
              </div>
            </div>
            {/* Background glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Highlighted Features */}
      <section className="px-6 lg:px-12 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Features ]</span>
            <h2 className="text-4xl font-black text-[#0a0a1a]">Explore Highlighted Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-blue-600 transition-all" />
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                </div>
                <h3 className="text-xl font-bold text-[#0a0a1a] mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Marquee */}
          <div className="relative flex overflow-x-hidden border-y border-gray-100 py-10">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
              {[1, 2, 3].map((_) => (
                <React.Fragment key={_}>
                  <span className="text-3xl font-bold text-gray-200 flex items-center gap-4">
                    <span className="text-blue-600">✦</span> Actionable Time Insights
                  </span>
                  <span className="text-3xl font-bold text-gray-200 flex items-center gap-4">
                    <span className="text-blue-600">✦</span> Maximize Productivity
                  </span>
                  <span className="text-3xl font-bold text-gray-200 flex items-center gap-4">
                    <span className="text-blue-600">✦</span> Project Budgeting
                  </span>
                  <span className="text-3xl font-bold text-blue-600 flex items-center gap-4">
                    <span className="text-blue-600">✦</span> Manage Hybrid & Remote Teams
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All-in-one Section */}
      <section className="px-6 lg:px-12 py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Time Tracking Web App ]</span>
            <h2 className="text-4xl font-black text-[#0a0a1a]">Features of Our All-in-one Dreams Timer</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-lg font-bold text-[15px] transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-gray-100 shadow-xl grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-black text-[#0a0a1a] mb-4">Time & Track</h3>
                <p className="text-gray-500 leading-relaxed">Increased workload visibility enables you to boost productivity to 90%+ by eliminating roadblocks and creating more focus time.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: <Zap className="text-pink-500" />, title: 'Live Tracking', desc: 'Real-Time Monitoring for Maximum Productivity', bg: 'bg-pink-50' },
                  { icon: <FileText className="text-emerald-500" />, title: 'Timesheet', desc: 'Effortless Timesheet Management for Accurate Payroll', bg: 'bg-emerald-50' },
                  { icon: <ArrowRight className="text-blue-500" />, title: 'Leave', desc: 'Simplify Employee Leave Requests and Approvals', bg: 'bg-blue-50' },
                  { icon: <Users className="text-orange-500" />, title: 'Attendance', desc: 'Real-Time Attendance Insights at Your Fingertips', bg: 'bg-orange-50' },
                  { icon: <DollarSign className="text-purple-500" />, title: 'Expense', desc: 'Track, Approve, and Manage Expenses with Ease', bg: 'bg-purple-50' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group cursor-pointer">
                    <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0a0a1a] mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-600 rounded-[24px] p-4 shadow-2xl">
                <div className="bg-white rounded-[16px] overflow-hidden h-[500px]">
                   <div className="scale-[0.7] origin-top-left w-[140%] h-[140%] pointer-events-none">
                      <AdminDashboardView />
                   </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Productivity</p>
                    <p className="text-lg font-black text-[#0a0a1a]">+24%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Reports */}
      <section className="px-6 lg:px-12 py-24 bg-[#05050a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Reports ]</span>
            <h2 className="text-4xl font-black text-white">Detailed Reports to Optimize Time & Productivity</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              {reports.map((report, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-400">
                    <div className="w-8 h-8 bg-blue-400/10 rounded-lg flex items-center justify-center">
                      {report.icon}
                    </div>
                    <h4 className="font-bold text-white">{report.title}</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{report.desc}</p>
                </div>
              ))}
            </div>

            <div className="relative flex justify-center">
              <div className="w-[400px] h-[400px] bg-blue-600 relative flex items-center justify-center clip-arrow">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-800" />
                <ArrowRight size={120} className="text-white relative z-10 rotate-180" />
              </div>
              {/* Decorative stars */}
              <div className="absolute top-0 right-0 text-blue-400 animate-pulse"><Star size={32} /></div>
              <div className="absolute bottom-10 right-20 text-blue-400 animate-pulse delay-700"><Star size={24} /></div>
              <div className="absolute top-1/2 -left-10 w-1 h-64 bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="px-6 lg:px-12 py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Integrations ]</span>
          <h2 className="text-4xl font-black text-[#0a0a1a] mb-20">Effortlessly Integrate with Your Favorite Tools</h2>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 overflow-hidden">
              <div className="h-[600px] scale-[0.8] origin-top pointer-events-none">
                <AdminDashboardView />
              </div>
            </div>
            
            {/* Floating integration icons */}
            {[
              { icon: 'B', top: '20%', left: '-10%', bg: 'bg-black text-white' },
              { icon: 'K', top: '45%', left: '-8%', bg: 'bg-pink-100 text-pink-600' },
              { icon: 'S', top: '10%', right: '-5%', bg: 'bg-blue-50 text-blue-600' },
              { icon: 'C', top: '35%', right: '-10%', bg: 'bg-blue-600 text-white' },
              { icon: 'Z', top: '65%', right: '-8%', bg: 'bg-blue-500 text-white' },
            ].map((item, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className={`absolute ${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl z-20`}
                style={{ top: item.top, left: item.left, right: item.right }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>

          <div className="mt-24 flex flex-wrap justify-center items-center gap-16 grayscale opacity-40">
            {['ClickUp', 'loom', 'flock', 'MERCURY', 'ahrefs', 'circleci'].map((brand) => (
              <span key={brand} className="text-2xl font-black tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Modules */}
      <section className="px-6 lg:px-12 py-24 bg-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-[#0a0a1a] mb-6">Advanced Modules</h2>
            <p className="text-gray-500">Everything is under your control you can schedule your announcement plan your feeds and create posts with one click Being the right thing in the right time, Connects people, services, and information instantly.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {['Clients', 'Projects', 'Insights', 'Screenshots', 'Employees', 'Clients', 'Projects', 'Insights', 'Screenshots'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
                <Check size={16} className="text-emerald-500" /> {item}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-12 items-end">
            <div className="text-center max-w-[200px]">
              <p className="text-sm font-bold text-[#0a0a1a] mb-4">Voted in 210 Categories</p>
              <p className="text-xs text-gray-400">Automated savings has changed my life! I\'m saving more than I ever thought possible.</p>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-t-2xl border-x border-t border-gray-100 shadow-lg text-center w-40">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">G2</div>
                <p className="text-2xl font-black text-[#0a0a1a]">Leader</p>
                <p className="text-[10px] font-bold text-white bg-orange-500 px-2 py-1 rounded mt-2 uppercase">Enterprise</p>
                <p className="text-sm font-black mt-2">WINTER 2023</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 lg:px-12 py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Testimonials ]</span>
            <h2 className="text-4xl font-black text-[#0a0a1a]">Perfect the Customer Experience</h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-12 no-scrollbar">
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-[350px] bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-[#0a0a1a]">{t.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex text-orange-400">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 lg:px-12 py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Plans & Pricing ]</span>
            <h2 className="text-4xl font-black text-[#0a0a1a]">Choose Plan That\'s Right For You</h2>
          </div>

          <div className="flex justify-center mb-16">
            <div className="bg-white p-1 rounded-xl border border-gray-100 shadow-sm flex">
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Yearly
              </button>
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white p-8 rounded-3xl border-2 transition-all relative flex flex-col ${plan.popular ? 'border-blue-600 shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm hover:shadow-xl'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-[#0a0a1a] mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400 font-medium">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0a0a1a]">{plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-400 font-bold">/month</span>}
                  </div>
                </div>

                <button className={`w-full py-4 rounded-xl font-bold text-sm mb-8 transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100' : 'bg-black text-white hover:bg-gray-900'}`}>
                  {plan.name === 'Enterprise' ? <><Phone size={18} /> Contact Us</> : <><Plus size={18} /> Buy Now</>}
                </button>

                <div className="space-y-4 flex-1">
                  <p className="text-xs font-black text-[#0a0a1a] uppercase tracking-wider">What you get:</p>
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-gray-600">
                      <Check size={16} className="text-blue-600 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Stats */}
      <section className="px-6 lg:px-12 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-4xl font-black text-[#0a0a1a] mb-8 leading-tight">Don\'t hesitate to ask, we are here for you</h2>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img src="https://picsum.photos/seed/team/800/500" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl hover:scale-110 transition-transform">
                    <Play size={32} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { q: 'Is the Regular License the same thing?', a: 'To use it efficiently general knowledge of Front-end development is required. Also, keep in mind that the template does not contain the back end.', open: true },
                { q: 'How do you clone a Dreams Timer?', a: '' },
                { q: 'Can I track time manually and automatically?', a: '' },
                { q: 'Does it integrate with other tools?', a: '' },
                { q: 'Can I export reports to Excel or PDF?', a: '' },
                { q: 'How can I contact support?', a: '' },
              ].map((faq, i) => (
                <div key={i} className={`p-6 rounded-xl border transition-all ${faq.open ? 'border-blue-600 bg-white shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex justify-between items-center cursor-pointer">
                    <h4 className={`font-bold ${faq.open ? 'text-[#0a0a1a]' : 'text-gray-700'}`}>{faq.q}</h4>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${faq.open ? 'bg-blue-600 text-white' : 'text-gray-400 border border-gray-200'}`}>
                      {faq.open ? <ChevronRight size={14} className="rotate-90" /> : <ChevronRight size={14} />}
                    </div>
                  </div>
                  {faq.open && faq.a && (
                    <p className="mt-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { val: '110+', label: 'Automation templates for creating your' },
                { val: '4M', label: 'Hours Logged, Tracked, and Optimized for' },
                { val: '99.99%', label: 'Uptime for a Reliable, Always-Available' },
                { val: '24/7', label: 'Customer Support to Keep You Running' },
              ].map((stat, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-5xl font-black text-white">{stat.val}</p>
                  <p className="text-sm text-gray-400 max-w-[180px] mx-auto">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="px-6 lg:px-12 py-24 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-4 block">[ Resources ]</span>
            <h2 className="text-4xl font-black text-[#0a0a1a]">See Our Thoughts And Ideas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <button className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 z-10 border border-gray-100">
              <ChevronLeft size={24} />
            </button>
            <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 z-10 border border-gray-100">
              <ChevronRight size={24} />
            </button>
            
            {[
              { title: 'The Impact of Technology on the Workplace replacing AI', author: 'Daniel Walker', date: 'August 20, 2025', img: 'https://picsum.photos/seed/blog1/600/400' },
              { title: 'How Time Tracking Boosts Productivity and Efficiency', author: 'John Mitchell', date: 'August 16, 2025', img: 'https://picsum.photos/seed/blog2/600/400' },
              { title: 'The Best Time Management Techniques for Teams', author: 'John Mitchell', date: 'August 06, 2025', img: 'https://picsum.photos/seed/blog3/600/400' },
            ].map((blog, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="h-64 overflow-hidden">
                  <img src={blog.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/${blog.author}/40/40`} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                      <span className="text-sm font-bold text-gray-700">{blog.author}</span>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{blog.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0a0a1a] leading-tight group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track UI Section */}
      <section className="px-6 lg:px-12 py-24 bg-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50" />
              
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-sm mx-auto lg:mx-0">
                <h3 className="text-xl font-bold text-gray-700 mb-8">Track</h3>
                <div className="space-y-6">
                  {/* Live Tracking */}
                  <div className="relative group">
                    <div className="absolute -left-8 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                    <div className="flex items-center justify-between p-4 bg-blue-50/80 rounded-2xl border border-blue-100/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                          <Activity size={20} />
                        </div>
                        <span className="text-lg font-bold text-blue-600">Live Tracking</span>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <div className="absolute w-5 h-5 bg-red-500/20 rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>

                  {/* Timesheet */}
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all">
                      <Calendar size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Timesheet</span>
                  </div>

                  {/* Leave */}
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all">
                      <Umbrella size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Leave</span>
                  </div>

                  {/* Attendance */}
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all">
                      <UserCheck size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Attendance</span>
                  </div>

                  {/* Expense */}
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all">
                      <Receipt size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Expense</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4 block">Real-Time Monitoring</span>
              <h2 className="text-4xl lg:text-5xl font-black text-[#0a0a1a] mb-8 leading-tight">
                Complete Visibility into Your <span className="text-blue-600">Workforce</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                Our advanced tracking suite gives you real-time insights into team activity, project progress, and resource allocation. Stay ahead with automated timesheets and live presence monitoring.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Live Presence', desc: 'See who is online and what they are working on in real-time.' },
                  { title: 'Automated Timesheets', desc: 'Eliminate manual entry with precise, automated time logs.' },
                  { title: 'Expense Management', desc: 'Track project-related expenses and reimbursements seamlessly.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                      <Check size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0a0a1a] mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-12 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3 group">
                Explore Tracking <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 pt-24 pb-12 bg-[#05050a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-4 gap-16 mb-32">
            <div className="col-span-1 lg:col-span-1">
              <h4 className="text-xl font-black text-white mb-8">Subscribe to Newsletter</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-6 text-white outline-none focus:border-blue-600 transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <ArrowRight size={20} />
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500 leading-relaxed">By subscribing you agree to with our Privacy Policy and provide consent to receive updates from our company.</p>
            </div>

            <div>
              <h4 className="text-xl font-black text-white mb-8">Company</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Success</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Talk to Expert</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black text-white mb-8">Help</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ\'s</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blogs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black text-white mb-8">Useful Links</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <h2 className="text-[12vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-800 opacity-20 select-none text-center">
              DREAMS TIMER
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#05050a] to-transparent" />
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm font-bold border-t border-white/5 pt-12">
            <p>© 2026 Dreams Timer. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 text-blue-600/20 animate-pulse"><Star size={48} /></div>
        <div className="absolute bottom-40 left-10 text-blue-600/20 animate-pulse delay-1000"><Star size={32} /></div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .clip-arrow {
          clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);
        }
      `}</style>
    </div>
  );
}
