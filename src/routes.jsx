import React from "react";
import { Routes, Route } from "react-router-dom";
import { withLazyLoading } from "./components/LazyWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/layout/Sidebar";

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

const Dicas = withLazyLoading(() => import("./pages/Dicas"), { 
  title: "Carregando Dicas...", 
  description: "Coletando dicas úteis" 
});

const Historico = withLazyLoading(() => import("./pages/Historico"), { 
  title: "Carregando Histórico...", 
  description: "Recuperando seu histórico" 
});

const CozinhaIA = withLazyLoading(() => import("./pages/CozinhaIA"), { 
  title: "Carregando Cozinha...", 
  description: "Ativando assistente culinário" 
});

const FaxinaIA = withLazyLoading(() => import("./pages/FaxinaIA"), { 
  title: "Carregando Faxina...", 
  description: "Preparando planejador de limpeza" 
});

const MercadoIA = withLazyLoading(() => import("./pages/MercadoIA"), { 
  title: "Carregando Mercado...", 
  description: "Ativando assistente de compras" 
});

const SignUp = withLazyLoading(() => import("./pages/SignUp"), { 
  title: "Carregando Cadastro...", 
  description: "Preparando formulário de registro" 
});

const Login = withLazyLoading(() => import("./pages/Login"), { 
  title: "Carregando Login...", 
  description: "Preparando área de acesso" 
});

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/assistente" element={<Assistente />} />
            <Route path="/config" element={<Config />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/dicas" element={<Dicas />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/mercado" element={<MercadoIA />} />
            <Route path="/cozinha" element={<CozinhaIA />} />
            <Route path="/faxina" element={<FaxinaIA />} />
            <Route path="/criar-conta" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      
      {/* Footer fixo */}
      <Footer />
    </div>
  );
}
