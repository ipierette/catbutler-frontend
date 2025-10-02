

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';
import useCozinhaIA from '../hooks/useCozinhaIA';

// ...existing code...

export default function CozinhaIA() {
  const { isVisitorMode } = useAuth();
  
  // Integração com o backend via hook personalizado
  const cozinhaIA = useCozinhaIA(isVisitorMode);

  // Cardápio semanal modal/box
  const [mostrarCardapio, setMostrarCardapio] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [modalReceita, setModalReceita] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(false);
  // Removido imagemReceita pois não é utilizado
  const [feedback, setFeedback] = useState('');
  const cardapioBoxRef = useRef(null);
  const chatScrollRef = useRef(null);
  const { cardapioSemanal, loadingCardapio, erroCardapio, gerarCardapioSemanal, chat } = cozinhaIA;

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
              <button
                onClick={() => setChatAberto(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 shrink-0"
              >
                <i className="fa-solid fa-comments"></i>
                <span className="hidden sm:inline">Chef IA</span>
                {conversas.length > 0 && (
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Grid de Funcionalidades */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Enviar Receita Própria */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setModalReceita(true)}
                className="w-full px-4 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center gap-3 border border-orange-200 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-800 transition-all"
              >
                <i className="fa-solid fa-plus-circle text-orange-600 dark:text-orange-400"></i>
                <span className="font-medium text-orange-700 dark:text-orange-300">Enviar Receita Própria</span>
              </button>
            </div>

            {/* Gerador de Cardápio com Exclusões */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-ban text-red-500"></i>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Exclusões Personalizadas</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <strong>Ingredientes:</strong> peixe, ovo, leite<br/>
                  <strong>Pratos inteiros:</strong> lasanha, feijoada, sushi
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ingredientesIndesejados}
                    onChange={e => setIngredientesIndesejados(e.target.value)}
                    placeholder="Ex: peixe, lasanha, ovo, feijoada"
                    className="flex-1 px-3 py-2 border border-red-200 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && ingredientesIndesejados.trim()) {
                        setIngredientesLista(arr => [...arr, ...ingredientesIndesejados.split(',').map(i => i.trim()).filter(Boolean)]);
                        setIngredientesIndesejados('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                    onClick={() => {
                      if (ingredientesIndesejados.trim()) {
                        setIngredientesLista(arr => [...arr, ...ingredientesIndesejados.split(',').map(i => i.trim()).filter(Boolean)]);
                        setIngredientesIndesejados('');
                      }
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              
              {ingredientesLista.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {ingredientesLista.map((ing, idx) => (
                    <span key={ing+idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-full text-xs flex items-center gap-1">
                      <i className="fa-solid fa-ban text-xs"></i>
                      {ing}
                      <button 
                        type="button" 
                        className="ml-1 text-red-400 hover:text-red-700 dark:hover:text-red-100" 
                        onClick={() => setIngredientesLista(arr => arr.filter((_, i) => i !== idx))}
                      >
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <button
                onClick={async () => {
                  await gerarCardapioSemanal({ ingredientesProibidos: ingredientesLista });
                  setMostrarCardapio(true);
                }}
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loadingCardapio}
              >
                {loadingCardapio ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span className="font-medium text-sm">Gerando...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-calendar-week"></i>
                    <span className="font-medium text-sm">Gerar Cardápio Semanal</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback de Receita IA */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setModalFeedback(true)}
                className="w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center gap-3 border border-purple-200 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
              >
                <i className="fa-solid fa-face-smile text-purple-600 dark:text-purple-400"></i>
                <span className="font-medium text-purple-700 dark:text-purple-300">Feedback de Receita IA</span>
              </button>
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
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">7</div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">Dias</div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">21</div>
                          <div className="text-xs text-orange-700 dark:text-orange-300">Refeições</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {ingredientesLista.length}
                          </div>
                          <div className="text-xs text-purple-700 dark:text-purple-300">Excluídos</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                          <div className="text-xs text-green-700 dark:text-green-300">Personalizado</div>
                        </div>
                      </div>
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

          {/* Spacing for mobile scroll */}
          <div className="h-16"></div>
        </div>
      </div>
    </VisitorModeWrapper>
  );
}


