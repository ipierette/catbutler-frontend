import React, { useState } from "react";
import { useModal } from "../components/Modals";

export default function CozinhaIA() {
  const [ingredientes, setIngredientes] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState("");
  const [filtros, setFiltros] = useState({
    tempo: "Qualquer",
    dificuldade: "Qualquer",
    tipo: "Qualquer"
  });
  const [receitas, setReceitas] = useState([]);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagemChat, setMensagemChat] = useState("");
  const [conversa, setConversa] = useState([]);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('ingredientes'); // 'ingredientes' ou 'receitas'
  const [cardapioSemanal, setCardapioSemanal] = useState(null);
  const [gerandoCardapio, setGerandoCardapio] = useState(false);
  const [dicasAbertas, setDicasAbertas] = useState(true);
  const filtrosModal = useModal();

  const ingredientesSugeridos = [
    "Arroz", "Feijão", "Frango", "Carne", "Peixe", "Ovos", "Leite", "Queijo",
    "Tomate", "Cebola", "Alho", "Batata", "Cenoura", "Pimentão", "Abobrinha",
    "Macarrão", "Pão", "Azeite", "Sal", "Pimenta", "Orégano", "Manjericão"
  ];

  const tiposRefeicao = ["Qualquer", "Café da manhã", "Almoço", "Jantar", "Lanche", "Sobremesa"];
  const niveisDificuldade = ["Qualquer", "Fácil", "Médio", "Difícil"];
  const temposPreparo = ["Qualquer", "Até 15 min", "15-30 min", "30-60 min", "Mais de 1h"];

  const receitasExemplo = [
    {
      id: 1,
      nome: "Risotto de Frango com Legumes",
      tempo: "45 min",
      dificuldade: "Médio",
      porcoes: 4,
      ingredientes: ["Arroz", "Frango", "Cebola", "Alho", "Queijo", "Azeite"],
      instrucoes: [
        "Refogue a cebola e alho no azeite",
        "Adicione o frango cortado em cubos",
        "Acrescente o arroz e mexa até ficar translúcido",
        "Adicione caldo quente aos poucos",
        "Finalize com queijo ralado"
      ],
      dicas: "Mantenha o caldo sempre quente para o risotto ficar cremoso"
    },
    {
      id: 2,
      nome: "Omelete de Queijo com Tomate",
      tempo: "10 min",
      dificuldade: "Fácil",
      porcoes: 2,
      ingredientes: ["Ovos", "Queijo", "Tomate", "Sal", "Pimenta"],
      instrucoes: [
        "Bata os ovos com sal e pimenta",
        "Aqueça uma frigideira com azeite",
        "Despeje os ovos batidos",
        "Adicione queijo e tomate picado",
        "Dobre ao meio quando estiver firme"
      ],
      dicas: "Use fogo médio para não queimar a parte de baixo"
    },
    {
      id: 3,
      nome: "Macarrão com Molho de Tomate",
      tempo: "25 min",
      dificuldade: "Fácil",
      porcoes: 3,
      ingredientes: ["Macarrão", "Tomate", "Cebola", "Alho", "Azeite", "Orégano"],
      instrucoes: [
        "Cozinhe o macarrão conforme instruções",
        "Refogue cebola e alho no azeite",
        "Adicione tomates picados",
        "Tempere com sal, pimenta e orégano",
        "Misture com o macarrão cozido"
      ],
      dicas: "Reserve um pouco da água do macarrão para o molho"
    }
  ];

  const adicionarIngrediente = () => {
    if (novoIngrediente.trim()) {
      const processed = processTextInput(novoIngrediente, { maxLength: 50, required: true });
      if (processed.isValid && !ingredientes.includes(processed.sanitized)) {
        setIngredientes([...ingredientes, processed.sanitized]);
        setNovoIngrediente("");
      } else if (!processed.isValid) {
        alert(processed.errors[0]);
      }
    }
  };

  const removerIngrediente = (ingrediente) => {
    setIngredientes(ingredientes.filter(i => i !== ingrediente));
  };

  const temIngredienteCombinado = (ingredienteReceita, ingredientesDisponiveis) => {
    return ingredientesDisponiveis.some(ingDisponivel => 
      ingDisponivel.toLowerCase().includes(ingredienteReceita.toLowerCase()) || 
      ingredienteReceita.toLowerCase().includes(ingDisponivel.toLowerCase())
    );
  };

  const gerarReceitas = () => {
    // Simulação de geração de receitas baseada nos ingredientes
    const receitasFiltradas = receitasExemplo.filter(receita => {
      const temIngredientes = receita.ingredientes.some(ing => 
        temIngredienteCombinado(ing, ingredientes)
      );
      return temIngredientes;
    });
    
    setReceitas(receitasFiltradas.slice(0, 3));
    // Abrir automaticamente o card de receitas após gerar
    setActiveAccordion('receitas');
  };

  const gerarCardapioSemanal = async () => {
    setGerandoCardapio(true);
    setDicasAbertas(false); // Fechar dicas quando gerar cardápio
    
    // Simular geração de cardápio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const refeicoes = ['Café da Manhã', 'Almoço', 'Jantar'];
    
    const cardapio = diasSemana.map(dia => ({
      dia,
      refeicoes: refeicoes.map(refeicao => {
        const receitasDisponiveis = receitasExemplo.filter(r => 
          ingredientes.some(ing => 
            r.ingredientes.some(ingReceita => 
              ingReceita.toLowerCase().includes(ing.toLowerCase())
            )
          )
        );
        
        const receitaAleatoria = receitasDisponiveis[Math.floor(Math.random() * receitasDisponiveis.length)];
        
        return {
          tipo: refeicao,
          receita: receitaAleatoria || {
            nome: "Receita Sugerida",
            tempo: "30 min",
            dificuldade: "Fácil",
            ingredientes: ingredientes.slice(0, 3)
          }
        };
      })
    }));
    
    setCardapioSemanal(cardapio);
    setGerandoCardapio(false);
  };

  const copiarCardapio = () => {
    if (!cardapioSemanal) return;
    
    let textoCardapio = "CARDÁPIO SEMANAL - CatButler\n\n";
    
    cardapioSemanal.forEach(dia => {
              textoCardapio += `${dia.dia}\n`;
      dia.refeicoes.forEach(refeicao => {
        textoCardapio += `  • ${refeicao.tipo}: ${refeicao.receita.nome} (${refeicao.receita.tempo})\n`;
      });
      textoCardapio += "\n";
    });
    
    navigator.clipboard.writeText(textoCardapio).then(() => {
      alert("Cardápio copiado para a área de transferência!");
    });
  };

  const enviarMensagem = () => {
    if (mensagemChat.trim()) {
      const novaMensagem = {
        id: Date.now(),
        texto: mensagemChat,
        isUser: true,
        timestamp: new Date()
      };
      
      setConversa([...conversa, novaMensagem]);
      setMensagemChat("");
      
      // Simulação de resposta da IA
      setTimeout(() => {
        const respostaIA = {
          id: Date.now() + 1,
          texto: "Ótima pergunta! Posso te ajudar com dicas culinárias, substituições de ingredientes ou técnicas de preparo. O que você gostaria de saber?",
          isUser: false,
          timestamp: new Date()
        };
        setConversa(prev => [...prev, respostaIA]);
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative flex items-center justify-between w-full mx-auto glass-effect rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500 h-16 sm:h-18">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <i className="fa-solid fa-utensils text-xl sm:text-2xl text-orange-600 dark:text-orange-400" aria-label="cozinha"></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              <span className="visitante-span">Cozinha IA</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Receitas inteligentes com ingredientes disponíveis
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {ingredientes.length} ingrediente(s) adicionado(s)
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Coluna 1: Ingredientes e Receitas - Accordion */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Input de Ingredientes - Sanfona */}
          <section className="glass-effect rounded-xl shadow-lg fade-in-up bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-700 border border-orange-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 dark:bg-orange-600 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-200 dark:bg-red-600 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
            
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'ingredientes' ? null : 'ingredientes')}
              className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-colors rounded-xl relative z-10"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-utensils text-white text-sm"></i>
                </div>
                Ingredientes Disponíveis
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({ingredientes.length} adicionado{ingredientes.length !== 1 ? 's' : ''})
                </span>
              </h2>
              <div className="flex items-center justify-center w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full">
                <i className={`fa-solid fa-chevron-${activeAccordion === 'ingredientes' ? 'up' : 'down'} text-gray-800 dark:text-gray-200 text-sm`}></i>
              </div>
            </button>
            
            {activeAccordion === 'ingredientes' && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={novoIngrediente}
                onChange={(e) => setNovoIngrediente(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && adicionarIngrediente()}
                placeholder="Digite um ingrediente..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={adicionarIngrediente}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Adicionar
              </button>
            </div>

            {/* Ingredientes Adicionados */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredientes.map((ingrediente) => (
                <span
                  key={ingrediente}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                >
                  {ingrediente}
                  <button
                    onClick={() => removerIngrediente(ingrediente)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Ingredientes Sugeridos */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sugestões:</p>
              <div className="flex flex-wrap gap-1">
                {ingredientesSugeridos.map((ingrediente) => (
                  <button
                    key={ingrediente}
                    onClick={() => {
                      if (!ingredientes.includes(ingrediente)) {
                        setIngredientes([...ingredientes, ingrediente]);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {ingrediente}
                  </button>
                ))}
              </div>
                            </div>
                
                {/* Botões de Filtros e Gerar Receitas dentro do card */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={filtrosModal.openModal}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-filter"></i>
                    Filtros
                  </button>
                  <button
                    onClick={gerarReceitas}
                    disabled={ingredientes.length === 0}
                    className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:text-gray-600 dark:disabled:bg-gray-600 dark:disabled:text-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-search"></i>
                    Gerar Receitas
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Receitas Geradas - Accordion */}
          <section className="glass-effect rounded-xl shadow-lg fade-in-up bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-200 dark:bg-indigo-600 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
            
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'receitas' ? null : 'receitas')}
              className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors rounded-xl relative z-10"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-clipboard-list text-white text-sm"></i>
                </div>
                Receitas Sugeridas
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({receitas.length} encontrada{receitas.length !== 1 ? 's' : ''})
                </span>
              </h3>
              <div className="flex items-center justify-center w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full">
                <i className={`fa-solid fa-chevron-${activeAccordion === 'receitas' ? 'up' : 'down'} text-gray-800 dark:text-gray-200 text-sm`}></i>
              </div>
            </button>
            
            {activeAccordion === 'receitas' && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                {receitas.length > 0 ? (
                  <div className="space-y-4">
                    {receitas.map((receita) => (
                      <button
                        key={receita.id}
                        className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                        onClick={() => setReceitaSelecionada(receita)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">{receita.nome}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span><i className="fa-solid fa-clock mr-1"></i>{receita.tempo}</span>
                              <span><i className="fa-solid fa-chart-bar mr-1"></i>{receita.dificuldade}</span>
                              <span><i className="fa-solid fa-users mr-1"></i>{receita.porcoes} porções</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Ingredientes: {receita.ingredientes.join(", ")}
                            </p>
                          </div>
                          <span className="ml-4 px-3 py-1 bg-orange-500 text-white text-sm rounded-lg">
                            Ver Receita
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">
                      <i className="fa-solid fa-utensils text-gray-400"></i>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Nenhuma receita gerada ainda
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Adicione ingredientes e clique em "Gerar Receitas"
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Coluna 2: Assistente e Dicas */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-pink-200 dark:bg-pink-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-robot text-white text-sm"></i>
                </div>
                Assistente Culinário
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={gerarCardapioSemanal}
                  disabled={gerandoCardapio || ingredientes.length === 0}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  {gerandoCardapio ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Gerando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar-week"></i>
                      Cardápio Semanal
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setChatAberto(!chatAberto);
                    if (!chatAberto) {
                      setDicasAbertas(false); // Fechar dicas quando abrir chat
                    }
                  }}
                  className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                >
                  {chatAberto ? <i className="fa-solid fa-times"></i> : <i className="fa-solid fa-comment"></i>}
                </button>
              </div>
            </div>
            
            {chatAberto && (
              <div className="space-y-4">
                <div className="h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 chat-container">
                  {conversa.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          <i className="fa-solid fa-robot text-blue-500"></i>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Olá! Sou seu assistente culinário.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Como posso ajudar?
                        </p>
                      </div>
                    </div>
                  ) : (
                    conversa.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 ${msg.isUser ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg text-sm max-w-xs ${
                            msg.isUser
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-gray-200 dark:bg-blue-800 text-gray-900 dark:text-white bot-message shadow-sm'
                          }`}
                        >
                          {msg.texto}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mensagemChat}
                    onChange={(e) => setMensagemChat(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Pergunte sobre culinária..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm chat-input transition-all duration-200"
                  />
                  <button
                    onClick={enviarMensagem}
                    disabled={!mensagemChat.trim()}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}

            {/* Cardápio Semanal */}
            {cardapioSemanal && (
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-200 dark:border-gray-500 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-green-200 dark:bg-green-600 rounded-full -translate-y-6 translate-x-6 opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-emerald-200 dark:bg-emerald-600 rounded-full translate-y-4 -translate-x-4 opacity-30"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-calendar-week text-white text-xs"></i>
                    </div>
                    Cardápio Semanal
                  </h4>
                  <button
                    onClick={copiarCardapio}
                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    <i className="fa-solid fa-copy"></i>
                    Copiar
                  </button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto relative z-10">
                  {cardapioSemanal.map((dia, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{dia.dia}</h5>
                      <div className="space-y-1">
                        {dia.refeicoes.map((refeicao, refIndex) => (
                          <div key={refIndex} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">{refeicao.tipo}:</span>
                            <span className="text-gray-800 dark:text-gray-200 font-semibold">{refeicao.receita.nome}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">({refeicao.receita.tempo})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Dicas Rápidas - Accordion */}
          <section className="glass-effect rounded-xl shadow-lg fade-in-up bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 dark:bg-yellow-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-orange-200 dark:bg-orange-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <button
              onClick={() => setDicasAbertas(!dicasAbertas)}
              className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-yellow-50/50 dark:hover:bg-gray-700/50 transition-colors rounded-xl relative z-10"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-lightbulb text-white text-sm"></i>
                </div>
                Dicas Rápidas
              </h3>
              <div className="flex items-center justify-center w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full">
                <i className={`fa-solid fa-chevron-${dicasAbertas ? 'up' : 'down'} text-gray-800 dark:text-gray-200 text-sm`}></i>
              </div>
            </button>
            
            {dicasAbertas && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative z-10">
            
            <div className="space-y-3 text-sm">
              <div className="border border-blue-200 dark:border-blue-500/30 rounded-xl p-3">
                <p className="text-blue-800 dark:text-blue-100 font-medium leading-relaxed">
                  <strong>Substituição:</strong> Sem leite? Use água de coco ou leite de amêndoa.
                </p>
              </div>
              <div className="border border-green-200 dark:border-green-500/30 rounded-xl p-3">
                <p className="text-green-800 dark:text-green-100 font-medium leading-relaxed">
                  <strong>Técnica:</strong> Para arroz soltinho, lave antes de cozinhar.
                </p>
              </div>
              <div className="border border-yellow-200 dark:border-yellow-500/30 rounded-xl p-3">
                <p className="text-yellow-800 dark:text-yellow-100 font-medium leading-relaxed">
                  <strong>Tempero:</strong> Prove sempre antes de servir e ajuste o sal.
                </p>
              </div>
            </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modal da Receita */}
      {receitaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-effect rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {receitaSelecionada.nome}
              </h2>
              <button
                onClick={() => setReceitaSelecionada(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-orange-600 dark:text-orange-400 font-semibold">Tempo</p>
                <p className="text-orange-800 dark:text-orange-200">{receitaSelecionada.tempo}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-600 dark:text-blue-400 font-semibold">Dificuldade</p>
                <p className="text-blue-800 dark:text-blue-200">{receitaSelecionada.dificuldade}</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-semibold">Porções</p>
                <p className="text-green-800 dark:text-green-200">{receitaSelecionada.porcoes}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Ingredientes:</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {receitaSelecionada.ingredientes.map((ingrediente) => (
                  <li key={ingrediente}>{ingrediente}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Modo de Preparo:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {receitaSelecionada.instrucoes.map((instrucao, index) => (
                  <li key={`instrucao-${index}`}>{instrucao}</li>
                ))}
              </ol>
            </div>
            
            {receitaSelecionada.dicas && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-lightbulb"></i>Dica:
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">{receitaSelecionada.dicas}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Filtros */}
      {filtrosModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-filter text-orange-500"></i>
                  Filtros de Receitas
                </h3>
                <button
                  onClick={filtrosModal.closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="tempo-preparo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tempo de Preparo
                  </label>
                  <select
                    id="tempo-preparo"
                    value={filtros.tempo}
                    onChange={(e) => setFiltros({...filtros, tempo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {temposPreparo.map(tempo => (
                      <option key={tempo} value={tempo}>{tempo}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dificuldade
                  </label>
                  <select
                    id="dificuldade"
                    value={filtros.dificuldade}
                    onChange={(e) => setFiltros({...filtros, dificuldade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {niveisDificuldade.map(dificuldade => (
                      <option key={dificuldade} value={dificuldade}>{dificuldade}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tipo-refeicao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Refeição
                  </label>
                  <select
                    id="tipo-refeicao"
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {tiposRefeicao.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setFiltros({tempo: "Qualquer", dificuldade: "Qualquer", tipo: "Qualquer"})}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={filtrosModal.closeModal}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
