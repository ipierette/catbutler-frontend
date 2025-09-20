import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';

// Dados estáticos otimizados - versão compacta
const INGREDIENTES_POPULARES = [
  { name: "Frango", icon: "🍗", category: "proteina" },
  { name: "Arroz", icon: "🍚", category: "carboidrato" },
  { name: "Feijão", icon: "🫘", category: "proteina" },
  { name: "Tomate", icon: "🍅", category: "vegetal" },
  { name: "Cebola", icon: "🧅", category: "vegetal" },
  { name: "Ovos", icon: "🥚", category: "proteina" },
  { name: "Queijo", icon: "🧀", category: "laticinios" },
  { name: "Batata", icon: "🥔", category: "carboidrato" }
];

const RECEITAS_EXEMPLO = [
  {
    id: 1,
    nome: "Frango Grelhado",
    tempo: "30min",
    dificuldade: "Fácil",
    tipo: "Almoço",
    ingredientes: ["Frango", "Temperos"],
    rating: 4.8
  },
  {
    id: 2,
    nome: "Omelete Simples",
    tempo: "15min", 
    dificuldade: "Fácil",
    tipo: "Café",
    ingredientes: ["Ovos", "Queijo"],
    rating: 4.5
  },
  {
    id: 3,
    nome: "Arroz com Feijão",
    tempo: "25min",
    dificuldade: "Fácil", 
    tipo: "Almoço",
    ingredientes: ["Arroz", "Feijão"],
    rating: 4.7
  }
];

export default function CozinhaIA() {
  const { isVisitorMode } = useAuth();
  
  // Estados principais
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [busca, setBusca] = useState("");
  const [abaSelecionada, setAbaSelecionada] = useState("buscar");
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalContribuir, setModalContribuir] = useState(false);

  // Receitas filtradas
  const receitasFiltradas = useMemo(() => {
    let receitas = RECEITAS_EXEMPLO;
    
    if (ingredientesSelecionados.length > 0) {
      receitas = receitas.filter(receita =>
        ingredientesSelecionados.some(ing => receita.ingredientes.includes(ing))
      );
    }
    
    if (busca) {
      receitas = receitas.filter(receita =>
        receita.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }
    
    return receitas;
  }, [ingredientesSelecionados, busca]);

  // Handlers
  const toggleIngrediente = useCallback((ingrediente) => {
    setIngredientesSelecionados(prev => 
      prev.includes(ingrediente)
        ? prev.filter(i => i !== ingrediente)
        : [...prev, ingrediente]
    );
  }, []);

  const gerarReceitaIA = useCallback(async () => {
    if (isVisitorMode) {
      alert('Crie uma conta para gerar receitas com IA!');
      return;
    }
    
    setLoading(true);
    // Simular chamada API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConversas(prev => [...prev, {
      tipo: 'usuario',
      texto: `Gerar receita com: ${ingredientesSelecionados.join(', ')}`
    }, {
      tipo: 'ia',
      texto: `Aqui está uma receita personalizada usando ${ingredientesSelecionados.join(', ')}!`
    }]);
    
    setLoading(false);
    setChatAberto(true);
  }, [ingredientesSelecionados, isVisitorMode]);

  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim()) return;
    
    const mensagensUsuario = conversas.filter(c => c.tipo === 'usuario').length;
    
    if (isVisitorMode && mensagensUsuario >= 3) {
      alert('Limite atingido! Crie uma conta para chat ilimitado.');
      return;
    }
    
    const novaMensagem = mensagem;
    setMensagem("");
    
    setConversas(prev => [...prev, {
      tipo: 'usuario',
      texto: novaMensagem
    }]);
    
    // Simular resposta IA
    setTimeout(() => {
      setConversas(prev => [...prev, {
        tipo: 'ia',
        texto: "Ótima pergunta! Deixe-me ajudar você com essa receita..."
      }]);
    }, 1000);
  }, [mensagem, conversas, isVisitorMode]);

  return (
    <VisitorModeWrapper pageName="a cozinha IA">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Mobile Compacto */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-utensils text-orange-600 dark:text-orange-400"></i>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">Cozinha IA</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receitas personalizadas</p>
                </div>
              </div>
              <button
                onClick={() => setChatAberto(true)}
                className="relative p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"
              >
                <i className="fa-solid fa-comments text-green-600 dark:text-green-400"></i>
                {conversas.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
          
          {/* Navegação por Abas */}
          <div className="flex border-t border-gray-200 dark:border-gray-700">
            {[
              { id: 'buscar', label: 'Buscar', icon: 'fa-search' },
              { id: 'ia', label: 'IA Chef', icon: 'fa-magic-wand-sparkles' },
              { id: 'contribuir', label: 'Enviar', icon: 'fa-plus-circle' }
            ].map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id)}
                className={`flex-1 py-3 text-center transition-all duration-200 ${
                  abaSelecionada === aba.id
                    ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <i className={`${aba.icon} text-sm mb-1 block`}></i>
                <span className="text-xs font-medium">{aba.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-4 pb-20">
          {/* Aba Buscar */}
          {abaSelecionada === 'buscar' && (
            <div className="space-y-4">
              {/* Busca Rápida */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar receitas..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                  />
                </div>
              </div>

              {/* Ingredientes Selecionados - Compacto */}
              {ingredientesSelecionados.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      Ingredientes ({ingredientesSelecionados.length})
                    </h3>
                    <button
                      onClick={() => setIngredientesSelecionados([])}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ingredientesSelecionados.map(ing => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs"
                      >
                        {ing}
                        <button
                          onClick={() => toggleIngrediente(ing)}
                          className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                        >
                          <i className="fa-solid fa-times text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {/* Botão Gerar IA - Compacto */}
                  <button
                    onClick={gerarReceitaIA}
                    disabled={loading}
                    className={`w-full mt-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      loading
                        ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Gerando...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-magic-wand-sparkles text-sm"></i>
                        {isVisitorMode ? 'Ver Função IA' : 'Gerar com IA'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Ingredientes Populares - Grid Compacto */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Ingredientes Populares
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {INGREDIENTES_POPULARES.map(ingrediente => (
                    <button
                      key={ingrediente.name}
                      onClick={() => toggleIngrediente(ingrediente.name)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        ingredientesSelecionados.includes(ingrediente.name)
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      <div className="text-lg mb-1">{ingrediente.icon}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {ingrediente.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Receitas - Cards Compactos */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Receitas ({receitasFiltradas.length})
                </h3>
                {receitasFiltradas.length > 0 ? (
                  <div className="space-y-3">
                    {receitasFiltradas.map(receita => (
                      <div
                        key={receita.id}
                        onClick={() => setReceitaSelecionada(receita)}
                        className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-utensils text-orange-600 dark:text-orange-400"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {receita.nome}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-clock"></i>
                              {receita.tempo}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-signal"></i>
                              {receita.dificuldade}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                          <i className="fa-solid fa-star text-xs"></i>
                          <span className="text-xs font-medium">{receita.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fa-solid fa-search text-3xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma receita encontrada
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba IA Chef */}
          {abaSelecionada === 'ia' && (
            <div className="space-y-4">
              {/* Status IA */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-chef-hat text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Chef IA</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Online
                    </p>
                  </div>
                </div>
                
                {isVisitorMode && (
                  <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-600">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <strong>Modo Visitante:</strong> 3 perguntas mensais
                    </p>
                    <button
                      onClick={() => window.location.href = '/criar-conta'}
                      className="text-xs text-orange-700 dark:text-orange-300 underline hover:no-underline mt-1"
                    >
                      Criar conta para ilimitado →
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setChatAberto(true)}
                  className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Conversar com Chef IA
                </button>
              </div>

              {/* Funções IA Rápidas */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Funções IA
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => {
                      if (isVisitorMode) {
                        alert('Crie uma conta para usar funções de IA!');
                        return;
                      }
                      // Lógica para cardápio semanal
                    }}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-calendar-week text-blue-600 dark:text-blue-400 text-sm"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        Cardápio Semanal
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Planejamento automático
                      </p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (isVisitorMode) {
                        alert('Crie uma conta para usar funções de IA!');
                        return;
                      }
                      // Lógica para sugestões personalizadas
                    }}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-sparkles text-purple-600 dark:text-purple-400 text-sm"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        Sugestões Personalizadas
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Baseado no seu perfil
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Aba Contribuir */}
          {abaSelecionada === 'contribuir' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
                <div className="text-center">
                  <i className="fa-solid fa-heart text-3xl text-emerald-500 mb-3"></i>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Compartilhe sua receita
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Ajude a comunidade e ganhe créditos por receitas aprovadas!
                  </p>
                  
                  {isVisitorMode ? (
                    <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-600 mb-4">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Crie uma conta para contribuir com receitas
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-600 mb-4">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✓ Sistema de créditos ativo
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      if (isVisitorMode) {
                        alert('Crie uma conta para contribuir!');
                        window.location.href = '/criar-conta';
                      } else {
                        setModalContribuir(true);
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <i className="fa-solid fa-plus-circle mr-2"></i>
                    {isVisitorMode ? 'Ver Funcionalidade' : 'Enviar Receita'}
                  </button>
                </div>
              </div>
              
              {/* Info sobre créditos */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Sistema de Créditos
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-award text-green-500"></i>
                    <span>Receita aprovada: +10 créditos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-clock text-blue-500"></i>
                    <span>Análise em até 48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-star text-yellow-500"></i>
                    <span>Receitas únicas priorizadas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Modal - Mobile Otimizado */}
        {chatAberto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white dark:bg-gray-800 w-full h-[85vh] rounded-t-3xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-chef-hat text-white text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Chef IA</h3>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatAberto(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversas.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fa-solid fa-chef-hat text-3xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Como posso ajudar na cozinha hoje?
                    </p>
                  </div>
                ) : (
                  conversas.map((conversa, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-2 ${conversa.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                    >
                      {conversa.tipo === 'ia' && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-chef-hat text-white text-xs"></i>
                        </div>
                      )}

                      <div className="max-w-xs">
                        <div
                          className={`px-3 py-2 rounded-lg text-sm ${
                            conversa.tipo === 'usuario'
                              ? 'bg-blue-500 text-white rounded-br-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                          }`}
                        >
                          {conversa.texto}
                        </div>
                      </div>

                      {conversa.tipo === 'usuario' && (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-blue-200 dark:border-blue-600">
                          <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-xs"></i>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <button
                    onClick={enviarMensagem}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <i className="fa-solid fa-paper-plane text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Receita Detalhes - Mobile */}
        {receitaSelecionada && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white dark:bg-gray-800 w-full h-[70vh] rounded-t-3xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {receitaSelecionada.nome}
                  </h3>
                  <button
                    onClick={() => setReceitaSelecionada(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-40 mb-4 flex items-center justify-center">
                  <i className="fa-solid fa-utensils text-3xl text-gray-400"></i>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-clock"></i>
                      {receitaSelecionada.tempo}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-signal"></i>
                      {receitaSelecionada.dificuldade}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <i className="fa-solid fa-star"></i>
                      <span>{receitaSelecionada.rating}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Ingredientes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {receitaSelecionada.ingredientes.map(ingrediente => (
                        <span
                          key={ingrediente}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {ingrediente}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setReceitaSelecionada(null);
                      setChatAberto(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <i className="fa-solid fa-comments mr-2"></i>
                    Perguntar ao Chef IA
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Contribuir - Versão Compacta */}
        {modalContribuir && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Enviar Receita
                  </h3>
                  <button
                    onClick={() => setModalContribuir(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome da receita"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white text-sm"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm">
                      <option>15 min</option>
                      <option>30 min</option>
                      <option>45 min</option>
                      <option>1 hora</option>
                    </select>
                    <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm">
                      <option>Fácil</option>
                      <option>Médio</option>
                      <option>Difícil</option>
                    </select>
                  </div>
                  
                  <textarea
                    placeholder="Ingredientes (um por linha)"
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm resize-none"
                  ></textarea>
                  
                  <textarea
                    placeholder="Modo de preparo"
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => setModalContribuir(false)}
                    className="py-2 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setModalContribuir(false);
                      alert('Receita enviada! Análise em até 48h.');
                    }}
                    className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisitorModeWrapper>
  );
}