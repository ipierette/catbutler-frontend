# 🔧 Configuração Supabase - URLs de Redirect

## 🚨 Problema
O email de confirmação está redirecionando para URL inválida em vez de:
`https://catbutler-frontend.vercel.app/login`

## ✅ Solução - Configurar no Dashboard Supabase

### 1. Acesse o Dashboard Supabase
- Vá para: https://supabase.com/dashboard
- Acesse seu projeto: `htmcbeidfvjjmwsuahdq`

### 2. Configurar Authentication URLs

**Caminho:** Settings → Authentication → URL Configuration

#### 2.1 Site URL
```
https://catbutler-frontend.vercel.app
```

#### 2.2 Redirect URLs (adicione todas):
```
https://catbutler-frontend.vercel.app
https://catbutler-frontend.vercel.app/login
https://catbutler-frontend.vercel.app/auth/callback
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/auth/callback
```

### 3. Configurar Email Templates (Opcional)

**Caminho:** Authentication → Email Templates

#### Confirm Signup Template:
```html
<h2>Confirme sua conta CatButler</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar conta</a></p>
```

#### Reset Password Template:
```html
<h2>Redefinir senha - CatButler</h2>
<p>Clique no link abaixo para redefinir sua senha:</p>
<p><a href="{{ .ConfirmationURL }}">Redefinir senha</a></p>
```

## 📋 Passos Detalhados no Dashboard

### Passo 1: Navegação
1. Acesse https://supabase.com/dashboard
2. Clique no projeto `htmcbeidfvjjmwsuahdq`
3. Vá em **Settings** (ícone de engrenagem)
4. Clique em **Authentication**

### Passo 2: URL Configuration
1. Role até **URL Configuration**
2. Configure:
   - **Site URL**: `https://catbutler-frontend.vercel.app`
   - **Redirect URLs**: Cole todas as URLs listadas acima
3. Clique **Save**

### Passo 3: Validação
1. Tente criar uma nova conta
2. Verifique se o email de confirmação funciona
3. Confirme se redireciona corretamente

## 🔍 Como Verificar se Está Funcionando

### Console Logs Esperados:
```javascript
✅ Supabase configurado corretamente
🔐 Auth state changed: SIGNED_IN
✅ Perfil carregado: {display_name: "...", avatar_url: "..."}
```

### URLs que Devem Funcionar:
- ✅ Email de confirmação → https://catbutler-frontend.vercel.app/login
- ✅ Reset de senha → https://catbutler-frontend.vercel.app/login
- ✅ Login direto → https://catbutler-frontend.vercel.app

## ⚠️ Importante

Após alterar as configurações no Supabase:
1. **Aguarde 1-2 minutos** para propagação
2. **Teste com novo email** (não reuse emails antigos)
3. **Verifique spam/lixo eletrônico** se não receber email

## 🛠️ Configuração Alternativa (Código)

Se ainda não funcionar, podemos configurar redirect personalizado no código:

```javascript
// Em signUp function
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: 'https://catbutler-frontend.vercel.app/login'
  }
});
```

---

**Próximo Passo**: Configure no dashboard do Supabase e teste!