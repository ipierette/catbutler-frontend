/**
 * 🐱 CatButler Frontend - Supabase Client
 * Configuração do cliente Supabase para o frontend React
 */

import { createClient } from '@supabase/supabase-js';

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Modo degradado - se não há configuração Supabase, funciona em modo visitante
const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.warn(
    '⚠️ Configuração Supabase incompleta - funcionando em modo visitante!\n' +
    'Para autenticação completa, configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY'
  );
}

// Exportar status da configuração para uso em outros componentes
export { hasSupabaseConfig };

// Criar cliente Supabase ou mock para modo visitante
export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Configurações de autenticação
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      // Configurações globais
      global: {
        headers: {
          'X-Client-Info': 'catbutler-frontend@4.0.0'
        }
      }
    })
  : {
      // Mock client para modo visitante
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: (callback) => {
          callback('SIGNED_OUT', null);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signUp: () => Promise.resolve({ error: { message: 'Supabase não configurado' } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase não configurado' } }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ error: { message: 'Supabase não configurado' } }),
        update: () => Promise.resolve({ error: { message: 'Supabase não configurado' } }),
        delete: () => Promise.resolve({ error: { message: 'Supabase não configurado' } })
      })
    };

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async () => {
  try {
    if (!hasSupabaseConfig) {
      console.log('🔄 Supabase não configurado - modo visitante ativo');
      return false;
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('🚨 Erro ao verificar sessão:', error);
      return false;
    }
    
    return !!session && !!session.user;
  } catch (error) {
    console.error('🚨 Erro inesperado ao verificar autenticação:', error);
    return false;
  }
};

// Função para obter o usuário atual
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('🚨 Erro ao obter usuário:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('🚨 Erro inesperado ao obter usuário:', error);
    return null;
  }
};

// Função para fazer login
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });
    
    if (error) {
      // Mensagens de erro mais amigáveis
      const friendlyMessages = {
        'Invalid login credentials': 'Email ou senha incorretos',
        'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
        'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
        'User not found': 'Usuário não encontrado',
        'Invalid email': 'Email inválido'
      };
      
      const friendlyMessage = friendlyMessages[error.message] || error.message;
      throw new Error(friendlyMessage);
    }
    
    return {
      success: true,
      user: data.user,
      session: data.session
    };
    
  } catch (error) {
    console.error('🚨 Erro no login:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para fazer signup
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        data: {
          // Metadados opcionais do usuário
          display_name: metadata.displayName || metadata.display_name || email.split('@')[0],
          first_name: metadata.firstName || metadata.first_name || metadata.displayName?.split(' ')[0] || email.split('@')[0],
          last_name: metadata.lastName || metadata.last_name || metadata.displayName?.split(' ').slice(1).join(' ') || '',
          ...metadata
        },
        // Configuração de confirmação por email
        emailRedirectTo: import.meta.env.PROD 
          ? 'https://catbutler-frontend.vercel.app/login?confirmed=true'
          : `${window.location.origin}/login?confirmed=true`
      }
    });
    
    if (error) {
      // Mensagens de erro mais amigáveis
      const friendlyMessages = {
        'User already registered': 'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.',
        'Invalid email': 'Email inválido. Verifique se digitou corretamente.',
        'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
        'Signup is disabled': 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.',
        'Email address is invalid': 'Email inválido. Verifique se digitou corretamente.',
        'Unable to validate email address: invalid format': 'Formato de email inválido'
      };
      
      const friendlyMessage = friendlyMessages[error.message] || error.message;
      console.error('🚨 Erro no cadastro Supabase:', error);
      throw new Error(friendlyMessage);
    }
    
    console.log('✅ Usuário criado no Supabase:', {
      id: data.user?.id,
      email: data.user?.email,
      confirmed: !!data.session,
      needsConfirmation: !data.session
    });
    
    return {
      success: true,
      user: data.user,
      session: data.session,
      needsConfirmation: !data.session // Se não há sessão, precisa confirmar email
    };
    
  } catch (error) {
    console.error('🚨 Erro no cadastro:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para fazer logout
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('🚨 Erro no logout:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Event listener para mudanças na autenticação
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state changed:', event, session?.user?.email || 'No user');
    callback(event, session);
  });
};

// Função para obter perfil do usuário (direto do Supabase)
export const getUserProfile = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Usuário não autenticado');
    }
    
    // Busca o perfil diretamente no Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      // Se tabela não existir, tentar fallback do localStorage
      if (profileError.message?.includes('table') && profileError.message?.includes('profiles')) {
        console.warn('⚠️ Tabela profiles não existe - tentando localStorage');
        
        const fallbackData = localStorage.getItem(`profile_${session.user.id}`);
        if (fallbackData) {
          const profile = JSON.parse(fallbackData);
          console.log('✅ Perfil carregado do localStorage:', profile);
          return {
            success: true,
            profile
          };
        }
      }
      
      // Se o perfil não existir, criar um básico
      if (profileError.code === 'PGRST116' || profileError.message?.includes('no rows')) {
        console.log('📝 Perfil não encontrado, criando perfil básico...');
        
        const newProfile = {
          id: session.user.id,
          display_name: session.user.email?.split('@')[0] || 'Usuário',
          first_name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'Usuário',
          last_name: session.user.user_metadata?.last_name || '',
          avatar_url: 'axel',
          theme: 'auto'
        };
        
        // Tentar criar no banco, se falhar, usar localStorage
        try {
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (createError) {
            throw new Error(`Erro ao criar perfil: ${createError.message}`);
          }
          
          return {
            success: true,
            profile: createdProfile
          };
        } catch (createErr) {
          console.warn('⚠️ Não foi possível criar no banco, usando localStorage');
          localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(newProfile));
          return {
            success: true,
            profile: newProfile
          };
        }
      } else {
        throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
      }
    }
    
    return {
      success: true,
      profile: profileData
    };
    
  } catch (error) {
    console.error('🚨 Erro ao obter perfil:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Debug info (apenas em desenvolvimento)
if (import.meta.env.VITE_DEBUG === 'true') {
  console.log('🐱 Supabase Client inicializado:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    config: hasSupabaseConfig
  });
}

// Função para atualizar perfil do usuário
export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!hasSupabaseConfig) {
      console.warn('🔄 Supabase não configurado - simulando atualização de perfil');
      return {
        success: true,
        profile: { ...profileData, id: userId }
      };
    }

    console.log('🔄 Atualizando perfil no Supabase...', { userId, profileData });
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: profileData.display_name,
        avatar_url: profileData.avatar_url,
        endereco: profileData.endereco,
        auto_theme_change: profileData.auto_theme_change,
        preferences: profileData.preferences,
        updated_at: new Date().toISOString(),
        ...profileData
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('🚨 Erro ao atualizar perfil:', error);
      
      // Se tabela não existir, usar fallback local
      if (error.message?.includes('table') && error.message?.includes('profiles')) {
        console.warn('⚠️ Tabela profiles não existe - usando persistência local temporária');
        
        // Salvar no localStorage como fallback
        const fallbackProfile = { 
          id: userId, 
          ...profileData, 
          updated_at: new Date().toISOString() 
        };
        localStorage.setItem(`profile_${userId}`, JSON.stringify(fallbackProfile));
        
        return {
          success: true,
          profile: fallbackProfile
        };
      }
      
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    console.log('✅ Perfil atualizado com sucesso:', data);
    
    return {
      success: true,
      profile: data
    };

  } catch (error) {
    console.error('🚨 Erro ao atualizar perfil:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default supabase;