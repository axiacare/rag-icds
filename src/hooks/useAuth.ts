import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há sessão temporária no sessionStorage
    const checkTemporarySession = () => {
      const tempSession = sessionStorage.getItem('tempSession');
      if (tempSession) {
        try {
          const parsedSession = JSON.parse(tempSession);
          setSession(parsedSession);
          setUser(parsedSession.user);
        } catch (error) {
          sessionStorage.removeItem('tempSession');
        }
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Limpar todas as sessões temporárias
          sessionStorage.removeItem('tempSession');
          sessionStorage.removeItem('isTestSession');
          sessionStorage.removeItem('manterConectado');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Se não há sessão persistente, verificar se há temporária
        checkTemporarySession();
      } else {
        // Verificar se a sessão deve ser mantida
        const isTestSession = sessionStorage.getItem('isTestSession');
        const manterConectado = sessionStorage.getItem('manterConectado');
        
        // Se é sessão de teste, sempre fazer logout
        if (isTestSession) {
          supabase.auth.signOut();
          sessionStorage.removeItem('tempSession');
          sessionStorage.removeItem('isTestSession');
          sessionStorage.removeItem('manterConectado');
          setSession(null);
          setUser(null);
        } 
        // Se não é sessão de teste mas não tem permissão para manter conectado, fazer logout
        else if (!manterConectado) {
          supabase.auth.signOut();
          sessionStorage.removeItem('tempSession');
          sessionStorage.removeItem('manterConectado');
          setSession(null);
          setUser(null);
        }
        // Caso contrário, manter a sessão
        else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
      setLoading(false);
    });

    // Verificar logout automático para sessões de teste quando a página é recarregada
    const handleBeforeUnload = () => {
      const isTestSession = sessionStorage.getItem('isTestSession');
      if (isTestSession) {
        // Para sessões de teste, fazer logout automático
        supabase.auth.signOut();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || email
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Verificar se a conta foi aprovada após o login
    if (!error) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_status')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.account_status !== 'approved') {
        await supabase.auth.signOut();
        return { 
          error: { 
            message: profile?.account_status === 'pending' 
              ? 'Sua conta está pendente de aprovação. Entre em contato com o administrador.' 
              : 'Sua conta foi rejeitada. Entre em contato com o administrador.'
          }
        };
      }
    }

    return { error };
  };

  const signOut = async () => {
    // Limpar sessões temporárias
    sessionStorage.removeItem('tempSession');
    sessionStorage.removeItem('isTestSession');
    sessionStorage.removeItem('manterConectado');
    
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
};