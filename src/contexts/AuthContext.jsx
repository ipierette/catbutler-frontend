/**
 * 🔐 AuthContext - Gerenciamento de Autenticação
 * Context para gerenciar estado de usuário e perfil em toda aplicação
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// Fast Refresh signature para desenvolvimento
if (import.meta.hot) {
  import.meta.hot.accept();
}

console.log('🔐 AuthContext: Iniciando...');

// Imports com debugging
import { supabase, getUserProfile, onAuthStateChange, updateUserProfile } from '../utils/supabase';
import { avatarList, allAvatars } from '../utils/avatars';

console.log('✅ AuthContext: Imports realizados com sucesso', {
  supabase: !!supabase,
  getUserProfile: !!getUserProfile,
  onAuthStateChange: !!onAuthStateChange,
  avatarList: !!avatarList
});

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

  // 🧹 Função para limpeza forçada de cache
  const forceClearCache = () => {
    if (import.meta.env.DEV) {
      console.log('🧹 Limpando cache após mudança de autenticação...');
      
      // Limpar storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Erro ao limpar storage:', e);
      }
      
      // Limpar caches do browser
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      // Force reload da página para garantir estado limpo
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

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
        // Se houver erro, limpa tudo para garantir
        setUser(null);
        setProfile(null);
      } else if (session?.user) {
        // Verifica se há flag de logout forçado
        const forceLogout = sessionStorage.getItem('force_logout');
        if (forceLogout) {
          console.log('🚨 Logout forçado detectado, ignorando sessão...');
          sessionStorage.removeItem('force_logout');
          await supabase.auth.signOut({ scope: 'global' });
          setUser(null);
          setProfile(null);
        } else {
          console.log('✅ Sessão ativa encontrada:', session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
        }
      } else {
        console.log('ℹ️ Nenhuma sessão ativa - modo visitante');
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('🚨 Erro na inicialização:', error);
      // Em caso de erro, garante que está limpo
      setUser(null);
      setProfile(null);
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
        let errorMessage = error.message;
        
        // Traduzir erros comuns para português
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('✅ Login realizado com sucesso!');
      setUser(data.user);
      
      // Limpar dados de aplicação antes de carregar novos dados
      sessionStorage.removeItem('visitor_tasks_cache');
      localStorage.removeItem('tasks_cache');
      
      // Limpar cache em desenvolvimento
      if (import.meta.env.DEV) {
        console.log('🧹 Limpando cache após login...');
        forceClearCache();
      }
      
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

      // Define flag de logout forçado ANTES de tudo
      sessionStorage.setItem('force_logout', 'true');

      // Primeiro, limpa o estado local imediatamente
      setUser(null);
      setProfile(null);
      
      // Limpa localStorage e sessionStorage (exceto a flag)
      const forceLogoutFlag = sessionStorage.getItem('force_logout');
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('force_logout', forceLogoutFlag);
      
      // Tenta fazer logout do Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global'  // Desloga de todas as sessões
      });
      
      if (error) {
        console.error('🚨 Erro no logout do Supabase:', error);
        // Mesmo com erro, considera o logout como sucesso já que limpamos tudo
        console.log('✅ Estado local limpo, continuando logout...');
      } else {
        console.log('✅ Logout do Supabase realizado com sucesso!');
      }

      // Força limpeza adicional
      try {
        // Limpa cookies relacionados ao Supabase
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      } catch (cookieError) {
        console.warn('Aviso: Não foi possível limpar cookies:', cookieError);
      }

      console.log('✅ Logout completo realizado!');
      
      // Limpar cache em desenvolvimento
      forceClearCache();
      
      // Força reinicialização após um pequeno delay
      setTimeout(() => {
        window.location.reload();
      }, 500);

      return { success: true };
    } catch (error) {
      console.error('🚨 Erro inesperado no logout:', error);
      // Mesmo com erro, força limpeza do estado local
      sessionStorage.setItem('force_logout', 'true');
      setUser(null);
      setProfile(null);
      localStorage.clear();
      
      // Força reload em caso de erro também
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return { success: true }; // Retorna sucesso pois limpamos o estado
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (newProfileData) => {
    try {
      console.log('🔄 Atualizando perfil...', newProfileData);

      if (!user?.id) {
        throw new Error('Usuário não está autenticado');
      }

      // Salvar no Supabase
      const result = await updateUserProfile(user.id, newProfileData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Atualizar estado local apenas se salvou com sucesso
      setProfile(prev => ({
        ...prev,
        ...result.profile,
        // Mapear campos do banco para o formato esperado pelo contexto
        avatar: result.profile.avatar_url || result.profile.avatar,
        nome: result.profile.display_name || result.profile.nome
      }));

      console.log('✅ Perfil atualizado com sucesso!', result.profile);
      return { success: true, profile: result.profile };

    } catch (error) {
      console.error('🚨 Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  };

  // Função para obter nome de exibição
  const getDisplayName = () => {
    if (isAuthenticated && (profile?.display_name || profile?.nome)) {
      return profile.display_name || profile.nome;
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

  // Avatares disponíveis (incluindo especiais)
  const availableAvatars = allAvatars;  // Função para obter avatar do usuário
  const getUserAvatar = () => {
    console.log('🔍 getUserAvatar Debug:', {
      isVisitorMode,
      profile,
      profileAvatar: profile?.avatar,
      profileAvatarUrl: profile?.avatar_url,
      availableAvatars: availableAvatars.length
    });
    
    if (!isVisitorMode && (profile?.avatar || profile?.avatar_url)) {
      // Suportar tanto avatar quanto avatar_url
      const avatarId = profile?.avatar || profile?.avatar_url;
      const avatar = availableAvatars.find(a => a.id === avatarId);
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
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log('🚪 Limpando estado após logout/sem sessão...');
        setUser(null);
        setProfile(null);
        
        // Limpa storage novamente para garantir
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Estado limpo no listener');
        setLoading(false);
        return;
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔑 Processando login...');
        setUser(session.user);
        await loadUserProfile(session.user);
        
        // Aplicar recompensas de login após definir usuário
        setTimeout(() => {
          // Disparar evento customizado para verificar recompensas diárias
          window.dispatchEvent(new CustomEvent('userLoggedIn', { 
            detail: { user: session.user }
          }));
        }, 1000);
        
        // Para login social, redirecionar automaticamente
        if (session.user.app_metadata?.provider && session.user.app_metadata.provider !== 'email') {
          console.log('✅ Login social concluído, redirecionando...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
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