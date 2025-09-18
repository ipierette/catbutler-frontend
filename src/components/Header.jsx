import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { isVisitorMode, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      console.log('🔄 Header: Iniciando logout...');
      const result = await logout();
      
      if (result.success) {
        console.log('✅ Header: Logout bem-sucedido, redirecionando...');
        setMobileMenuOpen(false);
        navigate('/', { replace: true });
      } else {
        console.error('❌ Header: Erro no logout:', result.error);
        setMobileMenuOpen(false);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('🚨 Header: Erro inesperado no logout:', error);
      setMobileMenuOpen(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <header className="spa-header w-full header-glass px-responsive flex items-center justify-between z-header">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-center justify-center">
            <img
              src="/images/logo-catbutler.webp"
              alt="CatButler"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                console.log('🐱 Logo não carregou, mantendo elemento para layout');
                // Manter elemento mas com fallback visual
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn5CxPC90ZXh0Pgo8L3N2Zz4K';
              }}
              onLoad={() => console.log('🐱 Logo carregada com sucesso!')}
            />
          </div>
          <span className="font-bold text-base lg:text-lg tracking-wide text-gray-900 dark:text-gray-100">CatButler</span>
        </div>
        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <label htmlFor="search-desktop" className="sr-only">Buscar receitas, tarefas, dicas</label>
            <input
              id="search-desktop"
              type="text"
              placeholder="Buscar receitas, tarefas, dicas..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:ring-offset-2"
              aria-label="Campo de busca"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true"></i>
          </div>
        </div>

        {/* Botão Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-3 min-w-11 min-h-11 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          type="button"
          title="Menu"
          aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={mobileMenuOpen}
          tabIndex="0"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          {/* Toggle de tema com reserva de espaço para reduzir CLS */}
          <button
            onClick={toggleTheme}
            className="p-2.5 min-w-11 min-h-11 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-300 dark:border-gray-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            type="button"
            title={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
            aria-label={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
            tabIndex="0"
            style={{ width: '44px', height: '44px' }} // Dimensões fixas para reduzir CLS
          >
            <div 
              style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="transition-opacity duration-200"
            >
              {theme === "light" ? (
                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </header>

{mobileMenuOpen && (
  <>
    {/* Overlay para fechar ao tocar fora */}
    <div
      className="md:hidden fixed inset-0 bg-black/40 z-[98]"
      onClick={() => setMobileMenuOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setMobileMenuOpen(false);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Fechar menu"
    />

    {/* Menu mobile em tela cheia (acima do header) */}
    <dialog
      className="lg:hidden fixed inset-0 z-[99] bg-gray-900 text-white border-0 p-0 max-w-none max-h-none w-full h-full"
      open={mobileMenuOpen}
      aria-modal="true"
    >
      <div className="flex flex-col h-full min-h-0">
        {/* LISTA ROLÁVEL + AÇÕES NO FINAL */}
        <nav
          className="
            h-full overflow-y-auto px-4 space-y-2
            pt-20
            pb-[calc(1rem+env(safe-area-inset-bottom))]
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <Link to="/"            onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Home</Link>
          <Link to="/tarefas"     onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Tarefas</Link>
          <Link to="/cozinha-ia"  onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Cozinha IA</Link>
          <Link to="/faxina-ia"   onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Faxina IA</Link>
          <Link to="/mercado-ia"  onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Mercado IA</Link>
          <Link to="/agenda"      onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Agenda</Link>
          <Link to="/assistente"  onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Assistente</Link>
          <Link to="/dicas"       onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Dicas</Link>
          <Link to="/historico"   onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Histórico</Link>
          <Link to="/sobre"       onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Sobre</Link>
          <Link to="/config"      onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-primary-400 transition font-bold text-responsive-sm py-2 px-3 rounded-lg hover:bg-gray-800/60">Configurações</Link>

          {/* divisor opcional */}
          <hr className="my-3 border-gray-800/70" />

          {/* BOTÕES CONDICIONAIS */}
          <div className="rounded-xl overflow-hidden ring-1 ring-gray-700">
            <div className={isVisitorMode ? "grid grid-cols-2" : "grid grid-cols-1"}>
              {isVisitorMode ? (
                // Botões para visitantes (não logados)
                <>
                  <Link
                    to="/criar-conta"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary !rounded-none py-3 text-center font-semibold flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-user-plus text-xs" aria-hidden="true"></i>
                    <span>Criar Conta</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-green-600 hover:bg-gray-700 text-white py-3 text-center font-semibold flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-right-to-bracket text-xs" aria-hidden="true"></i>
                    <span>Entrar</span>
                  </Link>
                </>
              ) : (
                // Botão para usuários logados
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 text-center font-semibold flex items-center justify-center gap-2 rounded-xl"
                >
                  <i className="fa-solid fa-sign-out-alt text-xs" aria-hidden="true"></i>
                  <span>Sair</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </dialog>
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
        className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition border border-blue-200 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        type="button"
        title="Compartilhar CatButler"
        aria-label="Compartilhar CatButler"
        onClick={() => setOpen((v) => !v)}
        tabIndex="0"
      >
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      {open && createPortal(
        <div className="tooltip fixed right-4 top-20 w-80 rounded-lg shadow-lg p-4 z-tooltip animate-fade-in-up border">
          <div className="font-bold mb-2  text-gray-100 dark:text-gray-900">Compartilhe o CatButler</div>
          <div className="text-sm mb-2 text-gray-300 dark:text-gray-700 ">Conheça o CatButler! Organize sua casa com IA: receitas, faxina, mercado e mais. Acesse: <span className="font-mono text-blue-600">https://catbutler.app</span></div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy} 
              className="btn-primary px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button"
              aria-label={copied ? 'Link copiado' : 'Copiar link'}
            >
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <button 
              onClick={handleNativeShare} 
              className="btn-secondary px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              type="button"
              aria-label="Compartilhar"
            >
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
