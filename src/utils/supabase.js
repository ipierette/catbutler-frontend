/**
 * 🐱 CatButler Frontend - Supabase Client
 * Configuração do cliente Supabase para o frontend React
 */

import { createClient } from '@supabase/supabase-js';

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '🚨 Configuração Supabase incompleta!\n' +
    'Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no .env.local'
  );
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async () => {
  try {
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
        emailRedirectTo: `${window.location.origin}/login?confirmed=true`
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
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      // Se o perfil não existir, criar um básico
      if (profileError.code === 'PGRST116') {
        console.log('📝 Perfil não encontrado, criando perfil básico...');
        
        const newProfile = {
          id: session.user.id,
          display_name: session.user.email?.split('@')[0] || 'Usuário',
          first_name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'Usuário',
          last_name: session.user.user_metadata?.last_name || '',
          avatar: 'axel',
          theme: 'auto'
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
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
    env: import.meta.env.VITE_ENV
  });
}

export default supabase;