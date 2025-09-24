import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface SectorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  totalQuestions: number;
  completedQuestions: number;
  status: "pending" | "in-progress" | "completed";
  onStartAudit: () => void;
}

const SectorCard = ({
  title,
  description,
  icon,
  totalQuestions,
  completedQuestions,
  status,
  onStartAudit
}: SectorCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-medical-success text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-medical-warning text-white">
            <Clock className="w-3 h-3 mr-1" />
            Em Andamento
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  const progress = (completedQuestions / totalQuestions) * 100;

  return (
    <Card className="shadow-card hover:shadow-medical transition-all duration-300 hover:scale-105 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-medical rounded-lg text-white">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{completedQuestions}/{totalQuestions} questões</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 bg-gradient-medical rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <Button 
            onClick={() => {
              console.log('Botão clicado no setor:', title);
              onStartAudit();
            }}
            variant="medical"
            className="w-full group-hover:shadow-medical transition-all duration-300"
          >
            {status === "pending" ? "Iniciar Auditoria" : "Continuar Auditoria"}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorCard;