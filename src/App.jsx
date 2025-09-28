import React, { useEffect } from "react";
import CustomBackground from "./components/CustomBackground";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CreditsProvider } from "./contexts/CreditsContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { ToastProvider } from "./components/Toast";
import { ConfirmationProvider } from "./components/ConfirmationDialog";
import ErrorBoundary from "./components/ErrorBoundary";
import CreditRewardsManager from "./components/CreditRewardsManager";
import { initializePerformanceOptimizations } from "./utils/performance";
import { BUILD_INFO } from "./build-info.js";
import { hasSupabaseConfig } from "./utils/supabase";

function App() {
  useEffect(() => {
    // Inicializar otimizações de performance
    console.log('🚀 App iniciando...', BUILD_INFO);
    
    // Verificar configuração Supabase
    if (!hasSupabaseConfig) {
      console.warn('⚠️ App rodando em MODO VISITANTE - Supabase não configurado');
    } else {
      console.log('✅ Supabase configurado corretamente');
    }
    
    try {
      initializePerformanceOptimizations();
      console.log('✅ Otimizações de performance inicializadas');
    } catch (error) {
      console.error('❌ Erro ao inicializar otimizações:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <CreditsProvider>
            <NotificationsProvider>
              <CreditRewardsManager />
              <ThemeProvider>
                <ToastProvider>
                  <ConfirmationProvider>
                    <CustomBackground />
                    <AppRoutes />
                  </ConfirmationProvider>
                </ToastProvider>
              </ThemeProvider>
            </NotificationsProvider>
          </CreditsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Export explícito para evitar problemas de minificação
App.displayName = 'CatButlerApp';
export { App };
export default App;