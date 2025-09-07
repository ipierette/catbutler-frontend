const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user achievements
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user achievements from database
    const { data: achievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Achievements error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve achievements'
      });
    }

    // Return default achievements if none found
    const defaultAchievements = {
      recipes: 0,
      shopping: 0,
      tasks: 0,
      days: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.json({
      message: 'Achievements retrieved successfully',
      achievements: achievements || defaultAchievements
    });
  } catch (error) {
    console.error('Achievements error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve achievements'
    });
  }
});

// Update user achievements
router.put('/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipes, shopping, tasks, days } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (recipes !== undefined) updateData.recipes = recipes;
    if (shopping !== undefined) updateData.shopping = shopping;
    if (tasks !== undefined) updateData.tasks = tasks;
    if (days !== undefined) updateData.days = days;

    // Try to update existing record
    const { data: existing, error: fetchError } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_achievements')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      result = { data, error };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('user_achievements')
        .insert([
          {
            user_id: userId,
            ...updateData,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Achievements update error:', result.error);
      return res.status(500).json({
        error: 'Update failed',
        message: 'Could not update achievements'
      });
    }

    res.json({
      message: 'Achievements updated successfully',
      achievements: result.data
    });
  } catch (error) {
    console.error('Achievements update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong during achievements update'
    });
  }
});

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Settings error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve settings'
      });
    }

    // Return default settings if none found
    const defaultSettings = {
      theme: 'dark',
      notifications: true,
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.json({
      message: 'Settings retrieved successfully',
      settings: settings || defaultSettings
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve settings'
    });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme, notifications, language, timezone } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (theme !== undefined) updateData.theme = theme;
    if (notifications !== undefined) updateData.notifications = notifications;
    if (language !== undefined) updateData.language = language;
    if (timezone !== undefined) updateData.timezone = timezone;

    // Try to update existing record
    const { data: existing, error: fetchError } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      result = { data, error };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('user_settings')
        .insert([
          {
            user_id: userId,
            ...updateData,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Settings update error:', result.error);
      return res.status(500).json({
        error: 'Update failed',
        message: 'Could not update settings'
      });
    }

    res.json({
      message: 'Settings updated successfully',
      settings: result.data
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong during settings update'
    });
  }
});

module.exports = router;
