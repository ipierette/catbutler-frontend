import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/** -----------------------------
 *  Dados base (mock)
 *  ----------------------------- */
const START_MSG = 'Olá! Sou o CatButler, seu assistente doméstico! 🐱\nComo posso ajudar você hoje?';

const mockMessages = [
  { id: 1, text: START_MSG, sender: "bot", timestamp: new Date().toISOString() },
];

const quickSuggestions = [
  { text: "Receitas rápidas para hoje", icon: "fa-solid fa-utensils" },
  { text: "Lista de compras semanal",   icon: "fa-solid fa-shopping-cart" },
  { text: "Cronograma de limpeza",      icon: "fa-solid fa-broom" },
  { text: "Organizar tarefas do dia",   icon: "fa-solid fa-tasks" },
];

/** Util: formata HH:MM */
const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function Assistente() {
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  // Refs de layout
  const pageRef = useRef(null);           // container da página
  const chatHeaderRef = useRef(null);     // header interno do chat
  const chatInputRef = useRef(null);      // rodapé com textarea/botão
  const scrollAreaRef = useRef(null);

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
    const pageTop   = pageRef.current.getBoundingClientRect().top || 0;
    const headerH   = chatHeaderRef.current?.offsetHeight ?? 0;
    const inputH    = chatInputRef.current?.offsetHeight ?? 0;

    const extFooter = getExternalFooterEl();
    const footerTop = extFooter
      ? extFooter.getBoundingClientRect().top
      : viewportH;

    // 1px de folga para compensar borda
    const h = Math.max(
      200,
      footerTop - pageTop - headerH - inputH - -0
    );
  setScrollH(h);
};

useLayoutEffect(() => {
  measure();

  const roHeader = new ResizeObserver(measure);
  const roInput  = new ResizeObserver(measure);
  chatHeaderRef.current && roHeader.observe(chatHeaderRef.current);
  chatInputRef.current  && roInput.observe(chatInputRef.current);

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
    let reply =
      "Entendi! Vou te ajudar com isso. Que tal começarmos organizando suas necessidades? 😸";

    if (/(receita|comida|cozinha)/.test(lower)) {
      reply =
        "Ótimo! Aqui vão algumas ideias:\n\n🍝 **Macarrão Alho e Óleo** (15 min)\n🥗 **Salada Caesar** (10 min)\n🍲 **Sopa de Legumes** (20 min)\n\nQual te interessa mais?";
    } else if (/(compra|mercado|lista)/.test(lower)) {
      reply =
        "Posso montar sua lista:\n\n🛒 **Lista Semanal**\n• Arroz, feijão, macarrão\n• Frango, carne, peixe\n• Frutas e verduras\n• Produtos de limpeza\n\nQuer adicionar algo?";
    } else if (/(limpeza|faxina|limpar)/.test(lower)) {
      reply =
        "Sugestão de cronograma:\n\n🧹 **Seg:** Cozinha/banheiros\n🧽 **Ter:** Quartos/roupas\n🪟 **Qua:** Sala/aspirar\n🧼 **Qui:** Faxina geral\n\nComeçamos por onde?";
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
    setMessages([{ id: 1, text: START_MSG, sender: "bot", timestamp: new Date().toISOString() }]);
  };

  /** -----------------------------
   *  UI
   *  ----------------------------- */
  const onlyWelcome = useMemo(() => messages.length === 1, [messages.length]);

  return (
    <div
      ref={pageRef}
      className="assistente-content flex flex-col"
      style={{
        // dá um mínimo agradável mesmo sem shell
        minHeight: "100dvh",
      }}
    >
      {/* Header interno do chat */}
      <div
        ref={chatHeaderRef}
        className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full grid place-items-center flex-shrink-0">
            <i className="fa-solid fa-cat text-white text-lg" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">CatButler IA</h3>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
            </p>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs" /> Novo Chat
        </button>
      </div>

      {/* Área rolável (altura definida via medição) */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="custom-scrollbar p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-gray-900/20 overflow-y-auto"
        style={{ height: `${scrollH}px` }}
      >
        {/* Estado vazio (apresentação) */}
        {onlyWelcome && (
          <div className="h-full grid place-items-center">
            <div className="text-center max-w-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Olá! Sou o CatButler IA{" "}
                <i className="fa-solid fa-cat text-blue-500 text-2xl" aria-hidden />
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Estou aqui para ajudar com receitas, compras, limpeza e organização da casa!
              </p>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                {quickSuggestions.map((s) => (
                  <button
                    key={`qs-${s.text}`}
                    onClick={() => send(s.text)}
                    className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left group"
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
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full grid place-items-center flex-shrink-0">
                  <i className="fa-solid fa-cat text-white text-sm" />
                </div>
              )}

              <div
                className={`${
                  m.sender === "user" ? "order-1" : "order-2"
                } max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl`}
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
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full grid place-items-center">
              <i className="fa-solid fa-cat text-white text-sm" />
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
        className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      >
        {/* Sugas rápidas quando já há conversa */}
        {messages.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickSuggestions.slice(0, 3).map((s, i) => (
              <button
                key={`quick-${s.text}`}
                onClick={() => send(s.text)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
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
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Enviar mensagem"
              title="Enviar mensagem"
            >
              <i className="fa-solid fa-paper-plane text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
