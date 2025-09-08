import React, { useState, useRef, useEffect } from 'react';

// Dados mockados simplificados
const mockMessages = [
  {
    id: 1,
    text: 'Olá! Sou o CatButler, seu assistente doméstico! 🐱\nComo posso ajudar você hoje?',
    sender: 'bot',
    timestamp: new Date().toISOString()
  }
];

const quickSuggestions = [
  { text: 'Receitas rápidas para hoje', icon: 'fa-solid fa-utensils' },
  { text: 'Lista de compras semanal', icon: 'fa-solid fa-shopping-cart' },
  { text: 'Cronograma de limpeza', icon: 'fa-solid fa-broom' },
  { text: 'Organizar tarefas do dia', icon: 'fa-solid fa-tasks' }
];

export default function Assistente() {
  const [messages, setMessages] = useState(mockMessages);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular resposta do bot
  const simulateBotResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      'receitas': 'Ótimo! Aqui estão algumas receitas rápidas:\n\n🍝 **Macarrão Alho e Óleo** (15 min)\n🥗 **Salada Caesar** (10 min)\n🍲 **Sopa de Legumes** (20 min)\n\nQual te interessa mais?',
      'compras': 'Vou criar uma lista de compras para você:\n\n🛒 **Lista Semanal:**\n• Arroz, feijão, macarrão\n• Frango, carne, peixe\n• Frutas e verduras\n• Produtos de limpeza\n\nQuer que eu adicione algo específico?',
      'limpeza': 'Aqui está um cronograma de limpeza eficiente:\n\n🧹 **Segunda:** Cozinha e banheiros\n🧽 **Terça:** Quartos e roupas\n🪟 **Quarta:** Sala e aspirar\n🧼 **Quinta:** Faxina geral\n\nVamos começar por onde?',
      'default': 'Entendi! Vou te ajudar com isso. Que tal começarmos organizando suas necessidades? 😸'
    };
    
    let responseText = responses.default;
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('receita') || lowerMessage.includes('comida') || lowerMessage.includes('cozinha')) {
      responseText = responses.receitas;
    } else if (lowerMessage.includes('compra') || lowerMessage.includes('mercado') || lowerMessage.includes('lista')) {
      responseText = responses.compras;
    } else if (lowerMessage.includes('limpeza') || lowerMessage.includes('faxina') || lowerMessage.includes('limpar')) {
      responseText = responses.limpeza;
    }
    
    const newMessage = {
      id: Date.now(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  // Enviar mensagem
  const sendMessage = async (text = currentInput) => {
    if (!text.trim()) return;
    
    const userMessage = {
      id: Date.now() + 1,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    
    // Simular resposta do bot
    await simulateBotResponse(text);
  };

  // Enviar com Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formatar timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Novo chat
  const startNewChat = () => {
    setMessages([{
      id: 1,
      text: 'Olá! Sou o CatButler, seu assistente doméstico! 🐱\nComo posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="assistente-content">
      {/* Header do chat */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-cat text-white text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              CatButler IA
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online
            </p>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          Novo Chat
        </button>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50/50 dark:bg-gray-900/20">
        {messages.length === 1 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-cat text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Olá! Sou o CatButler IA 🐱
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Estou aqui para ajudar com receitas, compras, limpeza e organização da casa!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {quickSuggestions.map((suggestion, suggestionIndex) => (
                  <button
                    key={`suggestion-${suggestion.text}-${suggestionIndex}`}
                    onClick={() => sendMessage(suggestion.text)}
                    className="p-2 sm:p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left group"
                  >
                    <i className={`${suggestion.icon} text-primary-500 text-xs sm:text-sm mb-1 sm:mb-2 group-hover:scale-110 transition-transform`}></i>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.length > 1 && messages.map(message => (
          <div
            key={message.id}
            className={`flex items-end gap-3 mb-4 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-cat text-white text-sm"></i>
              </div>
            )}

            <div className={`max-w-xs lg:max-w-md ${
              message.sender === 'user' ? 'order-1' : 'order-2'
            }`}>
              <div className={`p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
              }`}>
                <div className={`text-sm ${
                  message.sender === 'user' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {message.text.split('\n').map((line, lineIndex) => (
                    <div key={`line-${message.id}-${lineIndex}`}>
                      {line.includes('**') ? (
                        <div dangerouslySetInnerHTML={{
                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      ) : (
                        line
                      )}
                      {lineIndex < message.text.split('\n').length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`text-xs mt-1 ${
                message.sender === 'user' 
                  ? 'text-right text-gray-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-user text-primary-600 dark:text-primary-400 text-sm"></i>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-cat text-white text-sm"></i>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem */}
      <div className="assistente-input p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        {/* Sugestões rápidas (apenas quando há mensagens) */}
        {messages.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickSuggestions.slice(0, 3).map((suggestion, suggestionIndex) => (
              <button
                key={`quick-${suggestion.text}-${suggestionIndex}`}
                onClick={() => sendMessage(suggestion.text)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
              >
                <i className={`${suggestion.icon} text-xs`}></i>
                {suggestion.text}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full p-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
              rows="1"
              style={{ minHeight: '2.75rem' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!currentInput.trim() || isTyping}
              className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}