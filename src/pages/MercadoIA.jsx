import React, { useState, useMemo, useCallback } from 'react';

// Dados estáticos otimizados
const CATEGORIAS = [
  { name: "Hortifruti", icon: "fa-carrot", color: "from-green-500 to-emerald-500", items: 15 },
  { name: "Carnes", icon: "fa-drumstick-bite", color: "from-red-500 to-orange-500", items: 8 },
  { name: "Laticínios", icon: "fa-cheese", color: "from-yellow-500 to-amber-500", items: 12 },
  { name: "Grãos", icon: "fa-wheat-awn", color: "from-amber-500 to-yellow-500", items: 10 },
  { name: "Limpeza", icon: "fa-bottle-water", color: "from-blue-500 to-cyan-500", items: 7 },
  { name: "Higiene", icon: "fa-pump-soap", color: "from-purple-500 to-pink-500", items: 9 }
];

const PRODUTOS_SUGERIDOS = [
  { name: "Arroz 5kg", category: "Grãos", price: 18.90, store: "Mercado A", savings: 2.50 },
  { name: "Frango 1kg", category: "Carnes", price: 12.50, store: "Açougue B", savings: 1.80 },
  { name: "Leite 1L", category: "Laticínios", price: 4.20, store: "Super C", savings: 0.90 },
  { name: "Banana 1kg", category: "Hortifruti", price: 5.80, store: "Feira D", savings: 1.20 }
];


export default function MercadoIA() {
  // Estados essenciais
  const [abaAtiva, setAbaAtiva] = useState('lista');
  const [listaCompras, setListaCompras] = useState([
    { id: 1, name: "Arroz 5kg", category: "Grãos", quantity: 1, price: 18.90, checked: false },
    { id: 2, name: "Frango 1kg", category: "Carnes", quantity: 2, price: 12.50, checked: true }
  ]);
  const [novoItem, setNovoItem] = useState("");
  const [categoriaItem, setCategoriaItem] = useState("Hortifruti");
  const [pesquisa, setPesquisa] = useState("");
  const [orcamentoMeta, setOrcamentoMeta] = useState(200);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([]);

  // Cálculos memoizados
  const totalCompras = useMemo(() => {
    return listaCompras.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [listaCompras]);

  const economiaTotal = useMemo(() => {
    return PRODUTOS_SUGERIDOS.reduce((total, produto) => total + produto.savings, 0);
  }, []);

  const progressoOrcamento = useMemo(() => {
    return Math.min((totalCompras / orcamentoMeta) * 100, 100);
  }, [totalCompras, orcamentoMeta]);

  // Handlers otimizados
  const adicionarItem = useCallback(() => {
    if (!novoItem.trim()) return;
    
    const newItem = {
      id: Date.now(),
      name: novoItem,
      category: categoriaItem,
      quantity: 1,
      price: Math.random() * 20 + 5, // Preço simulado
      checked: false
    };
    
    setListaCompras(prev => [...prev, newItem]);
    setNovoItem("");
  }, [novoItem, categoriaItem]);

  const toggleItem = useCallback((id) => {
    setListaCompras(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  }, []);

  const removerItem = useCallback((id) => {
    setListaCompras(prev => prev.filter(item => item.id !== id));
  }, []);

  const atualizarQuantidade = useCallback((id, quantidade) => {
    setListaCompras(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantidade) } : item
    ));
  }, []);

  const gerarListaIA = useCallback(async () => {
    // Simular geração de lista inteligente
    const novosItens = [
      { id: Date.now() + 1, name: "Tomate 1kg", category: "Hortifruti", quantity: 1, price: 6.90, checked: false },
      { id: Date.now() + 2, name: "Pão francês", category: "Padaria", quantity: 1, price: 8.50, checked: false },
      { id: Date.now() + 3, name: "Ovos 12un", category: "Laticínios", quantity: 1, price: 15.90, checked: false }
    ];
    
    setListaCompras(prev => [...prev, ...novosItens]);
  }, []);

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
        texto: "Ótima pergunta sobre compras! Vou ajudar você a encontrar os melhores preços e produtos."
      }]);
    }, 1000);
  }, [mensagem]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header padronizado */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
              <i className="fa-solid fa-shopping-cart text-lg sm:text-xl text-green-600 dark:text-green-400" aria-label="mercado"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Mercado IA
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Economize tempo e dinheiro com listas inteligentes e comparação de preços
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-dollar-sign text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              R$ {totalCompras.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total da Lista
            </div>
          </div>
          
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-piggy-bank text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              R$ {economiaTotal.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Economia Potencial
            </div>
          </div>
          
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-list text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {listaCompras.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Itens na Lista
            </div>
          </div>
          
          <div className="card-glass rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fa-solid fa-chart-pie text-white"></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {progressoOrcamento.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              do Orçamento
            </div>
          </div>
        </div>

        {/* Orçamento Progress */}
        <div className="card-glass rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Orçamento Mensal
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Meta:</span>
              <input
                type="number"
                value={orcamentoMeta}
                onChange={(e) => setOrcamentoMeta(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                progressoOrcamento > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                progressoOrcamento > 70 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${progressoOrcamento}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>R$ {totalCompras.toFixed(2)} gastos</span>
            <span>R$ {(orcamentoMeta - totalCompras).toFixed(2)} restantes</span>
          </div>
        </div>

        {/* Tabs Principais */}
        <div className="flex gap-2 justify-center">
          {[
            { id: 'lista', nome: 'Lista Inteligente', icone: 'fa-clipboard-list' },
            { id: 'comparar', nome: 'Comparar Preços', icone: 'fa-scale-balanced' }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                abaAtiva === aba.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <i className={`fa-solid ${aba.icone}`}></i>
              {aba.nome}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 min-w-0">
            <div className="card-glass rounded-xl shadow-lg p-6">
              
              {/* Lista Inteligente */}
              {abaAtiva === 'lista' && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        Lista de Compras
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={gerarListaIA}
                        className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm shrink-0"
                      >
                        <i className="fa-solid fa-magic-wand-sparkles"></i>
                        <span className="hidden sm:inline">Gerar IA</span>
                        <span className="sm:hidden">IA</span>
                      </button>
                      <button
                        onClick={() => setChatAberto(true)}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm shrink-0"
                      >
                        <i className="fa-solid fa-comments"></i>
                        <span className="hidden sm:inline">Consultor</span>
                        <span className="sm:hidden">Chat</span>
                      </button>
                    </div>
                  </div>

                  {/* Adicionar Item */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        value={novoItem}
                        onChange={(e) => setNovoItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && adicionarItem()}
                        placeholder="Adicionar item..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <select
                        value={categoriaItem}
                        onChange={(e) => setCategoriaItem(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-w-0 sm:w-auto"
                      >
                      {CATEGORIAS.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    </div>
                    <button
                      onClick={adicionarItem}
                      className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {/* Lista de Itens */}
                  <div className="space-y-3">
                    {listaCompras.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all duration-200 ${
                          item.checked
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.checked
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                          }`}
                        >
                          {item.checked && <i className="fa-solid fa-check text-xs"></i>}
                        </button>
                        
                        <div className="flex-1">
                          <div className={`font-medium ${
                            item.checked
                              ? 'text-green-700 dark:text-green-300 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category} • R$ {item.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => atualizarQuantidade(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => atualizarQuantidade(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removerItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Comparar Preços */}
              {abaAtiva === 'comparar' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Comparação de Preços
                  </h3>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={pesquisa}
                      onChange={(e) => setPesquisa(e.target.value)}
                      placeholder="Pesquisar produto..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    {PRODUTOS_SUGERIDOS.map((produto, index) => (
                      <div key={`produto-${produto.nome}-${index}`} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {produto.name}
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {produto.category} • {produto.store}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                R$ {produto.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                (economia de R$ {produto.savings.toFixed(2)})
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
                            Adicionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6 min-w-0">
            <div className="card-glass rounded-xl shadow-lg p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumo da Lista
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Itens:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{listaCompras.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Concluídos:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {listaCompras.filter(item => item.checked).length}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t pt-3">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-green-600 dark:text-green-400">
                    R$ {totalCompras.toFixed(2)}
                  </span>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[31.25rem] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Consultor de Compras</h3>
                </div>
              </div>
              <button
                onClick={() => setChatAberto(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {conversas.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400">
                    Como posso ajudar com suas compras hoje?
                  </p>
                </div>
              ) : (
                conversas.map((conversa, index) => (
                  <div
                    key={`conversa-${index}-${conversa.tipo}-${conversa.timestamp || Date.now()}`}
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
    </div>
  );
}