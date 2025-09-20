import { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
    // Remover função das dependências para evitar loops infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Toasts desabilitados conforme solicitação do usuário
    // if (notification.showToast !== false) {
    //   showNotificationToast(newNotification);
    // }
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

  const value = useMemo(() => ({
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
    // Remover funções das dependências para evitar loops infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [notifications, unreadCount, isAuthenticated]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

NotificationsProvider.propTypes = {
  children: PropTypes.node.isRequired
};