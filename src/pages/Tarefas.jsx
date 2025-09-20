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

  // Estados do modal de Nova Tarefa
  const [showModal, setShowModal] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Outros',
    prioridade: 'Média',
    data_vencimento: ''
  });
  const [salvandoTarefa, setSalvandoTarefa] = useState(false);

  // Estado do modal de arquivo
  const [showModalArquivo, setShowModalArquivo] = useState(false);

  // Estados do modal de edição
  const [showModalEdicao, setShowModalEdicao] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [editandoTarefa, setEditandoTarefa] = useState(false);

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

  // Funções do modal de Nova Tarefa
  const abrirModal = () => {
    setNovaTarefa({
      titulo: '',
      descricao: '',
      categoria: 'Outros',
      prioridade: 'Média',
      data_vencimento: ''
    });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setNovaTarefa({
      titulo: '',
      descricao: '',
      categoria: 'Outros',
      prioridade: 'Média',
      data_vencimento: ''
    });
  };

  const handleInputChange = (field, value) => {
    setNovaTarefa(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTarefa = async (e) => {
    e.preventDefault();
    
    if (!novaTarefa.titulo.trim()) {
      alert('Por favor, insira um título para a tarefa');
      return;
    }

    setSalvandoTarefa(true);
    
    try {
      await addTask(novaTarefa);
      fecharModal();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setSalvandoTarefa(false);
    }
  };

  // Funções do modal de edição
  const abrirModalEdicao = (tarefa) => {
    setTarefaEditando({
      ...tarefa,
      data_vencimento: tarefa.data_vencimento || ''
    });
    setShowModalEdicao(true);
  };

  const fecharModalEdicao = () => {
    setShowModalEdicao(false);
    setTarefaEditando(null);
  };

  const handleInputChangeEdicao = (field, value) => {
    setTarefaEditando(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitEdicao = async (e) => {
    e.preventDefault();
    
    if (!tarefaEditando.titulo.trim()) {
      alert('Por favor, insira um título para a tarefa');
      return;
    }

    setEditandoTarefa(true);
    
    try {
      await editTask(tarefaEditando.id, {
        titulo: tarefaEditando.titulo,
        descricao: tarefaEditando.descricao,
        categoria: tarefaEditando.categoria,
        prioridade: tarefaEditando.prioridade,
        data_vencimento: tarefaEditando.data_vencimento || null
      });
      fecharModalEdicao();
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      alert('Erro ao editar tarefa. Tente novamente.');
    } finally {
      setEditandoTarefa(false);
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
              <div className="glass-effect rounded-lg p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 relative">
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Concluídas</span>
                  <button
                    onClick={() => setShowModalArquivo(true)}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                    title="Ver arquivo de tarefas concluídas"
                  >
                    📁 Arquivo
                  </button>
                </div>
                <div className="text-xl font-bold text-green-900 dark:text-green-100">{stats.completed_tasks || 0}</div>
              </div>
            </div>
          )}

          {/* Filtros e Busca */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Filtros e Nova Tarefa - mesma linha */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between w-full">
              {/* Filtros */}
              <div className="flex flex-wrap gap-2 min-w-0 flex-shrink-0">
                <FilterButton
                  label="Status"
                  options={status.map(s => ({ label: s, value: s }))}
                  value={filtroStatus === "Todas" ? null : filtroStatus}
                  onChange={(value) => setFiltroStatus(value || "Todas")}
                  placeholder="Status"
                  icon="fa-solid fa-filter"
                />
                
                <FilterButton
                  label="Categoria"
                  options={categorias.map(c => ({ label: c, value: c }))}
                  value={filtroCategoria === "Todas" ? null : filtroCategoria}
                  onChange={(value) => setFiltroCategoria(value || "Todas")}
                  placeholder="Categoria"
                  icon="fa-solid fa-tags"
                />
              </div>

              {/* Nova Tarefa Button */}
              <button
                onClick={abrirModal}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base font-medium disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Nova Tarefa
              </button>
            </div>
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
                        onClick={() => abrirModalEdicao(tarefa)}
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

      {/* Modal Nova Tarefa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Nova Tarefa
                </h3>
                <button
                  onClick={fecharModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitTarefa} className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={novaTarefa.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ex: Limpar a cozinha"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={novaTarefa.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Detalhes da tarefa..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Categoria e Prioridade */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={novaTarefa.categoria}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categorias.filter(c => c !== 'Todas').map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={novaTarefa.prioridade}
                      onChange={(e) => handleInputChange('prioridade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>

                {/* Data de Vencimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    value={novaTarefa.data_vencimento}
                    onChange={(e) => handleInputChange('data_vencimento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvandoTarefa || !novaTarefa.titulo.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {salvandoTarefa ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Salvando...
                      </>
                    ) : (
                      'Criar Tarefa'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Arquivo de Tarefas Concluídas */}
      {showModalArquivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <i className="fa-solid fa-archive text-green-600 dark:text-green-400"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📁 Arquivo de Tarefas
                  </h3>
                </div>
                <button
                  onClick={() => setShowModalArquivo(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                {/* Informação sobre limpeza automática */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                      <i className="fa-solid fa-clock text-amber-600 dark:text-amber-400 text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">
                        ⏰ Política de Limpeza Automática
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        Tarefas concluídas são mantidas por um período mínimo de <strong>12 a 24 horas</strong> 
                        e depois removidas automaticamente para manter seu espaço organizado e otimizado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista das tarefas concluídas atuais */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Tarefas Concluídas Recentes
                  </h4>
                  
                  {tarefasFiltradas.filter(t => t.status === 'Concluída').length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {tarefasFiltradas.filter(t => t.status === 'Concluída').map((tarefa) => (
                        <div 
                          key={tarefa.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                            <i className="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {tarefa.titulo}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Concluída em: {tarefa.data_conclusao ? new Date(tarefa.data_conclusao).toLocaleDateString('pt-BR') : 'Hoje'}
                            </p>
                          </div>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            {tarefa.categoria}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <i className="fa-solid fa-inbox text-gray-400 text-2xl mb-2 block"></i>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nenhuma tarefa concluída encontrada
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão fechar */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setShowModalArquivo(false)}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edição de Tarefa */}
      {showModalEdicao && tarefaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Editar Tarefa
                </h3>
                <button
                  onClick={fecharModalEdicao}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitEdicao} className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={tarefaEditando.titulo}
                    onChange={(e) => handleInputChangeEdicao('titulo', e.target.value)}
                    placeholder="Ex: Limpar a cozinha"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={tarefaEditando.descricao || ''}
                    onChange={(e) => handleInputChangeEdicao('descricao', e.target.value)}
                    placeholder="Detalhes da tarefa..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Categoria e Prioridade */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={tarefaEditando.categoria}
                      onChange={(e) => handleInputChangeEdicao('categoria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categorias.filter(c => c !== 'Todas').map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={tarefaEditando.prioridade}
                      onChange={(e) => handleInputChangeEdicao('prioridade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>

                {/* Data de Vencimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    value={tarefaEditando.data_vencimento}
                    onChange={(e) => handleInputChangeEdicao('data_vencimento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={fecharModalEdicao}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editandoTarefa || !tarefaEditando.titulo.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editandoTarefa ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </VisitorModeWrapper>
  );
}