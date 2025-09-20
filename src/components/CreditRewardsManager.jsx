import { useEffect } from 'react';
import { useCreditRewards } from '../hooks/useCreditRewards';
import { useNotificationEvents } from '../hooks/useNotificationEvents';

const CreditRewardsManager = () => {
  const { 
    checkDailyLogin,
    checkAchievements,
    isAuthenticated
  } = useCreditRewards();

  // Hook para conectar eventos de notificação
  useNotificationEvents();

  useEffect(() => {
    // Escutar evento de login
    const handleUserLogin = (event) => {
      console.log('🎁 Usuário logado, verificando recompensas...', event.detail);
      
      // Verificar e aplicar recompensa de login diário
      setTimeout(() => {
        checkDailyLogin();
        
        // Verificar achievements
        const achievement = checkAchievements();
        if (achievement) {
          console.log('🏆 Achievement desbloqueado:', achievement);
          // Disparar evento para notificação de achievement
          window.dispatchEvent(new CustomEvent('achievementUnlocked', {
            detail: { title: 'Achievement!', description: achievement }
          }));
        }

        // Verificar se é o primeiro login
        const isFirstLogin = !localStorage.getItem('has_logged_before');
        if (isFirstLogin) {
          localStorage.setItem('has_logged_before', 'true');
          window.dispatchEvent(new CustomEvent('dailyLoginReward', {
            detail: { isFirst: true }
          }));
        } else {
          window.dispatchEvent(new CustomEvent('dailyLoginReward', {
            detail: { isFirst: false }
          }));
        }
      }, 2000); // Aguardar o CreditsContext inicializar
    };

    // Escutar eventos personalizados de recompensas
    const handleRewardEvent = (event) => {
      const { type, data } = event.detail;
      console.log(`🎁 Evento de recompensa: ${type}`, data);

      switch (type) {
        case 'recipe_generated':
          // Será implementado quando houver integração com páginas
          break;
        case 'ai_consultation':
          // Será implementado quando houver integração com assistente
          break;
        case 'task_completed':
          // Será implementado quando houver integração com tarefas
          break;
        case 'profile_customized':
          // Será implementado quando houver integração com perfil
          break;
        default:
          console.log('Tipo de recompensa desconhecido:', type);
      }
    };

    // Adicionar listeners
    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('creditReward', handleRewardEvent);

    // Verificar se já está logado ao carregar o componente
    if (isAuthenticated) {
      setTimeout(() => {
        checkDailyLogin();
      }, 1000);
    }

    // Cleanup
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('creditReward', handleRewardEvent);
    };
    // Remover funções das dependências para evitar loops infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Função para mostrar notificação de achievement
  const showAchievementNotification = (message) => {
    // Criar notificação de achievement
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-2xl">🏆</div>
        <div>
          <div class="font-bold text-sm">Achievement Desbloqueado!</div>
          <div class="text-xs opacity-90 mt-1">${message}</div>
        </div>
      </div>
    `;
    
    // Adicionar animação de entrada
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.5s ease-out';
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  };

  // Este componente não renderiza nada visível
  return null;
};

export default CreditRewardsManager;