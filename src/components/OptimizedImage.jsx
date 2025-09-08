import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  priority = false,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (priority || isInView) return;

    // Intersection Observer otimizado
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Placeholder otimizado
  const defaultPlaceholder = (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
      style={{ 
        minHeight: '120px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%)',
        backgroundSize: '400% 100%',
        animation: 'skeleton 1.5s ease-in-out infinite'
      }}
    >
      <i className="fa-solid fa-image text-gray-400 text-xl"></i>
    </div>
  );

  // Error fallback
  const errorFallback = (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center ${className}`}
      style={{ minHeight: '120px' }}
    >
      <div className="text-center text-gray-500 dark:text-gray-400">
        <i className="fa-solid fa-exclamation-triangle text-lg mb-2"></i>
        <p className="text-xs">Erro ao carregar</p>
      </div>
    </div>
  );

  if (hasError) {
    return errorFallback;
  }

  return (
    <div ref={imgRef} className="relative">
      {/* Skeleton loader */}
      {!isLoaded && (placeholder || defaultPlaceholder)}
      
      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={isLoaded ? {} : { position: 'absolute', top: 0, left: 0 }}
          {...props}
        />
      )}
      
      {/* CSS for skeleton animation */}
      <style jsx>{`
        @keyframes skeleton {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
      `}</style>
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.node,
  priority: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default OptimizedImage;
