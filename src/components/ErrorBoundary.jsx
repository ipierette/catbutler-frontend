import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ErrorBoundary capturou um erro:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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
      return React.createElement(
        'div',
        { className: 'min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900' },
        React.createElement(
          'div',
          { className: 'max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center' },
          React.createElement('div', { className: 'text-6xl mb-4' }, '🐱'),
          React.createElement('h2', { className: 'text-xl font-bold text-gray-900 dark:text-gray-100 mb-2' }, 'Oops! Algo deu errado'),
          React.createElement('p', { className: 'text-gray-600 dark:text-gray-300 mb-6' }, 'O CatButler encontrou um problema inesperado. Não se preocupe, nossos gatos estão trabalhando para resolver isso!'),
          React.createElement(
            'div',
            { className: 'space-y-3' },
            React.createElement('button', {
              onClick: this.handleRetry,
              className: 'w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200'
            }, '🔄 Tentar Novamente'),
            React.createElement('button', {
              onClick: () => window.location.reload(),
              className: 'w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200'
            }, '🔄 Recarregar Página'),
            process.env.NODE_ENV === 'development' && this.state.error ? React.createElement('button', {
              id: 'copy-error-btn',
              onClick: this.copyErrorToClipboard,
              className: 'w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2',
              title: 'Copiar detalhes do erro'
            }, '📋 Copiar Erro') : null
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
