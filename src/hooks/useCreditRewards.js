import { useCredits } from '../contexts/CreditsContext';

// Hook personalizado para gerenciar recompensas automáticas
export const useCreditRewards = () => {
  const { rewardActions, isAuthenticated } = useCredits();

  // Função para recompensar login diário
  const checkDailyLogin = () => {
    if (!isAuthenticated) return;

    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('last_daily_reward');
    
    if (lastLogin !== today) {
      rewardActions.dailyLogin();
      localStorage.setItem('last_daily_reward', today);
      
      // Verificar streak de login consecutivo
      checkLoginStreak();
    }
  };

  // Função para verificar sequência de logins consecutivos
  const checkLoginStreak = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const streakKey = 'login_streak';
    const lastStreakDate = localStorage.getItem('last_streak_date');
    const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
    
    if (lastStreakDate === yesterday.toDateString()) {
      const newStreak = currentStreak + 1;
      localStorage.setItem(streakKey, newStreak.toString());
      localStorage.setItem('last_streak_date', today.toDateString());
      
      // Recompensar a cada 3 dias consecutivos
      if (newStreak % 3 === 0) {
        rewardActions.consecutiveLogin(newStreak);
      }
    } else if (lastStreakDate !== today.toDateString()) {
      // Reset do streak se perdeu um dia
      localStorage.setItem(streakKey, '1');
      localStorage.setItem('last_streak_date', today.toDateString());
    }
  };

  // Função para recompensar uso do assistente IA
  const rewardAIConsultation = () => {
    if (!isAuthenticated) return;
    rewardActions.aiConsultation();
  };

  // Função para recompensar geração de receitas
  const rewardRecipeGenerated = () => {
    if (!isAuthenticated) return;
    rewardActions.recipeGenerated();
  };

  // Função para recompensar uso da lista de compras
  const rewardShoppingListUsed = () => {
    if (!isAuthenticated) return;
    rewardActions.shoppingListUsed();
  };

  // Função para recompensar personalização do perfil
  const rewardProfileCustomized = () => {
    if (!isAuthenticated) return;
    
    // Verificar se é a primeira personalização
    const hasCustomizedBefore = localStorage.getItem('profile_customized');
    if (!hasCustomizedBefore) {
      rewardActions.profileCustomized();
      localStorage.setItem('profile_customized', 'true');
    }
  };

  // Função para recompensar conclusão de tarefas
  const rewardTaskCompleted = () => {
    if (!isAuthenticated) return;
    rewardActions.taskCompleted();
  };

  // Função para verificar achievements especiais
  const checkAchievements = () => {
    if (!isAuthenticated) return;

    const achievements = JSON.parse(localStorage.getItem('achievements') || '{}');
    
    // Achievement: Primeiro Login
    if (!achievements.firstLogin) {
      achievements.firstLogin = true;
      localStorage.setItem('achievements', JSON.stringify(achievements));
      return 'Primeiro Login! Bem-vindo ao CatButler! 🎉';
    }

    // Achievement: Chef Iniciante (5 receitas geradas)
    const recipesGenerated = parseInt(localStorage.getItem('recipes_count') || '0');
    if (recipesGenerated >= 5 && !achievements.chefIniciante) {
      achievements.chefIniciante = true;
      localStorage.setItem('achievements', JSON.stringify(achievements));
      return 'Chef Iniciante! Você gerou 5 receitas! 👨‍🍳';
    }

    // Achievement: Organizador (10 listas de compras)
    const shoppingLists = parseInt(localStorage.getItem('shopping_lists_count') || '0');
    if (shoppingLists >= 10 && !achievements.organizador) {
      achievements.organizador = true;
      localStorage.setItem('achievements', JSON.stringify(achievements));
      return 'Organizador! 10 listas de compras criadas! 📝';
    }

    return null;
  };

  // Função para incrementar contadores
  const incrementCounter = (key) => {
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (current + 1).toString());
  };

  return {
    checkDailyLogin,
    rewardAIConsultation,
    rewardRecipeGenerated: () => {
      rewardRecipeGenerated();
      incrementCounter('recipes_count');
    },
    rewardShoppingListUsed: () => {
      rewardShoppingListUsed();
      incrementCounter('shopping_lists_count');
    },
    rewardProfileCustomized,
    rewardTaskCompleted,
    checkAchievements,
    isAuthenticated
  };
};