import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Debug logging para Vercel
console.log('🚀 CatButler Main.jsx iniciando...', {
  location: window.location.href,
  userAgent: navigator.userAgent,
  timestamp: new Date().toISOString()
});

// Capturar erros não tratados
window.addEventListener('error', (event) => {
  console.error('❌ Erro global capturado:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada não tratada:', event.reason);
});

// Função para importar App com fallback
async function loadApp() {
  try {
    console.log('📦 Importando App component...');
    const AppModule = await import('./App.jsx');
    console.log('✅ App component importado com sucesso');
    return AppModule.default;
  } catch (error) {
    console.error('❌ Erro ao importar App:', error);
    
    // Retorna um componente de erro funcional
    return function ErrorApp() {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐱 CatButler</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Erro ao carregar aplicação: {error.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '0.8rem 1.5rem', 
              fontSize: '1rem',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            🔄 Recarregar Página
          </button>
        </div>
      );
    };
  }
}

// Executar carregamento da aplicação
(async () => {
  try {
    console.log('🎯 Carregando aplicação...');
    const App = await loadApp();
    
    console.log('🎯 Montando aplicação no DOM...');
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Elemento root não encontrado no DOM');
    }
    
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('✅ Aplicação montada com sucesso!');
  } catch (error) {
    console.error('❌ Erro crítico ao montar aplicação:', error);
    
    // Fallback manual para casos extremos
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">🐱 CatButler</h1>
          <p style="font-size: 1.2rem; margin-bottom: 1rem;">Erro crítico: ${error.message}</p>
          <p style="margin-bottom: 2rem; opacity: 0.8;">Por favor, tente recarregar a página</p>
          <button onclick="window.location.reload()" style="padding: 0.8rem 1.5rem; font-size: 1rem; background: #f97316; color: white; border: none; border-radius: 0.5rem; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            🔄 Recarregar Página
          </button>
        </div>
      `;
    }
  }
})();
