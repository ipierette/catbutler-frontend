import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNotifications } from '../contexts/NotificationsContext';

// Funções utilitárias para evitar duplicação
const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = now - date;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `${diffMinutes}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  return date.toLocaleDateString('pt-BR');
};

const formatTimeAgoDetailed = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = now - date;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''} atrás`;
  if (diffHours < 24) return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
  if (diffDays < 7) return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`;
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getNotificationIcon = (notification) => {
  const iconMap = {
    'credit_earned': '💰',
    'credit_spent': '💸',
    'achievement': '🏆',
    'info': 'ℹ️',
    'success': '✅',
    'warning': '⚠️',
    'error': '❌'
  };
  return iconMap[notification.type] || '🔔';
};

function NotificationsIcon() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    getRecentNotifications,
    isAuthenticated 
  } = useNotifications();
  
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const tooltipRef = useRef(null);
  const iconRef = useRef(null);

  // Fechar tooltip ao clicar fora - useEffect sempre é chamado
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

  // Não mostrar para usuários não autenticados
  if (!isAuthenticated) {
    return null;
  }

  const recentNotifications = getRecentNotifications(5);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    // Não fechar imediatamente, dar tempo para mover mouse ao tooltip
    setTimeout(() => {
      if (!tooltipRef.current?.matches(':hover') && !iconRef.current?.matches(':hover')) {
        setShowTooltip(false);
      }
    }, 100);
  };

  const handleIconClick = () => {
    setShowTooltip(!showTooltip);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setShowModal(true);
    setShowTooltip(false);
  };

  const handleNotificationKeyDown = (event, notification) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNotificationClick(notification);
    }
  };

  const handleViewAll = () => {
    setShowModal(true);
    setShowTooltip(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <>
      <div className="relative">
        {/* Ícone de Notificações */}
        <button
          ref={iconRef}
          className="relative p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300 border border-blue-200 dark:border-blue-700 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleIconClick}
          onKeyDown={handleKeyDown}
          title="Notificações"
          aria-label="Abrir notificações"
        >
          <i className="fa-solid fa-bell text-blue-600 dark:text-blue-300 text-base" aria-hidden="true"></i>
          
          {/* Bolinha vermelha para notificações não lidas */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Tooltip com Notificações Recentes */}
        {showTooltip && (
          <div
            ref={tooltipRef}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            role="tooltip"
            aria-label="Notificações recentes"
          >
            {/* Header do Tooltip */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-bell text-blue-600 dark:text-blue-400" aria-hidden="true"></i>
                  {' '}Notificações
                </h3>
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Fechar tooltip"
                >
                  <i className="fa-solid fa-times" aria-hidden="true"></i>
                </button>
              </div>
              
              {/* Ações rápidas */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Marcar todas como lida
                  </button>
                  <span className="text-gray-400">•</span>
                  <button
                    onClick={handleViewAll}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Ver todas
                  </button>
                </div>
              )}
            </div>

            {/* Lista de Notificações Recentes */}
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <i className="fa-solid fa-bell-slash text-2xl mb-2" aria-hidden="true"></i>
                  <p className="text-sm">Nenhuma notificação ainda</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      onKeyDown={(e) => handleNotificationKeyDown(e, notification)}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">
                          {getNotificationIcon(notification)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal completo */}
      {showModal && (
        <NotificationsModal 
          onClose={() => setShowModal(false)}
          notifications={notifications}
        />
      )}
    </>
  );
};

// Componente Modal
function NotificationsModal({ onClose, notifications }) {
  const { markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  // Fechar modal com tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleBackdropClick = (e) => {
    // Fechar apenas se clicou no backdrop (não no conteúdo do modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden my-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-bell text-blue-600 dark:text-blue-400" aria-hidden="true"></i>
              {' '}Todas as Notificações
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center w-8 h-8"
              aria-label="Fechar modal"
              title="Fechar (Esc)"
            >
              <i className="fa-solid fa-times text-base" aria-hidden="true"></i>
            </button>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <i className="fa-solid fa-check-double" aria-hidden="true"></i>
                {' '}Marcar todas como lidas
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <i className="fa-solid fa-bell-slash text-4xl mb-4" aria-hidden="true"></i>
              <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
              <p className="text-sm">Quando você receber notificações, elas aparecerão aqui.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-base font-medium mb-1 ${
                            !notification.read 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatTimeAgoDetailed(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                            title="Excluir notificação"
                            aria-label="Excluir notificação"
                          >
                            <i className="fa-solid fa-trash text-sm" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NotificationsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

export default NotificationsIcon;