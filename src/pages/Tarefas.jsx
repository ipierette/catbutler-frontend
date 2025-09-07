import React, { useState } from "react";

export default function Tarefas() {
  const [tarefas] = useState([
    {
      id: 1,
      titulo: "Limpar a cozinha",
      descricao: "Lavar louça, limpar bancada e organizar geladeira",
      categoria: "Faxina",
      prioridade: "Alta",
      status: "Pendente",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-16"
    },
    {
      id: 2,
      titulo: "Fazer compras no mercado",
      descricao: "Comprar ingredientes para o jantar de hoje",
      categoria: "Compras",
      prioridade: "Média",
      status: "Em Andamento",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-15"
    },
    {
      id: 3,
      titulo: "Preparar receita de carbonara",
      descricao: "Seguir receita do CatButler para jantar",
      categoria: "Cozinha",
      prioridade: "Baixa",
      status: "Concluída",
      dataCriacao: "2025-01-14",
      dataVencimento: "2025-01-15"
    },
    {
      id: 4,
      titulo: "Organizar escritório",
      descricao: "Arrumar documentos e limpar mesa de trabalho",
      categoria: "Organização",
      prioridade: "Média",
      status: "Pendente",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-17"
    },
    {
      id: 5,
      titulo: "Fazer exercícios",
      descricao: "Treino de 30 minutos na academia",
      categoria: "Saúde",
      prioridade: "Alta",
      status: "Em Andamento",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-16"
    },
    {
      id: 6,
      titulo: "Ler livro técnico",
      descricao: "Capítulos 3 e 4 do livro de React",
      categoria: "Estudos",
      prioridade: "Baixa",
      status: "Pendente",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-19"
    },
    {
      id: 7,
      titulo: "Reunião com cliente",
      descricao: "Apresentar proposta de projeto",
      categoria: "Trabalho",
      prioridade: "Alta",
      status: "Concluída",
      dataCriacao: "2025-01-14",
      dataVencimento: "2025-01-14"
    },
    {
      id: 8,
      titulo: "Pagar contas",
      descricao: "Contas de luz, água e internet",
      categoria: "Financeiro",
      prioridade: "Alta",
      status: "Pendente",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-18"
    },
    {
      id: 9,
      titulo: "Plantar mudas",
      descricao: "Cuidar do jardim e plantar novas mudas",
      categoria: "Lazer",
      prioridade: "Baixa",
      status: "Em Andamento",
      dataCriacao: "2025-01-15",
      dataVencimento: "2025-01-20"
    }
  ]);

  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const tarefasPorPagina = 6;

  const categorias = ["Todas", "Faxina", "Cozinha", "Compras", "Organização", "Saúde", "Estudos", "Trabalho", "Financeiro", "Lazer", "Outros"];
  const status = ["Todas", "Pendente", "Em Andamento", "Concluída"];

  const tarefasFiltradas = tarefas.filter(tarefa => {
    const matchStatus = filtroStatus === "Todas" || tarefa.status === filtroStatus;
    const matchCategoria = filtroCategoria === "Todas" || tarefa.categoria === filtroCategoria;
    const matchBusca = busca === "" || 
      tarefa.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      tarefa.descricao.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchCategoria && matchBusca;
  });

  // Lógica de paginação
  const totalPaginas = Math.ceil(tarefasFiltradas.length / tarefasPorPagina);
  const indiceInicial = (paginaAtual - 1) * tarefasPorPagina;
  const indiceFinal = indiceInicial + tarefasPorPagina;
  const tarefasPaginadas = tarefasFiltradas.slice(indiceInicial, indiceFinal);

  // Reset da página quando filtros mudam
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [filtroStatus, filtroCategoria, busca]);

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case "Alta": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "Média": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Baixa": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pendente": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "Em Andamento": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "Concluída": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-4 max-w-7xl mx-auto">
      {/* Hero Section - Mais compacto */}
      <section className="relative flex items-center justify-between w-full mx-auto glass-effect rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500 h-16 sm:h-18">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <i className="fa-solid fa-clipboard-list text-xl sm:text-2xl text-green-600 dark:text-green-400" aria-label="tarefas"></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              <span className="visitante-span">Minhas Tarefas</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Organize e gerencie suas tarefas diárias
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tarefasFiltradas.length} tarefa(s) encontrada(s) - Página {paginaAtual} de {totalPaginas}
          </p>
        </div>
      </section>

      {/* Ações Rápidas - Mais compactas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full mx-auto mb-3 sm:mb-4">
        <button 
          onClick={() => alert('Funcionalidade em desenvolvimento')}
          className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-2xl">➕</span>
          <span className="font-semibold text-sm">Nova Tarefa</span>
        </button>
        
        <button className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
          <i className="fa-solid fa-search text-xl"></i>
          <span className="font-semibold text-sm">Buscar</span>
        </button>
        
        <button className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
          <i className="fa-solid fa-chart-bar text-xl"></i>
          <span className="font-semibold text-sm">Relatórios</span>
        </button>
        
        <button className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
          <i className="fa-solid fa-cog text-xl"></i>
          <span className="font-semibold text-sm">Configurar</span>
        </button>
      </section>

      {/* Filtros e Busca - Mais compactos */}
      <section className="glass-effect rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 fade-in-up bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="busca-tarefas" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Buscar
            </label>
            <input
              id="busca-tarefas"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite para buscar..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="filtro-status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="filtro-status"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            >
              {status.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filtro-categoria" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              id="filtro-categoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            >
              {categorias.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => {
                setBusca("");
                setFiltroStatus("Todas");
                setFiltroCategoria("Todas");
              }}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-200"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Galeria Vertical de Tarefas */}
      <section className="relative">
        {tarefasPaginadas.length === 0 ? (
          <div className="glass-effect rounded-xl shadow-lg p-8 text-center fade-in-up bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-200 dark:bg-blue-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <div className="text-6xl mb-4 relative z-10">
              <i className="fa-solid fa-clipboard-list text-gray-400"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10">
              {busca || filtroStatus !== "Todas" || filtroCategoria !== "Todas"
                ? "Tente ajustar os filtros de busca"
                : "Comece criando sua primeira tarefa"
              }
            </p>
            <button
              onClick={() => alert('Funcionalidade em desenvolvimento')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10"
            >
              Criar Primeira Tarefa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tarefasPaginadas.map((tarefa, index) => (
              <div
                key={tarefa.id}
                className="glass-effect rounded-xl shadow-lg p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group cursor-pointer relative overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Elementos decorativos de fundo */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-4 translate-x-4 opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-green-200 dark:bg-green-600 rounded-full translate-y-3 -translate-x-3 opacity-30"></div>
                {/* Header da Tarefa */}
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tarefa.titulo}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(tarefa.status)}`}>
                        {tarefa.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPrioridadeColor(tarefa.prioridade)}`}>
                        {tarefa.prioridade}
                      </span>
                    </div>
                  </div>
                  
                  {/* Menu de Ações */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                      title="Editar"
                    >
                      <i className="fa-solid fa-edit text-sm"></i>
                    </button>
                    <button 
                      className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                      title="Concluir"
                    >
                      <i className="fa-solid fa-check text-sm"></i>
                    </button>
                    <button 
                      className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      title="Excluir"
                    >
                      <i className="fa-solid fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {tarefa.descricao}
                </p>

                {/* Footer da Tarefa */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-folder text-gray-400"></i>
                    <span className="font-medium">{tarefa.categoria}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-calendar text-gray-400"></i>
                    <span className="font-medium">{new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Indicador de Progresso */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        (() => {
                          if (tarefa.status === 'Concluída') return 'bg-green-500 w-full';
                          if (tarefa.status === 'Em Andamento') return 'bg-blue-500 w-2/3';
                          return 'bg-orange-500 w-1/3';
                        })()
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Controles de Paginação - Horizontal e Compacto */}
      {tarefasFiltradas.length > tarefasPorPagina && (
        <section className="mt-4 flex justify-center">
          <div className="glass-effect rounded-xl shadow-lg p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 w-full max-w-4xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full -translate-y-6 translate-x-6 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-blue-200 dark:bg-blue-600 rounded-full translate-y-4 -translate-x-4 opacity-30"></div>
            <div className="flex items-center justify-between relative z-10">
              {/* Informações da página */}
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, tarefasFiltradas.length)} de {tarefasFiltradas.length} tarefas
              </div>
              
              {/* Controles de navegação */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Anterior</span>
                </button>
                
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                    <button
                      key={numero}
                      onClick={() => setPaginaAtual(numero)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                        paginaAtual === numero
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {numero}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <span>→</span>
                </button>
              </div>
            </div>
      </div>
        </section>
      )}
    </main>
  );
}
