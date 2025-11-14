import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;  
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;  
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;  
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão ativa ao carregar
    const initializeAuth = async () => {
      try {
        console.log('🔐 Inicializando autenticação...');
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
        } else {
          console.log('✅ Sessão obtida:', currentSession ? 'Usuário logado' : 'Nenhum usuário');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('🔄 Auth state changed:', event, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Log específico para cada evento
        switch (event) {
          case 'SIGNED_IN':
            console.log('✅ Usuário fez login:', currentSession?.user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('👋 Usuário fez logout');
            break;
          case 'TOKEN_REFRESHED':
            console.log('🔄 Token renovado');
            break;
          case 'USER_UPDATED':
            console.log('👤 Dados do usuário atualizados');
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro ao fazer login:', error.message);
        return { error };
      }

      console.log('✅ Login bem-sucedido:', data.user?.email);
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado no login:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('📝 Tentando criar conta para:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error('❌ Erro ao criar conta:', error.message);
        return { error };
      }

      console.log('✅ Conta criada com sucesso:', data.user?.email);
      console.log('📧 Verifique seu email para confirmar a conta!');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado no cadastro:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro ao fazer logout:', error);
        throw error;
      }

      console.log('✅ Logout bem-sucedido');
    } catch (error) {
      console.error('❌ Erro inesperado no logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔑 Enviando email de recuperação para:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Erro ao enviar email de recuperação:', error.message);
        return { error };
      }

      console.log('✅ Email de recuperação enviado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erro inesperado na recuperação:', error);
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
