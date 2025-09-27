-- Confirmar email do usuário de teste
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'admin@teste.com';