import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sanitizeInput, validateEmail } from '../utils/security';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    lembrar: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para login com provedores sociais
  const handleSocialLogin = async (provider) => {
    try {
      setIsSubmitting(true);
      console.log(`🔄 Iniciando login com ${provider}...`);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error(`🚨 Erro no login ${provider}:`, error);
        setErrors({
          submit: `Erro no login com ${provider}: ${error.message}`
        });
        return;
      }

      // O redirecionamento será automático
      console.log(`✅ Login ${provider} iniciado com sucesso!`);
      setSuccessMessage(`Redirecionando para ${provider}...`);

    } catch (error) {
      console.error(`🚨 Erro inesperado no login ${provider}:`, error);
      setErrors({
        submit: `Erro inesperado no login com ${provider}. Tente novamente.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Autenticação via AuthContext
      const result = await login(formData.email, formData.senha);
      
      if (result.success) {
        // Mostrar mensagem de sucesso profissional
        setSuccessMessage('Login realizado com sucesso! Redirecionando...');
        
        // Redirecionar mais rapidamente para evitar tela preta
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 800);
        
        // Limpar formulário
        setFormData({
          email: '',
          senha: '',
          lembrar: false
        });
      } else {
        // Erro na autenticação
        setErrors({
          submit: result.error || 'Erro desconhecido no login'
        });
      }
      
    } catch (error) {
      console.error('🚨 Erro no login:', error);
      setErrors({
        submit: 'Erro inesperado. Tente novamente em alguns momentos.'
      });
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
            src="/images/logo-catbutler.webp" 
            alt="CatButler Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Fazer Login</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Bem-vindo de volta!</p>
          </div>
        </div>
      </section>

      {/* Formulário de Login */}
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 dark:bg-green-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-200 dark:bg-emerald-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
        
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Mensagem de Sucesso */}
          {successMessage && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-check-circle"></i>
              {successMessage}
            </div>
          )}
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-offset-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="seu@email.com"
              maxLength={255}
              autoComplete="email"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
              data-testid="email-input"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Senha *
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-offset-2 ${
                errors.senha ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Digite sua senha"
              maxLength={128}
              autoComplete="current-password"
              aria-describedby={errors.senha ? 'senha-error' : undefined}
              aria-invalid={errors.senha ? 'true' : 'false'}
            />
            {errors.senha && (
              <p id="senha-error" className="text-red-500 text-xs mt-1" role="alert">{errors.senha}</p>
            )}
          </div>

          {/* Lembrar de mim */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer" htmlFor="lembrar">
              <input
                type="checkbox"
                id="lembrar"
                name="lembrar"
                checked={formData.lembrar}
                onChange={handleInputChange}
                className="text-green-600 focus:ring-green-500 rounded focus:ring-2 focus:ring-offset-2"
              />
              <span className="text-sm text-gray-900 dark:text-gray-300 font-semibold">
                Lembrar de mim
              </span>
            </label>
            <Link 
              to="/esqueci-senha" 
              className="text-sm text-green-600 hover:text-green-800 dark:text-green-400"
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Informações de Segurança - Dentro do formulário */}
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-500/30">
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-100 mb-2">
              <i className="fa-solid fa-lock mr-2"></i>Login Seguro
            </h3>
            <ul className="text-xs text-green-700 dark:text-green-200 space-y-1">
              <li>• Sua senha é criptografada e protegida</li>
              <li>• Sessão segura com HTTPS</li>
              <li>• Dados validados e sanitizados</li>
              <li>• Conformidade com LGPD</li>
            </ul>
          </div>

          {/* Link para Cadastro */}
          <div className="text-center">
            <p className="text-sm text-gray-700 dark:text-gray-400 font-medium">
              Não tem uma conta?{' '}
              <Link to="/criar-conta" className="text-green-600 hover:text-green-800 dark:text-green-400 font-semibold">
                Criar conta
              </Link>
            </p>
          </div>
        </form>
      </section>

      {/* Login Social (Opcional) */}
      <section className="mt-6 p-4 bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        <h3 className="text-2l font-bold text-gray-200 mb-3 text-center">
          Ou entre com
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Entrar com Facebook"
          >
            <i className="fa-brands fa-facebook" aria-hidden="true"></i>
            {isSubmitting ? 'Conectando...' : 'Facebook'}
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-800 text-white rounded-lg transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Entrar com Google"
          >
            <i className="fa-brands fa-google" aria-hidden="true"></i>
            {isSubmitting ? 'Conectando...' : 'Google'}
          </button>
        </div>
      </section>
    </main>
  );
}
