import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';
import useCozinhaIA from '../hooks/useCozinhaIA';
import { useFavoritos } from '../hooks/useCozinhaIA';

// ============================================
// 🍳 THEMEALDB API INTEGRATION
// ============================================

class TheMealDBAPI {
  static BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  static async buscarPorIngrediente(ingrediente) {
    try {
      const response = await fetch(`${this.BASE_URL}/filter.php?i=${ingrediente}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('❌ Erro ao buscar receitas TheMealDB:', error);
      return [];
    }
  }

  static async obterDetalhesReceita(idReceita) {
    try {
      const response = await fetch(`${this.BASE_URL}/lookup.php?i=${idReceita}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes da receita:', error);
      return null;
    }
  }

  static async buscarPorNome(nome) {
    try {
      const response = await fetch(`${this.BASE_URL}/search.php?s=${nome}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('❌ Erro ao buscar por nome:', error);
      return [];
    }
  }

  // Converter formato TheMealDB para formato CatButler
  static formatarReceita(meal) {
    if (!meal) return null;

    // Extrair ingredientes e medidas
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = meal[`strIngredient${i}`];
      const medida = meal[`strMeasure${i}`];
      if (ingrediente && ingrediente.trim()) {
        ingredientes.push(medida ? `${medida} ${ingrediente}`.trim() : ingrediente.trim());
      }
    }

    return {
      id: meal.idMeal,
      nome: meal.strMeal,
      descricao: meal.strInstructions?.substring(0, 150) + '...',
      imagem: meal.strMealThumb,
      tempo: "30min", // TheMealDB não tem tempo, usar padrão
      dificuldade: "Médio",
      tipo: meal.strCategory || "Prato principal",
      ingredientes: ingredientes,
      rating: 4.5, // Rating padrão
      instrucoes: meal.strInstructions,
      fonte: "TheMealDB",
      apresentadoPor: "Chef Internacional",
      video: meal.strYoutube,
      tags: meal.strTags?.split(',') || [],
      origem: meal.strArea
    };
  }
}

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
  
  // Integração com o backend via hook personalizado
  const cozinhaIA = useCozinhaIA(isVisitorMode);
  const { isFavorito, adicionarFavorito, removerFavorito } = useFavoritos();
  
  // Referência para o card de receitas
  const receitasCardRef = useRef(null);
  
  // Estados locais do componente (UI específico)
  const [busca, setBusca] = useState('');
  const [ingredientePersonalizado, setIngredientePersonalizado] = useState('');
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [modalContribuir, setModalContribuir] = useState(false);
  const [modalIngredientes, setModalIngredientes] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [chatAberto, setChatAberto] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('buscar'); // CORREÇÃO: Adicionar estado da aba
  
  // Estados para TheMealDB
  const [receitasTheMealDB, setReceitasTheMealDB] = useState([]);

  // Função para scroll automático ao card de receitas
  const scrollToReceitas = useCallback(() => {
    if (receitasCardRef.current) {
      receitasCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Integração completa com o backend
  const { 
    ingredientesSelecionados: ingredientes, 
    sugestoes, 
    busca: buscaHook,
    chat,
    adicionarIngrediente, 
    removerIngrediente,
    limparIngredientes
  } = cozinhaIA;

  // Funções específicas dos hooks
  const obterSugestoes = sugestoes.buscarSugestoes;
  const buscarReceitas = buscaHook.buscar;
  const chatComChef = chat.enviarMensagem;
  const resultadosBusca = buscaHook.resultados;
  const conversas = chat.conversa;

  // Função para obter sugestões do backend quando ingredientes mudam
  useEffect(() => {
    if (ingredientes.length > 0) {
      obterSugestoes();
    }
  }, [ingredientes, obterSugestoes]);

  // Função para buscar receitas quando busca muda
  useEffect(() => {
    if (busca.trim()) {
      const timeoutId = setTimeout(() => {
        buscarReceitas(busca);
      }, 500); // Debounce de 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [busca, buscarReceitas]);

  // Buscar receitas TheMealDB quando ingredientes mudam
  useEffect(() => {
    const buscarReceitasTheMealDB = async () => {
      if (ingredientes.length > 0) {
        try {
          // Buscar receitas para o primeiro ingrediente (TheMealDB aceita apenas 1 por vez)
          const ingredientePrincipal = ingredientes[0];
          const mealsData = await TheMealDBAPI.buscarPorIngrediente(ingredientePrincipal);
          
          // Limitar a 6 receitas e formatar
          const receitasFormatadas = await Promise.all(
            mealsData.slice(0, 6).map(async (meal) => {
              const detalhes = await TheMealDBAPI.obterDetalhesReceita(meal.idMeal);
              return TheMealDBAPI.formatarReceita(detalhes);
            })
          );
          
          setReceitasTheMealDB(receitasFormatadas.filter(Boolean));
          console.log('🍳 Receitas TheMealDB carregadas:', receitasFormatadas.length);
        } catch (error) {
          console.error('❌ Erro ao buscar receitas TheMealDB:', error);
          setReceitasTheMealDB([]);
        }
      } else {
        setReceitasTheMealDB([]);
      }
    };

    buscarReceitasTheMealDB();
  }, [ingredientes]);

  // Receitas filtradas combinando backend e fallback estático
  const receitasFiltradas = useMemo(() => {
    let receitas = [];
    
    // 1. Priorizar dados do backend (busca específica)
    if (busca && resultadosBusca.length > 0) {
      receitas = [...resultadosBusca];
    } 
    // 2. Sugestões do backend baseadas em ingredientes
    else if (ingredientes.length > 0 && sugestoes.length > 0) {
      receitas = [...sugestoes];
    } 
    // 3. Receitas do TheMealDB baseadas em ingredientes
    else if (ingredientes.length > 0 && receitasTheMealDB.length > 0) {
      receitas = [...receitasTheMealDB];
    } 
    // 4. Fallback para dados estáticos
    else {
      receitas = [...RECEITAS_EXEMPLO];
      
      // Filtrar por ingredientes selecionados localmente
      if (ingredientes.length > 0) {
        receitas = receitas.filter(receita =>
          ingredientes.some(ing => 
            receita.ingredientes?.some(receitaIng => 
              receitaIng.toLowerCase().includes(ing.toLowerCase()) || 
              ing.toLowerCase().includes(receitaIng.toLowerCase())
            )
          )
        );
      }
      
      // Filtrar por busca localmente
      if (busca) {
        receitas = receitas.filter(receita =>
          receita.nome.toLowerCase().includes(busca.toLowerCase())
        );
      }
    }
    
    return receitas;
  }, [ingredientes, sugestoes, resultadosBusca, busca, receitasTheMealDB]);

  // Handlers integrados com o backend
  const toggleIngrediente = useCallback((ingrediente) => {
    if (ingredientes.includes(ingrediente)) {
      removerIngrediente(ingrediente);
    } else {
      adicionarIngrediente(ingrediente);
      // Fazer scroll automático para o card de receitas após adicionar ingrediente
      setTimeout(() => scrollToReceitas(), 300);
    }
  }, [ingredientes, adicionarIngrediente, removerIngrediente, scrollToReceitas]);

  const adicionarIngredientePersonalizado = useCallback(() => {
    const ingrediente = ingredientePersonalizado.trim();
    if (ingrediente && !ingredientes.includes(ingrediente)) {
      adicionarIngrediente(ingrediente);
      setIngredientePersonalizado("");
      // Fazer scroll automático para o card de receitas após adicionar ingrediente
      setTimeout(() => scrollToReceitas(), 300);
    }
  }, [ingredientePersonalizado, ingredientes, adicionarIngrediente, scrollToReceitas]);

  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim()) return;
    
    const mensagensUsuario = conversas.filter(c => c.tipo === 'usuario').length;
    
    if (isVisitorMode && mensagensUsuario >= 3) {
      alert('Limite atingido! Crie uma conta para chat ilimitado.');
      return;
    }
    
    const novaMensagem = mensagem;
    setMensagem("");
    
    try {
      // Usar o hook do backend para chat com o chef
      await chatComChef(novaMensagem);
    } catch (error) {
      console.error('Erro no chat:', error);
      // Fallback para resposta local em caso de erro
      setTimeout(() => {
        setConversas(prev => [...prev, {
          tipo: 'ia',
          texto: "Desculpe, estou com dificuldades no momento. Tente novamente em instantes!"
        }]);
      }, 500);
    }
  }, [mensagem, conversas, isVisitorMode, chatComChef]);

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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receitas personalizadas &#9888; Utilizamos API internacional gratuida de receitas e para facilitar a commpreensão dos usuários pedimos a API do gemini para traduzir, o processo pode demorar alguns minutos</p>
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
            <div className="space-y-4">{/* Os cards foram movidos para aqui */}
              {/* Adicionar Ingrediente Personalizado */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">
                  Adicionar Ingrediente Personalizado
                </h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <i className="fa-solid fa-plus absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      value={ingredientePersonalizado}
                      onChange={(e) => setIngredientePersonalizado(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (ingredientePersonalizado.trim() && !ingredientes.includes(ingredientePersonalizado.trim())) {
                            adicionarIngrediente(ingredientePersonalizado.trim());
                            setIngredientePersonalizado('');
                          }
                        }
                      }}
                      placeholder="Digite um ingrediente (ex: alho, pimenta, manjericão...) a nossa IA selecionará receitas automaticamente."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                  <button
                    onClick={adicionarIngredientePersonalizado}
                    disabled={!ingredientePersonalizado.trim() || ingredientes.includes(ingredientePersonalizado.trim())}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <i className="fa-solid fa-plus"></i>{" "}
                    Adicionar
                  </button>
                </div>
                {ingredientePersonalizado.trim() && ingredientes.includes(ingredientePersonalizado.trim()) && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <i className="fa-solid fa-info-circle"></i>
                    Este ingrediente já foi adicionado
                  </p>
                )}
              </div>

              {/* Ingredientes Selecionados - Compacto */}
              {ingredientes.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      Ingredientes ({ingredientes.length})
                    </h3>
                    <button
                      onClick={() => {
                        // Limpar todos os ingredientes usando o hook
                        ingredientes.forEach(ing => removerIngrediente(ing));
                      }}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredientes.map((ingrediente, index) => (
                      <span 
                        key={`${ingrediente}-${index}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs"
                      >
                        {ingrediente}
                        <button
                          onClick={() => removerIngrediente(ingrediente)}
                          className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                        >
                          <i className="fa-solid fa-times text-xs"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {/* Botão Chat IA - Simplificado */}
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full mt-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <i className="fa-solid fa-comments text-sm"></i>
                    {isVisitorMode ? 'Ver Chat IA' : 'Chat com IA'}
                  </button>
                </div>
              )}

              {/* Ingredientes Populares - Botão para Modal */}
              <button
                onClick={() => setModalIngredientes(true)}
                className="w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Ingredientes Populares
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Clique para ver ingredientes disponíveis
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {INGREDIENTES_POPULARES.slice(0, 3).map((ingrediente) => (
                        <div 
                          key={ingrediente.name}
                          className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
                        >
                          <span className="text-sm">{ingrediente.icon}</span>
                        </div>
                      ))}
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">+{INGREDIENTES_POPULARES.length - 3}</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-orange-500 transition-colors"></i>
                  </div>
                </div>
              </button>
              {/* Busca Rápida */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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

              {/* Receitas - Cards Compactos */}
              <div ref={receitasCardRef} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">
                  Receitas ({receitasFiltradas.length})
                  {ingredientes.length > 0 && (
                    <span className="ml-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                      + {receitasFiltradas.filter(r => r.tipo === 'Sugestão IA').length} sugestões IA
                    </span>
                  )}
                </h3>
                {receitasFiltradas.length > 0 ? (
                  <div className="space-y-3">
                    {/* Separar sugestões IA das receitas normais */}
                    {receitasFiltradas.filter(r => r.tipo === 'Sugestão IA').length > 0 && (
                      <div className="border-l-4 border-purple-500 pl-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-r-lg py-2">
                        <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
                          <i className="fa-solid fa-magic-wand-sparkles"></i>
                          {" "}Sugestões Personalizadas da IA
                        </h4>
                      </div>
                    )}
                    
                    {receitasFiltradas.map(receita => (
                      <div
                        key={receita.id}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 text-left flex items-center"
                        onClick={() => setReceitaSelecionada(receita)}
                      >
                        {/* Botão de Favorito */}
                        <button
                          className="mr-3 text-xl text-pink-500 hover:text-pink-600 focus:outline-none"
                          title={isFavorito(receita.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          onClick={e => {
                            e.stopPropagation();
                            if (isFavorito(receita.id)) {
                              removerFavorito(receita.id);
                            } else {
                              adicionarFavorito(receita);
                            }
                          }}
                        >
                          <i className={isFavorito(receita.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                        </button>
                        <div className="flex gap-3">
                          {/* Imagem da receita */}
                          <div className="flex-shrink-0">
                            {receita.imagem ? (
                              <img 
                                src={receita.imagem}
                                alt={receita.nome}
                                className="w-16 h-16 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                              !receita.imagem ? 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30' : 'hidden'
                            } ${receita.tipo === 'Sugestão IA' ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30' : ''}`}>
                              <i className={`fa-solid ${receita.tipo === 'Sugestão IA' ? 'fa-magic-wand-sparkles text-purple-600 dark:text-purple-400' : 'fa-utensils text-orange-600 dark:text-orange-400'}`}></i>
                            </div>
                          </div>
                          
                          {/* Conteúdo da receita */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {receita.nome}
                              </h4>
                              <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                                <i className="fa-solid fa-star text-xs"></i>
                                <span className="text-xs font-medium">{receita.rating}</span>
                              </div>
                            </div>
                            
                            {/* Apresentador/Fonte */}
                            {(receita.apresentadoPor || receita.fonte) && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                {receita.apresentadoPor && (
                                  <span>👨‍🍳 {receita.apresentadoPor}</span>
                                )}
                                {receita.fonte && !receita.apresentadoPor && (
                                  <span>📖 {receita.fonte}</span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <i className="fa-solid fa-clock"></i>
                                {receita.tempo}
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="fa-solid fa-signal"></i>
                                {receita.dificuldade}
                              </span>
                              {receita.origem && (
                                <span className="flex items-center gap-1">
                                  <i className="fa-solid fa-globe"></i>
                                  {receita.origem}
                                </span>
                              )}
                            </div>
                            
                            {/* Badges especiais */}
                            <div className="flex items-center gap-1 mt-1">
                              {receita.tipo === 'Sugestão IA' && (
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                  IA
                                </span>
                              )}
                              {receita.fonte === 'TheMealDB' && (
                                <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                  🌍 Internacional
                                </span>
                              )}
                            </div>
                          </div>
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
                      } else {
                        // Lógica para cardápio semanal
                      }
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
                      } else {
                        // Lógica para sugestões personalizadas
                      }
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

        {/* Chat Modal - Padrão Desktop */}
        {chatAberto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[31.25rem] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
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
                <button
                  onClick={() => setChatAberto(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {/* Banner de aviso para visitantes */}
                {isVisitorMode && conversas.length === 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-600 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-info text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                          Modo Visitante - {4 - conversas.filter(c => c.tipo === 'usuario').length} mensagens mensais restantes
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          <button
                            onClick={() => window.location.href = '/criar-conta'}
                            className="underline hover:no-underline font-medium"
                          >
                            Criar conta para conversas ilimitadas sobre culinária!
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {conversas.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fa-solid fa-chef-hat text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600 dark:text-gray-400">
                      Como posso ajudar na cozinha hoje?
                    </p>
                  </div>
                ) : (
                  conversas.map((conversa, index) => (
                    <div
                      key={`conversa-${index}-${conversa.tipo}-${conversa.timestamp || Date.now()}`}
                      className={`flex items-end gap-3 mb-4 ${conversa.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                    >
                      {conversa.tipo === 'ia' && (
                        <div className="w-8 h-8 bg-orange-500 rounded-full grid place-items-center flex-shrink-0">
                          <i className="fa-solid fa-chef-hat text-white text-sm" />
                        </div>
                      )}

                      <div className="max-w-xs lg:max-w-md">
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            conversa.tipo === 'usuario'
                              ? 'bg-blue-500 text-white rounded-br-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                          }`}
                        >
                          {conversa.texto}
                        </div>
                      </div>

                      {conversa.tipo === 'usuario' && (
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full grid place-items-center flex-shrink-0">
                          <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-sm" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => {
                      if (isVisitorMode && conversas.filter(c => c.tipo === 'usuario').length >= 4) {
                        alert('Crie uma conta para conversar com o Chef IA!');
                        window.location.href = '/criar-conta';
                      } else {
                        enviarMensagem();
                      }
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Receita Detalhes - Versão Melhorada */}
        {receitaSelecionada && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-110 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {receitaSelecionada.nome}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
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
                      {receitaSelecionada.origem && (
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-globe"></i>
                          {receitaSelecionada.origem}
                        </span>
                      )}
                    </div>
                    {/* Apresentador/Fonte */}
                    {(receitaSelecionada.apresentadoPor || receitaSelecionada.fonte) && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {receitaSelecionada.apresentadoPor && (
                          <>👨‍🍳 Apresentado por: <strong>{receitaSelecionada.apresentadoPor}</strong></>
                        )}
                        {receitaSelecionada.fonte && !receitaSelecionada.apresentadoPor && (
                          <>📖 Fonte: <strong>{receitaSelecionada.fonte}</strong></>
                        )}
                      </p>
                    )}
                    
                    {/* Link da Receita Original */}
                    {receitaSelecionada.fonte_url && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-external-link-alt text-blue-600 dark:text-blue-400"></i>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Receita Original
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300">
                              Visite a página original para mais detalhes
                            </p>
                          </div>
                          <a
                            href={receitaSelecionada.fonte_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-external-link-alt"></i>
                            Visitar Site
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setReceitaSelecionada(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid lg:grid-cols-3 gap-6">
                  
                  {/* Imagem da Receita */}
                  <div className="lg:col-span-1">
                    {receitaSelecionada.imagem ? (
                      <img 
                        src={receitaSelecionada.imagem}
                        alt={receitaSelecionada.nome}
                        className="w-full h-64 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-64 rounded-lg flex flex-col items-center justify-center ${
                      !receitaSelecionada.imagem ? 'bg-gray-100 dark:bg-gray-700' : 'hidden'
                    }`}>
                      <i className="fa-solid fa-utensils text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500 text-sm">Imagem não disponível</p>
                    </div>
                    
                    {/* Vídeo se disponível */}
                    {receitaSelecionada.video && (
                      <a 
                        href={receitaSelecionada.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        <i className="fa-brands fa-youtube"></i>
                        Ver vídeo no YouTube
                      </a>
                    )}
                  </div>
                  
                  {/* Ingredientes e Instruções */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Ingredientes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">📝 Ingredientes:</h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {receitaSelecionada.ingredientes?.map((ingrediente, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                          >
                            <i className="fa-solid fa-check-circle text-green-500 text-xs"></i>
                            <span className="text-gray-700 dark:text-gray-300">{ingrediente}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Instruções */}
                    {receitaSelecionada.instrucoes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">🍳 Modo de Preparo:</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {receitaSelecionada.instrucoes}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!receitaSelecionada.instrucoes && receitaSelecionada.descricao && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">📖 Descrição:</h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {receitaSelecionada.descricao}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Tags se disponível */}
                    {receitaSelecionada.tags && receitaSelecionada.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">🏷️ Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {receitaSelecionada.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer com ações - FIXO na parte inferior */}
              <div className="sticky bottom-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 mt-auto">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setReceitaSelecionada(null);
                      setChatAberto(true);
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-comments"></i>
                    Perguntar ao Chef IA
                  </button>
                  <button 
                    onClick={() => {
                      navigator.share({
                        title: receitaSelecionada.nome,
                        text: `Receita: ${receitaSelecionada.nome} - ${receitaSelecionada.origem}`,
                        url: receitaSelecionada.fonte_url || window.location.href
                      }).catch(() => {
                        navigator.clipboard.writeText(`Receita: ${receitaSelecionada.nome} - ${receitaSelecionada.fonte_url || window.location.href}`);
                        alert('Link copiado para área de transferência!');
                      });
                    }}
                    className="py-3 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-share"></i>
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ingredientes Populares */}
        {modalIngredientes && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-carrot text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Ingredientes Populares</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selecione os ingredientes que você tem, a nossa IA selecionará receitas automaticamente.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalIngredientes(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ingredientes.length} ingredientes selecionados
                  </p>
                  <button
                    onClick={() => {
                      // Limpar todos os ingredientes usando o hook  
                      ingredientes.forEach(ing => removerIngrediente(ing));
                    }}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Limpar seleção
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {INGREDIENTES_POPULARES.map(ingrediente => (
                    <button
                      key={ingrediente.name}
                      onClick={() => toggleIngrediente(ingrediente.name)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                        ingredientes.includes(ingrediente.name)
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{ingrediente.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ingrediente.name}
                      </div>
                      {ingredientes.includes(ingrediente.name) && (
                        <div className="mt-2">
                          <i className="fa-solid fa-check-circle text-orange-500 text-sm"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-600 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setModalIngredientes(false)}
                    className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                  {ingredientes.length > 0 && (
                    <button
                      onClick={() => {
                        setModalIngredientes(false);
                        // Fazer scroll automático para o card de receitas
                        setTimeout(() => scrollToReceitas(), 300);
                      }}
                      className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                    >
                      Buscar Receitas ({ingredientes.length})
                    </button>
                  )}
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