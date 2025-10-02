// ============================================
// 🌐 CONFIG E CLIENTE HTTP PARA API
// ============================================
const API_CONFIG = {
  BASE_URL: import.meta.env.MODE === 'production'
    ? 'https://catbutler-backend.vercel.app/api/kitchen'
    : 'http://localhost:3000/api/kitchen',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

class CozinhaAPIClient {
  async gerarCardapioSemanal(opcoes = {}) {
    return this.makeRequest(`/weekly-menu`, {
      method: 'POST',
      body: JSON.stringify(opcoes)
    });
  }
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  async makeRequest(endpoint, options = {}, attempt = 1) {
    const url = `${this.baseURL}${endpoint}`;
    try {
      console.log(`🌐 [Tentativa ${attempt}] ${options.method || 'GET'} ${endpoint}`);
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
      if (attempt < this.retryAttempts && (error.name === 'AbortError' || error.name === 'TypeError')) {
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

  // Endpoints
  async obterSugestoes(ingredientes) {
    if (!ingredientes?.length) {
      return { success: false, error: 'Nenhum ingrediente informado' };
    }
    return this.makeRequest(`/suggestions`, {
      method: 'POST',
      body: JSON.stringify({ ingredientes })
    });
  }

  async buscarReceitas(params) {
    return this.makeRequest(`/search`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async chatComChef(mensagem, ingredientesContexto = [], isVisitorMode = false) {
    return this.makeRequest(`/chat`, {
      method: 'POST',
      body: JSON.stringify({ mensagem, ingredientes: ingredientesContexto, isVisitorMode })
    });
  }
}

const apiClient = new CozinhaAPIClient();
// ============================================
// 🔍 HOOK REACT PARA BUSCA DE RECEITAS
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
// 🥄 HOOK REACT PARA SUGESTÕES
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
      console.log('🔎 Buscando sugestões para:', ingredientes);
      
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
// 🍳 CozinhaIA - Hook React para integração com backend
// Sistema completo de conexão com as APIs do backend usando React hooks

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

// ============================================
// Favoritos removidos: hook e referências eliminados.

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
// 🎯 HOOK PRINCIPAL - COZINHA IA REACT
// ============================================

export function useCozinhaIA(isVisitorMode = false) {
  // Estados dos módulos
  const sugestoes = useSugestoes();
  const busca = useBusca();
  const chat = useChefChat(isVisitorMode);
  
  // Importar user do contexto de auth
  const { user } = useAuth();

  // Cardápio semanal
  const [cardapioSemanal, setCardapioSemanal] = useState(null);
  const [estatisticasCardapio, setEstatisticasCardapio] = useState(null);
  const [loadingCardapio, setLoadingCardapio] = useState(false);
  const [erroCardapio, setErroCardapio] = useState(null);
  const [podeGerar, setPodeGerar] = useState(true);
  const [proximaGeracao, setProximaGeracao] = useState(null);
  const [versaoAtual, setVersaoAtual] = useState(1);

  // Verificar se pode gerar cardápio esta semana
  const verificarCardapioSemanal = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/weekly-menu?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setPodeGerar(data.canGenerate);
        setProximaGeracao(data.nextAvailable);
        
        // Se já tem cardápio desta semana, carregar
        if (!data.canGenerate && data.existingMenu) {
          setCardapioSemanal(data.existingMenu.cardapio_atual);
          setEstatisticasCardapio(data.existingMenu.estatisticas);
          setVersaoAtual(data.existingMenu.versao);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar cardápio semanal:', err);
    }
  }, [user]);

  const gerarCardapioSemanal = useCallback(async (opcoes = {}) => {
    setLoadingCardapio(true);
    setErroCardapio(null);
    try {
      // Adicionar userId se usuário estiver logado
      const opcoesCompletas = {
        ...opcoes,
        ...(user?.id && { userId: user.id })
      };
      
      const response = await apiClient.gerarCardapioSemanal(opcoesCompletas);
      if (response.success) {
        setCardapioSemanal(response.cardapio);
        setEstatisticasCardapio(response.estatisticas);
        setVersaoAtual(response.version || 1);
        
        // Atualizar estado de geração
        if (response.isNew) {
          setPodeGerar(false);
        }
      } else {
        throw new Error(response.error || 'Erro ao gerar cardápio semanal');
      }
    } catch (err) {
      setErroCardapio(err.message || 'Erro ao gerar cardápio semanal');
      setCardapioSemanal(null);
      setEstatisticasCardapio(null);
    } finally {
      setLoadingCardapio(false);
    }
  }, [user]);

  // Salvar edição manual
  const salvarEdicaoCardapio = useCallback(async (cardapioEditado, ingredientesExcluidos = []) => {
    if (!user?.id) return { success: false, error: 'Usuário não autenticado' };

    try {
      const response = await apiClient.gerarCardapioSemanal({
        userId: user.id,
        isEdit: true,
        cardapioEditado,
        ingredientesProibidos: ingredientesExcluidos
      });

      if (response.success) {
        // Atualizar estado local com versão editada
        setCardapioSemanal(cardapioEditado);
        setVersaoAtual(response.version || versaoAtual + 1);
        return { success: true, version: response.version };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user, versaoAtual]);

  // Verificar cardápio ao carregar
  useEffect(() => {
    if (user?.id) {
      verificarCardapioSemanal();
    }
  }, [user, verificarCardapioSemanal]);

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

    // Cardápio semanal
    cardapioSemanal,
    estatisticasCardapio,
    loadingCardapio,
    erroCardapio,
    gerarCardapioSemanal,
    salvarEdicaoCardapio,
    verificarCardapioSemanal,
    podeGerar,
    proximaGeracao,
    versaoAtual,

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