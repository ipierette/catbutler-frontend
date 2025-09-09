import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    label: 'Cozinha IA',
    path: '/cozinha-ia',
    icon: 'fa-solid fa-utensils',
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    id: 'cleaning',
    label: 'Faxina IA',
    path: '/faxina-ia',
    icon: 'fa-solid fa-broom',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'shopping',
    label: 'Mercado IA',
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

  return (
    <aside className="spa-sidebar h-screen">
      <div className="p-4 h-full flex flex-col">
        {/* User Section */}
        <div className="mb-7 mt-1">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-white text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Visitante
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Bem-vindo ao CatButler
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
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

        {/* Quick Actions */}
        <div className="mt-6 space-y-2">
          <Link 
            to="/criar-conta"
            className="w-full btn-primary text-xs py-2 px-3 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            Criar Conta
          </Link>
          <Link 
            to="/login"
            className="w-full btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-sign-in-alt text-xs"></i>
            Entrar
          </Link>
        </div>
      </div>
    </aside>
  );
}
