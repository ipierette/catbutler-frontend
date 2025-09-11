import React from 'react';
import izadoraProfile from '../assets/images/izadora-profile.jpg';

export default function Sobre() {
  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
          <i className="fa-solid fa-info-circle text-xl text-cyan-600 dark:text-cyan-400"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Sobre o CatButler
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            A história por trás do seu assistente doméstico favorito
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* História do Projeto */}
        <section className="card-glass rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-cat text-white text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Como o CatButler Nasceu
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Uma ideia que nasceu da amizade e necessidade
              </p>
            </div>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              A ideia do <strong>CatButler</strong> partiu de grandes amigos que sentiram a necessidade de ferramentas que os ajudassem em suas rotinas diárias. Eles me pediram, como <strong>Desenvolvedora Fullstack</strong>, para criar algo que pudesse simplificar e otimizar as tarefas domésticas usando o poder da Inteligência Artificial.
            </p>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              Foi a partir dessa demanda real e do desejo de ajudar pessoas próximas que o <strong>CatButler</strong> nasceu - um assistente doméstico inteligente com personalidade felina, que combina praticidade, tecnologia moderna e um toque de diversão no dia a dia.
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-l-4 border-pink-400 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🎯 Missão do Projeto
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Transformar tarefas domésticas em experiências mais organizadas, eficientes e até mesmo divertidas, através de tecnologia acessível e design centrado no usuário.
              </p>
            </div>
          </div>
        </section>

        {/* Sobre a Desenvolvedora */}
        <section className="card-glass rounded-xl p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Foto e Info Principal */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <div className="w-32 h-32 mx-auto lg:mx-0 mb-4 relative">
                <img 
                  src={izadoraProfile} 
                  alt="Izadora Pierette" 
                  className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                  onError={(e) => {
                    // Fallback para o ícone caso a imagem não carregue
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center hidden">
                  <i className="fa-solid fa-user text-white text-4xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Izadora Pierette
              </h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                Desenvolvedora Fullstack
              </p>
              
              {/* Social Links */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <a
                  href="https://drive.google.com/file/d/1JY_hUoeiW-IVyCuJ9yg9CS63QZ3GZzDq/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <i className="fa-solid fa-download text-sm"></i>
                  <span className="text-sm font-medium">Currículo</span>
                </a>
              </div>
            </div>

            {/* Conteúdo será adicionado em seguida */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Sobre a Desenvolvedora
              </h3>
              
              <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Sou uma desenvolvedora apaixonada por criar soluções que realmente impactem a vida das pessoas. Com experiência em desenvolvimento fullstack, foco em tecnologias modernas como React, Node.js e integração com APIs de IA.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Acredito que a tecnologia deve ser acessível, intuitiva e, acima de tudo, útil no dia a dia. O CatButler representa essa filosofia: uma ferramenta poderosa com interface amigável e personalidade única.
                </p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Principais Tecnologias
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python',
                    'API Integration', 'UI/UX Design', 'Tailwind CSS'
                  ].map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contato e Apoio */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contato */}
          <div className="card-glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-comments text-green-600 dark:text-green-400 text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Entre em Contato
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Vamos conversar sobre projetos
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/5567984098786?text=Olá! Vi o CatButler e gostaria de conversar sobre desenvolvimento."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-brands fa-whatsapp text-white text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    WhatsApp
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Conversas rápidas e diretas
                  </div>
                </div>
                <i className="fa-solid fa-external-link-alt text-gray-400 ml-auto"></i>
              </a>

              <a
                href="mailto:ipierette2@gmail.com"
                className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-envelope text-white text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Email
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Para projetos e parcerias
                  </div>
                </div>
              </a>

              {/* Links Profissionais */}
              <a
                href="https://catbytes.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-globe text-white text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Portfolio
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Veja meus projetos
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/ipierette"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 dark:bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-brands fa-github text-white text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    GitHub
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Código aberto
                  </div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-brands fa-linkedin text-white text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    LinkedIn
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Rede profissional
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Apoio */}
          <div className="card-glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-heart text-pink-600 dark:text-pink-400 text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Apoie o Projeto
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ajude a manter o CatButler crescendo
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://ko-fi.com/ipierette"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 border border-pink-200 dark:border-pink-800 rounded-lg hover:from-pink-100 hover:to-red-100 dark:hover:from-pink-900/30 dark:hover:to-red-900/30 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-coffee text-white text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Ko-fi
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Compre um café para a dev ☕
                  </div>
                </div>
                <i className="fa-solid fa-external-link-alt text-gray-400 ml-auto"></i>
              </a>

              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 <strong>Sua contribuição</strong> ajuda a manter o projeto ativo e desenvolver novas funcionalidades!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agradecimentos */}
        <section className="card-glass rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-star text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Agradecimentos Especiais
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Um agradecimento especial a Cris e ao Rui, queridos amigos que inspiraram este projeto e a todos que acreditam no poder da tecnologia para simplificar e melhorar nosso dia a dia.
            <strong className="text-primary-600 dark:text-primary-400"> Juntos, fazemos a diferença! </strong>
            🐱✨
          </p>
        </section>

        {/* Footer da página */}
        <section className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-code"></i>
            <span className="text-sm">
              Feito com 💜 por Izadora Pierette •
            </span>
          </div>
        </section>
      </div>

      {/* Espaço adicional no final */}
      <div className="h-20"></div>
    </div>
  );
}