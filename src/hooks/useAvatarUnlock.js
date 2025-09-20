import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditsContext';

export const useAvatarUnlock = () => {
  const { user, isAuthenticated } = useAuth();
  const { spendCredits, credits } = useCredits();
  const [unlockedAvatars, setUnlockedAvatars] = useState([]);

  // Carregar avatares desbloqueados quando usuário logar
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUnlockedAvatars();
    } else {
      setUnlockedAvatars([]);
    }
    // Remover função das dependências para evitar loops infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const loadUnlockedAvatars = () => {
    if (!user) return;

    const userId = user.id;
    const storageKey = `unlocked_avatars_${userId}`;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setUnlockedAvatars(JSON.parse(saved));
      } else {
        // Avatares padrão desbloqueados
        const defaultUnlocked = ['axel', 'frajonilda', 'misscat', 'oliver'];
        setUnlockedAvatars(defaultUnlocked);
        localStorage.setItem(storageKey, JSON.stringify(defaultUnlocked));
      }
    } catch (error) {
      console.error('Erro ao carregar avatares desbloqueados:', error);
    }
  };

  const saveUnlockedAvatars = (avatars) => {
    if (!user) return;

    const userId = user.id;
    const storageKey = `unlocked_avatars_${userId}`;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(avatars));
    } catch (error) {
      console.error('Erro ao salvar avatares desbloqueados:', error);
    }
  };

  const isAvatarUnlocked = (avatarId) => {
    return unlockedAvatars.includes(avatarId);
  };

  const unlockAvatar = (avatarId, cost) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: 'Usuário não autenticado' };
    }

    if (isAvatarUnlocked(avatarId)) {
      return { success: false, message: 'Avatar já desbloqueado' };
    }

    if (credits < cost) {
      return { success: false, message: 'Créditos insuficientes' };
    }

    // Gastar créditos
    const spendResult = spendCredits(cost, `Avatar ${avatarId} desbloqueado`, 'unlock', '🎨');
    
    if (spendResult.success) {
      // Adicionar avatar à lista de desbloqueados
      const newUnlockedAvatars = [...unlockedAvatars, avatarId];
      setUnlockedAvatars(newUnlockedAvatars);
      saveUnlockedAvatars(newUnlockedAvatars);

      // Disparar evento de item desbloqueado
      window.dispatchEvent(new CustomEvent('itemUnlocked', {
        detail: { 
          itemName: `Avatar ${avatarId}`, 
          cost,
          type: 'avatar',
          avatarId
        }
      }));

      return { 
        success: true, 
        message: `Avatar ${avatarId} desbloqueado com sucesso!`,
        newBalance: spendResult.newBalance 
      };
    }

    return spendResult;
  };

  const getAvatarUnlockCost = (avatarId) => {
    // Mapeamento de custos por avatar
    const costs = {
      'catian-gogh': 20,
      // Adicionar outros avatares especiais no futuro
    };

    return costs[avatarId] || 0;
  };

  const canUnlockAvatar = (avatarId, cost) => {
    return isAuthenticated && !isAvatarUnlocked(avatarId) && credits >= cost;
  };

  return {
    unlockedAvatars,
    isAvatarUnlocked,
    unlockAvatar,
    getAvatarUnlockCost,
    canUnlockAvatar,
    isAuthenticated
  };
};