import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Hook para gerenciar diálogos de confirmação
export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});
  const resolveRef = useRef(null);

  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      setConfig({
        title: 'Confirmar ação',
        message: 'Tem certeza que deseja continuar?',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'warning',
        ...options,
      });
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  };

  return {
    confirm,
    isOpen,
    config,
    handleConfirm,
    handleCancel,
  };
};

// Componente de Diálogo de Confirmação
const ConfirmationDialog = ({ isOpen, config, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Focus no botão de confirmação
      setTimeout(() => {
        if (dialogRef.current) {
          const confirmButton = dialogRef.current.querySelector('[data-confirm-button]');
          if (confirmButton) confirmButton.focus();
        }
      }, 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (config.type) {
      case 'danger':
        return {
          icon: 'fa-exclamation-triangle',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-500 hover:bg-red-600 text-white',
          borderColor: 'border-red-200 dark:border-red-500/30',
        };
      case 'warning':
        return {
          icon: 'fa-exclamation-triangle',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          borderColor: 'border-yellow-200 dark:border-yellow-500/30',
        };
      case 'info':
        return {
          icon: 'fa-info-circle',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
          borderColor: 'border-blue-200 dark:border-blue-500/30',
        };
      default:
        return {
          icon: 'fa-question-circle',
          iconColor: 'text-gray-600 dark:text-gray-400',
          buttonColor: 'bg-gray-500 hover:bg-gray-600 text-white',
          borderColor: 'border-gray-200 dark:border-gray-500/30',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return createPortal(
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div 
        ref={dialogRef}
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border ${typeStyles.borderColor} max-w-md w-full transform transition-all duration-200 ${isVisible ? 'scale-100' : 'scale-95'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`text-3xl ${typeStyles.iconColor} flex-shrink-0`}>
              <i className={`fa-solid ${typeStyles.icon}`}></i>
            </div>
            <div className="flex-1">
              <h3 
                id="dialog-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                {config.title}
              </h3>
              <p 
                id="dialog-description"
                className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {config.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {config.cancelText}
            </button>
            <button
              data-confirm-button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${typeStyles.buttonColor}`}
            >
              {config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// PropTypes removed for compatibility

// Componente wrapper que combina hook e dialog
export const ConfirmationProvider = ({ children }) => {
  const confirmation = useConfirmation();

  return (
    <>
      {children}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        config={confirmation.config}
        onConfirm={confirmation.handleConfirm}
        onCancel={confirmation.handleCancel}
      />
    </>
  );
};

// Hook para usar confirmação em qualquer componente
export const useConfirm = () => {
  const confirmation = useConfirmation();
  
  return {
    confirm: confirmation.confirm,
    confirmDelete: (itemName = 'este item') => 
      confirmation.confirm({
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir ${itemName}? Esta ação não pode ser desfeita.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'danger',
      }),
    confirmAction: (action, itemName) =>
      confirmation.confirm({
        title: `Confirmar ${action}`,
        message: `Tem certeza que deseja ${action} ${itemName}?`,
        confirmText: action,
        cancelText: 'Cancelar',
        type: 'warning',
      }),
  };
};
