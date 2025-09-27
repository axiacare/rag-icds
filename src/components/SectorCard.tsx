import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface SectorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  totalRequirements: number;
  completedRequirements: number;
  status: "pending" | "in-progress" | "completed";
  onStartAudit: () => void;
}

const SectorCard = ({
  title,
  description,
  icon,
  totalRequirements,
  completedRequirements,
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

  const progress = (completedRequirements / totalRequirements) * 100;

  return (
    <Card className="shadow-card hover:shadow-medical transition-all duration-300 hover:scale-105 cursor-pointer group h-full flex flex-col">
      <CardHeader className="pb-3 flex-1">
        <div className="flex flex-col sm:flex-row items-start justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-gradient-medical rounded-lg text-white flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2">{title}</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-3">{description}</p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex sm:block justify-center">
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 mt-auto">
        <div className="space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{completedRequirements}/{totalRequirements} requisitos</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 bg-gradient-medical rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <Button 
            onClick={onStartAudit}
            variant="medical"
            className="w-full group-hover:shadow-medical transition-all duration-300 text-sm sm:text-base py-2 sm:py-3"
          >
            <span className="truncate">
              {status === "pending" ? "Iniciar Auditoria" : "Continuar Auditoria"}
            </span>
            <ChevronRight className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorCard;