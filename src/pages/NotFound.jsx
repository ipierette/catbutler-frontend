import React from "react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Página não encontrada.</p>
      <a href="/" className="px-6 py-3 rounded-lg bg-green-400 hover:bg-green-500 text-white font-semibold shadow transition text-lg">Voltar para Home</a>
    </main>
  );
}
