import { useState, useEffect, useMemo } from "react";
import gatoGif from "../assets/images/gato-unscreen.gif";
import { TermsModal, useModal } from "../components/Modals";
import { useNavigate, Link, useLocation } from "react-router-dom";
import StatsOffcanvas from "../components/StatsOffcanvas";


export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState([]);
  const [dailyTip, setDailyTip] = useState("");
  const [catFact, setCatFact] = useState("");
  const [achievements, setAchievements] = useState({});
  const [showCatFact, setShowCatFact] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const termsModal = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Forçar reanimação dos cards quando o usuário volta para a home
  useEffect(() => {
    if (location.pathname === '/') {
      setAnimationKey(prev => prev + 1);
    }
  }, [location.pathname]);

  // Obter saudação baseada no horário
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Obter sugestão baseada no horário
  const getTimeBasedSuggestion = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 10) {
      return "Que tal preparar um café da manhã nutritivo?";
    }
    if (hour >= 10 && hour < 12) {
      return "Hora de organizar as tarefas do dia!";
    }
    if (hour >= 12 && hour < 14) {
      return "Vamos preparar o almoço com ingredientes frescos?";
    }
    if (hour >= 14 && hour < 16) {
      return "Que tal uma faxina rápida na cozinha?";
    }
    if (hour >= 16 && hour < 18) {
      return "Hora de fazer as compras para o jantar!";
    }
    if (hour >= 18 && hour < 20) {
      return "Vamos preparar um jantar especial?";
    }
    return "Que tal planejar o dia de amanhã?";
  };

  // Obter rota baseada na sugestão do horário
  const getSuggestionRoute = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 10) {
      return "/cozinha-ia"; // Café da manhã
    }
    if (hour >= 10 && hour < 12) {
      return "/tarefas"; // Organizar tarefas
    }
    if (hour >= 12 && hour < 14) {
      return "/cozinha-ia"; // Almoço
    }
    if (hour >= 14 && hour < 16) {
      return "/faxina-ia"; // Faxina
    }
    if (hour >= 16 && hour < 18) {
      return "/mercado-ia"; // Compras
    }
    if (hour >= 18 && hour < 20) {
      return "/cozinha-ia"; // Jantar
    }
    return "/tarefas"; // Planejar o dia de amanhã
  };

  // Dicas do dia e fatos sobre gatos - memoizados para performance
  const dailyTips = useMemo(() => [
    "Organize sua geladeira por categorias para facilitar o acesso!",
    "Use vinagre branco para limpar superfícies de vidro sem manchas.",
    "Mantenha temperos em potes herméticos para preservar o sabor.",
    "Faça uma lista de compras antes de ir ao supermercado.",
    "Limpe a pia da cozinha imediatamente após o uso.",
    "Use papel alumínio para manter alimentos frescos por mais tempo.",
    "Organize utensílios por frequência de uso.",
    "Mantenha um calendário de limpeza para não esquecer nada."
  ], []);

  const catFacts = useMemo(() => [
    "Os gatos passam 70% da vida dormindo!",
    "Um gato pode fazer mais de 100 sons diferentes!",
    "Os bigodes dos gatos são sensores de movimento ultra-sensíveis!",
    "Gatos não conseguem sentir o sabor doce!",
    "O ronronar dos gatos pode curar ossos quebrados!",
    "Gatos têm 3 pálpebras em cada olho!",
    "Um gato pode correr até 48 km/h!",
    "Gatos suam apenas pelas patas!"
  ], []);

  // Simular dados de atividade recente baseados no localStorage
  useEffect(() => {
    const savedActivity = localStorage.getItem('catbutler-activity');
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    } else {
      const defaultActivity = [
        { id: 1, action: "Receita sugerida", item: "Pasta Carbonara", time: "2h atrás", icon: "fa-utensils", type: "recipe" },
        { id: 2, action: "Lista de compras", item: "Mercado Central", time: "Ontem", icon: "fa-shopping-cart", type: "shopping" },
        { id: 3, action: "Rotina de faxina", item: "Cozinha", time: "2 dias atrás", icon: "fa-broom", type: "cleaning" }
      ];
      setRecentActivity(defaultActivity);
      localStorage.setItem('catbutler-activity', JSON.stringify(defaultActivity));
    }
  }, []);

  // Gerar dica do dia baseada na data
  useEffect(() => {
    const today = new Date().getDate();
    const tipIndex = today % dailyTips.length;
    setDailyTip(dailyTips[tipIndex]);
  }, [dailyTips]);

  // Gerar fato sobre gatos
  useEffect(() => {
    const today = new Date().getDate();
    const factIndex = today % catFacts.length;
    setCatFact(catFacts[factIndex]);
  }, [catFacts]);

  // Simular conquistas baseadas no localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('catbutler-achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      const defaultAchievements = {
        recipes: Math.floor(Math.random() * 20) + 5,
        shopping: Math.floor(Math.random() * 15) + 3,
        tasks: Math.floor(Math.random() * 25) + 10,
        days: Math.floor(Math.random() * 10) + 1
      };
      setAchievements(defaultAchievements);
      localStorage.setItem('catbutler-achievements', JSON.stringify(defaultAchievements));
    }
  }, []);

  // Função para alternar entre dica e fato sobre gatos
  const toggleTipFact = () => {
    setShowCatFact(!showCatFact);
  };

  // Função para gerar nova dica ou fato
  const generateNewTipFact = async () => {
    setIsGenerating(true);
    
    // Simular um pequeno delay para dar feedback visual
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (showCatFact) {
      // Gerar novo fato sobre gatos
      const randomIndex = Math.floor(Math.random() * catFacts.length);
      setCatFact(catFacts[randomIndex]);
    } else {
      // Gerar nova dica
      const randomIndex = Math.floor(Math.random() * dailyTips.length);
      setDailyTip(dailyTips[randomIndex]);
    }
    
    setIsGenerating(false);
  };

  // Função para navegar para seções específicas
  const handleActivityClick = (activity) => {
    switch(activity.type) {
      case 'recipe':
        navigate('/cozinha-ia');
        break;
      case 'shopping':
        navigate('/mercado-ia');
        break;
      case 'cleaning':
        navigate('/faxina-ia');
        break;
      default:
        navigate('/historico');
    }
  };

  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      {/* Hero Section - Compacta e proporcional */}
      <section key={`hero-${animationKey}`} className="relative flex-responsive-center gap-responsive w-full mx-auto card-glass rounded-xl shadow-lg p-responsive mb-8 animate-fade-in-up min-h-40">
        <div className="flex flex-col items-center lg:items-start justify-center gap-3 lg:w-2/3 text-center lg:text-left px-2 sm:px-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-responsive-xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, <span className="text-primary-600 dark:text-primary-400">visitante</span>
            </h1>
            <i className="fa-solid fa-hand-peace text-2xl text-primary-500 dark:text-accent-400" aria-label="paz"></i>
          </div>
          <p className="text-responsive-sm text-gray-800 dark:text-white max-w-xl font-medium leading-relaxed mb-3">
            Organize sua casa com IA — receitas, faxina e compras numa experiência fluida.
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-2">
            <Link to="/cozinha-ia" className="btn-primary px-2.5 py-1.5 text-responsive-xs flex items-center gap-1 hover:scale-105 transform"><i className="fa-solid fa-bolt"></i> Começar</Link>
            <Link to="/mercado-ia" className="btn-secondary px-2.5 py-1.5 text-responsive-xs flex items-center gap-1 hover:scale-105 transform"><i className="fa-solid fa-tags"></i> Comparar preços</Link>
            <button type="button" onClick={termsModal.openModal} className="btn-accent px-2.5 py-1.5 text-responsive-xs flex items-center gap-1 hover:scale-105 transform"><i className="fa-solid fa-file-contract"></i> Termos de Uso</button>
          </div>
          <ul className="flex flex-wrap gap-1 sm:gap-2 items-center justify-center lg:justify-start text-center lg:text-left text-gray-800 dark:text-white text-xs font-semibold feature-list">
            <li className="flex items-center gap-1 sm:gap-2 whitespace-nowrap"><i className="fa-solid fa-wand-magic-sparkles text-accent-500 dark:text-accent-300"></i> Sugestões inteligentes</li>
            <li className="flex items-center gap-1 sm:gap-2 whitespace-nowrap"><i className="fa-solid fa-list-check text-primary-500 dark:text-primary-300"></i> Rotinas realistas</li>
            <li className="flex items-center gap-1 sm:gap-2 whitespace-nowrap"><i className="fa-solid fa-location-dot text-accent-500 dark:text-accent-300"></i> Preços locais</li>
          </ul>
        </div>
        <div className="hidden xl:block absolute lg:relative lg:w-1/3 flex items-end justify-center lg:justify-end">
          <img
            src={gatoGif}
            alt="gato-mordomo"
            className="w-[210px] h-[168px] sm:w-[240px] sm:h-[192px] lg:w-[270px] lg:h-[216px] object-contain hover:scale-105 transform transition-transform duration-300"
            style={{ transform: 'translateY(0px)' }}
          />
        </div>
      </section>
      
      {/* Seção de Ações Rápidas - Melhorada */}
      <section className="grid-responsive-3 gap-6 w-full mx-auto mb-8">
        <article key={`agora-${animationKey}`} className="card-glass rounded-xl shadow-lg p-responsive flex flex-col justify-between gap-3 animate-fade-in-up hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 border border-primary-200 dark:border-gray-600 relative overflow-hidden min-h-40">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-200 dark:bg-indigo-600 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
          
          <div className="flex-1 relative z-10">
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-clock text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Agora</h3>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </header>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 time-display">
                  {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(currentTime.getMinutes() / 60) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Progresso da hora
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-100 dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-gray-600 suggestion-card">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-400 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-lightbulb text-white dark:text-green-400 text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 dark:text-gray-200 font-bold leading-relaxed suggestion-text">
                      {getTimeBasedSuggestion()}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-gray-400 mt-1 font-medium suggestion-subtitle">
                      Sugestão baseada no horário
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 relative z-10">
            <div className="flex gap-2">
              <Link 
                to={getSuggestionRoute()} 
                className="btn px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-all duration-200 flex items-center gap-2 hover:scale-105 transform"
              >
                <i className="fa-solid fa-play text-sm"></i> 
                <span className="text-sm">Começar</span>
              </Link>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </div>
          </div>
        </article>

        <article key={`atividade-${animationKey}`} className="glass-effect rounded-xl shadow-lg p-3 sm:p-4 flex flex-col justify-between gap-2 fade-in-up hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 relative overflow-hidden" style={{minHeight: '8rem'}}>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-200 dark:bg-emerald-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
          
          <div className="flex-1 relative z-10">
            <header className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-white text-sm" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Atividade Recente</h3>
            </header>
            <div className="space-y-3">
              {recentActivity.slice(0, 2).map((activity, index) => {
                const colors = [
                  { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-white', time: 'text-blue-100' },
                  { bg: 'bg-gradient-to-r from-green-500 to-green-600', text: 'text-white', time: 'text-green-100' }
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <button 
                    key={activity.id} 
                    onClick={() => handleActivityClick(activity)}
                    className={`${colorScheme.bg} p-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 cursor-pointer group w-full text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${colorScheme.text} mb-1 group-hover:underline`}>{activity.item}</h4>
                        <p className={`text-xs ${colorScheme.time} opacity-90`}>{activity.time}</p>
                      </div>
                      <div className="ml-3">
                        <div className="w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-all duration-200"></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Link to="/historico" className="btn px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition-all duration-200 flex items-center gap-2 hover:scale-105 transform">
              <i className="fa-solid fa-history text-sm"></i> 
              <span className="text-sm">Ver tudo</span>
            </Link>
          </div>
        </article>

        <article key={`dicas-${animationKey}`} className="glass-effect rounded-xl shadow-lg p-3 sm:p-4 flex flex-col justify-between gap-2 fade-in-up hover:scale-105 transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 border border-yellow-200 dark:border-gray-600 relative overflow-hidden" style={{minHeight: '8rem'}}>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200 dark:bg-yellow-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-orange-200 dark:bg-orange-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
          
          <div className="flex-1 relative z-10">
            <header className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-star text-white text-sm" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Dicas do Dia</h3>
            </header>
            <div className="flex-1">
              <button 
                onClick={toggleTipFact}
                className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-600/20 dark:to-orange-600/20 border border-yellow-200 dark:border-yellow-500/30 rounded-xl p-3 tip-box h-full flex items-center cursor-pointer hover:shadow-md transition-all duration-200 group w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 dark:text-yellow-400 text-lg group-hover:scale-110 transition-transform duration-200">
                    <i className={`fa-solid ${showCatFact ? 'fa-cat' : 'fa-lightbulb'} text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                        <p className="text-sm text-yellow-800 dark:text-yellow-100 font-medium">
                          Gerando {showCatFact ? "novo fato" : "nova dica"}...
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-yellow-800 dark:text-yellow-100 font-medium leading-relaxed">
                          <strong>{showCatFact ? "Fato Curioso:" : "Dica:"}</strong> {showCatFact ? catFact : dailyTip}
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-200 mt-1 opacity-75">
                          Clique para {showCatFact ? "ver dica" : "ver fato sobre gatos"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              onClick={generateNewTipFact}
              disabled={isGenerating}
              className={`btn px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-200 flex items-center gap-2 hover:scale-105 transform active:scale-95 ${
                isGenerating 
                  ? 'bg-yellow-400 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="text-sm">Gerando...</span>
                </>
              ) : (
                <>
                  <i className={`fa-solid ${showCatFact ? 'fa-cat' : 'fa-lightbulb'} text-sm`}></i> 
                  <span className="text-sm">
                    {showCatFact ? 'Novo fato' : 'Nova dica'}
                  </span>
                </>
              )}
            </button>
          </div>
        </article>
      </section>
      
      {/* Espaço adicional no final para melhor scroll */}
      <div className="h-20"></div>
      
      <TermsModal open={termsModal.isOpen} onClose={termsModal.closeModal} />
      <StatsOffcanvas achievements={achievements} />
    </div>
  );
}
