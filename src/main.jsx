import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🔄 main.jsx: Iniciando aplicação...');

// Verificar se todos os módulos necessários estão disponíveis
const checkDependencies = () => {
  const checks = {
    React: typeof React !== 'undefined',
    ReactDOM: typeof createRoot !== 'undefined',
    App: typeof App !== 'undefined',
    rootElement: !!document.getElementById('root')
  };
  
  console.log('🔍 Verificação de dependências:', checks);
  
  const allGood = Object.values(checks).every(Boolean);
  if (!allGood) {
    console.error('❌ Algumas dependências faltaram:', Object.entries(checks).filter(([, ok]) => !ok));
  }
  
  return allGood;
};

if (checkDependencies()) {
  try {
    const root = createRoot(document.getElementById('root'));
    console.log('✅ Root criado com sucesso');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('✅ App renderizado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao renderizar app:', error);
    // Fallback: mostrar erro na tela
    document.getElementById('root').innerHTML = `
      <div style="padding: 2rem; text-align: center; color: red;">
        <h2>Erro ao carregar a aplicação</h2>
        <p>Detalhes: ${error.message}</p>
        <p>Por favor, recarregue a página.</p>
      </div>
    `;
  }
} else {
  console.error('❌ Dependências não disponíveis, não é possível iniciar a app');
  document.getElementById('root').innerHTML = `
    <div style="padding: 2rem; text-align: center; color: red;">
      <h2>Erro de carregamento</h2>
      <p>Algumas dependências não foram carregadas corretamente.</p>
      <p>Por favor, recarregue a página.</p>
    </div>
  `;
}
