const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get shopping suggestions
router.post('/suggestions', optionalAuth, async (req, res) => {
  try {
    const { ingredients, budget, dietaryRestrictions } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Invalid ingredients',
        message: 'Please provide a valid list of ingredients'
      });
    }

    const suggestions = generateShoppingSuggestions(ingredients, budget, dietaryRestrictions);

    // Log shopping request if user is authenticated
    if (req.user) {
      await supabase
        .from('shopping_requests')
        .insert([
          {
            user_id: req.user.id,
            ingredients: ingredients,
            budget: budget || 0,
            dietary_restrictions: dietaryRestrictions || [],
            suggestions_count: suggestions.length,
            created_at: new Date().toISOString()
          }
        ]);
    }

    res.json({
      message: 'Shopping suggestions generated successfully',
      suggestions,
      budget: budget || 'unlimited',
      ingredients_requested: ingredients.length
    });
  } catch (error) {
    console.error('Shopping suggestions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not generate shopping suggestions'
    });
  }
});

// Get smart offers
router.get('/offers', optionalAuth, async (req, res) => {
  try {
    const { category, maxPrice } = req.query;

    const offers = generateSmartOffers(category, maxPrice);

    res.json({
      message: 'Smart offers retrieved successfully',
      offers,
      category: category || 'all',
      count: offers.length
    });
  } catch (error) {
    console.error('Smart offers error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve smart offers'
    });
  }
});

// Get price comparison
router.post('/compare', optionalAuth, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: 'Invalid products',
        message: 'Please provide a valid list of products to compare'
      });
    }

    const comparison = generatePriceComparison(products);

    res.json({
      message: 'Price comparison generated successfully',
      comparison,
      products_compared: products.length
    });
  } catch (error) {
    console.error('Price comparison error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not generate price comparison'
    });
  }
});

// Save shopping list
router.post('/lists', authenticateToken, async (req, res) => {
  try {
    const { name, items, totalPrice } = req.body;
    const userId = req.user.id;

    if (!name || !items || !Array.isArray(items)) {
      return res.status(400).json({
        error: 'Invalid shopping list',
        message: 'List name and items are required'
      });
    }

    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([
        {
          user_id: userId,
          name: name,
          items: items,
          total_price: totalPrice || 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Save list error:', error);
      return res.status(500).json({
        error: 'Save failed',
        message: 'Could not save shopping list'
      });
    }

    res.json({
      message: 'Shopping list saved successfully',
      list: data
    });
  } catch (error) {
    console.error('Save list error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while saving list'
    });
  }
});

// Get user's shopping lists
router.get('/lists', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: lists, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get lists error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve shopping lists'
      });
    }

    res.json({
      message: 'Shopping lists retrieved successfully',
      lists: lists || []
    });
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve shopping lists'
    });
  }
});

// Get nutritional information
router.post('/nutrition', optionalAuth, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: 'Invalid products',
        message: 'Please provide a valid list of products'
      });
    }

    const nutritionInfo = generateNutritionInfo(products);

    res.json({
      message: 'Nutritional information retrieved successfully',
      nutrition: nutritionInfo
    });
  } catch (error) {
    console.error('Nutrition info error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve nutritional information'
    });
  }
});

// Helper functions
function generateShoppingSuggestions(ingredients, budget, dietaryRestrictions) {
  const suggestions = [];
  
  // Mock product database
  const products = {
    'tomato': [
      { name: 'Tomate Italiano', price: 4.50, unit: 'kg', store: 'Supermercado A', eco: true },
      { name: 'Tomate Cereja', price: 6.90, unit: 'bandeja', store: 'Supermercado B', eco: false },
      { name: 'Tomate Orgânico', price: 8.50, unit: 'kg', store: 'Supermercado C', eco: true }
    ],
    'chicken': [
      { name: 'Peito de Frango', price: 12.90, unit: 'kg', store: 'Supermercado A', eco: false },
      { name: 'Frango Caipira', price: 18.90, unit: 'kg', store: 'Supermercado B', eco: true },
      { name: 'Frango Orgânico', price: 24.90, unit: 'kg', store: 'Supermercado C', eco: true }
    ],
    'rice': [
      { name: 'Arroz Branco', price: 3.50, unit: 'kg', store: 'Supermercado A', eco: false },
      { name: 'Arroz Integral', price: 5.90, unit: 'kg', store: 'Supermercado B', eco: true },
      { name: 'Arroz Orgânico', price: 8.90, unit: 'kg', store: 'Supermercado C', eco: true }
    ],
    'milk': [
      { name: 'Leite Integral', price: 4.90, unit: 'L', store: 'Supermercado A', eco: false },
      { name: 'Leite Desnatado', price: 5.20, unit: 'L', store: 'Supermercado B', eco: false },
      { name: 'Leite de Amêndoa', price: 12.90, unit: 'L', store: 'Supermercado C', eco: true }
    ]
  };

  ingredients.forEach(ingredient => {
    const ingredientProducts = products[ingredient.toLowerCase()] || [];
    suggestions.push(...ingredientProducts);
  });

  // Filter by budget if specified
  if (budget && budget > 0) {
    return suggestions.filter(product => product.price <= budget);
  }

  // Remove duplicates
  const uniqueSuggestions = suggestions.filter((product, index, self) => 
    index === self.findIndex(p => p.name === product.name)
  );

  return uniqueSuggestions.slice(0, 10); // Return max 10 suggestions
}

function generateSmartOffers(category, maxPrice) {
  const offers = [
    {
      name: 'Oferta: 2x1 em Produtos de Limpeza',
      description: 'Leve 2 e pague 1 em produtos de limpeza',
      discount: '50%',
      validUntil: '2025-02-15',
      category: 'limpeza',
      eco: false
    },
    {
      name: 'Desconto: Frutas Orgânicas',
      description: '20% de desconto em frutas orgânicas',
      discount: '20%',
      validUntil: '2025-02-10',
      category: 'frutas',
      eco: true
    },
    {
      name: 'Promoção: Grãos Integrais',
      description: '3 por R$ 10 em grãos integrais',
      discount: '33%',
      validUntil: '2025-02-20',
      category: 'graos',
      eco: true
    },
    {
      name: 'Oferta: Produtos de Higiene',
      description: '15% de desconto em produtos de higiene',
      discount: '15%',
      validUntil: '2025-02-12',
      category: 'higiene',
      eco: false
    }
  ];

  let filteredOffers = offers;

  if (category && category !== 'all') {
    filteredOffers = offers.filter(offer => offer.category === category);
  }

  if (maxPrice) {
    // Mock price filtering
    filteredOffers = filteredOffers.filter(offer => Math.random() > 0.3);
  }

  return filteredOffers;
}

function generatePriceComparison(products) {
  const stores = ['Supermercado A', 'Supermercado B', 'Supermercado C'];
  const comparison = {};

  products.forEach(product => {
    comparison[product] = stores.map(store => ({
      store,
      price: (Math.random() * 20 + 5).toFixed(2),
      availability: Math.random() > 0.2,
      eco: Math.random() > 0.5
    }));
  });

  return comparison;
}

function generateNutritionInfo(products) {
  const nutritionData = {
    'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 }
  };

  const totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  products.forEach(product => {
    const nutrition = nutritionData[product.toLowerCase()];
    if (nutrition) {
      Object.keys(totalNutrition).forEach(key => {
        totalNutrition[key] += nutrition[key];
      });
    }
  });

  return {
    total: totalNutrition,
    perProduct: products.map(product => ({
      product,
      nutrition: nutritionData[product.toLowerCase()] || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    }))
  };
}

module.exports = router;
