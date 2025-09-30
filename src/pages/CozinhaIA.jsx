

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
      {/* Envolva todo o conteúdo em um único elemento pai */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-utensils text-orange-600 dark:text-orange-400"></i>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">Cozinha IA</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receitas e cardápios gerados por IA. Compartilhe suas receitas e fotos!</p>
              </div>
            </div>
            <button
              onClick={() => setChatAberto(true)}
              className="relative p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"
            >
              <i className="fa-solid fa-comments text-green-600 dark:text-green-400"></i>
              {conversas.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Funções rápidas */}
        <div className="p-4 pb-20 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => setModalReceita(true)}
              className="flex-1 px-4 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center gap-3 border border-orange-200 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-800 transition-all"
            >
              <i className="fa-solid fa-plus-circle text-orange-600 dark:text-orange-400"></i>
              <span className="font-medium text-orange-700 dark:text-orange-300">Enviar Receita Própria</span>
            </button>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ingredientesIndesejados}
                  onChange={e => setIngredientesIndesejados(e.target.value)}
                  placeholder="Ex: peixe, ovo, pimentão"
                  className="flex-1 px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && ingredientesIndesejados.trim()) {
                      setIngredientesLista(arr => [...arr, ...ingredientesIndesejados.split(',').map(i => i.trim()).filter(Boolean)]);
                      setIngredientesIndesejados('');
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                  onClick={() => {
                    if (ingredientesIndesejados.trim()) {
                      setIngredientesLista(arr => [...arr, ...ingredientesIndesejados.split(',').map(i => i.trim()).filter(Boolean)]);
                      setIngredientesIndesejados('');
                    }
                  }}
                >
                  Adicionar
                </button>
              </div>
              {ingredientesLista.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {ingredientesLista.map((ing, idx) => (
                    <span key={ing+idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full text-xs flex items-center gap-1">
                      {ing}
                      <button type="button" className="ml-1 text-blue-400 hover:text-blue-700 dark:hover:text-blue-100" onClick={() => setIngredientesLista(arr => arr.filter((_, i) => i !== idx))}>
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
                className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center gap-3 border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all justify-center mt-1"
              >
                <i className="fa-solid fa-calendar-week text-blue-600 dark:text-blue-400"></i>
                <span className="font-medium text-blue-700 dark:text-blue-300">Gerar Cardápio Semanal</span>
              </button>
            </div>
            <button
              onClick={() => setModalFeedback(true)}
              className="flex-1 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center gap-3 border border-purple-200 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
            >
              <i className="fa-solid fa-face-smile text-purple-600 dark:text-purple-400"></i>
              <span className="font-medium text-purple-700 dark:text-purple-300">Feedback de Receita IA</span>
            </button>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div ref={cardapioBoxRef} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setMostrarCardapio(false)}
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
                <h3 className="font-bold text-lg mb-2 text-center text-emerald-600 dark:text-emerald-400">Cardápio Semanal</h3>
                {loadingCardapio && (
                  <div className="text-center py-6">
                    <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-500"></i>
                    <p className="mt-2 text-gray-500">Gerando cardápio...</p>
                  </div>
                )}
                {erroCardapio && (
                  <div className="text-center text-red-500 py-4">{erroCardapio}</div>
                )}
                {cardapioSemanal && !loadingCardapio && !erroCardapio && (
                  <>
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4 max-h-96 overflow-auto border border-gray-200 dark:border-gray-700">{cardapioSemanal}</pre>
                    <div className="flex gap-2 justify-center">
                      <button onClick={copiarCardapio} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm flex items-center gap-2"><i className="fa-solid fa-copy"></i> Copiar</button>
                      <button onClick={compartilharCardapio} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"><i className="fa-solid fa-share-nodes"></i> Compartilhar</button>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-3">Feito com IA no <a href="https://catbutler.com.br" className="underline hover:text-emerald-600">CatButler.com.br</a> 🐾</p>
                  </>
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
        </div>
      </div>
    </VisitorModeWrapper>
  );
}


