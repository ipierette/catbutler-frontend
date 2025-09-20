import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

function VisitorModeWrapper({ children, pageName = 'esta página' }) {
  const { isVisitorMode } = useAuth();

  if (!isVisitorMode) {
    return children;
  }

  return (
    <div className="relative min-h-screen">
      {/* Conteúdo original com overlay */}
      <div className="relative">
        {children}
        
        {/* Overlay de modo visitante */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="max-w-md mx-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              {/* Ícone */}
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-lock text-blue-600 dark:text-blue-400 text-2xl"></i>
              </div>
              
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Acesso Restrito
              </h3>
              
              {/* Descrição */}
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Para acessar {pageName}, você precisa criar uma conta ou fazer login.
                É rápido, gratuito e seguro!
              </p>
              
              {/* Botões de ação */}
              <div className="space-y-3">
                <Link
                  to="/criar-conta"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user-plus text-sm"></i>
                  <span>Criar Conta Grátis</span>
                </Link>
                
                <Link
                  to="/login"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-sign-in-alt text-sm"></i>
                  <span>Já tenho conta</span>
                </Link>
                
                <Link
                  to="/"
                  className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <i className="fa-solid fa-arrow-left text-xs"></i>
                  <span>Voltar ao Início</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VisitorModeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  pageName: PropTypes.string
};

export default VisitorModeWrapper;