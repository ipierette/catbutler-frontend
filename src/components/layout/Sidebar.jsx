import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'fa-solid fa-home',
    color: 'text-primary-600 dark:text-primary-400'
  },
  {
    id: 'tasks',
    label: 'Tarefas',
    path: '/tarefas',
    icon: 'fa-solid fa-list-check',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'kitchen',
    label: 'Cozinha',
    path: '/cozinha-ia',
    icon: 'fa-solid fa-utensils',
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    id: 'cleaning',
    label: 'Faxina',
    path: '/faxina-ia',
    icon: 'fa-solid fa-broom',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'shopping',
    label: 'Mercado',
    path: '/mercado-ia',
    icon: 'fa-solid fa-shopping-cart',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'agenda',
    label: 'Agenda',
    path: '/agenda',
    icon: 'fa-solid fa-calendar',
    color: 'text-pink-600 dark:text-pink-400'
  },
  {
    id: 'assistant',
    label: 'Assistente',
    path: '/assistente',
    icon: 'fa-solid fa-robot',
    color: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'tips',
    label: 'Dicas',
    path: '/dicas',
    icon: 'fa-solid fa-lightbulb',
    color: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    id: 'history',
    label: 'Histórico',
    path: '/historico',
    icon: 'fa-solid fa-history',
    color: 'text-gray-600 dark:text-gray-400'
  },
  {
    id: 'about',
    label: 'Sobre',
    path: '/sobre',
    icon: 'fa-solid fa-info-circle',
    color: 'text-cyan-600 dark:text-cyan-400'
  },
  {
    id: 'config',
    label: 'Configurações',
    path: '/config',
    icon: 'fa-solid fa-cog',
    color: 'text-gray-600 dark:text-gray-400'
  }
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getDisplayName, getUserAvatar, isVisitorMode, logout } = useAuth();
  
  const userAvatar = getUserAvatar();
  const displayName = getDisplayName();

  console.log('🔍 Sidebar Debug:', {
    isVisitorMode,
    userAvatar,
    displayName
  });

  const handleLogout = async () => {
    try {
      console.log('🔄 Iniciando processo de logout...');
      const result = await logout();
      
      if (result.success) {
        console.log('✅ Logout bem-sucedido, redirecionando para home...');
        navigate('/', { replace: true });
      } else {
        console.error('❌ Erro no logout:', result.error);
        // Ainda assim, tenta navegar para home em caso de erro
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('🚨 Erro inesperado no handleLogout:', error);
      // Em caso de erro, ainda navega para home
      navigate('/', { replace: true });
    }
  };

  return (
    <aside className="spa-sidebar">
      <div className="p-4 h-full flex flex-col min-h-0">
        {/* User Section */}
        <div className="mb-7 mt-1">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary-500">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-white text-sm"></i>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Bem-vindo(a)!!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto min-h-0 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <i className={`${item.icon} w-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : item.color}`}></i>
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2 flex-shrink-0">
          {isVisitorMode ? (
            // Botões para visitantes (não logados)
            <div className="space-y-2">
              <Link 
                to="/criar-conta"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <i className="fa-solid fa-user-plus text-xs"></i>
                <span>Criar Conta</span>
              </Link>
              <Link 
                to="/login"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <i className="fa-solid fa-sign-in-alt text-xs"></i>
                <span>Entrar</span>
              </Link>
            </div>
          ) : (
            // Botão para usuários logados (apenas logout)
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-sign-out-alt text-xs" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
