import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sanitizeInput, validateEmail, validatePassword, validateName } from '../utils/security';
import { TermsModal, PrivacyModal, useModal } from '../components/Modals';
import logoCatButler from '../assets/images/logo-catbutler.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitarTermos: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modais
  const termsModal = useModal();
  const privacyModal = useModal();


  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {};

    // Validar nome usando utilitário de segurança
    const nomeValidation = validateName(formData.nome);
    if (!nomeValidation.isValid) {
      newErrors.nome = nomeValidation.errors[0];
    }

    // Validar email usando utilitário de segurança
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha usando utilitário de segurança
    const senhaValidation = validatePassword(formData.senha);
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!senhaValidation.isValid) {
      newErrors.senha = senhaValidation.errors[0];
    }

    // Validar confirmação de senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    // Validar termos
    if (!formData.aceitarTermos) {
      newErrors.aceitarTermos = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio para API (aqui você integraria com seu backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso - redirecionar ou mostrar mensagem
      alert('Conta criada com sucesso! Bem-vindo ao CatButler! 🐱');
      
      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        aceitarTermos: false
      });
      
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-4 max-w-2xl mx-auto">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center w-full mx-auto glass-effect rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500 h-20 sm:h-24">
        <div className="flex items-center gap-3">
          <img 
            src={logoCatButler} 
            alt="CatButler Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Criar Conta</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Junte-se ao CatButler</p>
          </div>
        </div>
      </section>

      {/* Formulário de Cadastro */}
      <section className="glass-effect rounded-xl shadow-lg p-6 sm:p-8 fade-in-up bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-200 dark:bg-indigo-600 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors ${
                errors.nome ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Digite seu nome completo"
              maxLength={100}
            />
            {errors.nome && (
              <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors ${
                errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="seu@email.com"
              maxLength={255}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors ${
                errors.senha ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Mínimo 8 caracteres, 1 maiúscula e 1 número"
              maxLength={128}
            />
            {errors.senha && (
              <p className="text-red-500 text-xs mt-1">{errors.senha}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Confirmar Senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors ${
                errors.confirmarSenha ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Digite a senha novamente"
              maxLength={128}
            />
            {errors.confirmarSenha && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmarSenha}</p>
            )}
          </div>

          {/* Termos de Uso */}
          <div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="aceitarTermos"
                name="aceitarTermos"
                checked={formData.aceitarTermos}
                onChange={handleInputChange}
                className="text-blue-600 focus:ring-blue-500 rounded flex-shrink-0 w-4 h-4"
                aria-label="Aceitar termos de uso e política de privacidade"
              />
              <label htmlFor="aceitarTermos" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                <span>Aceito os </span>
                <button 
                  type="button"
                  onClick={termsModal.openModal}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline font-medium"
                >
                  Termos de Uso
                </button>
                <span> e </span>
                <button 
                  type="button"
                  onClick={privacyModal.openModal}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline font-medium"
                >
                  Política de Privacidade
                </button>
                <span className="text-red-500 font-semibold ml-1">*</span>
              </label>
            </div>
            {errors.aceitarTermos && (
              <p className="text-red-500 text-xs mt-2 ml-7">{errors.aceitarTermos}</p>
            )}
          </div>

          {/* Botão de Envio */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              }`}
            >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Criando Conta...
              </span>
            ) : (
              'Criar Conta'
            )}
            </button>
          </div>

          {/* Informações de Segurança - Dentro do formulário */}
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-500/30">
            <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
              <i className="fa-solid fa-lock text-green-600 dark:text-green-400"></i>
              <span className="font-medium">Dados criptografados • LGPD • Validação de entrada</span>
            </div>
          </div>

          {/* Link para Login */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-700 dark:text-gray-400 font-medium">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </section>

      {/* Modais */}
      <TermsModal open={termsModal.isOpen} onClose={termsModal.closeModal} />
      <PrivacyModal open={privacyModal.isOpen} onClose={privacyModal.closeModal} />
    </main>
  );
}
