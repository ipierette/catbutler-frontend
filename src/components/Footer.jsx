import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
      <footer className="spa-footer w-full footer-glass px-responsive flex items-center justify-between z-header">
        {/* Logo e versão à esquerda */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-gray-900 dark:text-gray-100">CatButler</span>
          <span className="text-xs bg-primary-900 text-white px-2 py-1 rounded-full animate-pulse">v3.5.0</span>
        </div>

        {/* Frase centralizada com ícones */}
        <div className="flex-1 flex justify-center">
          <div className="text-xs text-gray-800 dark:text-gray-300 text-center flex items-center gap-2">
            © {new Date().getFullYear()} Izadora Pierette — 
            <a className="link text-primary-600 hover:underline font-medium" href="https://catbytes.netlify.app" target="_blank" rel="noopener noreferrer">Portfolio</a>
            <a className="icon-link" href="https://github.com/ipierette" target="_blank" title="GitHub" rel="noopener noreferrer">
              <FaGithub className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
            </a>
            <a className="icon-link" href="https://www.linkedin.com" target="_blank" title="LinkedIn" rel="noopener noreferrer">
              <FaLinkedin className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
            </a>
          </div>
        </div>
    </footer>
  );
}
