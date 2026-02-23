'use client';

import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

interface AuthUser {
  userId: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      if (session.tokens?.idToken) {
        const payload = session.tokens.idToken.payload;
        setUser({
          userId: payload.sub as string,
          email: payload.email as string,
        });
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, isAuthenticated: !!user };
}