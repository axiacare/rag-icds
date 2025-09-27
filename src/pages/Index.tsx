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
      
      {/* Hero Section - Enhanced with better performance and mobile optimization */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 overflow-hidden">
        {/* Optimized gradient background with better performance */}
        <div className="absolute inset-0 bg-gradient-hero will-change-transform"></div>
        
        {/* Enhanced overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-sm"></div>
        
        {/* Optimized decorative elements with reduced complexity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-5 sm:top-20 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 left-5 sm:bottom-20 sm:left-10 w-32 h-32 sm:w-40 sm:h-40 bg-medical-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 md:space-y-10 max-w-6xl mx-auto">
            {/* Enhanced RAG Title with better typography and mobile optimization */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative inline-block animate-fade-in">
                <h1 className="mobile-title sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-playfair font-bold leading-none tracking-tight rag-title rag-glow will-change-transform backface-hidden">
                  RAG
                </h1>
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-medical-accent/30 to-medical-primary/30 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
              </div>
              
              {/* Enhanced subtitle with better mobile typography */}
              <div className="space-y-2 sm:space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <p className="mobile-subtitle sm:text-3xl md:text-4xl lg:text-5xl text-white/98 font-inter font-bold leading-tight">
                  Requisitos de Apoio à Gestão
                </p>
                <div className="w-16 sm:w-24 md:w-32 h-1 bg-gradient-to-r from-medical-accent to-white mx-auto rounded-full animate-scale-in" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
            
            {/* Enhanced description with better visual hierarchy and loading optimization */}
            <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto animate-slide-in-left" style={{ animationDelay: '0.9s' }}>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/30 shadow-elegant hover-glow transition-all duration-300">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/98 leading-relaxed font-inter font-medium">
                  Metodologia de auditoria interna do 
                  <span className="block mt-1 sm:mt-2 text-white font-bold">
                    Instituto de Cooperação para o Desenvolvimento da Saúde (ICDS)
                  </span>
                </p>
              </div>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto font-inter">
                Realize auditorias estruturadas e gere relatórios profissionais para garantir a qualidade e conformidade das unidades hospitalares
              </p>
            </div>

            {/* Enhanced call-to-action with better mobile interaction */}
            <div className="pt-2 sm:pt-4 lg:pt-6 animate-scale-in" style={{ animationDelay: '1.2s' }}>
              <div className="inline-flex items-center space-x-3 sm:space-x-4 bg-white/20 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/40 shadow-soft hover:bg-white/25 transition-all duration-300 touch-target">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-medical-accent rounded-full animate-pulse"></div>
                <span className="text-white/95 font-inter font-medium text-xs sm:text-sm md:text-base">Sistema Profissional de Auditoria</span>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 pb-12 sm:pb-16 space-y-8 sm:space-y-12">
        {/* Enhanced Start New Audit Section with better mobile optimization */}
        {!showInstitutionForm && (
          <section className="text-center py-8 sm:py-12 lg:py-16 xl:py-20">
            <Card className="max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto shadow-elegant border-0 bg-gradient-to-br from-card/95 via-card to-background/95 backdrop-blur-sm hover-scale hover-glow transition-all duration-300">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="relative animate-scale-in">
                    <div className="p-3 sm:p-4 lg:p-6 bg-gradient-medical rounded-2xl w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto flex items-center justify-center shadow-glow animate-float">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-accent rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight font-inter">
                      Pronto para começar?
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed px-1 sm:px-2 lg:px-4 font-inter">
                      Configure os dados da instituição e inicie uma nova auditoria hospitalar completa
                    </p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <Button
                      onClick={() => setShowInstitutionForm(true)}
                      variant="medical"
                      size="lg"
                      className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 h-10 sm:h-12 lg:h-14 shadow-glow hover:shadow-elegant transform hover:scale-105 transition-all duration-300 w-full sm:w-auto font-inter font-medium touch-target"
                    >
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                      Iniciar Nova Auditoria
                    </Button>
                  </div>
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

        {/* Enhanced Sectors Grid with better mobile layout */}
        {showInstitutionForm && selectedSectors.length > 0 && (
          <section className="animate-fade-in">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-foreground font-inter animate-slide-in-left">
              Módulos Hospitalares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {sectorsWithStatus.map((sector, index) => (
                <div 
                  key={sector.id} 
                  className="animate-fade-in-up hover-scale will-change-transform"
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

        {/* Enhanced Recent Audits with better mobile layout */}
        {showInstitutionForm && auditResults.length > 0 && (
          <section className="animate-fade-in">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-foreground font-inter animate-slide-in-left">
              Histórico de Auditorias
            </h2>
            <div className="animate-fade-in-up">
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