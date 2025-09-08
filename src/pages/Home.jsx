import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TermsModal, useModal } from '../components/Modals';
import StatsOffcanvas from '../components/StatsOffcanvas';
import OptimizedImage from '../components/OptimizedImage';
import gatoGif from '../assets/images/gato-unscreen.gif';

// Dados estáticos otimizados
const TIPS = [
  "Organize sua geladeira por categorias para facilitar o acesso!",
  "Use vinagre branco para limpar superfícies de vidro sem manchas.",
  "Mantenha produtos de limpeza em locais seguros, longe de crianças e pets.",
  "Planeje suas refeições no domingo para uma semana mais organizada.",
  "Use recipientes transparentes para guardar alimentos e facilitar a identificação.",
  "Crie uma lista de compras por seções do supermercado para ser mais eficiente.",
  "Limpeza diária de 15 minutos previne acúmulo de sujeira.",
  "Mantenha sempre ingredientes básicos em casa: ovos, leite, farinha."
];

const CAT_FACTS = [
  "Os gatos passam 70% da vida dormindo para conservar energia!",
  "Um gato pode fazer mais de 100 sons vocais diferentes!",
  "Os bigodes dos gatos são sensores que detectam vibrações no ar!",
  "Gatos não conseguem sentir o sabor doce!",
  "O ronronar dos gatos vibra numa frequência que pode curar ossos!",
  "Gatos têm uma terceira pálpebra chamada membrana nictitante!",
  "Um gato pode correr até 48 km/h em rajadas curtas!",
  "Gatos suam apenas pelas almofadas das patas!"
];

const ACTIVITIES = [
  { id: 1, title: "Pasta Carbonara", subtitle: "Receita sugerida", time: "2h atrás", icon: "fa-utensils", color: "from-blue-500 to-blue-600", route: "/cozinha-ia" },
  { id: 2, title: "Mercado Central", subtitle: "Lista de compras", time: "Ontem", icon: "fa-shopping-cart", color: "from-green-500 to-green-600", route: "/mercado-ia" }
];

const ACHIEVEMENTS = {
  recipes: 11,
  shopping: 5,
  tasks: 29,
  days: 5
};

export default function Home() {
  // Estados essenciais
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCatFact, setShowCatFact] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const termsModal = useModal();
  const navigate = useNavigate();

  // Atualizar relógio a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Saudação e sugestão baseadas no horário - memoizadas
  const { greeting, suggestion, suggestionRoute } = useMemo(() => {
    const hour = currentTime.getHours();
    
    let greeting;
    if (hour < 12) greeting = "Bom dia";
    else if (hour < 18) greeting = "Boa tarde";
    else greeting = "Boa noite";

    let suggestion, suggestionRoute;
    if (hour >= 6 && hour < 10) {
      suggestion = "Que tal preparar um café da manhã nutritivo?";
      suggestionRoute = "/cozinha-ia";
    } else if (hour >= 10 && hour < 12) {
      suggestion = "Hora de organizar as tarefas do dia!";
      suggestionRoute = "/tarefas";
    } else if (hour >= 12 && hour < 14) {
      suggestion = "Vamos preparar o almoço com ingredientes frescos?";
      suggestionRoute = "/cozinha-ia";
    } else if (hour >= 14 && hour < 17) {
      suggestion = "Que tal uma faxina rápida na casa?";
      suggestionRoute = "/faxina-ia";
    } else if (hour >= 17 && hour < 20) {
      suggestion = "Hora de fazer as compras para o jantar!";
      suggestionRoute = "/mercado-ia";
    } else if (hour >= 20 && hour < 22) {
      suggestion = "Vamos preparar um jantar especial?";
      suggestionRoute = "/cozinha-ia";
    } else {
      suggestion = "Que tal planejar o dia de amanhã?";
      suggestionRoute = "/agenda";
    }

    return { greeting, suggestion, suggestionRoute };
  }, [currentTime.getHours()]);

  // Dados atuais baseados nos índices
  const currentTip = useMemo(() => TIPS[currentTipIndex], [currentTipIndex]);
  const currentFact = useMemo(() => CAT_FACTS[currentFactIndex], [currentFactIndex]);

  // Funções de interação
  const toggleTipFact = useCallback(() => {
    setShowCatFact(!showCatFact);
  }, [showCatFact]);

  const generateNew = useCallback(async () => {
    setIsGenerating(true);
    
    // Simular loading para UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (showCatFact) {
      setCurrentFactIndex(prev => (prev + 1) % CAT_FACTS.length);
    } else {
      setCurrentTipIndex(prev => (prev + 1) % TIPS.length);
    }
    
    setIsGenerating(false);
  }, [showCatFact]);

  const handleActivityClick = useCallback((activity) => {
    navigate(activity.route);
  }, [navigate]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 lg:p-6 space-y-8">
        
        {/* Hero Section */}
        <section className="relative card-glass rounded-2xl shadow-xl p-6 lg:p-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/30 dark:bg-primary-600/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-200/30 dark:bg-accent-600/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-6">
              {/* Greeting */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    {greeting}, <span className="text-primary-600 dark:text-primary-400">visitante</span>
                  </h1>
                  <i className="fa-solid fa-hand-peace text-2xl text-primary-500 dark:text-accent-400 animate-pulse"></i>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                  Organize sua casa com IA — receitas, faxina e compras numa experiência fluida.
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: "fa-utensils", text: "Sugestões inteligentes", color: "text-green-600 dark:text-green-400" },
                  { icon: "fa-list-check", text: "Rotinas realistas", color: "text-blue-600 dark:text-blue-400" },
                  { icon: "fa-location-dot", text: "Preços locais", color: "text-purple-600 dark:text-purple-400" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm font-medium">
                    <i className={`fa-solid ${feature.icon} ${feature.color}`}></i>
                    <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Time-based suggestion */}
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-lightbulb text-white text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-900 dark:text-blue-100 font-semibold mb-1">
                      {suggestion}
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Sugestão baseada no horário atual
                    </p>
                  </div>
                  <Link 
                    to={suggestionRoute}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-play text-xs"></i>
                    Começar
                  </Link>
                </div>
              </div>
            </div>

            {/* Cat Image */}
            <div className="hidden lg:flex justify-center">
              <OptimizedImage
                src={gatoGif}
                alt="CatButler - Assistente doméstico felino"
                className="w-64 h-52 object-contain hover:scale-105 transition-transform duration-300"
                priority={true}
              />
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          
          {/* Current Time Card */}
          <article className="card-glass rounded-xl shadow-lg p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border border-indigo-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-clock text-white"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Agora</h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
              
              <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                <div 
                  className="bg-indigo-500 dark:bg-indigo-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentTime.getMinutes() / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </article>

          {/* Recent Activity Card */}
          <article className="card-glass rounded-xl shadow-lg p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-white"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Atividade</h3>
              </div>
              <Link 
                to="/historico" 
                className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
              >
                Ver tudo
              </Link>
            </div>
            
            <div className="space-y-3">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className={`w-full bg-gradient-to-r ${activity.color} p-3 rounded-lg text-white text-left hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{activity.title}</div>
                      <div className="text-xs opacity-90">{activity.subtitle}</div>
                    </div>
                    <div className="text-xs opacity-75">{activity.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </article>

          {/* Tips & Facts Card */}
          <article className="card-glass rounded-xl shadow-lg p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border border-yellow-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i className={`fa-solid ${showCatFact ? 'fa-cat' : 'fa-lightbulb'} text-white`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {showCatFact ? 'Fato Curioso' : 'Dica do Dia'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={toggleTipFact}
                className="w-full text-left p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors duration-200"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                      Gerando {showCatFact ? "novo fato" : "nova dica"}...
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium leading-relaxed">
                      {showCatFact ? currentFact : currentTip}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 opacity-75">
                      Clique para {showCatFact ? "ver dica" : "ver fato sobre gatos"}
                    </p>
                  </div>
                )}
              </button>
              
              <button
                onClick={generateNew}
                disabled={isGenerating}
                className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isGenerating 
                    ? 'bg-yellow-400 text-yellow-800 cursor-not-allowed' 
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-800 border-t-transparent"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <i className={`fa-solid ${showCatFact ? 'fa-cat' : 'fa-lightbulb'}`}></i>
                    {showCatFact ? 'Novo fato' : 'Nova dica'}
                  </>
                )}
              </button>
            </div>
          </article>
        </section>


        {/* Spacing for mobile scroll */}
        <div className="h-16"></div>
      </div>

      {/* Modals */}
      <TermsModal open={termsModal.isOpen} onClose={termsModal.closeModal} />
      <StatsOffcanvas achievements={ACHIEVEMENTS} />
    </div>
  );
}