import React, { useState, useMemo, useCallback } from 'react';

// Dados estáticos otimizados
const COMODOS = [
  { name: "Cozinha", icon: "fa-utensils", color: "from-red-500 to-orange-500", tasks: 8 },
  { name: "Sala", icon: "fa-couch", color: "from-blue-500 to-cyan-500", tasks: 6 },
  { name: "Quarto", icon: "fa-bed", color: "from-purple-500 to-pink-500", tasks: 7 },
  { name: "Banheiro", icon: "fa-shower", color: "from-green-500 to-emerald-500", tasks: 9 }
];

const ROTINAS = {
  diaria: [
    { task: "Fazer as camas", time: "5 min", priority: "alta" },
    { task: "Lavar a louça", time: "15 min", priority: "alta" },
    { task: "Limpar bancadas", time: "10 min", priority: "alta" },
    { task: "Varrer áreas principais", time: "10 min", priority: "media" }
  ],
  semanal: [
    { task: "Passar aspirador", time: "30 min", priority: "alta" },
    { task: "Limpar banheiros", time: "45 min", priority: "alta" },
    { task: "Trocar roupas de cama", time: "15 min", priority: "media" },
    { task: "Lavar roupas", time: "20 min", priority: "alta" }
  ]
};

const TECNICAS_LIMPEZA = [
  {
    nome: "Técnica do Pano Úmido",
    descricao: "Para remover poeira sem espalhar, use pano levemente úmido",
    superficie: "Móveis de madeira",
    produto: "Água + algumas gotas de amaciante",
    tempo: "2-3 min por móvel",
    dificuldade: "Fácil"
  },
  {
    nome: "Método Bicarbonato + Vinagre",
    descricao: "Mistura eficaz para desentupir e desengordurar",
    superficie: "Pias e ralos",
    produto: "1 xícara bicarbonato + 1 xícara vinagre branco",
    tempo: "15 min (deixar agir)",
    dificuldade: "Fácil"
  },
  {
    nome: "Limpeza de Vidros sem Riscos",
    descricao: "Use movimentos circulares, depois verticais",
    superficie: "Janelas e espelhos",
    produto: "Água + detergente neutro + jornal",
    tempo: "5 min por m²",
    dificuldade: "Médio"
  },
  {
    nome: "Remoção de Manchas do Sofá",
    descricao: "Teste sempre em área escondida primeiro",
    superficie: "Estofados",
    produto: "Água morna + sabão neutro + escova macia",
    tempo: "10-15 min",
    dificuldade: "Médio"
  }
];

const PRODUTOS_RECOMENDADOS = [
  {
    categoria: "Multiuso",
    produtos: [
      { nome: "Detergente Neutro", uso: "Limpeza geral", economia: "Dilua 1:3 com água" },
      { nome: "Bicarbonato de Sódio", uso: "Desodorizar e desengordurar", economia: "1kg rende 3 meses" },
      { nome: "Vinagre Branco", uso: "Desencardir e desengordurar", economia: "Misture com água 1:1" }
    ]
  },
  {
    categoria: "Específicos",
    produtos: [
      { nome: "Álcool 70%", uso: "Desinfecção", economia: "Use com borrifador" },
      { nome: "Amaciante", uso: "Panos de limpeza", economia: "Poucas gotas bastam" },
      { nome: "Pasta de Dente", uso: "Limpeza de metais", economia: "Pequena quantidade" }
    ]
  }
];

export default function FaxinaIA() {
  // Estados essenciais
  const [rotinaAtiva, setRotinaAtiva] = useState("diaria");
  const [tarefasConcluidas, setTarefasConcluidas] = useState(new Set());
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([]);
  const [numeroComodos, setNumeroComodos] = useState(4);
  const [configComodosAberto, setConfigComodosAberto] = useState(false);
  const [tecnicasAberto, setTecnicasAberto] = useState(false);

  // Cálculos memoizados
  const progressoRotina = useMemo(() => {
    const tarefasRotina = ROTINAS[rotinaAtiva];
    const concluidas = tarefasRotina.filter(tarefa => 
      tarefasConcluidas.has(`${rotinaAtiva}-${tarefa.task}`)
    ).length;
    return Math.round((concluidas / tarefasRotina.length) * 100);
  }, [rotinaAtiva, tarefasConcluidas]);

  // Handlers otimizados
  const toggleTarefa = useCallback((tarefa) => {
    const key = `${rotinaAtiva}-${tarefa.task}`;
    setTarefasConcluidas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, [rotinaAtiva]);

  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim()) return;
    
    const novaMensagem = mensagem;
    setMensagem("");
    
    setConversas(prev => [...prev, {
      tipo: 'usuario',
      texto: novaMensagem
    }]);
    
    setTimeout(() => {
      setConversas(prev => [...prev, {
        tipo: 'ia',
        texto: "Ótima pergunta! Vou te ajudar com dicas específicas de limpeza."
      }]);
    }, 1000);
  }, [mensagem]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 lg:p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-broom text-white text-xl"></i>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Faxina IA
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Organize sua casa com rotinas inteligentes e dicas personalizadas
          </p>
        </div>

        {/* Configuração de Cômodos */}
        <div className="card-glass rounded-xl shadow-lg p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-home text-white"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configuração da Casa
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {numeroComodos} cômodos configurados
                </p>
              </div>
            </div>
            <button
              onClick={() => setConfigComodosAberto(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              <i className="fa-solid fa-gear mr-1"></i>
              Configurar
            </button>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            Personalize as rotinas de limpeza de acordo com o número de cômodos da sua casa
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-list-check text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {progressoRotina}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rotina Concluída
            </div>
          </div>
          
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-home text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {COMODOS.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cômodos
            </div>
          </div>
          
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-clock text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {ROTINAS[rotinaAtiva].length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tarefas Hoje
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Rotinas */}
          <div className="lg:col-span-2">
            <div className="card-glass rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Rotinas de Limpeza
                </h3>
                <button
                  onClick={() => setChatAberto(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="fa-solid fa-comments"></i>
                  Assistente
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {Object.keys(ROTINAS).map(rotina => (
                  <button
                    key={rotina}
                    onClick={() => setRotinaAtiva(rotina)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      rotinaAtiva === rotina
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {rotina.charAt(0).toUpperCase() + rotina.slice(1)}
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{progressoRotina}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressoRotina}%` }}
                  ></div>
                </div>
              </div>

              {/* Tarefas */}
              <div className="space-y-3">
                {ROTINAS[rotinaAtiva].map((tarefa, index) => {
                  const isCompleted = tarefasConcluidas.has(`${rotinaAtiva}-${tarefa.task}`);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        isCompleted
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => toggleTarefa(tarefa)}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isCompleted && <i className="fa-solid fa-check text-xs"></i>}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isCompleted
                            ? 'text-green-700 dark:text-green-300 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {tarefa.task}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-clock"></i>
                            {tarefa.time}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tarefa.priority === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {tarefa.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Cômodos */}
            <div className="card-glass rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cômodos
              </h3>
              <div className="space-y-3">
                {COMODOS.slice(0, numeroComodos).map(comodo => (
                  <button
                    key={comodo.name}
                    className={`w-full p-3 rounded-lg transition-all duration-200 text-left hover:scale-105 bg-gradient-to-r ${comodo.color} text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${comodo.icon}`}></i>
                        <span className="font-medium">{comodo.name}</span>
                      </div>
                      <span className="text-sm opacity-90">{comodo.tasks} tarefas</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Técnicas e Produtos */}
            <div className="card-glass rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Técnicas & Produtos
                </h3>
                <button
                  onClick={() => setTecnicasAberto(true)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  Ver Dicas
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm mb-1">
                    Dica do Dia
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                    Use bicarbonato + vinagre para desentupir ralos naturalmente
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-medium text-gray-900 dark:text-white">{TECNICAS_LIMPEZA.length}</div>
                    <div className="text-gray-600 dark:text-gray-400">Técnicas</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-medium text-gray-900 dark:text-white">{PRODUTOS_RECOMENDADOS.reduce((total, cat) => total + cat.produtos.length, 0)}</div>
                    <div className="text-gray-600 dark:text-gray-400">Produtos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-16"></div>
      </div>

      {/* Chat Modal */}
      {chatAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Assistente de Limpeza</h3>
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
              {conversas.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-broom text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400">
                    Como posso ajudar com a limpeza hoje?
                  </p>
                </div>
              ) : (
                conversas.map((conversa, index) => (
                  <div
                    key={index}
                    className={`flex ${conversa.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        conversa.tipo === 'usuario'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {conversa.texto}
                    </div>
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
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  placeholder="Digite sua pergunta..."
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

      {/* Modal Configuração de Cômodos */}
      {configComodosAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configurar Casa
                </h3>
                <button
                  onClick={() => setConfigComodosAberto(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantos cômodos sua casa tem?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <button
                        key={num}
                        onClick={() => setNumeroComodos(num)}
                        className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                          numeroComodos === num
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Cômodos selecionados: {numeroComodos}
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    {COMODOS.slice(0, numeroComodos).map(c => c.name).join(', ')}
                  </div>
                </div>
                
                <button
                  onClick={() => setConfigComodosAberto(false)}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  Salvar Configuração
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Técnicas e Produtos */}
      {tecnicasAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Técnicas e Produtos de Limpeza
              </h3>
              <button
                onClick={() => setTecnicasAberto(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Técnicas */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Técnicas de Limpeza
                  </h4>
                  <div className="space-y-4">
                    {TECNICAS_LIMPEZA.map((tecnica, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {tecnica.nome}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tecnica.dificuldade === 'Fácil' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {tecnica.dificuldade}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {tecnica.descricao}
                        </p>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Superfície:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{tecnica.superficie}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Produto:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{tecnica.produto}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Tempo:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{tecnica.tempo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Produtos */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Produtos Recomendados
                  </h4>
                  <div className="space-y-4">
                    {PRODUTOS_RECOMENDADOS.map((categoria, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {categoria.categoria}
                        </h5>
                        <div className="space-y-3">
                          {categoria.produtos.map((produto, prodIndex) => (
                            <div key={prodIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <h6 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                {produto.nome}
                              </h6>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {produto.uso}
                              </p>
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                💡 {produto.economia}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
