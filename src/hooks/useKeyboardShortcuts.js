import { useEffect, useCallback, useRef } from 'react';

// Hook para gerenciar atalhos de teclado
export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  const shortcutsRef = useRef(shortcuts);

  // Atualiza as referências dos atalhos
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
    
    // Cria uma string representando a combinação de teclas
    const keyCombo = [
      ctrlKey && 'ctrl',
      altKey && 'alt',
      shiftKey && 'shift',
      metaKey && 'meta',
      key.toLowerCase()
    ].filter(Boolean).join('+');

    // Procura por um atalho correspondente
    const shortcut = shortcutsRef.current[keyCombo];
    
    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      
      if (typeof shortcut === 'function') {
        shortcut(event);
      } else if (shortcut.action) {
        shortcut.action(event);
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
};

// Hook para atalhos específicos do CatButler
export const useCatButlerShortcuts = () => {
  const shortcuts = {
    // Navegação
    'ctrl+h': () => {
      window.location.href = '/';
    },
    'ctrl+t': () => {
      window.location.href = '/tarefas';
    },
    'ctrl+c': () => {
      window.location.href = '/cozinha-ia';
    },
    'ctrl+f': () => {
      window.location.href = '/faxina-ia';
    },
    'ctrl+m': () => {
      window.location.href = '/mercado-ia';
    },
    'ctrl+comma': () => {
      window.location.href = '/config';
    },

    // Ações gerais
    'ctrl+k': () => {
      // Toggle do tema (se implementado)
      const themeToggle = document.querySelector('[data-theme-toggle]');
      if (themeToggle) themeToggle.click();
    },
    'ctrl+s': (event) => {
      // Previne o save padrão do browser
      event.preventDefault();
      // Aqui você pode implementar save de dados
      console.log('Save shortcut triggered');
    },
    'ctrl+shift+s': () => {
      // Compartilhar
      const shareButton = document.querySelector('[data-share-button]');
      if (shareButton) shareButton.click();
    },

    // Escape para fechar modais
    'escape': () => {
      // Fecha modais abertos
      const modals = document.querySelectorAll('[data-modal]');
      modals.forEach(modal => {
        if (modal.style.display !== 'none') {
          const closeButton = modal.querySelector('[data-modal-close]');
          if (closeButton) closeButton.click();
        }
      });
    },

    // Enter para confirmar ações
    'enter': (event) => {
      // Se estiver em um modal de confirmação
      const confirmButton = document.querySelector('[data-confirm-button]');
      if (confirmButton && confirmButton.offsetParent !== null) {
        event.preventDefault();
        confirmButton.click();
      }
    },
  };

  useKeyboardShortcuts(shortcuts);
};

// Hook para atalhos de formulário
export const useFormShortcuts = (onSubmit, onReset, onCancel) => {
  const shortcuts = {
    'ctrl+enter': (event) => {
      event.preventDefault();
      if (onSubmit) onSubmit();
    },
    'ctrl+r': (event) => {
      event.preventDefault();
      if (onReset) onReset();
    },
    'escape': (event) => {
      if (onCancel) onCancel();
    },
  };

  useKeyboardShortcuts(shortcuts);
};

// Hook para atalhos de lista/tabela
export const useListShortcuts = (onAdd, onEdit, onDelete, onSearch) => {
  const shortcuts = {
    'ctrl+n': (event) => {
      event.preventDefault();
      if (onAdd) onAdd();
    },
    'ctrl+e': (event) => {
      event.preventDefault();
      if (onEdit) onEdit();
    },
    'ctrl+d': (event) => {
      event.preventDefault();
      if (onDelete) onDelete();
    },
    'ctrl+f': (event) => {
      event.preventDefault();
      if (onSearch) onSearch();
    },
  };

  useKeyboardShortcuts(shortcuts);
};

// Hook para atalhos de navegação entre abas
export const useTabShortcuts = (tabs, activeTab, setActiveTab) => {
  const shortcuts = {};

  // Cria atalhos numéricos para as abas (1, 2, 3, etc.)
  tabs.forEach((tab, index) => {
    shortcuts[`ctrl+${index + 1}`] = () => {
      setActiveTab(tab.id);
    };
  });

  // Navegação com setas
  shortcuts['ctrl+arrowleft'] = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    setActiveTab(tabs[prevIndex].id);
  };

  shortcuts['ctrl+arrowright'] = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    setActiveTab(tabs[nextIndex].id);
  };

  useKeyboardShortcuts(shortcuts);
};

// Hook para atalhos de busca
export const useSearchShortcuts = (onSearch, onClear, onFocus) => {
  const shortcuts = {
    'ctrl+/': (event) => {
      event.preventDefault();
      if (onFocus) onFocus();
    },
    'ctrl+shift+f': (event) => {
      event.preventDefault();
      if (onFocus) onFocus();
    },
    'escape': (event) => {
      if (onClear) onClear();
    },
  };

  useKeyboardShortcuts(shortcuts);
};

// Hook para atalhos de modal
export const useModalShortcuts = (isOpen, onClose, onConfirm) => {
  const shortcuts = {
    'escape': () => {
      if (isOpen && onClose) onClose();
    },
    'enter': () => {
      if (isOpen && onConfirm) onConfirm();
    },
  };

  useKeyboardShortcuts(shortcuts, isOpen);
};

// Componente para mostrar atalhos disponíveis
export const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const shortcuts = [
    { id: 'home', keys: 'Ctrl + H', description: 'Ir para Home' },
    { id: 'tasks', keys: 'Ctrl + T', description: 'Ir para Tarefas' },
    { id: 'kitchen', keys: 'Ctrl + C', description: 'Ir para Cozinha IA' },
    { id: 'cleaning', keys: 'Ctrl + F', description: 'Ir para Faxina IA' },
    { id: 'market', keys: 'Ctrl + M', description: 'Ir para Mercado IA' },
    { id: 'config', keys: 'Ctrl + ,', description: 'Ir para Configurações' },
    { id: 'theme', keys: 'Ctrl + K', description: 'Alternar tema' },
    { id: 'share', keys: 'Ctrl + Shift + S', description: 'Compartilhar' },
    { id: 'close', keys: 'Escape', description: 'Fechar modais' },
    { id: 'confirm', keys: 'Ctrl + Enter', description: 'Confirmar formulário' },
    { id: 'new', keys: 'Ctrl + N', description: 'Novo item' },
    { id: 'edit', keys: 'Ctrl + E', description: 'Editar item' },
    { id: 'delete', keys: 'Ctrl + D', description: 'Deletar item' },
    { id: 'search', keys: 'Ctrl + /', description: 'Focar na busca' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ⌨️ Atalhos de Teclado
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono">
                  {shortcut.keys}
                </kbd>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            Pressione Escape para fechar
          </div>
        </div>
      </div>
    </div>
  );
};

KeyboardShortcutsHelp.propTypes = {
};
