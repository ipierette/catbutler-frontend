import React, { useState } from 'react';

export default function MercadoIA() {
  const [abaAtiva, setAbaAtiva] = useState('comparar');
  const [produtoPesquisa, setProdutoPesquisa] = useState('');
  const [listaCompras, setListaCompras] = useState([]);
  const [novoItem, setNovoItem] = useState('');
  const [categoriaItem, setCategoriaItem] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [sugestoes, setSugestoes] = useState([]);

  // Abas do sistema de mercado
  const abas = [
    { id: 'comparar', nome: 'Comparar Preços', icone: 'fa-coins' },
    { id: 'lista', nome: 'Lista Inteligente', icone: 'fa-clipboard-list' },
    { id: 'ofertas', nome: 'Ofertas', icone: 'fa-bullseye' },
    { id: 'orcamento', nome: 'Orçamento', icone: 'fa-chart-bar' }
  ];

  // Dados de exemplo para produtos
  const produtosExemplo = [
    {
      id: 1,
      nome: 'Arroz 5kg',
      categoria: 'Grãos',
      preco: 12.90,
      mercado: 'Supermercado A',
      desconto: 15,
      imagem: '🍚'
    },
    {
      id: 2,
      nome: 'Arroz 5kg',
      categoria: 'Grãos',
      preco: 14.50,
      mercado: 'Supermercado B',
      desconto: 0,
      imagem: '🍚'
    },
    {
      id: 3,
      nome: 'Arroz 5kg',
      categoria: 'Grãos',
      preco: 13.20,
      mercado: 'Supermercado C',
      desconto: 8,
      imagem: '🍚'
    }
  ];

  // Categorias de produtos
  const categorias = [
    'Grãos', 'Carnes', 'Laticínios', 'Frutas', 'Verduras', 
    'Limpeza', 'Higiene', 'Bebidas', 'Congelados', 'Outros'
  ];

  // Sugestões inteligentes baseadas em padrões
  const sugestoesInteligentes = [
    { nome: 'Arroz 5kg', categoria: 'Grãos', frequencia: 'Semanal', preco: 12.90, imagem: 'fa-bowl-rice' },
    { nome: 'Feijão 1kg', categoria: 'Grãos', frequencia: 'Semanal', preco: 8.50, imagem: 'fa-seedling' },
    { nome: 'Leite 1L', categoria: 'Laticínios', frequencia: 'Diária', preco: 4.20, imagem: 'fa-mug-hot' },
    { nome: 'Pão Francês', categoria: 'Padaria', frequencia: 'Diária', preco: 0.80, imagem: 'fa-bread-slice' },
    { nome: 'Banana Kg', categoria: 'Frutas', frequencia: 'Semanal', preco: 3.90, imagem: 'fa-apple-alt' },
    { nome: 'Detergente', categoria: 'Limpeza', frequencia: 'Mensal', preco: 5.50, imagem: 'fa-spray-can' },
    { nome: 'Papel Higiênico', categoria: 'Higiene', frequencia: 'Mensal', preco: 12.00, imagem: 'fa-toilet-paper' },
    { nome: 'Café 500g', categoria: 'Bebidas', frequencia: 'Semanal', preco: 15.90, imagem: 'fa-coffee' }
  ];

  // Organização por seções do supermercado
  const secoesSupermercado = {
    'Grãos': ['Arroz', 'Feijão', 'Macarrão', 'Açúcar', 'Farinha'],
    'Laticínios': ['Leite', 'Queijo', 'Iogurte', 'Manteiga', 'Requeijão'],
    'Frutas': ['Banana', 'Maçã', 'Laranja', 'Uva', 'Morango'],
    'Verduras': ['Alface', 'Tomate', 'Cebola', 'Batata', 'Cenoura'],
    'Carnes': ['Frango', 'Carne', 'Peixe', 'Linguiça', 'Presunto'],
    'Limpeza': ['Detergente', 'Sabão', 'Desinfetante', 'Esponja', 'Papel Toalha'],
    'Higiene': ['Shampoo', 'Sabonete', 'Papel Higiênico', 'Pasta de Dente', 'Escova de Dentes'],
    'Bebidas': ['Refrigerante', 'Suco', 'Água', 'Cerveja', 'Café'],
    'Congelados': ['Pizza', 'Sorvete', 'Hambúrguer', 'Batata Frita', 'Frango Empanado'],
    'Padaria': ['Pão', 'Biscoito', 'Bolo', 'Torta', 'Croissant']
  };

  // Função para adicionar item à lista
  const adicionarItem = () => {
    if (novoItem.trim() && categoriaItem) {
      const processed = processTextInput(novoItem, { maxLength: 100, required: true });
      if (processed.isValid) {
        const novoItemObj = {
          id: Date.now(),
          nome: processed.sanitized,
          categoria: categoriaItem,
          quantidade: 1,
          precoEstimado: 0,
          comprado: false
        };
        setListaCompras([...listaCompras, novoItemObj]);
        setNovoItem('');
        setCategoriaItem('');
      } else {
        alert(processed.errors[0]);
      }
    }
  };

  // Função para remover item da lista
  const removerItem = (id) => {
    setListaCompras(listaCompras.filter(item => item.id !== id));
  };

  // Função para marcar como comprado
  const marcarComprado = (id) => {
    setListaCompras(listaCompras.map(item => 
      item.id === id ? { ...item, comprado: !item.comprado } : item
    ));
  };

  // Função para adicionar sugestão à lista
  const adicionarSugestao = (sugestao) => {
    const novoItemObj = {
      id: Date.now(),
      nome: sugestao.nome,
      categoria: sugestao.categoria,
      quantidade: 1,
      precoEstimado: sugestao.preco,
      comprado: false
    };
    setListaCompras([...listaCompras, novoItemObj]);
  };

  // Função para gerar sugestões inteligentes
  const gerarSugestoes = () => {
    const itensNaLista = listaCompras.map(item => item.nome.toLowerCase());
    const sugestoesFiltradas = sugestoesInteligentes.filter(sugestao => 
      !itensNaLista.some(item => item.includes(sugestao.nome.toLowerCase().split(' ')[0]))
    );
    setSugestoes(sugestoesFiltradas.slice(0, 4));
  };

  // Função para organizar lista por seções
  const organizarPorSecoes = () => {
    const listaOrganizada = {};
    listaCompras.forEach(item => {
      if (!listaOrganizada[item.categoria]) {
        listaOrganizada[item.categoria] = [];
      }
      listaOrganizada[item.categoria].push(item);
    });
    return listaOrganizada;
  };

  // Função para compartilhar lista
  const compartilharLista = () => {
    const listaTexto = listaCompras.map(item => 
      `${item.comprado ? '✓' : '○'} ${item.nome} (${item.categoria})`
    ).join('\n');
    
    const textoCompleto = `Lista de Compras - CatButler\n\n${listaTexto}\n\nFeito com amor pelo CatButler`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lista de Compras - CatButler',
        text: textoCompleto
      });
    } else {
      navigator.clipboard.writeText(textoCompleto);
      alert('Lista copiada para a área de transferência!');
    }
  };

  // Função para calcular total estimado
  const calcularTotal = () => {
    return listaCompras.reduce((total, item) => total + item.precoEstimado, 0);
  };

  // Função para renderizar conteúdo da aba ativa
  const renderizarConteudoAba = () => {
    switch (abaAtiva) {
      case 'comparar':
        return renderizarCompararPrecos();
      case 'lista':
        return renderizarListaInteligente();
      case 'ofertas':
        return renderizarOfertas();
      case 'orcamento':
        return renderizarOrcamento();
      default:
        return renderizarCompararPrecos();
    }
  };

  // Renderizar Comparar Preços
  const renderizarCompararPrecos = () => (
    <div className="space-y-6">
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-indigo-200 dark:bg-indigo-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-search text-white text-sm"></i>
          </div>
          Pesquisar Produtos
        </h3>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={produtoPesquisa}
            onChange={(e) => setProdutoPesquisa(e.target.value)}
            placeholder="Digite o nome do produto..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <button
            onClick={() => {/* Lógica de pesquisa */}}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold text-sm"
          >
            Pesquisar
          </button>
        </div>

        {produtoPesquisa && (
          <div className="space-y-3">
            {produtosExemplo.map(produto => (
              <div key={produto.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{produto.imagem}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{produto.nome}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{produto.mercado}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      {produto.desconto > 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full">
                          -{produto.desconto}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{produto.categoria}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  // Renderizar Lista Inteligente
  const renderizarListaInteligente = () => (
    <div className="space-y-6">
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 max-h-[calc(100vh-300px)] overflow-y-auto relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-200 dark:bg-emerald-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clipboard-list text-white text-sm"></i>
            </div>
            Lista de Compras Inteligente
          </h3>
          <div className="flex gap-2">
            <button
              onClick={gerarSugestoes}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-xs font-semibold"
            >
              <i className="fa-solid fa-lightbulb mr-1"></i>Sugestões
            </button>
            <button
              onClick={compartilharLista}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs font-semibold"
            >
              <i className="fa-solid fa-share mr-1"></i>Compartilhar
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            placeholder="Nome do produto..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <select
            value={categoriaItem}
            onChange={(e) => setCategoriaItem(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Categoria</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
          <button
            onClick={adicionarItem}
            disabled={!novoItem.trim() || !categoriaItem}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold text-sm"
          >
            Adicionar
          </button>
        </div>

        {/* Sugestões Inteligentes */}
        {sugestoes.length > 0 && (
          <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-500/30">
            <h4 className="text-xs font-semibold text-purple-800 dark:text-purple-100 mb-1">
              <i className="fa-solid fa-lightbulb mr-1"></i>Sugestões Inteligentes:
            </h4>
            <div className="flex flex-wrap gap-1">
              {sugestoes.map((sugestao, index) => (
                <button
                  key={index}
                  onClick={() => adicionarSugestao(sugestao)}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-800/30 text-purple-800 dark:text-purple-200 rounded text-xs hover:bg-purple-200 dark:hover:bg-purple-700/30 transition-colors"
                >
                  <i className={`fa-solid ${sugestao.imagem}`}></i>
                  <span>{sugestao.nome}</span>
                  <span className="text-purple-600 dark:text-purple-300">+</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lista Organizada por Seções */}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {Object.keys(organizarPorSecoes()).length > 0 ? (
            Object.entries(organizarPorSecoes()).map(([categoria, itens]) => (
              <div key={categoria} className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-lg">
                    {categoria === 'Grãos' && <i className="fa-solid fa-seedling"></i>}
                    {categoria === 'Laticínios' && <i className="fa-solid fa-mug-hot"></i>}
                    {categoria === 'Frutas' && <i className="fa-solid fa-apple-whole"></i>}
                    {categoria === 'Verduras' && <i className="fa-solid fa-leaf"></i>}
                    {categoria === 'Carnes' && <i className="fa-solid fa-drumstick-bite"></i>}
                    {categoria === 'Limpeza' && <i className="fa-solid fa-spray-can"></i>}
                    {categoria === 'Higiene' && <i className="fa-solid fa-soap"></i>}
                    {categoria === 'Bebidas' && <i className="fa-solid fa-glass-water"></i>}
                    {categoria === 'Congelados' && <i className="fa-solid fa-snowflake"></i>}
                    {categoria === 'Padaria' && <i className="fa-solid fa-bread-slice"></i>}
                    {categoria === 'Outros' && <i className="fa-solid fa-box"></i>}
                  </span>
                  {categoria}
                </h4>
                <div className="space-y-1">
                  {itens.map(item => (
                    <div key={item.id} className={`p-2 rounded-lg border transition-colors ${
                      item.comprado 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30' 
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.comprado}
                            onChange={() => marcarComprado(item.id)}
                            className="text-green-600 focus:ring-green-500 rounded"
                          />
                          <div>
                            <h5 className={`font-medium text-sm ${
                              item.comprado 
                                ? 'text-green-800 dark:text-green-200 line-through' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {item.nome}
                            </h5>
                            {item.precoEstimado > 0 && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                R$ {item.precoEstimado.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removerItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">
                <i className="fa-solid fa-shopping-cart text-gray-400"></i>
              </div>
              <p>Nenhum item na lista ainda</p>
              <p className="text-sm">Adicione produtos ou use as sugestões inteligentes!</p>
            </div>
          )}
        </div>

        {/* Total Estimado */}
        {listaCompras.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-100">
                Total Estimado:
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                R$ {calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  // Renderizar Ofertas
  const renderizarOfertas = () => (
    <div className="space-y-6">
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 dark:bg-yellow-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-orange-200 dark:bg-orange-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-bullseye text-white text-sm"></i>
          </div>
          Ofertas em Destaque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { nome: 'Leite 1L', preco: 3.50, desconto: 20, mercado: 'Super A', imagem: 'fa-mug-hot' },
            { nome: 'Pão Francês', preco: 0.80, desconto: 15, mercado: 'Padaria B', imagem: 'fa-bread-slice' },
            { nome: 'Banana Kg', preco: 2.90, desconto: 25, mercado: 'Frutas C', imagem: 'fa-apple-alt' },
            { nome: 'Detergente', preco: 4.20, desconto: 30, mercado: 'Super D', imagem: 'fa-spray-can' }
          ].map((oferta, index) => (
            <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <i className={`fa-solid ${oferta.imagem} text-2xl`}></i>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full">
                  -{oferta.desconto}%
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{oferta.nome}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{oferta.mercado}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  R$ {oferta.preco.toFixed(2)}
                </span>
                <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-colors">
                  Ver Oferta
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // Renderizar Orçamento
  const renderizarOrcamento = () => (
    <div className="space-y-6">
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-pink-200 dark:bg-pink-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-chart-bar text-white text-sm"></i>
          </div>
          Controle de Orçamento
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Orçamento Mensal:
            </label>
            <input
              type="number"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Localização:
            </label>
            <select
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Selecione sua região</option>
              <option value="sp">São Paulo</option>
              <option value="rj">Rio de Janeiro</option>
              <option value="mg">Minas Gerais</option>
              <option value="rs">Rio Grande do Sul</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ 0</div>
            <div className="text-xs text-blue-800 dark:text-blue-100">Gasto Total</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-500/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 0</div>
            <div className="text-xs text-green-800 dark:text-green-100">Economizado</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-500/30">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0%</div>
            <div className="text-xs text-purple-800 dark:text-purple-100">Utilizado</div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative flex items-center justify-between w-full mx-auto glass-effect rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500 h-20 sm:h-24">
        <div className="flex items-center gap-3">
          <div className="text-2xl sm:text-3xl">
            <i className="fa-solid fa-shopping-cart text-blue-600 dark:text-blue-400"></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Mercado IA</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Compras inteligentes e economia</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {listaCompras.length} itens
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">na lista</div>
        </div>
      </section>

      {/* Sistema de Abas */}
      <div className="space-y-4 sm:space-y-6">
        {/* Navegação das Abas */}
        <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {abas.map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  abaAtiva === aba.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <i className={`fa-solid ${aba.icone} text-lg`}></i>
                <span className="hidden sm:inline">{aba.nome}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Conteúdo da Aba Ativa */}
        <div className="fade-in-up">
          {renderizarConteudoAba()}
        </div>
      </div>
    </main>
  );
}
