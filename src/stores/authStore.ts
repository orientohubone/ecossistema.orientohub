import { create } from 'zustand';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
  
  initAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ 
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
      
      // Set up auth state listener
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          set({ 
            user: session.user,
            isAuthenticated: true,
          });
        } else if (event === 'SIGNED_OUT') {
          set({ 
            user: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      set({ 
        error: 'Failed to initialize authentication',
        isLoading: false,
      });
    }
  },
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to login',
        isLoading: false,
      });
    }
  },
  
  signup: async (email, password, metadata) => {
    try {
      set({ isLoading: true, error: null });
      
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
      set({ 
        error: error.message || 'Failed to sign up',
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
      set({ 
        error: error.message || 'Failed to logout',
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
      set({ 
        error: error.message || 'Failed to send password reset email',
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
      set({ 
        error: error.message || 'Failed to resend confirmation email',
        isLoading: false,
      });
    }
  },
}));