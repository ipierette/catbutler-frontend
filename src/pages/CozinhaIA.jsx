import React, { useState, useRef } from 'react';
import VisitorModeWrapper from '../components/VisitorModeWrapper';
import useCozinhaIA from '../hooks/useCozinhaIA';

function CozinhaIA() {
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mostrarCardapio, setMostrarCardapio] = useState(false);
  const cardapioBoxRef = useRef(null);
  const cozinhaIA = useCozinhaIA();
  const { chat, cardapioSemanal, loadingCardapio, erroCardapio, gerarCardapioSemanal } = cozinhaIA;
  const conversas = chat?.conversa || [];

  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;
    await chat.enviarMensagem(mensagem);
    setMensagem('');
  };

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

  return (
    <VisitorModeWrapper pageName="a cozinha IA">
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Receitas e sugestões geradas por IA.</p>
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

        {/* Funções IA Rápidas */}
        <div className="p-4 pb-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Funções IA</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={async () => {
                  gerarCardapioSemanal();
                  setMostrarCardapio(true);
                }}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-calendar-week text-blue-600 dark:text-blue-400 text-sm"></i>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">Cardápio Semanal</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Planejamento automático</p>
                </div>
              </button>
              <button
                onClick={() => {/* lógica para sugestões personalizadas */}}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-sparkles text-purple-600 dark:text-purple-400 text-sm"></i>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">Sugestões Personalizadas</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Baseado no seu perfil</p>
                </div>
              </button>
            </div>
          </div>

          {/* Chat Modal */}
          {chatAberto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setChatAberto(false)}
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
                <h3 className="font-bold text-lg mb-2 text-center text-emerald-600 dark:text-emerald-400">Chef IA</h3>
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto mb-4">
                  {conversas.map((c, i) => (
                    <div key={i} className={`flex ${c.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-lg ${c.tipo === 'usuario' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}`}>{c.texto}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && enviarMensagem()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Digite sua mensagem..."
                  />
                  <button
                    onClick={enviarMensagem}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
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
        </div>
      </div>
    </VisitorModeWrapper>
  );
}

export default CozinhaIA;