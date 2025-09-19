/**
 * 🧪 Componente de Teste para Cache
 * Use este componente para testar se as mudanças aparecem automaticamente
 */

import React, { useState, useEffect } from 'react';

const CacheTestComponent = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log('🧪 CacheTestComponent montado em:', new Date().toLocaleTimeString());
    
    // Atualizar timestamp a cada segundo para demonstrar que não há cache
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        🧪 Cache Test
      </div>
      <div>
        Timestamp: {new Date(timestamp).toLocaleTimeString()}
      </div>
      <div>
        Counter: {counter}
      </div>
      <button 
        onClick={() => setCounter(c => c + 1)}
        style={{
          background: '#f97316',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '5px',
          fontSize: '11px'
        }}
      >
        +1 Counter
      </button>
      <div style={{ marginTop: '5px', fontSize: '10px', opacity: 0.8 }}>
        ✅ No Cache - Updates Live
      </div>
    </div>
  );
};

export default CacheTestComponent;