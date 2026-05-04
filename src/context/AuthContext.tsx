import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';

// Types
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  role: 'management' | 'employee';
  avatar: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  provider: 'email' | 'google';
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { fullName: string; email: string; password: string; jobTitle?: string }) => Promise<{ success: boolean; error?: string }>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  updatePresence: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = currentUser !== null;

  // Sync user profile from public.users table
  const fetchUserProfile = async (userId: string, email: string, provider: 'email' | 'google' = 'email') => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        jobTitle: data.job_title || '',
        role: data.role || 'employee',
        avatar: data.avatar_url || '',
        phone: data.phone || '',
        address: data.address || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        postalCode: data.postal_code || '',
        provider: provider,
      } as AuthUser;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  // Helper to ensure profile exists
  const ensureProfileExists = async (user: any) => {
    console.log('Ensuring profile exists for:', user.id);
    
    // Create a timeout promise
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    );

    try {
      const profilePromise = fetchUserProfile(
        user.id, 
        user.email!, 
        user.app_metadata.provider as any
      );

      // Race the fetch against a 5-second timeout
      let profile = await Promise.race([profilePromise, timeout]) as any;
      console.log('Profile fetch result:', profile ? 'Found' : 'Missing');

      if (!profile) {
        console.log('Creating missing profile...');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            avatar_url: user.user_metadata.avatar_url,
            role: 'admin',
          });
        
        if (!insertError) {
          console.log('Profile created, fetching again...');
          profile = await fetchUserProfile(
            user.id, 
            user.email!, 
            user.app_metadata.provider as any
          );
        } else {
          console.error('Failed to create profile:', insertError);
        }
      }
      if (!profile) {
        console.warn('Returning fallback profile from Auth metadata');
        return {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
          role: 'user',
          avatar: user.user_metadata.avatar_url || '',
          provider: user.app_metadata.provider as any
        } as AuthUser;
      }
      return profile;
    } catch (err) {
      console.error('Critical error in ensureProfileExists:', err);
      return {
        id: user.id,
        email: user.email!,
        fullName: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
        role: 'user',
        avatar: user.user_metadata.avatar_url || '',
        provider: user.app_metadata.provider as any
      } as AuthUser;
    }
  };

  const handleClockIn = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

      const now = new Date();

      if (!data) {
        // Initial clock-in for the day
        await supabase.from('attendance').insert({
          user_id: userId,
          date: today,
          check_in: now.toISOString()
        });
      } else if (data.check_out) {
        // User is logging back in after a sign-out
        const lastCheckOut = new Date(data.check_out);
        const gapMs = now.getTime() - lastCheckOut.getTime();
        const gapMinutes = Math.floor(gapMs / 60000);
        
        if (gapMinutes <= 120) { // Within 2 hours: RESUME
          await supabase
            .from('attendance')
            .update({
              check_out: null
            })
            .eq('id', data.id);
        } else { // Over 2 hours: FINALIZED at return time
          await supabase
            .from('attendance')
            .update({
              check_out: now.toISOString()
            })
            .eq('id', data.id);
        }
      }
    } catch (err) {
      console.error('Error in flexible clock-in:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // 1. Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          handleClockIn(session.user.id).catch(console.error);
          const profile = await ensureProfileExists(session.user);
          if (mounted) setCurrentUser(profile);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initialize();

    // 2. Presence Heartbeat
    updatePresence(); // Ping immediately on load
    const presenceInterval = setInterval(() => {
      if (mounted) updatePresence();
    }, 60000);

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          // Run non-blocking to prevent holding up the auth state change
          handleClockIn(session.user.id).catch(console.error);
        }
        
        const profile = await ensureProfileExists(session.user);
        if (mounted) {
          setCurrentUser(profile);
          if (profile) {
            localStorage.setItem('dashboardMode', profile.role);
          }
        }
      } else {
        if (mounted) setCurrentUser(null);
      }
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error: error.message };
    
    // Profile will be set by onAuthStateChange listener
    return { success: true };
  };

  // Register
  const register = async (data: { fullName: string; email: string; password: string; jobTitle?: string }): Promise<{ success: boolean; error?: string }> => {
    // 1. Auth Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) return { success: false, error: authError.message };
    if (!authData.user) return { success: false, error: 'Registration failed.' };

    // 2. Create profile in public.users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        full_name: data.fullName,
        email: data.email,
        job_title: data.jobTitle || '',
        role: 'admin', // Default first user as admin or handle logic as needed
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Even if profile creation fails, user is registered in Auth. 
      // In a real app, you might want to handle this more robustly.
    }

    return { success: true };
  };

  // Google Login
  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error('Google login error:', error.message);
  };

  const handleClockOut = async () => {
    if (!currentUser) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('date', today)
        .maybeSingle();

      if (data) {
        const checkOutTime = new Date();
        
        const { error } = await supabase
          .from('attendance')
          .update({
            check_out: checkOutTime.toISOString()
          })
          .eq('id', data.id);
          
        if (error) {
          console.error('Error updating clock-out:', error);
          alert('Failed to clock out: ' + error.message);
        }
      }
    } catch (err) {
      console.error('Error auto clock-out:', err);
    }
  };

  // Logout
  const logout = async () => {
    await handleClockOut();
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // Presence Heartbeat
  const updatePresence = async () => {
    if (!currentUser) return;
    try {
      await supabase
        .from('users')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', currentUser.id);
    } catch (err) {
      // Silently fail if column doesn't exist
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!currentUser) return;

    // 1. Update public.users table
    const { error } = await supabase
      .from('users')
      .update({
        full_name: data.fullName,
        job_title: data.jobTitle,
        avatar_url: data.avatar,
        phone: data.phone,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        postal_code: data.postalCode,
      })
      .eq('id', currentUser.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    // 2. Update local state
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  // Update password
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoading,
      login,
      register,
      googleLogin,
      logout,
      updatePresence,
      updateProfile,
      updatePassword,
      setIsLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
