import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { sanitizeInput, validateEmail } from '../utils/security';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    lembrar: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Processar confirmação de email quando usuário volta do link
  useEffect(() => {
    const emailToken = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (type === 'signup') {
      setSuccessMessage('Conta criada com sucesso! Faça login para continuar.');
    }

    if (emailToken && type === 'email') {
      setSuccessMessage('Email confirmado com sucesso! Você já pode fazer login.');
    }

    // Limpar parâmetros da URL
    if (searchParams.has('token') || searchParams.has('type')) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

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
    // Limpar mensagens quando usuário alterar qualquer campo
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset mensagens
    setErrors({});
    setSuccessMessage('');
    
    // Validação
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.senha, formData.lembrar);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setErrors({ submit: result.error || 'Erro ao fazer login' });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErrors({ submit: 'Erro inesperado. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Erro no login com Google:', error);
        setErrors({ submit: 'Erro ao fazer login com Google' });
      }
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setErrors({ submit: 'Erro inesperado no login com Google' });
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Digite seu email primeiro' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Digite um email válido' });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        setErrors({ submit: 'Erro ao enviar email de recuperação' });
      } else {
        setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setErrors({});
      }
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setErrors({ submit: 'Erro inesperado. Tente novamente.' });
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Fazendo login...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-4 max-w-2xl mx-auto">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center w-full mx-auto glass-effect rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500 h-20 sm:h-24">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-catbutler.webp" 
            alt="CatButler Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              CatButler
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seu assistente doméstico pessoal
            </p>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="glass-effect rounded-xl shadow-lg p-4 sm:p-6 fade-in-up bg-white/95 dark:bg-gray-700 border border-gray-200 dark:border-gray-500">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Entrar na sua conta
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Acesse todas as funcionalidades do CatButler
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha *
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Sua senha"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                errors.senha
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-500 focus:border-blue-500'
              }`}
              required
            />
            {errors.senha && (
              <p className="text-red-500 text-xs mt-1">{errors.senha}</p>
            )}
          </div>

          {/* Checkbox Lembrar */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                name="lembrar"
                type="checkbox"
                checked={formData.lembrar}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Manter logado
              </span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Botão Login */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Mensagens de erro */}
          {errors.submit && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Mensagens de sucesso */}
          {successMessage && (
            <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400"></i>
                <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
              </div>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">ou</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Login com Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        {/* Link para Cadastro */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Ainda não tem uma conta?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium transition-colors"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}