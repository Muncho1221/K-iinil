import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { username } } 
    });
    if (error) console.error('Error detallado de SignUp:', error);
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Error detallado de SignIn:', error);
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}
