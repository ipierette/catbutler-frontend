import { useState, useCallback, useMemo } from 'react';

// ============================================
// 🍳 THEMEALDB DIRETO NO FRONTEND
// ============================================

class TheMealDBClient {
  static BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  static async buscarPorIngrediente(ingrediente) {
    try {
      console.log(`🌐 Buscando receitas para: ${ingrediente}`);
      const response = await fetch(`${this.BASE_URL}/filter.php?i=${ingrediente}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('❌ Erro TheMealDB:', error);
      return [];
    }
  }

  static async obterDetalhes(idReceita) {
    try {
      const response = await fetch(`${this.BASE_URL}/lookup.php?i=${idReceita}`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes:', error);
      return null;
    }
  }

  static formatarReceita(meal) {
    if (!meal) return null;

    // Extrair ingredientes
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = meal[`strIngredient${i}`];
      const medida = meal[`strMeasure${i}`];
      if (ingrediente && ingrediente.trim()) {
        ingredientes.push(medida ? `${medida} ${ingrediente}`.trim() : ingrediente.trim());
      }
    }

    return {
      id: meal.idMeal,
      nome: meal.strMeal,
      imagem: meal.strMealThumb,
      tempo: "30min",
      dificuldade: "Médio", 
      tipo: meal.strCategory || "Prato principal",
      ingredientes,
      instrucoes: meal.strInstructions,
      rating: 4.5,
      fonte: "TheMealDB",
      apresentadoPor: "Chef Internacional",
      video: meal.strYoutube,
      tags: meal.strTags?.split(',') || [],
      origem: meal.strArea
    };
  }
}

// Receitas estáticas de fallback
const RECEITAS_FALLBACK = [
  {
    id: 'static-1',
    nome: 'Frango Grelhado Simples',
    imagem: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    tempo: "25min",
    dificuldade: "Fácil",
    tipo: "Prato Principal", 
    ingredientes: ['Peito de frango', 'Sal', 'Pimenta', 'Azeite'],
    instrucoes: 'Tempere o frango e grelhe por 8 minutos de cada lado.',
    rating: 4.8,
    apresentadoPor: 'Chef CatButler'
  },
  {
    id: 'static-2',
    nome: 'Arroz com Alho',
    imagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    tempo: "20min", 
    dificuldade: "Fácil",
    tipo: "Acompanhamento",
    ingredientes: ['Arroz', 'Alho', 'Óleo', 'Sal'],
    instrucoes: 'Refogue o alho, adicione o arroz e água. Cozinhe por 15 minutos.',
    rating: 4.6,
    apresentadoPor: 'Chef CatButler'
  },
  {
    id: 'static-3', 
    nome: 'Omelete de Queijo',
    imagem: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400',
    tempo: "10min",
    dificuldade: "Fácil", 
    tipo: "Café da Manhã",
    ingredientes: ['Ovos', 'Queijo', 'Manteiga', 'Sal'],
    instrucoes: 'Bata os ovos, despeje na frigideira, adicione queijo e dobre.',
    rating: 4.7,
    apresentadoPor: 'Chef CatButler'
  }
];

// ============================================
// 🎯 HOOK PRINCIPAL - VERSÃO SIMPLIFICADA
// ============================================

export default function useCozinhaIA() {
  // Estados
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [receitasSugeridas, setReceitasSugeridas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Adicionar ingrediente
  const adicionarIngrediente = useCallback((ingrediente) => {
    const ingredienteLimpo = ingrediente.trim();
    if (ingredienteLimpo && !ingredientesSelecionados.includes(ingredienteLimpo)) {
      setIngredientesSelecionados(prev => [...prev, ingredienteLimpo]);
      console.log('🥕 Ingrediente adicionado:', ingredienteLimpo);
    }
  }, [ingredientesSelecionados]);

  // Remover ingrediente
  const removerIngrediente = useCallback((ingrediente) => {
    setIngredientesSelecionados(prev => prev.filter(ing => ing !== ingrediente));
    console.log('🗑️ Ingrediente removido:', ingrediente);
  }, []);

  // Limpar ingredientes
  const limparIngredientes = useCallback(() => {
    setIngredientesSelecionados([]);
    setReceitasSugeridas([]);
    console.log('🧹 Ingredientes limpos');
  }, []);

  // Buscar receitas
  const buscarSugestoes = useCallback(async (ingredientesCustom) => {
    const ingredientes = ingredientesCustom || ingredientesSelecionados;
    
    if (!ingredientes.length) {
      setError('Selecione pelo menos um ingrediente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Buscando receitas para:', ingredientes);
      
      const todasReceitas = [];
      
      // 1. Buscar no TheMealDB
      try {
        const ingredientePrincipal = ingredientes[0];
        const meals = await TheMealDBClient.buscarPorIngrediente(ingredientePrincipal);
        
        for (const meal of meals.slice(0, 4)) {
          const detalhes = await TheMealDBClient.obterDetalhes(meal.idMeal);
          if (detalhes) {
            const receita = TheMealDBClient.formatarReceita(detalhes);
            if (receita) {
              todasReceitas.push(receita);
            }
          }
        }
        
        console.log(`✅ ${todasReceitas.length} receitas encontradas no TheMealDB`);
      } catch (error) {
        console.error('⚠️ Erro TheMealDB:', error);
      }
      
      // 2. Adicionar receitas estáticas se não encontrou suficientes
      if (todasReceitas.length < 3) {
        const receitasEstaticas = RECEITAS_FALLBACK.filter(receita =>
          ingredientes.some(ing => 
            receita.ingredientes.some(recIng => 
              recIng.toLowerCase().includes(ing.toLowerCase()) ||
              ing.toLowerCase().includes(recIng.toLowerCase())
            )
          )
        );
        
        todasReceitas.push(...receitasEstaticas);
        console.log(`✅ ${receitasEstaticas.length} receitas estáticas adicionadas`);
      }
      
      // 3. Se ainda não tem receitas, usar todas as estáticas
      if (todasReceitas.length === 0) {
        todasReceitas.push(...RECEITAS_FALLBACK);
        console.log('✅ Usando receitas fallback');
      }

      setReceitasSugeridas(todasReceitas.slice(0, 8));
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Erro ao buscar receitas:', err);
    } finally {
      setLoading(false);
    }
  }, [ingredientesSelecionados]);

  // Hook de sugestões
  const sugestoes = useMemo(() => ({
    receitas: receitasSugeridas,
    loading,
    error,
    buscarSugestoes
  }), [receitasSugeridas, loading, error, buscarSugestoes]);

  // Hooks placeholder (para compatibilidade)
  const busca = useMemo(() => ({
    resultados: [],
    loading: false,
    error: null,
    buscar: () => console.log('🔍 Busca não implementada nesta versão')
  }), []);

  const chat = useMemo(() => ({
    conversa: [],
    loading: false,
    error: null,
    enviarMensagem: () => console.log('💬 Chat não implementado nesta versão')
  }), []);

  // Retorno principal
  return {
    // Estados
    ingredientesSelecionados,
    
    // Hooks
    sugestoes,
    busca,
    chat,
    
    // Ações
    adicionarIngrediente,
    removerIngrediente,
    limparIngredientes,
    
    // Computed
    temIngredientes: ingredientesSelecionados.length > 0,
    podeGerarSugestoes: ingredientesSelecionados.length > 0
  };
}