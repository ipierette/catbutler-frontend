/**
 * 🔐 AuthContext - Gerenciamento de Autenticação
 * Context para gerenciar estado de usuário e perfil em toda aplicação
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabase, getUserProfile, onAuthStateChange } from '../utils/supabase';
import { avatarList } from '../utils/avatars';

// Tipos para TypeScript-like behavior
const AuthContext = createContext();

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Sistema profissional de modo visitante
  // Visitante = usuário não autenticado (independente de flags ambientais)
  const isVisitorMode = !user || !profile;
  const isAuthenticated = !!user && !!profile;

  // Carregar perfil do usuário
  const loadUserProfile = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    try {
      console.log('🔄 Carregando perfil do usuário...', authUser.email);
      
      const result = await getUserProfile();
      
      if (result.success) {
        console.log('✅ Perfil carregado:', result.profile);
        setProfile(result.profile);
      } else {
        console.warn('⚠️ Erro ao carregar perfil:', result.error);
        // Se não conseguir carregar o perfil, criar um temporário
        setProfile({
          id: authUser.id,
          display_name: authUser.email?.split('@')[0] || 'Usuário',
          theme: 'auto'
        });
      }
    } catch (error) {
      console.error('🚨 Erro ao carregar perfil:', error);
      // Fallback para perfil básico
      setProfile({
        id: authUser.id,
        display_name: authUser.email?.split('@')[0] || 'Usuário',
        theme: 'auto'
      });
    }
  };

  // Inicializar autenticação
  const initializeAuth = async () => {
    try {
      setLoading(true);
      console.log('🔄 Inicializando autenticação...');

      // Verificar se há sessão ativa
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🚨 Erro ao verificar sessão:', error);
      } else if (session?.user) {
        console.log('✅ Sessão ativa encontrada:', session.user.email);
        setUser(session.user);
        await loadUserProfile(session.user);
      } else {
        console.log('ℹ️ Nenhuma sessão ativa - modo visitante');
      }
    } catch (error) {
      console.error('🚨 Erro na inicialização:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔄 Fazendo login...', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🚨 Erro no login:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Login realizado com sucesso!');
      setUser(data.user);
      await loadUserProfile(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('🚨 Erro inesperado no login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fazendo logout...');

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🚨 Erro no logout:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Logout realizado com sucesso!');
      setUser(null);
      setProfile(null);

      return { success: true };
    } catch (error) {
      console.error('🚨 Erro inesperado no logout:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (newProfileData) => {
    try {
      console.log('🔄 Atualizando perfil...', newProfileData);

      // Aqui você pode implementar chamada para o backend para atualizar
      // Por enquanto, vamos atualizar apenas localmente
      setProfile(prev => ({
        ...prev,
        ...newProfileData
      }));

      return { success: true };
    } catch (error) {
      console.error('🚨 Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  };

  // Função para obter nome de exibição
  const getDisplayName = () => {
    if (isAuthenticated && profile?.display_name) {
      return profile.display_name;
    }
    return 'Visitante';
  };

  // Função para obter saudação personalizada
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
      greeting = 'Bom dia';
    } else if (hour < 18) {
      greeting = 'Boa tarde';  
    } else {
      greeting = 'Boa noite';
    }

    return `${greeting}, ${getDisplayName()}`;
  };

  // Lista de avatares disponíveis
  const availableAvatars = avatarList;

  // Função para obter avatar do usuário
  const getUserAvatar = () => {
    console.log('🔍 getUserAvatar Debug:', {
      isVisitorMode,
      profile,
      profileAvatar: profile?.avatar,
      availableAvatars: availableAvatars.length
    });
    
    if (!isVisitorMode && profile?.avatar) {
      const avatar = availableAvatars.find(a => a.id === profile.avatar);
      console.log('🖼️ Avatar encontrado:', avatar);
      return avatar ? avatar.src : availableAvatars[0].src;
    }
    return null; // Visitante não tem avatar
  };

  // Função para atualizar configurações do usuário
  const updateUserSettings = async (settings) => {
    if (!isAuthenticated || !user) {
      console.warn('⚠️ Usuário não autenticado - não é possível atualizar configurações');
      return { success: false, message: 'Usuário não autenticado' };
    }

    try {
      setLoading(true);
      console.log('🔄 Atualizando configurações do usuário...', settings);

      // Obter o token de acesso atual do Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Não foi possível obter o token de acesso');
      }

      // Atualizar perfil no Supabase diretamente primeiro
      const { data: updatedProfile, error: supabaseError } = await supabase
        .from('user_profiles')
        .update(settings)
        .eq('id', user.id)
        .select()
        .single();

      if (supabaseError) {
        console.error('❌ Erro no Supabase:', supabaseError);
        throw new Error(supabaseError.message);
      }

      // Se sucesso no Supabase, tentar atualizar via API backend também
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://catbutler-backend.vercel.app'}/api/profile/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(settings)
        });

        if (response.ok) {
          console.log('✅ Backend sync successful');
        } else {
          console.warn('⚠️ Backend sync failed but Supabase updated');
        }
      } catch (backendError) {
        console.warn('⚠️ Backend unreachable but Supabase updated:', backendError);
      }

      // Atualizar perfil local com dados do Supabase
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      console.log('✅ Configurações atualizadas com sucesso!');
      return { success: true, profile: updatedProfile };

    } catch (error) {
      console.error('❌ Erro ao atualizar configurações:', error);
      return { 
        success: false, 
        message: error.message || 'Erro interno do servidor'
      };
    } finally {
      setLoading(false);
    }
  };

  // Listener para mudanças de autenticação
  useEffect(() => {
    console.log('🔄 Configurando listeners de autenticação...');
    
    // Inicializar autenticação
    initializeAuth();

    // Listener para mudanças de sessão
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, session?.user?.email || 'No user');
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user);
        
        // Para login social, redirecionar automaticamente
        if (session.user.app_metadata?.provider && session.user.app_metadata.provider !== 'email') {
          console.log('✅ Login social concluído, redirecionando...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
      }
      
      setLoading(false);
    });

    // Cleanup
    return () => {
      console.log('🧹 Limpando listeners de autenticação...');
      subscription?.unsubscribe();
    };
  }, []);

  // Debug info (apenas em desenvolvimento)
  useEffect(() => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log('🐱 Auth State:', {
        user: user?.email || null,
        profile: profile?.display_name || null,
        isVisitorMode,
        loading,
        isAuthenticated: isAuthenticated
      });
    }
  }, [user, profile, isVisitorMode, loading, isAuthenticated]);

  const value = useMemo(() => ({
    // Estado
    user,
    profile,
    loading,
    isVisitorMode,
    
    // Funções de autenticação
    login,
    logout,
    updateProfile,
    
    // Funções de utilidade
    isAuthenticated,
    getDisplayName,
    getGreeting,
    getUserAvatar,
    updateUserSettings,
    availableAvatars,
  }), [user, profile, loading, isVisitorMode, login, logout, updateProfile, isAuthenticated, getDisplayName, getGreeting, getUserAvatar, updateUserSettings]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;