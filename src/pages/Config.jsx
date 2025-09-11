import React, { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Dados estáticos das configurações
const CONFIGURACOES_SECTIONS = [
  {
    id: 'aparencia',
    title: 'Aparência',
    icon: 'fa-palette',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'notificacoes',
    title: 'Notificações',
    icon: 'fa-bell',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'privacidade',
    title: 'Privacidade',
    icon: 'fa-shield-halved',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'conta',
    title: 'Conta',
    icon: 'fa-user',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'família',
    title: 'Conta Familiar',
    icon: 'fa-users',
    color: 'from-pink-500 to-rose-500'
  }
];

const NOTIFICACOES_OPTIONS = [
  { id: 'receitas', label: 'Novas receitas recomendadas', enabled: true },
  { id: 'ofertas', label: 'Ofertas especiais do mercado', enabled: true },
  { id: 'tarefas', label: 'Lembretes de tarefas domésticas', enabled: false },
  { id: 'email', label: 'Newsletter semanal', enabled: true }
];

export default function Config() {
  // Estados
  const { theme, toggleTheme } = useTheme();
  const [secaoAtiva, setSecaoAtiva] = useState('aparencia');
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_OPTIONS);
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: 'Visitante',
    email: 'visitante@catbutler.com',
    localizacao: 'São Paulo, SP'
  });
  const [contaFamiliar, setContaFamiliar] = useState({
    ativa: false,
    membros: [
      { id: 1, nome: 'Visitante', papel: 'Admin', ativo: true }
    ],
    novoMembro: ''
  });
  const [modalAberto, setModalAberto] = useState(null);

  // Handlers
  const toggleNotificacao = useCallback((id) => {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
    ));
  }, []);

  const salvarDados = useCallback(() => {
    // Simular salvamento
    setModalAberto('sucesso');
    setTimeout(() => setModalAberto(null), 2000);
  }, []);

  const exportarDados = useCallback(() => {
    // Simular exportação
    const dados = JSON.stringify({
      usuario: dadosUsuario,
      configuracoes: { theme, notificacoes },
      timestamp: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catbutler-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [dadosUsuario, theme, notificacoes]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header padronizado */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0">
              <i className="fa-solid fa-gear text-lg sm:text-xl text-gray-700 dark:text-gray-200" aria-label="configurações"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Configurações
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Personalize sua experiência no CatButler
              </p>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Menu Lateral */}
          <div className="lg:col-span-1">
            <div className="card-glass rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categorias
              </h3>
              <div className="space-y-2">
                {CONFIGURACOES_SECTIONS.map(secao => (
                  <button
                    key={secao.id}
                    onClick={() => setSecaoAtiva(secao.id)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 text-left flex items-center gap-3 ${
                      secaoAtiva === secao.id
                        ? `bg-gradient-to-r ${secao.color} text-white`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <i className={`fa-solid ${secao.icon}`}></i>
                    <span className="font-medium">{secao.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="card-glass rounded-xl shadow-lg p-6">
              
              {/* Aparência */}
              {secaoAtiva === 'aparencia' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Aparência
                  </h3>
                  
                  {/* Tema */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Tema
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-sun text-white"></i>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Modo Claro
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Interface clara e vibrante
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-moon text-white"></i>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Modo Escuro
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Ideal para ambientes com pouca luz
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Densidade */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Densidade da Interface
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['Compacta', 'Padrão', 'Confortável'].map((densidade, index) => (
                        <button
                          key={densidade}
                          className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                            index === 1
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {densidade}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notificações */}
              {secaoAtiva === 'notificacoes' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h3>
                  
                  <div className="space-y-4">
                    {notificacoes.map(notificacao => (
                      <div
                        key={notificacao.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {notificacao.label}
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
                    ))}
                  </div>
                </div>
              )}

              {/* Privacidade */}
              {secaoAtiva === 'privacidade' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Privacidade e Dados
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Seus dados estão seguros
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        Todos os dados são armazenados localmente no seu navegador. 
                        Nenhuma informação pessoal é enviada para servidores externos.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={exportarDados}
                        className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-download"></i>
                        Exportar Meus Dados
                      </button>
                      
                      <button
                        onClick={() => setModalAberto('limpar')}
                        className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-trash"></i>
                        Limpar Todos os Dados
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Conta */}
              {secaoAtiva === 'conta' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Informações da Conta
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        value={dadosUsuario.nome}
                        onChange={(e) => setDadosUsuario(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        id="user-email"
                        type="email"
                        value={dadosUsuario.email}
                        onChange={(e) => setDadosUsuario(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="user-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Localização
                      </label>
                      <input
                        id="user-location"
                        type="text"
                        value={dadosUsuario.localizacao}
                        onChange={(e) => setDadosUsuario(prev => ({ ...prev, localizacao: e.target.value }))}
                        placeholder="Ex: São Paulo, SP"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <button
                      onClick={salvarDados}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              )}

              {/* Conta Familiar */}
              {secaoAtiva === 'família' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Conta Familiar
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Toggle Conta Familiar */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Ativar Conta Familiar
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compartilhe listas e rotinas com sua família
                        </p>
                      </div>
                      <button
                        onClick={() => setContaFamiliar(prev => ({ ...prev, ativa: !prev.ativa }))}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          contaFamiliar.ativa
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 top-0.5 ${
                            contaFamiliar.ativa ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        ></div>
                      </button>
                    </div>

                    {/* Membros da Família */}
                    {contaFamiliar.ativa && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Membros da Família
                        </h4>
                        
                        {/* Lista de Membros */}
                        <div className="space-y-3">
                          {contaFamiliar.membros.map(membro => (
                            <div key={membro.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                  <i className="fa-solid fa-user text-white"></i>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {membro.nome}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {membro.papel}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  membro.ativo ? 'bg-green-500' : 'bg-gray-300'
                                }`}></span>
                                {membro.papel !== 'Admin' && (
                                  <button className="text-red-500 hover:text-red-700 p-1">
                                    <i className="fa-solid fa-trash text-sm"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Adicionar Membro */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            Convidar Membro
                          </h5>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={contaFamiliar.novoMembro}
                              onChange={(e) => setContaFamiliar(prev => ({ ...prev, novoMembro: e.target.value }))}
                              placeholder="Email do familiar..."
                              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => {
                                if (contaFamiliar.novoMembro.trim()) {
                                  const novoId = Math.max(...contaFamiliar.membros.map(m => m.id)) + 1;
                                  setContaFamiliar(prev => ({
                                    ...prev,
                                    membros: [...prev.membros, {
                                      id: novoId,
                                      nome: prev.novoMembro.split('@')[0],
                                      papel: 'Membro',
                                      ativo: false
                                    }],
                                    novoMembro: ''
                                  }));
                                }
                              }}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                            >
                              <i className="fa-solid fa-paper-plane"></i>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Um convite será enviado por email para o familiar
                          </p>
                        </div>

                        {/* Permissões */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Funcionalidades Compartilhadas
                          </h5>
                          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Listas de compras sincronizadas</li>
                            <li>• Rotinas de limpeza colaborativas</li>
                            <li>• Cardápios semanais compartilhados</li>
                            <li>• Histórico de atividades da família</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-16"></div>
      </div>

      {/* Modals */}
      {modalAberto === 'sucesso' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Configurações Salvas
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Suas alterações foram salvas com sucesso!
            </p>
          </div>
        </div>
      )}

      {modalAberto === 'limpar' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-exclamation-triangle text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Limpar Dados
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta ação não pode ser desfeita. Todos os seus dados serão removidos.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModalAberto(null)}
                className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  setModalAberto(null);
                  window.location.reload();
                }}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}