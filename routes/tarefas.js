const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get task suggestions
router.post('/suggestions', optionalAuth, async (req, res) => {
  try {
    const { category, priority, timeAvailable } = req.body;

    const suggestions = generateTaskSuggestions(category, priority, timeAvailable);

    // Log task request if user is authenticated
    if (req.user) {
      await supabase
        .from('task_requests')
        .insert([
          {
            user_id: req.user.id,
            category: category || 'general',
            priority: priority || 'medium',
            time_available: timeAvailable || 30,
            suggestions_count: suggestions.length,
            created_at: new Date().toISOString()
          }
        ]);
    }

    res.json({
      message: 'Task suggestions generated successfully',
      suggestions,
      category: category || 'general',
      time_available: timeAvailable || 30
    });
  } catch (error) {
    console.error('Task suggestions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not generate task suggestions'
    });
  }
});

// Create new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, estimatedTime } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        error: 'Invalid task',
        message: 'Task title is required'
      });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          title: title,
          description: description || '',
          category: category || 'general',
          priority: priority || 'medium',
          due_date: dueDate || null,
          estimated_time: estimatedTime || 30,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Create task error:', error);
      return res.status(500).json({
        error: 'Create failed',
        message: 'Could not create task'
      });
    }

    res.json({
      message: 'Task created successfully',
      task: data
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while creating task'
    });
  }
});

// Get user's tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category, priority } = req.query;

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (priority) query = query.eq('priority', priority);

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Get tasks error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve tasks'
      });
    }

    res.json({
      message: 'Tasks retrieved successfully',
      tasks: tasks || []
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve tasks'
    });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, category, priority, dueDate, estimatedTime, status } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.due_date = dueDate;
    if (estimatedTime !== undefined) updateData.estimated_time = estimatedTime;
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update task error:', error);
      return res.status(500).json({
        error: 'Update failed',
        message: 'Could not update task'
      });
    }

    if (!data) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'Task not found or you do not have permission to update it'
      });
    }

    res.json({
      message: 'Task updated successfully',
      task: data
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while updating task'
    });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete task error:', error);
      return res.status(500).json({
        error: 'Delete failed',
        message: 'Could not delete task'
      });
    }

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while deleting task'
    });
  }
});

// Get task statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('status, category, priority, created_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Get stats error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve task statistics'
      });
    }

    const stats = calculateTaskStats(tasks || []);

    res.json({
      message: 'Task statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve task statistics'
    });
  }
});

// Helper functions
function generateTaskSuggestions(category, priority, timeAvailable) {
  const suggestions = {
    'cozinha': [
      { title: 'Limpar geladeira', time: 15, priority: 'medium' },
      { title: 'Organizar despensa', time: 20, priority: 'low' },
      { title: 'Lavar louça acumulada', time: 10, priority: 'high' },
      { title: 'Limpar fogão', time: 15, priority: 'medium' },
      { title: 'Fazer lista de compras', time: 5, priority: 'low' }
    ],
    'faxina': [
      { title: 'Aspirar toda a casa', time: 30, priority: 'medium' },
      { title: 'Limpar banheiros', time: 25, priority: 'high' },
      { title: 'Organizar quarto', time: 20, priority: 'low' },
      { title: 'Limpar janelas', time: 15, priority: 'low' },
      { title: 'Lavar roupas', time: 10, priority: 'high' }
    ],
    'mercado': [
      { title: 'Fazer lista de compras', time: 10, priority: 'medium' },
      { title: 'Verificar ofertas', time: 15, priority: 'low' },
      { title: 'Organizar cupons', time: 5, priority: 'low' },
      { title: 'Planejar refeições da semana', time: 20, priority: 'medium' },
      { title: 'Verificar validade dos produtos', time: 10, priority: 'high' }
    ],
    'geral': [
      { title: 'Responder emails', time: 15, priority: 'medium' },
      { title: 'Organizar documentos', time: 20, priority: 'low' },
      { title: 'Fazer backup do computador', time: 30, priority: 'low' },
      { title: 'Planejar próxima semana', time: 15, priority: 'medium' },
      { title: 'Ligar para família', time: 10, priority: 'low' }
    ]
  };

  let categoryTasks = suggestions[category] || suggestions['geral'];

  // Filter by time available
  if (timeAvailable) {
    categoryTasks = categoryTasks.filter(task => task.time <= timeAvailable);
  }

  // Filter by priority
  if (priority) {
    categoryTasks = categoryTasks.filter(task => task.priority === priority);
  }

  return categoryTasks.slice(0, 5); // Return max 5 suggestions
}

function calculateTaskStats(tasks) {
  const stats = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    byCategory: {},
    byPriority: {},
    completionRate: 0,
    averageCompletionTime: 0
  };

  const now = new Date();

  tasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'completed':
        stats.completed++;
        break;
      case 'pending':
        stats.pending++;
        break;
      case 'in_progress':
        stats.inProgress++;
        break;
    }

    // Count by category
    stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;

    // Count by priority
    stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;

    // Check if overdue
    if (task.due_date && new Date(task.due_date) < now && task.status !== 'completed') {
      stats.overdue++;
    }
  });

  // Calculate completion rate
  if (stats.total > 0) {
    stats.completionRate = Math.round((stats.completed / stats.total) * 100);
  }

  return stats;
}

module.exports = router;
