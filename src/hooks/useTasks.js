import { useState, useEffect, useCallback } from 'react';
import { createTask, getTasks, updateTask, deleteTask, getTasksStats } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar tarefas
  const loadTasks = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    // Limpar tarefas antigas imediatamente para evitar mostrar dados antigos
    setTasks([]);
    
    try {
      const result = await getTasks(filters);
      
      if (result.success) {
        setTasks(result.tasks);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const result = await getTasksStats();
      
      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, [isAuthenticated]);

  // Criar nova tarefa
  const addTask = async (taskData) => {
    if (!isAuthenticated) return { success: false, error: 'Usuário não autenticado' };

    setLoading(true);
    
    try {
      const result = await createTask(taskData);
      
      if (result.success) {
        // Adicionar a nova tarefa ao estado local
        setTasks(prev => [result.task, ...prev]);
        // Recarregar estatísticas
        await loadStats();
      }
      
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar tarefa existente
  const editTask = async (taskId, updates) => {
    if (!isAuthenticated) return { success: false, error: 'Usuário não autenticado' };

    setLoading(true);
    
    try {
      const result = await updateTask(taskId, updates);
      
      if (result.success) {
        // Atualizar a tarefa no estado local
        setTasks(prev => prev.map(task => 
          task.id === taskId ? result.task : task
        ));
        // Recarregar estatísticas
        await loadStats();
      }
      
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Deletar tarefa
  const removeTask = async (taskId) => {
    if (!isAuthenticated) return { success: false, error: 'Usuário não autenticado' };

    setLoading(true);
    
    try {
      const result = await deleteTask(taskId);
      
      if (result.success) {
        // Remover tarefa do estado local
        setTasks(prev => prev.filter(task => task.id !== taskId));
        // Recarregar estatísticas
        await loadStats();
      }
      
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Marcar tarefa como concluída/pendente
  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Concluída' ? 'Pendente' : 'Concluída';
    return await editTask(taskId, { status: newStatus });
  };

  // Carregar dados iniciais
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
      loadStats();
    } else {
      // Limpar dados quando usuário não está autenticado
      setTasks([]);
      setStats(null);
      setError(null);
      setLoading(false); // Para de carregar também
    }
  }, [isAuthenticated, loadTasks, loadStats]);

  // Limpar dados imediatamente quando authentication state muda
  useEffect(() => {
    // Limpar sempre que o hook for re-renderizado e não há usuário autenticado
    if (!isAuthenticated) {
      setTasks([]);
      setStats(null);
      setError(null);
    }
  }, [user, isAuthenticated]); // Reagir a mudanças de usuário E isAuthenticated

  return {
    tasks,
    stats,
    loading,
    error,
    loadTasks,
    loadStats,
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus
  };
};