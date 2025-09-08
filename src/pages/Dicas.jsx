import React, { useState, useMemo } from 'react';
import FilterButton from '../components/ui/FilterButton';

// Dados das dicas domésticas
const dicasDomesticas = [
  {
    id: 1,
    titulo: 'Limpeza de Vidros sem Manchas',
    categoria: 'limpeza',
    dificuldade: 'facil',
    tempo: '5 min',
    descricao: 'Use jornal velho no lugar do pano para secar os vidros. O papel de jornal não deixa fiapos e dá um brilho especial!',
    dica: 'Misture água com vinagre branco (1:1) para um resultado ainda melhor',
    tags: ['vidros', 'limpeza', 'economia']
  },
  {
    id: 2,
    titulo: 'Geladeira Sempre Organizada',
    categoria: 'organizacao',
    dificuldade: 'medio',
    tempo: '15 min',
    descricao: 'Coloque uma caixa de bicarbonato aberta na geladeira para absorver odores e organize por zonas: laticínios em cima, verduras na gaveta.',
    dica: 'Troque o bicarbonato a cada 3 meses',
    tags: ['geladeira', 'organização', 'odores']
  },
  {
    id: 3,
    titulo: 'Economize na Conta de Luz',
    categoria: 'economia',
    dificuldade: 'facil',
    tempo: '2 min',
    descricao: 'Troque lâmpadas por LED e desligue aparelhos da tomada quando não usar. Um carregador ligado na tomada consome energia mesmo sem nada conectado!',
    dica: 'LED gasta 80% menos energia que lâmpadas convencionais',
    tags: ['energia', 'economia', 'sustentabilidade']
  },
  {
    id: 4,
    titulo: 'Panela Queimada? Solução Fácil!',
    categoria: 'cozinha',
    dificuldade: 'facil',
    tempo: '30 min',
    descricao: 'Coloque água e bicarbonato na panela, leve ao fogo por 10 minutos. Depois é só esfregar levemente que sai tudinho!',
    dica: 'Para panelas muito queimadas, adicione um pouco de vinagre',
    tags: ['panelas', 'limpeza', 'cozinha']
  },
  {
    id: 5,
    titulo: 'Roupas sem Amassados',
    categoria: 'lavanderia',
    dificuldade: 'medio',
    tempo: '10 min',
    descricao: 'Pendure as roupas ainda úmidas e dê uma "sacudida" antes. Para camisas, abotoe e coloque no cabide imediatamente.',
    dica: 'Tire do varal quando ainda um pouquinho úmidas',
    tags: ['roupas', 'ferro', 'organização']
  },
  {
    id: 6,
    titulo: 'Plantas Sempre Verdes',
    categoria: 'jardim',
    dificuldade: 'medio',
    tempo: '5 min',
    descricao: 'Regue pela manhã ou final do dia. Teste o solo com o dedo: se estiver seco a 2cm de profundidade, é hora de regar.',
    dica: 'Água da chuva é a melhor para suas plantas',
    tags: ['plantas', 'jardim', 'cuidados']
  }
];

// Fatos curiosos sobre gatos
const fatosCuriosos = [
  { id: 1, fato: 'Gatos conseguem fazer mais de 100 sons diferentes, enquanto cães fazem apenas 10!', categoria: 'comunicacao', icon: 'fa-solid fa-comment-dots' },
  { id: 2, fato: 'Um gato pode correr até 48 km/h - mais rápido que Usain Bolt!', categoria: 'fisica', icon: 'fa-solid fa-bolt' },
  { id: 3, fato: 'Gatos passam 70% da vida dormindo. Isso significa que um gato de 9 anos ficou acordado por apenas 3 anos!', categoria: 'comportamento', icon: 'fa-solid fa-bed' },
  { id: 4, fato: 'O ronronar dos gatos ajuda a curar ossos e músculos. A frequência de 20-50 Hz tem efeitos terapêuticos!', categoria: 'saude', icon: 'fa-solid fa-heart-pulse' },
  { id: 5, fato: 'Gatos não conseguem sentir o sabor doce. Eles não têm receptores para açúcar!', categoria: 'alimentacao', icon: 'fa-solid fa-candy-cane' },
  { id: 6, fato: 'O campo de visão dos gatos é de 200 graus, comparado aos 180 graus dos humanos.', categoria: 'visao', icon: 'fa-solid fa-eye' },
  { id: 7, fato: 'Gatos têm 32 músculos em cada orelha, permitindo que ela gire 180 graus!', categoria: 'anatomia', icon: 'fa-solid fa-head-side-virus' },
  { id: 8, fato: 'Um grupo de gatos é chamado de "clowder" e um grupo de gatinhos é chamado de "kindle".', categoria: 'curiosidades', icon: 'fa-solid fa-users' }
];

// Horóscopo do gato
const horoscopoGato = [
  { signo: 'Áries', data: '21 Mar - 19 Abr', icon: 'fa-solid fa-fire', color: 'text-red-600', previsao: 'Seu gato interior está cheio de energia hoje! Ótimo dia para organizar a casa e começar novos projetos.', dica: 'Faça uma faxina energética, mas pare para um cochilo no meio do dia.' },
  { signo: 'Touro', data: '20 Abr - 20 Mai', icon: 'fa-solid fa-mountain', color: 'text-green-600', previsao: 'Como um gato preguiçoso ao sol, hoje é dia de curtir os prazeres simples. Cozinhe algo gostoso.', dica: 'Prepare uma receita especial e desfrute cada momento.' },
  { signo: 'Gêmeos', data: '21 Mai - 20 Jun', icon: 'fa-solid fa-masks-theater', color: 'text-yellow-600', previsao: 'Sua curiosidade felina está em alta! Explore novas receitas ou reorganize os móveis.', dica: 'Experimente duas atividades diferentes hoje.' },
  { signo: 'Câncer', data: '21 Jun - 22 Jul', icon: 'fa-solid fa-home', color: 'text-blue-600', previsao: 'Dia perfeito para cuidar do seu lar. Como uma gata cuidando dos filhotes, organize seu espaço.', dica: 'Foque no ambiente doméstico com carinho.' }
];

const categoriasDicas = [
  { value: 'limpeza', label: 'Limpeza', icon: 'fa-solid fa-broom' },
  { value: 'organizacao', label: 'Organização', icon: 'fa-solid fa-boxes' },
  { value: 'cozinha', label: 'Cozinha', icon: 'fa-solid fa-utensils' },
  { value: 'economia', label: 'Economia', icon: 'fa-solid fa-piggy-bank' },
  { value: 'lavanderia', label: 'Lavanderia', icon: 'fa-solid fa-tshirt' },
  { value: 'jardim', label: 'Jardim', icon: 'fa-solid fa-seedling' }
];

const dificuldades = [
  { value: 'facil', label: 'Fácil', color: 'text-green-600', icon: 'fa-solid fa-thumbs-up' },
  { value: 'medio', label: 'Médio', color: 'text-yellow-600', icon: 'fa-solid fa-hand' },
  { value: 'dificil', label: 'Difícil', color: 'text-red-600', icon: 'fa-solid fa-exclamation-triangle' }
];

export default function Dicas() {
  const [activeTab, setActiveTab] = useState('dicas');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [favoritas, setFavoritas] = useState(new Set());
  const [selectedSign, setSelectedSign] = useState(null);

  // Filtrar dicas
  const dicasFiltradas = useMemo(() => {
    return dicasDomesticas.filter(dica => {
      if (selectedCategory && dica.categoria !== selectedCategory) return false;
      if (selectedDifficulty && dica.dificuldade !== selectedDifficulty) return false;
      return true;
    });
  }, [selectedCategory, selectedDifficulty]);

  // Toggle favorita
  const toggleFavorita = (dicaId) => {
    const newFavoritas = new Set(favoritas);
    if (newFavoritas.has(dicaId)) {
      newFavoritas.delete(dicaId);
    } else {
      newFavoritas.add(dicaId);
    }
    setFavoritas(newFavoritas);
  };

  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <i className="fa-solid fa-lightbulb text-xl text-yellow-600 dark:text-yellow-400"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Dicas do Mordomo
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sabedoria felina para o dia a dia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'dicas', label: 'Dicas', icon: 'fa-solid fa-lightbulb' },
            { id: 'fatos', label: 'Fatos', icon: 'fa-solid fa-cat' },
            { id: 'horoscopo', label: 'Horóscopo', icon: 'fa-solid fa-star' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <i className={`${tab.icon} text-xs`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dicas Domésticas */}
      {activeTab === 'dicas' && (
        <div>
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
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

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {dicasFiltradas.length} dica(s) encontrada(s)
            </div>
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
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-clock"></i>
                            {dica.tempo}
                          </span>
                          <span className={`flex items-center gap-1 ${dificuldade?.color}`}>
                            <i className={`${dificuldade?.icon} text-xs`}></i> {dificuldade?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorita(dica.id)}
                      className={`p-2 rounded-lg transition-colors ${
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

      {/* Fatos Curiosos */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fatosCuriosos.map(fato => (
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

      {/* Horóscopo do Gato */}
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

      {/* Espaço adicional no final */}
      <div className="h-20"></div>
    </div>
  );
}