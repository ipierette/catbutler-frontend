import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import logoCatButler from "../assets/images/logo-catbutler.png";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <>
      <header className="spa-header w-full header-glass px-responsive flex items-center justify-between z-header">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-center justify-center">
            <img 
              src={logoCatButler} 
              alt="CatButler Logo" 
              className="w-8 h-8 lg:w-10 lg:h-10 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
            />
          </div>
          <span className="font-bold text-base lg:text-lg tracking-wide text-gray-900 dark:text-gray-100">CatButler</span>
        </div>
        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar receitas, tarefas, dicas..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </div>

        {/* Botão Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-3 min-w-11 min-h-11 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 flex items-center justify-center"
          title="Menu"
          aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botão de compartilhamento */}
          <ShareTooltip theme={theme} />
          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            className="p-2.5 min-w-11 min-h-11 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-300 dark:border-gray-600 flex items-center justify-center"
            title={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
            aria-label={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
          >
            {theme === "light" ? (
              <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <>
          {/* Overlay de fundo */}
          <div 
            className="md:hidden mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMobileMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Fechar menu"
          />
          {/* Menu */}
          <div className="md:hidden mobile-menu">
            <nav className="flex flex-col p-4 space-y-2">
            <Link 
              to="/" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/tarefas" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarefas
            </Link>
            <Link 
              to="/cozinha-ia" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cozinha IA
            </Link>
            <Link 
              to="/faxina-ia" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Faxina IA
            </Link>
            <Link 
              to="/mercado-ia" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mercado IA
            </Link>
            <Link 
              to="/agenda" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Agenda
            </Link>
            <Link 
              to="/assistente" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Assistente
            </Link>
            <Link 
              to="/dicas" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dicas
            </Link>
            <Link 
              to="/historico" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Histórico
            </Link>
            <Link 
              to="/sobre" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/config" 
              className="text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Configurações
            </Link>
          </nav>
        </div>
        </>
      )}
  {/* Dock removido para evitar navegação duplicada */}
    </>
  );
}

export default Header;

// ShareTooltip Component
function ShareTooltip({ theme }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const tooltipRef = React.useRef(null);
  const shareText = `Conheça o CatButler! Organize sua casa com IA: receitas, faxina, mercado e mais. Acesse: https://catbutler.app`;

  // Fecha tooltip ao clicar fora
  React.useEffect(() => {
    function handleClick(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Copiar texto
  function handleCopy() {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Compartilhar nativo se disponível
  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title: 'CatButler', text: shareText, url: 'https://catbutler.app' });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="relative" ref={tooltipRef}>
      <button
        className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition border border-blue-200 dark:border-blue-700"
        title="Compartilhar CatButler"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      {open && createPortal(
        <div className="tooltip fixed right-4 top-20 w-80 rounded-lg shadow-lg p-4 z-tooltip animate-fade-in-up border">
          <div className="font-bold mb-2  text-gray-100 dark:text-gray-900">Compartilhe o CatButler</div>
          <div className="text-sm mb-2 text-gray-300 dark:text-gray-700 ">Conheça o CatButler! Organize sua casa com IA: receitas, faxina, mercado e mais. Acesse: <span className="font-mono text-blue-600">https://catbutler.app</span></div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-primary px-3 py-1 text-sm">
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <button onClick={handleNativeShare} className="btn-secondary px-3 py-1 text-sm">
              Compartilhar
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            Ajude a divulgar! <i className="fa-solid fa-rocket text-xs"></i>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

ShareTooltip.propTypes = {
  theme: PropTypes.string
};
