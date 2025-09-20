import React, { memo, useMemo } from 'react';

/**
 * HOC para memorizar componentes React e evitar re-renderizações desnecessárias
 * 
 * @param {React.ComponentType} Component - O componente a ser memorizado
 * @param {Function} propsAreEqual - Função opcional para comparação personalizada de props
 * @returns {React.NamedExoticComponent} - Componente memorizado
 */
export function withMemo(Component, propsAreEqual = null) {
  const displayName = Component.displayName || Component.name || 'Component';
  const MemorizedComponent = memo(Component, propsAreEqual);
  MemorizedComponent.displayName = `Memo(${displayName})`;
  
  return MemorizedComponent;
}

/**
 * Hook para calcular e memorizar valores derivados
 * Similar ao useMemo do React, mas com mensagens de debug opcionais
 * 
 * @param {Function} calculator - Função que calcula o valor
 * @param {Array} dependencies - Array de dependências (similar ao useMemo)
 * @param {Object} options - Opções adicionais
 * @returns {any} - Valor memorizado
 */
export function useOptimizedMemo(calculator, dependencies, options = {}) {
  const { debug = false, debugName = 'unnamed' } = options;
  
  const value = useMemo(() => {
    if (debug) {
      console.time(`[useOptimizedMemo] ${debugName} calculation`);
      const result = calculator();
      console.timeEnd(`[useOptimizedMemo] ${debugName} calculation`);
      return result;
    }
    return calculator();
  }, dependencies);
  
  return value;
}

/**
 * Componente lista otimizada que só renderiza itens visíveis
 * Usa virtualização para melhorar performance com grandes listas
 * 
 * @param {Object} props - Props do componente
 * @param {Array} props.items - Array de itens para renderizar
 * @param {Function} props.renderItem - Função de renderização para cada item
 * @param {number} props.itemHeight - Altura de cada item (em pixels)
 * @param {number} props.windowHeight - Altura da janela visível (em pixels)
 * @param {number} props.overscan - Número de itens extras a renderizar acima/abaixo (opcional)
 * @returns {React.ReactElement} - Componente de lista virtualizada
 */
export const VirtualizedList = memo(function VirtualizedList({
  items,
  renderItem,
  itemHeight,
  windowHeight,
  overscan = 3
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const totalHeight = items.length * itemHeight;
  const visibleItemsCount = Math.ceil(windowHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleItemsCount + overscan * 2);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => {
      const actualIndex = startIndex + index;
      return {
        ...item,
        style: {
          position: 'absolute',
          top: actualIndex * itemHeight,
          height: itemHeight
        }
      };
    });
  }, [items, startIndex, endIndex, itemHeight]);
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  return (
    <div 
      style={{ height: windowHeight, overflow: 'auto', position: 'relative' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((itemWithStyle, index) => {
          const actualIndex = startIndex + index;
          return (
            <div key={actualIndex} style={itemWithStyle.style}>
              {renderItem(itemWithStyle, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
});

/**
 * Componente de imagem com carregamento lazy para melhorar performance
 * 
 * @param {Object} props - Props do componente
 * @param {string} props.src - URL da imagem
 * @param {string} props.alt - Texto alternativo para acessibilidade
 * @param {Object} props.style - Estilos adicionais (opcional)
 * @param {string} props.className - Classes CSS (opcional)
 * @returns {React.ReactElement} - Componente de imagem lazy
 */
export const LazyImage = memo(function LazyImage({
  src,
  alt,
  style,
  className,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => setLoaded(true);
          observer.unobserve(img);
        }
      });
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);
  
  const combinedClassName = `lazy-image ${loaded ? 'loaded' : ''} ${className || ''}`;
  
  return (
    <img
      ref={imgRef}
      data-src={src}
      alt={alt}
      className={combinedClassName}
      style={{ ...style, opacity: loaded ? 1 : 0 }}
      {...rest}
    />
  );
});

export default {
  withMemo,
  useOptimizedMemo,
  VirtualizedList,
  LazyImage
};
