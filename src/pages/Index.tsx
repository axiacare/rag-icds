import { useState } from "react";
import Header from "@/components/Header";
import SectorCard from "@/components/SectorCard";
import StatsOverview from "@/components/StatsOverview";
import { 
  Heart, 
  Scissors, 
  Truck, 
  Bed, 
  Pill, 
  Microscope, 
  Zap, 
  Users 
} from "lucide-react";
import heroImage from "@/assets/rag-hero.jpg";

const Index = () => {
  // Mock data for hospital sectors
  const [sectors] = useState([
    {
      id: 1,
      title: "UTI - Unidade de Terapia Intensiva",
      description: "Auditoria de equipamentos, protocolos e segurança do paciente crítico",
      icon: <Heart className="w-6 h-6" />,
      totalQuestions: 25,
      completedQuestions: 18,
      status: "in-progress" as const
    },
    {
      id: 2,
      title: "Centro Cirúrgico",
      description: "Verificação de normas de esterilização, equipamentos e procedimentos",
      icon: <Scissors className="w-6 h-6" />,
      totalQuestions: 30,
      completedQuestions: 30,
      status: "completed" as const
    },
    {
      id: 3,
      title: "Emergência / Pronto Socorro",
      description: "Auditoria de fluxo de atendimento, triagem e recursos disponíveis",
      icon: <Truck className="w-6 h-6" />,
      totalQuestions: 22,
      completedQuestions: 8,
      status: "in-progress" as const
    },
    {
      id: 4,
      title: "Enfermaria Geral",
      description: "Verificação de cuidados de enfermagem e conforto do paciente",
      icon: <Bed className="w-6 h-6" />,
      totalQuestions: 20,
      completedQuestions: 0,
      status: "pending" as const
    },
    {
      id: 5,
      title: "Farmácia Hospitalar",
      description: "Auditoria de armazenamento, dispensação e controle de medicamentos",
      icon: <Pill className="w-6 h-6" />,
      totalQuestions: 18,
      completedQuestions: 0,
      status: "pending" as const
    },
    {
      id: 6,
      title: "Laboratório",
      description: "Verificação de processos, equipamentos e controle de qualidade",
      icon: <Microscope className="w-6 h-6" />,
      totalQuestions: 16,
      completedQuestions: 0,
      status: "pending" as const
    },
    {
      id: 7,
      title: "Radiologia e Imagem",
      description: "Auditoria de equipamentos, proteção radiológica e laudos",
      icon: <Zap className="w-6 h-6" />,
      totalQuestions: 14,
      completedQuestions: 0,
      status: "pending" as const
    },
    {
      id: 8,
      title: "Administração e RH",
      description: "Verificação de processos administrativos e gestão de recursos humanos",
      icon: <Users className="w-6 h-6" />,
      totalQuestions: 12,
      completedQuestions: 0,
      status: "pending" as const
    }
  ]);

  const handleStartAudit = (sectorId: number) => {
    // TODO: Navigate to audit form for specific sector
    console.log(`Starting audit for sector ${sectorId}`);
  };

  // Calculate stats
  const totalSectors = sectors.length;
  const completedSectors = sectors.filter(s => s.status === "completed").length;
  const inProgressSectors = sectors.filter(s => s.status === "in-progress").length;
  const pendingSectors = sectors.filter(s => s.status === "pending").length;
  
  const totalQuestions = sectors.reduce((acc, s) => acc + s.totalQuestions, 0);
  const completedQuestions = sectors.reduce((acc, s) => acc + s.completedQuestions, 0);
  const overallProgress = (completedQuestions / totalQuestions) * 100;

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
        {/* Stats Overview */}
        <StatsOverview
          totalSectors={totalSectors}
          completedSectors={completedSectors}
          inProgressSectors={inProgressSectors}
          pendingSectors={pendingSectors}
          overallProgress={overallProgress}
        />

        {/* Sectors Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Setores Hospitalares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sectors.map((sector) => (
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
      </div>
    </div>
  );
};

export default Index;