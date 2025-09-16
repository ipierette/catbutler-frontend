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

function App() {
  useEffect(() => {
    // Inicializar otimizações de performance
    console.log('🚀 App iniciando...');
    try {
      initializePerformanceOptimizations();
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

export default App;