# 🔐 Configuração OAuth - CatButler

Este guia explica como configurar autenticação social (Google e Facebook) no Supabase para o CatButler.

## 📋 Pré-requisitos

- Acesso ao painel do Supabase
- Conta Google Developers Console
- Conta Facebook Developers

## 🔧 Configuração no Supabase

### 1. Acessar Configurações OAuth

1. Entre no [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto CatButler
3. Vá em **Authentication** > **Settings** > **Auth**
4. Role para baixo até **External OAuth providers**

### 2. Configurar Google OAuth

#### No Google Developers Console:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure:
   - Application type: **Web application**
   - Name: **CatButler**
   - Authorized JavaScript origins:
     - `http://localhost:5173` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - Authorized redirect URIs:
     - `https://htmcbeidfvjjmwsuahdq.supabase.co/auth/v1/callback`

6. Copie **Client ID** e **Client Secret**

#### No Supabase:

1. Em **External OAuth providers**, encontre **Google**
2. Ative o toggle **Enable sign in with Google**
3. Cole o **Client ID** e **Client Secret**
4. Configure:
   - Skip nonce check: ✅ (recomendado)
   - Redirect URL: (já preenchido automaticamente)

### 3. Configurar Facebook OAuth

#### No Facebook Developers:

1. Acesse [Facebook Developers](https://developers.facebook.com)
2. Crie um novo app ou selecione existente
3. Vá para **Settings** > **Basic**
4. Adicione a plataforma **Website**
5. Configure:
   - Site URL: `https://seu-dominio.com`
   - App Domains: `seu-dominio.com`

6. Vá para **Products** > **Facebook Login** > **Settings**
7. Configure Valid OAuth Redirect URIs:
   - `https://htmcbeidfvjjmwsuahdq.supabase.co/auth/v1/callback`

8. Copie **App ID** e **App Secret**

#### No Supabase:

1. Em **External OAuth providers**, encontre **Facebook**
2. Ative o toggle **Enable sign in with Facebook**
3. Cole o **App ID** como Client ID
4. Cole o **App Secret** como Client Secret
5. Configure:
   - Skip nonce check: ✅ (recomendado)
   - Redirect URL: (já preenchido automaticamente)

## 🔄 URLs de Redirecionamento

### Desenvolvimento:
- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

### Produção:
- Site URL: `https://catbutler.vercel.app`
- Redirect URLs: `https://catbutler.vercel.app/**`

## 🛠️ Configuração no Frontend

O código já está implementado nos seguintes arquivos:

- ✅ `src/pages/Login.jsx` - Botões de login social
- ✅ `src/contexts/AuthContext.jsx` - Handler para callbacks OAuth
- ✅ `src/utils/supabase.js` - Cliente configurado

## 🧪 Testando OAuth

### Para testar Google:
1. Clique no botão "Google" na página de login
2. Será redirecionado para o Google
3. Após autorização, retorna para o CatButler logado

### Para testar Facebook:
1. Clique no botão "Facebook" na página de login
2. Será redirecionado para o Facebook
3. Após autorização, retorna para o CatButler logado

## 🚨 Troubleshooting

### Erro: "Invalid redirect_uri"
- Verifique se as URLs estão corretas no Google/Facebook
- Certifique-se de incluir o protocolo (http/https)

### Erro: "App not configured"
- Verifique se o OAuth está habilitado no Supabase
- Confirme se Client ID/Secret estão corretos

### Erro: "Invalid client_id"
- Verifique as credenciais no Supabase
- Teste com as credenciais originais do Google/Facebook

## 📝 Próximos Passos

Após configurar:

1. ✅ Teste login social em desenvolvimento
2. ✅ Configure URLs de produção
3. ✅ Publique e teste em produção
4. ✅ Configure políticas de privacidade se necessário

## 🔐 Segurança

- Nunca commite Client Secrets no código
- Use variáveis de ambiente para configurações sensíveis
- Mantenha URLs de redirect restritas
- Configure políticas de RLS no Supabase

---

**Dúvidas?** Consulte a [documentação oficial do Supabase](https://supabase.com/docs/guides/auth/social-login) para OAuth.