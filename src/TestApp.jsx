import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      color: '#333',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🐱 CatButler Teste</h1>
        <p>Se você está vendo isso, o React está funcionando!</p>
      </div>
    </div>
  );
}

export default TestApp;