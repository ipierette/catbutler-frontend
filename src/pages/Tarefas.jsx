import React, { useState } from "react";
import FilterButton from "../components/ui/FilterButton";

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
    <div className="h-full p-4 lg:p-6 overflow-y-auto scrollbar-hide">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <i className="fa-solid fa-clipboard-list text-xl text-green-600 dark:text-green-400" aria-label="tarefas"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Minhas Tarefas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Organize e gerencie suas tarefas diárias
            </p>
          </div>
        </div>
        
        {/* Filtros com botões pequenos */}
        <div className="flex items-center gap-2">
          <FilterButton
            label="Status"
            icon="fa-solid fa-circle-dot"
            value={filtroStatus === "Todas" ? null : filtroStatus}
            onChange={(value) => setFiltroStatus(value || "Todas")}
            options={status.filter(s => s !== "Todas").map(s => ({
              value: s,
              label: s,
              icon: s === "Pendente" ? "fa-solid fa-clock" : s === "Em Andamento" ? "fa-solid fa-play" : "fa-solid fa-check",
              count: tarefas.filter(t => t.status === s).length
            }))}
          />
          
          <FilterButton
            label="Categoria"
            icon="fa-solid fa-folder"
            value={filtroCategoria === "Todas" ? null : filtroCategoria}
            onChange={(value) => setFiltroCategoria(value || "Todas")}
            options={categorias.filter(c => c !== "Todas").map(c => ({
              value: c,
              label: c,
              count: tarefas.filter(t => t.categoria === c).length
            }))}
          />

          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            className="btn-primary px-3 py-2 text-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Busca rápida - compacta */}
      {busca && (
        <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-700 dark:text-primary-300">
              <i className="fa-solid fa-search mr-2"></i>
              Buscando por: "{busca}"
            </span>
            <button
              onClick={() => setBusca("")}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </div>
  );
}
