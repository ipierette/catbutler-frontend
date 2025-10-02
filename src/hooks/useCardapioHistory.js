import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export const useCardapioHistory = () => {
  const { isAuthenticated, user } = useAuth();
  const [historico, setHistorico] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar histórico de cardápios
  const loadHistory = useCallback(async (limit = 10) => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cardapio_historico')
        .select('*')
        .eq('user_id', user.id)
        .order('data_geracao', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setHistorico(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Carregar estatísticas do usuário
  const loadStats = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error } = await supabase
        .from('cardapio_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignora erro de "não encontrado"
        throw error;
      }

      setEstatisticas(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, [isAuthenticated, user]);

  // Salvar novo cardápio no histórico
  const saveCardapio = useCallback(async (cardapioData) => {
    if (!isAuthenticated || !user) return;

    try {
      const { data, error } = await supabase
        .from('cardapio_historico')
        .insert([{
          user_id: user.id,
          cardapio_completo: cardapioData.cardapio,
          pratos_principais: cardapioData.pratos || [],
          ingredientes_excluidos: cardapioData.ingredientesExcluidos || [],
          seed_variedade: cardapioData.seedVariedade || '',
          estatisticas: cardapioData.estatisticas || {},
          culinarias_brasileiras: cardapioData.estatisticas?.detalhes?.culinariasBrasileiras || [],
          culinarias_internacionais: cardapioData.estatisticas?.detalhes?.culinariasInternacionais || [],
          tecnicas_culinarias: cardapioData.estatisticas?.detalhes?.tecnicas || []
        }])
        .select()
        .single();

      if (error) throw error;

      // Atualizar histórico local
      setHistorico(prev => [data, ...prev.slice(0, 9)]); // Mantém 10 no máximo
      
      // Recarregar estatísticas
      await loadStats();

      return { success: true, data };
    } catch (err) {
      console.error('Erro ao salvar cardápio:', err);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated, user, loadStats]);

  // Deletar cardápio do histórico
  const deleteCardapio = useCallback(async (cardapioId) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('cardapio_historico')
        .delete()
        .eq('id', cardapioId)
        .eq('user_id', user.id); // Segurança extra

      if (error) throw error;

      // Remover do histórico local
      setHistorico(prev => prev.filter(c => c.id !== cardapioId));
      
      // Recarregar estatísticas
      await loadStats();

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar cardápio:', err);
      return { success: false, error: err.message };
    }
  }, [isAuthenticated, user, loadStats]);

  // Buscar pratos recentes para evitar repetições
  const getPratosRecentes = useCallback(async (limite = 10) => {
    if (!isAuthenticated || !user) return [];

    try {
      const { data, error } = await supabase
        .rpc('buscar_pratos_recentes', {
          p_user_id: user.id,
          p_limite: limite
        });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Erro ao buscar pratos recentes:', err);
      return [];
    }
  }, [isAuthenticated, user]);

  // Analytics de preferências
  const getPreferenciasAnalytics = useCallback(() => {
    if (!historico.length) return null;

    // Análise de culinárias mais usadas
    const culinariasBr = {};
    const culinariasInt = {};
    const tecnicasUsadas = {};
    const ingredientesExcluidos = {};

    historico.forEach(cardapio => {
      // Contar culinárias brasileiras
      (cardapio.culinarias_brasileiras || []).forEach(culinaria => {
        culinariasBr[culinaria] = (culinariasBr[culinaria] || 0) + 1;
      });

      // Contar culinárias internacionais
      (cardapio.culinarias_internacionais || []).forEach(culinaria => {
        culinariasInt[culinaria] = (culinariasInt[culinaria] || 0) + 1;
      });

      // Contar técnicas
      (cardapio.tecnicas_culinarias || []).forEach(tecnica => {
        tecnicasUsadas[tecnica] = (tecnicasUsadas[tecnica] || 0) + 1;
      });

      // Contar ingredientes excluídos
      (cardapio.ingredientes_excluidos || []).forEach(ingrediente => {
        ingredientesExcluidos[ingrediente] = (ingredientesExcluidos[ingrediente] || 0) + 1;
      });
    });

    // Ordenar por frequência
    const sortByFrequency = (obj) => 
      Object.entries(obj)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Top 5

    return {
      culinariasBrasileirasFavoritas: sortByFrequency(culinariasBr),
      culinariasInternacionaisFavoritas: sortByFrequency(culinariasInt),
      tecnicasFavoritas: sortByFrequency(tecnicasUsadas),
      ingredientesMaisExcluidos: sortByFrequency(ingredientesExcluidos),
      totalCardapios: historico.length,
      ultimoCardapio: historico[0]?.data_geracao,
      primeiroCardapio: historico[historico.length - 1]?.data_geracao
    };
  }, [historico]);

  // Carregar dados iniciais
  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
      loadStats();
    } else {
      setHistorico([]);
      setEstatisticas(null);
      setError(null);
    }
  }, [isAuthenticated, loadHistory, loadStats]);

  return {
    // Estado
    historico,
    estatisticas,
    loading,
    error,
    
    // Ações
    loadHistory,
    loadStats,
    saveCardapio,
    deleteCardapio,
    getPratosRecentes,
    
    // Analytics
    preferenciasAnalytics: getPreferenciasAnalytics(),
    
    // Computed
    temHistorico: historico.length > 0,
    cardapioMaisRecente: historico[0] || null
  };
};

export default useCardapioHistory;
