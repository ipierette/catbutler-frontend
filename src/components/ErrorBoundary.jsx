
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

function ErrorBoundary({ children }) {
  const [errorState, setErrorState] = useState({ hasError: false, error: null, errorInfo: null });

  const handleRetry = useCallback(() => {
    setErrorState({ hasError: false, error: null, errorInfo: null });
  }, []);

  // Custom hook para capturar erros em componentes filhos
  // (React 18+ não tem hook oficial, mas podemos usar try/catch em render)
  // Não é possível capturar erros de renderização de filhos em componentes funcionais sem um boundary de classe.
  // Portanto, para manter a compatibilidade, recomenda-se usar um boundary de classe ou uma lib como react-error-boundary.
  // Aqui, apenas renderizamos children ou fallback se erroState.hasError for true.
  if (errorState.hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">
            <i className="fa-solid fa-cat text-red-500"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Oops! Algo deu errado
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            O CatButler encontrou um problema inesperado. Não se preocupe, nossos gatos estão trabalhando para resolver isso!
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              🔄 Tentar Novamente
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              🔄 Recarregar Página
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && errorState.error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Detalhes do erro (desenvolvimento)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-40">
                <div className="mb-2">
                  <strong>Erro:</strong> {errorState.error?.toString()}
                </div>
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap">{errorState.errorInfo?.componentStack}</pre>
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }
  return children;
}


ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
