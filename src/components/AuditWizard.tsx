import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowRight, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Building2, 
  Settings, 
  CheckCircle,
  FileText,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type WizardStep = 'institution' | 'template' | 'sectors' | 'overview';

interface Institution {
  id: string;
  name: string;
  cnpj: string | null;
  city: string | null;
  state: string | null;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  version: string;
}

interface Sector {
  id: string;
  name: string;
  description: string | null;
  template_id: string;
  order_index: number;
}

interface AuditWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const AuditWizard = ({ onComplete, onCancel }: AuditWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('institution');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Load institutions
  useEffect(() => {
    loadInstitutions();
  }, []);

  // Load templates
  useEffect(() => {
    if (currentStep === 'template') {
      loadTemplates();
    }
  }, [currentStep]);

  // Load sectors when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      loadSectors(selectedTemplate);
    }
  }, [selectedTemplate]);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name, cnpj, city, state')
        .order('name');
      
      if (error) throw error;
      setInstitutions(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar instituições",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_templates')
        .select('id, name, description, version')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar templates",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async (templateId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name, description, template_id, order_index')
        .eq('template_id', templateId)
        .order('order_index');
      
      if (error) throw error;
      setSectors(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar setores",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'institution', label: 'Instituição', icon: Building2 },
    { id: 'template', label: 'Template', icon: FileText },
    { id: 'sectors', label: 'Setores', icon: Settings },
    { id: 'overview', label: 'Revisão', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: WizardStep[] = ['institution', 'template', 'sectors', 'overview'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: WizardStep[] = ['institution', 'template', 'sectors', 'overview'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSectorToggle = (sectorId: string) => {
    setSelectedSectors(prev => 
      prev.includes(sectorId)
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('audits')
        .insert({
          institution_id: selectedInstitution,
          template_id: selectedTemplate,
          auditor_id: user.id,
          title,
          description,
          start_date: startDate?.toISOString(),
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Auditoria criada com sucesso!",
        description: "Você pode começar a responder as questões."
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Erro ao criar auditoria",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'institution':
        return selectedInstitution !== "";
      case 'template':
        return selectedTemplate !== "" && title !== "";
      case 'sectors':
        return selectedSectors.length > 0;
      case 'overview':
        return true;
      default:
        return false;
    }
  };

  const selectedInstitutionData = institutions.find(i => i.id === selectedInstitution);
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Assistente de Nova Auditoria
          </h1>
          <p className="text-muted-foreground">
            Configure sua auditoria em {steps.length} etapas simples
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index <= currentStepIndex 
                    ? 'bg-medical-primary border-medical-primary text-white' 
                    : 'border-muted bg-background text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStepIndex ? 'text-medical-primary' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStepIndex ? 'bg-medical-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-center mt-2">
            <span className="text-sm text-muted-foreground">
              Passo {currentStepIndex + 1} de {steps.length}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Step 1: Institution */}
            {currentStep === 'institution' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Building2 className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Selecione a Instituição
                  </h2>
                  <p className="text-muted-foreground">
                    Escolha a unidade hospitalar que será auditada
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-medical-primary" />
                  </div>
                ) : institutions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Nenhuma instituição cadastrada
                    </p>
                    <Button onClick={onCancel}>
                      Voltar
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {institutions.map((institution) => (
                      <Card
                        key={institution.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:border-medical-primary",
                          selectedInstitution === institution.id && "border-medical-primary bg-medical-primary/5"
                        )}
                        onClick={() => setSelectedInstitution(institution.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={selectedInstitution === institution.id}
                              onChange={() => setSelectedInstitution(institution.id)}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{institution.name}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {institution.cnpj && <span>CNPJ: {institution.cnpj}</span>}
                                {institution.city && <span>{institution.city}/{institution.state}</span>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Template */}
            {currentStep === 'template' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <FileText className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Selecione o Template
                  </h2>
                  <p className="text-muted-foreground">
                    Escolha o modelo de auditoria a ser aplicado
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-medical-primary" />
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Nenhum template cadastrado
                    </p>
                    <Button onClick={onCancel}>
                      Voltar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className={cn(
                            "cursor-pointer transition-colors hover:border-medical-primary",
                            selectedTemplate === template.id && "border-medical-primary bg-medical-primary/5"
                          )}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={selectedTemplate === template.id}
                                onChange={() => setSelectedTemplate(template.id)}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{template.name}</h3>
                                  <Badge variant="secondary">{template.version}</Badge>
                                </div>
                                {template.description && (
                                  <p className="text-sm text-muted-foreground">{template.description}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="audit-title">Título da Auditoria *</Label>
                        <Input
                          id="audit-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Ex: Auditoria RAG - Janeiro 2025"
                        />
                      </div>

                      <div>
                        <Label htmlFor="audit-description">Descrição</Label>
                        <Textarea
                          id="audit-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Descrição opcional da auditoria..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label>Data de Início</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? (
                                format(startDate, "PPP", { locale: ptBR })
                              ) : (
                                "Selecione a data"
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => setStartDate(date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Sectors */}
            {currentStep === 'sectors' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Settings className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Selecione os Setores
                  </h2>
                  <p className="text-muted-foreground">
                    Escolha os setores que farão parte desta auditoria
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-medical-primary" />
                  </div>
                ) : sectors.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Nenhum setor encontrado neste template
                    </p>
                    <Button onClick={handlePrevious}>
                      Voltar
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectors.map(sector => (
                      <Card 
                        key={sector.id} 
                        className={cn(
                          "cursor-pointer transition-colors hover:border-medical-primary",
                          selectedSectors.includes(sector.id) && "border-medical-primary bg-medical-primary/5"
                        )}
                        onClick={() => handleSectorToggle(sector.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox 
                              checked={selectedSectors.includes(sector.id)}
                              onChange={() => handleSectorToggle(sector.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-2">{sector.name}</h3>
                              {sector.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {sector.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Overview */}
            {currentStep === 'overview' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CheckCircle className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Revisão Final
                  </h2>
                  <p className="text-muted-foreground">
                    Confira os dados antes de criar a auditoria
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Instituição</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="font-medium text-muted-foreground">Nome</dt>
                          <dd className="text-foreground">{selectedInstitutionData?.name}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-muted-foreground">CNPJ</dt>
                          <dd className="text-foreground">{selectedInstitutionData?.cnpj || 'N/A'}</dd>
                        </div>
                        {selectedInstitutionData?.city && (
                          <div>
                            <dt className="font-medium text-muted-foreground">Cidade</dt>
                            <dd className="text-foreground">{selectedInstitutionData.city}/{selectedInstitutionData.state}</dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Template e Auditoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="font-medium text-muted-foreground">Template</dt>
                          <dd className="text-foreground">{selectedTemplateData?.name}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-muted-foreground">Versão</dt>
                          <dd className="text-foreground">{selectedTemplateData?.version}</dd>
                        </div>
                        <div className="md:col-span-2">
                          <dt className="font-medium text-muted-foreground">Título</dt>
                          <dd className="text-foreground">{title}</dd>
                        </div>
                        {description && (
                          <div className="md:col-span-2">
                            <dt className="font-medium text-muted-foreground">Descrição</dt>
                            <dd className="text-foreground">{description}</dd>
                          </div>
                        )}
                        {startDate && (
                          <div>
                            <dt className="font-medium text-muted-foreground">Data de Início</dt>
                            <dd className="text-foreground">{format(startDate, "PPP", { locale: ptBR })}</dd>
                          </div>
                        )}
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Setores Selecionados ({selectedSectors.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sectors
                          .filter(s => selectedSectors.includes(s.id))
                          .map(sector => (
                            <Badge key={sector.id} variant="secondary" className="justify-start">
                              {sector.name}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button
            variant="outline"
            onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStepIndex === 0 ? 'Cancelar' : 'Anterior'}
          </Button>
          
          <div className="flex-1" />
          
          <Button
            onClick={currentStep === 'overview' ? handleSubmit : handleNext}
            disabled={!canProceed() || submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                {currentStep === 'overview' ? 'Criar Auditoria' : 'Próximo'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditWizard;
