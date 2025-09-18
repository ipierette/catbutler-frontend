// Debug específico para Vercel - verificar todas as configurações
console.log('🔍 VERCEL DEBUG INICIADO');

// Verificar variáveis de ambiente
console.group('📋 Environment Variables');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || 'UNDEFINED');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINED (length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'UNDEFINED');
console.log('VITE_ENV:', import.meta.env.VITE_ENV || 'UNDEFINED');
console.log('NODE_ENV:', import.meta.env.NODE_ENV || 'UNDEFINED');
console.log('DEV:', import.meta.env.DEV);
console.log('PROD:', import.meta.env.PROD);
console.log('MODE:', import.meta.env.MODE);
console.groupEnd();

// Verificar se React está disponível
console.group('⚛️ React Availability');
try {
  console.log('React import test...');
  import('react').then(React => {
    console.log('✅ React imported successfully:', React.version);
  }).catch(err => {
    console.error('❌ React import failed:', err);
  });
  
  console.log('ReactDOM import test...');
  import('react-dom').then(ReactDOM => {
    console.log('✅ ReactDOM imported successfully');
  }).catch(err => {
    console.error('❌ ReactDOM import failed:', err);
  });
} catch (error) {
  console.error('❌ React availability error:', error);
}
console.groupEnd();

// Verificar se App pode ser importado
console.group('🏠 App Component');
try {
  console.log('App import test...');
  import('./App.jsx').then(AppModule => {
    console.log('✅ App imported successfully:', AppModule);
    console.log('App default export:', AppModule.default);
    console.log('App named export:', AppModule.App);
  }).catch(err => {
    console.error('❌ App import failed:', err);
  });
} catch (error) {
  console.error('❌ App import error:', error);
}
console.groupEnd();

// Verificar contextos
console.group('🔐 Context Availability');
try {
  console.log('AuthContext import test...');
  import('./src/contexts/AuthContext.jsx').then(AuthModule => {
    console.log('✅ AuthContext imported successfully');
  }).catch(err => {
    console.error('❌ AuthContext import failed:', err);
  });
} catch (error) {
  console.error('❌ AuthContext error:', error);
}
console.groupEnd();

console.log('🎯 VERCEL DEBUG FINALIZADO');