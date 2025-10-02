import React from 'react';
import useSmartTips from '../hooks/useSmartTips';

const SmartTipCard = ({ 
  categoria = 'geral', 
  contexto = null, 
  titulo = 'Dica Inteligente',
  icone = 'fa-lightbulb',
  corPrimaria = 'indigo',
  mostrarBotaoAtualizar = true,
  mostrarTags = true,
  tamanho = 'normal' // 'compact', 'normal', 'large'
}) => {
  const smartTips = useSmartTips(categoria, contexto);

  const getCoresPorCategoria = (cor) => {
    const cores = {
      indigo: {
        bg: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
        border: 'border-indigo-200 dark:border-indigo-700',
        icon: 'bg-indigo-500',
        titulo: 'text-indigo-800 dark:text-indigo-200',
        conteudo: 'text-indigo-700 dark:text-indigo-300',
        botao: 'text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
        tag: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
        contexto: 'text-indigo-600 dark:text-indigo-400'
      },
      green: {
        bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        border: 'border-green-200 dark:border-green-700',
        icon: 'bg-green-500',
        titulo: 'text-green-800 dark:text-green-200',
        conteudo: 'text-green-700 dark:text-green-300',
        botao: 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30',
        tag: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        contexto: 'text-green-600 dark:text-green-400'
      },
      orange: {
        bg: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'bg-orange-500',
        titulo: 'text-orange-800 dark:text-orange-200',
        conteudo: 'text-orange-700 dark:text-orange-300',
        botao: 'text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30',
        tag: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        contexto: 'text-orange-600 dark:text-orange-400'
      },
      purple: {
        bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        border: 'border-purple-200 dark:border-purple-700',
        icon: 'bg-purple-500',
        titulo: 'text-purple-800 dark:text-purple-200',
        conteudo: 'text-purple-700 dark:text-purple-300',
        botao: 'text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30',
        tag: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        contexto: 'text-purple-600 dark:text-purple-400'
      }
    };
    return cores[cor] || cores.indigo;
  };

  const cores = getCoresPorCategoria(corPrimaria);
  
  const getTamanhoClasses = () => {
    switch (tamanho) {
      case 'compact':
        return {
          container: 'p-3',
          icon: 'w-8 h-8',
          titulo: 'text-sm font-semibold',
          conteudo: 'text-xs',
          botao: 'p-1'
        };
      case 'large':
        return {
          container: 'p-6',
          icon: 'w-12 h-12',
          titulo: 'text-lg font-bold',
          conteudo: 'text-base',
          botao: 'p-2'
        };
      default: // normal
        return {
          container: 'p-4',
          icon: 'w-10 h-10',
          titulo: 'text-base font-bold',
          conteudo: 'text-sm',
          botao: 'p-1'
        };
    }
  };

  const tamanhoClasses = getTamanhoClasses();

  if (!smartTips.dicaAtual) {
    return (
      <div className={`bg-gradient-to-r ${cores.bg} border ${cores.border} rounded-lg ${tamanhoClasses.container}`}>
        <div className="flex items-center gap-3">
          <div className={`${tamanhoClasses.icon} ${cores.icon} rounded-full flex items-center justify-center animate-pulse`}>
            <i className={`fa-solid ${icone} text-white`}></i>
          </div>
          <div className="flex-1">
            <div className={`${tamanhoClasses.titulo} ${cores.titulo} mb-1`}>
              {titulo}
            </div>
            <div className={`${tamanhoClasses.conteudo} ${cores.conteudo}`}>
              Carregando dica personalizada...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${cores.bg} border ${cores.border} rounded-lg ${tamanhoClasses.container}`}>
      <div className="flex items-start gap-3">
        <div className={`${tamanhoClasses.icon} ${cores.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
          <i className={`fa-solid ${icone} text-white`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`${tamanhoClasses.titulo} ${cores.titulo}`}>
              💡 {smartTips.dicaAtual.titulo}
            </h4>
            {mostrarBotaoAtualizar && (
              <button
                onClick={() => smartTips.atualizarDicas(true)}
                className={`${tamanhoClasses.botao} ${cores.botao} rounded transition-colors`}
                title="Nova dica"
                disabled={smartTips.loading}
              >
                <i className={`fa-solid fa-refresh text-sm ${smartTips.loading ? 'animate-spin' : ''}`}></i>
              </button>
            )}
          </div>
          
          <p className={`${tamanhoClasses.conteudo} ${cores.conteudo} mb-3 leading-relaxed`}>
            {smartTips.dicaAtual.conteudo}
          </p>
          
          {/* Tempo e dificuldade */}
          {smartTips.dicaAtual.tempo && (
            <div className="flex items-center gap-3 mb-2 text-xs">
              <span className={`flex items-center gap-1 ${cores.contexto}`}>
                <i className="fa-solid fa-clock"></i>
                {smartTips.dicaAtual.tempo}
              </span>
              {smartTips.dicaAtual.dificuldade && (
                <span className={`flex items-center gap-1 ${cores.contexto}`}>
                  <i className="fa-solid fa-signal"></i>
                  {smartTips.dicaAtual.dificuldade}
                </span>
              )}
            </div>
          )}
          
          {/* Tags */}
          {mostrarTags && smartTips.dicaAtual.tags && (
            <div className="flex flex-wrap gap-2">
              {smartTips.dicaAtual.tags.map(tag => (
                <span key={tag} className={`px-2 py-1 ${cores.tag} rounded-full text-xs`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Indicador de personalização */}
          {contexto?.ingredientesExcluidos?.length > 0 && (
            <div className={`mt-2 text-xs ${cores.contexto} flex items-center gap-1`}>
              <i className="fa-solid fa-magic-wand-sparkles"></i>
              Dica personalizada para suas exclusões
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartTipCard;
