import React, { Suspense, lazy, Component } from 'react';
import { LoadingCard } from './Loading';

// Componente de fallback para lazy loading
const LazyFallback = ({ title = 'Carregando...', description = 'Aguarde um momento' }) => (
  <LoadingCard title={title} description={description} />
);

LazyFallback.propTypes = {
};

// HOC para lazy loading com fallback customizado
export const withLazyLoading = (importFunction, fallbackProps = {}) => {
  const LazyComponent = lazy(importFunction);
  
  return (props) => (
    <Suspense fallback={<LazyFallback {...fallbackProps} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Componente wrapper para lazy loading com intersection observer
export class LazyWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      hasLoaded: false,
    };
    this.elementRef = React.createRef();
  }

  componentDidMount() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.state.hasLoaded) {
          this.setState({ isVisible: true, hasLoaded: true });
        }
      },
      {
        threshold: 0.1,
        rootMargin: '3.125rem',
      }
    );

    if (this.elementRef.current) {
      observer.observe(this.elementRef.current);
    }

    this.observer = observer;
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  render() {
    const { children, fallback, height = '12.5rem' } = this.props;
    const { isVisible } = this.state;

    return (
      <div ref={this.elementRef} style={{ minHeight: height }}>
        {isVisible ? children : (fallback || <LazyFallback />)}
      </div>
    );
  }
}

LazyWrapper.propTypes = {
};

// Hook para lazy loading com intersection observer
export const useLazyLoading = (options = {}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const elementRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '3.125rem',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, options.threshold, options.rootMargin]);

  return { elementRef, isVisible, hasLoaded };
};

// Componente para lazy loading de imagens
export const LazyImage = ({ src, alt, placeholder, className = '', ...props }) => {
  const { elementRef, isVisible } = useLazyLoading();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div ref={elementRef} className={`relative ${className}`} {...props}>
      {!isVisible && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
          {placeholder}
        </div>
      )}
      
      {isVisible && (
        <>
          {!imageLoaded && !imageError && placeholder && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
              {placeholder}
            </div>
          )}
          
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ display: imageError ? 'none' : 'block' }}
          />
          
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
              <span>Erro ao carregar imagem</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

LazyImage.propTypes = {
};

// Hook para memoização de componentes
export const useMemoizedComponent = (Component, deps = []) => {
  return React.useMemo(() => Component, deps);
};

// Hook para debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle
export const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastExecuted = React.useRef(Date.now());

  React.useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay - (Date.now() - lastExecuted.current));

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};
