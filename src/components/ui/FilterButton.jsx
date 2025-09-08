import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function FilterButton({ 
  label, 
  options = [], 
  value = null, 
  onChange = () => {}, 
  icon = 'fa-solid fa-filter',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasSelection = value !== null && value !== undefined && value !== '';
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`filter-btn ${hasSelection ? 'filter-btn-active' : ''}`}
      >
        <i className={icon}></i>
        <span>
          {selectedOption ? selectedOption.label : label}
        </span>
        {hasSelection && (
          <span className="ml-1 px-1 bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded text-xs">
            1
          </span>
        )}
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="filter-dropdown">
          <div className="space-y-1">
            {/* Opção "Todos" */}
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                !hasSelection ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Todos
            </button>
            
            {/* Divider */}
            {options.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            )}
            
            {/* Opções */}
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                  value === option.value 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.icon && <i className={`${option.icon} text-xs`}></i>}
                <span>{option.label}</span>
                {option.count && (
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

FilterButton.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    count: PropTypes.number
  })),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string
};
