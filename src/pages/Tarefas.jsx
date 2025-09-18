import React, { useState, useEffect } from "react";
import FilterButton from "../components/ui/FilterButton";
import VisitorModeWrapper from "../components/VisitorModeWrapper";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../contexts/AuthContext";

export default function Tarefas() {
  const { isAuthenticated } = useAuth();
  const { 
    tasks, 
    stats, 
    loading, 
    error, 
    loadTasks, 
    addTask, 
    editTask, 
    removeTask, 
    toggleTaskStatus 
  } = useTasks();

  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const tarefasPorPagina = 6;

  const categorias = ["Todas", "Faxina", "Cozinha", "Compras", "Organização", "Saúde", "Estudos", "Trabalho", "Financeiro", "Lazer", "Outros"];
  const status = ["Todas", "Pendente", "Em Andamento", "Concluída"];

  // Aplicar filtros às tarefas vindas do backend
  const tarefasFiltradas = tasks.filter(tarefa => {
    const matchStatus = filtroStatus === "Todas" || tarefa.status === filtroStatus;
    const matchCategoria = filtroCategoria === "Todas" || tarefa.categoria === filtroCategoria;
    const matchBusca = busca === "" || 
      tarefa.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      tarefa.descricao?.toLowerCase().includes(busca.toLowerCase());
    
    return matchStatus && matchCategoria && matchBusca;
  });

  // Lógica de paginação
  const totalPaginas = Math.ceil(tarefasFiltradas.length / tarefasPorPagina);
  const indiceInicial = (paginaAtual - 1) * tarefasPorPagina;
  const indiceFinal = indiceInicial + tarefasPorPagina;
  const tarefasPaginadas = tarefasFiltradas.slice(indiceInicial, indiceFinal);

  // Recarregar tarefas quando filtros mudarem
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks({
        status: filtroStatus !== "Todas" ? filtroStatus : undefined,
        categoria: filtroCategoria !== "Todas" ? filtroCategoria : undefined,
        busca: busca || undefined
      });
    }
  }, [isAuthenticated, filtroStatus, filtroCategoria, busca, loadTasks]);

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

  const getProgressBarStyle = (status) => {
    switch (status) {
      case 'Concluída': return 'bg-green-500 w-full';
      case 'Em Andamento': return 'bg-blue-500 w-2/3';
      case 'Pendente': return 'bg-orange-500 w-1/3';
      default: return 'bg-gray-300 w-0';
    }
  };

  return (
    <VisitorModeWrapper pageName="as tarefas">
      <div className="h-full overflow-y-auto">
        <div className="p-4 lg:p-6 space-y-6">
          
          {/* Header Moderno */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <i className="fa-solid fa-list-check text-xl text-white"></i>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Tarefas
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Organize suas atividades diárias com eficiência
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="glass-effect rounded-lg p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Total</div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{stats.total_tasks || 0}</div>
              </div>
              <div className="glass-effect rounded-lg p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700">
                <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Pendentes</div>
                <div className="text-xl font-bold text-orange-900 dark:text-orange-100">{stats.pending_tasks || 0}</div>
              </div>
              <div className="glass-effect rounded-lg p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700">
                <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-1">Em Andamento</div>
                <div className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{stats.in_progress_tasks || 0}</div>
              </div>
              <div className="glass-effect rounded-lg p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Concluídas</div>
                <div className="text-xl font-bold text-green-900 dark:text-green-100">{stats.completed_tasks || 0}</div>
              </div>
            </div>
          )}

          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                options={status.map(s => ({ label: s, value: s }))}
                value={filtroStatus === "Todas" ? null : filtroStatus}
                onChange={(value) => setFiltroStatus(value || "Todas")}
                placeholder="Status"
                icon="fa-solid fa-filter"
              />
              
              <FilterButton
                options={categorias.map(c => ({ label: c, value: c }))}
                value={filtroCategoria === "Todas" ? null : filtroCategoria}
                onChange={(value) => setFiltroCategoria(value || "Todas")}
                placeholder="Categoria"
                icon="fa-solid fa-tags"
              />
            </div>

            {/* Nova Tarefa Button */}
            <button
              onClick={() => alert('Modal de criação de tarefa em desenvolvimento')}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base font-medium disabled:opacity-50"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Nova Tarefa
            </button>
          </div>

          {/* Busca */}
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>

          {/* Botão de Limpar Filtros */}
          {(busca || filtroStatus !== "Todas" || filtroCategoria !== "Todas") && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setBusca("");
                  setFiltroStatus("Todas");
                  setFiltroCategoria("Todas");
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Lista de Tarefas */}
          {loading ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Carregando tarefas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
              <p className="text-red-600 dark:text-red-400 mb-4">Erro ao carregar tarefas: {error}</p>
              <button
                onClick={() => loadTasks()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Tentar Novamente
              </button>
            </div>
          ) : tarefasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl mb-6">📝</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {busca || filtroStatus !== "Todas" || filtroCategoria !== "Todas" 
                      ? "Nenhuma tarefa encontrada" 
                      : "Ainda não há tarefas"
                    }
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {busca || filtroStatus !== "Todas" || filtroCategoria !== "Todas"
                      ? "Tente ajustar os filtros para encontrar suas tarefas."
                      : "Crie sua primeira tarefa para começar a organizar suas atividades!"
                    }
                  </p>
                  <button
                    onClick={() => alert('Modal de criação de tarefa em desenvolvimento')}
                    disabled={loading}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10 disabled:opacity-50"
                  >
                    {loading ? 'Carregando...' : 'Criar Primeira Tarefa'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {tarefasPaginadas.map((tarefa, index) => (
                <div
                  key={tarefa.id}
                  className="glass-effect rounded-xl shadow-lg p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 sm:transform sm:hover:scale-105 sm:hover:-translate-y-1 group cursor-pointer relative overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Elementos decorativos de fundo */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-4 translate-x-4 opacity-20"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 bg-green-200 dark:bg-green-600 rounded-full translate-y-3 -translate-x-3 opacity-30"></div>
                  
                  {/* Header da Tarefa */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3 relative z-10">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {tarefa.titulo}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(tarefa.status)}`}>
                          {tarefa.status}
                        </span>
                        <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getPrioridadeColor(tarefa.prioridade)}`}>
                          {tarefa.prioridade}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                        title="Editar"
                        onClick={() => alert('Modal de edição em desenvolvimento')}
                        disabled={loading}
                      >
                        <i className="fa-solid fa-edit text-xs sm:text-sm"></i>
                      </button>
                      <button 
                        className="p-1 sm:p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                        title={tarefa.status === 'Concluída' ? 'Marcar como Pendente' : 'Concluir'}
                        onClick={() => toggleTaskStatus(tarefa.id, tarefa.status)}
                        disabled={loading}
                      >
                        <i className={`fa-solid ${tarefa.status === 'Concluída' ? 'fa-undo' : 'fa-check'} text-sm`}></i>
                      </button>
                      <button 
                        className="p-1 sm:p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                        title="Excluir"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                            removeTask(tarefa.id);
                          }
                        }}
                        disabled={loading}
                      >
                        <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
                      </button>
                    </div>
                  </div>

                  {/* Descrição */}
                  {tarefa.descricao && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 relative z-10">
                      {tarefa.descricao}
                    </p>
                  )}

                  {/* Categoria e Data */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 relative z-10">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {tarefa.categoria}
                    </span>
                    <span className="font-medium">
                      {tarefa.data_vencimento 
                        ? new Date(tarefa.data_vencimento).toLocaleDateString('pt-BR')
                        : 'Sem prazo'
                      }
                    </span>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative z-10">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${getProgressBarStyle(tarefa.status)}`}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                <button
                  key={numero}
                  onClick={() => setPaginaAtual(numero)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    paginaAtual === numero
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {numero}
                </button>
              ))}
              
              <button
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}

        </div>
      </div>
    </VisitorModeWrapper>
  );
}