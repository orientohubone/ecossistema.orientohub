import { create } from 'zustand';
import { supabase, testSupabaseConnection } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connectionStatus: 'checking' | 'connected' | 'disconnected';
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, metadata?: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  connectionStatus: 'checking',
  
  initAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Test Supabase connection first
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.connected) {
        set({ 
          connectionStatus: 'disconnected',
          error: 'Não foi possível conectar ao servidor. Verifique se o projeto Supabase está ativo.',
          isLoading: false 
        });
        return;
      }
      
      set({ connectionStatus: 'connected' });
      
      // Check if user is already logged in
      const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
      
      // If there's an error getting the session (like invalid refresh token), clear the session
      if (getSessionError) {
        console.error('Session error:', getSessionError);
        await supabase.auth.signOut();
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Sessão expirada. Faça login novamente.',
        });
      } else if (session?.user) {
        set({ 
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
      
      // Set up auth state listener
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          set({ 
            user: session.user,
            isAuthenticated: true,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          set({ 
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        error: 'Falha ao inicializar autenticação. Verifique sua conexão.',
        connectionStatus: 'disconnected',
        isLoading: false,
      });
    }
  },
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Test connection before attempting login
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.connected) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o projeto Supabase está ativo.');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Falha no login';
      
      if (error.message?.includes('upstream connect error') || error.message?.includes('503')) {
        errorMessage = 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false,
      });
    }
  },
  
  signup: async (email, password, metadata) => {
    try {
      set({ isLoading: true, error: null });
      
      // Test connection before attempting signup
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.connected) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o projeto Supabase está ativo.');
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Falha no cadastro';
      
      if (error.message?.includes('upstream connect error') || error.message?.includes('503')) {
        errorMessage = 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Este e-mail já está cadastrado. Tente fazer login.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false,
      });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ 
        error: error.message || 'Falha ao sair',
        isLoading: false,
      });
    }
  },
  
  resetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Reset password error:', error);
      set({ 
        error: error.message || 'Falha ao enviar e-mail de recuperação',
        isLoading: false,
      });
    }
  },

  resendConfirmationEmail: async (email) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      set({ 
        error: error.message || 'Falha ao reenviar e-mail de confirmação',
        isLoading: false,
      });
    }
  },
}));
