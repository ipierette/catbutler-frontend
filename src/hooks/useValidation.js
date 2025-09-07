import { useState, useCallback, useEffect } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateNumber,
  processTextInput 
} from '../utils/security';

// Hook para validação em tempo real
export const useValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Validação individual de campo
  const validateField = useCallback(async (fieldName, value, rules) => {
    if (!rules) return { isValid: true, errors: [] };

    const fieldRules = rules[fieldName];
    if (!fieldRules) return { isValid: true, errors: [] };

    const errors = [];

    // Validação de campo obrigatório
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors.push(fieldRules.requiredMessage || `${fieldName} é obrigatório`);
      return { isValid: false, errors };
    }

    // Se o campo não é obrigatório e está vazio, não valida
    if (!fieldRules.required && (!value || value.trim() === '')) {
      return { isValid: true, errors: [] };
    }

    // Validação de email
    if (fieldRules.type === 'email') {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        errors.push(...emailValidation.errors);
      }
    }

    // Validação de senha
    if (fieldRules.type === 'password') {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }

    // Validação de nome
    if (fieldRules.type === 'name') {
      const nameValidation = validateName(value);
      if (!nameValidation.isValid) {
        errors.push(...nameValidation.errors);
      }
    }

    // Validação de número
    if (fieldRules.type === 'number') {
      const numberValidation = validateNumber(value, fieldRules.numberOptions || {});
      if (!numberValidation.isValid) {
        errors.push(...numberValidation.errors);
      }
    }

    // Validação de texto genérico
    if (fieldRules.type === 'text') {
      const textValidation = processTextInput(value, {
        maxLength: fieldRules.maxLength || 1000,
        allowHtml: fieldRules.allowHtml || false,
        required: fieldRules.required || false,
      });
      if (!textValidation.isValid) {
        errors.push(...textValidation.errors);
      }
    }

    // Validação de comprimento mínimo
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors.push(`${fieldName} deve ter pelo menos ${fieldRules.minLength} caracteres`);
    }

    // Validação de comprimento máximo
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors.push(`${fieldName} deve ter no máximo ${fieldRules.maxLength} caracteres`);
    }

    // Validação customizada
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customValidation = fieldRules.custom(value, values);
      if (customValidation && !customValidation.isValid) {
        errors.push(...customValidation.errors);
      }
    }

    return { isValid: errors.length === 0, errors };
  }, [values]);

  // Validação de todos os campos
  const validateAll = useCallback(async () => {
    setIsValidating(true);
    const newErrors = {};

    for (const fieldName in validationRules) {
      const fieldRules = validationRules[fieldName];
      const value = values[fieldName] || '';
      const validation = await validateField(fieldName, value, validationRules);
      
      if (!validation.isValid) {
        newErrors[fieldName] = validation.errors;
      }
    }

    setErrors(newErrors);
    setIsValidating(false);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules, validateField]);

  // Validação de campo específico
  const validateSingleField = useCallback(async (fieldName) => {
    const fieldRules = validationRules[fieldName];
    if (!fieldRules) return;

    const value = values[fieldName] || '';
    const validation = await validateField(fieldName, value, validationRules);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? [] : validation.errors
    }));
  }, [values, validationRules, validateField]);

  // Handler para mudança de valor
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validação em tempo real se o campo foi tocado
    if (touched[fieldName]) {
      validateSingleField(fieldName);
    }
  }, [touched, validateSingleField]);

  // Handler para blur (quando o usuário sai do campo)
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    validateSingleField(fieldName);
  }, [validateSingleField]);

  // Handler para focus (quando o usuário entra no campo)
  const handleFocus = useCallback((fieldName) => {
    // Marca como tocado quando o usuário foca no campo
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // Validação em tempo real com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Valida apenas campos que foram tocados
      Object.keys(touched).forEach(fieldName => {
        if (touched[fieldName]) {
          validateSingleField(fieldName);
        }
      });
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [values, touched, validateSingleField]);

  // Verificar se o formulário é válido
  const isFormValid = Object.keys(errors).every(fieldName => 
    !errors[fieldName] || errors[fieldName].length === 0
  );

  // Reset do formulário
  const reset = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  // Reset de campo específico
  const resetField = useCallback((fieldName) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: initialValues[fieldName] || ''
    }));
    setErrors(prev => ({
      ...prev,
      [fieldName]: []
    }));
    setTouched(prev => ({
      ...prev,
      [fieldName]: false
    }));
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValidating,
    isFormValid,
    handleChange,
    handleBlur,
    handleFocus,
    validateAll,
    validateSingleField,
    reset,
    resetField,
    setValues,
    setErrors,
    setTouched,
  };
};

// Hook para validação de campo único
export const useFieldValidation = (fieldName, initialValue = '', rules = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async () => {
    if (!touched) return;

    setIsValidating(true);
    const validation = await validateField(fieldName, value, { [fieldName]: rules });
    setError(validation.isValid ? '' : validation.errors[0] || '');
    setIsValidating(false);
  }, [fieldName, value, rules, touched]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const handleFocus = useCallback(() => {
    setTouched(true);
  }, []);

  // Validação com debounce
  useEffect(() => {
    if (!touched) return;

    const timeoutId = setTimeout(() => {
      validate();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, touched, validate]);

  return {
    value,
    error,
    touched,
    isValidating,
    isValid: !error && touched,
    handleChange,
    handleBlur,
    handleFocus,
    setValue,
    setError,
    setTouched,
  };
};
