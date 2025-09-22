# 🔍 Como Acessar a Página de Debug

## 📍 **Localização**

A página de debug está em: **`/debug`**

### **URLs Completas:**
- **Desenvolvimento:** `http://localhost:5173/debug`
- **Produção:** `https://catbutler-frontend.vercel.app/debug`
- **Seu domínio:** `https://seudominio.com/debug`

## 🚀 **Como Acessar**

### **Método 1: URL Direta**
1. Abra o navegador
2. Digite a URL completa: `https://catbutler-frontend.vercel.app/debug`
3. Pressione Enter

### **Método 2: Navegação Manual**
1. Acesse o site principal
2. Na URL, adicione `/debug` no final
3. Exemplo: `https://seusite.com` → `https://seusite.com/debug`

### **Método 3: Menu (se existir)**
- Procure por "Debug", "Desenvolvimento" ou "Configurações" no menu
- Pode estar oculto ou apenas em modo desenvolvimento

## 🧪 **O Que Você Vai Encontrar**

Na página `/debug` você verá:

1. **📦 Versão Atual** - Informações do sistema
2. **⚡ Funcionalidades Implementadas** - Lista de features
3. **🧪 Teste de Favoritos - Debug** - Seção para testar favoritos

## ❓ **Se Não Conseguir Acessar**

### **Erro 404 - Página não encontrada:**
```bash
# Execute no terminal do projeto frontend:
cd catbutler-frontend
npm run dev
# Depois acesse: http://localhost:5173/debug
```

### **Página existe mas não tem o teste de favoritos:**
- Faça o deploy do frontend mais recente
- Ou rode localmente com as últimas alterações

## 🔧 **Soluções Rápidas**

### **1. Executar Localmente:**
```bash
cd catbutler-frontend
npm install
npm run dev
# Acesse: http://localhost:5173/debug
```

### **2. Verificar se a rota existe:**
Verifique se o arquivo existe em: `catbutler-frontend/src/pages/Debug.jsx`

### **3. Deploy mais recente:**
Se estiver usando Vercel, faça um novo deploy do frontend

## 📱 **Teste Direto (Alternativa)**

Se não conseguir acessar `/debug`, você pode testar diretamente:

### **1. Console do Navegador (F12):**
```javascript
// Testar endpoint de favoritos
fetch('https://catbutler-backend.vercel.app/api/kitchen/test-favorites')
  .then(r => r.json())
  .then(console.log);
```

### **2. Postman/Insomnia:**
```
GET https://catbutler-backend.vercel.app/api/kitchen/test-favorites
```

---

**Se ainda não conseguir, me avise e eu criarei uma alternativa!** 🐱
