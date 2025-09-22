import React, { useState } from 'react';
import { useFavoritos } from '../hooks/useCozinhaIA';
import { useAuth } from '../contexts/AuthContext';

const TesteFavoritos = () => {
  const { favoritos, loading, error, adicionarFavorito, removerFavorito, isFavorito } = useFavoritos();
  const { isAuthenticated, user } = useAuth();
  const [testResults, setTestResults] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  const testarEndpoint = async () => {
    setTestLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://catbutler-backend.vercel.app'}/api/kitchen/test-favorites`, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`
        }
      });
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults({ error: error.message });
    }
    setTestLoading(false);
  };

  const getToken = async () => {
    try {
      const { supabase } = await import('../utils/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token;
    } catch (e) {
      return null;
    }
  };

  const testarAdicionarFavorito = async () => {
    const receitaTeste = {
      id: 'teste-' + Date.now(),
      nome: 'Receita de Teste',
      ingredientes: ['teste', 'ingrediente'],
      instrucoes: 'Instruções de teste',
      tempoEstimado: '30',
      dificuldade: 'Fácil',
      imagem: '/images/teste.jpg'
    };

    try {
      await adicionarFavorito(receitaTeste, 5, 'Nota de teste');
      alert('Favorito adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar favorito: ' + error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        🧪 Teste de Favoritos - Debug
      </h2>

      {/* Status de Autenticação */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2">Status de Autenticação:</h3>
        <p>Autenticado: {isAuthenticated ? '✅ Sim' : '❌ Não'}</p>
        <p>Usuário: {user?.email || 'Não logado'}</p>
        <p>User ID: {user?.id || 'N/A'}</p>
      </div>

      {/* Status dos Favoritos */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Status dos Favoritos:</h3>
        <p>Loading: {loading ? '⏳ Sim' : '✅ Não'}</p>
        <p>Erro: {error ? `❌ ${error}` : '✅ Nenhum'}</p>
        <p>Total de favoritos: {favoritos.length}</p>
        {favoritos.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer">Ver favoritos ({favoritos.length})</summary>
            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
              {JSON.stringify(favoritos, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Botões de Teste */}
      <div className="mb-6 space-y-3">
        <button
          onClick={testarEndpoint}
          disabled={testLoading}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {testLoading ? '🔄 Testando...' : '🧪 Testar Endpoint Backend'}
        </button>

        {isAuthenticated && (
          <button
            onClick={testarAdicionarFavorito}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? '⏳ Adicionando...' : '⭐ Testar Adicionar Favorito'}
          </button>
        )}
      </div>

      {/* Resultados do Teste */}
      {testResults && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Resultados do Teste Backend:</h3>
          <details>
            <summary className="cursor-pointer">Ver resultados completos</summary>
            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </details>

          {testResults.tests && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Resumo dos Testes:</h4>
              {testResults.tests.map((test, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span>{test.error ? '❌' : '✅'}</span>
                  <span>{test.test}</span>
                  {test.error && <span className="text-red-600">({test.error})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Como usar:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Certifique-se de estar logado</li>
          <li>Clique em "Testar Endpoint Backend" para verificar a infraestrutura</li>
          <li>Se tudo estiver OK, teste "Adicionar Favorito"</li>
          <li>Verifique se o favorito aparece na lista</li>
        </ol>
      </div>
    </div>
  );
};

export default TesteFavoritos;
