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
      totalQuestions: sector.questions.length,
      completedQuestions,
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
  
  const totalQuestions = sectorsWithStatus.reduce((acc, s) => acc + s.totalQuestions, 0);
  const completedQuestions = sectorsWithStatus.reduce((acc, s) => acc + s.completedQuestions, 0);
  const overallProgress = (completedQuestions / totalQuestions) * 100;

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
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="Sistema RAG - Auditoria Hospitalar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Sistema RAG de Auditoria Hospitalar
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Realize auditorias estruturadas e gere relatórios profissionais para garantir a qualidade e conformidade das unidades hospitalares
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12 space-y-8">
        {/* Institution Form */}
        <InstitutionForm 
          onDataChange={setInstitutionData}
          selectedSectors={selectedSectors}
          onSectorToggle={handleSectorToggle}
        />

        {/* Stats Overview */}
        <StatsOverview
          totalSectors={totalSectors}
          completedSectors={completedSectors}
          inProgressSectors={inProgressSectors}
          pendingSectors={pendingSectors}
          overallProgress={overallProgress}
        />

        {/* Sectors Grid */}
        {selectedSectors.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Setores Hospitalares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sectorsWithStatus.map((sector) => (
                <SectorCard
                  key={sector.id}
                  title={sector.title}
                  description={sector.description}
                  icon={sector.icon}
                  totalQuestions={sector.totalQuestions}
                  completedQuestions={sector.completedQuestions}
                  status={sector.status}
                  onStartAudit={() => handleStartAudit(sector.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recent Audits */}
        {auditResults.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Histórico de Auditorias</h2>
            <RecentAudits 
              auditResults={auditResults} 
              onViewReport={(result) => {setCurrentAuditResult(result); setAppState('report');}} 
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;