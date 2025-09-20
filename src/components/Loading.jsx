import React from 'react';

// Componente de Loading Spinner
export const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'orange':
        return 'text-orange-600 dark:text-orange-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      case 'white':
        return 'text-white';
      case 'gray':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <div className={`${getSizeClasses()} ${getColorClasses()} animate-spin`}>
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
};

// PropTypes removed for compatibility

// Componente de Loading com texto
export const LoadingWithText = ({ 
  text = 'Carregando...', 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <LoadingSpinner size={size} color={color} />
      <span className="text-sm text-gray-600 dark:text-gray-300">{text}</span>
    </div>
  );
};

// PropTypes removed for compatibility

// Componente de Loading para botões
export const LoadingButton = ({ 
  loading = false, 
  children, 
  loadingText = 'Carregando...',
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" color="white" />}
      {loading ? loadingText : children}
    </button>
  );
};

// PropTypes removed for compatibility

// Componente de Loading para cards/seções
export const LoadingCard = ({ 
  title = 'Carregando...', 
  description = 'Aguarde um momento',
  className = '' 
}) => {
  return (
    <div className={`glass-effect rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <LoadingSpinner size="lg" color="orange" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// PropTypes removed for compatibility

// Hook para gerenciar estados de loading
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  
  const startLoading = React.useCallback(() => setLoading(true), []);
  const stopLoading = React.useCallback(() => setLoading(false), []);
  const toggleLoading = React.useCallback(() => setLoading(prev => !prev), []);
  
  const withLoading = React.useCallback(async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading,
  };
};

export default LoadingCard;
