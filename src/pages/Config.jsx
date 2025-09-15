import React, { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Detecta modo visitante via flag de ambiente
const isVisitorMode = import.meta.env.VITE_VISITOR_MODE === 'true';

// Configurações simplificadas e mais claras
const SECOES_CONFIG = [
  {
    id: 'geral',
    title: 'Geral',
    icon: 'fa-sliders',
    color: 'from-blue-500 to-indigo-500',
    description: 'Aparência, conta e preferências básicas'
  },
  {
    id: 'notificacoes',
    title: 'Notificações',
    icon: 'fa-bell',
    color: 'from-purple-500 to-pink-500',
    description: 'Gerencie quando e como ser notificado'
  },
  {
    id: 'privacidade',
    title: 'Privacidade',
    icon: 'fa-shield-halved',
    color: 'from-green-500 to-emerald-500',
    description: 'Seus dados, segurança e conta familiar'
  },
  {
    id: 'suporte',
    title: 'Suporte',
    icon: 'fa-headset',
    color: 'from-gray-500 to-slate-500',
    description: 'Ajuda, informações e contato'
  }
];

const NOTIFICACOES_SIMPLES = [
  { 
    id: 'receitas', 
    label: 'Novas receitas recomendadas', 
    description: 'Receba sugestões de pratos baseados nos seus gostos',
    enabled: true,
    icon: 'fa-utensils',
    color: 'text-orange-500'
  },
  { 
    id: 'ofertas', 
    label: 'Ofertas e promoções', 
    description: 'Alertas sobre preços baixos nos seus produtos favoritos',
    enabled: true,
    icon: 'fa-tags',
    color: 'text-green-500'
  },
  { 
    id: 'lembretes', 
    label: 'Lembretes de tarefas', 
    description: 'Notificações sobre limpeza e organização da casa',
    enabled: false,
    icon: 'fa-clock',
    color: 'text-blue-500'
  }
];

export default function Config() {
  // Estados simplificados
  const { theme, toggleTheme } = useTheme();
  const [secaoAtiva, setSecaoAtiva] = useState('geral');
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_SIMPLES);
  const [autoTheme, setAutoTheme] = useState(false);
  const [modalAberto, setModalAberto] = useState(null);

  // Handlers
  const toggleNotificacao = useCallback((id) => {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
    ));
  }, []);

  const exportarDados = useCallback(() => {
    const dados = {
      configuracoes: { theme, autoTheme, notificacoes },
      timestamp: new Date().toISOString(),
      versao: '4.0.0'
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catbutler-configuracoes.json';
    a.click();
    URL.revokeObjectURL(url);
    
    setModalAberto('exportado');
    setTimeout(() => setModalAberto(null), 2000);
  }, [theme, autoTheme, notificacoes]);

  const limparDados = useCallback(() => {
    localStorage.clear();
    setModalAberto('limpo');
    setTimeout(() => {
      setModalAberto(null);
      window.location.reload();
    }, 2000);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 lg:p-6 space-y-6">
        
        {/* Header Moderno */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <i className="fa-solid fa-gear text-xl text-white" aria-label="configurações"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Configurações
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Personalize sua experiência no CatButler
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Navegação */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SECOES_CONFIG.map(secao => (
            <button
              key={secao.id}
              onClick={() => setSecaoAtiva(secao.id)}
              className={`p-4 rounded-xl transition-all duration-300 text-left group hover:scale-105 ${
                secaoAtiva === secao.id
                  ? `bg-gradient-to-br ${secao.color} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <i className={`fa-solid ${secao.icon} text-xl ${
                  secaoAtiva === secao.id ? 'text-white' : 'text-gray-500'
                }`}></i>
                <div>
                  <h3 className={`font-semibold ${
                    secaoAtiva === secao.id ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {secao.title}
                  </h3>
                </div>
              </div>
              <p className={`text-sm ${
                secaoAtiva === secao.id ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {secao.description}
              </p>
            </button>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto">
          
          {/* Seção Geral */}
          {secaoAtiva === 'geral' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Preferências Gerais
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Configure a aparência e comportamento do aplicativo
                </p>
              </div>
              
              {/* Tema */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <i className="fa-solid fa-palette text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Tema</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Escolha como o app deve aparecer
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Tema Automático */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-magic-wand-sparkles text-purple-500"></i>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Tema Automático
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Muda conforme o horário do dia
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoTheme(!autoTheme)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        autoTheme ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                          autoTheme ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Seleção Manual de Tema */}
                  {!autoTheme && (
                    <div className="grid md:grid-cols-2 gap-3">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-sun text-white text-lg"></i>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Claro
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Interface clara e vibrante
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-moon text-white text-lg"></i>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Escuro
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Ideal para baixa luminosidade
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Idioma */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <i className="fa-solid fa-globe text-green-600 dark:text-green-400"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Idioma</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Escolha o idioma do aplicativo
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇧🇷</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Português (Brasil)
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Idioma atual
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    Ativo
                  </span>
                </div>
              </div>

              {/* Configurações de Conta */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <i className="fa-solid fa-user-cog text-amber-600 dark:text-amber-400"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Conta</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gerencie suas informações de acesso
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-envelope text-blue-500"></i>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Email
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          usuario@exemplo.com
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                      Alterar
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-lock text-red-500"></i>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Senha
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Última alteração há 3 meses
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setModalAberto('trocar-senha')}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                    >
                      Trocar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Seção Notificações */}
          {secaoAtiva === 'notificacoes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Notificações
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Escolha quando e como deseja ser notificado
                </p>
              </div>
              
              <div className="space-y-4">
                {notificacoes.map(notificacao => (
                  <div
                    key={notificacao.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <i className={`fa-solid ${notificacao.icon} ${notificacao.color}`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {notificacao.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notificacao.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleNotificacao(notificacao.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          notificacao.enabled
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                            notificacao.enabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Configurações Avançadas */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fa-solid fa-bell-slash text-blue-600 dark:text-blue-400"></i>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Modo Silencioso
                  </h3>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Desative temporariamente todas as notificações durante:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-700/50">
                    22:00 - 08:00
                  </button>
                  <button className="px-3 py-2 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-700/50">
                    Fins de semana
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Seção Privacidade */}
          {secaoAtiva === 'privacidade' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Privacidade e Dados
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Gerencie seus dados e privacidade no CatButler
                </p>
              </div>

              {/* Status de Dados */}
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <i className="fa-solid fa-shield-check text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      Seus dados estão seguros
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Armazenados apenas no seu dispositivo
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-600" aria-hidden="true"></i>
                    <span>Nenhum dado é enviado para servidores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-600" aria-hidden="true"></i>
                    <span>Todas as informações ficam no seu navegador</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-600" aria-hidden="true"></i>
                    <span>Você tem controle total dos seus dados</span>
                  </li>
                </ul>
              </div>

              {/* Ações de Dados */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-download text-2xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Exportar Dados
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Baixe um backup com todas suas configurações
                    </p>
                    <button
                      onClick={exportarDados}
                      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Baixar Backup
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-trash text-2xl text-red-600 dark:text-red-400"></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Limpar Dados
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Remove todas as informações armazenadas
                    </p>
                    <button
                      onClick={() => setModalAberto('confirmar-limpeza')}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Limpar Tudo
                    </button>
                  </div>
                </div>
              </div>

              {/* Conta Familiar */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <i className="fa-solid fa-users text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Conta Familiar</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Divida os custos com até 4 pessoas da sua família
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-info-circle text-purple-600 dark:text-purple-400 mt-0.5"></i>
                    <div className="text-sm text-purple-800 dark:text-purple-200">
                      <p className="font-medium mb-1">Futuramente premium</p>
                      <p>Quando o CatButler evoluir para uma versão premium, você poderá dividir o custo mensal entre até 4 membros da família, tornando mais econômico para todos!</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-user text-white text-sm"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Você (Administrador)
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          usuario@exemplo.com
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                      Admin
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <div key={`membro-${index + 2}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-user-plus text-sm"></i>
                          </div>
                          <div>
                            <div className="font-medium">
                              Membro {index + 2}
                            </div>
                            <div className="text-sm">
                              Vaga disponível
                            </div>
                          </div>
                        </div>
                        <button 
                          disabled
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 rounded-lg text-sm cursor-not-allowed"
                        >
                          Convidar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
                    <i className="fa-solid fa-clock"></i>
                    <span className="font-medium">Em desenvolvimento:</span>
                    <span>Funcionalidade disponível na versão premium futura</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seção Suporte */}
          {secaoAtiva === 'suporte' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Suporte e Informações
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Obtenha ajuda e saiba mais sobre o CatButler
                </p>
              </div>

              {/* Info do App */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-cat text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      CatButler
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Seu assistente doméstico inteligente
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-center mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">v4.0.0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Versão</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">2025</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lançamento</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">Gratuito</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Por enquanto</div>
                  </div>
                </div>

                {/* Modelo de Negócio */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5"></i>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-2">Sobre o modelo de negócio:</p>
                      <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                        <li>• <strong>Atualmente:</strong> 100% gratuito para todos</li>
                        <li>• <strong>Futuro:</strong> Versão premium com recursos avançados</li>
                        <li>• <strong>Conta familiar:</strong> Divida custos entre até 4 pessoas</li>
                        <li>• <strong>Garantia:</strong> Funcionalidades básicas sempre gratuitas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Central de Suporte */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-headset text-blue-500" aria-hidden="true"></i>
                  <span>Central de Suporte</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-question-circle text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Central de Ajuda</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Perguntas frequentes e tutoriais</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-bug text-red-600 dark:text-red-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Reportar Bug</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Encontrou algo que não funciona?</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-lightbulb text-yellow-600 dark:text-yellow-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Sugerir Funcionalidade</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sua ideia pode virar realidade</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-envelope text-green-600 dark:text-green-400"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Contato Direto</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fale diretamente conosco</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Créditos */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 text-center">
                <p className="text-purple-900 dark:text-purple-100 mb-2">
                  Feito com ❤️ para facilitar sua vida doméstica
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  © 2025 Izadora Pierette. Todos os direitos reservados.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="h-16"></div>
      </div>

      {/* Modals */}
      {modalAberto === 'exportado' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-download text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Dados Exportados!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seu backup foi baixado com sucesso
            </p>
          </div>
        </div>
      )}

      {modalAberto === 'limpo' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-trash text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Dados Removidos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Todas as informações foram limpas
            </p>
          </div>
        </div>
      )}

      {modalAberto === 'confirmar-limpeza' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-exclamation-triangle text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirmar Limpeza
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta ação removerá permanentemente todos os seus dados, incluindo listas, configurações e preferências. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setModalAberto(null)}
                className="py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={limparDados}
                className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAberto === 'trocar-senha' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-lock text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Trocar Senha
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crie uma nova senha segura para sua conta
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="senha-atual" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha atual
                </label>
                <div className="relative">
                  <input
                    id="senha-atual"
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    placeholder="Digite sua senha atual"
                  />
                  <i className="fa-solid fa-lock absolute right-3 top-3.5 text-gray-400" aria-hidden="true"></i>
                </div>
              </div>
              
              <div>
                <label htmlFor="nova-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    id="nova-senha"
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    placeholder="Digite sua nova senha"
                  />
                  <i className="fa-solid fa-key absolute right-3 top-3.5 text-gray-400" aria-hidden="true"></i>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmar-senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    id="confirmar-senha"
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    placeholder="Digite novamente a nova senha"
                  />
                  <i className="fa-solid fa-check-circle absolute right-3 top-3.5 text-gray-400" aria-hidden="true"></i>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <div className="font-medium mb-1">Dicas para uma senha segura:</div>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Pelo menos 8 caracteres</li>
                    <li>• Misture letras, números e símbolos</li>
                    <li>• Evite informações pessoais</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setModalAberto(null)}
                className="py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setModalAberto('senha-alterada');
                  setTimeout(() => setModalAberto(null), 2000);
                }}
                className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAberto === 'senha-alterada' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Senha Alterada!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sua senha foi alterada com sucesso
            </p>
          </div>
        </div>
      )}
      
      {/* Overlay para modo visitante */}
      {isVisitorMode && (
        <>
          <div className="fixed top-0 right-0 bottom-0 left-0 lg:left-48 xl:left-56 bg-black/20 backdrop-blur-sm z-30"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div 
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl p-6 m-4 max-w-md border border-gray-200 dark:border-gray-600 pointer-events-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-eye text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Visualização das Configurações
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Esta é uma prévia das configurações disponíveis. Crie uma conta para personalizar suas preferências!
                </p>
                <button
                  onClick={() => window.location.href = '/criar-conta'}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Criar Conta Grátis
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}