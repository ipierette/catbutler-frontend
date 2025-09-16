import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FilterButton from '../components/ui/FilterButton';
import VisitorModeWrapper from '../components/VisitorModeWrapper';

// Dados das dicas domésticas
const dicasDomesticas = [
  {
    id: 1,
    titulo: 'Limpeza de Vidros sem Manchas',
    categoria: 'limpeza',
    dificuldade: 'fácil',
    tempo: '5 min',
    descricao: 'Use jornal velho no lugar do pano para secar os vidros. O papel de jornal não deixa fiapos e dá um brilho especial!',
    dica: 'Misture água com vinagre branco (1:1) para um resultado ainda melhor',
    tags: ['vidros', 'limpeza', 'economia']
  },
  {
    id: 2,
    titulo: 'Geladeira Sempre Organizada',
    categoria: 'organização',
    dificuldade: 'médio',
    tempo: '15 min',
    descricao: 'Coloque uma caixa de bicarbonato aberta na geladeira para absorver odores e organize por zonas: laticínios em cima, verduras na gaveta.',
    dica: 'Troque o bicarbonato a cada 3 meses',
    tags: ['geladeira', 'organização', 'odores']
  },
  {
    id: 3,
    titulo: 'Economize na Conta de Luz',
    categoria: 'economia',
    dificuldade: 'fácil',
    tempo: '2 min',
    descricao: 'Troque lâmpadas por LED e desligue aparelhos da tomada quando não usar. Um carregador ligado na tomada consome energia mesmo sem nada conectado!',
    dica: 'LED gasta 80% menos energia que lâmpadas convencionais',
    tags: ['energia', 'economia', 'sustentabilidade']
  },
  {
    id: 4,
    titulo: 'Panela Queimada? Solução Fácil!',
    categoria: 'cozinha',
    dificuldade: 'fácil',
    tempo: '10 min',
    descricao: 'Coloque bicarbonato de sódio na panela queimada, adicione água quente e deixe descansar por 15 minutos. Depois é só esfregar suavemente!',
    dica: 'Para manchas difíceis, adicione algumas gotas de detergente',
    tags: ['panela', 'limpeza', 'cozinha']
  },
  {
    id: 5,
    titulo: 'Roupas Sempre Cheirosas',
    categoria: 'lavanderia',
    dificuldade: 'fácil',
    tempo: '3 min',
    descricao: 'Adicione algumas gotas de óleo essencial no amaciante ou coloque um sachê perfumado no guarda-roupa.',
    dica: 'Lavanda e eucalipto são ótimas opções e ainda repelem insetos',
    tags: ['roupas', 'perfume', 'guarda-roupa']
  },
  {
    id: 6,
    titulo: 'Móveis Sempre Brilhando',
    categoria: 'limpeza',
    dificuldade: 'médio',
    tempo: '20 min',
    descricao: 'Misture azeite com limão para dar brilho em móveis de madeira. Para móveis escuros, use chá preto gelado.',
    dica: 'Sempre teste em uma área pequena primeiro',
    tags: ['móveis', 'madeira', 'brilho']
  }
];

// Dados dos fatos curiosos sobre gatos
const fatosCuriosos = [
  { id: 1, fato: 'Gatos conseguem fazer mais de 100 sons diferentes, enquanto cães fazem apenas 10!', categoria: 'comunicação', icon: 'fa-solid fa-comment-dots' },
  { id: 2, fato: 'Um gato pode correr até 48 km/h - mais rápido que Usain Bolt!', categoria: 'física', icon: 'fa-solid fa-bolt' },
  { id: 3, fato: 'Gatos passam 70% da vida dormindo. Isso significa que um gato de 9 anos ficou acordado por apenas 3 anos!', categoria: 'comportamento', icon: 'fa-solid fa-bed' },
  { id: 4, fato: 'O ronronar dos gatos ajuda a curar ossos e músculos. A frequência de 20-50 Hz tem efeitos terapêuticos!', categoria: 'saúde', icon: 'fa-solid fa-heart-pulse' },
  { id: 5, fato: 'Gatos não conseguem sentir o sabor doce. Eles não têm receptores para açúcar!', categoria: 'alimentação', icon: 'fa-solid fa-candy-cane' },
  { id: 6, fato: 'O campo de visão dos gatos é de 200 graus, comparado aos 180 graus dos humanos.', categoria: 'visão', icon: 'fa-solid fa-eye' },
  { id: 7, fato: 'Gatos têm 32 músculos em cada orelha, permitindo que ela gire 180 graus!', categoria: 'anatomia', icon: 'fa-solid fa-head-side-virus' },
  { id: 8, fato: 'Um grupo de gatos é chamado de "clowder" e um grupo de gatinhos é chamado de "kindle".', categoria: 'curiosidades', icon: 'fa-solid fa-users' }
];

// Horóscopo do Gato
const horoscopoGato = [
  { signo: 'Áries', data: '21 Mar - 19 Abr', icon: 'fa-solid fa-fire', color: 'text-red-600', previsao: 'Seu gato interior está cheio de energia hoje! Ótimo dia para organizar a casa e começar novos projetos.', dica: 'Faça uma faxina energética, mas pare para um cochilo no meio do dia.' },
  { signo: 'Touro', data: '20 Abr - 20 Mai', icon: 'fa-solid fa-mountain', color: 'text-green-600', previsao: 'Como um gato preguiçoso ao sol, hoje é dia de curtir os prazeres simples. Cozinhe algo gostoso.', dica: 'Prepare uma receita especial e desfrute cada momento.' },
  { signo: 'Gêmeos', data: '21 Mai - 20 Jun', icon: 'fa-solid fa-masks-theater', color: 'text-yellow-600', previsao: 'Sua curiosidade felina está em alta! Explore novas receitas ou reorganize os móveis.', dica: 'Experimente duas atividades diferentes hoje.' },
  { signo: 'Câncer', data: '21 Jun - 22 Jul', icon: 'fa-solid fa-home', color: 'text-blue-600', previsao: 'Dia perfeito para cuidar do seu lar. Como uma gata cuidando dos filhotes, organize seu espaço.', dica: 'Foque no ambiente doméstico com carinho.' }
];

// Configurações de filtros
const categoriasDicas = [
  { value: 'limpeza', label: 'Limpeza', icon: 'fa-solid fa-broom' },
  { value: 'organização', label: 'Organização', icon: 'fa-solid fa-boxes' },
  { value: 'economia', label: 'Economia', icon: 'fa-solid fa-piggy-bank' },
  { value: 'cozinha', label: 'Cozinha', icon: 'fa-solid fa-utensils' },
  { value: 'lavanderia', label: 'Lavanderia', icon: 'fa-solid fa-tshirt' }
];

const dificuldades = [
  { value: 'fácil', label: 'Fácil' },
  { value: 'médio', label: 'Médio' },
  { value: 'difícil', label: 'Difícil' }
];

// Categorias para filtro dos fatos
const categoriasFatos = [
  { value: 'comunicação', label: 'Comunicação', icon: 'fa-solid fa-comment-dots' },
  { value: 'física', label: 'Física', icon: 'fa-solid fa-bolt' },
  { value: 'comportamento', label: 'Comportamento', icon: 'fa-solid fa-bed' },
  { value: 'saúde', label: 'Saúde', icon: 'fa-solid fa-heart-pulse' },
  { value: 'alimentação', label: 'Alimentação', icon: 'fa-solid fa-candy-cane' },
  { value: 'visão', label: 'Visão', icon: 'fa-solid fa-eye' },
  { value: 'anatomia', label: 'Anatomia', icon: 'fa-solid fa-head-side-virus' },
  { value: 'curiosidades', label: 'Curiosidades', icon: 'fa-solid fa-users' }
];

export default function Dicas() {
  // Auth context
  const { isVisitorMode } = useAuth();
  
  // Define aba inicial baseado no modo visitante
  const [activeTab, setActiveTab] = useState(isVisitorMode ? 'fatos' : 'dicas');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('todas');
  const [selectedFactCategory, setSelectedFactCategory] = useState('todas');
  const [favoritas, setFavoritas] = useState(new Set());
  const [selectedSign, setSelectedSign] = useState(null);

  const toggleFavorita = (id) => {
    const newFavoritas = new Set(favoritas);
    if (newFavoritas.has(id)) {
      newFavoritas.delete(id);
    } else {
      newFavoritas.add(id);
    }
    setFavoritas(newFavoritas);
  };

  const dicasFiltradas = useMemo(() => {
    return dicasDomesticas.filter(dica => {
      const matchCategory = selectedCategory === 'todas' || dica.categoria === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'todas' || dica.dificuldade === selectedDifficulty;
      return matchCategory && matchDifficulty;
    });
  }, [selectedCategory, selectedDifficulty]);

  const fatosFiltrados = useMemo(() => {
    return fatosCuriosos.filter(fato => {
      return selectedFactCategory === 'todas' || fato.categoria === selectedFactCategory;
    });
  }, [selectedFactCategory]);

  const handleTabClick = (tabName) => {
    if (isVisitorMode && tabName === 'dicas') {
      alert('As dicas são exclusivas para usuários cadastrados!');
      return;
    }
    setActiveTab(tabName);
  };

  return (
    <VisitorModeWrapper pageName="as dicas">
      <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      {/* Header padronizado */}
      <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
              <i className="fa-solid fa-lightbulb text-lg sm:text-xl text-amber-600 dark:text-amber-400" aria-label="dicas"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Dicas do Mordomo
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Sabedoria felina para o dia a dia
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm max-w-fit">
            {[
              { key: 'dicas', label: 'Dicas', icon: 'fa-solid fa-lightbulb', restricted: isVisitorMode },
              { key: 'fatos', label: 'Fatos', icon: 'fa-solid fa-cat' },
              { key: 'horoscopo', label: 'Horóscopo', icon: 'fa-solid fa-star' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white shadow-sm'
                    : tab.restricted
                      ? 'text-gray-400 hover:text-gray-500 opacity-60'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
                {tab.restricted && <i className="fa-solid fa-lock text-xs ml-1"></i>}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          {activeTab === 'dicas' && (
            <div>
              {isVisitorMode ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
                    <i className="fa-solid fa-lock text-4xl text-amber-600 dark:text-amber-400"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Conteúdo Exclusivo
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                    As dicas domésticas são exclusivas para usuários cadastrados.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => window.location.href = '/criar-conta'}
                      className="btn-primary px-6 py-3 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-user-plus text-sm"></i>
                      Criar Conta Gratuita
                    </button>
                    <button
                      onClick={() => setActiveTab('fatos')}
                      className="btn-secondary px-6 py-3 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-cat text-sm"></i>
                      Ver Fatos Curiosos
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Filtros - Alinhados à direita para não ficarem atrás da sidebar */}
                  <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mr-auto">
                      {dicasFiltradas.length} dica(s) encontrada(s)
                    </div>
                    
                    <FilterButton
                      label="Categoria"
                      icon="fa-solid fa-tags"
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      options={categoriasDicas.map(cat => ({
                        value: cat.value,
                        label: cat.label,
                        icon: cat.icon,
                        count: dicasDomesticas.filter(d => d.categoria === cat.value).length
                      }))}
                    />
                    
                    <FilterButton
                      label="Dificuldade"
                      icon="fa-solid fa-signal"
                      value={selectedDifficulty}
                      onChange={setSelectedDifficulty}
                      options={dificuldades.map(diff => ({
                        value: diff.value,
                        label: diff.label,
                        count: dicasDomesticas.filter(d => d.dificuldade === diff.value).length
                      }))}
                    />
                  </div>

                  {/* Grid de Dicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dicasFiltradas.map(dica => {
                      const categoria = categoriasDicas.find(c => c.value === dica.categoria);
                      const dificuldade = dificuldades.find(d => d.value === dica.dificuldade);
                      
                      return (
                        <div key={dica.id} className="card-glass rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                <i className={`${categoria?.icon} text-primary-600 dark:text-primary-400`}></i>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {dica.titulo}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <span className="flex items-center gap-1">
                                    <i className="fa-solid fa-clock"></i>
                                    {dica.tempo}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <i className="fa-solid fa-signal"></i>
                                    {dificuldade?.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleFavorita(dica.id)}
                              className={`p-2 rounded-full transition-colors ${
                                favoritas.has(dica.id)
                                  ? 'text-red-500 hover:text-red-600'
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <i className={`fa-${favoritas.has(dica.id) ? 'solid' : 'regular'} fa-heart`}></i>
                            </button>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {dica.descricao}
                          </p>

                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-4">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              {dica.dica}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {dica.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fatos' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-cat text-3xl text-orange-600 dark:text-orange-400"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Fatos Curiosos sobre Gatos
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Descubra curiosidades incríveis sobre nossos amigos felinos
                </p>
              </div>

              {/* Filtro por categoria dos fatos */}
              <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mr-auto">
                  {fatosFiltrados.length} fato(s) encontrado(s)
                </div>
                
                <FilterButton
                  label="Categoria"
                  icon="fa-solid fa-filter"
                  value={selectedFactCategory}
                  onChange={setSelectedFactCategory}
                  options={categoriasFatos.map(cat => ({
                    value: cat.value,
                    label: cat.label,
                    icon: cat.icon,
                    count: fatosCuriosos.filter(f => f.categoria === cat.value).length
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fatosFiltrados.map(fato => (
                  <div key={fato.id} className="card-glass rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${fato.icon} text-lg text-primary-600 dark:text-primary-400`}></i>
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {fato.fato}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                            {fato.categoria}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'horoscopo' && (
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-star text-3xl text-purple-600 dark:text-purple-400"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Horóscopo do Gato
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Previsões felinas para organizar melhor seu dia
                </p>
              </div>

              {/* Grid de signos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {horoscopoGato.map(signo => (
                  <div
                    key={signo.signo}
                    className="card-glass rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedSign(selectedSign === signo.signo ? null : signo.signo)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${signo.color}`}>
                        <i className={`${signo.icon} text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {signo.signo}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {signo.data}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {signo.previsao}
                    </p>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>{signo.dica}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </VisitorModeWrapper>
  );
}
