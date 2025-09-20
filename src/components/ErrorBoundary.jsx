import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      errorAnalysis: null
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `catbutler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Detectar se é um erro minificado do React
    const isReactMinifiedError = error.message && error.message.includes('Minified React error');
    const isHookError = error.message && (
      error.message.includes('useEffect is not defined') ||
      error.message.includes('useState is not defined') ||
      error.message.includes('useRef is not defined') ||
      error.stack?.includes('hook')
    );

    let errorAnalysis = {
      type: 'generic',
      likely_cause: 'Erro desconhecido',
      suggestion: 'Tente recarregar a página'
    };

    if (isReactMinifiedError) {
      errorAnalysis = {
        type: 'react_minified',
        likely_cause: 'Erro no uso de hooks ou componentes React',
        suggestion: 'Erro de minificação detectado. Verifique se todos os hooks estão sendo importados corretamente.'
      };
    } else if (isHookError) {
      errorAnalysis = {
        type: 'hook_import',
        likely_cause: 'Hook do React não foi importado ou está sendo usado incorretamente',
        suggestion: 'Verificar se useEffect, useState, etc. estão sendo importados corretamente de "react"'
      };
    }

    console.error('🚨 ErrorBoundary capturou um erro:', {
      errorId,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      analysis: errorAnalysis
    });

    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId,
      errorAnalysis
    });

    // Reportar erro para monitoramento (se implementado)
    this.reportError(errorId, error, errorInfo, errorAnalysis);
  }

  reportError = (errorId, error, errorInfo, errorAnalysis) => {
    // Aqui você pode integrar with serviços como Sentry, LogRocket, etc.
    try {
      // Por enquanto, apenas logar para debug
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.group('🐱 CatButler Error Report');
        console.log('Error ID:', errorId);
        console.log('Message:', error.toString());
        console.log('Stack:', error.stack);
        console.log('Component Stack:', errorInfo.componentStack);
        console.log('Analysis:', errorAnalysis);
        console.log('URL:', window.location.href);
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();
      }
    } catch (reportError) {
      console.error('Erro ao reportar erro:', reportError);
    }
  };

  handleRetry = () => {
    const { retryCount } = this.state;

        // Se já tentou várias vezes, fazer limpeza mais profunda
    if (retryCount >= 2) {
      console.log('🧹 Tentativa de recuperação profunda após múltiplas falhas...');

      // Limpar dados de autenticação problemáticos
      localStorage.removeItem('force_logout');

      // Forçar recarregamento após limpeza
      setTimeout(() => {
        window.location.reload();
      }, 500);

      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  copyErrorToClipboard = async () => {
    try {
      const errorDetails = [
        '🚨 CatButler Error Report',
        '========================',
        'Erro: ' + (this.state.error?.toString() || 'N/A'),
        'Stack: ' + (this.state.error?.stack || 'N/A'),
        'Component Stack: ' + (this.state.errorInfo?.componentStack || 'N/A'),
        'Timestamp: ' + new Date().toLocaleString(),
        'URL: ' + window.location.href,
        'User Agent: ' + navigator.userAgent,
        '========================'
      ].join('\n');

      await navigator.clipboard.writeText(errorDetails);
      
      const button = document.getElementById('copy-error-btn');
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check text-green-500"></i> Copiado!';
        button.classList.add('bg-green-500', 'text-white');
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('bg-green-500', 'text-white');
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId, retryCount, errorAnalysis } = this.state;

      return React.createElement(
        'div',
        { className: 'min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900' },
        React.createElement(
          'div',
          { className: 'max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 text-center' },
          React.createElement('div', { className: 'text-6xl mb-4' }, '🐱'),
          React.createElement('h2', { className: 'text-xl font-bold text-gray-900 dark:text-gray-100 mb-2' }, 'Oops! Algo deu errado'),
          React.createElement('p', { className: 'text-gray-600 dark:text-gray-300 mb-4' },
            'O CatButler encontrou um problema inesperado. Não se preocupe, nossos gatos estão trabalhando para resolver isso!'
          ),

          // Mostrar análise específica do erro
          errorAnalysis && React.createElement('div', {
            className: 'mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-left text-sm'
          },
            React.createElement('p', { className: 'font-semibold text-blue-800 dark:text-blue-200 mb-1' }, '🔍 Análise do Problema:'),
            React.createElement('p', { className: 'text-blue-700 dark:text-blue-300 mb-2' }, errorAnalysis.likely_cause),
            React.createElement('p', { className: 'text-blue-600 dark:text-blue-400 text-xs' }, errorAnalysis.suggestion)
          ),

          // Mostrar informações de debug em desenvolvimento
          process.env.NODE_ENV === 'development' && errorId && React.createElement('div', {
            className: 'mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-left text-xs font-mono text-gray-600 dark:text-gray-300'
          }, `ID do erro: ${errorId}`),

          React.createElement(
            'div',
            { className: 'space-y-3' },
            React.createElement('button', {
              onClick: this.handleRetry,
              className: 'w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
            }, React.createElement('i', { className: 'fa-solid fa-refresh' }), '🔄 Tentar Novamente'),

            React.createElement('button', {
              onClick: () => window.location.reload(),
              className: 'w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
            }, React.createElement('i', { className: 'fa-solid fa-refresh' }), '🔄 Recarregar Página'),

            // Botão de relatório em desenvolvimento
            process.env.NODE_ENV === 'development' && error && React.createElement('button', {
              id: 'copy-error-btn',
              onClick: this.copyErrorToClipboard,
              className: 'w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2',
              title: 'Copiar detalhes do erro'
            }, React.createElement('i', { className: 'fa-solid fa-clipboard' }), '📋 Copiar Relatório de Erro'),

            // Mostrar contador de tentativas
            retryCount > 0 && React.createElement('p', {
              className: 'text-sm text-gray-500 dark:text-gray-400 mt-2'
            }, `Tentativa ${retryCount}/3`)
          )
        )
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
