import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationsContext';

export const useNotificationEvents = () => {
  const { 
    notifyCreditsEarned, 
    notifyCreditsSpent, 
    notifyAchievement,
    notifySuccess,
    notifyInfo,
    isAuthenticated 
  } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Handler para créditos ganhos
    const handleCreditsEarned = (event) => {
      const { amount, description } = event.detail;
      notifyCreditsEarned(amount, description);
    };

    // Handler para créditos gastos
    const handleCreditsSpent = (event) => {
      const { amount, description } = event.detail;
      notifyCreditsSpent(amount, description);
    };

    // Handler para achievements
    const handleAchievement = (event) => {
      const { title, description } = event.detail;
      notifyAchievement(title, description);
    };

    // Handler para login diário
    const handleDailyLogin = (event) => {
      const { isFirst } = event.detail || {};
      if (isFirst) {
        notifySuccess(
          'Bem-vindo!', 
          'Você recebeu 10 créditos de bônus inicial! 🎁'
        );
      } else {
        notifySuccess(
          'Login Diário!', 
          'Você ganhou 1 crédito por fazer login hoje! 📅'
        );
      }
    };

    // Handler para streak de login
    const handleLoginStreak = (event) => {
      const { days } = event.detail;
      notifyAchievement(
        `Sequência de ${days} dias!`,
        `Parabéns! Você manteve uma sequência de ${days} dias consecutivos! 🔥`
      );
    };

    // Handler para desbloqueio de itens
    const handleItemUnlocked = (event) => {
      const { itemName, cost } = event.detail;
      notifySuccess(
        'Item Desbloqueado!',
        `${itemName} foi desbloqueado por ${cost} créditos! ✨`
      );
    };

    // Handler para primeiro uso de funcionalidades
    const handleFirstUse = (event) => {
      const { feature, reward } = event.detail;
      notifyInfo(
        `Primeira vez usando ${feature}!`,
        `Você ganhou ${reward} créditos por experimentar esta funcionalidade! 🎉`
      );
    };

    // Registrar event listeners
    window.addEventListener('creditsEarned', handleCreditsEarned);
    window.addEventListener('creditsSpent', handleCreditsSpent);
    window.addEventListener('achievementUnlocked', handleAchievement);
    window.addEventListener('dailyLoginReward', handleDailyLogin);
    window.addEventListener('loginStreakReward', handleLoginStreak);
    window.addEventListener('itemUnlocked', handleItemUnlocked);
    window.addEventListener('firstUseReward', handleFirstUse);

    // Cleanup
    return () => {
      window.removeEventListener('creditsEarned', handleCreditsEarned);
      window.removeEventListener('creditsSpent', handleCreditsSpent);
      window.removeEventListener('achievementUnlocked', handleAchievement);
      window.removeEventListener('dailyLoginReward', handleDailyLogin);
      window.removeEventListener('loginStreakReward', handleLoginStreak);
      window.removeEventListener('itemUnlocked', handleItemUnlocked);
      window.removeEventListener('firstUseReward', handleFirstUse);
    };
  }, [
    isAuthenticated,
    notifyCreditsEarned,
    notifyCreditsSpent,
    notifyAchievement,
    notifySuccess,
    notifyInfo
  ]);
};