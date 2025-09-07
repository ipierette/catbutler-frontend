import React, { useState } from "react";

export default function Config() {
  const [formData, setFormData] = useState({
    nome: "Usuário CatButler",
    email: "usuario@catbutler.com",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    localidade: "São Paulo, SP",
    contaFamiliar: false,
    notificacoes: true,
    tema: "light"
  });

  const [activeTab, setActiveTab] = useState("perfil");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de salvamento
    alert("Configurações salvas com sucesso!");
  };

  const tabs = [
    { id: "perfil", label: "Perfil", icon: "fa-user" },
    { id: "seguranca", label: "Segurança", icon: "fa-lock" },
    { id: "preferencias", label: "Preferências", icon: "fa-cog" },
    { id: "familia", label: "Conta Familiar", icon: "fa-users" }
  ];

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-4 max-w-7xl mx-auto">
      {/* Hero Section - Compacto */}
      <section className="relative flex items-center justify-between w-full mx-auto glass-effect rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500 h-20 sm:h-24">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <i className="fa-solid fa-cog text-xl sm:text-2xl text-green-600 dark:text-green-400" aria-label="configurações"></i>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              <span className="visitante-span">Configurações</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Gerencie sua conta e preferências
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Personalize sua experiência
          </p>
        </div>
      </section>

      {/* Tabs - Usando o mesmo estilo do MercadoIA */}
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-lg`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Perfil */}
        {activeTab === "perfil" && (
          <div className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-indigo-200 dark:bg-indigo-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <header className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-user text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Informações do Perfil</h2>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu email"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab Segurança */}
        {activeTab === "seguranca" && (
          <div className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-200 dark:bg-emerald-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <header className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-lock text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Segurança da Conta</h2>
            </header>
            <div className="space-y-4">
              <div>
                <label htmlFor="senhaAtual" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Senha Atual
                </label>
                <input
                  id="senhaAtual"
                  type="password"
                  name="senhaAtual"
                  value={formData.senhaAtual}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua senha atual"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="novaSenha" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nova Senha
                  </label>
                  <input
                    id="novaSenha"
                    type="password"
                    name="novaSenha"
                    value={formData.novaSenha}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    placeholder="Digite a nova senha"
                  />
                </div>
                <div>
                  <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Preferências */}
        {activeTab === "preferencias" && (
          <div className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 dark:bg-purple-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-pink-200 dark:bg-pink-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <header className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-cog text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preferências do Sistema</h2>
            </header>
            <div className="space-y-4">
              <div>
                <label htmlFor="localidade" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Localidade Padrão para Busca de Preços
                </label>
                <select
                  id="localidade"
                  name="localidade"
                  value={formData.localidade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="São Paulo, SP">São Paulo, SP</option>
                  <option value="Rio de Janeiro, RJ">Rio de Janeiro, RJ</option>
                  <option value="Belo Horizonte, MG">Belo Horizonte, MG</option>
                  <option value="Brasília, DF">Brasília, DF</option>
                  <option value="Salvador, BA">Salvador, BA</option>
                  <option value="Fortaleza, CE">Fortaleza, CE</option>
                  <option value="Manaus, AM">Manaus, AM</option>
                  <option value="Curitiba, PR">Curitiba, PR</option>
                  <option value="Recife, PE">Recife, PE</option>
                  <option value="Porto Alegre, RS">Porto Alegre, RS</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Esta localidade será usada para buscar preços de produtos no Mercado IA
                </p>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Notificações</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Receber notificações sobre sugestões e lembretes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    name="notificacoes"
                    checked={formData.notificacoes}
                    onChange={handleInputChange}
                    className="sr-only peer"
                    aria-label="Ativar notificações"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab Conta Familiar */}
        {activeTab === "familia" && (
          <div className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-700 border border-orange-200 dark:border-gray-600 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 dark:bg-orange-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-red-200 dark:bg-red-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
            
            <header className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-users text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Conta Familiar</h2>
            </header>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Ativar Conta Familiar</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Compartilhe receitas e listas de compras com sua família
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    name="contaFamiliar"
                    checked={formData.contaFamiliar}
                    onChange={handleInputChange}
                    className="sr-only peer"
                    aria-label="Ativar conta familiar"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                </label>
              </div>
              {formData.contaFamiliar && (
                <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div>
                    <label htmlFor="nomeFamilia" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Nome da Família
                    </label>
                    <input
                      id="nomeFamilia"
                      type="text"
                      placeholder="Ex: Família Silva"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="emailFamilia" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Convidar Membros da Família
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="emailFamilia"
                        type="email"
                        placeholder="email@exemplo.com"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        Convidar
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Enviaremos um convite por email para o membro da família
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botões de Ação - Compactos */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 mt-6">
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-200 hover:scale-105 transform shadow-md hover:shadow-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform flex items-center gap-2"
          >
            <i className="fa-solid fa-save text-sm"></i>{' '}
            Salvar Configurações
          </button>
        </div>
      </form>
    </main>
  );
}
