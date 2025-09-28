-- Criar tipo enum para status de conta
CREATE TYPE account_status_enum AS ENUM ('pending', 'approved', 'rejected');

-- Adicionar status de aprovação para profiles
ALTER TABLE public.profiles 
ADD COLUMN account_status account_status_enum NOT NULL DEFAULT 'pending'::account_status_enum;

-- Adicionar campos para histórico de aprovação
ALTER TABLE public.profiles 
ADD COLUMN approved_by uuid,
ADD COLUMN approved_at timestamp with time zone,
ADD COLUMN rejection_reason text;

-- Criar índice para consultas de status
CREATE INDEX idx_profiles_account_status ON public.profiles(account_status);

-- Atualizar a política RLS para permitir que admins vejam contas pendentes
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Nova política para permitir que usuários aprovados façam login
CREATE POLICY "Users can view their approved profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND account_status = 'approved'::account_status_enum);

-- Política para atualizar perfil (permite que admins atualizem status)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Função para aprovar usuário
CREATE OR REPLACE FUNCTION public.approve_user_account(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  UPDATE public.profiles 
  SET 
    account_status = 'approved'::account_status_enum,
    approved_by = auth.uid(),
    approved_at = now()
  WHERE user_id = _user_id
    AND has_role(auth.uid(), 'admin'::app_role);
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

-- Função para rejeitar usuário
CREATE OR REPLACE FUNCTION public.reject_user_account(_user_id uuid, _reason text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  UPDATE public.profiles 
  SET 
    account_status = 'rejected'::account_status_enum,
    approved_by = auth.uid(),
    approved_at = now(),
    rejection_reason = _reason
  WHERE user_id = _user_id
    AND has_role(auth.uid(), 'admin'::app_role);
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;