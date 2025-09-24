import { useState } from "react";
import Header from "@/components/Header";
import SectorCard from "@/components/SectorCard";
import StatsOverview from "@/components/StatsOverview";
import AuditForm from "@/components/AuditForm";
import AuditReport from "@/components/AuditReport";
import RecentAudits from "@/components/RecentAudits";
import InstitutionForm from "@/components/InstitutionForm";
import { hospitalSectors } from "@/data/sectors";
import { AuditResult } from "@/types/audit";
import { 
  Heart, 
  Scissors, 
  Truck, 
  Bed, 
  Pill, 
  Microscope, 
  Zap, 
  Users,
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
    <Heart className="w-6 h-6" />,
    <Scissors className="w-6 h-6" />,
    <Truck className="w-6 h-6" />,
    <Bed className="w-6 h-6" />,
    <Pill className="w-6 h-6" />,
    <Microscope className="w-6 h-6" />,
    <Zap className="w-6 h-6" />,
    <Users className="w-6 h-6" />
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
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-primary via-medical-secondary to-medical-accent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight animate-fade-in">
              Sistema RAG
              <span className="block text-xl sm:text-3xl md:text-4xl lg:text-6xl bg-gradient-to-r from-white to-medical-light bg-clip-text text-transparent font-semibold mt-2">
                Requisitos de Apoio a Gestão
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed px-2 sm:px-4 animate-fade-in">
              Metodologia de auditoria interna do <strong className="text-white">Instituto de Cooperação para o Desenvolvimento da Saúde (ICDS)</strong>
            </p>
            <p className="text-xs sm:text-base md:text-lg text-white/80 leading-relaxed px-2 sm:px-4 max-w-3xl mx-auto animate-fade-in">
              Realize auditorias estruturadas e gere relatórios profissionais para garantir a qualidade e conformidade das unidades hospitalares
            </p>
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
              Setores Hospitalares
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
    </div>
  );
};

export default Index;