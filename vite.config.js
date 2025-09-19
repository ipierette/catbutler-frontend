import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url'

/// <reference types="vitest" />
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      react({
        // Melhorar Fast Refresh
        fastRefresh: !isProduction,
        // Corrigir problemas de HMR
        include: "**/*.{jsx,tsx}",
      }),
      // Só aplicar PWA em produção para evitar cache em desenvolvimento
      ...(isProduction ? [
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            runtimeCaching: [
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|webp|woff2|woff|ttf)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'assets-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                  },
                },
              },
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com/,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'google-fonts-stylesheets',
                },
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-webfonts',
                  expiration: {
                    maxEntries: 30,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                  },
                },
              },
            ],
          },
        })
      ] : []),
    ],
    // Otimização de dependências para desenvolvimento
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      // Forçar re-otimização de dependências quando necessário
      force: !isProduction,
    },
    // Configurações específicas para desenvolvimento
    ...(isProduction ? {} : {
      // Em desenvolvimento, desabilita cache agressivo
      define: {
        __DEV__: true,
        __TIMESTAMP__: JSON.stringify(Date.now()), // Cache busting
      },
      // Configurações de watch mais agressivas
      watch: {
        usePolling: true,
        interval: 100,
      },
      // Força cache busting em TODOS os recursos
      css: {
        devSourcemap: true,
      },
    }),
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: process.env.NODE_ENV === 'development',
      minify: false, // Desabilita minificação temporariamente para debug
      // Cache busting em desenvolvimento
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const packagesToSplit = ['react', 'react-dom', 'react-router-dom'];
              const packageName = id.toString().split('node_modules/')[1].split('/')[0].toString();
              if (packagesToSplit.includes(packageName)) {
                return packageName;
              }
              return 'vendor';
            }
          },
          chunkFileNames: isProduction ? 'assets/js/[name]-[hash].js' : `assets/js/[name]-${Date.now()}.js`,
          entryFileNames: isProduction ? 'assets/js/[name]-[hash].js' : `assets/js/[name]-${Date.now()}.js`,
          assetFileNames: isProduction ? 'assets/[ext]/[name]-[hash].[ext]' : `assets/[ext]/[name]-${Date.now()}.[ext]`,
        },
      },
      treeshake: true,
    },
    server: {
      port: 5173,
      open: true,
      host: true,
      hmr: {
        overlay: true,
        port: 24678, // Porta específica para HMR
      },
      historyApiFallback: true,
      cors: true,
      // Headers mais agressivos para desenvolvimento
      middlewareMode: false,
      fs: {
        strict: false,
      },
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      // Excluir arquivos de teste do Playwright
      exclude: [
        'node_modules/**',
        'dist/**',
        'tests/**/*.spec.js', // Excluir testes E2E do Playwright
        'playwright-report/**',
        '**/*.{test,spec}.e2e.{js,ts}',
      ],
      // Incluir apenas testes unitários
      include: [
        'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      ],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/setup.js',
          'tests/', // Excluir pasta de testes E2E da cobertura
        ],
      },
      deps: {
        optimizer: {
          web: {
            include: ['@testing-library/jest-dom'],
          },
        },
      },
    },
  };
});
