import React from 'react';
import { useAvatarUnlock } from '../hooks/useAvatarUnlock';
import { useCredits } from '../contexts/CreditsContext';
import { allAvatars } from '../utils/avatars';

function AvatarSelector({ selectedAvatar, onAvatarSelect, className = "" }) {
  const { 
    isAvatarUnlocked, 
    unlockAvatar, 
    getAvatarUnlockCost, 
    canUnlockAvatar 
  } = useAvatarUnlock();
  const { credits } = useCredits();

  const handleAvatarClick = (avatar) => {
    if (avatar.unlocked === false && !isAvatarUnlocked(avatar.id)) {
      // Avatar bloqueado - tentar desbloquear
      const cost = getAvatarUnlockCost(avatar.id);
      
      if (canUnlockAvatar(avatar.id, cost)) {
        const result = unlockAvatar(avatar.id, cost);
        
        if (result.success) {
          // Avatar desbloqueado com sucesso - selecionar automaticamente
          onAvatarSelect(avatar.id);
        } else {
          alert(result.message);
        }
      } else {
        if (credits < cost) {
          alert(`Você precisa de ${cost} créditos para desbloquear este avatar. Você tem apenas ${credits} créditos.`);
        }
      }
    } else {
      // Avatar já desbloqueado - selecionar normalmente
      onAvatarSelect(avatar.id);
    }
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      {allAvatars.map((avatar) => {
        const isLocked = avatar.unlocked === false && !isAvatarUnlocked(avatar.id);
        const cost = getAvatarUnlockCost(avatar.id);
        const canAfford = credits >= cost;
        
        return (
          <div key={avatar.id} className="relative">
            <button
              onClick={() => handleAvatarClick(avatar)}
              disabled={isLocked && !canAfford}
              className={`relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 group w-full ${
                selectedAvatar === avatar.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 transform scale-105'
                  : isLocked
                    ? canAfford
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:border-amber-500'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              title={isLocked ? `${avatar.name} - ${cost} créditos` : avatar.name}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  isLocked 
                    ? 'border-gray-300 dark:border-gray-600' 
                    : 'border-gray-200 dark:border-gray-600 group-hover:border-gray-300 dark:group-hover:border-gray-500'
                }`}>
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isLocked ? 'grayscale blur-sm' : ''
                    }`}
                  />
                  
                  {/* Overlay de bloqueio */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-white text-lg"></i>
                    </div>
                  )}
                  
                  {/* Badge de raridade para avatares especiais */}
                  {avatar.rarity && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      avatar.rarity === 'epic' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      ✨
                    </div>
                  )}
                </div>
                
                {/* Nome do avatar */}
                <span className={`text-xs font-medium truncate w-full text-center ${
                  isLocked 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {avatar.name}
                </span>
              </div>
              
              {/* Tooltip expandido no hover */}
              <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 max-w-48 ${
                isLocked ? 'bg-amber-600' : 'bg-gray-900'
              }`}>
                <div className="font-semibold">{avatar.name}</div>
                {avatar.description && (
                  <div className="text-xs opacity-90 mt-1">{avatar.description}</div>
                )}
                {isLocked && (
                  <div className="text-xs mt-1 flex items-center gap-1">
                    <i className="fa-solid fa-coins"></i>
                    <span className={canAfford ? 'text-green-300' : 'text-red-300'}>
                      {cost} créditos
                    </span>
                  </div>
                )}
                {isLocked && canAfford && (
                  <div className="text-xs mt-1 text-green-300">
                    Clique para desbloquear!
                  </div>
                )}
                {isLocked && !canAfford && (
                  <div className="text-xs mt-1 text-red-300">
                    Créditos insuficientes
                  </div>
                )}
                
                {/* Seta do tooltip */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                  isLocked ? 'border-t-amber-600' : 'border-t-gray-900'
                }`}></div>
              </div>
              
              {/* Badge de preço */}
              {isLocked && (
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  canAfford 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  <i className="fa-solid fa-coins text-xs"></i>
                  <span>{cost}</span>
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default AvatarSelector;