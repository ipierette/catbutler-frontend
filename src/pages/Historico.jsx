import React, { useState, useMemo } from 'react';
import FilterButton from '../components/ui/FilterButton';

// Detecta modo visitante via flag de ambiente
const isVisitorMode = import.meta.env.VITE_VISITOR_MODE === 'true';

// Dados mockados do histórico
const historicoDados = [
  {
    id: 1,
    tipo: 'receita',
    titulo: 'Pasta Carbonara',
    descricao: 'Receita preparada com sucesso',
    categoria: 'cozinha',
    status: 'concluida',
    data: '2025-01-09',
    tempo: '25 min',
    rating: 5
  },
  {
    id: 2,
    tipo: 'compras',
    titulo: 'Lista Semanal',
    descricao: 'Compras do mercado realizadas',
    categoria: 'compras',
    status: 'concluida',
    data: '2025-01-08',
    tempo: '45 min',
    rating: 4
  },
  {
    id: 3,
    tipo: 'limpeza',
    titulo: 'Faxina da Cozinha',
    descricao: 'Limpeza completa realizada',
    categoria: 'faxina',
    status: 'concluida',
    data: '2025-01-08',
    tempo: '30 min',
    rating: 5
  },
  {
    id: 4,
    tipo: 'tarefa',
    titulo: 'Organização do Guarda-roupa',
    descricao: 'Roupas organizadas por categoria',
    categoria: 'organização',
    status: 'concluida',
    data: '2025-01-07',
    tempo: '60 min',
    rating: 4
  },
  {
    id: 5,
    tipo: 'receita',
    titulo: 'Risotto de Camarão',
    descricao: 'Jantar especial preparado',
    categoria: 'cozinha',
    status: 'concluida',
    data: '2025-01-06',
    tempo: '40 min',
    rating: 5
  },
  {
    id: 6,
    tipo: 'assistente',
    titulo: 'Planejamento Semanal',
    descricao: 'Conversa sobre organização',
    categoria: 'planejamento',
    status: 'concluida',
    data: '2025-01-05',
    tempo: '15 min',
    rating: 4
  }
];

const categorias = [
  { value: 'cozinha', label: 'Cozinha', icon: 'fa-solid fa-utensils', color: 'bg-orange-100 text-orange-700' },
  { value: 'compras', label: 'Compras', icon: 'fa-solid fa-shopping-cart', color: 'bg-blue-100 text-blue-700' },
  { value: 'faxina', label: 'Faxina', icon: 'fa-solid fa-broom', color: 'bg-green-100 text-green-700' },
  { value: 'organização', label: 'Organização', icon: 'fa-solid fa-boxes', color: 'bg-purple-100 text-purple-700' },
  { value: 'planejamento', label: 'Planejamento', icon: 'fa-solid fa-calendar-check', color: 'bg-pink-100 text-pink-700' }
];

const tipos = [
  { value: 'receita', label: 'Receitas', icon: 'fa-solid fa-utensils' },
  { value: 'compras', label: 'Compras', icon: 'fa-solid fa-shopping-cart' },
  { value: 'limpeza', label: 'Limpeza', icon: 'fa-solid fa-broom' },
  { value: 'tarefa', label: 'Tarefas', icon: 'fa-solid fa-tasks' },
  { value: 'assistente', label: 'Assistente', icon: 'fa-solid fa-robot' }
];

export default function Historico() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Filtrar dados
  const dadosFiltrados = useMemo(() => {
    let dados = [...historicoDados];
    
    if (selectedCategory) {
      dados = dados.filter(item => item.categoria === selectedCategory);
    }
    
    if (selectedTipo) {
      dados = dados.filter(item => item.tipo === selectedTipo);
    }

    // Filtrar por período
    const hoje = new Date();
    let diasAtras = 90; // padrão
    if (selectedPeriod === '7d') diasAtras = 7;
    else if (selectedPeriod === '30d') diasAtras = 30;
    const dataLimite = new Date(hoje.getTime() - (diasAtras * 24 * 60 * 60 * 1000));
    
    dados = dados.filter(item => new Date(item.data) >= dataLimite);
    
    return dados.sort((a, b) => new Date(b.data) - new Date(a.data));
  }, [selectedCategory, selectedTipo, selectedPeriod]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = dadosFiltrados.length;
    const tempoTotal = dadosFiltrados.reduce((acc, item) => {
      const tempo = parseInt(item.tempo.split(' ')[0]);
      return acc + tempo;
    }, 0);
    const ratingMedio = dadosFiltrados.reduce((acc, item) => acc + item.rating, 0) / total || 0;
    const categoriasMaisUsadas = categorias.map(cat => ({
      ...cat,
      count: dadosFiltrados.filter(item => item.categoria === cat.value).length
    })).sort((a, b) => b.count - a.count);

    return {
      total,
      tempoTotal,
      ratingMedio: ratingMedio.toFixed(1),
      categoriaTop: categoriasMaisUsadas[0]
    };
  }, [dadosFiltrados]);

  // Obter categoria
  const getCategoriaData = (categoria) => {
    return categorias.find(cat => cat.value === categoria);
  };

  // Formatar data
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Render de estrelas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fa-solid fa-star text-xs ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
      ></i>
    ));
  };

  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">      
      {/* Header padronizado */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
            <i className="fa-solid fa-history text-lg sm:text-xl text-purple-600 dark:text-purple-400" aria-label="historico"></i>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Histórico de Atividades
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Acompanhe seu progresso e atividades realizadas
            </p>
          </div>
        </div>
      </div>
      
      {/* Seletor de período */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: '7d', label: '7 dias' },
            { id: '30d', label: '30 dias' },
            { id: '90d', label: '90 dias' }
          ].map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card-glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-blue-600 dark:text-blue-400"></i>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {estatisticas.total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Concluídas</div>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clock text-green-600 dark:text-green-400"></i>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {estatisticas.tempoTotal}min
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tempo Total</div>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-star text-yellow-600 dark:text-yellow-400"></i>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {estatisticas.ratingMedio}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avaliação Média</div>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <i className={`${estatisticas.categoriaTop?.icon} text-purple-600 dark:text-purple-400`}></i>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {estatisticas.categoriaTop?.label || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Mais Usada</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterButton
          label="Categoria"
          icon="fa-solid fa-tags"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categorias.map(cat => ({
            value: cat.value,
            label: cat.label,
            icon: cat.icon,
            count: historicoDados.filter(item => item.categoria === cat.value).length
          }))}
        />

        <FilterButton
          label="Tipo"
          icon="fa-solid fa-filter"
          value={selectedTipo}
          onChange={setSelectedTipo}
          options={tipos.map(tipo => ({
            value: tipo.value,
            label: tipo.label,
            icon: tipo.icon,
            count: historicoDados.filter(item => item.tipo === tipo.value).length
          }))}
        />

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {dadosFiltrados.length} atividade(s) encontrada(s)
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {dadosFiltrados.length === 0 ? (
          <div className="card-glass rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-inbox text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ajuste os filtros ou período para ver mais atividades
            </p>
          </div>
        ) : (
          dadosFiltrados.map((item, index) => {
            const categoriaData = getCategoriaData(item.categoria);
            const isUltimo = index === dadosFiltrados.length - 1;

            return (
              <div key={item.id} className="relative">
                {/* Linha vertical */}
                {!isUltimo && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                )}

                <div className="flex gap-4">
                  {/* Ícone da timeline */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${categoriaData?.color || 'bg-gray-100 text-gray-700'} border-4 border-white dark:border-gray-900 shadow-lg`}>
                      <i className={`${categoriaData?.icon} text-sm`}></i>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 card-glass rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.descricao}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {formatarData(item.data)}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(item.rating)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoriaData?.color || 'bg-gray-100 text-gray-700'}`}>
                          {categoriaData?.label}
                        </span>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <i className="fa-solid fa-clock text-xs"></i>
                          {item.tempo}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <i className="fa-solid fa-check-circle text-sm"></i>
                        <span className="text-sm font-medium">Concluída</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Espaço adicional no final */}
      <div className="h-20"></div>
      
      {/* Overlay para bloquear interações em modo visitante */}
      {isVisitorMode && (
        <>
          {/* Blur apenas na área de conteúdo - z-index menor que sidebar */}
          <div className="fixed top-0 right-0 bottom-0 left-0 lg:left-48 xl:left-56 bg-black/20 backdrop-blur-sm z-30"></div>
          {/* Modal centralizado - z-index maior que sidebar */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div 
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl p-6 m-4 max-w-md border border-purple-200 dark:border-purple-600 pointer-events-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-lock text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Modo Somente Leitura
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Esta é uma visualização do seu histórico de atividades. Para acompanhar e gerenciar seu próprio progresso, crie uma conta gratuita!
                </p>
                <button
                  onClick={() => window.location.href = '/criar-conta'}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
                >
                  Criar Conta Grátis
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}