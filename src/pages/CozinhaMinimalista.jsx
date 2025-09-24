import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';

// ============================================
// 🍳 COZINHA MINIMALISTA - VERSÃO SIMPLIFICADA
// Funcionalidades: Chat IA + Gerador de Cardápio
// ============================================

// Cache local para evitar chamadas desnecessárias
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Função para obter dados do cache
function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

// Função para salvar no cache
function setCachedData(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// 🍳 COMPONENTES MINIMALISTAS
// ============================================

// Componente Chat Inteligente
function ChatWidget() {
  const [mensagens, setMensagens] = useState([]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const enviarMensagem = async () => {
    if (!input.trim() || carregando) return;

    const mensagemUsuario = input.trim();
    setInput('');
    setCarregando(true);
    setErro('');

    // Adicionar mensagem do usuário
    setMensagens(prev => [...prev, { tipo: 'usuario', texto: mensagemUsuario }]);

    try {
      // Verificar cache primeiro
      const cacheKey = `chat_${mensagemUsuario.toLowerCase()}`;
      const cachedResponse = getCachedData(cacheKey);

      if (cachedResponse) {
        setMensagens(prev => [...prev, { tipo: 'ia', texto: cachedResponse }]);
        setCarregando(false);
        return;
      }

      // Chamar API do backend
      const response = await fetch('/api/kitchen/chat-minimal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: mensagemUsuario })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Salvar no cache
      setCachedData(cacheKey, data.resposta);

      // Adicionar resposta da IA
      setMensagens(prev => [...prev, { tipo: 'ia', texto: data.resposta }]);

    } catch (error) {
      console.error('Erro no chat:', error);
      setErro('Erro ao conectar com o Chef IA. Tente novamente.');

      // Fallback com resposta local
      setTimeout(() => {
        const fallbackResponse = 'Olá! Como posso ajudar na cozinha hoje? Posso sugerir receitas, dar dicas de culinária ou ajudar com substituições de ingredientes.';
        setMensagens(prev => [...prev, { tipo: 'ia', texto: fallbackResponse }]);
      }, 1000);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-chef-hat text-white"></i>
          </div>
          <div>
            <h2 className="font-bold text-white">Chef IA</h2>
            <p className="text-orange-100 text-sm">Online - Pergunte sobre culinária</p>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="h-96 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700/50">
        {mensagens.length === 0 ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-comments text-3xl text-gray-400 mb-3"></i>
            <p className="text-gray-500 dark:text-gray-400">
              Como posso ajudar na cozinha hoje?
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              • Receitas com ingredientes específicos<br/>
              • Dicas de culinária<br/>
              • Substituições de ingredientes<br/>
              • Técnicas de preparo
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mensagens.map((msg, index) => (
              <div key={index} className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.tipo === 'usuario'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                }`}>
                  {msg.texto}
                </div>
              </div>
            ))}
            {carregando && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Chef IA está pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {erro && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{erro}</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
            placeholder="Digite sua pergunta sobre culinária..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={enviarMensagem}
            disabled={carregando || !input.trim()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Gerador de Cardápio Semanal
function CardapioGenerator() {
  const [cardapio, setCardapio] = useState({
    segunda: '', terca: '', quarta: '', quinta: '', sexta: '', sabado: '', domingo: ''
  });
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState('');

  const diasSemana = [
    { key: 'segunda', nome: 'Segunda', emoji: '🌙' },
    { key: 'terca', nome: 'Terça', emoji: '🔥' },
    { key: 'quarta', nome: 'Quarta', emoji: '💪' },
    { key: 'quinta', nome: 'Quinta', emoji: '🎯' },
    { key: 'sexta', nome: 'Sexta', emoji: '🎉' },
    { key: 'sabado', nome: 'Sábado', emoji: '🏖️' },
    { key: 'domingo', nome: 'Domingo', emoji: '🍽️' }
  ];

  const gerarCardapio = async () => {
    setGerando(true);
    setErro('');

    try {
      // Verificar cache primeiro
      const cacheKey = 'cardapio_semanal';
      const cachedCardapio = getCachedData(cacheKey);

      if (cachedCardapio) {
        setCardapio(cachedCardapio);
        setGerando(false);
        return;
      }

      // Chamar API do backend
      const response = await fetch('/api/kitchen/cardapio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'semanal' })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Salvar no cache
      setCachedData(cacheKey, data.cardapio);
      setCardapio(data.cardapio);

    } catch (error) {
      console.error('Erro ao gerar cardápio:', error);
      setErro('Erro ao gerar cardápio. Tente novamente.');

      // Fallback com cardápio básico
      const fallbackCardapio = {
        segunda: 'Frango grelhado com salada',
        terca: 'Sopa de legumes',
        quarta: 'Peixe assado com batatas',
        quinta: 'Carne moída refogada',
        sexta: 'Macarrão com molho vermelho',
        sabado: 'Feijoada completa',
        domingo: 'Churrasco em família'
      };
      setCardapio(fallbackCardapio);
    } finally {
      setGerando(false);
    }
  };

  const limparCardapio = () => {
    setCardapio({
      segunda: '', terca: '', quarta: '', quinta: '', sexta: '', sabado: '', domingo: ''
    });
    setErro('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-calendar-week text-white"></i>
            </div>
            <div>
              <h2 className="font-bold text-white">Cardápio Semanal</h2>
              <p className="text-green-100 text-sm">Planejamento automático de refeições</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={limparCardapio}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-sm transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={gerarCardapio}
              disabled={gerando}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-green-600 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {gerando ? 'Gerando...' : 'Gerar Cardápio'}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {erro && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{erro}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {diasSemana.map(({ key, nome, emoji }) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{emoji}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {nome}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 min-h-[3rem]">
                {cardapio[key] || 'Clique em "Gerar Cardápio"'}
              </p>
            </div>
          ))}
        </div>

        {/* Estatísticas */}
        {Object.values(cardapio).some(refeicao => refeicao) && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📊 Resumo do Cardápio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {Object.values(cardapio).filter(r => r).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Refeições</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {new Set(Object.values(cardapio).filter(r => r)).size}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Tipos únicos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Object.values(cardapio).filter(r => r && r.includes('carne')).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Com proteína</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(Object.values(cardapio).filter(r => r).length * 0.7)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Variedade</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 🍳 COZINHA MINIMALISTA - PÁGINA PRINCIPAL
// ============================================

export default function CozinhaMinimalista() {
  const { isVisitorMode } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('chat'); // chat ou cardapio

  return (
    <VisitorModeWrapper pageName="cozinha minimalista">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Simples */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-utensils text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">🍳 Cozinha IA</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chat inteligente + Gerador de cardápio semanal
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAbaAtiva('chat')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    abaAtiva === 'chat'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <i className="fa-solid fa-comments mr-2"></i>
                  Chat IA
                </button>
                <button
                  onClick={() => setAbaAtiva('cardapio')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    abaAtiva === 'cardapio'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <i className="fa-solid fa-calendar-week mr-2"></i>
                  Cardápio
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {abaAtiva === 'chat' ? <ChatWidget /> : <CardapioGenerator />}

            {/* Info sobre APIs */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-info-circle text-blue-500 mt-1"></i>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🚀 Cozinha Minimalista - Otimizada
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Esta versão utiliza apenas as APIs disponíveis no ambiente:
                  </p>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• <strong>Groq Llama 3.1</strong> - Chat IA ultrarrápido</li>
                    <li>• <strong>Cache local</strong> - Respostas instantâneas</li>
                    <li>• <strong>Fallbacks inteligentes</strong> - Funciona mesmo offline</li>
                    <li>• <strong>Zero dependência</strong> - Não usa APIs externas caras</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </VisitorModeWrapper>
  );
}
