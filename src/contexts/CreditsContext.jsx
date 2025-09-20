import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CreditsContext = createContext();

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

export const CreditsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Inicializar créditos quando usuário logar
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeUserCredits();
    } else {
      // Limpar dados quando deslogar
      setCredits(0);
      setTransactions([]);
    }
  }, [isAuthenticated, user]);

  const initializeUserCredits = async () => {
    setLoading(true);
    try {
      const userId = user.id;
      const storageKey = `credits_${userId}`;
      const transactionsKey = `transactions_${userId}`;
      
      // Verificar se já tem créditos salvos
      const savedCredits = localStorage.getItem(storageKey);
      const savedTransactions = localStorage.getItem(transactionsKey);
      
      if (savedCredits === null) {
        // Novo usuário - dar 10 créditos iniciais
        const initialCredits = 10;
        setCredits(initialCredits);
        
        const welcomeTransaction = {
          id: Date.now(),
          type: 'bonus',
          amount: initialCredits,
          description: 'Bônus de boas-vindas! 🎉',
          date: new Date().toISOString(),
          icon: '🎁'
        };
        
        setTransactions([welcomeTransaction]);
        
        // Salvar no localStorage
        localStorage.setItem(storageKey, initialCredits.toString());
        localStorage.setItem(transactionsKey, JSON.stringify([welcomeTransaction]));
      } else {
        // Usuário existente - carregar dados salvos
        setCredits(parseInt(savedCredits));
        setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
      }
    } catch (error) {
      console.error('Erro ao inicializar créditos:', error);
    }
    setLoading(false);
  };

  const addCredits = (amount, description, type = 'earned', icon = '⭐') => {
    if (!isAuthenticated || !user) return;

    const newCredits = credits + amount;
    const transaction = {
      id: Date.now(),
      type,
      amount,
      description,
      date: new Date().toISOString(),
      icon
    };

    setCredits(newCredits);
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);

    // Salvar no localStorage
    const userId = user.id;
    localStorage.setItem(`credits_${userId}`, newCredits.toString());
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(newTransactions));

    // Disparar evento para notificações
    window.dispatchEvent(new CustomEvent('creditsEarned', {
      detail: { amount, description, newCredits }
    }));

    // Mostrar notificação de créditos ganhos
    showCreditNotification(amount, description);
  };

  const spendCredits = (amount, description, type = 'spent', icon = '💫') => {
    if (!isAuthenticated || !user || credits < amount) {
      return { success: false, message: 'Créditos insuficientes' };
    }

    const newCredits = credits - amount;
    const transaction = {
      id: Date.now(),
      type,
      amount: -amount, // Negativo para gastos
      description,
      date: new Date().toISOString(),
      icon
    };

    setCredits(newCredits);
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);

    // Salvar no localStorage
    const userId = user.id;
    localStorage.setItem(`credits_${userId}`, newCredits.toString());
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(newTransactions));

    // Disparar evento para notificações
    window.dispatchEvent(new CustomEvent('creditsSpent', {
      detail: { amount, description, newCredits }
    }));

    return { success: true, newBalance: newCredits };
  };

  const showCreditNotification = (amount, description) => {
    // Criar notificação flutuante
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-coins text-lg"></i>
        <span class="font-medium">+${amount} créditos!</span>
      </div>
      <div class="text-sm opacity-90">${description}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Funções específicas para diferentes ações
  const rewardActions = {
    dailyLogin: () => addCredits(1, 'Login diário', 'daily', '📅'),
    taskCompleted: () => addCredits(2, 'Tarefa concluída', 'task', '✅'),
    aiConsultation: () => addCredits(1, 'Consulta ao assistente IA', 'ai', '🤖'),
    recipeGenerated: () => addCredits(1, 'Receita gerada', 'recipe', '👨‍🍳'),
    shoppingListUsed: () => addCredits(3, 'Lista de compras usada', 'shopping', '🛒'),
    profileCustomized: () => addCredits(5, 'Perfil personalizado', 'profile', '🎨'),
    consecutiveLogin: (days) => addCredits(days, `${days} dias consecutivos`, 'streak', '🔥'),
  };

  // Funções de gasto
  const spendActions = {
    specialAvatar: () => spendCredits(20, 'Avatar Gato Dourado desbloqueado', 'unlock', '🐱'),
    customBorder: () => spendCredits(50, 'Borda de avatar personalizada', 'unlock', '🖼️'),
    premiumTheme: () => spendCredits(100, 'Tema premium desbloqueado', 'unlock', '🎨'),
    animatedAvatar: () => spendCredits(200, 'Avatar animado desbloqueado', 'unlock', '✨'),
    premiumFeatures: () => spendCredits(500, 'Funcionalidades premium', 'unlock', '👑')
  };

  const getRecentTransactions = (limit = 10) => {
    return transactions.slice(0, limit);
  };

  const getTotalEarned = () => {
    return transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalSpent = () => {
    return Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
  };

  const value = {
    credits,
    transactions,
    loading,
    addCredits,
    spendCredits,
    rewardActions,
    spendActions,
    getRecentTransactions,
    getTotalEarned,
    getTotalSpent,
    isAuthenticated
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};