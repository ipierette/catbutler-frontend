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
      .from('user_profiles')
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
          theme: 'auto',
          auto_theme_change: false,
          preferences: '{}',
          endereco: ''
        };
        
        // Tentar criar no banco, se falhar, usar localStorage
        try {
          // Only send valid columns
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: newProfile.id,
              display_name: newProfile.display_name,
              first_name: newProfile.first_name,
              last_name: newProfile.last_name,
              avatar_url: newProfile.avatar_url,
              theme: newProfile.theme,
              auto_theme_change: newProfile.auto_theme_change,
              preferences: newProfile.preferences,
              endereco: newProfile.endereco
            }])
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
    
    // Preparar dados para atualização
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    // Adicionar campos apenas se estiverem presentes
    if (profileData.display_name || profileData.nome) {
      updateData.display_name = profileData.display_name || profileData.nome;
    }
    if (profileData.first_name) updateData.first_name = profileData.first_name;
    if (profileData.last_name) updateData.last_name = profileData.last_name;
    if (profileData.avatar || profileData.avatar_url) {
      updateData.avatar = profileData.avatar || profileData.avatar_url;
      console.log('🎭 Atualizando avatar para:', updateData.avatar);
    }
    if (profileData.theme) updateData.theme = profileData.theme;
    
    console.log('📝 Dados que serão enviados para o Supabase:', updateData);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('🚨 Erro detalhado ao atualizar perfil:', {
        error,
        userId,
        updateData,
        errorCode: error.code,
        errorMessage: error.message
      });
      
      // Se tabela não existir, usar fallback local
      if (error.message?.includes('table') && (error.message?.includes('profiles') || error.message?.includes('user_profiles'))) {
        console.warn('⚠️ Tabela user_profiles não existe - usando persistência local temporária');
        
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

    console.log('✅ Perfil atualizado com sucesso no Supabase:', data);
    console.log('🎭 Avatar salvo:', data?.avatar);
    
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

// ==========================================
// 📝 FUNÇÕES DE TAREFAS (TASKS)
// ==========================================

// Função para criar uma nova tarefa
export const createTask = async (taskData) => {
  try {
    if (!hasSupabaseConfig) {
      console.warn('🔄 Supabase não configurado - simulando criação de tarefa');
      return {
        success: true,
        task: { 
          id: Math.random().toString(36).substr(2, 9),
          user_id: 'mock-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          data_criacao: new Date().toISOString(),
          ...taskData 
        }
      };
    }

    console.log('🔄 Criando tarefa no Supabase...', taskData);
    
    // Obter usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: user.id, // ADICIONAR user_id explicitamente
        titulo: taskData.titulo,
        descricao: taskData.descricao,
        categoria: taskData.categoria || 'Outros',
        prioridade: taskData.prioridade || 'Média',
        status: taskData.status || 'Pendente',
        data_vencimento: taskData.data_vencimento || null
      }])
      .select()
      .single();

    if (error) {
      console.error('🚨 Erro ao criar tarefa:', error);
      throw new Error(`Erro ao criar tarefa: ${error.message}`);
    }

    console.log('✅ Tarefa criada com sucesso:', data);
    return { success: true, task: data };

  } catch (error) {
    console.error('🚨 Erro ao criar tarefa:', error);
    return { success: false, error: error.message };
  }
};

// Função para buscar todas as tarefas do usuário
export const getTasks = async (filters = {}) => {
  try {
    if (!hasSupabaseConfig) {
      console.warn('🔄 Supabase não configurado - nenhuma tarefa disponível');
      return {
        success: true,
        tasks: []
      };
    }

    console.log('🔄 Buscando tarefas no Supabase...', filters);
    
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters.status && filters.status !== 'Todas') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.categoria && filters.categoria !== 'Todas') {
      query = query.eq('categoria', filters.categoria);
    }
    
    if (filters.busca) {
      query = query.or(`titulo.ilike.%${filters.busca}%,descricao.ilike.%${filters.busca}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('🚨 Erro ao buscar tarefas:', error);
      throw new Error(`Erro ao buscar tarefas: ${error.message}`);
    }

    console.log(`✅ ${data.length} tarefas encontradas`);
    return { success: true, tasks: data };

  } catch (error) {
    console.error('🚨 Erro ao buscar tarefas:', error);
    return { success: false, error: error.message, tasks: [] };
  }
};

// Função para atualizar uma tarefa
export const updateTask = async (taskId, updates) => {
  try {
    if (!hasSupabaseConfig) {
      console.warn('🔄 Supabase não configurado - simulando atualização de tarefa');
      return {
        success: true,
        task: { id: taskId, ...updates, updated_at: new Date().toISOString() }
      };
    }

    console.log('🔄 Atualizando tarefa no Supabase...', { taskId, updates });
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('🚨 Erro ao atualizar tarefa:', error);
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
    }

    console.log('✅ Tarefa atualizada com sucesso:', data);
    return { success: true, task: data };

  } catch (error) {
    console.error('🚨 Erro ao atualizar tarefa:', error);
    return { success: false, error: error.message };
  }
};

// Função para deletar uma tarefa
export const deleteTask = async (taskId) => {
  try {
    if (!hasSupabaseConfig) {
      console.warn('🔄 Supabase não configurado - simulando exclusão de tarefa');
      return { success: true };
    }

    console.log('🔄 Deletando tarefa no Supabase...', taskId);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('🚨 Erro ao deletar tarefa:', error);
      throw new Error(`Erro ao deletar tarefa: ${error.message}`);
    }

    console.log('✅ Tarefa deletada com sucesso');
    return { success: true };

  } catch (error) {
    console.error('🚨 Erro ao deletar tarefa:', error);
    return { success: false, error: error.message };
  }
};

// Função para obter estatísticas das tarefas
export const getTasksStats = async () => {
  try {
    if (!hasSupabaseConfig) {
      console.warn('🔄 Supabase não configurado - sem estatísticas disponíveis');
      return {
        success: true,
        stats: {
          total_tasks: 0,
          pending_tasks: 0,
          in_progress_tasks: 0,
          completed_tasks: 0,
          overdue_tasks: 0
        }
      };
    }

    console.log('🔄 Buscando estatísticas das tarefas...');
    
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .rpc('get_tasks_stats', { user_uuid: user.id });

    if (error) {
      console.error('🚨 Erro ao buscar estatísticas:', error);
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    console.log('✅ Estatísticas obtidas:', data[0]);
    return { success: true, stats: data[0] };

  } catch (error) {
    console.error('🚨 Erro ao buscar estatísticas:', error);
    return { success: false, error: error.message, stats: null };
  }
};

export default supabase;