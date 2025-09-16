import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAuth } from '../contexts/AuthContext';

/** -----------------------------
 *  Dados base (mock)
 *  ----------------------------- */

// Personalidades do assistente
const PERSONALIDADES = {
  geral: {
    id: 'geral',
    nome: 'Assistente Geral',
    icon: 'fa-solid fa-cat',
    cor: 'from-pink-400 to-purple-500',
    startMsg: 'Olá! Sou o CatButler, seu assistente doméstico!\nComo posso ajudar você hoje?',
    sugestoes: [
      { text: "Como organizar melhor minha casa?", icon: "fa-solid fa-home" },
      { text: "Dicas para economizar no orçamento", icon: "fa-solid fa-piggy-bank" },
      { text: "Planejar cronograma familiar", icon: "fa-solid fa-calendar" },
      { text: "Ajuda com rotina doméstica", icon: "fa-solid fa-tasks" },
    ]
  },
  chef: {
    id: 'chef',
    nome: 'Chef IA',
    icon: 'fa-solid fa-utensils',
    cor: 'from-orange-500 to-red-500',
    startMsg: 'Olá! Sou o Chef IA do CatButler!\nVou te ajudar com receitas deliciosas e dicas culinárias!',
    sugestoes: [
      { text: "Receitas rápidas para hoje", icon: "fa-solid fa-utensils" },
      { text: "Cardápio semanal balanceado", icon: "fa-solid fa-calendar-week" },
      { text: "Dicas para economizar na cozinha", icon: "fa-solid fa-piggy-bank" },
      { text: "Receitas com ingredientes que tenho", icon: "fa-solid fa-leaf" },
    ]
  },
  compras: {
    id: 'compras', 
    nome: 'Compras IA',
    icon: 'fa-solid fa-shopping-cart',
    cor: 'from-green-500 to-emerald-500',
    startMsg: 'Olá! Sou o Compras IA do CatButler!\nVou te ajudar a organizar suas compras e economizar!',
    sugestoes: [
      { text: "Lista de compras semanal", icon: "fa-solid fa-shopping-cart" },
      { text: "Comparar preços de produtos", icon: "fa-solid fa-balance-scale" },
      { text: "Orçamento mensal para mercado", icon: "fa-solid fa-calculator" },
      { text: "Produtos em promoção", icon: "fa-solid fa-tags" },
    ]
  },
  limpeza: {
    id: 'limpeza',
    nome: 'Limpeza IA', 
    icon: 'fa-solid fa-broom',
    cor: 'from-blue-500 to-cyan-500',
    startMsg: 'Olá! Sou o Limpeza IA do CatButler!\nVou te ajudar com cronogramas e técnicas de limpeza!',
    sugestoes: [
      { text: "Cronograma de limpeza semanal", icon: "fa-solid fa-broom" },
      { text: "Técnicas de limpeza eficiente", icon: "fa-solid fa-sparkles" },
      { text: "Produtos caseiros de limpeza", icon: "fa-solid fa-bottle-water" },
      { text: "Organizar rotina de faxina", icon: "fa-solid fa-clock" },
    ]
  }
};

const mockMessages = [
  { id: 1, text: PERSONALIDADES.geral.startMsg, sender: "bot", timestamp: new Date().toISOString() },
];

/** Util: formata HH:MM */
const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function Assistente() {
  const { isVisitorMode } = useAuth();
  const [personalidadeAtiva, setPersonalidadeAtiva] = useState('geral');
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [monthlyMessages, setMonthlyMessages] = useState(() => {
    if (isVisitorMode) {
      const saved = localStorage.getItem('assistenteMonthlyMessages');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Personalidade atual
  const personalidade = PERSONALIDADES[personalidadeAtiva];
  const quickSuggestions = personalidade.sugestoes;

  // Função para trocar personalidade
  const trocarPersonalidade = (novaPersonalidade) => {
    if (novaPersonalidade === personalidadeAtiva) return;
    
    setPersonalidadeAtiva(novaPersonalidade);
    const novaPersonalidadeData = PERSONALIDADES[novaPersonalidade];
    
    // Reinicia a conversa com nova personalidade
    setMessages([{ 
      id: Date.now(), 
      text: novaPersonalidadeData.startMsg, 
      sender: "bot", 
      timestamp: new Date().toISOString() 
    }]);
  };

  // Atualizar contador no localStorage
  useEffect(() => {
    if (isVisitorMode) {
      localStorage.setItem('assistenteMonthlyMessages', monthlyMessages.toString());
    }
  }, [monthlyMessages]);

  // Refs de layout
  const pageRef = useRef(null);           // container da página
  const chatHeaderRef = useRef(null);     // header interno do chat
  const chatInputRef = useRef(null);      // rodapé com textarea/botão
  const scrollAreaRef = useRef(null);
  const bannerRef = useRef(null);         // banner de visitante

  // Altura calculada p/ a área rolável (fallback 320px)
  const [scrollH, setScrollH] = useState(320);

  // controla autoscroll
const nearBottomRef = useRef(true);      // usuário está perto do fim?
const firstPaintRef = useRef(true);      // primeira renderização

const isNearBottom = (el, margin = 120) => {
  // quanto falta para o fim
  return el.scrollHeight - (el.scrollTop + el.clientHeight) <= margin;
};

const scrollToBottom = (smooth = true) => {
  const el = scrollAreaRef.current;
  if (!el) return;
  // usa rAF p/ garantir que o layout já foi aplicado
  requestAnimationFrame(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  });
};

// atualiza flag se o usuário está perto do fim
const handleScroll = () => {
  const el = scrollAreaRef.current;
  if (!el) return;
  nearBottomRef.current = isNearBottom(el);
};


  /** -----------------------------
   *  Responsividade sem mexer no shell:
   *  mede a altura visível e calcula a área entre header e input.
   *  ----------------------------- */
  // ⬆️ mantenha seus imports/estados/refs como estão

// 1) helper para achar o footer externo (vários seletores de fallback)
const getExternalFooterEl = () =>
  document.querySelector(
    "footer.spa-footer, footer.footer-glass, footer[class*='footer']"
  );

const measure = () => {
    if (!pageRef.current) return;

    const viewportH = window.innerHeight;
    const pageTop = pageRef.current.getBoundingClientRect().top || 0;
    const headerH = chatHeaderRef.current?.offsetHeight ?? 0;
    const inputH = chatInputRef.current?.offsetHeight ?? 0;
    
    // Mede altura real do banner se estiver visível
    const bannerH = (isVisitorMode && bannerRef.current) ? bannerRef.current.offsetHeight : 0;

    const extFooter = getExternalFooterEl();
    const footerTop = extFooter
      ? extFooter.getBoundingClientRect().top
      : viewportH;

    // Calcula altura total ocupada pelos elementos fixos
    const fixedElementsHeight = headerH + inputH + bannerH;
    
    // Altura disponível para a área de scroll
    const availableHeight = footerTop - pageTop - fixedElementsHeight;
    
    const h = Math.max(200, availableHeight); // Remove a margem extra para ocupar todo o espaço
    
    // Debug temporário
    console.log('Medidas:', {
      viewportH,
      pageTop,
      headerH,
      inputH,
      bannerH,
      footerTop,
      fixedElementsHeight,
      availableHeight,
      finalHeight: h
    });
    
    setScrollH(h);
};

useLayoutEffect(() => {
  measure();

  const roHeader = new ResizeObserver(measure);
  const roInput  = new ResizeObserver(measure);
  const roBanner = new ResizeObserver(measure);
  
  chatHeaderRef.current && roHeader.observe(chatHeaderRef.current);
  chatInputRef.current  && roInput.observe(chatInputRef.current);
  bannerRef.current && roBanner.observe(bannerRef.current);

  // 👇 observa o footer externo (se existir) para recalcular quando ele mudar
  const extFooter = getExternalFooterEl();
  const roFooter  = extFooter ? new ResizeObserver(measure) : null;
  extFooter && roFooter.observe(extFooter);

  const onResize = () => measure();
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);

  if (document.fonts) {
    document.fonts.ready.then(measure).catch(() => {});
  }
  const t = setTimeout(measure, 0);

  return () => {
    clearTimeout(t);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    roHeader.disconnect();
    roInput.disconnect();
    roBanner.disconnect();
    roFooter?.disconnect();
  };
}, []);

  // trava o scroll da página sem mexer em position/overflow do body
useEffect(() => {
  const docEl = document.documentElement;

  // mantém a largura da barra de rolagem estável (evita "pulo" de layout)
  const prevGutter = docEl.style.scrollbarGutter;
  docEl.style.scrollbarGutter = "stable";

  const area = () => scrollAreaRef.current;

  const onWheel = (e) => {
    const box = area();
    if (!box) return;

    if (!box.contains(e.target)) {
      e.preventDefault();
      return;
    }

    const canUp = box.scrollTop > 0 && e.deltaY < 0;
    const canDown =
      box.scrollTop + box.clientHeight < box.scrollHeight && e.deltaY > 0;
    if (!(canUp || canDown)) e.preventDefault();
  };

  const onTouchMove = (e) => {
    const box = area();
    if (!box || !box.contains(e.target)) e.preventDefault();
  };

  document.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("touchmove", onTouchMove, { passive: false });

  return () => {
    document.removeEventListener("wheel", onWheel);
    document.removeEventListener("touchmove", onTouchMove);
    docEl.style.scrollbarGutter = prevGutter;
  };
}, []);

// auto-scroll para última mensagem
useEffect(() => {
  const el = scrollAreaRef.current;
  if (!el) return;

  // primeira renderização: vai direto para o fim
  if (firstPaintRef.current) {
    firstPaintRef.current = false;
    scrollToBottom(false);
    return;
  }

  // se o usuário já estava perto do fim, acompanha novas mensagens
  if (nearBottomRef.current) {
    scrollToBottom(true);
  }
}, [messages, isTyping, scrollH]);


  /** -----------------------------
   *  Simula resposta do bot
   *  ----------------------------- */
  const simulateBot = async (userText) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 750));

    const lower = userText.toLowerCase();
    let reply = "Entendi! Vou te ajudar com isso.";

    // Respostas baseadas na personalidade ativa
    if (personalidadeAtiva === 'chef') {
      if (/(receita|comida|cozinha|prato|ingrediente)/.test(lower)) {
        reply = "Ótima escolha! Aqui vão algumas sugestões:\n\n**Macarrão Alho e Óleo** (15 min)\n**Salada Caesar** (10 min)\n**Sopa de Legumes** (20 min)\n**Frango Grelhado** (25 min)\n\nQual te interessa mais? Posso dar a receita completa!";
      } else if (/(cardápio|planejamento|semana)/.test(lower)) {
        reply = "Vou te ajudar com o cardápio semanal!\n\n**Segunda**: Arroz, feijão e frango\n**Terça**: Macarronada com salada\n**Quarta**: Peixe grelhado com legumes\n**Quinta**: Risoto de camarão\n**Sexta**: Pizza caseira\n\nQuer que eu detalhe algum dia específico?";
      } else {
        reply = "Como Chef IA, posso te ajudar com:\n\n**Receitas personalizadas**\n**Cardápios balanceados**\n**Listas de ingredientes**\n**Dicas de tempo de preparo**\n**Economia na cozinha**\n\nO que você gostaria de cozinhar hoje?";
      }
    } else if (personalidadeAtiva === 'compras') {
      if (/(lista|compra|mercado|produto)/.test(lower)) {
        reply = "Perfeito! Vou montar sua lista inteligente:\n\n**Lista Semanal Sugerida**\n• Arroz 5kg, feijão 1kg\n• Frango 2kg, carne 1kg\n• Frutas: banana, maçã, laranja\n• Verduras: alface, tomate, cebola\n• Limpeza: detergente, sabão em pó\n\n**Orçamento estimado**: R$ 180,00\n\nQuer adicionar ou remover algo?";
      } else if (/(orçamento|economia|preço|barato)/.test(lower)) {
        reply = "Vou te ajudar a economizar!\n\n**Dicas de Economia:**\n• Compare preços em 3 mercados\n• Aproveite promoções da semana\n• Faça lista e não compre por impulso\n• Produtos de marca própria custam 30% menos\n• Compre no meio da semana\n\nQual é seu orçamento mensal para mercado?";
      } else {
        reply = "Como Compras IA, posso te ajudar com:\n\n**Listas inteligentes de compras**\n**Controle de orçamento**\n**Comparação de preços**\n**Promoções e ofertas**\n**Otimização de rotas de compra**\n\nVamos organizar suas compras?";
      }
    } else if (personalidadeAtiva === 'limpeza') {
      if (/(limpeza|faxina|limpar|cronograma)/.test(lower)) {
        reply = "Ótimo! Aqui está um cronograma eficiente:\n\n**Cronograma Semanal:**\n**Segunda**: Cozinha e área de serviço\n**Terça**: Banheiros completos\n**Quarta**: Quartos e roupas\n**Quinta**: Sala e aspirar tudo\n**Sexta**: Faxina geral (2h)\n**Sábado**: Organização\n**Domingo**: Descanso!\n\n**Tempo diário**: 30-45 minutos\n\nPor onde começamos?";
      } else if (/(produto|técnica|dica|natural)/.test(lower)) {
        reply = "Excelente! Aqui estão técnicas naturais:\n\n**Produtos Caseiros:**\n• **Vinagre + água**: vidros e espelhos\n• **Bicarbonato**: desentupir e desengordurar\n• **Limão + sal**: manchas difíceis\n• **Amaciante + água**: tirar pó sem espalhar\n\n**Técnica 15 minutos**: todo dia um cantinho\n\nQual ambiente precisa de atenção especial?";
      } else {
        reply = "Como Limpeza IA, posso te ajudar com:\n\n**Cronogramas personalizados**\n**Técnicas eficientes**\n**Produtos naturais**\n**Otimização de tempo**\n**Organização por cômodos**\n\nVamos deixar sua casa brilhando?";
      }
    } else {
      // Personalidade geral
      if (/(casa|organizar|organização)/.test(lower)) {
        reply = "Ótima pergunta! Para organizar melhor sua casa:\n\n**Planejamento**\n• Divida por áreas prioritárias\n• 15 minutos diários de arrumação\n• Envolva toda a família\n\n**Dicas Práticas**\n• Um lugar para cada coisa\n• Descarte o que não usa\n• Rotinas simples e consistentes\n\nQuer focar em algum cômodo específico?";
      } else if (/(economia|economizar|orçamento)/.test(lower)) {
        reply = "Economia doméstica é fundamental!\n\n**Dicas de Economia:**\n• Controle gastos mensais\n• Liste antes de comprar\n• Economize energia (lâmpadas LED)\n• Reduza consumo de água\n• Cozinhe em casa\n\nQuer ajuda com orçamento familiar?";
      } else if (/(cronograma|rotina|família)/.test(lower)) {
        reply = "Perfeito! Vou te ajudar com a rotina familiar:\n\n**Organização Familiar**\n• Reunião domingo: planejar semana\n• Divisão de tarefas por idade\n• Quadro de atividades visível\n• Recompensas para cumprimento\n\n**Estrutura Sugerida**\nManhã: preparar dia | Tarde: atividades | Noite: organizar próximo dia\n\nQual área da rotina precisa de atenção?";
      } else {
        reply = "Como seu assistente doméstico, posso te ajudar com muitas coisas:\n\n**Organização da casa**\n**Planejamento familiar**\n**Economia doméstica**\n**Rotinas e cronogramas**\n\nTambém posso alternar para especialistas:\n**Chef IA** | **Compras IA** | **Limpeza IA**\n\nO que você gostaria de organizar hoje?";
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: reply, sender: "bot", timestamp: new Date().toISOString() },
    ]);
    setIsTyping(false);
  };

  /** -----------------------------
   *  Envio de mensagem
   *  ----------------------------- */
  const send = async (txt = input) => {
    const text = (txt || "").trim();
    if (!text) return;

    // Verificar limite de mensagens para visitantes
    if (isVisitorMode) {
      if (monthlyMessages >= 4) {
        alert('Você atingiu o limite de 4 mensagens mensais para visitantes. Crie uma conta para conversar sem limites!');
        return;
      }
      setMonthlyMessages(prev => prev + 1);
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text, sender: "user", timestamp: new Date().toISOString() },
    ]);
    setInput("");
    await simulateBot(text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const startNewChat = () => {
    setMessages([{ 
      id: Date.now(), 
      text: personalidade.startMsg, 
      sender: "bot", 
      timestamp: new Date().toISOString() 
    }]);
  };

  /** -----------------------------
   *  UI
   *  ----------------------------- */
  const onlyWelcome = useMemo(() => messages.length === 1, [messages.length]);

  return (
    <div
      ref={pageRef}
      className="assistente-content flex flex-col w-full"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Header interno do chat */}
      <div
        ref={chatHeaderRef}
        className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex-shrink-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 bg-gradient-to-br ${personalidade.cor} rounded-full grid place-items-center flex-shrink-0`}>
            <i className={`${personalidade.icon} text-white text-lg`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{personalidade.nome}</h3>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor de Personalidades */}
          <div className="relative">
            <select
              value={personalidadeAtiva}
              onChange={(e) => trocarPersonalidade(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              disabled={isVisitorMode && monthlyMessages >= 4}
              title={isVisitorMode && monthlyMessages >= 4 ? 'Limite de mensagens mensais atingido' : 'Trocar especialidade'}
            >
              <option value="geral">Geral</option>
              <option value="chef">Chef</option>
              <option value="compras">Compras</option>
              <option value="limpeza">Limpeza</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none"></i>
          </div>

          <button
            onClick={startNewChat}
            className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
            disabled={isVisitorMode && monthlyMessages >= 4}
            title={isVisitorMode && monthlyMessages >= 4 ? 'Limite de mensagens mensais atingido' : ''}
          >
            <i className="fa-solid fa-plus text-xs" /> Novo Chat
          </button>
        </div>
      </div>

      {/* Banner para visitantes */}
      {isVisitorMode && (
        <div ref={bannerRef} className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <i className="fa-solid fa-info-circle"></i>
            <span>
              Modo Visitante: {4 - monthlyMessages} de 4 mensagens mensais restantes. 
              <button
                onClick={() => window.location.href = '/criar-conta'}
                className="ml-1 text-amber-900 dark:text-amber-100 underline hover:no-underline font-medium"
              >
                Criar conta para conversas ilimitadas
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Área rolável (altura definida via medição) */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="custom-scrollbar p-4 bg-gray-50/50 dark:bg-gray-900/20 overflow-y-auto"
        style={{ 
          height: `${scrollH}px`,
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        {/* Estado vazio (apresentação) */}
        {onlyWelcome && (
          <div className="h-full grid place-items-center">
            <div className="text-center max-w-md">
              <div className={`w-16 h-16 bg-gradient-to-br ${personalidade.cor} rounded-full grid place-items-center mx-auto mb-4`}>
                <i className={`${personalidade.icon} text-white text-2xl`} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {personalidade.nome}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                {personalidadeAtiva === 'geral' && "Estou aqui para ajudar com organização geral da casa!"}
                {personalidadeAtiva === 'chef' && "Vou te ajudar com receitas deliciosas e dicas culinárias!"}
                {personalidadeAtiva === 'compras' && "Vou organizar suas compras e te ajudar a economizar!"}
                {personalidadeAtiva === 'limpeza' && "Vou criar cronogramas de limpeza e dar dicas eficientes!"}
              </p>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                {quickSuggestions.map((s) => (
                  <button
                    key={`qs-${s.text}`}
                    onClick={() => send(s.text)}
                    disabled={isVisitorMode && monthlyMessages >= 4}
                    className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isVisitorMode && monthlyMessages >= 4 ? "Limite de mensagens mensais atingido" : ""}
                  >
                    <i
                      className={`${s.icon} text-primary-500 text-xs sm:text-sm mb-1 sm:mb-2 group-hover:scale-110 transition-transform`}
                    />
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {s.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversa */}
        {!onlyWelcome &&
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-3 mb-4 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "bot" && (
                <div className={`w-8 h-8 bg-gradient-to-br ${personalidade.cor} rounded-full grid place-items-center flex-shrink-0`}>
                  <i className={`${personalidade.icon} text-white text-sm`} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-primary-500 text-white rounded-br-sm"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-sm"
                  }`}
                >
                  <div className={`text-sm ${m.sender === "user" ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {m.text.split("\n").map((line, idx, arr) => (
                      <div key={`ln-${m.id}-${idx}`}>
                        {/\*\*(.*?)\*\*/.test(line) ? (
                          <span
                            // simples suporte a **negrito**
                            dangerouslySetInnerHTML={{
                              __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                            }}
                          />
                        ) : (
                          line
                        )}
                        {idx < arr.length - 1 && <br />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`text-xs mt-1 ${m.sender === "user" ? "text-right text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                  {fmtTime(m.timestamp)}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full grid place-items-center flex-shrink-0">
                  <i className="fa-solid fa-user text-primary-600 dark:text-primary-400 text-sm" />
                </div>
              )}
            </div>
          ))}

        {/* Indicador de digitação */}
        {isTyping && (
          <div className="flex items-end gap-3 mb-4">
            <div className={`w-8 h-8 bg-gradient-to-br ${personalidade.cor} rounded-full grid place-items-center`}>
              <i className={`${personalidade.icon} text-white text-sm`} />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé (input) */}
      <div
        ref={chatInputRef}
        className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex-shrink-0"
      >
        {/* Sugas rápidas quando já há conversa */}
        {messages.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickSuggestions.slice(0, 3).map((s, i) => (
              <button
                key={`quick-${s.text}`}
                onClick={() => send(s.text)}
                disabled={isVisitorMode && monthlyMessages >= 4}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title={isVisitorMode && monthlyMessages >= 4 ? "Limite de mensagens mensais atingido" : ""}
              >
                <i className={`${s.icon} text-xs`} /> {s.text}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onInput={(e) => {
                // auto-resize do textarea (até 180px)
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 180)}px`;
                // re-medimos porque o input cresceu
                measure();
              }}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="w-full p-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              style={{ minHeight: "2.75rem" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || isTyping || (isVisitorMode && monthlyMessages >= 4)}
              className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={isVisitorMode && monthlyMessages >= 4 ? "Limite de mensagens mensais atingido" : "Enviar mensagem"}
              title={isVisitorMode && monthlyMessages >= 4 ? "Limite de mensagens mensais atingido" : "Enviar mensagem"}
            >
              <i className="fa-solid fa-paper-plane text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
