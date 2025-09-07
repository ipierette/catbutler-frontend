import React from "react";
import { Routes, Route } from "react-router-dom";
import { withLazyLoading } from "./components/LazyWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";

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

const Mercado = withLazyLoading(() => import("./pages/Mercado"), { 
  title: "Carregando Mercado...", 
  description: "Conectando com supermercados" 
});

const CozinhaIA = withLazyLoading(() => import("./pages/CozinhaIA"), { 
  title: "Carregando Cozinha IA...", 
  description: "Ativando assistente culinário" 
});

const FaxinaIA = withLazyLoading(() => import("./pages/FaxinaIA"), { 
  title: "Carregando Faxina IA...", 
  description: "Preparando planejador de limpeza" 
});

const MercadoIA = withLazyLoading(() => import("./pages/MercadoIA"), { 
  title: "Carregando Mercado IA...", 
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
    <>
      {/* Header fixo */}
      <Header />
      
      {/* Conteúdo principal com scroll */}
      <main className="overflow-hidden" style={{height: '100dvh', paddingTop: '4rem', paddingBottom: '3.5rem'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/assistente" element={<Assistente />} />
          <Route path="/config" element={<Config />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/dicas" element={<Dicas />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/mercado" element={<Mercado />} />
          <Route path="/cozinha-ia" element={<CozinhaIA />} />
          <Route path="/faxina-ia" element={<FaxinaIA />} />
          <Route path="/mercado-ia" element={<MercadoIA />} />
          <Route path="/criar-conta" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Footer fixo */}
      <Footer />
    </>
  );
}
