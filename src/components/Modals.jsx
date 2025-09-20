import React, { useState } from 'react';

// Modal de Termos de Uso
export function TermsModal({ open, onClose }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-effect rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative fade-in-up max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl transition-colors"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-file-contract text-green-400"></i>
          {' '}Termos de Uso
        </h3>
        
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
          
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Aceitação dos Termos</h4>
            <p className="mb-2">
              Ao utilizar o CatButler, você concorda com estes termos de uso. Se não concordar, 
              não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Uso do Serviço</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>O CatButler é fornecido "como está", sem garantias de funcionamento contínuo</li>
              <li>Não utilize o serviço para atividades ilegais ou que violem direitos de terceiros</li>
              <li>Funcionalidades e políticas podem ser alteradas a qualquer momento</li>
              <li>Você é responsável por manter a segurança de sua conta</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Dados e Privacidade</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Coletamos dados de uso para melhorar a experiência do usuário</li>
              <li>Você pode solicitar a remoção de seus dados identificáveis</li>
              <li>Não compartilhamos dados pessoais com terceiros sem consentimento</li>
              <li>Utilizamos cookies para funcionalidades essenciais</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Limitações de Responsabilidade</h4>
            <p className="mb-2">
              O CatButler não se responsabiliza por danos diretos ou indiretos decorrentes 
              do uso ou impossibilidade de uso do serviço.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Contato</h4>
            <p>
              Para dúvidas sobre estes termos, entre em contato através do email: 
              <span className="text-green-600 dark:text-green-400 font-mono">
              {' '}contato@catbutler.app
            </span>
            </p>
          </section>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold shadow transition"
          >
            Fechar
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white font-semibold shadow transition flex items-center gap-2"
          >
            <i className="fa-solid fa-check"></i>
            {' '}Aceito
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Política de Privacidade
export function PrivacyModal({ open, onClose }) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-effect rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative fade-in-up max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl transition-colors"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-blue-400"></i>
          {' '}Política de Privacidade
        </h3>
        
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
          
          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Informações que Coletamos</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dados de conta:</strong> Nome, email e senha (criptografada)</li>
              <li><strong>Dados de uso:</strong> Páginas visitadas, funcionalidades utilizadas</li>
              <li><strong>Dados de conteúdo:</strong> Listas de compras, receitas salvas, preferências</li>
              <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Como Utilizamos suas Informações</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Personalizar sua experiência no CatButler</li>
              <li>Enviar notificações importantes sobre o serviço</li>
              <li>Analisar o uso para desenvolver novas funcionalidades</li>
              <li>Garantir a segurança e prevenir fraudes</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Compartilhamento de Dados</h4>
            <p className="mb-2">
              <strong>Não vendemos, alugamos ou compartilhamos</strong> seus dados pessoais com terceiros, 
              exceto nas seguintes situações:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Para proteger nossos direitos e segurança</li>
              <li>Com prestadores de serviços que nos auxiliam (sob contrato de confidencialidade)</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Seus Direitos (LGPD)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Acesso:</strong> Solicitar informações sobre seus dados</li>
              <li><strong>Correção:</strong> Corrigir dados incorretos ou incompletos</li>
              <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato legível</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Segurança dos Dados</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Criptografia de dados sensíveis</li>
              <li>Acesso restrito a funcionários autorizados</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backup regular e seguro dos dados</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6. Cookies e Tecnologias Similares</h4>
            <p className="mb-2">
              Utilizamos cookies essenciais para o funcionamento do serviço e cookies de 
              análise para melhorar a experiência do usuário.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">7. Contato</h4>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li><i className="fa-solid fa-envelope mr-2"></i>Email: <span className="text-blue-600 dark:text-blue-400 font-mono">privacidade@catbutler.app</span></li>
              <li><i className="fa-brands fa-whatsapp mr-2"></i>WhatsApp: <span className="text-blue-600 dark:text-blue-400">(11) 99999-9999</span></li>
            </ul>
          </section>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold shadow transition"
          >
            Fechar
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white font-semibold shadow transition flex items-center gap-2"
          >
            <i className="fa-solid fa-check"></i>
            {' '}Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook para gerenciar modais
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  return { isOpen, openModal, closeModal };
}

TermsModal.propTypes = {
};

PrivacyModal.propTypes = {
};
