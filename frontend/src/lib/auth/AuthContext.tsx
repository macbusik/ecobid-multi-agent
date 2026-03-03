
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes, confirmSignUp } from 'aws-amplify/auth';

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
});

interface User {
  userId: string;
  email: string;
  name?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, city: string) => Promise<void>;
  confirmRegistration: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    console.log('🔐 AuthContext: Loading user session...');
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      console.log('✅ AuthContext: User session found', {
        userId: attributes.sub,
        email: attributes.email,
        name: attributes.name,
      });
      
      // Use 'sub' attribute (Cognito user ID) as userId to match JWT claims
      setUser({
        userId: attributes.sub || currentUser.userId,
        email: attributes.email || '',
        name: attributes.name,
        city: attributes['custom:city'],
      });
    } catch (error) {
      console.log('❌ AuthContext: No active session', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('🔐 AuthContext: Loading complete');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    await signIn({ username: email, password });
    await loadUser();
  };

  const register = async (email: string, password: string, name: string, city: string) => {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
          'custom:city': city,
        },
      },
    });
  };

  const confirmRegistration = async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      confirmRegistration, 
      logout, 
      signOut: logout,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
