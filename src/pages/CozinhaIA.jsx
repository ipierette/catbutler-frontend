

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';
import useCozinhaIA from '../hooks/useCozinhaIA';
import useCardapioHistory from '../hooks/useCardapioHistory';

// ...existing code...

export default function CozinhaIA() {
  const { isVisitorMode } = useAuth();
  
  // Integração com o backend via hook personalizado
  const cozinhaIA = useCozinhaIA(isVisitorMode);
  
  // Hook para histórico e analytics
  const cardapioHistory = useCardapioHistory();

  // Cardápio semanal modal/box
  const [mostrarCardapio, setMostrarCardapio] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [modalReceita, setModalReceita] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(false);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [modalAnalytics, setModalAnalytics] = useState(false);
  // Removido imagemReceita pois não é utilizado
  const [feedback, setFeedback] = useState('');
  const cardapioBoxRef = useRef(null);
  const chatScrollRef = useRef(null);
  const { cardapioSemanal, estatisticasCardapio, loadingCardapio, erroCardapio, gerarCardapioSemanal, chat } = cozinhaIA;

  // Ingredientes indesejados para filtro do cardápio semanal
  const [ingredientesIndesejados, setIngredientesIndesejados] = useState('');
  const [ingredientesLista, setIngredientesLista] = useState([]);
  const conversas = React.useMemo(() => chat?.conversa || [], [chat?.conversa]);

  // Auto-scroll para a última mensagem do chat
  useEffect(() => {
    if (chatAberto && chatScrollRef.current) {
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [conversas, chatAberto]);

  const enviarMensagem = useCallback(async () => {
    if (!mensagem.trim()) return;
    await chat.enviarMensagem(mensagem);
    setMensagem('');
  }, [mensagem, chat]);

  const copiarCardapio = () => {
    if (cardapioSemanal) {
      navigator.clipboard.writeText(cardapioSemanal + '\n\nFeito com IA no CatButler.com.br 🐾');
      alert('Cardápio copiado!');
    }
  };

  const compartilharCardapio = () => {
    if (navigator.share && cardapioSemanal) {
      navigator.share({
        title: 'Cardápio Semanal - CatButler',
        text: cardapioSemanal + '\n\nFeito com IA no CatButler.com.br 🐾',
        url: 'https://catbutler.com.br'
      });
    } else {
      copiarCardapio();
    }
  };

  // Função para envio de receita própria (com imagem)
  const enviarReceita = async (e) => {
    e.preventDefault();
    setModalReceita(false);
    alert('Receita enviada! Obrigado por contribuir.');
  };

  // Função para envio de feedback de receita IA
  const enviarFeedback = async (e) => {
    e.preventDefault();
    setModalFeedback(false);
    setFeedback('');
    alert('Feedback enviado! Obrigado pela colaboração.');
  };
  // Ref para auto-scroll do chat

  // Auto-scroll para a última mensagem do chat
  return (
    <VisitorModeWrapper pageName="a cozinha IA">
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="p-4 lg:p-6 space-y-6">
          
          {/* Header padronizado */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                <i className="fa-solid fa-utensils text-lg sm:text-xl text-orange-600 dark:text-orange-400" aria-label="cozinha"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Cozinha IA
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Receitas e cardápios gerados por IA gratuita. Compartilhe suas receitas e fotos!
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Histórico e Analytics - apenas para usuários logados */}
                {!isVisitorMode && (
                  <>
                    <button
                      onClick={() => setModalHistorico(true)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      title="Ver histórico de cardápios"
                    >
                      <i className="fa-solid fa-history"></i>
                      <span className="hidden lg:inline">Histórico</span>
                      {cardapioHistory.temHistorico && (
                        <span className="bg-blue-300 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                          {cardapioHistory.historico.length}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setModalAnalytics(true)}
                      className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      title="Ver analytics de preferências"
                    >
                      <i className="fa-solid fa-chart-pie"></i>
                      <span className="hidden lg:inline">Analytics</span>
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setChatAberto(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="fa-solid fa-comments"></i>
                  <span className="hidden sm:inline">Chef IA</span>
                  {conversas.length > 0 && (
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Exclusões Personalizadas */}
          {ingredientesLista.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-ban text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Exclusões Ativas</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">Estes itens serão evitados no cardápio</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredientesLista.map((ing, idx) => (
                  <span key={ing+idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-full text-sm flex items-center gap-2 font-medium">
                    <i className="fa-solid fa-ban text-xs"></i>
                    {ing}
                    <button 
                      type="button" 
                      className="text-red-400 hover:text-red-700 dark:hover:text-red-100 transition-colors" 
                      onClick={() => setIngredientesLista(arr => arr.filter((_, i) => i !== idx))}
                      title="Remover exclusão"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Configurar Exclusões */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-sliders text-orange-600 dark:text-orange-400 text-sm"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Personalizar Cardápio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure suas preferências antes de gerar</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Input de Exclusões */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fa-solid fa-ban text-red-500 mr-1"></i>
                  Ingredientes ou Pratos a Excluir (opcional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ingredientesIndesejados}
                    onChange={e => setIngredientesIndesejados(e.target.value)}
                    placeholder="Ex: peixe, lasanha, ovo, feijoada"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && ingredientesIndesejados.trim()) {
                        setIngredientesLista(arr => [...arr, ...ingredientesIndesejados.split(',').map(i => i.trim()).filter(Boolean)]);
                        setIngredientesIndesejados('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => {
                      if (ingredientesIndesejados.trim()) {
                        setIngredientesLista(arr => [...arr, ...ingredientesIndesejados.split(',').map(i => i.trim()).filter(Boolean)]);
                        setIngredientesIndesejados('');
                      }
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                    Adicionar
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <strong>Dica:</strong> Separe múltiplos itens com vírgulas. O sistema filtra automaticamente preparações relacionadas.
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Funcionalidades Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Gerador de Cardápio - Card Principal */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-calendar-week text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cardápio Semanal Personalizado</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">21 refeições únicas geradas por IA</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">7</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Dias</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">21</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Refeições</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {ingredientesLista.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Exclusões</div>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  await gerarCardapioSemanal({ ingredientesProibidos: ingredientesLista });
                  
                  // Salvar no histórico se usuário estiver logado
                  if (!isVisitorMode && cardapioSemanal && estatisticasCardapio) {
                    await cardapioHistory.saveCardapio({
                      cardapio: cardapioSemanal,
                      ingredientesExcluidos: ingredientesLista,
                      estatisticas: estatisticasCardapio,
                      pratos: estatisticasCardapio?.detalhes?.ingredientesUnicos || []
                    });
                  }
                  
                  setMostrarCardapio(true);
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loadingCardapio}
              >
                {loadingCardapio ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Criando seu cardápio personalizado...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magic-wand-sparkles text-lg"></i>
                    <span>Gerar Cardápio Semanal com IA</span>
                  </>
                )}
              </button>
              
              {ingredientesLista.length === 0 && (
                <p className="text-center text-sm text-blue-700 dark:text-blue-300 mt-3">
                  <i className="fa-solid fa-info-circle mr-1"></i>
                  Cardápio será gerado sem exclusões - máxima variedade!
                </p>
              )}
            </div>

            {/* Ações Secundárias */}
            <div className="space-y-4">
              {/* Enviar Receita Própria */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setModalReceita(true)}
                  className="w-full px-4 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center gap-3 border border-orange-200 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-800 transition-all"
                >
                  <i className="fa-solid fa-plus-circle text-orange-600 dark:text-orange-400"></i>
                  <span className="font-medium text-orange-700 dark:text-orange-300 text-sm">Enviar Receita</span>
                </button>
              </div>

              {/* Feedback de Receita IA */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setModalFeedback(true)}
                  className="w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center gap-3 border border-purple-200 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
                >
                  <i className="fa-solid fa-face-smile text-purple-600 dark:text-purple-400"></i>
                  <span className="font-medium text-purple-700 dark:text-purple-300 text-sm">Dar Feedback</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Modal */}
          {chatAberto && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[31.25rem] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-utensils text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Chef IA</h3>
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatAberto(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
                  </button>
                </div>

                {/* Mensagens */}
                <div ref={chatScrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                  {/* Banner de aviso para visitantes */}
                  {isVisitorMode && conversas.length === 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-600 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-info text-white text-sm"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                            Modo Visitante - 4 mensagens mensais restantes
                          </p>
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            <button
                              onClick={() => window.location.href = '/criar-conta'}
                              className="underline hover:no-underline font-medium"
                            >
                              Criar conta para conversas ilimitadas sobre receitas!
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {conversas.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fa-solid fa-utensils text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600 dark:text-gray-400">
                        Como posso ajudar na cozinha hoje?
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversas.map((c, i) => (
                        <div key={c.timestamp || i} className={`flex gap-3 ${c.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                          {c.tipo !== 'usuario' && (
                            <div className="w-8 h-8 bg-orange-500 rounded-full grid place-items-center flex-shrink-0">
                              <i className="fa-solid fa-utensils text-white text-sm"></i>
                            </div>
                          )}
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            c.tipo === 'usuario'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            <p className="text-sm">{c.texto}</p>
                          </div>
                          {c.tipo === 'usuario' && (
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full grid place-items-center flex-shrink-0">
                              <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-sm"></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mensagem}
                      onChange={e => setMensagem(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && enviarMensagem()}
                      placeholder="Digite sua pergunta..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={enviarMensagem}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!mensagem.trim()}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Cardápio Semanal */}
          {mostrarCardapio && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div ref={cardapioBoxRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-calendar-week text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Cardápio Semanal</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ingredientesLista.length > 0 && `Excluindo: ${ingredientesLista.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setMostrarCardapio(false)}
                  >
                    <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-lg"></i>
                  </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="flex-1 overflow-y-auto">
                  {loadingCardapio && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-500"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Gerando seu cardápio...</h4>
                      <p className="text-gray-500 dark:text-gray-400">A IA está criando receitas personalizadas para você</p>
                    </div>
                  )}
                  
                  {erroCardapio && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-exclamation-triangle text-2xl text-red-500"></i>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Erro ao gerar cardápio</h4>
                      <p className="text-red-500 dark:text-red-400">{erroCardapio}</p>
                    </div>
                  )}
                  
                  {cardapioSemanal && !loadingCardapio && !erroCardapio && (
                    <div className="p-6">
                      {/* Cardápio Formatado */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700 mb-6">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <div 
                            className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed"
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                          >
                            {cardapioSemanal}
                          </div>
                        </div>
                      </div>

                      {/* Estatísticas do Cardápio */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {estatisticasCardapio?.dias || 7}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">Dias</div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {estatisticasCardapio?.refeicoes || 21}
                          </div>
                          <div className="text-xs text-orange-700 dark:text-orange-300">Refeições</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {estatisticasCardapio?.excluidos || ingredientesLista.length}
                          </div>
                          <div className="text-xs text-purple-700 dark:text-purple-300">Excluídos</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {estatisticasCardapio?.personalizado || 100}%
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300">Personalizado</div>
                        </div>
                      </div>
                      
                      {/* Detalhes Adicionais (se disponível) */}
                      {estatisticasCardapio?.detalhes && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Análise do Cardápio</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Culinárias Brasileiras:</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {estatisticasCardapio.detalhes.culinariasBrasileiras?.join(', ') || 'Variadas'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Culinárias Internacionais:</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {estatisticasCardapio.detalhes.culinariasInternacionais?.join(', ') || 'Variadas'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Técnicas Culinárias:</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {estatisticasCardapio.detalhes.tecnicas?.join(', ') || 'Variadas'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Variedade:</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {estatisticasCardapio.detalhes.variedadeCultural || 0} culinárias, {estatisticasCardapio.detalhes.variedadeTecnica || 0} técnicas
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer com Ações */}
                {cardapioSemanal && !loadingCardapio && !erroCardapio && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button 
                        onClick={copiarCardapio} 
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
                      >
                        <i className="fa-solid fa-copy"></i>
                        Copiar Cardápio
                      </button>
                      <button 
                        onClick={compartilharCardapio} 
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
                      >
                        <i className="fa-solid fa-share-nodes"></i>
                        Compartilhar
                      </button>
                      <button 
                        onClick={async () => {
                          await gerarCardapioSemanal({ ingredientesProibidos: ingredientesLista });
                        }}
                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
                        disabled={loadingCardapio}
                      >
                        <i className="fa-solid fa-refresh"></i>
                        Gerar Novo
                      </button>
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                      Feito com IA no <a href="https://catbutler.com.br" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">CatButler.com.br</a> 🐾
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Enviar Receita Própria */}
          {modalReceita && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <form onSubmit={enviarReceita} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative flex flex-col gap-4">
                <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setModalReceita(false)}>
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
                <h3 className="font-bold text-lg mb-2 text-center text-orange-600 dark:text-orange-400">Enviar Receita Própria</h3>
                <input type="text" required placeholder="Nome da receita" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <textarea required placeholder="Ingredientes e modo de preparo" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" rows={4} />
                <input type="file" accept="image/*" className="" />
                <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Enviar</button>
              </form>
            </div>
          )}

          {/* Modal Feedback Receita IA */}
          {modalFeedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <form onSubmit={enviarFeedback} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative flex flex-col gap-4">
                <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setModalFeedback(false)}>
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
                <h3 className="font-bold text-lg mb-2 text-center text-purple-600 dark:text-purple-400">Feedback de Receita IA</h3>
                <textarea required placeholder="Conte como foi sua experiência com a receita gerada pela IA" value={feedback} onChange={e => setFeedback(e.target.value)} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" rows={4} />
                <input type="file" accept="image/*" className="" />
                <button type="submit" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Enviar Feedback</button>
              </form>
            </div>
          )}

          {/* Painel de Dicas e Tutoriais */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-b border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-lightbulb text-white"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Dicas e Tutoriais Culinários</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aprenda técnicas essenciais e tire suas dúvidas</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Chef IA - Receitas Personalizadas */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-robot text-white text-sm"></i>
                    </div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Chef IA Personalizado</h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    • Substitua ingredientes em receitas<br/>
                    • Peça receitas completas detalhadas<br/>
                    • Tire dúvidas sobre preparações<br/>
                    • Adapte pratos para suas restrições
                  </p>
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-comments"></i>
                    Conversar com Chef IA
                  </button>
                </div>

                {/* Técnicas Básicas */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
                    </div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">Técnicas Essenciais</h4>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                    • Como quebrar ovos sem casca<br/>
                    • Virar omelete na panela<br/>
                    • Temperos e proporções<br/>
                    • Pontos de carne e massas
                  </p>
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-play-circle"></i>
                    Ver Tutoriais
                  </button>
                </div>

                {/* Substituições Inteligentes */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-exchange-alt text-white text-sm"></i>
                    </div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Substituições</h4>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                    • Sem ovos? Use linhaça + água<br/>
                    • Sem leite? Leite de coco/aveia<br/>
                    • Sem glúten? Farinha de arroz<br/>
                    • Versões veganas de pratos
                  </p>
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-magic-wand-sparkles"></i>
                    Descobrir Alternativas
                  </button>
                </div>

                {/* Dicas de Conservação */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-snowflake text-white text-sm"></i>
                    </div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Conservação</h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    • Como armazenar ingredientes<br/>
                    • Tempo de validade dos alimentos<br/>
                    • Congelamento e descongelamento<br/>
                    • Organização da geladeira
                  </p>
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-refrigerator"></i>
                    Dicas de Armazenamento
                  </button>
                </div>

                {/* Planejamento de Refeições */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-calendar-days text-white text-sm"></i>
                    </div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Planejamento</h4>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    • Como planejar refeições semanais<br/>
                    • Aproveitamento de sobras<br/>
                    • Lista de compras inteligente<br/>
                    • Meal prep e organização
                  </p>
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-clipboard-list"></i>
                    Planejar Refeições
                  </button>
                </div>

                {/* Nutrição e Saúde */}
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-heart-pulse text-white text-sm"></i>
                    </div>
                    <h4 className="font-semibold text-teal-800 dark:text-teal-200">Nutrição</h4>
                  </div>
                  <p className="text-sm text-teal-700 dark:text-teal-300 mb-3">
                    • Combinações nutritivas<br/>
                    • Pratos balanceados e saudáveis<br/>
                    • Informações nutricionais<br/>
                    • Dietas especiais e restrições
                  </p>
                  <button
                    onClick={() => setChatAberto(true)}
                    className="w-full px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-apple-whole"></i>
                    Cozinhar Saudável
                  </button>
                </div>
              </div>

              {/* Dica em Destaque */}
              <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-star text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">💡 Dica do Chef</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                      <strong>Substituindo ovos em receitas:</strong> Para cada ovo, use 1 colher de sopa de linhaça moída + 3 colheres de água (deixe descansar 5 min). 
                      Funciona perfeitamente em bolos, panquecas e muffins!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                        #SubstituiçãoVegana
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                        #DicaDoChef
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                        #SemOvos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de Insights Rápidos - apenas para usuários logados */}
          {!isVisitorMode && cardapioHistory.preferenciasAnalytics && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-chart-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Suas Preferências Culinárias</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Baseado nos seus {cardapioHistory.preferenciasAnalytics.totalCardapios} cardápios gerados</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalAnalytics(true)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-chart-pie"></i>
                  Ver Detalhes
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Culinária Brasileira Favorita */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400 capitalize">
                    {cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas[0]?.[0] || 'Variada'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Culinária BR Favorita</div>
                </div>
                
                {/* Culinária Internacional Favorita */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400 capitalize">
                    {cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas[0]?.[0] || 'Variada'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Culinária Int. Favorita</div>
                </div>
                
                {/* Técnica Favorita */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400 capitalize">
                    {cardapioHistory.preferenciasAnalytics.tecnicasFavoritas[0]?.[0] || 'Variada'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Técnica Favorita</div>
                </div>
                
                {/* Ingrediente Mais Excluído */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {cardapioHistory.preferenciasAnalytics.ingredientesMaisExcluidos[0]?.[0] || 'Nenhum'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Mais Excluído</div>
                </div>
              </div>
              
              {/* Progresso de Exploração */}
              <div className="mt-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exploração Culinária</span>
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                    {cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas.length + 
                     cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas.length}/29 culinárias
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(((cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas.length + 
                                          cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas.length) / 29) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Histórico de Cardápios */}
          {modalHistorico && !isVisitorMode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-history text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Histórico de Cardápios</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cardapioHistory.historico.length} cardápios gerados
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setModalHistorico(false)}
                  >
                    <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-lg"></i>
                  </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="flex-1 overflow-y-auto p-6">
                  {cardapioHistory.loading ? (
                    <div className="text-center py-12">
                      <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
                      <p className="text-gray-600 dark:text-gray-400">Carregando histórico...</p>
                    </div>
                  ) : cardapioHistory.historico.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fa-solid fa-calendar-xmark text-4xl text-gray-400 mb-4"></i>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Nenhum cardápio gerado ainda</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Gere seu primeiro cardápio para começar a ver o histórico!</p>
                      <button
                        onClick={() => setModalHistorico(false)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                      >
                        Gerar Primeiro Cardápio
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cardapioHistory.historico.map((cardapio, index) => (
                        <div key={cardapio.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Cardápio #{cardapioHistory.historico.length - index}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(cardapio.data_geracao).toLocaleDateString('pt-BR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(cardapio.cardapio_completo);
                                  alert('Cardápio copiado!');
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Copiar cardápio"
                              >
                                <i className="fa-solid fa-copy"></i>
                              </button>
                              <button
                                onClick={() => cardapioHistory.deleteCardapio(cardapio.id)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Excluir cardápio"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          
                          {/* Exclusões do cardápio */}
                          {cardapio.ingredientes_excluidos?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exclusões:</p>
                              <div className="flex flex-wrap gap-1">
                                {cardapio.ingredientes_excluidos.map(ing => (
                                  <span key={ing} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs">
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Preview do cardápio */}
                          <div className="bg-white dark:bg-gray-800 rounded p-3 max-h-32 overflow-y-auto">
                            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {cardapio.cardapio_completo.substring(0, 200)}...
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Analytics de Preferências */}
          {modalAnalytics && !isVisitorMode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-chart-pie text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Analytics Culinárias</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Suas preferências e padrões culinários
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setModalAnalytics(false)}
                  >
                    <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400 text-lg"></i>
                  </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="flex-1 overflow-y-auto p-6">
                  {!cardapioHistory.preferenciasAnalytics ? (
                    <div className="text-center py-12">
                      <i className="fa-solid fa-chart-line text-4xl text-gray-400 mb-4"></i>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Dados Insuficientes</h4>
                      <p className="text-gray-600 dark:text-gray-400">Gere alguns cardápios para ver suas preferências!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Estatísticas Gerais */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-chart-bar text-blue-500"></i>
                          Estatísticas Gerais
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {cardapioHistory.preferenciasAnalytics.totalCardapios}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">Cardápios Gerados</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                              {cardapioHistory.preferenciasAnalytics.totalCardapios * 21}
                            </div>
                            <div className="text-sm text-indigo-700 dark:text-indigo-300">Refeições Criadas</div>
                          </div>
                        </div>
                      </div>

                      {/* Culinárias Brasileiras Favoritas */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                        <h4 className="font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-flag text-green-500"></i>
                          Culinárias Brasileiras Favoritas
                        </h4>
                        <div className="space-y-3">
                          {cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas.map(([culinaria, count]) => (
                            <div key={culinaria} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-green-700 dark:text-green-300 capitalize">
                                {culinaria}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-green-200 dark:bg-green-800 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(count / Math.max(...cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas.map(([,c]) => c))) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  {count}x
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Culinárias Internacionais Favoritas */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                        <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-globe text-orange-500"></i>
                          Culinárias Internacionais Favoritas
                        </h4>
                        <div className="space-y-3">
                          {cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas.map(([culinaria, count]) => (
                            <div key={culinaria} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-orange-700 dark:text-orange-300 capitalize">
                                {culinaria}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                                  <div 
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(count / Math.max(...cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas.map(([,c]) => c))) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                  {count}x
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Técnicas Culinárias Favoritas */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                        <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-fire text-purple-500"></i>
                          Técnicas Mais Usadas
                        </h4>
                        <div className="space-y-3">
                          {cardapioHistory.preferenciasAnalytics.tecnicasFavoritas.map(([tecnica, count]) => (
                            <div key={tecnica} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300 capitalize">
                                {tecnica}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                                  <div 
                                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(count / Math.max(...cardapioHistory.preferenciasAnalytics.tecnicasFavoritas.map(([,c]) => c))) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                  {count}x
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ingredientes Mais Excluídos */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                        <h4 className="font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-ban text-red-500"></i>
                          Ingredientes Mais Excluídos
                        </h4>
                        {cardapioHistory.preferenciasAnalytics.ingredientesMaisExcluidos.length > 0 ? (
                          <div className="space-y-3">
                            {cardapioHistory.preferenciasAnalytics.ingredientesMaisExcluidos.map(([ingrediente, count]) => (
                              <div key={ingrediente} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                                  {ingrediente}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-red-200 dark:bg-red-800 rounded-full h-2">
                                    <div 
                                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${(count / Math.max(...cardapioHistory.preferenciasAnalytics.ingredientesMaisExcluidos.map(([,c]) => c))) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    {count}x
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                            Você não excluiu nenhum ingrediente ainda
                          </p>
                        )}
                      </div>

                      {/* Insights Personalizados */}
                      <div className="lg:col-span-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
                        <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-lightbulb text-indigo-500"></i>
                          Insights Personalizados
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas.length + 
                               cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas.length}
                            </div>
                            <div className="text-indigo-700 dark:text-indigo-300">Culinárias Exploradas</div>
                          </div>
                          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {cardapioHistory.preferenciasAnalytics.tecnicasFavoritas.length}
                            </div>
                            <div className="text-indigo-700 dark:text-indigo-300">Técnicas Dominadas</div>
                          </div>
                          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {Math.round((cardapioHistory.preferenciasAnalytics.totalCardapios / 52) * 100)}%
                            </div>
                            <div className="text-indigo-700 dark:text-indigo-300">Progresso Anual</div>
                          </div>
                        </div>
                        
                        {/* Recomendações baseadas em dados */}
                        <div className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                            🎯 Recomendações para Você
                          </h5>
                          <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                            {cardapioHistory.preferenciasAnalytics.culinariasBrasileirasFavoritas.length < 3 && (
                              <li>• Experimente mais culinárias brasileiras regionais</li>
                            )}
                            {cardapioHistory.preferenciasAnalytics.culinariasInternacionaisFavoritas.length < 5 && (
                              <li>• Explore culinárias internacionais como indiana ou tailandesa</li>
                            )}
                            {cardapioHistory.preferenciasAnalytics.tecnicasFavoritas.length < 4 && (
                              <li>• Varie mais as técnicas culinárias (grelhado, marinado, etc.)</li>
                            )}
                            {cardapioHistory.preferenciasAnalytics.ingredientesMaisExcluidos.length === 0 && (
                              <li>• Você é bem aventureiro(a) - não exclui ingredientes!</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Spacing for mobile scroll */}
          <div className="h-16"></div>
        </div>
      </div>
    </VisitorModeWrapper>
  );
}


