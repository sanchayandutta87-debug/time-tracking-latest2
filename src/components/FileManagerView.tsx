import React, { useEffect, useState, useRef } from 'react';
import { 
  ChevronRight, Plus, Folder, Star, Clock, Share2, FileText, 
  Image as ImageIcon, Music, MoreVertical, HardDrive, 
  Cloud, File, FileCode, Loader2, Upload, UserPlus, X, Search, CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: <Folder size={18} />, label: 'All Folder / Files', active: true, filter: 'all' },
  { icon: <Share2 size={18} />, label: 'Shared with Me', filter: 'shared' },
  { icon: <Share2 size={18} />, label: 'Shared by Me', filter: 'sent' },
  { icon: <FileText size={18} />, label: 'Document', filter: 'doc' },
  { icon: <Clock size={18} />, label: 'Recent File', filter: 'recent' },
  { icon: <Music size={18} />, label: 'Media', filter: 'media' },
];

export default function FileManagerView() {
  const { currentUser } = useAuth();
  const [dbFiles, setDbFiles] = useState<any[]>([]);
  const [sharedFiles, setSharedFiles] = useState<any[]>([]);
  const [sentFiles, setSentFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEmployees, setSearchEmployees] = useState<any[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState<any>(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeResults, setEmployeeResults] = useState<any[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [recipientToShareWith, setRecipientToShareWith] = useState<any>(null);
  const [isPickFileModalOpen, setIsPickFileModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePickFileAndShare = async (file: any) => {
    if (!recipientToShareWith || !currentUser) return;
    setIsSharing(true);
    try {
      const { error } = await supabase
        .from('file_shares')
        .insert({
          file_id: file.id,
          shared_with_user_id: recipientToShareWith.id
        });
      if (error) throw error;
      showNotification('success', `File "${file.name}" shared with ${recipientToShareWith.full_name}!`);
      setIsPickFileModalOpen(false);
      setRecipientToShareWith(null);
      setSearchTerm('');
    } catch (err: any) {
      showNotification('error', `Sharing failed: ${err.message}`);
    } finally {
      setIsSharing(false);
    }
  };

  // Search employees globally when searchTerm changes
  useEffect(() => {
    const handleGlobalSearch = async () => {
      if (searchTerm.length < 2) {
        setSearchEmployees([]);
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .ilike('full_name', `%${searchTerm}%`)
        .neq('id', currentUser?.id)
        .limit(3);
      setSearchEmployees(data || []);
    };
    const timer = setTimeout(handleGlobalSearch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, currentUser]);

  useEffect(() => {
    const searchEmployees = async () => {
      if (employeeSearch.length < 2) {
        setEmployeeResults([]);
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .ilike('full_name', `%${employeeSearch}%`)
        .neq('id', currentUser?.id)
        .limit(5);
      setEmployeeResults(data || []);
    };
    const timer = setTimeout(searchEmployees, 300);
    return () => clearTimeout(timer);
  }, [employeeSearch, currentUser]);

  const handleShare = async (recipientId: string) => {
    if (!fileToShare || !currentUser) return;
    setIsSharing(true);
    try {
      const { error } = await supabase
        .from('file_shares')
        .insert({
          file_id: fileToShare.id,
          shared_with_user_id: recipientId
        });
      if (error) throw error;
      alert('File shared successfully!');
      setIsShareModalOpen(false);
      setEmployeeSearch('');
    } catch (err: any) {
      alert(`Sharing failed: ${err.message}`);
    } finally {
      setIsSharing(false);
    }
  };
  const fetchFiles = async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // 1. Fetch my files
      const { data: myFiles, error: myFilesError } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (myFilesError) throw myFilesError;

      // 2. Fetch shared files (where I am the recipient)
      const { data: shared, error: sharedError } = await supabase
        .from('file_shares')
        .select('*, files(*, users(full_name, avatar_url))')
        .eq('shared_with_user_id', currentUser.id);

      if (sharedError) {
        console.warn('Shared files fetch error (table might not exist yet):', sharedError);
      }

      setDbFiles(myFiles || []);
      setSharedFiles(shared?.map(s => ({ ...s.files, isShared: true, sharedBy: s.files?.users?.full_name })) || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentUser]);

  const filteredFiles = (() => {
    let files = [];
    if (activeFilter === 'shared') {
      files = sharedFiles;
    } else if (activeFilter === 'sent') {
      files = sentFiles;
    } else {
      files = dbFiles.filter(file => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'doc') return file.file_type?.includes('pdf') || file.file_type?.includes('word') || file.file_type?.includes('text') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
        if (activeFilter === 'media') return file.file_type?.includes('image') || file.file_type?.includes('video') || file.file_type?.includes('audio');
        if (activeFilter === 'recent') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(file.created_at) > oneWeekAgo;
        }
        return true;
      });
    }

    if (searchTerm) {
      files = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return files;
  })();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('project files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        throw new Error(`Storage Error: ${uploadError.message}`);
      }

      // 2. Save to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: currentUser.id,
          name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          bucket_id: 'project files'
        });

      if (dbError) {
        console.error('Database Insert Error:', dbError);
        throw new Error(`Database Error: ${dbError.message}`);
      }

      await fetchFiles();
    } catch (err: any) {
      console.error('Upload failed:', err);
      showNotification('error', `Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={18} className="text-green-500" />;
    if (type.includes('pdf')) return <File size={18} className="text-blue-500" />;
    if (type.includes('word') || type.includes('text')) return <FileText size={18} className="text-red-500" />;
    if (type.includes('code')) return <FileCode size={18} className="text-emerald-500" />;
    return <Folder size={18} className="text-yellow-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const quickAccess = [
    { name: 'Dropbox', files: '0 Files', storage: '0GB / 300GB', progress: 0, color: 'bg-red-500', icon: <Share2 size={20} className="text-blue-600" /> },
        { name: 'Google Drive', files: '0 Files', storage: '0GB / 65GB', progress: 0, color: 'bg-fuchsia-500', icon: <HardDrive size={20} className="text-green-600" /> },
    { name: 'Cloud Storage', files: `${dbFiles.length} Files`, storage: `${formatSize(dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0))} / 1GB`, progress: Math.min((dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0) / (1024 * 1024 * 1024)) * 100, 100), color: 'bg-green-500', icon: <Cloud size={20} className="text-blue-400" /> },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="text-sm font-bold">{notification.text}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full bg-gray-50/30 dark:bg-transparent">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleUpload}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">File Manager</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300">File Manager</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600" 
                referrerPolicy="no-referrer" 
              />
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-800 dark:text-white truncate">{currentUser?.fullName || 'Guest'}</p>
                <p className="text-[10px] text-gray-400 truncate">{currentUser?.email}</p>
              </div>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 dark:shadow-none mb-6 hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} 
              {isUploading ? 'Uploading...' : 'Create New'}
            </button>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  onClick={() => setActiveFilter(item.filter)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${activeFilter === item.filter ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center text-center">
            <div className="w-32 h-32 mb-4 relative">
              <Cloud size={64} className="text-blue-400 mx-auto" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Get more storage and features</p>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition-all">Upgrade Now</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-12">
          {/* Quick Access */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickAccess.map((item) => (
                <div key={item.name} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {item.icon}
                      </div>
                      <span className="font-bold text-gray-800 dark:text-white text-sm">{item.name}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><MoreVertical size={16} /></button>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    <span className="text-gray-400">{item.files}</span>
                    <span className="text-gray-800 dark:text-gray-300">{item.storage}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Files */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
              {activeFilter === 'all' ? 'Recent Files' : `Files in ${activeFilter}`}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredFiles.slice(0, 4).map((file) => (
                <div key={file.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-blue-200 dark:hover:border-blue-500 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    {getFileIcon(file.file_type)}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm truncate mb-1">{file.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{new Date(file.created_at).toLocaleDateString()} | {formatSize(file.file_size)}</p>
                </div>
              ))}
              {filteredFiles.length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                  <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-400 font-medium">No files found for this filter.</p>
                </div>
              )}
            </div>
          </section>

          {/* Files Table */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white shrink-0">
                {activeFilter === 'shared' ? 'Files Shared with Me' : 'All Files'}
              </h3>
              
              <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search files or employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                />

                {/* Search Results Dropdown (Employees) */}
                {searchEmployees.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-50 dark:border-gray-700/50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Employees</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {searchEmployees.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                          <div className="flex items-center gap-2">
                            <img src={emp.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name)}`} className="w-7 h-7 rounded-full" alt="" />
                            <div className="truncate max-w-[100px]">
                              <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{emp.full_name}</p>
                              <p className="text-[9px] text-gray-400 truncate">{emp.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setRecipientToShareWith(emp);
                              setIsPickFileModalOpen(true);
                              setSearchEmployees([]);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded-md transition-all opacity-0 group-hover:opacity-100"
                          >
                            Send File
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shrink-0">View All</button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors min-h-[200px]">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
                  <p className="text-sm text-gray-400">Loading your files...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Name</th>
                        <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Size</th>
                        <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Type</th>
                        <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Modified</th>
                        <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Share</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50`}>
                                {getFileIcon(file.file_type)}
                              </div>
                              <span className="font-bold text-gray-800 dark:text-white text-sm">{file.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-400 dark:text-gray-500 text-sm">{formatSize(file.file_size)}</td>
                          <td className="p-4 text-gray-400 dark:text-gray-500 text-sm capitalize">{file.file_type.split('/')[1] || 'File'}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 text-sm leading-tight">
                            {new Date(file.created_at).toLocaleDateString()}<br/>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">{new Date(file.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {file.isShared ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                    {file.sharedBy?.substring(0, 2).toUpperCase() || '??'}
                                  </div>
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Shared by {file.sharedBy}</span>
                                </div>
                              ) : file.isSent ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-[10px] font-bold text-purple-600 dark:text-purple-400">
                                    {file.sharedWith?.substring(0, 2).toUpperCase() || '??'}
                                  </div>
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Shared with {file.sharedWith}</span>
                                </div>
                              ) : (
                                <img 
                                  src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}`} 
                                  alt="avatar" 
                                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" 
                                  referrerPolicy="no-referrer" 
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-gray-300 dark:text-gray-600">
                              {!file.isShared && (
                                <button 
                                  onClick={() => {
                                    setFileToShare(file);
                                    setIsShareModalOpen(true);
                                  }}
                                  title="Share with employee"
                                  className="hover:text-blue-600 dark:hover:text-blue-400 p-1"
                                >
                                  <UserPlus size={16} />
                                </button>
                              )}
                              <Star size={16} className="cursor-pointer hover:text-yellow-400" />
                              <MoreVertical size={16} className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-400" />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {dbFiles.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-20 text-center text-gray-400 text-sm italic">
                            Your storage is empty. Click "Create New" to upload a file.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Copyright © 2026 - <span className="text-blue-600 dark:text-blue-400 font-medium">CodeXConquer</span>
            </p>
          </footer>
        </div>
      </div>

      {/* Pick File to Share Modal */}
      {isPickFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm">Send File to {recipientToShareWith?.full_name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Select one of your files below to share</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsPickFileModalOpen(false);
                  setRecipientToShareWith(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2">
                {dbFiles.length > 0 ? (
                  dbFiles.map((file) => (
                    <button 
                      key={file.id}
                      onClick={() => handlePickFileAndShare(file)}
                      disabled={isSharing}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                          <File size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{file.name}</p>
                          <p className="text-[10px] text-gray-400">{(file.file_size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-400 italic">You haven't uploaded any files yet.</p>
                  </div>
                )}
              </div>
            </div>
            {isSharing && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-xs font-bold text-blue-600">Sharing file...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal (Existing) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Share File</h3>
                <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">{fileToShare?.name}</p>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search employee name..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {employeeResults.length > 0 ? (
                  employeeResults.map((emp) => (
                    <div 
                      key={emp.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={emp.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name)}`} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{emp.full_name}</p>
                          <p className="text-[10px] text-gray-400">{emp.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleShare(emp.id)}
                        disabled={isSharing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:bg-gray-400"
                      >
                        {isSharing ? 'Sharing...' : 'Share'}
                      </button>
                    </div>
                  ))
                ) : employeeSearch.length >= 2 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    No employees found matching "{employeeSearch}"
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm italic">
                    Type at least 2 characters to search employees
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
