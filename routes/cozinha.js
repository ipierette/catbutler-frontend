const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get cooking suggestions based on ingredients
router.post('/suggestions', optionalAuth, async (req, res) => {
  try {
    const { ingredients, mealType, dietaryRestrictions } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Invalid ingredients',
        message: 'Please provide a valid list of ingredients'
      });
    }

    // Simple AI-like suggestions based on ingredients
    const suggestions = generateCookingSuggestions(ingredients, mealType, dietaryRestrictions);

    // Log suggestion request if user is authenticated
    if (req.user) {
      await supabase
        .from('cooking_requests')
        .insert([
          {
            user_id: req.user.id,
            ingredients: ingredients,
            meal_type: mealType || 'any',
            dietary_restrictions: dietaryRestrictions || [],
            suggestions_count: suggestions.length,
            created_at: new Date().toISOString()
          }
        ]);
    }

    res.json({
      message: 'Cooking suggestions generated successfully',
      suggestions,
      ingredients_used: ingredients,
      meal_type: mealType || 'any'
    });
  } catch (error) {
    console.error('Cooking suggestions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not generate cooking suggestions'
    });
  }
});

// Get weekly menu
router.post('/weekly-menu', optionalAuth, async (req, res) => {
  try {
    const { preferences, dietaryRestrictions } = req.body;

    const weeklyMenu = generateWeeklyMenu(preferences, dietaryRestrictions);

    // Log menu request if user is authenticated
    if (req.user) {
      await supabase
        .from('menu_requests')
        .insert([
          {
            user_id: req.user.id,
            preferences: preferences || {},
            dietary_restrictions: dietaryRestrictions || [],
            created_at: new Date().toISOString()
          }
        ]);
    }

    res.json({
      message: 'Weekly menu generated successfully',
      menu: weeklyMenu
    });
  } catch (error) {
    console.error('Weekly menu error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not generate weekly menu'
    });
  }
});

// Save favorite recipe
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { recipe } = req.body;
    const userId = req.user.id;

    if (!recipe || !recipe.name) {
      return res.status(400).json({
        error: 'Invalid recipe',
        message: 'Recipe name is required'
      });
    }

    const { data, error } = await supabase
      .from('favorite_recipes')
      .insert([
        {
          user_id: userId,
          recipe_name: recipe.name,
          recipe_data: recipe,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Save favorite error:', error);
      return res.status(500).json({
        error: 'Save failed',
        message: 'Could not save favorite recipe'
      });
    }

    res.json({
      message: 'Recipe saved to favorites successfully',
      favorite: data
    });
  } catch (error) {
    console.error('Save favorite error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while saving recipe'
    });
  }
});

// Get favorite recipes
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: favorites, error } = await supabase
      .from('favorite_recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get favorites error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve favorite recipes'
      });
    }

    res.json({
      message: 'Favorite recipes retrieved successfully',
      favorites: favorites || []
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve favorite recipes'
    });
  }
});

// Helper function to generate cooking suggestions
function generateCookingSuggestions(ingredients, mealType, dietaryRestrictions) {
  const suggestions = [];
  
  // Simple recipe database
  const recipes = {
    'tomato': [
      { name: 'Spaghetti à Bolonhesa', difficulty: 'easy', time: '30min', type: 'dinner' },
      { name: 'Salada Caprese', difficulty: 'easy', time: '10min', type: 'lunch' },
      { name: 'Sopa de Tomate', difficulty: 'easy', time: '25min', type: 'lunch' }
    ],
    'chicken': [
      { name: 'Frango Grelhado', difficulty: 'easy', time: '20min', type: 'dinner' },
      { name: 'Frango com Arroz', difficulty: 'medium', time: '45min', type: 'dinner' },
      { name: 'Salada de Frango', difficulty: 'easy', time: '15min', type: 'lunch' }
    ],
    'egg': [
      { name: 'Omelete', difficulty: 'easy', time: '10min', type: 'breakfast' },
      { name: 'Ovos Mexidos', difficulty: 'easy', time: '5min', type: 'breakfast' },
      { name: 'Frittata', difficulty: 'medium', time: '30min', type: 'dinner' }
    ],
    'rice': [
      { name: 'Arroz Branco', difficulty: 'easy', time: '20min', type: 'side' },
      { name: 'Risotto', difficulty: 'hard', time: '45min', type: 'dinner' },
      { name: 'Arroz de Forno', difficulty: 'medium', time: '60min', type: 'dinner' }
    ]
  };

  // Generate suggestions based on available ingredients
  ingredients.forEach(ingredient => {
    const ingredientRecipes = recipes[ingredient.toLowerCase()] || [];
    suggestions.push(...ingredientRecipes);
  });

  // Filter by meal type if specified
  if (mealType && mealType !== 'any') {
    return suggestions.filter(recipe => recipe.type === mealType);
  }

  // Remove duplicates
  const uniqueSuggestions = suggestions.filter((recipe, index, self) => 
    index === self.findIndex(r => r.name === recipe.name)
  );

  return uniqueSuggestions.slice(0, 5); // Return max 5 suggestions
}

// Helper function to generate weekly menu
function generateWeeklyMenu(preferences, dietaryRestrictions) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const meals = ['Café da Manhã', 'Almoço', 'Jantar'];
  
  const menu = {};
  
  days.forEach(day => {
    menu[day] = {};
    meals.forEach(meal => {
      menu[day][meal] = generateMealSuggestion(meal, dietaryRestrictions);
    });
  });

  return menu;
}

function generateMealSuggestion(meal, dietaryRestrictions) {
  const mealSuggestions = {
    'Café da Manhã': [
      'Pão com manteiga e café',
      'Aveia com frutas',
      'Omelete com queijo',
      'Smoothie de banana',
      'Torrada com abacate'
    ],
    'Almoço': [
      'Salada de frango grelhado',
      'Risotto de cogumelos',
      'Peixe assado com legumes',
      'Quinoa com vegetais',
      'Sopa de legumes'
    ],
    'Jantar': [
      'Frango grelhado com arroz',
      'Salmão com batata doce',
      'Massa integral com molho de tomate',
      'Lentilha com arroz',
      'Sopa de feijão'
    ]
  };

  const suggestions = mealSuggestions[meal] || ['Refeição balanceada'];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

module.exports = router;
