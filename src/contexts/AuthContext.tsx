import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getLoginAttempts,
  incrementLoginAttempts,
  resetLoginAttempts,
  createSession,
  getSession,
  clearSession,
  initializeAdminAccount,
  isAccountLocked,
  validateSessionAccess
} from '../utils/security';

interface User {
  username: string;
  isOwner: boolean;
  permissions?: {
    contentManagement: boolean;
    userManagement: boolean;
    systemConfiguration: boolean;
    mediaUploads: boolean;
    securitySettings: boolean;
    siteCustomization: boolean;
  };
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, isOwner: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication service with enhanced security
const mockAuth = {
  authenticate: async (username: string, password: string): Promise<User> => {
    // Check for account lockout
    if (isAccountLocked(username)) {
      throw new Error('Account is temporarily locked. Please try again later.');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate against a backend
    const storedUser = localStorage.getItem(`user_${username}`);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.password === password) {
        // Reset login attempts on successful login
        resetLoginAttempts(username);
        
        // Create new session
        const sessionId = createSession(username, user.isOwner);
        localStorage.setItem('current_session_id', sessionId);
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }

    // Increment login attempts on failed login
    incrementLoginAttempts(username);
    throw new Error('Invalid credentials');
  },

  createUser: async (username: string, password: string, isOwner: boolean): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (localStorage.getItem(`user_${username}`)) {
      throw new Error('Username already exists');
    }

    // Store user (in a real app, this would be in a database)
    const user = {
      username,
      password,
      isOwner,
      createdAt: Date.now(),
      permissions: isOwner ? {
        contentManagement: true,
        userManagement: true,
        systemConfiguration: true,
        mediaUploads: true,
        securitySettings: true,
        siteCustomization: true,
      } : {
        contentManagement: false,
        userManagement: false,
        systemConfiguration: false,
        mediaUploads: false,
        securitySettings: false,
        siteCustomization: false,
      }
    };
    localStorage.setItem(`user_${username}`, JSON.stringify(user));

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize admin account
    initializeAdminAccount();

    // Check for existing session
    const loadSession = () => {
      const sessionId = localStorage.getItem('current_session_id');
      if (sessionId) {
        const session = getSession(sessionId);
        if (session) {
          const userData = localStorage.getItem(`user_${session.username}`);
          if (userData) {
            const user = JSON.parse(userData);
            const { password: _, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
          }
        } else {
          // Session expired or invalid
          localStorage.removeItem('current_session_id');
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = await mockAuth.authenticate(username, password);
      setCurrentUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username: string, password: string, isOwner: boolean) => {
    try {
      const user = await mockAuth.createUser(username, password, isOwner);
      setCurrentUser(user);
      
      // Create session for new user
      const sessionId = createSession(username, isOwner);
      localStorage.setItem('current_session_id', sessionId);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const sessionId = localStorage.getItem('current_session_id');
    if (sessionId) {
      clearSession(sessionId);
      localStorage.removeItem('current_session_id');
    }
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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
