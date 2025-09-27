import { useState } from "react";
import Header from "@/components/Header";
import SectorCard from "@/components/SectorCard";
import StatsOverview from "@/components/StatsOverview";
import AuditForm from "@/components/AuditForm";
import AuditReport from "@/components/AuditReport";
import RecentAudits from "@/components/RecentAudits";
import InstitutionForm from "@/components/InstitutionForm";
import Footer from "@/components/Footer";
import { hospitalSectors } from "@/data/realistic-sectors";
import { AuditResult } from "@/types/audit";
import { 
  Shield, 
  Microscope, 
  Pill, 
  Truck, 
  Scissors, 
  Heart, 
  Trash2, 
  Award,
  FileText 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/rag-hero.jpg";

type AppState = 'dashboard' | 'audit' | 'report';

interface InstitutionData {
  name: string;
  registrationNumber: string;
  auditDate: Date | undefined;
  auditors: string[];
  selectedSectors: number[];
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [currentSector, setCurrentSector] = useState<number | null>(null);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [currentAuditResult, setCurrentAuditResult] = useState<AuditResult | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<number[]>(
    hospitalSectors.map(sector => sector.id)
  );
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    name: '',
    registrationNumber: '',
    auditDate: undefined,
    auditors: [],
    selectedSectors: hospitalSectors.map(sector => sector.id),
  });
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);

  const sectorIcons = [
    <Shield className="w-6 h-6" />,      // Segurança do Paciente
    <Microscope className="w-6 h-6" />,  // Controle de Infecção
    <Pill className="w-6 h-6" />,        // Gestão de Medicamentos  
    <Truck className="w-6 h-6" />,       // Emergência
    <Scissors className="w-6 h-6" />,    // Centro Cirúrgico
    <Heart className="w-6 h-6" />,       // UTI
    <Trash2 className="w-6 h-6" />,      // Gestão de Resíduos
    <Award className="w-6 h-6" />        // Gestão da Qualidade
  ];

  const handleSectorToggle = (sectorId: number) => {
    setSelectedSectors(prev => 
      prev.includes(sectorId) 
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  // Filter sectors based on selection and create sectors with icons and status
  const filteredSectors = hospitalSectors.filter(sector => 
    selectedSectors.includes(sector.id)
  );
  
  const sectorsWithStatus = filteredSectors.map((sector, index) => {
    const existingResult = auditResults.find(r => r.sectorId === sector.id);
    let status: 'pending' | 'in-progress' | 'completed' = 'pending';
    let completedQuestions = 0;

    if (existingResult) {
      status = 'completed';
      completedQuestions = sector.questions.length;
    }

    return {
      id: sector.id,
      title: sector.name,
      description: sector.description,
      icon: sectorIcons[index] || <FileText className="w-6 h-6" />,
      totalRequirements: sector.questions.length,
      completedRequirements: completedQuestions,
      status
    };
  });

  const handleStartAudit = (sectorId: number) => {
    setCurrentSector(sectorId);
    setAppState('audit');
  };

  const handleAuditComplete = (result: any) => {
    const sector = hospitalSectors.find(s => s.id === currentSector);
    if (!sector) return;

    // Calculate score and conformity
    const totalQuestions = sector.questions.length;
    let conformQuestions = 0;
    
    sector.questions.forEach(question => {
      const answer = result.answers[question.id];
      if (question.type === 'yes_no' && answer === 'sim') conformQuestions++;
      else if (question.type === 'multiple_choice' && ['Excelente', 'Bom', 'Muito Bom (< 15min)'].includes(answer)) conformQuestions++;
      else if (answer && answer !== '') conformQuestions++;
    });

    const conformityPercentage = (conformQuestions / totalQuestions) * 100;
    const score = Math.round(conformityPercentage * 10);

    const auditResult: AuditResult = {
      sectorId: sector.id,
      sectorName: sector.name,
      completedAt: new Date(),
      answers: result.answers,
      photos: result.photos,
      observations: result.observations,
      score,
      conformityPercentage
    };

    setAuditResults(prev => [...prev.filter(r => r.sectorId !== sector.id), auditResult]);
    setCurrentAuditResult(auditResult);
    setAppState('report');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    setCurrentSector(null);
    setCurrentAuditResult(null);
  };

  // Calculate stats
  const totalSectors = filteredSectors.length;
  const completedSectors = sectorsWithStatus.filter(s => s.status === "completed").length;
  const inProgressSectors = 0; // No in-progress status in current implementation
  const pendingSectors = sectorsWithStatus.filter(s => s.status === "pending").length;
  
  const totalRequirements = sectorsWithStatus.reduce((acc, s) => acc + s.totalRequirements, 0);
  const completedRequirements = sectorsWithStatus.reduce((acc, s) => acc + s.completedRequirements, 0);
  const overallProgress = (completedRequirements / totalRequirements) * 100;

  // Render based on app state
  if (appState === 'audit' && currentSector) {
    const sector = hospitalSectors.find(s => s.id === currentSector);
    if (!sector) return null;

    return (
      <AuditForm
        sectorName={sector.name}
        questions={sector.questions}
        onComplete={handleAuditComplete}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (appState === 'report' && currentAuditResult) {
    return (
      <AuditReport
        auditResult={currentAuditResult}
        onNewAudit={handleBackToDashboard}
      />
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Clean medical gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-primary to-medical-secondary"></div>
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 sm:space-y-10 max-w-5xl mx-auto">
            {/* Main RAG Title with enhanced styling */}
            <div className="space-y-6">
              <div className="relative inline-block">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">
                  RAG
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-medical-accent/20 to-medical-primary/20 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
              </div>
              
              {/* Direct subtitle with RAG meaning */}
              <div className="space-y-3">
                <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white/95 font-bold leading-tight">
                  Requisitos de Apoio à Gestão
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-medical-accent to-white mx-auto rounded-full"></div>
              </div>
            </div>
            
            {/* Enhanced description with better visual hierarchy */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed font-medium">
                  Metodologia de auditoria interna do 
                  <span className="block mt-2 text-white font-bold bg-gradient-to-r from-medical-accent to-white bg-clip-text text-transparent">
                    Instituto de Cooperação para o Desenvolvimento da Saúde (ICDS)
                  </span>
                </p>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto">
                Realize auditorias estruturadas e gere relatórios profissionais para garantir a qualidade e conformidade das unidades hospitalares
              </p>
            </div>

            {/* Enhanced call-to-action with floating animation */}
            <div className="pt-4 sm:pt-6">
              <div className="inline-flex items-center space-x-4 bg-white/15 backdrop-blur-md rounded-full px-6 py-3 border border-white/30 animate-bounce">
                <div className="w-3 h-3 bg-medical-accent rounded-full animate-pulse"></div>
                <span className="text-white/90 font-medium text-sm sm:text-base">Sistema Profissional de Auditoria</span>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 space-y-12">
        {/* Start New Audit Section */}
        {!showInstitutionForm && (
          <section className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
            <Card className="max-w-xl sm:max-w-2xl mx-auto shadow-elegant border-0 bg-gradient-to-br from-card via-card/95 to-background backdrop-blur-sm">
              <CardContent className="p-8 sm:p-12">
                <div className="space-y-6 sm:space-y-8">
                  <div className="relative">
                    <div className="p-4 sm:p-6 bg-gradient-medical rounded-2xl w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center shadow-glow animate-pulse">
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                      Pronto para começar?
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed px-2 sm:px-4">
                      Configure os dados da instituição e inicie uma nova auditoria hospitalar completa
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowInstitutionForm(true)}
                    variant="medical"
                    size="lg"
                    className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 h-12 sm:h-14 shadow-glow hover:shadow-elegant transform hover:scale-105 transition-all duration-300 w-full sm:w-auto animate-fade-in"
                  >
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Iniciar Nova Auditoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Institution Form */}
        {showInstitutionForm && (
          <InstitutionForm 
            onDataChange={setInstitutionData}
            selectedSectors={selectedSectors}
            onSectorToggle={handleSectorToggle}
          />
        )}

        {/* Stats Overview */}
        {showInstitutionForm && (
          <StatsOverview
            totalSectors={totalSectors}
            completedSectors={completedSectors}
            inProgressSectors={inProgressSectors}
            pendingSectors={pendingSectors}
            overallProgress={overallProgress}
          />
        )}

        {/* Sectors Grid */}
        {showInstitutionForm && selectedSectors.length > 0 && (
          <section className="px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-foreground animate-fade-in">
              Módulos Hospitalares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {sectorsWithStatus.map((sector, index) => (
                <div 
                  key={sector.id} 
                  className="animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SectorCard
                    title={sector.title}
                    description={sector.description}
                    icon={sector.icon}
                    totalRequirements={sector.totalRequirements}
                    completedRequirements={sector.completedRequirements}
                    status={sector.status}
                    onStartAudit={() => handleStartAudit(sector.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Audits */}
        {showInstitutionForm && auditResults.length > 0 && (
          <section className="px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-foreground animate-fade-in">
              Histórico de Auditorias
            </h2>
            <div className="animate-fade-in">
              <RecentAudits 
                auditResults={auditResults} 
                onViewReport={(result) => {setCurrentAuditResult(result); setAppState('report');}} 
              />
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;