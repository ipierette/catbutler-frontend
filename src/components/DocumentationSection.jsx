import React, { useState } from 'react';

function DocumentationSection() {
  const [openTutorial, setOpenTutorial] = useState(null);

  const tutoriais = [
    {
      id: 'sistema-creditos',
      titulo: '🪙 Sistema de Créditos',
      icon: 'fa-coins',
      color: 'amber',
      conteudo: {
        introducao: 'O sistema de créditos é uma forma de recompensar sua participação no CatButler!',
        comoGanhar: [
          'Completar tarefas diárias (+2 créditos)',
          'Usar o assistente IA (+1 crédito por consulta)',
          'Fazer compras pelo MercadoIA (+3 créditos)',
          'Personalizar seu perfil (+5 créditos)',
          'Login diário consecutivo (+1 crédito por dia)'
        ],
        comoUsar: [
          '10 créditos: Desbloqueiam tema escuro/claro',
          '20 créditos: Avatar especial "Gato Dourado"',
          '50 créditos: Bordas de avatar personalizadas',
          '100 créditos: Temas exclusivos (Neon, Galaxy, etc.)',
          '200 créditos: Avatares animados especiais',
          '500 créditos: Funcionalidades premium exclusivas'
        ],
        dicas: [
          'Você começa com 10 créditos grátis!',
          'Créditos nunca expiram',
          'Veja seu extrato no ícone 🪙 do header',
          'Participe ativamente para ganhar mais créditos'
        ]
      }
    },
    {
      id: 'assistente-ia',
      titulo: '🤖 Assistente IA',
      icon: 'fa-robot',
      color: 'blue',
      conteudo: {
        introducao: 'Seu assistente pessoal inteligente para diversas tarefas domésticas.',
        funcionalidades: [
          'Responde perguntas sobre casa e organização',
          'Sugere receitas baseadas em ingredientes',
          'Ajuda com planejamento de tarefas',
          'Dicas de limpeza e manutenção',
          'Conselhos de economia doméstica'
        ],
        comoUsar: [
          '1. Acesse a aba "Assistente" no menu',
          '2. Digite sua pergunta ou pedido',
          '3. Aguarde a resposta personalizada',
          '4. Use os botões de ação sugeridos',
          '5. Salve respostas importantes'
        ],
        exemplos: [
          '"Como organizar minha geladeira?"',
          '"Receita com frango e batata"',
          '"Como remover manchas de café?"',
          '"Lista de compras para a semana"'
        ]
      }
    },
    {
      id: 'cozinha-ia',
      titulo: '👨‍🍳 CozinhaIA',
      icon: 'fa-utensils',
      color: 'orange',
      conteudo: {
        introducao: 'Transforme ingredientes em receitas deliciosas com inteligência artificial.',
        funcionalidades: [
          'Receitas baseadas nos seus ingredientes',
          'Sugestões nutricionais equilibradas',
          'Tempo de preparo estimado',
          'Dificuldade da receita',
          'Dicas de preparação personalizadas'
        ],
        comoUsar: [
          '1. Adicione ingredientes que você tem',
          '2. Escolha tipo de prato (almoço, jantar, etc.)',
          '3. Defina tempo disponível para cozinhar',
          '4. Clique em "Gerar Receita"',
          '5. Siga o passo a passo detalhado'
        ],
        dicas: [
          'Quanto mais ingredientes, mais opções de receitas',
          'Especifique restrições alimentares',
          'Salve suas receitas favoritas',
          'Ganha +1 crédito por receita gerada'
        ]
      }
    },
    {
      id: 'faxina-ia',
      titulo: '🧽 FaxinaIA',
      icon: 'fa-broom',
      color: 'green',
      conteudo: {
        introducao: 'Planejamento inteligente de limpeza adaptado à sua rotina.',
        funcionalidades: [
          'Cronograma personalizado de limpeza',
          'Dicas específicas para cada ambiente',
          'Lista de produtos necessários',
          'Tempo estimado para cada tarefa',
          'Lembretes automáticos'
        ],
        comoUsar: [
          '1. Selecione os cômodos da sua casa',
          '2. Defina frequência de limpeza',
          '3. Escolha seu tempo disponível',
          '4. Receba seu plano personalizado',
          '5. Marque tarefas como concluídas'
        ],
        beneficios: [
          'Casa sempre organizada',
          'Economia de tempo',
          'Rotina sustentável',
          'Menos estresse com limpeza'
        ]
      }
    },
    {
      id: 'mercado-ia',
      titulo: '🛒 MercadoIA',
      icon: 'fa-shopping-cart',
      color: 'purple',
      conteudo: {
        introducao: 'Lista de compras inteligente que otimiza seu tempo e dinheiro.',
        funcionalidades: [
          'Listas organizadas por categoria',
          'Sugestões baseadas em histórico',
          'Comparação de preços',
          'Itens sazonais em destaque',
          'Controle de orçamento'
        ],
        comoUsar: [
          '1. Crie uma nova lista de compras',
          '2. Adicione itens manualmente ou por IA',
          '3. Organize por corredor do mercado',
          '4. Defina orçamento máximo',
          '5. Marque itens conforme compra'
        ],
        dicas: [
          'Sincronize com seu calendário de receitas',
          'Use a câmera para adicionar itens',
          'Compartilhe listas com a família',
          'Receba +3 créditos por lista completa'
        ]
      }
    },
    {
      id: 'personalizacao',
      titulo: '🎨 Personalização',
      icon: 'fa-palette',
      color: 'pink',
      conteudo: {
        introducao: 'Customize sua experiência no CatButler do seu jeito.',
        opcoes: [
          'Escolha entre 12 avatares únicos',
          'Temas claro e escuro',
          'Ativação automática de tema',
          'Cores de destaque personalizadas',
          'Layout adaptativo'
        ],
        comoUsar: [
          '1. Vá em Configurações → Geral',
          '2. Clique em "Editar Perfil"',
          '3. Escolha seu avatar favorito',
          '4. Configure tema automático',
          '5. Salve as alterações'
        ],
        futuros: [
          'Avatares animados (200 créditos)',
          'Bordas personalizadas (50 créditos)',
          'Temas exclusivos (100 créditos)',
          'Widgets customizáveis',
          'Sons personalizados'
        ]
      }
    }
  ];

  const toggleTutorial = (id) => {
    setOpenTutorial(openTutorial === id ? null : id);
  };

  const getColorClasses = (color) => {
    const colors = {
      amber: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-200',
      blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-200',
      green: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-200',
      pink: 'bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClass = (color) => {
    const colors = {
      amber: 'text-amber-600 dark:text-amber-400',
      blue: 'text-blue-600 dark:text-blue-400',
      orange: 'text-orange-600 dark:text-orange-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      pink: 'text-pink-600 dark:text-pink-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          📚 Documentação e Tutoriais
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Aprenda a usar todas as funcionalidades do CatButler
        </p>
      </div>

      <div className="space-y-4">
        {tutoriais.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => toggleTutorial(tutorial.id)}
              className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(tutorial.color)}`}>
                    <i className={`${tutorial.icon} text-lg ${getIconColorClass(tutorial.color)}`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tutorial.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tutorial.conteudo.introducao}
                    </p>
                  </div>
                </div>
                <i className={`fa-solid fa-chevron-${openTutorial === tutorial.id ? 'up' : 'down'} text-gray-400`}></i>
              </div>
            </button>

            {openTutorial === tutorial.id && (
              <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <div className="pt-6 space-y-6">
                  
                  {/* Funcionalidades / Como Ganhar */}
                  {(tutorial.conteudo.funcionalidades || tutorial.conteudo.comoGanhar) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        {tutorial.conteudo.comoGanhar ? '💰 Como Ganhar Créditos' : '⚡ Funcionalidades'}
                      </h4>
                      <ul className="space-y-2">
                        {(tutorial.conteudo.funcionalidades || tutorial.conteudo.comoGanhar || []).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <i className="fa-solid fa-check text-green-500 mt-1 text-sm"></i>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Como Usar */}
                  {tutorial.conteudo.comoUsar && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        {tutorial.conteudo.comoUsar ? '📖 Como Usar' : '🎯 Como Usar'}
                      </h4>
                      <ol className="space-y-2">
                        {tutorial.conteudo.comoUsar.map((passo, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{passo}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Exemplos */}
                  {tutorial.conteudo.exemplos && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        💡 Exemplos de Uso
                      </h4>
                      <div className="space-y-2">
                        {tutorial.conteudo.exemplos.map((exemplo, index) => (
                          <div key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <code className="text-sm text-gray-800 dark:text-gray-200">{exemplo}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opções / Benefícios */}
                  {(tutorial.conteudo.opcoes || tutorial.conteudo.beneficios) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        {tutorial.conteudo.opcoes ? '🎛️ Opções Disponíveis' : '🎯 Benefícios'}
                      </h4>
                      <ul className="space-y-2">
                        {(tutorial.conteudo.opcoes || tutorial.conteudo.beneficios || []).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <i className={`fa-solid ${tutorial.conteudo.opcoes ? 'fa-cog' : 'fa-star'} text-${tutorial.color}-500 mt-1 text-sm`}></i>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dicas / Futuros */}
                  {(tutorial.conteudo.dicas || tutorial.conteudo.futuros) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        {tutorial.conteudo.dicas ? '💡 Dicas Importantes' : '🚀 Funcionalidades Futuras'}
                      </h4>
                      <ul className="space-y-2">
                        {(tutorial.conteudo.dicas || tutorial.conteudo.futuros || []).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <i className={`fa-solid ${tutorial.conteudo.dicas ? 'fa-lightbulb' : 'fa-rocket'} text-yellow-500 mt-1 text-sm`}></i>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Card de Destaque do Sistema de Créditos */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <i className="fa-solid fa-coins text-2xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold">Sistema de Créditos</h3>
            <p className="text-amber-100">Desbloqueie recursos exclusivos!</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">10</div>
            <div className="text-sm text-amber-100">Créditos iniciais grátis</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">20</div>
            <div className="text-sm text-amber-100">Avatar dourado especial</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">∞</div>
            <div className="text-sm text-amber-100">Créditos nunca expiram</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentationSection;