import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface StatsOverviewProps {
  totalSectors: number;
  completedSectors: number;
  inProgressSectors: number;
  pendingSectors: number;
  overallProgress: number;
}

const StatsOverview = ({
  totalSectors,
  completedSectors,
  inProgressSectors,
  pendingSectors,
  overallProgress
}: StatsOverviewProps) => {
  const stats = [
    {
      title: "Total de Setores",
      value: totalSectors,
      icon: <FileText className="w-5 h-5" />,
      color: "text-primary"
    },
    {
      title: "Concluídos",
      value: completedSectors,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-medical-success"
    },
    {
      title: "Em Andamento",
      value: inProgressSectors,
      icon: <Clock className="w-5 h-5" />,
      color: "text-medical-warning"
    },
    {
      title: "Pendentes",
      value: pendingSectors,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="shadow-card bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Progresso Geral da Auditoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso Total</span>
              <span className="font-semibold text-primary">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {completedSectors} de {totalSectors} setores concluídos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;