import React, { useState, useRef, useEffect } from 'react';
import { useCredits } from '../contexts/CreditsContext';

const CreditsIcon = () => {
  const { credits, getRecentTransactions, getTotalEarned, getTotalSpent, isAuthenticated } = useCredits();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const iconRef = useRef(null);

  // Não mostrar para usuários não autenticados
  if (!isAuthenticated) {
    return null;
  }

  const recentTransactions = getRecentTransactions(5);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Fechar tooltip ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) && 
          iconRef.current && !iconRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getTransactionColor = (transaction) => {
    if (transaction.amount > 0) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="relative">
      {/* Ícone de Créditos */}
      <div
        ref={iconRef}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <i className="fa-solid fa-coins text-amber-600 dark:text-amber-400 text-lg animate-pulse"></i>
        <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">
          {credits.toLocaleString()}
        </span>
      </div>

      {/* Tooltip com Transações */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in"
        >
          {/* Header do Tooltip */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-coins text-amber-600 dark:text-amber-400"></i>
                Meus Créditos
              </h3>
              <button 
                onClick={() => setShowTooltip(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            {/* Resumo */}
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {credits}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  Saldo Atual
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {getTotalEarned()}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  Total Ganho
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {getTotalSpent()}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">
                  Total Gasto
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Transações Recentes */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-history"></i>
              Transações Recentes
            </h4>
            
            {recentTransactions.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-inbox text-2xl mb-2"></i>
                <p className="text-sm">Nenhuma transação ainda</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{transaction.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${getTransactionColor(transaction)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com Dicas */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-b-lg">
            <div className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Dica:</strong> Ganhe créditos usando as funcionalidades do CatButler!
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              ✨ Use créditos para desbloquear avatares especiais e temas premium
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsIcon;