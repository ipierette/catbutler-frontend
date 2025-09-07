import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { createPortal } from "react-dom";
import logoCatButler from "../assets/images/logo-catbutler.png";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full glass-effect shadow-lg py-2 px-3 sm:px-4 flex items-center justify-between z-50" style={{height: '4rem', backdropFilter: 'blur(10px)'}}>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-center justify-center">
            <img 
              src={logoCatButler} 
              alt="CatButler Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
            />
          </div>
          <span className="font-bold text-base sm:text-lg lg:text-xl tracking-wide catbutler-title">CatButler</span>
        </div>
        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-2 lg:gap-3 xl:gap-4">
          <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm">Home</Link>
          <Link to="/tarefas" className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm">Tarefas</Link>
          <Link to="/cozinha-ia" className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm">Cozinha IA</Link>
          <Link to="/faxina-ia" className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm">Faxina IA</Link>
          <Link to="/mercado-ia" className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm">Mercado IA</Link>
          <Link to="/config" className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm">Configurações</Link>
        </nav>

        {/* Botão Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600"
          title="Menu"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="p-1 sm:p-1.5 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-300 dark:border-gray-600"
            title={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
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
          <div className="flex gap-2">
            <Link 
              to="/criar-conta" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white dark:text-midnight-800 font-bold text-xs sm:text-sm shadow-lg transition hover:scale-105 transform"
            >
              Criar Conta
            </Link>
            <Link 
              to="/login" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white dark:text-midnight-800 font-bold text-xs sm:text-sm shadow-lg transition hover:scale-105 transform"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <>
          {/* Overlay de fundo */}
          <div 
            className="md:hidden mobile-menu-overlay bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu */}
          <div className="md:hidden mobile-menu glass-effect shadow-lg border-t border-gray-200 dark:border-gray-600">
            <nav className="flex flex-col p-4 space-y-2">
            <Link 
              to="/" 
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/tarefas" 
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarefas
            </Link>
            <Link 
              to="/cozinha-ia" 
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cozinha IA
            </Link>
            <Link 
              to="/faxina-ia" 
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Faxina IA
            </Link>
            <Link 
              to="/mercado-ia" 
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mercado IA
            </Link>
            <Link 
              to="/config" 
              className="text-gray-800 dark:text-gray-200 hover:text-green-500 transition font-bold text-sm py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <div className={
          `fixed right-4 top-20 w-80 rounded-lg shadow-lg p-4 z-[99999] animate-fadeInDown border share-tooltip ` +
          (theme === 'dark' ? 'bg-[#181f2a] border-[#232b3a] text-white' : 'bg-white border-gray-200 text-gray-900')
        }>
          <div className="font-bold mb-2 text-gray-900 dark:text-gray-100">Compartilhe o CatButler</div>
          <div className="text-sm mb-2 text-gray-700 dark:text-gray-300">Conheça o CatButler! Organize sua casa com IA: receitas, faxina, mercado e mais. Acesse: <span className="font-mono text-blue-600">https://catbutler.app</span></div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="px-3 py-1 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition text-sm">
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <button onClick={handleNativeShare} className="px-3 py-1 rounded bg-green-500 text-white font-bold hover:bg-green-600 transition text-sm">
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
};
