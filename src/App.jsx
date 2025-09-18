import React, { useEffect } from "react";
import CustomBackground from "./components/CustomBackground";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/Toast";
import { ConfirmationProvider } from "./components/ConfirmationDialog";
import ErrorBoundary from "./components/ErrorBoundary";
import { initializePerformanceOptimizations } from "./utils/performance";
import { BUILD_INFO } from "./build-info.js";
import "./debug-env.js"; // Import debug das env vars

function App() {
  useEffect(() => {
    // Inicializar otimizações de performance
    console.log('🚀 App iniciando...', BUILD_INFO);
    try {
      initializePerformanceOptimizations();
      console.log('✅ Otimizações de performance inicializadas');
    } catch (error) {
      console.error('❌ Erro ao inicializar otimizações:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <ConfirmationProvider>
            <CustomBackground />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ConfirmationProvider>
        </ToastProvider>
      </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Export explícito para evitar problemas de minificação
App.displayName = 'CatButlerApp';
export { App };
export default App;