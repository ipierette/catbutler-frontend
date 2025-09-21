// 🍳 CozinhaIA - Hook React para integração com backend
// Sistema completo de conexão com as APIs do backend usando React hooks

import { useState, useCallback, useEffect, useMemo } from 'react';

// ============================================
// 🔧 CONFIGURAÇÃO E CONSTANTES
// ============================================

// Configuração da API
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/kitchen`
    : import.meta.env.MODE === 'production' 
      ? 'https://catbutler-backend-56xkta02t-izadora-cury-pierettes-projects.vercel.app/api/kitchen'
      : 'http://localhost:3000/api/kitchen',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Debug: Log da URL sendo usada
console.log('🔧 CozinhaIA API Config:', {
  mode: import.meta.env.MODE,
  baseURL: API_CONFIG.BASE_URL,
  timestamp: new Date().toISOString()
});

// ============================================
// 🌐 CLIENTE HTTP PROFISSIONAL
// ============================================

class CozinhaAPIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  // Método HTTP genérico com retry
  async makeRequest(endpoint, options = {}, attempt = 1) {
    // Garante que não haja barras duplas entre baseURL e endpoint
    const base = this.baseURL.replace(/\/$/, '');
    const path = endpoint.replace(/^\//, '');
    const url = `${base}/${path}`;

    // Adiciona Authorization para endpoints protegidos
    const protectedEndpoints = ['/favorites'];
    const isProtected = protectedEndpoints.some(e => endpoint.startsWith(e));
    if (isProtected) {
      try {
        // Importa dinamicamente o supabase client
        const { supabase } = await import('../utils/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (token) {
          options.headers = options.headers || {};
          options.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Não foi possível obter token do Supabase:', e);
      }
    }

    try {
      console.log(`🌐 [Tentativa ${attempt}] ${options.method || 'GET'} ${endpoint}`);
      console.log(`🔗 URL completa: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Sucesso ${endpoint} em ${attempt} tentativa(s)`);
      return data;

    } catch (error) {
      console.error(`❌ Erro tentativa ${attempt} para ${endpoint}:`, error.message);

      // Retry em caso de falha de rede ou timeout
      if (attempt < this.retryAttempts && 
          (error.name === 'AbortError' || error.name === 'TypeError')) {
        console.log(`🔄 Tentando novamente em 2s...`);
        await this.delay(2000 * attempt);
        return this.makeRequest(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ================== ENDPOINTS ==================

  // 🔮 Sugestões de Receitas
  async obterSugestoes(ingredientes) {
    if (!ingredientes?.length) {
      throw new Error('Lista de ingredientes é obrigatória');
    }

    return this.makeRequest('/suggestions', {
      method: 'POST',
      body: JSON.stringify({ ingredientes }),
    });
  }

  // 🔍 Busca de Receitas
  async buscarReceitas(params) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const endpoint = searchParams.toString() ? 
      `/search?${searchParams.toString()}` : 
      '/search';

    return this.makeRequest(endpoint);
  }

  // 🤖 Chat com Chef IA
  async chatComChef(mensagem, ingredientes = [], isVisitorMode = false) {
    if (!mensagem?.trim()) {
      throw new Error('Mensagem é obrigatória');
    }

    return this.makeRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({
        mensagem: mensagem.trim(),
        ingredientes,
        isVisitorMode,
      }),
    });
  }

  // ⭐ Favoritos
  async listarFavoritos() {
    return this.makeRequest('/favorites');
  }

  async adicionarFavorito(favorito) {
    return this.makeRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify(favorito),
    });
  }

  async atualizarFavorito(id, updates) {
    return this.makeRequest('/favorites', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async removerFavorito(id) {
    return this.makeRequest('/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }
}

// Instância singleton
const apiClient = new CozinhaAPIClient();

// ============================================
// 🎯 HOOK REACT PARA SUGESTÕES
// ============================================

export function useSugestoes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receitas, setReceitas] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    fontes: { local: 0, mealdb: 0, ia: 0 },
    tempoResposta: 0,
    ingredientesPesquisados: []
  });

  const buscarSugestoes = useCallback(async (ingredientes) => {
    if (!ingredientes?.length) {
      setError('Selecione pelo menos um ingrediente');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔮 Buscando sugestões para:', ingredientes);
      
      const response = await apiClient.obterSugestoes(ingredientes);
      
      if (response.success) {
        setReceitas(response.data.receitas);
        setEstatisticas({
          total: response.data.total,
          fontes: response.data.fontes,
          tempoResposta: response.data.tempoResposta,
          ingredientesPesquisados: response.data.ingredientesPesquisados
        });
        
        console.log(`✅ ${response.data.total} sugestões carregadas em ${response.data.tempoResposta}ms`);
      } else {
        throw new Error(response.error || 'Erro ao buscar sugestões');
      }
      
    } catch (err) {
      setError(err.message || 'Erro ao buscar sugestões');
      console.error('❌ Erro nas sugestões:', err);
      setReceitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const limparSugestoes = useCallback(() => {
    setReceitas([]);
    setError(null);
    setEstatisticas({
      total: 0,
      fontes: { local: 0, mealdb: 0, ia: 0 },
      tempoResposta: 0,
      ingredientesPesquisados: []
    });
  }, []);

  // Computed properties usando useMemo
  const receitasLocais = useMemo(() => receitas.filter(r => r.fonte === 'local'), [receitas]);
  const receitasMealDB = useMemo(() => receitas.filter(r => r.fonte === 'mealdb'), [receitas]);
  const receitasIA = useMemo(() => receitas.filter(r => r.fonte === 'ia'), [receitas]);
  const temResultados = useMemo(() => receitas.length > 0, [receitas]);

  return {
    // Estado
    loading,
    error,
    receitas,
    estatisticas,
    
    // Computadas
    receitasLocais,
    receitasMealDB,
    receitasIA,
    temResultados,
    
    // Ações
    buscarSugestoes,
    limparSugestoes
  };
}

// ============================================
// 🔍 HOOK REACT PARA BUSCA
// ============================================

export function useBusca() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const [totalResultados, setTotalResultados] = useState(0);

  const buscar = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Buscando receitas com parâmetros:', params);
      
      const response = await apiClient.buscarReceitas(params);
      
      if (response.success) {
        setResultados(response.data.receitas);
        setFiltrosAtivos(response.data.filtros);
        setTotalResultados(response.data.total);
        
        console.log(`✅ ${response.data.total} resultados encontrados`);
      } else {
        throw new Error(response.error || 'Erro na busca');
      }
      
    } catch (err) {
      setError(err.message || 'Erro ao buscar receitas');
      console.error('❌ Erro na busca:', err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorNome = useCallback((nome, limit = 12) => {
    return buscar({ query: nome, limit });
  }, [buscar]);

  const buscarPorIngrediente = useCallback((ingrediente, limit = 12) => {
    return buscar({ ingrediente, limit });
  }, [buscar]);

  const buscarPorCategoria = useCallback((categoria, limit = 12) => {
    return buscar({ categoria, limit });
  }, [buscar]);

  const receitasAleatorias = useCallback((limit = 8) => {
    return buscar({ limit });
  }, [buscar]);

  const limparResultados = useCallback(() => {
    setResultados([]);
    setFiltrosAtivos({});
    setTotalResultados(0);
    setError(null);
  }, []);

  return {
    // Estado
    loading,
    error,
    resultados,
    filtrosAtivos,
    totalResultados,
    
    // Ações
    buscar,
    buscarPorNome,
    buscarPorIngrediente,
    buscarPorCategoria,
    receitasAleatorias,
    limparResultados
  };
}

// ============================================
// 🤖 HOOK REACT PARA CHAT
// ============================================

export function useChefChat(isVisitorMode = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversa, setConversa] = useState([]);
  const [limiteDiario, setLimiteDiario] = useState(100);
  const [tokensUsados, setTokensUsados] = useState(0);

  const enviarMensagem = useCallback(async (mensagem, ingredientesContexto = []) => {
    if (!mensagem?.trim()) {
      setError('Digite uma mensagem');
      return;
    }

    // Adicionar mensagem do usuário
    const mensagemUsuario = {
      id: `user-${Date.now()}`,
      tipo: 'usuario',
      texto: mensagem.trim(), // Corrigido para 'texto' para compatibilidade com o componente
      timestamp: new Date()
    };
    setConversa(prev => [...prev, mensagemUsuario]);

    setLoading(true);
    setError(null);

    try {
      console.log('🤖 Enviando mensagem para Chef IA:', mensagem);
      
      const response = await apiClient.chatComChef(
        mensagem.trim(), 
        ingredientesContexto, 
        isVisitorMode
      );

      if (response.success) {
        // Adicionar resposta do chef
        const respostaChef = {
          id: `chef-${Date.now()}`,
          tipo: 'ia', // Corrigido para 'ia' para compatibilidade com o componente
          texto: response.data.resposta, // Corrigido para 'texto' para compatibilidade
          sugestoes: response.data.sugestoes,
          timestamp: new Date()
        };
        setConversa(prev => [...prev, respostaChef]);

        // Atualizar estatísticas
        if (response.data.tokensUsados) {
          setTokensUsados(response.data.tokensUsados);
        }
        if (response.data.limiteDiario) {
          setLimiteDiario(response.data.limiteDiario);
        }

        console.log('✅ Resposta do Chef recebida');
      } else {
        throw new Error(response.error || 'Erro no chat');
      }

    } catch (err) {
      setError(err.message || 'Erro ao conversar com o Chef');
      console.error('❌ Erro no chat:', err);
      
      // Adicionar mensagem de erro
      setConversa(prev => [...prev, {
        id: `error-${Date.now()}`,
        tipo: 'ia',
        texto: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  }, [isVisitorMode]);

  const limparConversa = useCallback(() => {
    setConversa([]);
    setError(null);
  }, []);

  // Computed usando useMemo
  const podeEnviarMensagem = useMemo(() => 
    !loading && (!isVisitorMode || tokensUsados < limiteDiario)
  , [loading, isVisitorMode, tokensUsados, limiteDiario]);

  const progressoLimite = useMemo(() => 
    isVisitorMode ? (tokensUsados / limiteDiario) * 100 : 0
  , [isVisitorMode, tokensUsados, limiteDiario]);

  return {
    // Estado
    loading,
    error,
    conversa,
    tokensUsados,
    limiteDiario,
    
    // Computadas
    podeEnviarMensagem,
    progressoLimite,
    
    // Ações
    enviarMensagem,
    limparConversa
  };
}

// ============================================
// ⭐ HOOK REACT PARA FAVORITOS
// ============================================

export function useFavoritos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  const carregarFavoritos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('⭐ Carregando favoritos...');
      
      const response = await apiClient.listarFavoritos();
      
      if (response.success) {
        setFavoritos(response.data.favoritos || []);
        console.log(`✅ ${response.data.favoritos?.length || 0} favoritos carregados`);
      } else {
        throw new Error('Erro ao carregar favoritos');
      }
      
    } catch (err) {
      setError(err.message || 'Erro ao carregar favoritos');
      console.error('❌ Erro nos favoritos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarFavorito = useCallback(async (receita, rating, notas) => {
    try {
      console.log('⭐ Adicionando favorito:', receita.nome);
      
      const favoritoData = {
        receita_id: receita.id,
        nome: receita.nome,
        descricao: `Receita ${receita.nome}`,
        ingredientes: receita.ingredientes,
        instrucoes: receita.instrucoes,
        tempo_minutos: receita.tempoEstimado ? parseInt(receita.tempoEstimado) : undefined,
        dificuldade: receita.dificuldade,
        imagem_url: receita.imagem,
        rating,
        notas_pessoais: notas
      };

      const response = await apiClient.adicionarFavorito(favoritoData);
      
      if (response.success) {
        await carregarFavoritos(); // Recarregar lista
        console.log('✅ Favorito adicionado');
      } else {
        throw new Error('Erro ao adicionar favorito');
      }
      
    } catch (err) {
      setError(err.message || 'Erro ao adicionar favorito');
      console.error('❌ Erro ao adicionar favorito:', err);
      throw err;
    }
  }, [carregarFavoritos]);

  const removerFavorito = useCallback(async (id) => {
    try {
      console.log('🗑️ Removendo favorito:', id);
      
      const response = await apiClient.removerFavorito(id);
      
      if (response.success) {
        setFavoritos(prev => prev.filter(f => f.id !== id));
        console.log('✅ Favorito removido');
      } else {
        throw new Error('Erro ao remover favorito');
      }
      
    } catch (err) {
      setError(err.message || 'Erro ao remover favorito');
      console.error('❌ Erro ao remover favorito:', err);
      throw err;
    }
  }, []);

  const isFavorito = useCallback((receitaId) => {
    return favoritos.some(f => f.receita_id === receitaId);
  }, [favoritos]);

  // Auto-carregar favoritos ao inicializar
  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  return {
    // Estado
    loading,
    error,
    favoritos,
    
    // Ações
    carregarFavoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito
  };
}

// ============================================
// 🎯 HOOK PRINCIPAL - COZINHA IA REACT
// ============================================

export function useCozinhaIA(isVisitorMode = false) {
  // Estados dos módulos
  const sugestoes = useSugestoes();
  const busca = useBusca();
  const chat = useChefChat(isVisitorMode);
  const favoritos = useFavoritos();

  // Estado global da aplicação
  const [abaSelecionada, setAbaSelecionada] = useState('sugestoes');
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [ingredientesDisponiveis] = useState([
    'frango', 'carne bovina', 'peixe', 'arroz', 'macarrão', 'batata',
    'tomate', 'cebola', 'alho', 'pimentão', 'cenoura', 'brócolis',
    'queijo', 'ovos', 'leite', 'azeite', 'sal', 'pimenta'
  ]);

  // Efeito para auto-buscar quando ingredientes mudam
  useEffect(() => {
    if (ingredientesSelecionados.length > 0 && abaSelecionada === 'sugestoes') {
      sugestoes.buscarSugestoes(ingredientesSelecionados);
    }
  }, [ingredientesSelecionados, abaSelecionada, sugestoes]);

  // Ações globais
  const adicionarIngrediente = useCallback((ingrediente) => {
    if (!ingrediente.trim()) return;
    
    const ingredienteLimpo = ingrediente.trim().toLowerCase();
    if (!ingredientesSelecionados.includes(ingredienteLimpo)) {
      setIngredientesSelecionados(prev => [...prev, ingredienteLimpo]);
      console.log('🥕 Ingrediente adicionado:', ingredienteLimpo);
    }
  }, [ingredientesSelecionados]);

  const removerIngrediente = useCallback((ingrediente) => {
    setIngredientesSelecionados(prev => prev.filter(ing => ing !== ingrediente));
    console.log('🗑️ Ingrediente removido:', ingrediente);
  }, []);

  const limparIngredientes = useCallback(() => {
    setIngredientesSelecionados([]);
    sugestoes.limparSugestoes();
    console.log('🧹 Ingredientes limpos');
  }, [sugestoes]);

  const trocarAba = useCallback((novaAba) => {
    setAbaSelecionada(novaAba);
    console.log('📑 Aba selecionada:', novaAba);
  }, []);

  // Computed properties globais usando useMemo
  const temIngredientes = useMemo(() => ingredientesSelecionados.length > 0, [ingredientesSelecionados]);
  const podeGerarSugestoes = useMemo(() => temIngredientes && !sugestoes.loading, [temIngredientes, sugestoes.loading]);

  return {
    // Estados dos módulos
    sugestoes,
    busca,
    chat,
    favoritos,

    // Estado global
    abaSelecionada,
    ingredientesSelecionados,
    ingredientesDisponiveis,

    // Computadas globais
    temIngredientes,
    podeGerarSugestoes,

    // Ações globais
    adicionarIngrediente,
    removerIngrediente,
    limparIngredientes,
    trocarAba
  };
}

// ============================================
// 🚀 EXPORT PRINCIPAL
// ============================================

export default useCozinhaIA;