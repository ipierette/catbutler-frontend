# 🗄️ Configuração do Supabase

Guia passo a passo para configurar o Supabase para o CatButler Backend.

## 📋 Pré-requisitos

- Conta no Supabase (gratuita)
- Acesso ao terminal
- Editor de código

## 🚀 Passo 1: Criar Projeto no Supabase

### 1.1 Acesse o Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email

### 1.2 Criar Novo Projeto
1. Clique em "New Project"
2. Escolha sua organização
3. Preencha os dados:
   - **Name**: `catbutler-backend`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project"

### 1.3 Aguardar Configuração
- O projeto levará alguns minutos para ser criado
- Aguarde até aparecer "Project is ready"

## 🗃️ Passo 2: Configurar Banco de Dados

### 2.1 Acessar SQL Editor
1. No painel do projeto, clique em "SQL Editor" no menu lateral
2. Clique em "New query"

### 2.2 Executar Schema
1. Copie todo o conteúdo do arquivo `database/schema.sql`
2. Cole no editor SQL
3. Clique em "Run" para executar

### 2.3 Verificar Tabelas
1. Vá para "Table Editor" no menu lateral
2. Verifique se todas as tabelas foram criadas:
   - `users`
   - `user_achievements`
   - `user_settings`
   - `tasks`
   - `favorite_recipes`
   - `shopping_lists`
   - `cleaning_routines`
   - E as tabelas de analytics

## 🔐 Passo 3: Configurar Autenticação

### 3.1 Configurar URLs Permitidas
1. Vá para "Authentication" > "Settings"
2. Em "Site URL", adicione:
   - `http://localhost:3001` (desenvolvimento)
   - `https://seu-dominio.vercel.app` (produção)
3. Em "Redirect URLs", adicione:
   - `http://localhost:3001/api/auth/callback`
   - `https://seu-dominio.vercel.app/api/auth/callback`

### 3.2 Configurar Providers
1. Em "Auth Providers", mantenha "Email" habilitado
2. Desabilite outros providers se não precisar
3. Configure as opções de email conforme necessário

## 🔑 Passo 4: Obter Chaves de API

### 4.1 Acessar Configurações
1. Vá para "Settings" > "API"
2. Anote as seguintes informações:

### 4.2 Chaves Necessárias
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
```

⚠️ **IMPORTANTE**: Nunca compartilhe a `SERVICE_ROLE_KEY` publicamente!

## 🛡️ Passo 5: Configurar Row Level Security (RLS)

### 5.1 Verificar Políticas
As políticas RLS já foram criadas pelo schema SQL, mas você pode verificar:

1. Vá para "Authentication" > "Policies"
2. Verifique se as políticas estão ativas
3. Teste as políticas se necessário

### 5.2 Políticas Criadas
- Usuários só podem acessar seus próprios dados
- Políticas de SELECT, INSERT, UPDATE, DELETE
- Proteção contra acesso não autorizado

## 📊 Passo 6: Configurar Analytics (Opcional)

### 6.1 Habilitar Analytics
1. Vá para "Settings" > "General"
2. Habilite "Enable analytics" se quiser
3. Configure conforme necessário

### 6.2 Monitoramento
- Use o dashboard do Supabase para monitorar uso
- Configure alertas se necessário

## 🧪 Passo 7: Testar Conexão

### 7.1 Testar no Backend
1. Configure as variáveis de ambiente no `.env`
2. Execute o backend: `npm run dev`
3. Teste o endpoint de health: `GET /api/health`

### 7.2 Testar Autenticação
```bash
# Testar registro
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'
```

## 🚀 Passo 8: Deploy para Produção

### 8.1 Configurar Variáveis no Vercel
1. No painel do Vercel, vá para "Settings" > "Environment Variables"
2. Adicione todas as variáveis do `.env`
3. Certifique-se de que estão configuradas para "Production"

### 8.2 Atualizar URLs
1. No Supabase, atualize as URLs permitidas
2. Adicione a URL de produção do Vercel
3. Teste a conexão em produção

## 🔧 Troubleshooting

### Problema: Erro de conexão
**Solução**: Verifique se as URLs e chaves estão corretas

### Problema: RLS bloqueando acesso
**Solução**: Verifique se as políticas estão configuradas corretamente

### Problema: Tabelas não criadas
**Solução**: Execute o schema SQL novamente

### Problema: Autenticação falhando
**Solução**: Verifique as URLs permitidas no Supabase

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Consulte a documentação oficial
3. Abra uma issue no GitHub

---

**Configuração concluída! 🎉**
