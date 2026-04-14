import React from 'react';
import { 
  ChevronRight, Plus, Folder, Star, Clock, Share2, FileText, 
  Image as ImageIcon, Music, MoreVertical, HardDrive, 
  Cloud, ExternalLink, File, FileCode, Search
} from 'lucide-react';

const navItems = [
  { icon: <Folder size={18} />, label: 'All Folder / Files', active: true },
  { icon: <Star size={18} />, label: 'Drive' },
  { icon: <Share2 size={18} />, label: 'Dropbox' },
  { icon: <Share2 size={18} />, label: 'Shared with Me' },
  { icon: <FileText size={18} />, label: 'Document' },
  { icon: <Clock size={18} />, label: 'Recent File' },
  { icon: <Star size={18} />, label: 'Important' },
  { icon: <Music size={18} />, label: 'Media' },
];

const quickAccess = [
  { name: 'Dropbox', files: '1454 Files', storage: '28GB / 300GB', progress: 10, color: 'bg-red-500', icon: <Share2 size={20} className="text-blue-600" /> },
  { name: 'Google Drive', files: '200 Files', storage: '24GB / 65GB', progress: 40, color: 'bg-fuchsia-500', icon: <HardDrive size={20} className="text-green-600" /> },
  { name: 'Cloud Storage', files: '144 Files', storage: '54GB / 60GB', progress: 90, color: 'bg-green-500', icon: <Cloud size={20} className="text-blue-400" /> },
];

const recentFiles = [
  { name: 'Final Change.doc', date: '26 Jul 2025', size: '8MB', icon: <FileText size={24} className="text-blue-500" /> },
  { name: 'Marklist.pdf', date: '25 Jul 2025', size: '6MB', icon: <File size={24} className="text-red-500" /> },
  { name: 'Nature.png', date: '24 Jul 2025', size: '8MB', icon: <ImageIcon size={24} className="text-teal-500" /> },
  { name: 'Group Photos', date: '23 Jul 2025', size: '10MB', icon: <Folder size={24} className="text-yellow-500" /> },
];

const files = [
  { name: 'Secret', size: '7.6 MB', type: 'Doc', modified: 'Mar 15, 2025 05:00 PM', icon: <FileText size={18} className="text-red-500" />, iconBg: 'bg-red-50' },
  { name: 'Sophie Headrick', size: '7.4 MB', type: 'PDF', modified: 'Jan 8, 2025 08:20 PM', icon: <File size={18} className="text-blue-500" />, iconBg: 'bg-blue-50' },
  { name: 'Gallery', size: '6.1 MB', type: 'Image', modified: 'Aug 6, 2025 04:10 PM', icon: <ImageIcon size={18} className="text-green-500" />, iconBg: 'bg-green-50' },
  { name: 'Doris Crowley', size: '5.2 MB', type: 'Folder', modified: 'Jan 6, 2025 03:40 PM', icon: <Folder size={18} className="text-yellow-500" />, iconBg: 'bg-yellow-50' },
  { name: 'Cheat_codez', size: '8 MB', type: 'Xml', modified: 'Oct 12, 2025 05:00 PM', icon: <FileCode size={18} className="text-emerald-500" />, iconBg: 'bg-emerald-50' },
];

export default function FileManagerView() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">File Manager</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">File Manager</span>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://picsum.photos/seed/james/40/40" alt="James Hong" className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
              <div>
                <p className="font-bold text-sm text-gray-800">James Hong</p>
                <p className="text-[10px] text-gray-400 truncate">jameshong@example.com</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 mb-6 hover:bg-blue-700 transition-all">
              <Plus size={18} /> Create New
            </button>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 mb-4 relative">
              <img src="https://picsum.photos/seed/upgrade/128/128" alt="Upgrade" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-gray-500 mb-4">Get more storage and features</p>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition-all">Upgrade Now</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-12">
          {/* Quick Access */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickAccess.map((item) => (
                <div key={item.name} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {item.icon}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    <span className="text-gray-400">{item.files}</span>
                    <span className="text-gray-800">{item.storage}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Files */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-4">Recent Files</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentFiles.map((file) => (
                <div key={file.name} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    {file.icon}
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                  </div>
                  <p className="font-bold text-gray-800 text-sm truncate mb-1">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{file.date} | {file.size}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Files Table */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-800">Files</h3>
              <button className="text-xs font-bold text-blue-600 border border-blue-100 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">View All</button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-semibold text-gray-700 text-sm">Name</th>
                    <th className="p-4 font-semibold text-gray-700 text-sm">Size</th>
                    <th className="p-4 font-semibold text-gray-700 text-sm">Type</th>
                    <th className="p-4 font-semibold text-gray-700 text-sm">Modified</th>
                    <th className="p-4 font-semibold text-gray-700 text-sm">Share</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${file.iconBg}`}>
                            {file.icon}
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{file.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">{file.size}</td>
                      <td className="p-4 text-gray-400 text-sm">{file.type}</td>
                      <td className="p-4 text-gray-600 text-sm leading-tight">
                        {file.modified.split(' ').slice(0, 3).join(' ')}<br/>
                        <span className="text-[11px] text-gray-400">{file.modified.split(' ').slice(3).join(' ')}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, j) => (
                            <img key={j} src={`https://picsum.photos/seed/share-${i}-${j}/24/24`} alt="avatar" className="w-6 h-6 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                          ))}
                          {i === 2 && (
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white relative z-10">
                              +1
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-300">
                          <Star size={16} className="cursor-pointer hover:text-yellow-400" />
                          <MoreVertical size={16} className="cursor-pointer hover:text-gray-600" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-gray-100 flex justify-center">
            <p className="text-sm text-gray-600">
              Copyright © 2026 - <span className="text-blue-600 font-medium">Dreams Timer</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
