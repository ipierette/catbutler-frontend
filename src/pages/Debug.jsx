import React, { useEffect, useState } from 'react';
import TesteFavoritos from '../components/TesteFavoritos';

export default function Debug() {
  const [version, setVersion] = useState(null);
  const [buildTime, setBuildTime] = useState(null);

  useEffect(() => {
    // Buscar informações de versão
    fetch('/version.json')
      .then(res => res.json())
      .then(data => setVersion(data))
      .catch(err => console.error('Erro ao buscar versão:', err));
    
    // Timestamp de quando a página foi carregada
    setBuildTime(new Date().toLocaleString('pt-BR'));
  }, []);

  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🔍 Debug - Versão do Site
        </h1>
        
        <div className="grid gap-6">
          {/* Informações de Versão */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              📦 Versão Atual
            </h2>
            {version ? (
              <div className="space-y-2">
                <p><strong>Versão:</strong> {version.version}</p>
                <p><strong>Última Atualização:</strong> {new Date(version.lastUpdate).toLocaleString('pt-BR')}</p>
                <p><strong>Deploy Hash:</strong> {version.deployHash}</p>
                <p><strong>Página Carregada em:</strong> {buildTime}</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Carregando informações...</p>
            )}
          </div>

          {/* Funcionalidades Implementadas */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              ⚡ Funcionalidades Implementadas
            </h2>
            {version?.features ? (
              <ul className="space-y-2">
                {version.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Carregando funcionalidades...</p>
            )}
          </div>

          {/* Informações do Build */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              🛠️ Informações do Build
            </h2>
            {version?.buildInfo ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Node:</strong> {version.buildInfo.node}</p>
                <p><strong>Vite:</strong> {version.buildInfo.vite}</p>
                <p><strong>React:</strong> {version.buildInfo.react}</p>
                <p><strong>Tailwind:</strong> {version.buildInfo.tailwind}</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Carregando build info...</p>
            )}
          </div>

          {/* Status do Cache */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              🗄️ Status do Cache
            </h2>
            <div className="space-y-2">
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>Timestamp:</strong> {Date.now()}</p>
              <button 
                onClick={() => window.location.reload(true)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                🔄 Force Reload
              </button>
            </div>
          </div>

          {/* Teste de Favoritos */}
          <TesteFavoritos />
        </div>
      </div>
    </div>
  );
}