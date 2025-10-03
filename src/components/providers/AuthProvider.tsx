"use client";
import { useEffect } from 'react';
import { useUserStore } from '../../store/user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initialize } = useUserStore();

  useEffect(() => {
    // Initialize Supabase auth state listener
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  return <>{children}</>;
}