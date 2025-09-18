-- 🐱 CatButler - Criação da Tabela Tasks
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- 1. Criar tabela tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL DEFAULT 'Outros',
  prioridade TEXT NOT NULL DEFAULT 'Média' CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em Andamento', 'Concluída')),
  data_criacao TIMESTAMPTZ DEFAULT NOW(),
  data_vencimento DATE,
  data_conclusao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_categoria ON public.tasks(categoria);
CREATE INDEX IF NOT EXISTS idx_tasks_prioridade ON public.tasks(prioridade);
CREATE INDEX IF NOT EXISTS idx_tasks_data_vencimento ON public.tasks(data_vencimento);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso
-- Usuários podem ver apenas suas próprias tarefas
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks" 
ON public.tasks FOR SELECT 
USING (auth.uid() = user_id);

-- Usuários podem inserir apenas suas próprias tarefas
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks" 
ON public.tasks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas suas próprias tarefas
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = user_id);

-- Usuários podem deletar apenas suas próprias tarefas
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks" 
ON public.tasks FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION handle_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Se o status mudou para "Concluída", definir data_conclusao
  IF NEW.status = 'Concluída' AND OLD.status != 'Concluída' THEN
    NEW.data_conclusao = NOW();
  ELSIF NEW.status != 'Concluída' AND OLD.status = 'Concluída' THEN
    NEW.data_conclusao = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para updated_at e data_conclusao
DROP TRIGGER IF EXISTS tasks_updated_at ON public.tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_tasks_updated_at();

-- 7. Criar função para estatísticas de tarefas
CREATE OR REPLACE FUNCTION get_tasks_stats(user_uuid UUID)
RETURNS TABLE (
  total_tasks BIGINT,
  pending_tasks BIGINT,
  in_progress_tasks BIGINT,
  completed_tasks BIGINT,
  overdue_tasks BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_tasks,
    COUNT(*) FILTER (WHERE status = 'Pendente') as pending_tasks,
    COUNT(*) FILTER (WHERE status = 'Em Andamento') as in_progress_tasks,
    COUNT(*) FILTER (WHERE status = 'Concluída') as completed_tasks,
    COUNT(*) FILTER (WHERE status != 'Concluída' AND data_vencimento < CURRENT_DATE) as overdue_tasks
  FROM public.tasks 
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Inserir tarefas exemplo para usuários existentes (opcional - remover se não quiser dados de exemplo)
/*
INSERT INTO public.tasks (user_id, titulo, descricao, categoria, prioridade, status, data_vencimento)
SELECT 
  id,
  'Limpar a cozinha',
  'Lavar louça, limpar bancada e organizar geladeira',
  'Faxina',
  'Alta',
  'Pendente',
  CURRENT_DATE + INTERVAL '1 day'
FROM auth.users 
WHERE id IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;
*/

-- ✅ Tabela tasks criada com sucesso!
-- Funcionalidades implementadas:
-- - CRUD completo com RLS
-- - Auto-atualização de timestamps
-- - Auto-definição de data_conclusao
-- - Índices para performance
-- - Função de estatísticas
-- - Constraints para valores válidos