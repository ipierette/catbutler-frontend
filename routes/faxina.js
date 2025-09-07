const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get cleaning suggestions by environment
router.post('/suggestions', optionalAuth, async (req, res) => {
  try {
    const { environment, surface, cleaningLevel } = req.body;

    if (!environment) {
      return res.status(400).json({
        error: 'Invalid environment',
        message: 'Please specify the environment to clean'
      });
    }

    const suggestions = generateCleaningSuggestions(environment, surface, cleaningLevel);

    // Log cleaning request if user is authenticated
    if (req.user) {
      await supabase
        .from('cleaning_requests')
        .insert([
          {
            user_id: req.user.id,
            environment: environment,
            surface: surface || 'general',
            cleaning_level: cleaningLevel || 'normal',
            suggestions_count: suggestions.length,
            created_at: new Date().toISOString()
          }
        ]);
    }

    res.json({
      message: 'Cleaning suggestions generated successfully',
      suggestions,
      environment,
      surface: surface || 'general'
    });
  } catch (error) {
    console.error('Cleaning suggestions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not generate cleaning suggestions'
    });
  }
});

// Get sustainability tips
router.get('/sustainability', optionalAuth, async (req, res) => {
  try {
    const sustainabilityTips = generateSustainabilityTips();

    res.json({
      message: 'Sustainability tips retrieved successfully',
      tips: sustainabilityTips
    });
  } catch (error) {
    console.error('Sustainability tips error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve sustainability tips'
    });
  }
});

// Calculate environmental impact
router.post('/impact', optionalAuth, async (req, res) => {
  try {
    const { actions } = req.body;

    if (!actions || !Array.isArray(actions)) {
      return res.status(400).json({
        error: 'Invalid actions',
        message: 'Please provide a list of sustainable actions'
      });
    }

    const impact = calculateEnvironmentalImpact(actions);

    // Log impact calculation if user is authenticated
    if (req.user) {
      await supabase
        .from('impact_calculations')
        .insert([
          {
            user_id: req.user.id,
            actions: actions,
            water_saved: impact.water,
            energy_saved: impact.energy,
            eco_products: impact.ecoProducts,
            created_at: new Date().toISOString()
          }
        ]);
    }

    res.json({
      message: 'Environmental impact calculated successfully',
      impact
    });
  } catch (error) {
    console.error('Impact calculation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not calculate environmental impact'
    });
  }
});

// Get cleaning products guide
router.get('/products', optionalAuth, async (req, res) => {
  try {
    const { surface } = req.query;

    const products = getCleaningProducts(surface);

    res.json({
      message: 'Cleaning products retrieved successfully',
      products,
      surface: surface || 'general'
    });
  } catch (error) {
    console.error('Products guide error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve cleaning products'
    });
  }
});

// Save cleaning routine
router.post('/routines', authenticateToken, async (req, res) => {
  try {
    const { name, tasks, frequency, environment } = req.body;
    const userId = req.user.id;

    if (!name || !tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        error: 'Invalid routine',
        message: 'Routine name and tasks are required'
      });
    }

    const { data, error } = await supabase
      .from('cleaning_routines')
      .insert([
        {
          user_id: userId,
          name: name,
          tasks: tasks,
          frequency: frequency || 'weekly',
          environment: environment || 'general',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Save routine error:', error);
      return res.status(500).json({
        error: 'Save failed',
        message: 'Could not save cleaning routine'
      });
    }

    res.json({
      message: 'Cleaning routine saved successfully',
      routine: data
    });
  } catch (error) {
    console.error('Save routine error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while saving routine'
    });
  }
});

// Get user's cleaning routines
router.get('/routines', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: routines, error } = await supabase
      .from('cleaning_routines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get routines error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Could not retrieve cleaning routines'
      });
    }

    res.json({
      message: 'Cleaning routines retrieved successfully',
      routines: routines || []
    });
  } catch (error) {
    console.error('Get routines error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not retrieve cleaning routines'
    });
  }
});

// Helper functions
function generateCleaningSuggestions(environment, surface, cleaningLevel) {
  const suggestions = {
    'cozinha': [
      'Limpe a bancada com detergente neutro',
      'Aspire os restos de comida do chão',
      'Limpe o fogão removendo gordura',
      'Organize a geladeira removendo itens vencidos',
      'Lave a louça acumulada'
    ],
    'banheiro': [
      'Limpe o vaso sanitário com desinfetante',
      'Lave o box com removedor de sabão',
      'Limpe o espelho com álcool',
      'Aspire o chão e lave com água sanitária',
      'Organize os produtos de higiene'
    ],
    'quarto': [
      'Troque e lave a roupa de cama',
      'Aspire o colchão e travesseiros',
      'Organize o guarda-roupa',
      'Limpe os móveis com pano úmido',
      'Aspire o chão e passe pano'
    ],
    'sala': [
      'Aspire os sofás e poltronas',
      'Limpe os móveis com produto adequado',
      'Organize objetos e decorações',
      'Aspire o chão e passe pano',
      'Limpe janelas e espelhos'
    ]
  };

  return suggestions[environment] || suggestions['sala'];
}

function generateSustainabilityTips() {
  return {
    agua: [
      'Use balde em vez de mangueira',
      'Reutilize água da chuva',
      'Feche torneiras durante limpeza',
      'Use produtos concentrados'
    ],
    energia: [
      'Use aspirador com filtro HEPA',
      'Lave roupas com água fria',
      'Seque roupas no varal',
      'Use lâmpadas LED'
    ],
    produtos: [
      'Faça produtos caseiros',
      'Use embalagens reutilizáveis',
      'Compre a granel',
      'Recicle embalagens'
    ],
    upcycling: [
      'Transforme garrafas em organizadores',
      'Use caixas como prateleiras',
      'Reutilize roupas como panos',
      'Crie decoração com objetos antigos'
    ]
  };
}

function calculateEnvironmentalImpact(actions) {
  let water = 0;
  let energy = 0;
  let ecoProducts = 0;

  actions.forEach(action => {
    switch (action) {
      case 'Use balde em vez de mangueira':
        water += 50;
        break;
      case 'Reutilize água da chuva':
        water += 30;
        break;
      case 'Feche torneiras durante limpeza':
        water += 20;
        break;
      case 'Use produtos concentrados':
        water += 15;
        ecoProducts += 1;
        break;
      case 'Use aspirador com filtro HEPA':
        energy += 10;
        break;
      case 'Lave roupas com água fria':
        energy += 25;
        break;
      case 'Seque roupas no varal':
        energy += 30;
        break;
      case 'Use lâmpadas LED':
        energy += 15;
        break;
      case 'Faça produtos caseiros':
        ecoProducts += 2;
        break;
      case 'Use embalagens reutilizáveis':
        ecoProducts += 1;
        break;
      case 'Compre a granel':
        ecoProducts += 1;
        break;
      case 'Recicle embalagens':
        ecoProducts += 1;
        break;
    }
  });

  return {
    water: `${water}L`,
    energy: `${energy}kWh`,
    ecoProducts: ecoProducts
  };
}

function getCleaningProducts(surface) {
  const products = {
    'madeira': [
      { name: 'Cera para Madeira', brand: 'Brilhante', eco: true },
      { name: 'Óleo de Limão', brand: 'Natural', eco: true },
      { name: 'Pano de Microfibra', brand: 'EcoClean', eco: true }
    ],
    'vidro': [
      { name: 'Limpa Vidros', brand: 'Cristal', eco: false },
      { name: 'Vinagre Branco', brand: 'Natural', eco: true },
      { name: 'Papel Jornal', brand: 'Reciclado', eco: true }
    ],
    'azulejo': [
      { name: 'Desinfetante', brand: 'Limpol', eco: false },
      { name: 'Bicarbonato de Sódio', brand: 'Natural', eco: true },
      { name: 'Água Sanitária', brand: 'Cloro', eco: false }
    ],
    'geral': [
      { name: 'Detergente Neutro', brand: 'Suave', eco: true },
      { name: 'Álcool 70%', brand: 'Farmacêutico', eco: true },
      { name: 'Sabão de Coco', brand: 'Natural', eco: true }
    ]
  };

  return products[surface] || products['geral'];
}

module.exports = router;
