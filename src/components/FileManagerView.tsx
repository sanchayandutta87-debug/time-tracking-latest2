import React, { useEffect, useState, useRef } from 'react';
import { 
  ChevronRight, Plus, Folder, Star, Clock, Share2, FileText, 
  Image as ImageIcon, Music, MoreVertical, HardDrive, 
  Cloud, File, FileCode, Loader2, Upload, UserPlus, X, Search, CheckCircle2, AlertCircle, Bell, Trash2
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

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
  const { showToast, askConfirm } = useAppContext();

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
      showToast(`File "${file.name}" shared with ${recipientToShareWith.full_name}!`, 'success');
      setIsPickFileModalOpen(false);
      setRecipientToShareWith(null);
      setSearchTerm('');
    } catch (err: any) {
      showToast(`Sharing failed: ${err.message}`, 'error');
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
    { name: 'Dropbox', files: '0 Files', storage: '0GB / 300GB', progress: 0, color: 'from-blue-600 to-indigo-600', icon: <Share2 size={20} className="text-blue-500" /> },
    { name: 'Google Drive', files: '0 Files', storage: '0GB / 65GB', progress: 0, color: 'from-emerald-500 to-teal-500', icon: <HardDrive size={20} className="text-emerald-500" /> },
    { name: 'Cloud Storage', files: `${dbFiles.length} Files`, storage: `${formatSize(dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0))} / 1GB`, progress: Math.min((dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0) / (1024 * 1024 * 1024)) * 100, 100), color: 'from-orange-500 to-rose-500', icon: <Cloud size={20} className="text-orange-400" /> },
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
      
      {/* Header with Glass Effect */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">File Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Manage and organize your digital workspace</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-100/50 dark:bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-gray-600 dark:text-gray-300">File Manager</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-blue-500/20 transition-all cursor-pointer group">
              <div className="relative">
                <img 
                  src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}`} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-black rounded-full shadow-lg"></div>
              </div>
              <div className="min-w-0">
                <p className="font-black text-sm text-gray-800 dark:text-white truncate group-hover:text-blue-500 transition-colors">{currentUser?.fullName || 'Guest'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{currentUser?.email?.split('@')[0]}</p>
              </div>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-3.5 rounded-xl flex items-center justify-center gap-3 text-sm font-black shadow-xl shadow-blue-500/20 mb-8 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-gray-400 disabled:to-gray-500"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />} 
              {isUploading ? 'SENDING...' : 'UPLOAD NEW'}
            </button>

            <nav className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Navigation</p>
              {navItems.map((item) => (
                <div 
                  key={item.label} 
                  onClick={() => setActiveFilter(item.filter)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeFilter === item.filter ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-black' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5'}`}
                >
                  <div className={`${activeFilter === item.filter ? 'text-white' : 'text-blue-500'}`}>{item.icon}</div>
                  <span className="text-xs uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </nav>

            {/* Storage Usage Section */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Cloud size={16} className="text-orange-500" />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage</span>
                </div>
                <span className="text-[10px] font-black text-blue-500">
                  {Math.round((dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0) / (1024 * 1024 * 1024)) * 100)}% Used
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0) / (1024 * 1024 * 1024)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400">
                {formatSize(dbFiles.reduce((acc, f) => acc + (f.file_size || 0), 0))} of 1.0 GB used
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-12">
          {/* Quick Access */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Quick Access</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent dark:from-white/10 dark:to-transparent ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickAccess.map((item) => (
                <div key={item.name} className="bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-black text-gray-800 dark:text-white text-sm tracking-tight">{item.name}</span>
                    </div>
                    <button className="text-gray-300 hover:text-blue-500 transition-colors"><MoreVertical size={16} /></button>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-400">{item.files}</span>
                      <span className="text-blue-500">{item.storage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Files Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                {activeFilter === 'all' ? 'Recent Activity' : `${activeFilter} Files`}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent dark:from-white/10 dark:to-transparent ml-4"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredFiles.slice(0, 4).map((file) => (
                <div key={file.id} className="bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl group hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                      {getFileIcon(file.file_type)}
                    </div>
                    <button className="text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"><MoreVertical size={16} /></button>
                  </div>
                  <p className="font-black text-gray-800 dark:text-white text-sm truncate mb-1 group-hover:text-blue-500 transition-colors">{file.name}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                    <span>{formatSize(file.file_size)}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {filteredFiles.length === 0 && !isLoading && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/5 group hover:border-blue-500/50 transition-all">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-500" size={32} />
                  </div>
                  <p className="text-lg font-black text-gray-800 dark:text-white mb-2">Workspace is Empty</p>
                  <p className="text-sm text-gray-400 font-medium max-w-[250px] text-center">No files found matching your criteria. Start by uploading a new one!</p>
                </div>
              )}
            </div>
          </section>

          {/* Files List Table Section */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest shrink-0">
                  {activeFilter === 'shared' ? 'Shared Assets' : 'All Digital Assets'}
                </h3>
                <div className="h-8 w-px bg-gray-100 dark:bg-white/10 hidden md:block"></div>
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {filteredFiles.length} Total
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search anything..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all dark:text-white placeholder:text-gray-500"
                  />
                  
                  {/* Search Dropdown with improved styling */}
                  {searchEmployees.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 bg-gray-50/50 dark:bg-white/5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Global Members</p>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {searchEmployees.map(emp => (
                          <div key={emp.id} className="flex items-center justify-between p-3 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 transition-colors group">
                            <div className="flex items-center gap-4">
                              <img src={emp.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name)}`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                              <div>
                                <p className="text-xs font-black text-gray-800 dark:text-white truncate">{emp.full_name}</p>
                                <p className="text-[10px] font-bold text-blue-500 tracking-tight">{emp.email}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setRecipientToShareWith(emp);
                                setIsPickFileModalOpen(true);
                                setSearchEmployees([]);
                              }}
                              className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                            >
                              SEND ASSET
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="bg-white/80 dark:bg-black/40 backdrop-blur-md text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-white/5 px-4 py-3 rounded-2xl hover:text-blue-500 hover:border-blue-500/20 transition-all shrink-0">View Report</button>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all min-h-[300px]">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
                  <p className="text-sm text-gray-400">Loading your files...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                      <tr>
                        <th className="p-5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Digital Asset</th>
                        <th className="p-5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Weight</th>
                        <th className="p-5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Format</th>
                        <th className="p-5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Timestamp</th>
                        <th className="p-5 font-black text-gray-400 text-[10px] uppercase tracking-widest">Owner</th>
                        <th className="p-5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-900`}>
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
          <div className="bg-white dark:bg-black w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
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
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
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
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 group text-left"
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
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center backdrop-blur-[1px]">
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
          <div className="bg-white dark:bg-black w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">Share File</h3>
                <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">{fileToShare?.name}</p>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {employeeResults.length > 0 ? (
                  employeeResults.map((emp) => (
                    <div 
                      key={emp.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
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
