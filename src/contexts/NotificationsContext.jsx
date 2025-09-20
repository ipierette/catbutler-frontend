import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Inicializar notificações quando usuário logar
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserNotifications();
    } else {
      // Limpar dados quando deslogar
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  const loadUserNotifications = () => {
    if (!user) return;

    const userId = user.id;
    const storageKey = `notifications_${userId}`;
    
    try {
      const savedNotifications = localStorage.getItem(storageKey);
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        updateUnreadCount(parsedNotifications);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const saveNotifications = (newNotifications) => {
    if (!user) return;

    const userId = user.id;
    const storageKey = `notifications_${userId}`;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newNotifications));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  };

  const updateUnreadCount = (notificationsList = notifications) => {
    const unread = notificationsList.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  const addNotification = (notification) => {
    if (!isAuthenticated || !user) return;

    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    saveNotifications(updatedNotifications);

    // Mostrar notificação toast se especificado
    if (notification.showToast !== false) {
      showNotificationToast(newNotification);
    }
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    if (user) {
      const userId = user.id;
      const storageKey = `notifications_${userId}`;
      localStorage.removeItem(storageKey);
    }
  };

  const showNotificationToast = (notification) => {
    // Criar toast de notificação
    const toast = document.createElement('div');
    toast.className = `
      fixed top-20 right-4 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 
      dark:border-gray-700 rounded-lg shadow-xl z-[9999] transform translate-x-full 
      transition-transform duration-300 ease-out
    `;
    
    const iconMap = {
      'credit_earned': '💰',
      'credit_spent': '💸',
      'achievement': '🏆',
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌'
    };

    const colorMap = {
      'credit_earned': 'border-l-4 border-l-green-500',
      'credit_spent': 'border-l-4 border-l-red-500',
      'achievement': 'border-l-4 border-l-purple-500',
      'info': 'border-l-4 border-l-blue-500',
      'success': 'border-l-4 border-l-green-500',
      'warning': 'border-l-4 border-l-yellow-500',
      'error': 'border-l-4 border-l-red-500'
    };

    toast.innerHTML = `
      <div class="p-4 ${colorMap[notification.type] || ''}">
        <div class="flex items-start gap-3">
          <span class="text-lg flex-shrink-0">${iconMap[notification.type] || '🔔'}</span>
          <div class="flex-1">
            <div class="font-semibold text-gray-800 dark:text-white text-sm">
              ${notification.title}
            </div>
            <div class="text-gray-600 dark:text-gray-300 text-xs mt-1">
              ${notification.message}
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2" onclick="this.parentElement.parentElement.parentElement.remove()">
            <i class="fa-solid fa-times text-sm"></i>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  };

  // Funções específicas para diferentes tipos de notificação
  const notifyCreditsEarned = (amount, description) => {
    addNotification({
      type: 'credit_earned',
      title: `+${amount} créditos!`,
      message: description,
      icon: '💰',
      category: 'credits'
    });
  };

  const notifyCreditsSpent = (amount, description) => {
    addNotification({
      type: 'credit_spent',
      title: `${amount} créditos gastos`,
      message: description,
      icon: '💸',
      category: 'credits'
    });
  };

  const notifyAchievement = (title, description) => {
    addNotification({
      type: 'achievement',
      title: `🏆 ${title}`,
      message: description,
      icon: '🏆',
      category: 'achievements'
    });
  };

  const notifyInfo = (title, message) => {
    addNotification({
      type: 'info',
      title,
      message,
      icon: 'ℹ️',
      category: 'info'
    });
  };

  const notifySuccess = (title, message) => {
    addNotification({
      type: 'success',
      title,
      message,
      icon: '✅',
      category: 'success'
    });
  };

  const notifyWarning = (title, message) => {
    addNotification({
      type: 'warning',
      title,
      message,
      icon: '⚠️',
      category: 'warning'
    });
  };

  const notifyError = (title, message) => {
    addNotification({
      type: 'error',
      title,
      message,
      icon: '❌',
      category: 'error'
    });
  };

  const getNotificationsByCategory = (category) => {
    return notifications.filter(notification => notification.category === category);
  };

  const getRecentNotifications = (limit = 5) => {
    return notifications.slice(0, limit);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    notifyCreditsEarned,
    notifyCreditsSpent,
    notifyAchievement,
    notifyInfo,
    notifySuccess,
    notifyWarning,
    notifyError,
    getNotificationsByCategory,
    getRecentNotifications,
    isAuthenticated
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

NotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired
};