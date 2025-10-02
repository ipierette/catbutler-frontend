import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

// 🎯 BANCO DE DICAS EXPANDIDO POR CATEGORIA
const DICAS_DATABASE = {
  cozinha: [
    {
      id: 'coz_001',
      titulo: 'Quebrar Ovos Perfeitamente',
      conteudo: 'Bata o ovo em uma superfície plana (não na borda da tigela) e abra com os polegares. Isso evita que pedaços de casca caiam na mistura.',
      dificuldade: 'fácil',
      tempo: '30 seg',
      tags: ['ovos', 'técnica', 'básico']
    },
    {
      id: 'coz_002', 
      titulo: 'Virar Omelete sem Quebrar',
      conteudo: 'Use uma espátula de silicone e vire apenas quando as bordas estiverem firmes. Incline a panela e dobre o omelete ao meio.',
      dificuldade: 'médio',
      tempo: '2 min',
      tags: ['omelete', 'técnica', 'ovos']
    },
    {
      id: 'coz_003',
      titulo: 'Temperos na Medida Certa',
      conteudo: 'Para cada 500g de carne: 1 colher de chá de sal, 1/2 colher de chá de pimenta, 1 colher de sopa de alho picado.',
      dificuldade: 'fácil',
      tempo: '1 min',
      tags: ['temperos', 'proporções', 'carne']
    },
    {
      id: 'coz_004',
      titulo: 'Ponto da Carne Perfeito',
      conteudo: 'Mal passada: 2-3 min cada lado. Ao ponto: 4-5 min cada lado. Bem passada: 6-7 min cada lado. Use termômetro para precisão.',
      dificuldade: 'médio',
      tempo: '5-15 min',
      tags: ['carne', 'ponto', 'técnica']
    },
    {
      id: 'coz_005',
      titulo: 'Massa Al Dente Perfeita',
      conteudo: 'Cozinhe 1-2 minutos a menos que o indicado na embalagem. A massa deve ter resistência leve ao morder.',
      dificuldade: 'fácil',
      tempo: '8-12 min',
      tags: ['massa', 'al dente', 'técnica']
    },
    {
      id: 'coz_006',
      titulo: 'Substituir Ovos em Receitas',
      conteudo: 'Para cada ovo: 1 colher de sopa de linhaça moída + 3 colheres de água (deixe 5 min). Funciona em bolos e panquecas.',
      dificuldade: 'fácil',
      tempo: '5 min',
      tags: ['substituição', 'vegano', 'ovos']
    },
    {
      id: 'coz_007',
      titulo: 'Conservar Ervas Frescas',
      conteudo: 'Lave, seque bem e guarde em potes com papel toalha no fundo. Manjericão dura 2 semanas, salsa até 1 mês.',
      dificuldade: 'fácil',
      tempo: '5 min',
      tags: ['conservação', 'ervas', 'frescor']
    },
    {
      id: 'coz_008',
      titulo: 'Arroz Soltinho Sempre',
      conteudo: 'Proporção: 1 xícara de arroz para 2 xícaras de água. Refogue o arroz antes de adicionar água quente.',
      dificuldade: 'fácil',
      tempo: '20 min',
      tags: ['arroz', 'técnica', 'básico']
    }
  ],
  
  limpeza: [
    {
      id: 'lim_001',
      titulo: 'Bicarbonato Multiuso',
      conteudo: 'Misture bicarbonato + vinagre para desentupir ralos. Para limpeza geral, use bicarbonato + água (pasta).',
      dificuldade: 'fácil',
      tempo: '5 min',
      tags: ['bicarbonato', 'natural', 'multiuso']
    },
    {
      id: 'lim_002',
      titulo: 'Remover Manchas do Sofá',
      conteudo: 'Água morna + sabão neutro + escova macia. Sempre teste em área escondida primeiro. Seque com ventilador.',
      dificuldade: 'médio',
      tempo: '15 min',
      tags: ['sofá', 'manchas', 'estofado']
    },
    {
      id: 'lim_003',
      titulo: 'Limpeza de Micro-ondas',
      conteudo: 'Coloque uma tigela com água e limão por 2 minutos na potência máxima. O vapor amolece a sujeira.',
      dificuldade: 'fácil',
      tempo: '5 min',
      tags: ['micro-ondas', 'vapor', 'limão']
    }
  ],
  
  organização: [
    {
      id: 'org_001',
      titulo: 'Método dos 5 Minutos',
      conteudo: 'Dedique 5 minutos por dia para organizar um cômodo. Em uma semana, toda casa estará organizada.',
      dificuldade: 'fácil',
      tempo: '5 min/dia',
      tags: ['rotina', 'organização', 'método']
    },
    {
      id: 'org_002',
      titulo: 'Guarda-roupa Funcional',
      conteudo: 'Organize por categoria (camisas, calças) e cor. Use cabides iguais para visual uniforme.',
      dificuldade: 'médio',
      tempo: '30 min',
      tags: ['roupas', 'guarda-roupa', 'visual']
    }
  ],
  
  economia: [
    {
      id: 'eco_001',
      titulo: 'Lista de Compras Inteligente',
      conteudo: 'Organize por seções do mercado: hortifruti, açougue, laticínios. Evita voltar em corredores já visitados.',
      dificuldade: 'fácil',
      tempo: '10 min',
      tags: ['compras', 'organização', 'tempo']
    },
    {
      id: 'eco_002',
      titulo: 'Aproveitamento Total dos Alimentos',
      conteudo: 'Cascas de batata viram chips no forno. Talos de brócolis são ótimos refogados. Sobras viram novos pratos.',
      dificuldade: 'médio',
      tempo: '15 min',
      tags: ['aproveitamento', 'sustentabilidade', 'economia']
    }
  ],
  
  geral: [
    {
      id: 'ger_001',
      titulo: 'Rotina Matinal Eficiente',
      conteudo: 'Prepare roupas na noite anterior. Café da manhã simples. 15 minutos de organização geral.',
      dificuldade: 'fácil',
      tempo: '30 min',
      tags: ['rotina', 'manhã', 'eficiência']
    },
    {
      id: 'ger_002',
      titulo: 'Plantas que Purificam o Ar',
      conteudo: 'Espada-de-são-jorge, jiboia e lírio-da-paz removem toxinas do ar. Regue 1x por semana.',
      dificuldade: 'fácil',
      tempo: '5 min/semana',
      tags: ['plantas', 'ar puro', 'saúde']
    }
  ]
};

// 🐱 FATOS SOBRE GATOS EXPANDIDOS
const CAT_FACTS = [
  {
    id: 'cat_001',
    titulo: 'Comunicação Felina',
    conteudo: 'Gatos fazem mais de 100 sons diferentes, mas miam principalmente para humanos, não para outros gatos!',
    categoria: 'comunicação',
    curiosidade: 'Entre gatos adultos, eles se comunicam mais por cheiros e linguagem corporal.'
  },
  {
    id: 'cat_002',
    titulo: 'Superpoderes dos Bigodes',
    conteudo: 'Os bigodes dos gatos são sensores ultra-sensíveis que detectam vibrações no ar e mudanças de pressão.',
    categoria: 'física',
    curiosidade: 'Se os bigodes passam por um espaço, o corpo do gato também passa!'
  },
  {
    id: 'cat_003',
    titulo: 'Dorminhoco Profissional',
    conteudo: 'Gatos dormem 12-16 horas por dia (70% da vida) para conservar energia para caçadas.',
    categoria: 'comportamento',
    curiosidade: 'Filhotes dormem até 20 horas por dia!'
  },
  {
    id: 'cat_004',
    titulo: 'Ronronar Terapêutico',
    conteudo: 'O ronronar vibra entre 20-50 Hz, frequência que pode acelerar a cura de ossos e reduzir dor.',
    categoria: 'saúde',
    curiosidade: 'Alguns hospitais usam terapia com gatos para pacientes!'
  },
  {
    id: 'cat_005',
    titulo: 'Paladar Único',
    conteudo: 'Gatos não conseguem sentir sabor doce! Eles têm apenas 470 papilas gustativas (humanos têm 9.000).',
    categoria: 'alimentação',
    curiosidade: 'Por isso preferem sabores umami e salgados.'
  },
  {
    id: 'cat_006',
    titulo: 'Visão Noturna Incrível',
    conteudo: 'Gatos enxergam 6x melhor no escuro que humanos, mas veem menos cores (principalmente azul e verde).',
    categoria: 'visão',
    curiosidade: 'Eles não enxergam bem objetos muito próximos (menos de 30cm).'
  },
  {
    id: 'cat_007',
    titulo: 'Terceira Pálpebra Secreta',
    conteudo: 'Gatos têm uma membrana nictitante (terceira pálpebra) que protege os olhos durante brigas.',
    categoria: 'anatomia',
    curiosidade: 'Se você vir essa pálpebra, pode ser sinal de que o gato está doente.'
  },
  {
    id: 'cat_008',
    titulo: 'Velocista Felino',
    conteudo: 'Um gato doméstico pode correr até 48 km/h em rajadas curtas, mais rápido que humanos!',
    categoria: 'física',
    curiosidade: 'Eles aceleram de 0 a 48 km/h em apenas 3 segundos.'
  }
];

export const useSmartTips = (categoria = 'geral', contextoEspecifico = null) => {
  const { isAuthenticated, user } = useAuth();
  const [dicaAtual, setDicaAtual] = useState(null);
  const [fatoAtual, setFatoAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  // Sistema de rotação inteligente baseado em timestamp + user
  const gerarIndiceInteligente = useCallback((array, seed = '') => {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const hour = now.getHours();
    const userSeed = user?.id ? user.id.slice(-4) : '0000';
    
    // Combina dia do ano + hora + categoria + seed do usuário
    const combinedSeed = dayOfYear + hour + seed.length + parseInt(userSeed, 16);
    return combinedSeed % array.length;
  }, [user]);

  // Selecionar dica baseada na categoria e contexto
  const selecionarDica = useCallback(() => {
    let dicasDisponiveis = [];
    
    // Se tem contexto específico (ex: ingredientes excluídos), priorizar dicas relacionadas
    if (contextoEspecifico?.ingredientesExcluidos?.length > 0) {
      const ingredientesExcluidos = contextoEspecifico.ingredientesExcluidos;
      
      // Buscar dicas de substituição para ingredientes excluídos
      dicasDisponiveis = DICAS_DATABASE.cozinha.filter(dica => 
        ingredientesExcluidos.some(ing => 
          dica.tags.includes(ing) || dica.conteudo.toLowerCase().includes(ing)
        )
      );
    }
    
    // Se não encontrou dicas específicas, usar categoria geral
    if (dicasDisponiveis.length === 0) {
      dicasDisponiveis = DICAS_DATABASE[categoria] || DICAS_DATABASE.geral;
    }
    
    const indice = gerarIndiceInteligente(dicasDisponiveis, categoria);
    return dicasDisponiveis[indice];
  }, [categoria, contextoEspecifico, gerarIndiceInteligente]);

  // Selecionar fato sobre gatos
  const selecionarFato = useCallback(() => {
    const indice = gerarIndiceInteligente(CAT_FACTS, 'cats');
    return CAT_FACTS[indice];
  }, [gerarIndiceInteligente]);

  // Atualizar dicas (chamado automaticamente ou manualmente)
  const atualizarDicas = useCallback(async (forcar = false) => {
    const agora = new Date();
    const ultimaAtualizacaoTime = ultimaAtualizacao ? new Date(ultimaAtualizacao) : null;
    
    // Atualizar apenas se passou mais de 1 hora ou se forçado
    const deveAtualizar = forcar || 
      !ultimaAtualizacaoTime || 
      (agora - ultimaAtualizacaoTime) > (60 * 60 * 1000); // 1 hora
    
    if (!deveAtualizar) return;
    
    setLoading(true);
    
    try {
      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const novaDica = selecionarDica();
      const novoFato = selecionarFato();
      
      setDicaAtual(novaDica);
      setFatoAtual(novoFato);
      setUltimaAtualizacao(agora.toISOString());
      
      // Salvar no localStorage para persistência
      if (user?.id) {
        localStorage.setItem(`tips_${user.id}_${categoria}`, JSON.stringify({
          dica: novaDica,
          fato: novoFato,
          timestamp: agora.toISOString()
        }));
      }
      
    } catch (error) {
      console.error('Erro ao atualizar dicas:', error);
    } finally {
      setLoading(false);
    }
  }, [ultimaAtualizacao, selecionarDica, selecionarFato, user, categoria]);

  // Buscar dicas relacionadas a um tópico específico
  const buscarDicasRelacionadas = useCallback((topico) => {
    const todasDicas = Object.values(DICAS_DATABASE).flat();
    return todasDicas.filter(dica => 
      dica.tags.some(tag => tag.includes(topico.toLowerCase())) ||
      dica.conteudo.toLowerCase().includes(topico.toLowerCase())
    ).slice(0, 3);
  }, []);

  // Gerar nova dica com IA (uso ocasional para não gastar tokens)
  const gerarDicaComIA = useCallback(async (tema) => {
    if (!isAuthenticated) return null;
    
    // Implementar apenas se necessário - por enquanto usar banco estático
    console.log('🤖 Geração de dica com IA solicitada para:', tema);
    return null;
  }, [isAuthenticated]);

  // Carregar dicas salvas do localStorage
  useEffect(() => {
    if (user?.id) {
      const dicasSalvas = localStorage.getItem(`tips_${user.id}_${categoria}`);
      if (dicasSalvas) {
        try {
          const dados = JSON.parse(dicasSalvas);
          const tempoSalvo = new Date(dados.timestamp);
          const agora = new Date();
          
          // Se foi salvo há menos de 1 hora, usar dados salvos
          if ((agora - tempoSalvo) < (60 * 60 * 1000)) {
            setDicaAtual(dados.dica);
            setFatoAtual(dados.fato);
            setUltimaAtualizacao(dados.timestamp);
            return;
          }
        } catch (error) {
          console.error('Erro ao carregar dicas salvas:', error);
        }
      }
    }
    
    // Se não tem dados salvos ou são antigos, atualizar
    atualizarDicas(true);
  }, [user, categoria, atualizarDicas]);

  // Estatísticas das dicas
  const estatisticas = useMemo(() => {
    const todasDicas = Object.values(DICAS_DATABASE).flat();
    return {
      totalDicas: todasDicas.length,
      dicasPorCategoria: Object.keys(DICAS_DATABASE).reduce((acc, cat) => {
        acc[cat] = DICAS_DATABASE[cat].length;
        return acc;
      }, {}),
      totalFatos: CAT_FACTS.length,
      dicasDisponiveis: DICAS_DATABASE[categoria]?.length || 0
    };
  }, [categoria]);

  return {
    // Estado atual
    dicaAtual,
    fatoAtual,
    loading,
    ultimaAtualizacao,
    
    // Ações
    atualizarDicas,
    buscarDicasRelacionadas,
    gerarDicaComIA,
    
    // Dados
    estatisticas,
    categorias: Object.keys(DICAS_DATABASE),
    
    // Computed
    temDica: !!dicaAtual,
    temFato: !!fatoAtual,
    podeAtualizar: !loading
  };
};

export default useSmartTips;
