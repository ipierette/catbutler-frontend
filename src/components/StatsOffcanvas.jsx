import React, { useState } from 'react';
// Importa o hook de autenticação
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


export default function StatsOffcanvas({ achievements = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Detecta modo visitante via flag de ambiente
  const isVisitor = import.meta.env.VITE_VISITOR_MODE === 'true';

  const toggleOffcanvas = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Aba lateral */}
      <div 
        className="fixed right-0 top-1/2 transform -translate-y-1/2 z-[110] transition-all duration-300"
      >
        <button
          onClick={toggleOffcanvas}
          className={`bg-purple-500 hover:bg-purple-600 text-white px-3 py-6 shadow-lg transition-all duration-300 flex items-center gap-2 ${
            isOpen 
              ? 'rounded-l-lg' 
              : 'rounded-l-xl hover:scale-105'
          }`}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {isOpen ? (
            <i className="fa-solid fa-times text-lg"></i>
          ) : (
            <>
              <i className="fa-solid fa-chart-bar text-sm"></i>
              <span className="text-xs font-semibold whitespace-nowrap transform rotate-180">
                Clique para Estatísticas
              </span>
            </>
          )}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[105] transition-opacity duration-300"
          onClick={toggleOffcanvas}
          onKeyDown={(e) => e.key === 'Escape' && toggleOffcanvas()}
          aria-label="Fechar estatísticas"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        />
      )}

      {/* Offcanvas Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-trophy text-white"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Suas Conquistas
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Acompanhe seu progresso
                </p>
              </div>
            </div>
            <button
              onClick={toggleOffcanvas}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => {
                  if (isVisitor) {
                    window.alert('Crie uma conta para acessar suas receitas!');
                    navigate('/criar-conta');
                  } else {
                    navigate('/cozinha-ia');
                    setIsOpen(false);
                  }
                }}
                className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-600 dark:to-emerald-600 border border-green-200 dark:border-green-400 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 dark:text-white mb-1 group-hover:scale-110 transition-transform duration-200">
                    {isVisitor ? '—' : (achievements.recipes || 0)}
                  </div>
                  <div className="text-sm text-green-800 dark:text-white font-semibold">
                    Receitas
                  </div>
                  <i className="fa-solid fa-utensils text-green-600 dark:text-green-300 mt-2"></i>
                </div>
              </button>

              <button 
                onClick={() => {
                  if (isVisitor) {
                    window.alert('Crie uma conta para acessar suas compras!');
                    navigate('/criar-conta');
                  } else {
                    navigate('/mercado-ia');
                    setIsOpen(false);
                  }
                }}
                className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-600 dark:to-cyan-600 border border-blue-200 dark:border-blue-400 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700 dark:text-white mb-1 group-hover:scale-110 transition-transform duration-200">
                    {isVisitor ? '—' : (achievements.shopping || 0)}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-white font-semibold">
                    Compras
                  </div>
                  <i className="fa-solid fa-shopping-cart text-blue-600 dark:text-blue-300 mt-2"></i>
                </div>
              </button>

              <button 
                onClick={() => {
                  if (isVisitor) {
                    window.alert('Crie uma conta para acessar suas tarefas!');
                    navigate('/criar-conta');
                  } else {
                    navigate('/faxina-ia');
                    setIsOpen(false);
                  }
                }}
                className="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-600 dark:to-red-600 border border-orange-200 dark:border-orange-400 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700 dark:text-white mb-1 group-hover:scale-110 transition-transform duration-200">
                    {isVisitor ? '—' : (achievements.tasks || 0)}
                  </div>
                  <div className="text-sm text-orange-800 dark:text-white font-semibold">
                    Tarefas
                  </div>
                  <i className="fa-solid fa-list-check text-orange-600 dark:text-orange-300 mt-2"></i>
                </div>
              </button>

              <button 
                onClick={() => {
                  if (isVisitor) {
                    window.alert('Crie uma conta para acompanhar seus dias ativos!');
                    navigate('/criar-conta');
                  } else {
                    navigate('/config');
                    setIsOpen(false);
                  }
                }}
                className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-600 dark:to-pink-600 border border-purple-200 dark:border-purple-400 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700 dark:text-white mb-1 group-hover:scale-110 transition-transform duration-200">
                    {isVisitor ? '—' : (achievements.days || 0)}
                  </div>
                  <div className="text-sm text-purple-800 dark:text-white font-semibold">
                    Dias
                  </div>
                  <i className="fa-solid fa-calendar text-purple-600 dark:text-purple-300 mt-2"></i>
                </div>
              </button>
            </div>

            {/* Additional Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Detalhes
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                {isVisitor ? (
                  <div className="text-center text-gray-600 dark:text-gray-300 text-sm">
                    <div className="mb-2">Crie uma conta para acompanhar seu progresso, conquistas e atividades!</div>
                    <button
                      onClick={() => navigate('/criar-conta')}
                      className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold shadow"
                    >
                      Criar Conta Grátis
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total de atividades</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {(achievements.recipes || 0) + (achievements.shopping || 0) + (achievements.tasks || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Média por dia</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {Math.round(((achievements.recipes || 0) + (achievements.shopping || 0) + (achievements.tasks || 0)) / (achievements.days || 1))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Dias ativos</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {achievements.days || 0}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div>
                    <div className="font-semibold">Parabéns!</div>
                    <div className="text-sm opacity-90">Continue assim para alcançar novos objetivos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

StatsOffcanvas.propTypes = {
  achievements: PropTypes.shape({
    recipes: PropTypes.number,
    shopping: PropTypes.number,
    tasks: PropTypes.number,
    days: PropTypes.number
  })
};
