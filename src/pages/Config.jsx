import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VisitorModeWrapper from '../components/VisitorModeWrapper';
import DocumentationSection from '../components/DocumentationSection';
import AvatarSelector from '../components/AvatarSelector';

// Configurações das seções
const SECOES_CONFIG = [
  { 
    id: 'geral', 
    title: 'Geral', 
    icon: 'fa-sliders-h', 
    color: 'from-blue-500 to-indigo-600',
    description: 'Configurações básicas e tema' 
  },
  { 
    id: 'notificacoes', 
    title: 'Notificações', 
    icon: 'fa-bell', 
    color: 'from-green-500 to-emerald-600',
    description: 'Alertas e lembretes' 
  },
  { 
    id: 'documentos', 
    title: 'Documentos', 
    icon: 'fa-book', 
    color: 'from-orange-500 to-amber-600',
    description: 'Tutoriais e guias de uso' 
  },
  { 
    id: 'privacidade', 
    title: 'Privacidade', 
    icon: 'fa-shield-alt', 
    color: 'from-purple-500 to-violet-600',
    description: 'Dados pessoais e segurança' 
  },
  { 
    id: 'mercado', 
    title: 'Mercado', 
    icon: 'fa-store', 
    color: 'from-orange-500 to-red-600',
    description: 'Mercados favoritos' 
  },
  { 
    id: 'suporte', 
    title: 'Suporte', 
    icon: 'fa-question-circle', 
    color: 'from-indigo-500 to-purple-600',
    description: 'Ajuda e contato' 
  }
];

// Configurações de notificações
const NOTIFICACOES_CONFIG = [
  { 
    key: 'tarefas', 
    title: 'Lembretes de Tarefas',
    description: 'Notificações para tarefas agendadas',
    icon: 'fa-bell',
    color: 'blue'
  },
  { 
    key: 'agenda', 
    title: 'Eventos da Agenda',
    description: 'Alertas de eventos importantes',
    icon: 'fa-calendar',
    color: 'green'
  },
  { 
    key: 'mercado', 
    title: 'Ofertas de Mercado',
    description: 'Promoções dos seus mercados favoritos',
    icon: 'fa-tag',
    color: 'orange'
  }
];

export default function Config() {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, logout, updateProfile, availableAvatars } = useAuth();
  
  // Estados
  const [secaoAtiva, setSecaoAtiva] = useState('geral');
  const [autoTheme, setAutoTheme] = useState(profile?.auto_theme_change || false);
  const [configuracoes, setConfiguracoes] = useState({
    notificacoes: {
      tarefas: true,
      agenda: true,
      mercado: false
    }
  });
  const [mercadosFavoritos] = useState([]);
  const [modalAberto, setModalAberto] = useState(null);
  const [perfilEditando, setPerfilEditando] = useState({
    nome: '',
    endereco: '',
    avatarSelecionado: 'axel'
  });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  
  // Estados da conta familiar
  const MAX_FAMILY_MEMBERS = 4;
  const [familyMembers, setFamilyMembers] = useState([
    { 
      id: 1, 
      name: profile?.nome || user?.email || 'Usuário', 
      email: user?.email || '', 
      role: 'Administrador', 
      isOwner: true,
      avatar: profile?.avatar || 'axel'
    }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Funções
  const toggleAutoTheme = async () => {
    const novoEstado = !autoTheme;
    setAutoTheme(novoEstado);
    
    // Salvar no perfil
    if (isAuthenticated) {
      try {
        await updateProfile({
          display_name: profile?.display_name,
          endereco: profile?.endereco,
          avatar_url: profile?.avatar_url,
          auto_theme_change: novoEstado
        });
        console.log('✅ Tema automático atualizado:', novoEstado);
      } catch (error) {
        console.error('❌ Erro ao atualizar tema automático:', error);
      }
    }
  };

  const toggleNotificacao = (key) => {
    setConfiguracoes(prev => ({
      ...prev,
      notificacoes: {
        ...prev.notificacoes,
        [key]: !prev.notificacoes[key]
      }
    }));
  };

  const exportarDados = () => {
    // Implementar exportação de dados
    console.log('Exportando dados...');
  };

  // Funções da conta familiar
  const canAddMember = familyMembers.length < MAX_FAMILY_MEMBERS;
  
  const addFamilyMember = () => {
    if (!newMemberEmail.trim()) {
      alert('Por favor, insira um email válido.');
      return;
    }
    
    if (!canAddMember) {
      alert(`Limite máximo de ${MAX_FAMILY_MEMBERS} membros atingido.`);
      return;
    }
    
    // Verificar se email já existe
    if (familyMembers.some(member => member.email.toLowerCase() === newMemberEmail.toLowerCase())) {
      alert('Este email já está na conta familiar.');
      return;
    }
    
    // Simular adição de membro (futuramente será API call)
    const newMember = {
      id: Date.now(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail.toLowerCase().trim(),
      role: 'Membro',
      isOwner: false,
      avatar: 'default'
    };
    
    setFamilyMembers(prev => [...prev, newMember]);
    setNewMemberEmail('');
    alert('Convite enviado com sucesso! O membro receberá um email para aceitar o convite.');
  };
  
  const removeFamilyMember = (memberId) => {
    if (familyMembers.find(m => m.id === memberId)?.isOwner) {
      alert('Não é possível remover o administrador da conta.');
      return;
    }
    
    if (confirm('Tem certeza que deseja remover este membro da conta familiar?')) {
      setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const limparDados = () => {
    // Implementar limpeza de dados
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      console.log('Limpando dados...');
    }
  };

  const salvarPerfil = async () => {
    if (!isAuthenticated) return;
    
    setSalvandoPerfil(true);
    try {
      const result = await updateProfile({
        display_name: perfilEditando.nome,
        endereco: perfilEditando.endereco,
        avatar_url: perfilEditando.avatarSelecionado,
        auto_theme_change: autoTheme
      });
      
      if (result.success) {
        setModalAberto('perfil-salvo');
        setTimeout(() => setModalAberto(null), 2000);
      } else {
        console.error('Erro ao salvar perfil:', result.error);
        // Aqui você poderia mostrar uma mensagem de erro para o usuário
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
    setSalvandoPerfil(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Inicializar dados do perfil
  React.useEffect(() => {
    if (isAuthenticated && profile) {
      setPerfilEditando({
        nome: profile.nome || profile.display_name || '',
        endereco: profile.endereco || '',
        avatarSelecionado: profile.avatar || 'axel'
      });
      
      // Atualizar estado do tema automático
      setAutoTheme(profile.auto_theme_change || false);
    }
  }, [isAuthenticated, profile]);

  return (
    <VisitorModeWrapper pageName="as configurações">
      <div className="h-full overflow-y-auto">
      <div className="p-4 lg:p-6 space-y-6">
        
        {/* Header Moderno */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <i className="fa-solid fa-gear text-xl text-white"></i>
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
              
              {/* Card: Tema Automático */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-clock text-purple-500"></i>
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
                    onClick={toggleAutoTheme}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      autoTheme 
                        ? 'bg-purple-500 shadow-lg shadow-purple-500/25' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 top-0.5 ${
                        autoTheme ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    >
                      <i className={`fa-solid ${autoTheme ? 'fa-moon' : 'fa-sun'} text-xs ${
                        autoTheme ? 'text-purple-600' : 'text-amber-500'
                      } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></i>
                    </div>
                  </button>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mt-4 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-info-circle text-purple-600 dark:text-purple-400 mt-0.5"></i>
                    <div className="text-sm text-purple-800 dark:text-purple-200">
                      <p className="font-medium mb-1">Como funciona:</p>
                      <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                        <li>• <strong>6h às 18h:</strong> Tema claro</li>
                        <li>• <strong>18h às 6h:</strong> Tema escuro</li>
                        <li>• <strong>Manual:</strong> Use o botão no header para alternar</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card: Informações da Conta */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informações da Conta
                </h3>
                
                {!isAuthenticated ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl inline-flex mb-4">
                        <i className="fa-solid fa-user-plus text-blue-600 dark:text-blue-400 text-2xl"></i>
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Modo Visitante
                      </h4>
                      <p className="text-blue-700 dark:text-blue-200 mb-4">
                        Você está usando o CatButler como visitante. Crie uma conta para salvar suas configurações e ter acesso completo a todos os recursos.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                          onClick={() => navigate('/signup')}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <i className="fa-solid fa-user-plus mr-2" />
                          <span>Criar Conta</span>
                        </button>
                        <button 
                          onClick={() => navigate('/login')}
                          className="px-6 py-2 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <i className="fa-solid fa-sign-in-alt mr-2" />
                          <span>Entrar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                          <i className="fa-solid fa-user text-blue-600 dark:text-blue-400"></i>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {profile?.nome || user?.email}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-sign-out-alt mr-2" />
                        <span>Sair</span>
                      </button>
                    </div>
                    
                    {/* Customização do Perfil */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Personalizar Perfil
                      </h3>
                      
                      {/* Nome de Exibição */}
                      <div className="mb-6">
                        <label htmlFor="nome-perfil" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nome de Exibição
                        </label>
                        <input
                          id="nome-perfil"
                          type="text"
                          value={perfilEditando.nome}
                          onChange={(e) => setPerfilEditando(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Como você gostaria de ser chamado?"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          maxLength={50}
                        />
                      </div>

                      {/* Seleção de Avatar */}
                      <div className="mb-6">
                        <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Escolha seu Avatar
                        </div>
                        <AvatarSelector
                          selectedAvatar={perfilEditando.avatarSelecionado}
                          onAvatarSelect={(avatarId) => setPerfilEditando(prev => ({ 
                            ...prev, 
                            avatarSelecionado: avatarId 
                          }))}
                        />
                      </div>

                      {/* Endereço Padrão */}
                      <div className="mb-6">
                        <label htmlFor="endereco-perfil" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Endereço Padrão
                        </label>
                        <input
                          id="endereco-perfil"
                          type="text"
                          value={perfilEditando.endereco}
                          onChange={(e) => setPerfilEditando(prev => ({ ...prev, endereco: e.target.value }))}
                          placeholder="Seu endereço principal para entregas"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          maxLength={200}
                        />
                      </div>

                      {/* Botão Alterar Senha */}
                      <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700 mb-6">
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-lock text-amber-500"></i>
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
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <i className="fa-solid fa-key text-xs" />
                          <span>Alterar</span>
                        </button>
                      </div>

                      {/* Conta Familiar */}
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700 mb-6">
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-users text-green-500"></i>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Conta Familiar
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Gerencie membros da família
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setModalAberto('conta-familiar')}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <i className="fa-solid fa-cog text-xs" />
                          <span>Gerenciar</span>
                        </button>
                      </div>

                      {/* Botão Salvar */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={salvarPerfil}
                          disabled={salvandoPerfil}
                          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          {salvandoPerfil ? (
                            <>
                              <i className="fa-solid fa-spinner fa-spin" />
                              <span>Salvando...</span>
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-save" />
                              <span>Salvar Configurações</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                  Gerencie como você recebe alertas e lembretes
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preferências de Notificação
                </h3>
                
                <div className="space-y-4">
                  {NOTIFICACOES_CONFIG.map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${notif.icon} text-${notif.color}-500`}></i>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {notif.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {notif.description}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleNotificacao(notif.key)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                          configuracoes.notificacoes?.[notif.key]
                            ? `bg-${notif.color}-500 shadow-lg shadow-${notif.color}-500/25` 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 top-0.5 ${
                            configuracoes.notificacoes?.[notif.key] ? 'translate-x-7' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
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
                  Controle seus dados pessoais e privacidade
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Gerenciamento de Dados
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={exportarDados}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-download text-blue-600 dark:text-blue-400"></i>
                      <div className="text-left">
                        <div className="font-medium text-blue-900 dark:text-blue-100">
                          Exportar Dados
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          Baixe uma cópia de todos os seus dados
                        </div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-blue-600 dark:text-blue-400"></i>
                  </button>
                  
                  <button
                    onClick={limparDados}
                    className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-trash text-red-600 dark:text-red-400"></i>
                      <div className="text-left">
                        <div className="font-medium text-red-900 dark:text-red-100">
                          Limpar Dados
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-300">
                          Remove permanentemente todos os dados locais
                        </div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-red-600 dark:text-red-400"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Seção Mercado */}
          {secaoAtiva === 'mercado' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Mercados Favoritos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Gerencie seus mercados preferidos para facilitar o uso da IA
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Seus Mercados Favoritos
                  </h3>
                  <button
                    onClick={() => {/* Implementar função para adicionar mercado */}}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-plus mr-2" />
                    <span>Adicionar</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {mercadosFavoritos.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl inline-flex mb-4">
                        <i className="fa-solid fa-store text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Você ainda não tem mercados favoritos
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Adicione mercados para que a IA possa sugerir produtos específicos
                      </p>
                    </div>
                  ) : (
                    mercadosFavoritos.map((mercado) => (
                      <div key={mercado.id || mercado.nome} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-store text-green-600 dark:text-green-400"></i>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {mercado.nome}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {mercado.endereco}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {/* Implementar função para remover mercado */}}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Seção Suporte */}
          {secaoAtiva === 'suporte' && (
            <div className="space-y-6">
              
              {/* Seção de Documentação */}
              <DocumentationSection />
              
              {/* Seção de Contato */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  🆘 Suporte e Contato
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Precisa de ajuda? Entre em contato conosco
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    💬 Central de Ajuda
                  </h3>
                  
                  <div className="space-y-3">
                    <a
                      href="mailto:suporte@catbutler.com"
                      className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-envelope text-green-600 dark:text-green-400"></i>
                        <div>
                          <div className="font-medium text-green-900 dark:text-green-100">
                            Contato por Email
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-300">
                            suporte@catbutler.com
                          </div>
                        </div>
                      </div>
                    </a>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-clock text-blue-600 dark:text-blue-400"></i>
                        <div>
                          <div className="font-medium text-blue-900 dark:text-blue-100">
                            Tempo de Resposta
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            Até 24 horas úteis
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📱 Sobre o CatButler
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-code text-purple-600 dark:text-purple-400"></i>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Versão
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            v4.0.2
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate('/sobre')}
                      className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-info-circle text-purple-600 dark:text-purple-400"></i>
                        <div className="text-left">
                          <div className="font-medium text-purple-900 dark:text-purple-100">
                            Sobre o Projeto
                          </div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">
                            Conheça mais sobre o CatButler
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modais */}
      
      {/* Modal: Perfil Salvo */}
      {modalAberto === 'perfil-salvo' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Configurações Salvas!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Suas preferências foram atualizadas com sucesso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Conta Familiar */}
      {modalAberto === 'conta-familiar' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                  <i className="fa-solid fa-users text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Conta Familiar
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Gerencie os membros da sua família
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalAberto(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-times text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5"></i>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Conta Familiar - Máximo 4 Membros</p>
                    <p>Adicione até 4 membros da família para compartilhar listas de tarefas, agenda e compras. Cada membro terá acesso personalizado e suas configurações serão sincronizadas quando o backend estiver totalmente integrado.</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Membros da Família</h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {familyMembers.length}/{MAX_FAMILY_MEMBERS} slots ocupados
                  </div>
                </div>
                
                <div className="space-y-3">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                          <i className={`fa-solid ${member.isOwner ? 'fa-crown' : 'fa-user'} text-blue-600 dark:text-blue-400 text-sm`}></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {member.name} {member.isOwner ? '(Você)' : ''}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {member.role} • {member.email}
                          </div>
                        </div>
                      </div>
                      {!member.isOwner && (
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remover membro"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Slots vazios */}
                  {Array.from({ length: MAX_FAMILY_MEMBERS - familyMembers.length }).map((_, index) => (
                    <div key={`empty-slot-${MAX_FAMILY_MEMBERS - index}`} className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="text-gray-400 dark:text-gray-500 text-sm">
                        <i className="fa-solid fa-plus mr-2" aria-hidden="true"></i>
                        Slot disponível
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Adicionar Membro</h4>
                {canAddMember ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Email do membro da família"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && addFamilyMember()}
                      />
                      <button 
                        onClick={addFamilyMember}
                        disabled={!newMemberEmail.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-plus mr-2" aria-hidden="true"></i>
                        Convidar
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      O membro receberá um convite por email para aceitar o acesso à conta familiar.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-users-slash text-amber-600 dark:text-amber-400"></i>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Limite máximo de {MAX_FAMILY_MEMBERS} membros atingido
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Remova um membro para adicionar outro
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setModalAberto(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Trocar Senha */}
      {modalAberto === 'trocar-senha' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-lock text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Alterar Senha
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crie uma nova senha segura para sua conta
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="senha-atual-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha atual
                </label>
                <input
                  id="senha-atual-modal"
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white transition-all duration-200"
                  placeholder="Digite sua senha atual"
                />
              </div>
              
              <div>
                <label htmlFor="nova-senha-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nova senha
                </label>
                <input
                  id="nova-senha-modal"
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white transition-all duration-200"
                  placeholder="Digite sua nova senha"
                />
              </div>
              
              <div>
                <label htmlFor="confirmar-senha-modal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmar-senha-modal"
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-white transition-all duration-200"
                  placeholder="Digite novamente a nova senha"
                />
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <div className="font-medium mb-2">Dicas para uma senha segura:</div>
                  <ul className="space-y-1 text-amber-700 dark:text-amber-300">
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
                className="py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setModalAberto('senha-alterada');
                  setTimeout(() => setModalAberto(null), 2000);
                }}
                className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors duration-200"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Senha Alterada */}
      {modalAberto === 'senha-alterada' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 text-center max-w-sm w-full">
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
      </div>
    </VisitorModeWrapper>
  );
}