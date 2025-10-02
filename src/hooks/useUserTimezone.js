import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export const useUserTimezone = () => {
  const { isAuthenticated, user } = useAuth();
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [pais, setPais] = useState('BR');
  const [cidade, setCidade] = useState('');
  const [dataLocal, setDataLocal] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Detectar timezone do navegador
  const detectTimezone = useCallback(() => {
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detectedLocale = navigator.language || 'pt-BR';
      
      // Mapear alguns timezones comuns para países
      const timezoneToCountry = {
        'America/Sao_Paulo': 'BR',
        'America/New_York': 'US',
        'Europe/London': 'GB',
        'Europe/Paris': 'FR',
        'Asia/Tokyo': 'JP',
        'Australia/Sydney': 'AU'
      };
      
      const detectedCountry = timezoneToCountry[detectedTimezone] || 'BR';
      
      return {
        timezone: detectedTimezone,
        pais: detectedCountry,
        locale: detectedLocale
      };
    } catch (error) {
      console.error('Erro ao detectar timezone:', error);
      return {
        timezone: 'America/Sao_Paulo',
        pais: 'BR',
        locale: 'pt-BR'
      };
    }
  }, []);

  // Carregar timezone do usuário do banco
  const loadUserTimezone = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('timezone, pais, cidade')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setTimezone(data.timezone || 'America/Sao_Paulo');
        setPais(data.pais || 'BR');
        setCidade(data.cidade || '');
      }
    } catch (err) {
      console.error('Erro ao carregar timezone:', err);
      // Se não conseguir carregar, detectar automaticamente
      const detected = detectTimezone();
      setTimezone(detected.timezone);
      setPais(detected.pais);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, detectTimezone]);

  // Salvar timezone do usuário
  const saveUserTimezone = useCallback(async (newTimezone, newPais, newCidade) => {
    if (!isAuthenticated || !user) return { success: false, error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .rpc('update_user_timezone', {
          p_user_id: user.id,
          p_timezone: newTimezone,
          p_pais: newPais,
          p_cidade: newCidade
        });

      if (error) throw error;

      setTimezone(newTimezone);
      setPais(newPais);
      setCidade(newCidade);

      return { success: true };
    } catch (err) {
      console.error('Erro ao salvar timezone:', err);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated, user]);

  // Auto-detectar e salvar timezone no primeiro login
  const autoDetectAndSave = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    const detected = detectTimezone();
    
    // Verificar se timezone atual é diferente do detectado
    if (detected.timezone !== timezone || detected.pais !== pais) {
      console.log('🌍 Auto-detectando timezone:', detected);
      await saveUserTimezone(detected.timezone, detected.pais, '');
    }
  }, [isAuthenticated, user, timezone, pais, detectTimezone, saveUserTimezone]);

  // Atualizar data local baseada no timezone
  useEffect(() => {
    const updateLocalDate = () => {
      try {
        const now = new Date();
        const localDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        setDataLocal(localDate);
      } catch (error) {
        console.error('Erro ao calcular data local:', error);
        setDataLocal(new Date());
      }
    };

    updateLocalDate();
    const interval = setInterval(updateLocalDate, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [timezone]);

  // Carregar timezone ao fazer login
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserTimezone();
    }
  }, [isAuthenticated, user, loadUserTimezone]);

  // Funções utilitárias
  const getLocalTime = useCallback(() => {
    return dataLocal.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone 
    });
  }, [dataLocal, timezone]);

  const getLocalDate = useCallback(() => {
    return dataLocal.toLocaleDateString('pt-BR', { 
      timeZone: timezone 
    });
  }, [dataLocal, timezone]);

  const getWeekInfo = useCallback(() => {
    const year = dataLocal.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((dataLocal - startOfYear) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    return { year, week, date: dataLocal };
  }, [dataLocal]);

  // Verificar se é uma nova semana (para resetar cardápio)
  const isNewWeek = useCallback((lastGenerationDate) => {
    if (!lastGenerationDate) return true;
    
    const lastDate = new Date(lastGenerationDate);
    const currentWeek = getWeekInfo();
    const lastWeek = {
      year: lastDate.getFullYear(),
      week: Math.ceil(((lastDate - new Date(lastDate.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000) + new Date(lastDate.getFullYear(), 0, 1).getDay() + 1) / 7)
    };
    
    return currentWeek.year !== lastWeek.year || currentWeek.week !== lastWeek.week;
  }, [getWeekInfo]);

  return {
    // Estado
    timezone,
    pais,
    cidade,
    dataLocal,
    loading,
    
    // Ações
    loadUserTimezone,
    saveUserTimezone,
    autoDetectAndSave,
    detectTimezone,
    
    // Utilitários
    getLocalTime,
    getLocalDate,
    getWeekInfo,
    isNewWeek,
    
    // Computed
    isConfigured: !!timezone && timezone !== 'America/Sao_Paulo',
    needsConfiguration: !timezone || timezone === 'America/Sao_Paulo'
  };
};

export default useUserTimezone;
