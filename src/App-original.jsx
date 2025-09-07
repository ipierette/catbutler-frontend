import React from "react";
import CustomBackground from "./components/CustomBackground";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/Toast";
import { ConfirmationProvider } from "./components/ConfirmationDialog";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
