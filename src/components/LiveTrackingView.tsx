import React, { useEffect, useState } from 'react';
import { Search, Calendar, Camera, Clock, Sun, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface LiveUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  clockIn: string | null;
  project: string;
  task: string;
  app: { name: string; domain: string };
  isOnline: boolean;
}

export default function LiveTrackingView() {
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentTab, setCurrentTab] = useState<'live' | 'recent'>('live');

  const fetchLiveTrackingData = async () => {
    console.log('Fetching live tracking data...');
    setIsLoading(true);
    try {
      // 1. Fetch all users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*');

      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }
      
      console.log('Found users:', userData?.length);

      // 2. Fetch latest attendance for today (resiliently)
      let attendanceData: any[] = [];
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
          .from('attendance')
          .select('*')
          .eq('date', today);
        attendanceData = data || [];
      } catch (e) {
        console.warn('Attendance fetch failed:', e);
      }

      // 3. Fetch current active time entries (resiliently)
      let activeEntries: any[] = [];
      try {
        const { data } = await supabase
          .from('time_entries')
          .select(`
            *,
            projects (name),
            tasks (name)
          `)
          .is('end_time', null);
        activeEntries = data || [];
      } catch (e) {
        console.warn('Time entries fetch failed:', e);
      }

      // 4. Fetch project assignments from tasks (fallback)
      let assignments: any[] = [];
      try {
        const { data } = await supabase
          .from('tasks')
          .select(`
            assignee_id,
            projects (name),
            name
          `);
        assignments = data || [];
      } catch (e) {
        console.warn('Assignments fetch failed:', e);
      }

      // 5. Combine data
      const combinedData: LiveUser[] = (userData || []).map(user => {
        const attendance = attendanceData?.find(a => a.user_id === user.id);
        const activeEntry: any = activeEntries?.find(e => e.user_id === user.id);
        
        // Find latest assignment if no active entry
        const userAssignments = assignments?.filter(a => a.assignee_id === user.id);
        const latestAssignment = userAssignments?.find(a => a.name === 'Project Membership') || userAssignments?.[0];

        // A user is online if they have an active timer OR they were seen in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const lastSeenDate = user.last_seen ? new Date(user.last_seen) : null;
        const isRecentlyActive = lastSeenDate ? lastSeenDate > fiveMinutesAgo : false;

        return {
          id: user.id,
          name: user.full_name,
          role: user.job_title || 'Employee',
          avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`,
          clockIn: attendance?.check_in ? new Date(attendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not Clocked In',
          project: activeEntry?.projects?.name || latestAssignment?.projects?.name || 'No Active Project',
          task: activeEntry?.tasks?.name || (latestAssignment?.name === 'Project Membership' ? 'Assigned' : latestAssignment?.name) || 'Idle',
          app: { name: 'Browser', domain: 'google.com' },
          isOnline: !!activeEntry || isRecentlyActive,
        };
      });

      console.log('Combined Data:', combinedData);
      setUsers(combinedData);
    } catch (error) {
      console.error('Error in fetchLiveTrackingData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTrackingData();

    // Set up real-time subscription for attendance and time entries
    const channel = supabase
      .channel('live-tracking')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, fetchLiveTrackingData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'time_entries' }, fetchLiveTrackingData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [takingScreenshot, setTakingScreenshot] = useState<string | null>(null);

  const handleTakeScreenshot = async (userId: string, userName: string) => {
    setTakingScreenshot(userId);
    try {
      // 1. Find active time entry for this user
      let { data: activeEntries } = await supabase
        .from('time_entries')
        .select('id')
        .eq('user_id', userId)
        .is('end_time', null)
        .limit(1);

      let timeEntryId: string;

      if (!activeEntries || activeEntries.length === 0) {
        // Create a brief manual session entry to hold the screenshot if no active timer
        const now = new Date().toISOString();
        const { data: newEntry, error: createError } = await supabase
          .from('time_entries')
          .insert([{
            user_id: userId,
            start_time: now,
            end_time: now,
            description: `Manual Screenshot Session for ${userName}`,
            duration_seconds: 1,
            is_manual: true
          }])
          .select()
          .single();

        if (createError) throw createError;
        timeEntryId = newEntry.id;
      } else {
        timeEntryId = activeEntries[0].id;
      }

      // 2. Simulate capturing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Save to database
      const { error: screenshotError } = await supabase
        .from('screenshots')
        .insert([{
          time_entry_id: timeEntryId,
          image_url: `https://picsum.photos/seed/${userId}-${Date.now()}/1200/800`,
          captured_at: new Date().toISOString()
        }]);

      if (screenshotError) throw screenshotError;

      alert(`📸 Screenshot captured for ${userName}! It has been saved and logged to their activity.`);
    } catch (error) {
      console.error('Error taking screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    } finally {
      setTakingScreenshot(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'recent') {
      return matchesSearch && user.isOnline;
    }
    
    return matchesSearch;
  });

  return (
    <div className="p-8 bg-gray-50 dark:bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Live Tracking</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300">Live Tracking</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-slate-700 mb-8">
        <button 
          onClick={() => setCurrentTab('live')}
          className={`flex items-center gap-2 pb-4 font-bold transition-all ${currentTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          <Sun size={18} />
          Live Tracking
        </button>
        <button 
          onClick={() => setCurrentTab('recent')}
          className={`flex items-center gap-2 pb-4 font-bold transition-all ${currentTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          <Clock size={18} />
          Last 5 Minutes
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 flex items-center gap-2 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className="outline-none w-full text-sm bg-transparent dark:text-white dark:placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <input 
            type="text" 
            placeholder={new Date().toLocaleDateString()} 
            disabled
            className="w-full border border-gray-100 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm outline-none bg-gray-50 dark:bg-slate-800 shadow-sm pr-10 cursor-not-allowed dark:text-slate-400"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Syncing live activity...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 dark:border-slate-700">
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Clock In</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Project & Task</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-slate-800 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{user.clockIn}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                        <span className={`text-xs font-bold ${user.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'}`}>
                          {user.isOnline ? 'ACTIVE' : 'OFFLINE'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.project}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">{user.task}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        disabled={takingScreenshot === user.id}
                        onClick={() => handleTakeScreenshot(user.id, user.name)}
                        className={`flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-all ${
                          takingScreenshot === user.id 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                      >
                        {takingScreenshot === user.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Capturing...
                          </>
                        ) : (
                          <>
                            <Camera size={14} />
                            Take Screenshot
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                      No employees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
