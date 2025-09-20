import React, { useState } from 'react';
import { useCredits } from '../contexts/CreditsContext';
import { useCreditRewards } from '../hooks/useCreditRewards';

const CreditsDemo = () => {
  const { credits, spendActions, isAuthenticated } = useCredits();
  const { 
    rewardAIConsultation, 
    rewardRecipeGenerated, 
    rewardShoppingListUsed,
    rewardTaskCompleted 
  } = useCreditRewards();
  
  const [showDemo, setShowDemo] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const demoActions = [
    {
      id: 'ai_consultation',
      title: 'Consultar Assistente IA',
      description: 'Ganhe 1 crédito ao usar o assistente',
      icon: '🤖',
      reward: 1,
      action: rewardAIConsultation
    },
    {
      id: 'recipe_generated',
      title: 'Gerar Receita',
      description: 'Ganhe 1 crédito ao criar uma receita',
      icon: '👨‍🍳',
      reward: 1,
      action: rewardRecipeGenerated
    },
    {
      id: 'shopping_list',
      title: 'Usar Lista de Compras',
      description: 'Ganhe 3 créditos ao usar lista de compras',
      icon: '🛒',
      reward: 3,
      action: rewardShoppingListUsed
    },
    {
      id: 'task_completed',
      title: 'Completar Tarefa',
      description: 'Ganhe 2 créditos ao completar uma tarefa',
      icon: '✅',
      reward: 2,
      action: rewardTaskCompleted
    }
  ];

  const shopItems = [
    {
      id: 'special_avatar',
      title: 'Avatar Gato Dourado',
      description: 'Avatar exclusivo e brilhante',
      icon: '🐱',
      cost: 20,
      action: spendActions.specialAvatar
    },
    {
      id: 'custom_border',
      title: 'Borda Personalizada',
      description: 'Borda colorida para o avatar',
      icon: '🖼️',
      cost: 50,
      action: spendActions.customBorder
    },
    {
      id: 'premium_theme',
      title: 'Tema Premium',
      description: 'Cores e estilos exclusivos',
      icon: '🎨',
      cost: 100,
      action: spendActions.premiumTheme
    }
  ];

  const handleEarnCredits = (action, reward) => {
    action();
    
    // Criar evento personalizado para demonstração
    window.dispatchEvent(new CustomEvent('demoReward', {
      detail: { reward, action: 'demo_action' }
    }));
  };

  const handleSpendCredits = (action, cost, title) => {
    const result = action();
    if (result.success) {
      // Mostrar notificação de compra bem-sucedida
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-check-circle text-lg"></i>
          <span class="font-medium">${title} desbloqueado!</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <i className="fa-solid fa-coins text-xl"></i>
          Sistema de Créditos Demo
        </h3>
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {showDemo ? 'Ocultar Demo' : 'Ver Demo'}
        </button>
      </div>

      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
        <strong>Saldo atual:</strong> {credits} créditos
        <br />
        <em>Use as funcionalidades do CatButler para ganhar créditos e desbloqueie recompensas especiais!</em>
      </div>

      {showDemo && (
        <div className="space-y-6">
          {/* Seção Ganhar Créditos */}
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-plus-circle"></i>
              Ganhar Créditos (Demo)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demoActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleEarnCredits(action.action, action.reward)}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{action.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white text-sm">
                        {action.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {action.description}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        +{action.reward} créditos
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seção Loja de Recompensas */}
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-store"></i>
              Loja de Recompensas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shopItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <div className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                      {item.cost} créditos
                    </div>
                    <button
                      onClick={() => handleSpendCredits(item.action, item.cost, item.title)}
                      disabled={credits < item.cost}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        credits >= item.cost
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {credits >= item.cost ? 'Desbloquear' : 'Créditos insuficientes'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb"></i>
              Dicas para Ganhar Créditos
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 📅 Faça login todos os dias para ganhar créditos de bônus diário</li>
              <li>• 🔥 Mantenha uma sequência de logins para ganhar bônus extras</li>
              <li>• 🤖 Use o assistente IA para tirar dúvidas e ganhar créditos</li>
              <li>• 👨‍🍳 Gere receitas para descobrir pratos novos e ganhar créditos</li>
              <li>• 🛒 Use a lista de compras para se organizar e ganhar créditos</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsDemo;