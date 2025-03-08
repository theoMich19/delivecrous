import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // Si l'utilisateur n'est pas connecté et n'est pas sur une page d'auth,
      // rediriger vers la page de login
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Si l'utilisateur est connecté et sur une page d'auth,
      // rediriger vers la page d'accueil
      router.replace('/(tabs)/home');
    }
  }, [user, segments, isLoading]);

  return <>{children}</>;
} 