import React from "react";

export default function Footer() {
  return (
      <footer className="spa-footer w-full footer-glass px-2 sm:px-4 py-2 flex items-center justify-start z-header">
        {/* Logo, versão e copyright - sempre à esquerda */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm text-gray-900 dark:text-gray-100">CatButler</span>
          <span className="text-xs bg-primary-900 text-white px-2 py-1 rounded-full">v3.5.0</span>
          <span className="text-xs text-gray-800 dark:text-gray-300">
            © {new Date().getFullYear()} Izadora Pierette
          </span>
        </div>
    </footer>
  );
}
