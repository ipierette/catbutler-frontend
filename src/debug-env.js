// Debug das variáveis de ambiente - remover após deploy funcionar
console.log('🔍 DEBUG - Variáveis de Ambiente:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '[PRESENTE]' : '[AUSENTE]',
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_ENV: import.meta.env.VITE_ENV,
  VITE_DEBUG: import.meta.env.VITE_DEBUG,
  VITE_VISITOR_MODE: import.meta.env.VITE_VISITOR_MODE,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  BASE_URL: import.meta.env.BASE_URL
});

// Verificar se elementos essenciais existem
const checks = {
  'DOM root exists': !!document.getElementById('root'),
  'Supabase URL configured': !!import.meta.env.VITE_SUPABASE_URL,
  'Supabase Key configured': !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  'Window object': typeof window !== 'undefined',
  'Navigator object': typeof navigator !== 'undefined'
};

console.log('✅ Verificações de ambiente:', checks);

// Export para poder importar em outros lugares se necessário
export default checks;