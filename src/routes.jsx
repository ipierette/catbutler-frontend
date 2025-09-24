import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { withLazyLoading } from "./components/LazyWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/layout/Sidebar";
import Loading from "./components/Loading";

// Lazy loading das páginas
const Home = withLazyLoading(() => import("./pages/Home"), { 
  title: "Carregando Home...", 
  description: "Preparando seu dashboard personalizado" 
});

const Tarefas = withLazyLoading(() => import("./pages/Tarefas"), { 
  title: "Carregando Tarefas...", 
  description: "Organizando suas atividades" 
});

const Agenda = withLazyLoading(() => import("./pages/Agenda"), { 
  title: "Carregando Agenda...", 
  description: "Sincronizando seu calendário" 
});

const Assistente = withLazyLoading(() => import("./pages/Assistente"), { 
  title: "Carregando Assistente...", 
  description: "Ativando o assistente inteligente" 
});

const Config = withLazyLoading(() => import("./pages/Config"), { 
  title: "Carregando Configurações...", 
  description: "Preparando suas preferências" 
});

const Sobre = withLazyLoading(() => import("./pages/Sobre"), { 
  title: "Carregando Sobre...", 
  description: "Conhecendo o CatButler" 
});

const Debug = withLazyLoading(() => import("./pages/Debug"), { 
  title: "Carregando Debug...", 
  description: "Verificando versão do sistema" 
});

const Dicas = withLazyLoading(() => import("./pages/Dicas"), { 
  title: "Carregando Dicas...", 
  description: "Coletando dicas úteis" 
});

const Historico = withLazyLoading(() => import("./pages/Historico"), { 
  title: "Carregando Histórico...", 
  description: "Recuperando seu histórico" 
});

const Docs = withLazyLoading(() => import("./pages/Docs"), { 
  title: "Carregando Documentação...", 
  description: "Preparando guias e tutoriais" 
});

const FaxinaIA = lazy(() => import('./pages/FaxinaIA'));
const CozinhaMinimalista = lazy(() => import('./pages/CozinhaMinimalista'));
const MercadoIA = lazy(() => import('./pages/MercadoIA'));

// Atualizar rotas para lazy loading
const routes = [
  { path: '/faxina-ia', element: <FaxinaIA /> },
  { path: '/cozinha-ia', element: <CozinhaMinimalista /> },
  { path: '/mercado-ia', element: <MercadoIA /> },
];

const SignUp = withLazyLoading(() => import("./pages/SignUp"), { 
  title: "Carregando Cadastro...", 
  description: "Preparando formulário de registro" 
});

// Login com import direto para evitar problemas no Vercel
const Login = lazy(() => import("./pages/Login"));

const NotFound = withLazyLoading(() => import("./pages/NotFound"), { 
  title: "Carregando...", 
  description: "Processando solicitação" 
});

export default function AppRoutes() {
  return (
    <div className="spa-layout">
      {/* Header fixo */}
      <Header />
      
      {/* Layout principal com sidebar e conteúdo */}
      <div className="spa-main">
        {/* Sidebar - apenas no desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Área de conteúdo principal */}
        <main className="spa-content">
          <Suspense fallback={<Loading message="Carregando página..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tarefas" element={<Tarefas />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/assistente" element={<Assistente />} />
              <Route path="/config" element={<Config />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="/dicas" element={<Dicas />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/mercado-ia" element={<MercadoIA />} />
              <Route path="/cozinha-ia" element={<CozinhaMinimalista />} />
              <Route path="/faxina-ia" element={<FaxinaIA />} />
              <Route path="/criar-conta" element={<SignUp />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={
                <Suspense fallback={<Loading />}>
                  <Login />
                </Suspense>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      
      {/* Footer fixo */}
      <Footer />
    </div>
  );
}
