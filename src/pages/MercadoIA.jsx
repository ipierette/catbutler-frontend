import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';

// Dados das categorias
const CATEGORIAS = [
  { name: "Hortifruti", icon: "fa-carrot", color: "from-green-500 to-emerald-500", items: 15 },
  { name: "Carnes", icon: "fa-drumstick-bite", color: "from-red-500 to-orange-500", items: 8 },
  { name: "Laticínios", icon: "fa-cheese", color: "from-yellow-500 to-amber-500", items: 12 },
  { name: "Grãos", icon: "fa-wheat-awn", color: "from-amber-500 to-yellow-500", items: 10 },
  { name: "Limpeza", icon: "fa-bottle-water", color: "from-blue-500 to-cyan-500", items: 7 },
  { name: "Higiene", icon: "fa-pump-soap", color: "from-purple-500 to-pink-500", items: 9 }
];

// Estados e cidades do Brasil para comparação de preços
const ESTADOS_CIDADES = {
  "SP": {
    nome: "São Paulo",
    cidades: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos"]
  },
  "RJ": {
    nome: "Rio de Janeiro", 
    cidades: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "Petrópolis"]
  },
  "MG": {
    nome: "Minas Gerais",
    cidades: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"]
  },
  "RS": {
    nome: "Rio Grande do Sul",
    cidades: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"]
  },
  "PR": {
    nome: "Paraná",
    cidades: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"]
  },
  "SC": {
    nome: "Santa Catarina",
    cidades: ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma"]
  }
};

// Base de dados expandida de produtos por localização
const PRODUTOS_COMPARACAO = {
  "SP": {
    "São Paulo": {
      "Arroz 5kg": [
        { store: "Carrefour Vila Olímpia", price: 18.90, originalPrice: 21.40, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" },
        { store: "Pão de Açúcar Moema", price: 19.50, originalPrice: 22.00, distance: "1.2km", rating: 4.2, address: "Av. Moema, 170" },
        { store: "Atacadão Vila Leopoldina", price: 17.80, originalPrice: 20.30, distance: "2.1km", rating: 4.7, address: "Av. Imperatriz Leopoldina, 1000" },
        { store: "Extra Paulista", price: 20.10, originalPrice: 21.90, distance: "0.8km", rating: 4.0, address: "Av. Paulista, 2064" }
      ],
      "Frango 1kg": [
        { store: "Açougue Premium", price: 12.50, originalPrice: 14.30, distance: "0.3km", rating: 4.8, address: "R. Harmonia, 123" },
        { store: "Carrefour Vila Olímpia", price: 13.20, originalPrice: 14.80, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" },
        { store: "Pão de Açúcar Moema", price: 11.90, originalPrice: 13.50, distance: "1.2km", rating: 4.2, address: "Av. Moema, 170" },
        { store: "Atacadão Vila Leopoldina", price: 11.20, originalPrice: 12.90, distance: "2.1km", rating: 4.7, address: "Av. Imperatriz Leopoldina, 1000" }
      ],
      "Leite 1L": [
        { store: "Mercado São Luiz", price: 4.20, originalPrice: 5.10, distance: "0.7km", rating: 4.3, address: "R. da Consolação, 3555" },
        { store: "Carrefour Vila Olímpia", price: 4.50, originalPrice: 5.00, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" },
        { store: "Conveniência Shell", price: 5.20, originalPrice: 5.80, distance: "0.2km", rating: 3.9, address: "Av. Faria Lima, 1234" },
        { store: "Atacadão Vila Leopoldina", price: 3.90, originalPrice: 4.70, distance: "2.1km", rating: 4.7, address: "Av. Imperatriz Leopoldina, 1000" }
      ],
      "Açúcar 1kg": [
        { store: "Atacadão Vila Leopoldina", price: 3.20, originalPrice: 4.10, distance: "2.1km", rating: 4.7, address: "Av. Imperatriz Leopoldina, 1000" },
        { store: "Carrefour Vila Olímpia", price: 3.80, originalPrice: 4.50, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" },
        { store: "Pão de Açúcar Moema", price: 3.60, originalPrice: 4.20, distance: "1.2km", rating: 4.2, address: "Av. Moema, 170" }
      ],
      "Óleo de Soja 900ml": [
        { store: "Atacadão Vila Leopoldina", price: 4.80, originalPrice: 6.20, distance: "2.1km", rating: 4.7, address: "Av. Imperatriz Leopoldina, 1000" },
        { store: "Carrefour Vila Olímpia", price: 5.50, originalPrice: 6.50, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" },
        { store: "Pão de Açúcar Moema", price: 5.20, originalPrice: 6.00, distance: "1.2km", rating: 4.2, address: "Av. Moema, 170" }
      ],
      "Banana 1kg": [
        { store: "Feira Central", price: 5.80, originalPrice: 7.00, distance: "1.0km", rating: 4.6, address: "Av. São João, 1000" },
        { store: "Hortifruti Premium", price: 6.50, originalPrice: 7.50, distance: "0.4km", rating: 4.4, address: "R. Augusta, 500" },
        { store: "Carrefour Vila Olímpia", price: 7.20, originalPrice: 8.00, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" }
      ],
      "Tomate 1kg": [
        { store: "Feira Central", price: 6.90, originalPrice: 8.50, distance: "1.0km", rating: 4.6, address: "Av. São João, 1000" },
        { store: "Hortifruti Premium", price: 7.80, originalPrice: 9.00, distance: "0.4km", rating: 4.4, address: "R. Augusta, 500" },
        { store: "Pão de Açúcar Moema", price: 8.20, originalPrice: 9.50, distance: "1.2km", rating: 4.2, address: "Av. Moema, 170" }
      ],
      "Pão Francês": [
        { store: "Padaria do Bairro", price: 8.50, originalPrice: 10.00, distance: "0.3km", rating: 4.7, address: "R. Consolação, 200" },
        { store: "Padaria Central", price: 7.80, originalPrice: 9.20, distance: "0.8km", rating: 4.5, address: "Av. Paulista, 1500" },
        { store: "Pão de Açúcar Moema", price: 9.20, originalPrice: 10.50, distance: "1.2km", rating: 4.2, address: "Av. Moema, 170" }
      ],
      "Ovos 12un": [
        { store: "Atacadão Vila Leopoldina", price: 15.90, originalPrice: 18.50, distance: "2.1km", rating: 4.7, address: "Av. Imperatriz Leopoldina, 1000" },
        { store: "Carrefour Vila Olímpia", price: 16.80, originalPrice: 19.20, distance: "0.5km", rating: 4.5, address: "Av. das Nações Unidas, 14401" },
        { store: "Mercado São Luiz", price: 17.50, originalPrice: 20.00, distance: "0.7km", rating: 4.3, address: "R. da Consolação, 3555" }
      ]
    },
    "Campinas": {
      "Arroz 5kg": [
        { store: "Carrefour Barão Geraldo", price: 17.50, originalPrice: 20.00, distance: "1.2km", rating: 4.4, address: "Av. Albino J. B. de Oliveira, 1430" },
        { store: "Walmart Campinas", price: 18.20, originalPrice: 21.50, distance: "2.5km", rating: 4.1, address: "Av. John Boyd Dunlop, s/n" },
        { store: "Atacadão Campinas", price: 16.80, originalPrice: 19.30, distance: "3.1km", rating: 4.6, address: "Av. Ruy Rodriguez, 1609" }
      ],
      "Frango 1kg": [
        { store: "Açougue do Bairro", price: 11.80, originalPrice: 13.50, distance: "0.5km", rating: 4.7, address: "R. General Osório, 456" },
        { store: "Carrefour Barão Geraldo", price: 12.90, originalPrice: 14.20, distance: "1.2km", rating: 4.4, address: "Av. Albino J. B. de Oliveira, 1430" },
        { store: "Atacadão Campinas", price: 10.90, originalPrice: 12.40, distance: "3.1km", rating: 4.6, address: "Av. Ruy Rodriguez, 1609" }
      ]
    }
  },
  "RJ": {
    "Rio de Janeiro": {
      "Arroz 5kg": [
        { store: "Guanabara Ipanema", price: 19.50, originalPrice: 22.00, distance: "0.8km", rating: 4.6, address: "R. Visconde de Pirajá, 550" },
        { store: "Extra Copacabana", price: 20.20, originalPrice: 23.50, distance: "1.5km", rating: 4.2, address: "Av. Nossa Senhora de Copacabana, 1000" },
        { store: "Zona Sul Leblon", price: 21.50, originalPrice: 24.00, distance: "1.2km", rating: 4.7, address: "Av. Ataulfo de Paiva, 1174" }
      ],
      "Frango 1kg": [
        { store: "Açougue Carioca", price: 13.80, originalPrice: 15.50, distance: "0.4km", rating: 4.8, address: "R. Barata Ribeiro, 123" },
        { store: "Guanabara Ipanema", price: 14.20, originalPrice: 16.00, distance: "0.8km", rating: 4.6, address: "R. Visconde de Pirajá, 550" },
        { store: "Extra Copacabana", price: 13.50, originalPrice: 15.20, distance: "1.5km", rating: 4.2, address: "Av. Nossa Senhora de Copacabana, 1000" }
      ]
    }
  },
  "MG": {
    "Belo Horizonte": {
      "Arroz 5kg": [
        { store: "EPA Savassi", price: 18.20, originalPrice: 20.80, distance: "1.0km", rating: 4.4, address: "Av. Getúlio Vargas, 1640" },
        { store: "Carrefour BH Shopping", price: 17.90, originalPrice: 20.50, distance: "5.2km", rating: 4.3, address: "BR-356, 3049" },
        { store: "Atacadão Contagem", price: 16.50, originalPrice: 19.00, distance: "8.5km", rating: 4.6, address: "Av. João César de Oliveira, 1350" }
      ]
    }
  }
};

export default function MercadoIA() {
  // Auth context  
  const { isVisitorMode } = useAuth();

  // Estados principais
  const [abaAtiva, setAbaAtiva] = useState('lista');
  const [listaCompras, setListaCompras] = useState([
    { id: 1, name: "Arroz 5kg", category: "Grãos", quantity: 1, price: 18.90, checked: false },
    { id: 2, name: "Frango 1kg", category: "Carnes", quantity: 2, price: 12.50, checked: true }
  ]);
  const [novoItem, setNovoItem] = useState("");
  const [categoriaItem, setCategoriaItem] = useState("Hortifruti");
  const [orcamentoMeta, setOrcamentoMeta] = useState(200);

  // Estados para comparação de preços
  const [estadoSelecionado, setEstadoSelecionado] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mercado_estado_selecionado') || "SP";
    }
    return "SP";
  });
  const [cidadeSelecionada, setCidadeSelecionada] = useState(() => {
    if (typeof window !== 'undefined') {
      const estadoSalvo = localStorage.getItem('mercado_estado_selecionado') || "SP";
      const cidadeSalva = localStorage.getItem('mercado_cidade_selecionada');
      if (cidadeSalva && ESTADOS_CIDADES[estadoSalvo]?.cidades.includes(cidadeSalva)) {
        return cidadeSalva;
      }
      return ESTADOS_CIDADES[estadoSalvo]?.cidades[0] || "São Paulo";
    }
    return "São Paulo";
  });
  const [produtoSelecionado, setProdutoSelecionado] = useState("Arroz 5kg");
  const [pesquisaProduto, setPesquisaProduto] = useState("");
  const [ordenacao, setOrdenacao] = useState("preco");

  // Estados do chat
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([]);

  // Estados para crowdsourcing
  const [tutorialAberto, setTutorialAberto] = useState(false);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [precoContribuicao, setPrecoContribuicao] = useState("");
  const [lojaContribuicao, setLojaContribuicao] = useState("");
  const [enderecoContribuicao, setEnderecoContribuicao] = useState("");
  const [estadoContribuicao, setEstadoContribuicao] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contribuicao_estado_padrao') || "SP";
    }
    return "SP";
  });
  const [cidadeContribuicao, setCidadeContribuicao] = useState(() => {
    if (typeof window !== 'undefined') {
      const estadoSalvo = localStorage.getItem('contribuicao_estado_padrao') || "SP";
      const cidadeSalva = localStorage.getItem('contribuicao_cidade_padrao');
      if (cidadeSalva && ESTADOS_CIDADES[estadoSalvo]?.cidades.includes(cidadeSalva)) {
        return cidadeSalva;
      }
      return ESTADOS_CIDADES[estadoSalvo]?.cidades[0] || "São Paulo";
    }
    return "São Paulo";
  });
  
  // Estados para mercados favoritos
  const [mercadosFavoritos, setMercadosFavoritos] = useState(() => {
    if (typeof window !== 'undefined') {
      const favoritos = localStorage.getItem('mercados_favoritos');
      return favoritos ? JSON.parse(favoritos) : [];
    }
    return [];
  });
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [monthlyMessages, setMonthlyMessages] = useState(() => {
    if (isVisitorMode) {
      const saved = localStorage.getItem('mercadoMonthlyMessages');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Atualizar contador no localStorage
  useEffect(() => {
    if (isVisitorMode) {
      localStorage.setItem('mercadoMonthlyMessages', monthlyMessages.toString());
    }
  }, [monthlyMessages]);

  // Persistir localização selecionada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mercado_estado_selecionado', estadoSelecionado);
    }
  }, [estadoSelecionado]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mercado_cidade_selecionada', cidadeSelecionada);
    }
  }, [cidadeSelecionada]);

  // Persistir mercados favoritos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mercados_favoritos', JSON.stringify(mercadosFavoritos));
    }
  }, [mercadosFavoritos]);

  // Persistir configurações de contribuição
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contribuicao_estado_padrao', estadoContribuicao);
    }
  }, [estadoContribuicao]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contribuicao_cidade_padrao', cidadeContribuicao);
    }
  }, [cidadeContribuicao]);

  // Funções para gerenciar mercados favoritos (definidas antes dos useMemo que as utilizam)
  const toggleMercadoFavorito = useCallback((estabelecimento) => {
    const mercadoId = `${estabelecimento.store}_${cidadeSelecionada}_${estadoSelecionado}`;
    const mercadoData = {
      id: mercadoId,
      nome: estabelecimento.store,
      endereco: estabelecimento.address,
      cidade: cidadeSelecionada,
      estado: estadoSelecionado,
      rating: estabelecimento.rating,
      distancia: estabelecimento.distance
    };

    setMercadosFavoritos(prev => {
      const isJaFavorito = prev.some(m => m.id === mercadoId);
      if (isJaFavorito) {
        return prev.filter(m => m.id !== mercadoId);
      } else {
        return [...prev, mercadoData];
      }
    });
  }, [cidadeSelecionada, estadoSelecionado]);

  const isMercadoFavorito = useCallback((estabelecimento) => {
    const mercadoId = `${estabelecimento.store}_${cidadeSelecionada}_${estadoSelecionado}`;
    return mercadosFavoritos.some(m => m.id === mercadoId);
  }, [mercadosFavoritos, cidadeSelecionada, estadoSelecionado]);

  const filtrarMercadosPorFavoritos = useCallback((estabelecimentos) => {
    if (!mostrarFavoritos) return estabelecimentos;
    return estabelecimentos.filter(est => isMercadoFavorito(est));
  }, [mostrarFavoritos, isMercadoFavorito]);

  // Cálculos
  const totalCompras = useMemo(() => {
    return listaCompras.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [listaCompras]);

  const progressoOrcamento = useMemo(() => {
    return Math.min((totalCompras / orcamentoMeta) * 100, 100);
  }, [totalCompras, orcamentoMeta]);

  const cidadesDisponiveis = useMemo(() => {
    return ESTADOS_CIDADES[estadoSelecionado]?.cidades || [];
  }, [estadoSelecionado]);

  const produtosDisponiveis = useMemo(() => {
    const dadosCidade = PRODUTOS_COMPARACAO[estadoSelecionado]?.[cidadeSelecionada];
    if (!dadosCidade) return [];
    
    const produtos = Object.keys(dadosCidade);
    if (!pesquisaProduto.trim()) return produtos;
    
    return produtos.filter(produto =>
      produto.toLowerCase().includes(pesquisaProduto.toLowerCase())
    );
  }, [estadoSelecionado, cidadeSelecionada, pesquisaProduto]);

  const estabelecimentosOrdenados = useMemo(() => {
    const dadosCidade = PRODUTOS_COMPARACAO[estadoSelecionado]?.[cidadeSelecionada];
    
    // Se há pesquisa, usar o primeiro resultado da pesquisa
    let produtoParaComparar = produtoSelecionado;
    if (pesquisaProduto.trim() && produtosDisponiveis.length > 0) {
      produtoParaComparar = produtosDisponiveis[0];
    }
    
    if (!dadosCidade || !produtoParaComparar || !dadosCidade[produtoParaComparar]) return [];
    
    let estabelecimentos = [...dadosCidade[produtoParaComparar]];
    
    // Aplicar filtro de favoritos se ativo
    estabelecimentos = filtrarMercadosPorFavoritos(estabelecimentos);
    
    return estabelecimentos.sort((a, b) => {
      switch (ordenacao) {
        case 'preco':
          return a.price - b.price;
        case 'economia':
          return (b.originalPrice - b.price) - (a.originalPrice - a.price);
        case 'distancia':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'avaliacao':
          return b.rating - a.rating;
        default:
          return a.price - b.price;
      }
    });
  }, [estadoSelecionado, cidadeSelecionada, produtoSelecionado, pesquisaProduto, produtosDisponiveis, ordenacao, filtrarMercadosPorFavoritos]);

  // Produto atual sendo comparado (considerando pesquisa)
  const produtoAtual = useMemo(() => {
    if (pesquisaProduto.trim() && produtosDisponiveis.length > 0) {
      return produtosDisponiveis[0];
    }
    return produtoSelecionado;
  }, [pesquisaProduto, produtosDisponiveis, produtoSelecionado]);

  // Atualizar cidade quando estado muda
  useEffect(() => {
    const cidadesDoEstado = ESTADOS_CIDADES[estadoSelecionado]?.cidades || [];
    if (cidadesDoEstado.length > 0 && !cidadesDoEstado.includes(cidadeSelecionada)) {
      setCidadeSelecionada(cidadesDoEstado[0]);
    }
  }, [estadoSelecionado, cidadeSelecionada]);

  // Atualizar produto quando localização muda
  useEffect(() => {
    const dadosCidade = PRODUTOS_COMPARACAO[estadoSelecionado]?.[cidadeSelecionada];
    const produtosDisponiveis = dadosCidade ? Object.keys(dadosCidade) : [];
    if (produtosDisponiveis.length > 0 && !produtosDisponiveis.includes(produtoSelecionado)) {
      setProdutoSelecionado(produtosDisponiveis[0]);
    }
  }, [estadoSelecionado, cidadeSelecionada, produtoSelecionado]);

  // Handlers
  const adicionarItem = useCallback(() => {
    if (!novoItem.trim()) return;
    
    const novoId = Math.max(...listaCompras.map(item => item.id), 0) + 1;
    setListaCompras(prev => [...prev, {
      id: novoId,
      name: novoItem,
      category: categoriaItem,
      quantity: 1,
      price: 0,
      checked: false
    }]);
    setNovoItem("");
  }, [novoItem, categoriaItem, listaCompras]);

  const removerItem = useCallback((id) => {
    setListaCompras(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleItem = useCallback((id) => {
    setListaCompras(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  }, []);

  const atualizarQuantidade = useCallback((id, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    setListaCompras(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: novaQuantidade } : item
    ));
  }, []);

  const gerarListaIA = useCallback(async () => {
    // Simular geração de lista inteligente
    const novosItens = [
      { id: Date.now() + 1, name: "Tomate 1kg", category: "Hortifruti", quantity: 1, price: 6.90, checked: false, isNewAI: true },
      { id: Date.now() + 2, name: "Pão francês", category: "Padaria", quantity: 1, price: 8.50, checked: false, isNewAI: true },
      { id: Date.now() + 3, name: "Ovos 12un", category: "Laticínios", quantity: 1, price: 15.90, checked: false, isNewAI: true }
    ];
    
    setListaCompras(prev => [...prev, ...novosItens]);
    
    // Remover destaque após 5 segundos
    setTimeout(() => {
      setListaCompras(prev => prev.map(item => ({ ...item, isNewAI: false })));
    }, 5000);
  }, []);

  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim()) return;

    // Verificar limite de mensagens para visitantes
    if (isVisitorMode) {
      if (monthlyMessages >= 4) {
        alert('Você atingiu o limite de 4 mensagens mensais para visitantes. Crie uma conta para conversar sem limites!');
        return;
      }
      setMonthlyMessages(prev => prev + 1);
    }

    const novaMensagem = {
      id: Date.now(),
      texto: mensagem,
      tipo: 'usuario',
      timestamp: new Date()
    };

    setConversas(prev => [...prev, novaMensagem]);
    setMensagem("");

    // Simular resposta do assistente
    setTimeout(() => {
      const resposta = {
        id: Date.now() + 1,
        texto: "Posso ajudar você com dicas de economia, sugestões de produtos e organização da sua lista de compras. O que você gostaria de saber?",
        tipo: 'assistente',
        timestamp: new Date()
      };
      setConversas(prev => [...prev, resposta]);
    }, 1000);
  }, [mensagem, isVisitorMode, monthlyMessages]);

  // Funções para crowdsourcing
  const iniciarCamera = useCallback(async () => {
    try {
      setCameraAtiva(true);
      // Simular leitura de código de barras
      setTimeout(() => {
        const codigoSimulado = "7891000100103"; // Código EAN-13 simulado
        setCodigoBarras(codigoSimulado);
        setCameraAtiva(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      setCameraAtiva(false);
    }
  }, []);

  const enviarContribuicao = useCallback(() => {
    if (!codigoBarras || !precoContribuicao || !lojaContribuicao || !estadoContribuicao || !cidadeContribuicao) {
      alert('Por favor, preencha todos os campos obrigatórios (código, preço, loja, estado e cidade).');
      return;
    }

    // Simular envio da contribuição
    alert(`Obrigado pela contribuição! 
    
📦 Produto: ${codigoBarras}
💰 Preço: R$ ${precoContribuicao}
🏪 Loja: ${lojaContribuicao}
📍 Localização: ${cidadeContribuicao} - ${ESTADOS_CIDADES[estadoContribuicao]?.nome}
${enderecoContribuicao ? `🗺️ Endereço: ${enderecoContribuicao}` : ''}

Sua contribuição será validada e adicionada ao nosso banco de dados em até 24h.
Obrigado por ajudar a comunidade CatButler! 🐱`);

    // Limpar formulário
    setCodigoBarras("");
    setPrecoContribuicao("");
    setLojaContribuicao("");
    setEnderecoContribuicao("");
    setEstadoContribuicao("SP");
    setCidadeContribuicao("São Paulo");
    setMostrarContribuicao(false);
  }, [codigoBarras, precoContribuicao, lojaContribuicao, estadoContribuicao, cidadeContribuicao, enderecoContribuicao]);

  return (
    <VisitorModeWrapper pageName="o mercado IA">
      <div className="min-h-screen overflow-y-auto">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
              <i className="fa-solid fa-shopping-cart text-lg text-green-600 dark:text-green-400"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Mercado
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Economize tempo e dinheiro com listas inteligentes e comparação de preços
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro - Compacto */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-shopping-basket text-white text-sm"></i>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  R$ {totalCompras.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total da Lista</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-piggy-bank text-white text-sm"></i>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  R$ {(orcamentoMeta - totalCompras).toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Restante</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-list text-white text-sm"></i>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {listaCompras.length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Itens</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 relative">
            {isVisitorMode && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="text-center p-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fa-solid fa-lock text-white text-sm"></i>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    Controle Premium
                  </p>
                  <button
                    onClick={() => window.location.href = '/criar-conta'}
                    className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-medium"
                  >
                    Criar Conta
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-chart-line text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {progressoOrcamento.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Orçamento Mensal</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progressoOrcamento > 90 ? 'bg-red-500' : 
                      progressoOrcamento > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${progressoOrcamento}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>R$ 0</span>
                  <input
                    type="number"
                    value={orcamentoMeta}
                    onChange={(e) => setOrcamentoMeta(Number(e.target.value))}
                    className="w-12 px-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[
            { id: 'lista', nome: 'Lista Inteligente', icone: 'fa-clipboard-list' },
            { id: 'comparar', nome: 'Comparar Preços', icone: 'fa-scale-balanced' },
            { id: 'contribuir', nome: 'Ajude nosso banco de preços', icone: 'fa-camera' }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                abaAtiva === aba.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <i className={`fa-solid ${aba.icone}`}></i>
              {aba.nome}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              
              {/* Lista Inteligente */}
              {abaAtiva === 'lista' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Lista de Compras
                    </h3>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      onClick={() => {
                        if (isVisitorMode) {
                          alert('Sugestões inteligentes disponíveis apenas para usuários cadastrados! Crie sua conta para ter listas personalizadas.');
                          window.location.href = '/criar-conta';
                        } else {
                          gerarListaIA();
                        }
                      }}
                      className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm shrink-0 disabled:opacity-50"
                      title={isVisitorMode ? "Disponível apenas para usuários cadastrados" : ""}
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

                  {/* Adicionar Item */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={novoItem}
                        onChange={(e) => setNovoItem(e.target.value)}
                        placeholder="Adicionar item..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && adicionarItem()}
                      />
                      <select
                        value={categoriaItem}
                        onChange={(e) => setCategoriaItem(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        {CATEGORIAS.map(cat => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={adicionarItem}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                      >
                        <i className="fa-solid fa-plus"></i>
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Lista de Itens */}
                  <div className="space-y-3">
                    {listaCompras.map(item => (
                      <div 
                        key={item.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                          item.isNewAI 
                            ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-2 border-purple-300 dark:border-purple-600 shadow-lg' 
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            item.checked 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                          }`}
                        >
                          {item.checked && <i className="fa-solid fa-check text-xs"></i>}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {item.name}
                            </p>
                            {item.isNewAI && (
                              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full animate-pulse">
                                <i className="fa-solid fa-magic-wand-sparkles mr-1"></i>
                                IA
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.category} • R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => atualizarQuantidade(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => atualizarQuantidade(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                          
                          <button
                            onClick={() => removerItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparar Preços */}
              {abaAtiva === 'comparar' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Comparação de Preços
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <i className="fa-solid fa-info-circle mr-1"></i>
                      Encontre os melhores preços da região
                    </div>
                  </div>

                  {/* Seletores de Localização */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="fa-solid fa-map-marker-alt text-blue-600"></i>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Localização para Comparação
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="estado-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado
                        </label>
                        <select
                          id="estado-select"
                          value={estadoSelecionado}
                          onChange={(e) => setEstadoSelecionado(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(ESTADOS_CIDADES).map(([sigla, estado]) => (
                            <option key={sigla} value={sigla}>
                              {estado.nome} ({sigla})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="cidade-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cidade
                        </label>
                        <select
                          id="cidade-select"
                          value={cidadeSelecionada}
                          onChange={(e) => setCidadeSelecionada(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={cidadesDisponiveis.length === 0}
                        >
                          {cidadesDisponiveis.map(cidade => (
                            <option key={cidade} value={cidade}>
                              {cidade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pesquisa de Produto e Ordenação */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pesquisar Produto
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={pesquisaProduto}
                          onChange={(e) => setPesquisaProduto(e.target.value)}
                          placeholder="Digite o nome do produto (ex: arroz, frango, leite...)"
                          className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      </div>
                      {pesquisaProduto.trim() && produtosDisponiveis.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded text-sm">
                          <i className="fa-solid fa-check-circle text-green-600 mr-1"></i>
                          {produtosDisponiveis.length} produto(s) encontrado(s)
                        </div>
                      )}
                      {pesquisaProduto.trim() && produtosDisponiveis.length === 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded text-sm">
                          <i className="fa-solid fa-exclamation-triangle text-yellow-600 mr-1"></i>
                          Produto não encontrado em {cidadeSelecionada}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="preco">Menor Preço</option>
                        <option value="economia">Maior Economia</option>
                        <option value="distancia">Mais Próximo</option>
                        <option value="avaliacao">Melhor Avaliado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mercados Favoritos
                      </label>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
                          className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${
                            mostrarFavoritos
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <i className={`fa-solid ${mostrarFavoritos ? 'fa-heart' : 'fa-heart-o'}`}></i>
                            <span>{mostrarFavoritos ? 'Mostrar Todos' : 'Só Favoritos'}</span>
                          </div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {mercadosFavoritos.length}
                          </span>
                        </button>
                        {mercadosFavoritos.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            ❤️ {mercadosFavoritos.length} mercados salvos
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resumo do Produto */}
                  {produtoAtual && estabelecimentosOrdenados.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-600 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {produtoAtual}
                            {pesquisaProduto.trim() && (
                              <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                <i className="fa-solid fa-search mr-1"></i>
                                Pesquisa
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-2">
                            <i className="fa-solid fa-map-marker-alt"></i>
                            <span>{cidadeSelecionada} - {ESTADOS_CIDADES[estadoSelecionado]?.nome}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-store text-green-600"></i>
                              {estabelecimentosOrdenados.length} estabelecimentos
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-piggy-bank text-blue-600"></i>
                              Até R$ {Math.max(...estabelecimentosOrdenados.map(e => e.originalPrice - e.price)).toFixed(2)} de economia
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            A partir de R$ {Math.min(...estabelecimentosOrdenados.map(e => e.price)).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            R$ {estabelecimentosOrdenados.find(e => e.price === Math.min(...estabelecimentosOrdenados.map(e => e.price)))?.originalPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Estabelecimentos */}
                  <div className="space-y-3">
                    {estabelecimentosOrdenados.map((estabelecimento, index) => {
                      const economia = estabelecimento.originalPrice - estabelecimento.price;
                      const percentualEconomia = ((economia / estabelecimento.originalPrice) * 100);
                      const isMelhorPreco = estabelecimento.price === Math.min(...estabelecimentosOrdenados.map(e => e.price));
                      
                      return (
                        <div 
                          key={`${estabelecimento.store}-${index}`} 
                          className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                            isMelhorPreco 
                              ? 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {estabelecimento.store}
                                </h4>
                                {isMelhorPreco && (
                                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                    <i className="fa-solid fa-crown mr-1"></i>
                                    Melhor Preço
                                  </span>
                                )}
                              </div>
                              
                              <div className="mb-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  <i className="fa-solid fa-location-dot mr-1"></i>
                                  {estabelecimento.address}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                  <i className="fa-solid fa-route text-blue-500"></i>
                                  {estabelecimento.distance}
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                  <i className="fa-solid fa-star text-yellow-500"></i>
                                  {estabelecimento.rating}
                                </div>
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <i className="fa-solid fa-percentage"></i>
                                  {percentualEconomia.toFixed(0)}% off
                                </div>
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <i className="fa-solid fa-piggy-bank"></i>
                                  Economize R$ {economia.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  R$ {estabelecimento.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                  R$ {estabelecimento.price.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <button
                                  onClick={() => toggleMercadoFavorito(estabelecimento)}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    isMercadoFavorito(estabelecimento)
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500'
                                  }`}
                                  title={isMercadoFavorito(estabelecimento) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                >
                                  <i className={`fa-solid fa-heart text-lg ${isMercadoFavorito(estabelecimento) ? 'text-red-500' : 'text-gray-400'}`}></i>
                                </button>
                                <button 
                                  onClick={() => {
                                    const novoId = Math.max(...listaCompras.map(item => item.id), 0) + 1;
                                    setListaCompras(prev => [...prev, {
                                      id: novoId,
                                      name: produtoAtual,
                                      category: "Comparação",
                                      quantity: 1,
                                      price: estabelecimento.price,
                                      checked: false,
                                      store: estabelecimento.store
                                    }]);
                                  }}
                                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                    isMelhorPreco
                                      ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                                  }`}
                                >
                                  <i className="fa-solid fa-plus"></i>
                                  Adicionar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {estabelecimentosOrdenados.length === 0 && (
                    <div className="text-center py-12">
                      {mostrarFavoritos && mercadosFavoritos.length > 0 ? (
                        <>
                          <i className="fa-solid fa-heart text-4xl text-red-400 mb-4"></i>
                          <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            Nenhum mercado favorito tem este produto
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            O produto <strong>"{produtoAtual}"</strong> não está disponível nos seus {mercadosFavoritos.length} mercados favoritos em <strong>{cidadeSelecionada}</strong>
                          </p>
                          <button
                            onClick={() => setMostrarFavoritos(false)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                          >
                            <i className="fa-solid fa-eye mr-2"></i>
                            Ver todos os mercados
                          </button>
                        </>
                      ) : pesquisaProduto.trim() ? (
                        <>
                          <i className="fa-solid fa-search text-4xl text-gray-400 mb-4"></i>
                          <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            Produto não encontrado
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Não encontramos <strong>"{pesquisaProduto}"</strong> em <strong>{cidadeSelecionada}</strong>
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                              <i className="fa-solid fa-lightbulb mr-1"></i>
                              Produtos disponíveis em {cidadeSelecionada}:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {Object.keys(PRODUTOS_COMPARACAO[estadoSelecionado]?.[cidadeSelecionada] || {}).slice(0, 6).map(produto => (
                                <button
                                  key={produto}
                                  onClick={() => setPesquisaProduto(produto)}
                                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                                >
                                  {produto}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-search text-4xl text-gray-400 mb-4"></i>
                          <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            Pesquise um produto para comparar preços
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Digite o nome do produto no campo acima para ver os melhores preços em <strong>{cidadeSelecionada}</strong>
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Contribuir Preços */}
              {abaAtiva === 'contribuir' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Ajude nosso banco de preços
                    </h3>
                    <button
                      onClick={() => setTutorialAberto(true)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                    >
                      <i className="fa-solid fa-question-circle"></i>
                      Como funciona?
                    </button>
                  </div>

                  {/* Configurações Padrão */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Endereço Padrão */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <i className="fa-solid fa-map-marker-alt text-white"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                            Sua Localização Padrão
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Para auto-completar suas contribuições
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                            Estado
                          </label>
                          <select
                            value={estadoContribuicao}
                            onChange={(e) => {
                              setEstadoContribuicao(e.target.value);
                              const cidadesDoEstado = ESTADOS_CIDADES[e.target.value]?.cidades || [];
                              if (cidadesDoEstado.length > 0) {
                                setCidadeContribuicao(cidadesDoEstado[0]);
                              }
                            }}
                            className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            {Object.entries(ESTADOS_CIDADES).map(([sigla, estado]) => (
                              <option key={sigla} value={sigla}>
                                {estado.nome} ({sigla})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                            Cidade
                          </label>
                          <select
                            value={cidadeContribuicao}
                            onChange={(e) => setCidadeContribuicao(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            {(ESTADOS_CIDADES[estadoContribuicao]?.cidades || []).map(cidade => (
                              <option key={cidade} value={cidade}>
                                {cidade}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                          <i className="fa-solid fa-info-circle mr-1"></i>
                          Esta localização será usada automaticamente em suas contribuições
                        </div>
                      </div>
                    </div>

                    {/* Mercados Favoritos */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-600 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <i className="fa-solid fa-heart text-white"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800 dark:text-red-200">
                            Mercados Favoritos
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Clique para auto-completar a loja
                          </p>
                        </div>
                      </div>
                      
                      {mercadosFavoritos.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {mercadosFavoritos.slice(0, 5).map((mercado) => (
                            <button
                              key={mercado.id}
                              onClick={() => {
                                setLojaContribuicao(mercado.nome);
                                setEnderecoContribuicao(mercado.endereco);
                                setEstadoContribuicao(mercado.estado);
                                setCidadeContribuicao(mercado.cidade);
                              }}
                              className="w-full text-left p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <i className="fa-solid fa-store text-red-500 text-xs"></i>
                                <div>
                                  <div className="font-medium text-red-800 dark:text-red-200 text-sm">
                                    {mercado.nome}
                                  </div>
                                  <div className="text-xs text-red-600 dark:text-red-400">
                                    {mercado.cidade} - {mercado.estado}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                          {mercadosFavoritos.length > 5 && (
                            <div className="text-xs text-center text-red-600 dark:text-red-400">
                              +{mercadosFavoritos.length - 5} mercados salvos
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="fa-solid fa-heart-crack text-2xl text-red-400 mb-2"></i>
                          <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                            Nenhum mercado favoritado
                          </p>
                          <p className="text-xs text-red-500 dark:text-red-500">
                            Vá em "Comparar Preços" e favorite alguns mercados!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explicação Breve */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-600 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-users text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Como Contribuir
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          3 passos simples para ajudar a comunidade
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <i className="fa-solid fa-camera text-blue-500"></i>
                        1. Escaneie o código de barras
                      </div>
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <i className="fa-solid fa-dollar-sign text-purple-500"></i>
                        2. Confirme o preço encontrado
                      </div>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <i className="fa-solid fa-share text-green-500"></i>
                        3. Compartilhe com a comunidade
                      </div>
                    </div>
                  </div>

                  {/* Scanner de Código de Barras */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-barcode text-blue-500"></i>
                      Scanner de Código de Barras
                    </h4>
                    
                    {!cameraAtiva && !codigoBarras && (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-camera text-3xl text-blue-500"></i>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Posicione o código de barras do produto na frente da câmera
                        </p>
                        <button
                          onClick={iniciarCamera}
                          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                        >
                          <i className="fa-solid fa-camera"></i>
                          Iniciar Scanner
                        </button>
                      </div>
                    )}

                    {cameraAtiva && (
                      <div className="text-center py-8">
                        <div className="relative mx-auto mb-4">
                          <div className="w-64 h-48 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-4 border-2 border-white rounded-lg opacity-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                            <i className="fa-solid fa-camera text-white text-4xl"></i>
                          </div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              Escaneando...
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Posicione o código de barras dentro do quadro
                        </p>
                        <button
                          onClick={() => setCameraAtiva(false)}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {codigoBarras && !cameraAtiva && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-check text-white text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              Código escaneado com sucesso!
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              EAN/GTIN: {codigoBarras}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCodigoBarras("");
                            setCameraAtiva(false);
                          }}
                          className="text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 underline"
                        >
                          Escanear outro código
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Formulário de Contribuição */}
                  {codigoBarras && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-edit text-purple-500"></i>
                        Informações do Produto
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preço Encontrado *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={precoContribuicao}
                              onChange={(e) => setPrecoContribuicao(e.target.value)}
                              placeholder="0,00"
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome da Loja *
                          </label>
                          <input
                            type="text"
                            value={lojaContribuicao}
                            onChange={(e) => setLojaContribuicao(e.target.value)}
                            placeholder="Ex: Carrefour, Pão de Açúcar..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Endereço da Loja (opcional)
                        </label>
                        <input
                          type="text"
                          value={enderecoContribuicao}
                          onChange={(e) => setEnderecoContribuicao(e.target.value)}
                          placeholder="Ex: Av. Paulista, 1000"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 O endereço ajuda outros usuários a encontrarem a loja mais facilmente
                        </p>
                      </div>

                      {/* Localização (readonly, pré-preenchida) */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fa-solid fa-map-marker-alt text-green-500"></i>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            Localização: {cidadeContribuicao} - {ESTADOS_CIDADES[estadoContribuicao]?.nome}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Usando sua localização padrão. Altere acima se necessário.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={enviarContribuicao}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-paper-plane"></i>
                          Enviar Contribuição
                        </button>
                        <button
                          onClick={() => {
                            setCodigoBarras("");
                            setPrecoContribuicao("");
                            setLojaContribuicao("");
                            setEnderecoContribuicao("");
                          }}
                          className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Estado Inicial */}
                  {!codigoBarras && !cameraAtiva && (
                    <div className="text-center py-8">
                      <i className="fa-solid fa-barcode text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                        Comece escaneando um código de barras
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use a câmera do seu dispositivo para escanear o código EAN/GTIN do produto
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo da Lista */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumo da Lista
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Itens:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{listaCompras.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Concluídos:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {listaCompras.filter(item => item.checked).length}
                  </span>
                </div>
                <hr className="border-gray-200 dark:border-gray-600" />
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Total:</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                    R$ {totalCompras.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categorias
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIAS.map(categoria => (
                  <div key={categoria.name} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <i className={`fa-solid ${categoria.icon} text-gray-600 dark:text-gray-400`}></i>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {categoria.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {categoria.items} produtos
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spacing for mobile */}
        <div className="h-16"></div>
      </div>

      {/* Tutorial Offcanvas */}
      {tutorialAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{zIndex: 110}}>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-graduation-cap text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Tutorial de Contribuição</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Como contribuir com preços</p>
                  </div>
                </div>
                <button
                  onClick={() => setTutorialAberto(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                </button>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Passo 1 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Encontre um Produto
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Vá ao mercado e encontre um produto com código de barras visível.
                      </p>
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          💡 Dica: Procure por códigos EAN-13 (13 dígitos) ou UPC (12 dígitos)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        Escaneie o Código
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                        Use o scanner para capturar o código de barras do produto.
                      </p>
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2">
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          📱 Mantenha o celular estável e bem iluminado
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Informe o Preço
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Digite o preço, nome da loja e sua localização atual.
                      </p>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded p-2">
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✅ A localização é essencial - preços variam por região
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-600 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-gift text-orange-500"></i>
                    Por que Contribuir?
                  </h4>
                  <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-heart text-red-500 text-xs"></i>
                      Ajude outros usuários a economizar
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-database text-blue-500 text-xs"></i>
                      Melhore nossa base de dados
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-trophy text-yellow-500 text-xs"></i>
                      Ganhe pontos e badges especiais
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-users text-green-500 text-xs"></i>
                      Fortaleça a comunidade CatButler
                    </li>
                  </ul>
                </div>

                {/* Requisitos Técnicos */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-info-circle text-gray-500"></i>
                    Requisitos
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-camera text-gray-400 text-xs"></i>
                      Câmera do dispositivo funcional
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-wifi text-gray-400 text-xs"></i>
                      Conexão com internet estável
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fa-solid fa-shield-alt text-gray-400 text-xs"></i>
                      Permissão de acesso à câmera
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setTutorialAberto(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  Entendi, vamos começar!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[500px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-shopping-cart text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Consultor de Compras</h3>
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
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {/* Banner de aviso para visitantes */}
              {isVisitorMode && conversas.length === 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-600 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-info text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Modo Visitante - {4 - monthlyMessages} mensagens mensais restantes
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        <button
                          onClick={() => window.location.href = '/criar-conta'}
                          className="underline hover:no-underline font-medium"
                        >
                          Criar conta para conversas ilimitadas sobre compras!
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {conversas.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400">
                    Como posso ajudar com suas compras hoje?
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversas.map(conversa => (
                    <div key={conversa.id} className={`flex gap-3 ${conversa.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                      {conversa.tipo === 'assistente' && (
                        <div className="w-8 h-8 bg-green-500 rounded-full grid place-items-center flex-shrink-0">
                          <i className="fa-solid fa-shopping-cart text-white text-sm"></i>
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        conversa.tipo === 'usuario' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm">{conversa.texto}</p>
                      </div>
                      {conversa.tipo === 'usuario' && (
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full grid place-items-center flex-shrink-0">
                          <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-sm"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
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
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!mensagem.trim()}
                >
                  <i className="fa-solid fa-paper-plane"></i>
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