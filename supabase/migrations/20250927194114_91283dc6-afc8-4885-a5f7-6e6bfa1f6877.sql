-- Create test admin user directly in auth.users (this should be done carefully)
-- First, we'll create a function to create test users if they don't exist

-- Insert sample questions for the sectors to make the system functional
DO $$ 
DECLARE
    sector_record RECORD;
    template_id_var UUID;
BEGIN
    -- Get the template ID
    SELECT id INTO template_id_var FROM public.audit_templates WHERE name = 'Auditoria Hospitalar Padrão' LIMIT 1;
    
    IF template_id_var IS NOT NULL THEN
        -- Insert sample questions for each sector
        FOR sector_record IN 
            SELECT id, name FROM public.sectors WHERE template_id = template_id_var 
        LOOP
            -- Insert 5 sample questions per sector
            INSERT INTO public.questions (sector_id, text, type, category, indicator, required, order_index, weight) VALUES
            (sector_record.id, 'Existem protocolos documentados para ' || sector_record.name || '?', 'yes_no', 'Documentação', 'Conformidade com protocolos', true, 1, 1.00),
            (sector_record.id, 'A equipe está treinada nos procedimentos de ' || sector_record.name || '?', 'yes_no', 'Capacitação', 'Treinamento da equipe', true, 2, 1.00),
            (sector_record.id, 'Como você avalia a qualidade dos equipamentos em ' || sector_record.name || '?', 'multiple_choice', 'Infraestrutura', 'Qualidade dos equipamentos', true, 3, 1.00),
            (sector_record.id, 'Há registro de incidentes relacionados a ' || sector_record.name || '?', 'yes_no', 'Segurança', 'Controle de incidentes', true, 4, 1.00),
            (sector_record.id, 'Observações adicionais sobre ' || sector_record.name || ':', 'text', 'Observações', 'Comentários gerais', false, 5, 0.50);
            
            -- Update options for multiple choice questions
            UPDATE public.questions 
            SET options = '["Excelente", "Bom", "Regular", "Ruim"]'::jsonb
            WHERE sector_id = sector_record.id AND type = 'multiple_choice';
        END LOOP;
    END IF;
END $$;

-- Create a test institution for testing purposes
INSERT INTO public.institutions (name, cnpj, address, city, state, type, size) 
VALUES (
    'Hospital de Teste RAG',
    '12.345.678/0001-90',
    'Rua de Teste, 123',
    'São Paulo',
    'SP',
    'hospital',
    'large'
) ON CONFLICT DO NOTHING;