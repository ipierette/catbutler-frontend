import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

// Context para gerenciar toasts
const ToastContext = createContext();

// Hook para usar o contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

// Componente de Toast individual
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remove após duração
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [toast.id, onRemove]);

  const getToastStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
    const positionStyles = "fixed top-4 right-4 z-[99999] max-w-sm w-full";
    
    if (isLeaving) {
      return `${baseStyles} ${positionStyles} translate-x-full opacity-0`;
    }
    
    if (isVisible) {
      return `${baseStyles} ${positionStyles} translate-x-0 opacity-100`;
    }
    
    return `${baseStyles} ${positionStyles} translate-x-full opacity-0`;
  };

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-100';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-500/30 text-yellow-800 dark:text-yellow-100';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-100';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-times-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  };

  return createPortal(
    <div className={getToastStyles()}>
      <div className={`${getTypeStyles()} w-full`}>
        <div className="flex items-start gap-3">
          <i className={`fa-solid ${getIcon()} text-lg flex-shrink-0`}></i>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="font-semibold text-sm mb-1">{toast.title}</h4>
            )}
            <p className="text-sm leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar notificação"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// PropTypes removed for compatibility

// Provider do Toast
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast = {
      id,
      duration: 5000, // 5 segundos por padrão
      type: 'default',
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Métodos de conveniência
  const toast = useMemo(() => ({
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    default: (message, options = {}) => addToast({ type: 'default', message, ...options }),
    custom: addToast,
    remove: removeToast,
    clear: clearAllToasts,
  }), [addToast, removeToast, clearAllToasts]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
};
