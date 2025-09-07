import React, { useState } from "react";

export default function FaxinaIA() {
  // Estados principais
  const [abaAtiva, setAbaAtiva] = useState('planejador');
  const [tamanhoCasa, setTamanhoCasa] = useState('');
  const [rotina, setRotina] = useState('');
  const [cronograma, setCronograma] = useState([]);
  const [lembretes, setLembretes] = useState([]);
  const [superficieSelecionada, setSuperficieSelecionada] = useState('');
  const [sustentabilidade, setSustentabilidade] = useState({
    aguaEconomizada: 0,
    energiaEconomizada: 0,
    produtosEco: 0
  });
  const [slideAmbientes, setSlideAmbientes] = useState(0);
  const [sustentabilidadeSelecionada, setSustentabilidadeSelecionada] = useState({
    agua: [],
    energia: [],
    produtos: [],
    upcycling: []
  });

  // Abas do sistema de limpeza
  const abas = [
    { id: 'planejador', nome: 'Planejador Inteligente', icone: 'fa-bullseye' },
    { id: 'produtos', nome: 'Guia de Produtos', icone: 'fa-spray-can' },
    { id: 'ambientes', nome: 'Análise por Ambiente', icone: 'fa-home' },
    { id: 'sustentabilidade', nome: 'Sustentabilidade', icone: 'fa-leaf' }
  ];

  // Dados de configuração
  const tamanhosCasa = [
    { id: 'pequena', nome: 'Pequena (1-2 cômodos)', fator: 0.5 },
    { id: 'media', nome: 'Média (3-4 cômodos)', fator: 1.0 },
    { id: 'grande', nome: 'Grande (5+ cômodos)', fator: 1.5 }
  ];

  const rotinas = [
    { id: 'ocupada', nome: 'Muito Ocupada', frequencia: 'semanal' },
    { id: 'normal', nome: 'Normal', frequencia: 'diaria' },
    { id: 'disponivel', nome: 'Disponível', frequencia: 'intensiva' }
  ];

  // Cômodos com checklists específicos
  const comodos = [
    { 
      id: 'cozinha', 
      nome: 'Cozinha', 
      icone: 'fa-utensils', 
      frequencia: 'Diária',
      manutencao: 'Limpeza profunda semanal',
      produtos: ['Detergente', 'Desengordurante', 'Água sanitária'],
      checklist: [
        'Limpar bancada e pia',
        'Limpar fogão e forno',
        'Organizar geladeira',
        'Limpar chão',
        'Verificar validade dos alimentos'
      ]
    },
    { 
      id: 'banheiro', 
      nome: 'Banheiro', 
      icone: 'fa-shower', 
      frequencia: 'Diária',
      manutencao: 'Desinfecção semanal',
      produtos: ['Água sanitária', 'Desinfetante', 'Creme de limpeza'],
      checklist: [
        'Limpar vaso sanitário',
        'Limpar box/chuveiro',
        'Limpar pia e espelho',
        'Limpar chão',
        'Verificar ventilação'
      ]
    },
    { 
      id: 'quarto', 
      nome: 'Quarto', 
      icone: 'fa-bed', 
      frequencia: 'Semanal',
      manutencao: 'Aspiração de colchão mensal',
      produtos: ['Aspirador', 'Pano úmido', 'Desinfetante'],
      checklist: [
        'Arrumar cama',
        'Organizar roupas',
        'Aspirar chão',
        'Limpar móveis',
        'Ventilar ambiente'
      ]
    },
    { 
      id: 'sala', 
      nome: 'Sala', 
      icone: 'fa-couch', 
      frequencia: 'Semanal',
      manutencao: 'Limpeza de estofados trimestral',
      produtos: ['Aspirador', 'Pano úmido', 'Protetor de tecido'],
      checklist: [
        'Aspirar sofás',
        'Limpar mesas',
        'Organizar objetos',
        'Aspirar chão',
        'Limpar janelas'
      ]
    }
  ];

  // Superfícies com recomendações específicas
  const superficies = [
    { 
      id: 'madeira', 
      nome: 'Madeira', 
      icone: '🪵',
      produtos: ['Óleo de limão', 'Cera de abelha', 'Vinagre branco'],
      tecnicas: [
        'Limpe com pano úmido',
        'Seque imediatamente',
        'Aplique cera mensalmente',
        'Evite produtos abrasivos'
      ],
      substituicoes: ['Azeite + limão', 'Cera de carnaúba', 'Óleo de coco'],
      economia: 'Use panos de microfibra para reduzir produtos'
    },
    { 
      id: 'vidro', 
      nome: 'Vidro', 
      icone: '🪟',
      produtos: ['Álcool 70%', 'Detergente', 'Creme de limpeza'],
      tecnicas: [
        'Limpe em movimentos circulares',
        'Use papel jornal',
        'Seque com pano macio',
        'Evite produtos com amônia'
      ],
      substituicoes: ['Vinagre + água', 'Cascas de limão', 'Bicarbonato'],
      economia: 'Reutilize garrafas de spray'
    },
    { 
      id: 'ceramica', 
      nome: 'Cerâmica', 
      icone: 'fa-cube',
      produtos: ['Água sanitária', 'Desinfetante', 'Creme de limpeza'],
      tecnicas: [
        'Ventile o ambiente',
        'Use luvas',
        'Enxágue abundantemente',
        'Seque completamente'
      ],
      substituicoes: ['Bicarbonato + vinagre', 'Óleo essencial tea tree', 'Sabão de Marselha'],
      economia: 'Use esponjas reutilizáveis'
    }
  ];

  // Dicas de sustentabilidade
  const dicasSustentabilidade = [
    {
      categoria: 'Água',
      dicas: [
        'Use balde em vez de mangueira',
        'Reutilize água da chuva',
        'Feche torneiras durante limpeza',
        'Use produtos concentrados'
      ]
    },
    {
      categoria: 'Energia',
      dicas: [
        'Use aspirador com filtro HEPA',
        'Lave roupas com água fria',
        'Seque roupas no varal',
        'Use lâmpadas LED'
      ]
    },
    {
      categoria: 'Produtos',
      dicas: [
        'Faça produtos caseiros',
        'Use embalagens reutilizáveis',
        'Compre a granel',
        'Recicle embalagens'
      ]
    },
    {
      categoria: 'Upcycling',
      dicas: [
        'Transforme garrafas em organizadores',
        'Use caixas como prateleiras',
        'Reutilize roupas como panos',
        'Crie decoração com objetos antigos'
      ]
    }
  ];

  // Função para gerar cronograma personalizado
  const gerarCronograma = () => {
    if (!tamanhoCasa || !rotina) return;
    
    const fatorTamanho = tamanhosCasa.find(t => t.id === tamanhoCasa)?.fator || 1;
    
    const novoCronograma = comodos.map(comodo => {
      let prioridade = 'Baixa';
      if (comodo.id === 'banheiro') prioridade = 'Alta';
      else if (comodo.id === 'cozinha') prioridade = 'Média';
      
      return {
        id: comodo.id,
        nome: comodo.nome,
        frequencia: comodo.frequencia,
        tempoEstimado: Math.round(comodo.checklist.length * 5 * fatorTamanho),
        prioridade,
        proximaExecucao: new Date().toISOString().split('T')[0]
      };
    });
    
    setCronograma(novoCronograma);
  };

  // Função para adicionar lembrete
  const adicionarLembrete = (tarefa) => {
    const novoLembrete = {
      id: Date.now(),
      tarefa: tarefa,
      data: new Date().toISOString().split('T')[0],
      horario: '09:00',
      repetir: 'diario'
    };
    setLembretes([...lembretes, novoLembrete]);
  };

  // Função para analisar impacto de sustentabilidade
  const analisarImpactoSustentabilidade = () => {
    let agua = 0;
    let energia = 0;
    let produtos = 0;

    // Calcular impacto baseado nas seleções
    Object.values(sustentabilidadeSelecionada).forEach(selecoes => {
      if (Array.isArray(selecoes) && selecoes.length > 0) {
        // Simular cálculo de impacto (aqui você pode integrar com IA)
        agua += Math.floor(Math.random() * 50) + 10;
        energia += Math.floor(Math.random() * 20) + 5;
        produtos += Math.floor(Math.random() * 3) + 1;
      }
    });

    setSustentabilidade({
      aguaEconomizada: agua,
      energiaEconomizada: energia,
      produtosEco: produtos
    });
  };

  // Função para lidar com mudança de checkbox
  const handleCheckboxChange = (categoria, dica, checked) => {
    const categoriaKey = categoria.toLowerCase();
    setSustentabilidadeSelecionada(prev => {
      const currentSelecoes = prev[categoriaKey] || [];
      if (checked) {
        return {
          ...prev,
          [categoriaKey]: [...currentSelecoes, dica]
        };
      } else {
        return {
          ...prev,
          [categoriaKey]: currentSelecoes.filter(item => item !== dica)
        };
      }
    });
  };

  // Função para renderizar item de sustentabilidade
  const renderizarItemSustentabilidade = (categoria, dica, dicaIndex) => {
    const categoriaKey = categoria.categoria.toLowerCase();
    const selecoes = sustentabilidadeSelecionada[categoriaKey] || [];
    
    return (
      <label key={`${categoria.categoria}-${dicaIndex}`} className="flex items-start gap-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/30 p-1.5 rounded transition-colors">
        <input
          type="checkbox"
          value={dica}
          checked={selecoes.includes(dica)}
          onChange={(e) => handleCheckboxChange(categoria.categoria, dica, e.target.checked)}
          className="mt-0.5 text-green-600 focus:ring-green-500 rounded"
        />
        <span className="text-xs text-gray-800 dark:text-gray-100 leading-tight">{dica}</span>
      </label>
    );
  };

  // Função para renderizar categoria de sustentabilidade
  const renderizarCategoriaSustentabilidade = (categoria) => (
    <div key={categoria.categoria} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-500/30 max-h-80 overflow-y-auto">
      <h4 className="font-semibold text-green-800 dark:text-green-100 text-sm mb-2">{categoria.categoria}:</h4>
      <div className="space-y-1">
        {categoria.dicas.map((dica, dicaIndex) => 
          renderizarItemSustentabilidade(categoria, dica, dicaIndex)
        )}
      </div>
    </div>
  );

  // Função para renderizar conteúdo da aba ativa
  const renderizarConteudoAba = () => {
    switch (abaAtiva) {
      case 'planejador':
        return renderizarPlanejador();
      case 'produtos':
        return renderizarProdutos();
      case 'ambientes':
        return renderizarAmbientes();
      case 'sustentabilidade':
        return renderizarSustentabilidade();
      default:
        return renderizarPlanejador();
    }
  };

  // Renderizar Planejador Inteligente
  const renderizarPlanejador = () => (
    <div className="space-y-6">
      {/* Layout em duas colunas: Configuração à esquerda, Cronograma à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração Personalizada */}
        <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-indigo-200 dark:bg-indigo-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-cog text-white text-sm"></i>
            </div>
            Configuração Personalizada
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="tamanho-casa" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tamanho da Casa:
              </label>
              <select
                id="tamanho-casa"
                value={tamanhoCasa}
                onChange={(e) => setTamanhoCasa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="" className="text-gray-900 dark:text-white">Selecione o tamanho</option>
                {tamanhosCasa.map(tamanho => (
                  <option key={tamanho.id} value={tamanho.id} className="text-gray-900 dark:text-white">
                    {tamanho.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="rotina" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Rotina:
              </label>
              <select
                id="rotina"
                value={rotina}
                onChange={(e) => setRotina(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="" className="text-gray-900 dark:text-white">Selecione sua rotina</option>
                {rotinas.map(rotina => (
                  <option key={rotina.id} value={rotina.id} className="text-gray-900 dark:text-white">
                    {rotina.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={gerarCronograma}
              disabled={!tamanhoCasa || !rotina}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
            >
              Gerar Cronograma Personalizado
            </button>
          </div>
        </section>

        {/* Cronograma Inteligente - Aparece apenas quando gerado */}
        {cronograma.length > 0 && (
          <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-200 dark:bg-emerald-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
              <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-calendar text-white text-sm"></i>
              </div>
              Cronograma Inteligente
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cronograma.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.nome}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (() => {
                        if (item.prioridade === 'Alta') return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
                        if (item.prioridade === 'Média') return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
                        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
                      })()
                    }`}>
                      {item.prioridade}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Frequência: {item.frequencia}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Tempo: {item.tempoEstimado}min
                  </div>
                  <button
                    onClick={() => adicionarLembrete(item.nome)}
                    className="w-full px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                  >
                    Adicionar Lembrete
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lembretes Automáticos - Aparece abaixo quando há lembretes */}
      {lembretes.length > 0 && (
        <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-200 dark:border-gray-600 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 dark:bg-yellow-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-orange-200 dark:bg-orange-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⏰</span>
            </div>
            Lembretes Automáticos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lembretes.map(lembrete => (
              <div key={lembrete.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-500/30">
                <div className="font-medium text-orange-800 dark:text-orange-100 text-sm">{lembrete.tarefa}</div>
                <div className="text-xs text-orange-600 dark:text-orange-300">
                  {lembrete.data} às {lembrete.horario} • {lembrete.repetir}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Renderizar Guia de Produtos e Técnicas
  const renderizarProdutos = () => (
    <div className="space-y-6">
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-pink-200 dark:bg-pink-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-spray-can text-white text-sm"></i>
          </div>
          Guia de Produtos e Técnicas
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="superficie" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Selecione a Superfície:
            </label>
            <select
              id="superficie"
              value={superficieSelecionada}
              onChange={(e) => setSuperficieSelecionada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="" className="text-gray-900 dark:text-white">Selecione uma superfície</option>
              {superficies.map(superficie => (
                <option key={superficie.id} value={superficie.id} className="text-gray-900 dark:text-white">
                  {superficie.icone} {superficie.nome}
                </option>
              ))}
            </select>
          </div>
          
          {superficieSelecionada && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {superficies.find(s => s.id === superficieSelecionada) && (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-100 text-sm mb-3">Produtos Recomendados:</h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-2">
                      {superficies.find(s => s.id === superficieSelecionada).produtos.map((produto) => (
                        <li key={produto}>• {produto}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-500/30 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-green-800 dark:text-green-100 text-sm mb-3">Técnicas Passo a Passo:</h4>
                    <ul className="text-xs text-green-700 dark:text-green-200 space-y-2">
                      {superficies.find(s => s.id === superficieSelecionada).tecnicas.map((tecnica, index) => (
                        <li key={`${superficieSelecionada}-tecnica-${index}`}>{index + 1}. {tecnica}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-500/30 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-100 text-sm mb-3">Substituições Caseiras:</h4>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-200 space-y-2">
                      {superficies.find(s => s.id === superficieSelecionada).substituicoes.map((substituicao) => (
                        <li key={substituicao}>• {substituicao}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-500/30 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-100 text-sm mb-3">Dica de Economia:</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-200">
                      {superficies.find(s => s.id === superficieSelecionada).economia}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );

  // Função para renderizar card de cômodo
  const renderizarCardComodo = (comodo) => (
    <div key={comodo.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 max-h-80 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
          <i className={`fa-solid ${comodo.icone}`}></i> {comodo.nome}
        </h4>
        <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
          {comodo.frequencia}
        </span>
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        <strong>Manutenção:</strong> {comodo.manutencao}
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        <strong>Produtos:</strong> {comodo.produtos.join(', ')}
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400">
        <strong>Checklist:</strong>
        <ul className="mt-2 space-y-1">
          {comodo.checklist.map((item, index) => (
            <li key={`${comodo.id}-checklist-${index}`}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Renderizar Análise por Ambiente
  const renderizarAmbientes = () => {
    const cardsPorSlide = 3;
    const totalSlides = Math.ceil(comodos.length / cardsPorSlide);

    const proximoSlide = () => {
      setSlideAmbientes((prev) => (prev + 1) % totalSlides);
    };

    const slideAnterior = () => {
      setSlideAmbientes((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
      <div className="space-y-6">
        <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-teal-200 dark:bg-teal-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-home text-white text-sm"></i>
              </div>
              Análise por Ambiente
            </h3>
            <div className="flex gap-2">
              <button
                onClick={slideAnterior}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ←
              </button>
              <button
                onClick={proximoSlide}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                →
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${slideAmbientes * 100}%)` }}>
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={`slide-${slideIndex}`} className="w-full flex-shrink-0 px-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {comodos
                      .slice(slideIndex * cardsPorSlide, (slideIndex + 1) * cardsPorSlide)
                      .map(renderizarCardComodo)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de slide */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => setSlideAmbientes(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  slideAmbientes === index 
                    ? 'bg-orange-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };


  // Renderizar Sustentabilidade
  const renderizarSustentabilidade = () => (
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-800 dark:to-gray-700 border border-emerald-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200 dark:bg-emerald-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-200 dark:bg-green-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-leaf text-white text-sm"></i>
            </div>
            Sustentabilidade
          </h3>
          <button
            onClick={analisarImpactoSustentabilidade}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold text-sm"
          >
            Analisar
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {dicasSustentabilidade.map((categoria) => renderizarCategoriaSustentabilidade(categoria))}
        </div>
        
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-500/30">
          <h4 className="font-semibold text-purple-800 dark:text-purple-100 text-sm mb-2">Impacto Positivo:</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{sustentabilidade.aguaEconomizada}</div>
              <div className="text-xs text-blue-800 dark:text-blue-100">L Água</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{sustentabilidade.energiaEconomizada}</div>
              <div className="text-xs text-green-800 dark:text-green-100">kWh Energia</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{sustentabilidade.produtosEco}</div>
              <div className="text-xs text-purple-800 dark:text-purple-100">Produtos Eco</div>
            </div>
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
            <i className="fa-solid fa-broom text-orange-600 dark:text-orange-400"></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Faxina com IA</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Limpeza inteligente e sustentável</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            {cronograma.length} tarefas
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">agendadas</div>
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  abaAtiva === aba.id
                    ? 'bg-orange-500 text-white shadow-md'
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