import React from "react";

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🐱 CatButler - Teste Simples
      </h1>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>✅ Frontend Funcionando!</h2>
        <p>Se você está vendo esta página, o frontend está funcionando corretamente.</p>
        
        <h3>🔧 Próximos Passos:</h3>
        <ul>
          <li>✅ React funcionando</li>
          <li>✅ Vite funcionando</li>
          <li>✅ Servidor local funcionando</li>
          <li>🔄 Agora vamos carregar os componentes completos</li>
        </ul>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e8f5e8',
          borderRadius: '5px',
          border: '1px solid #4caf50'
        }}>
          <strong>Status:</strong> Frontend básico funcionando! 🎉
        </div>
      </div>
    </div>
  );
}

export default App;
