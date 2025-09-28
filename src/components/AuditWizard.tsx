import { useState } from "react";
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
  Users, 
  Settings, 
  CheckCircle,
  X
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { hospitalSectors } from "@/data/realistic-sectors";

type WizardStep = 'institution' | 'audit' | 'customize' | 'overview';

interface InstitutionData {
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

interface AuditData {
  startDate: Date | undefined;
  endDate: Date | undefined;
  auditors: string[];
  title: string;
  description: string;
}

interface AuditWizardProps {
  onComplete: (data: { institution: InstitutionData; audit: AuditData; selectedSectors: number[] }) => void;
  onCancel: () => void;
}

const AuditWizard = ({ onComplete, onCancel }: AuditWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('institution');
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    name: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: ''
  });
  const [auditData, setAuditData] = useState<AuditData>({
    startDate: undefined,
    endDate: undefined,
    auditors: [],
    title: '',
    description: ''
  });
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [newAuditor, setNewAuditor] = useState('');

  const availableAuditors = [
    "Fernando Paragó",
    "Sandra Miziara", 
    "Letícia Teles",
    "Guilherme Thomé"
  ];

  const steps = [
    { id: 'institution', label: 'Instituição', icon: Building2 },
    { id: 'audit', label: 'Auditoria', icon: CalendarIcon },
    { id: 'customize', label: 'Customização', icon: Settings },
    { id: 'overview', label: 'Visão Geral', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: WizardStep[] = ['institution', 'audit', 'customize', 'overview'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: WizardStep[] = ['institution', 'audit', 'customize', 'overview'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleAddAuditor = () => {
    if (newAuditor.trim() && !auditData.auditors.includes(newAuditor.trim())) {
      setAuditData({
        ...auditData,
        auditors: [...auditData.auditors, newAuditor.trim()]
      });
      setNewAuditor('');
    }
  };

  const handleRemoveAuditor = (auditor: string) => {
    setAuditData({
      ...auditData,
      auditors: auditData.auditors.filter(a => a !== auditor)
    });
  };

  const handleSectorToggle = (sectorId: number) => {
    setSelectedSectors(prev => 
      prev.includes(sectorId)
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const handleComplete = () => {
    onComplete({
      institution: institutionData,
      audit: auditData,
      selectedSectors
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'institution':
        return institutionData.name && institutionData.cnpj;
      case 'audit':
        return auditData.title && auditData.startDate && auditData.auditors.length > 0;
      case 'customize':
        return selectedSectors.length > 0;
      case 'overview':
        return true;
      default:
        return false;
    }
  };

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
                    Dados da Instituição
                  </h2>
                  <p className="text-muted-foreground">
                    Informe os dados da unidade hospitalar que será auditada
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nome da Instituição *</Label>
                    <Input
                      id="name"
                      value={institutionData.name}
                      onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
                      placeholder="Digite o nome da instituição"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={institutionData.cnpj}
                      onChange={(e) => setInstitutionData({ ...institutionData, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={institutionData.phone}
                      onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                      placeholder="(11) 9999-9999"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={institutionData.address}
                      onChange={(e) => setInstitutionData({ ...institutionData, address: e.target.value })}
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={institutionData.city}
                      onChange={(e) => setInstitutionData({ ...institutionData, city: e.target.value })}
                      placeholder="Nome da cidade"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={institutionData.state}
                      onChange={(e) => setInstitutionData({ ...institutionData, state: e.target.value })}
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Audit Data */}
            {currentStep === 'audit' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CalendarIcon className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Dados da Auditoria
                  </h2>
                  <p className="text-muted-foreground">
                    Configure as informações básicas da auditoria
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Título da Auditoria *</Label>
                    <Input
                      id="title"
                      value={auditData.title}
                      onChange={(e) => setAuditData({ ...auditData, title: e.target.value })}
                      placeholder="Ex: Auditoria RAG - Janeiro 2025"
                    />
                  </div>

                  <div>
                    <Label>Data de Início *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !auditData.startDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {auditData.startDate ? (
                            format(auditData.startDate, "PPP", { locale: ptBR })
                          ) : (
                            "Selecione a data"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={auditData.startDate}
                          onSelect={(date) => setAuditData({ ...auditData, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Data de Término</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !auditData.endDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {auditData.endDate ? (
                            format(auditData.endDate, "PPP", { locale: ptBR })
                          ) : (
                            "Selecione a data"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={auditData.endDate}
                          onSelect={(date) => setAuditData({ ...auditData, endDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Auditores *</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={newAuditor}
                          onChange={(e) => setNewAuditor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                        >
                          <option value="">Selecione um auditor</option>
                          {availableAuditors
                            .filter(auditor => !auditData.auditors.includes(auditor))
                            .map(auditor => (
                              <option key={auditor} value={auditor}>{auditor}</option>
                            ))}
                        </select>
                        <Button 
                          type="button" 
                          onClick={handleAddAuditor}
                          disabled={!newAuditor}
                        >
                          Adicionar
                        </Button>
                      </div>
                      
                      {auditData.auditors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {auditData.auditors.map(auditor => (
                            <Badge key={auditor} variant="secondary" className="flex items-center gap-2">
                              {auditor}
                              <X 
                                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                onClick={() => handleRemoveAuditor(auditor)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={auditData.description}
                      onChange={(e) => setAuditData({ ...auditData, description: e.target.value })}
                      placeholder="Descrição opcional da auditoria..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Customize */}
            {currentStep === 'customize' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Settings className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Customização da Auditoria
                  </h2>
                  <p className="text-muted-foreground">
                    Selecione os módulos que serão incluídos na auditoria
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospitalSectors.map(sector => (
                    <Card 
                      key={sector.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedSectors.includes(sector.id) 
                          ? 'border-medical-primary bg-medical-primary/5' 
                          : 'hover:border-medical-primary/50'
                      }`}
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
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {sector.description}
                            </p>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {sector.questions.length} requisitos
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {selectedSectors.length} módulo(s) selecionado(s) • {
                      selectedSectors.reduce((acc, id) => {
                        const sector = hospitalSectors.find(s => s.id === id);
                        return acc + (sector?.questions.length || 0);
                      }, 0)
                    } requisitos total
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Overview */}
            {currentStep === 'overview' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CheckCircle className="w-12 h-12 text-medical-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Visão Geral da Auditoria
                  </h2>
                  <p className="text-muted-foreground">
                    Revise as informações antes de iniciar a auditoria
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Institution Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Instituição
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Nome:</strong> {institutionData.name}</p>
                      <p><strong>CNPJ:</strong> {institutionData.cnpj}</p>
                      {institutionData.city && (
                        <p><strong>Cidade:</strong> {institutionData.city}, {institutionData.state}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Audit Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Auditoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Título:</strong> {auditData.title}</p>
                      {auditData.startDate && (
                        <p><strong>Início:</strong> {format(auditData.startDate, "PPP", { locale: ptBR })}</p>
                      )}
                      <p><strong>Auditores:</strong> {auditData.auditors.join(', ')}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Modules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Módulos Selecionados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedSectors.map(sectorId => {
                        const sector = hospitalSectors.find(s => s.id === sectorId);
                        return sector && (
                          <div key={sectorId} className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-medical-success" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{sector.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {sector.questions.length} requisitos
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
            className="flex items-center gap-2"
          >
            {currentStepIndex === 0 ? (
              <>
                <X className="w-4 h-4" />
                Cancelar
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </>
            )}
          </Button>

          <Button 
            onClick={currentStep === 'overview' ? handleComplete : handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            {currentStep === 'overview' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Iniciar Auditoria
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditWizard;