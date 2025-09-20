import React from 'react';
import DocumentationSection from '../components/DocumentationSection';

export default function Docs() {
  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <i className="fa-solid fa-book text-xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Documentação do CatButler
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Guias completos e tutoriais para usar todas as funcionalidades
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <DocumentationSection />
      </div>

      {/* Espaço adicional no final */}
      <div className="h-20"></div>
    </div>
  );
}