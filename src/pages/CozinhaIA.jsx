import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';

// Dados estáticos otimizados
const INGREDIENTES_SUGERIDOS = [
  { name: "Frango", category: "proteina", icon: "🍗" },
  { name: "Arroz", category: "carboidrato", icon: "🍚" },
  { name: "Feijão", category: "proteina", icon: "🫘" },
  { name: "Tomate", category: "vegetal", icon: "🍅" },
  { name: "Cebola", category: "vegetal", icon: "🧅" },
  { name: "Alho", category: "tempero", icon: "🧄" },
  { name: "Ovos", category: "proteina", icon: "🥚" },
  { name: "Queijo", category: "laticinios", icon: "🧀" },
  { name: "Batata", category: "carboidrato", icon: "🥔" },
  { name: "Macarrão", category: "carboidrato", icon: "🍝" }
];

const FILTROS = {
  tempo: ["15 min", "30 min", "45 min", "1 hora", "1h+"],
  dificuldade: ["Fácil", "Médio", "Difícil"],
  tipo: ["Café da manhã", "Almoço", "Jantar", "Lanche", "Sobremesa"]
};

const RECEITAS_MOCK = [
  {
    id: 1,
    nome: "Frango Grelhado com Arroz",
    tempo: "30 min",
    dificuldade: "Fácil",
    tipo: "Almoço",
    ingredientes: ["Frango", "Arroz", "Temperos"],
    rating: 4.8,
    image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Frango+Grelhado"
  },
  {
    id: 2,
    nome: "Omelete Simples",
    tempo: "15 min", 
    dificuldade: "Fácil",
    tipo: "Café da manhã",
    ingredientes: ["Ovos", "Queijo", "Sal"],
    rating: 4.5,
    image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Omelete"
  },
  {
    id: 3,
    nome: "Macarrão à Carbonara",
    tempo: "45 min",
    dificuldade: "Médio", 
    tipo: "Jantar",
    ingredientes: ["Macarrão", "Ovos", "Queijo", "Bacon"],
    rating: 4.9,
    image: "https://via.placeholder.com/300x200/45b7d1/ffffff?text=Carbonara"
  }
];

export default function CozinhaIA() {
  // Log para depuração
  useEffect(() => {
    console.log('CozinhaIA carregado');
  }, []);

  // Auth context
  const { getUserAvatar, getDisplayName, isVisitorMode } = useAuth();

  // Memoizar chamadas das funções para evitar re-renders
  const userAvatar = useMemo(() => getUserAvatar(), [getUserAvatar]);
  const displayName = useMemo(() => getDisplayName(), [getDisplayName]);

  // Estados essenciais
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("tempo");
  const [filtroSelecionado, setFiltroSelecionado] = useState("");
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([]);
  const [gerandoReceita, setGerandoReceita] = useState(false);
  const [cardapioSemanal, setCardapioSemanal] = useState(null);
  const [gerandoCardapio, setGerandoCardapio] = useState(false);
  
  // Receitas filtradas - memoizadas
  const receitasFiltradas = useMemo(() => {
    return RECEITAS_MOCK.filter(receita => {
      const temIngredientes = ingredientesSelecionados.length === 0 || 
        ingredientesSelecionados.some(ing => receita.ingredientes.includes(ing));
      
      const passaFiltro = !filtroSelecionado || receita[filtroAtivo] === filtroSelecionado;
      
      return temIngredientes && passaFiltro;
    });
  }, [ingredientesSelecionados, filtroAtivo, filtroSelecionado]);

  // Handlers otimizados
  const toggleIngrediente = useCallback((ingrediente) => {
    setIngredientesSelecionados(prev => 
      prev.includes(ingrediente)
        ? prev.filter(i => i !== ingrediente)
        : [...prev, ingrediente]
    );
  }, []);

  const limparFiltros = useCallback(() => {
    setIngredientesSelecionados([]);
    setFiltroSelecionado("");
  }, []);

  const adicionarIngredienteManual = useCallback(() => {
    if (!novoIngrediente.trim()) return;
    
    const ingrediente = novoIngrediente.trim();
    if (!ingredientesSelecionados.includes(ingrediente)) {
      setIngredientesSelecionados(prev => [...prev, ingrediente]);
    }
    setNovoIngrediente("");
  }, [novoIngrediente, ingredientesSelecionados]);

  const gerarReceitaIA = useCallback(async () => {
    if (ingredientesSelecionados.length === 0) return;
    
    setGerandoReceita(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConversas(prev => [...prev, {
      tipo: 'usuario',
      texto: `Gerar receita com: ${ingredientesSelecionados.join(', ')}`
    }, {
      tipo: 'ia',
      texto: `Aqui está uma receita deliciosa usando ${ingredientesSelecionados.join(', ')}! Uma sugestão seria um refogado simples e nutritivo.`
    }]);
    
    setGerandoReceita(false);
    setChatAberto(true);
  }, [ingredientesSelecionados]);

  const gerarCardapioSemanal = useCallback(async () => {
    setGerandoCardapio(true);
    
    // Simular geração de cardápio
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const cardapio = {
      segunda: { café: "Vitamina de Banana", almoço: "Frango Grelhado com Arroz", jantar: "Sopa de Legumes" },
      terça: { café: "Pão Integral com Queijo", almoço: "Macarrão à Carbonara", jantar: "Omelete com Salada" },
      quarta: { café: "Mingau de Aveia", almoço: "Peixe Assado com Batatas", jantar: "Sanduíche Natural" },
      quinta: { café: "Tapioca com Queijo", almoço: "Risotto de Camarão", jantar: "Wrap de Frango" },
      sexta: { café: "Smoothie Verde", almoço: "Lasanha de Berinjela", jantar: "Pizza Caseira" },
      sábado: { café: "Panqueca de Banana", almoço: "Churrasco com Farofa", jantar: "Hambúrguer Artesanal" },
      domingo: { café: "Café da Manhã Completo", almoço: "Feijoada Light", jantar: "Canja de Galinha" }
    };
    
    setCardapioSemanal(cardapio);
    setGerandoCardapio(false);
  }, []);

  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim()) return;
    
    // Contar mensagens de usuário para visitantes
    const mensagensUsuario = conversas.filter(c => c.tipo === 'usuario').length;
    
    if (isVisitorMode && mensagensUsuario >= 4) {
      alert('Limite de 4 mensagens mensais atingido! Crie uma conta para conversar ilimitadamente com a IA.');
      window.location.href = '/criar-conta';
      return;
    }
    
    const novaMensagem = mensagem;
    setMensagem("");
    
    setConversas(prev => [...prev, {
      tipo: 'usuario',
      texto: novaMensagem
    }]);
    
    // Simular resposta da IA
    setTimeout(() => {
      setConversas(prev => [...prev, {
        tipo: 'ia',
        texto: isVisitorMode && mensagensUsuario >= 3 
          ? "Esta é sua última mensagem gratuita! Crie uma conta para continuar conversando comigo sobre receitas incríveis! 🍳✨"
          : "Ótima pergunta! Deixe-me ajudar você com essa receita..."
      }]);
    }, 1000);
  }, [mensagem, conversas, isVisitorMode]);

  return (
    <VisitorModeWrapper pageName="a cozinha IA">
      <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header padronizado */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
              <i className="fa-solid fa-utensils text-lg sm:text-xl text-red-600 dark:text-red-400" aria-label="cozinha"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Cozinha
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Descubra receitas incríveis baseadas nos seus ingredientes disponíveis
              </p>
            </div>
          </div>
        </div>

        {/* Ingredientes Selecionados */}
        {ingredientesSelecionados.length > 0 && (
          <div className="card-glass rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ingredientes Selecionados
              </h3>
              <button
                onClick={limparFiltros}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Limpar tudo
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredientesSelecionados.map(ingrediente => (
                <span
                  key={ingrediente}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium"
                >
                  {ingrediente}
                  <button
                    onClick={() => toggleIngrediente(ingrediente)}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                  >
                    <i className="fa-solid fa-times text-xs"></i>
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                if (isVisitorMode) {
                  alert('Crie uma conta para gerar receitas personalizadas com IA!');
                  window.location.href = '/criar-conta';
                } else {
                  gerarReceitaIA();
                }
              }}
              disabled={gerandoReceita}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                gerandoReceita
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:scale-105'
              }`}
            >
              {gerandoReceita ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Gerando receita...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magic-wand-sparkles"></i>
                  {isVisitorMode ? 'Ver Funcionalidade IA' : 'Gerar Receita com IA'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Cardápio Semanal */}
        {!cardapioSemanal ? (
          <div className="card-glass rounded-xl shadow-lg p-6 text-center bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-700">
            <div className="mb-4">
              <i className="fa-solid fa-calendar-week text-4xl text-orange-500 mb-3"></i>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Gerar Cardápio Semanal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Deixe a IA criar um cardápio completo para a semana com base nos seus ingredientes
              </p>
            </div>
            <button
              onClick={() => {
                if (isVisitorMode) {
                  alert('Crie uma conta para gerar cardápios personalizados com IA!');
                  window.location.href = '/criar-conta';
                } else {
                  gerarCardapioSemanal();
                }
              }}
              disabled={gerandoCardapio}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${
                gerandoCardapio
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-105'
              }`}
            >
              {gerandoCardapio ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Gerando cardápio...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magic-wand-sparkles"></i>
                  {isVisitorMode ? 'Ver Funcionalidade IA' : 'Gerar Cardápio IA'}
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="card-glass rounded-xl shadow-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-calendar-check text-white"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cardápio da Semana
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Planejamento alimentar personalizado
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const texto = Object.entries(cardapioSemanal).map(([dia, refeicoes]) => 
                      `${dia.toUpperCase()}:\n• Café: ${refeicoes.café}\n• Almoço: ${refeicoes.almoço}\n• Jantar: ${refeicoes.jantar}\n`
                    ).join('\n');
                    navigator.clipboard.writeText(texto);
                  }}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  <i className="fa-solid fa-copy mr-1" aria-hidden="true"></i>
                  <span>Copiar</span>
                </button>
                <button
                  onClick={() => setCardapioSemanal(null)}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  Novo
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(cardapioSemanal).map(([dia, refeicoes]) => (
                <div key={dia} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
                    {dia}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-orange-600 dark:text-orange-400">Café:</span>
                      <p className="text-gray-700 dark:text-gray-300">{refeicoes.café}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-600 dark:text-green-400">Almoço:</span>
                      <p className="text-gray-700 dark:text-gray-300">{refeicoes.almoço}</p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-600 dark:text-blue-400">Jantar:</span>
                      <p className="text-gray-700 dark:text-gray-300">{refeicoes.jantar}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contribuição de Receitas */}
        <div className="card-glass rounded-xl shadow-lg p-6 text-center bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-700">
          <div className="mb-4">
            <i className="fa-solid fa-heart text-4xl text-emerald-500 mb-3"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ajude nosso banco de Receitas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Compartilhe suas receitas favoritas e ajude outros usuários a descobrir pratos incríveis. 
              Receitas aprovadas ganham créditos ao autor!
            </p>
          </div>
          <button
            onClick={() => {
              if (isVisitorMode) {
                alert('Crie uma conta para contribuir com receitas e ganhar créditos!');
                window.location.href = '/criar-conta';
              } else {
                // Abrir modal de contribuição
                document.getElementById('modal-contribuir-receitas').style.display = 'flex';
              }
            }}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white hover:scale-105"
          >
            <i className="fa-solid fa-plus-circle"></i>
            {isVisitorMode ? 'Ver Funcionalidade' : 'Contribuir com Receita'}
          </button>
        </div>

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Painel de Ingredientes */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Adicionar Ingrediente Manual */}
            <div className="card-glass rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Adicionar Ingrediente
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novoIngrediente}
                  onChange={(e) => setNovoIngrediente(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && adicionarIngredienteManual()}
                  placeholder="Digite um ingrediente..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  onClick={adicionarIngredienteManual}
                  className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            
            {/* Ingredientes Disponíveis */}
            <div className="card-glass rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ingredientes Sugeridos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {INGREDIENTES_SUGERIDOS.map(ingrediente => (
                  <button
                    key={ingrediente.name}
                    onClick={() => toggleIngrediente(ingrediente.name)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      ingredientesSelecionados.includes(ingrediente.name)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{ingrediente.icon}</div>
                    <div className="text-sm font-medium">{ingrediente.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {ingrediente.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div className="card-glass rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Filtros
              </h3>
              <div className="space-y-4">
                {Object.entries(FILTROS).map(([categoria, opcoes]) => (
                  <div key={categoria}>
                    <div id={`filtro-${categoria}-label`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {categoria}
                    </div>
                    <div className="flex flex-wrap gap-2" aria-labelledby={`filtro-${categoria}-label`}>
                      {opcoes.map(opcao => (
                        <button
                          key={opcao}
                          onClick={() => {
                            setFiltroAtivo(categoria);
                            setFiltroSelecionado(filtroSelecionado === opcao ? "" : opcao);
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                            filtroAtivo === categoria && filtroSelecionado === opcao
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {opcao}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Receitas */}
          <div className="lg:col-span-2">
            <div className="card-glass rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Receitas Encontradas ({receitasFiltradas.length})
                </h3>
                <button
                  onClick={() => setChatAberto(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="fa-solid fa-comments" aria-hidden="true"></i>
                  <span>Chef IA</span>
                </button>
              </div>

              {receitasFiltradas.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {receitasFiltradas.map(receita => (
                    <div
                      key={receita.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      onClick={() => setReceitaSelecionada(receita)}
                      onKeyDown={(e) => e.key === 'Enter' && setReceitaSelecionada(receita)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Selecionar receita: ${receita.nome}`}
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                        <i className="fa-solid fa-utensils text-3xl text-gray-400"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {receita.nome}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-clock"></i>
                          {receita.tempo}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-signal"></i>
                          {receita.dificuldade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {receita.tipo}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <i className="fa-solid fa-star"></i>
                          <span className="text-sm font-medium">{receita.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fa-solid fa-search text-4xl text-gray-400 mb-4"></i>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma receita encontrada
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tente selecionar diferentes ingredientes ou ajustar os filtros
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spacing for mobile */}
        <div className="h-16"></div>
      </div>

      {/* Modal Contribuir Receitas */}
      <div id="modal-contribuir-receitas" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-heart text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Contribuir com Receita</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Compartilhe sua receita favorita</p>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('modal-contribuir-receitas').style.display = 'none'}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Receita *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bolo de Chocolate da Vovó"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tempo de Preparo
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white">
                    <option>15 min</option>
                    <option>30 min</option>
                    <option>45 min</option>
                    <option>1 hora</option>
                    <option>1h+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dificuldade
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white">
                    <option>Fácil</option>
                    <option>Médio</option>
                    <option>Difícil</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Refeição
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white">
                  <option>Café da manhã</option>
                  <option>Almoço</option>
                  <option>Jantar</option>
                  <option>Lanche</option>
                  <option>Sobremesa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ingredientes *
                </label>
                <textarea
                  placeholder="Liste todos os ingredientes, um por linha&#10;Ex:&#10;2 xícaras de farinha&#10;3 ovos&#10;1 xícara de açúcar"
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modo de Preparo *
                </label>
                <textarea
                  placeholder="Descreva o passo a passo da receita..."
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dicas Especiais (opcional)
                </label>
                <textarea
                  placeholder="Alguma dica especial para o sucesso da receita?"
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white resize-none"
                ></textarea>
              </div>

              {/* Informação sobre identificação do autor */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-user-tag text-blue-600 dark:text-blue-400 mt-0.5"></i>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">👤 Identificação do Autor</p>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• <strong>Usuários cadastrados:</strong> Nome automático</li>
                      <li>• <strong>Visitantes:</strong> Aparecerão como "Visitante"</li>
                      <li>• <strong>Dica:</strong> Inclua seu nome no título da receita!</li>
                      <li>• Ex: "Bolo da Maria" ou "Receita do João"</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-award text-emerald-600 dark:text-emerald-400 mt-0.5"></i>
                  <div className="text-sm text-emerald-800 dark:text-emerald-200">
                    <p className="font-medium mb-1">🏆 Sistema de Créditos</p>
                    <ul className="space-y-1 text-emerald-700 dark:text-emerald-300">
                      <li>• Receita aprovada: Crédito ao autor</li>
                      <li>• Receitas únicas são priorizadas</li>
                      <li>• Verificamos se já existe no sistema</li>
                      <li>• Análise em até 48h</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => document.getElementById('modal-contribuir-receitas').style.display = 'none'}
                className="py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  document.getElementById('modal-contribuir-receitas').style.display = 'none';
                  document.getElementById('modal-receita-enviada').style.display = 'flex';
                  setTimeout(() => {
                    document.getElementById('modal-receita-enviada').style.display = 'none';
                  }, 3000);
                }}
                className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
              >
                Enviar Receita
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Receita Enviada */}
      <div id="modal-receita-enviada" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-paper-plane text-white text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Receita Enviada! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Sua receita será analisada em até 48h. Obrigado por contribuir com nossa comunidade!
          </p>
        </div>
      </div>

      {/* Chat Modal */}
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
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
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
                          Criar conta para conversas ilimitadas com o Chef IA!
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
                    Olá! Sou seu Chef IA. Como posso ajudar na cozinha hoje?
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
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-blue-200 dark:border-blue-600">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 grid place-items-center">
                            <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-sm" />
                          </div>
                        )}
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
                  placeholder="Digite sua pergunta sobre culinária..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={enviarMensagem}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {receitaSelecionada && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {receitaSelecionada.nome}
                </h3>
                <button
                  onClick={() => setReceitaSelecionada(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>
              
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <i className="fa-solid fa-utensils text-4xl text-gray-400"></i>
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
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ingredientes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {receitaSelecionada.ingredientes.map(ingrediente => (
                      <span
                        key={ingrediente}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
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
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  <i className="fa-solid fa-comments mr-2" aria-hidden="true"></i>
                  <span>Perguntar ao Chef IA</span>
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