import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password: string;
  jobTitle: string;
  role: 'admin' | 'user';
  avatar: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  createdAt: string;
  provider: 'email' | 'google';
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  role: 'admin' | 'user';
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
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: { fullName: string; email: string; password: string; jobTitle?: string }) => { success: boolean; error?: string };
  googleLogin: (credential: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'tt_users';
const SESSION_KEY = 'tt_session';

// Helper: get all users from localStorage
function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper: save users to localStorage
function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Helper: get session
function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Helper: save session
function saveSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Helper: generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Helper: decode Google JWT token
function decodeGoogleJwt(token: string): { name: string; email: string; picture: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      name: decoded.name || decoded.given_name || 'Google User',
      email: decoded.email || '',
      picture: decoded.picture || '',
    };
  } catch {
    return null;
  }
}

// Helper: convert UserProfile to AuthUser (strip password)
function toAuthUser(profile: UserProfile): AuthUser {
  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    jobTitle: profile.jobTitle,
    role: profile.role,
    avatar: profile.avatar,
    phone: profile.phone,
    address: profile.address,
    country: profile.country,
    state: profile.state,
    city: profile.city,
    postalCode: profile.postalCode,
    provider: profile.provider,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getSession());

  const isAuthenticated = currentUser !== null;

  // Seed default accounts on first load if none exist
  useEffect(() => {
    const users = getStoredUsers();
    if (users.length === 0) {
      const defaultUsers: UserProfile[] = [
        {
          id: 'default-admin',
          fullName: 'Admin',
          email: 'admin@example.com',
          password: 'admin123',
          jobTitle: 'Administrator',
          role: 'admin',
          avatar: '',
          phone: '',
          address: '',
          country: '',
          state: '',
          city: '',
          postalCode: '',
          createdAt: new Date().toISOString(),
          provider: 'email',
        },
        {
          id: 'default-user',
          fullName: 'User',
          email: 'user@example.com',
          password: 'user123',
          jobTitle: 'Employee',
          role: 'user',
          avatar: '',
          phone: '',
          address: '',
          country: '',
          state: '',
          city: '',
          postalCode: '',
          createdAt: new Date().toISOString(),
          provider: 'email',
        },
      ];
      saveUsers(defaultUsers);
    }
  }, []);

  // Login: validate against stored accounts
  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }

    if (user.provider === 'google') {
      return { success: false, error: 'This account uses Google Sign-In. Please click "Sign in with Google".' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const authUser = toAuthUser(user);
    setCurrentUser(authUser);
    saveSession(authUser);
    localStorage.setItem('dashboardMode', user.role);
    return { success: true };
  };

  // Register: create new account
  const register = (data: { fullName: string; email: string; password: string; jobTitle?: string }): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserProfile = {
      id: generateId(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      jobTitle: data.jobTitle || '',
      role: 'admin',
      avatar: '',
      phone: '',
      address: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      createdAt: new Date().toISOString(),
      provider: 'email',
    };

    users.push(newUser);
    saveUsers(users);

    const authUser = toAuthUser(newUser);
    setCurrentUser(authUser);
    saveSession(authUser);
    localStorage.setItem('dashboardMode', 'admin');
    return { success: true };
  };

  // Google Login: create or log in with Google credentials
  const googleLogin = (credential: string): { success: boolean; error?: string } => {
    const decoded = decodeGoogleJwt(credential);
    if (!decoded || !decoded.email) {
      return { success: false, error: 'Failed to verify Google account. Please try again.' };
    }

    const users = getStoredUsers();
    let user = users.find(u => u.email.toLowerCase() === decoded.email.toLowerCase());

    if (!user) {
      // Auto-register with Google
      user = {
        id: generateId(),
        fullName: decoded.name,
        email: decoded.email,
        password: '',
        jobTitle: '',
        role: 'admin',
        avatar: decoded.picture,
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        createdAt: new Date().toISOString(),
        provider: 'google',
      };
      users.push(user);
      saveUsers(users);
    } else {
      // Update avatar from Google if it changed
      user.avatar = decoded.picture || user.avatar;
      user.fullName = decoded.name || user.fullName;
      saveUsers(users);
    }

    const authUser = toAuthUser(user);
    setCurrentUser(authUser);
    saveSession(authUser);
    localStorage.setItem('dashboardMode', user.role);
    return { success: true };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    saveSession(null);
  };

  // Update profile
  const updateProfile = (data: Partial<AuthUser>) => {
    if (!currentUser) return;

    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    saveSession(updated);

    // Also update in users storage
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveUsers(users);
    }
  };

  // Update password
  const updatePassword = (currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Not logged in.' };

    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx === -1) return { success: false, error: 'User not found.' };

    if (users[idx].provider === 'google') {
      return { success: false, error: 'Google accounts cannot change password here.' };
    }

    if (users[idx].password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    users[idx].password = newPassword;
    saveUsers(users);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      register,
      googleLogin,
      logout,
      updateProfile,
      updatePassword,
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
