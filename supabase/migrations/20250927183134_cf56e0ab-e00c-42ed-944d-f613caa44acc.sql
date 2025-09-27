-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'auditor', 'viewer');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  institution_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create institutions table
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  type TEXT NOT NULL DEFAULT 'hospital',
  size TEXT,
  accreditation_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit templates table (created_by can be null initially)
CREATE TABLE public.audit_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sectors table
CREATE TABLE public.sectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.audit_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sector_id UUID NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('yes_no', 'multiple_choice', 'text', 'number', 'photo_evidence')),
  category TEXT NOT NULL,
  indicator TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  options JSONB,
  order_index INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audits table
CREATE TABLE public.audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL REFERENCES public.institutions(id),
  template_id UUID NOT NULL REFERENCES public.audit_templates(id),
  auditor_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved', 'rejected')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  total_score DECIMAL(5,2),
  conformity_percentage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit responses table
CREATE TABLE public.audit_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id),
  answer JSONB NOT NULL,
  observations TEXT,
  photo_urls TEXT[],
  score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (audit_id, question_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_responses ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function for profile management
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), 
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audit_templates_updated_at
  BEFORE UPDATE ON public.audit_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audit_responses_updated_at
  BEFORE UPDATE ON public.audit_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for Profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for User Roles
CREATE POLICY "Users can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Institutions
CREATE POLICY "Authenticated users can view institutions" ON public.institutions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage institutions" ON public.institutions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Audit Templates
CREATE POLICY "Authenticated users can view templates" ON public.audit_templates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage templates" ON public.audit_templates
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Sectors
CREATE POLICY "Authenticated users can view sectors" ON public.sectors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage sectors" ON public.sectors
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Questions
CREATE POLICY "Authenticated users can view questions" ON public.questions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage questions" ON public.questions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Audits
CREATE POLICY "Users can view audits they're involved in" ON public.audits
  FOR SELECT TO authenticated USING (
    auditor_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'viewer')
  );

CREATE POLICY "Auditors can create audits" ON public.audits
  FOR INSERT TO authenticated WITH CHECK (
    auditor_id = auth.uid() AND (
      public.has_role(auth.uid(), 'admin') OR 
      public.has_role(auth.uid(), 'auditor')
    )
  );

CREATE POLICY "Auditors can update their audits" ON public.audits
  FOR UPDATE TO authenticated USING (
    auditor_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for Audit Responses
CREATE POLICY "Users can view responses for audits they can access" ON public.audit_responses
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.audits 
      WHERE id = audit_id AND (
        auditor_id = auth.uid() OR 
        public.has_role(auth.uid(), 'admin') OR
        public.has_role(auth.uid(), 'viewer')
      )
    )
  );

CREATE POLICY "Auditors can manage responses for their audits" ON public.audit_responses
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.audits 
      WHERE id = audit_id AND (
        auditor_id = auth.uid() OR 
        public.has_role(auth.uid(), 'admin')
      )
    )
  );

-- Insert default audit template
INSERT INTO public.audit_templates (name, description) 
VALUES ('Auditoria Hospitalar Padrão', 'Template padrão para auditoria de qualidade hospitalar');

-- Insert default sectors
INSERT INTO public.sectors (template_id, name, description, order_index) 
SELECT 
  id,
  sector_name,
  sector_description,
  sector_order
FROM public.audit_templates,
(VALUES 
  ('Segurança do Paciente', 'Avaliação dos protocolos de segurança do paciente', 1),
  ('Controle de Infecção', 'Práticas de prevenção e controle de infecções hospitalares', 2),
  ('Centro Cirúrgico', 'Procedimentos e protocolos do centro cirúrgico', 3),
  ('Unidade de Terapia Intensiva', 'Protocolos e qualidade do atendimento em UTI', 4),
  ('Farmácia Hospitalar', 'Gestão e dispensação de medicamentos', 5),
  ('Gestão de Resíduos', 'Manejo adequado de resíduos hospitalares', 6),
  ('Recursos Humanos', 'Qualificação e capacitação da equipe', 7),
  ('Infraestrutura', 'Condições físicas e equipamentos', 8)
) AS sectors(sector_name, sector_description, sector_order)
WHERE name = 'Auditoria Hospitalar Padrão';