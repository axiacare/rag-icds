import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, TrendingUp, Download } from "lucide-react";
import { AuditResult } from "@/types/audit";

interface RecentAuditsProps {
  auditResults: AuditResult[];
  onViewReport: (result: AuditResult) => void;
}

const RecentAudits = ({ auditResults, onViewReport }: RecentAuditsProps) => {
  if (auditResults.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma auditoria realizada ainda</h3>
          <p className="text-muted-foreground">
            Inicie uma auditoria em qualquer setor para ver os resultados aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  const getConformityBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-medical-success text-white">Excelente</Badge>;
    if (percentage >= 80) return <Badge className="bg-medical-primary text-white">Bom</Badge>;
    if (percentage >= 70) return <Badge className="bg-medical-warning text-white">Regular</Badge>;
    return <Badge className="bg-medical-danger text-white">Crítico</Badge>;
  };

  const averageConformity = auditResults.reduce((acc, result) => acc + result.conformityPercentage, 0) / auditResults.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="shadow-card bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Resumo das Auditorias</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {auditResults.length}
              </div>
              <p className="text-sm text-muted-foreground">Auditorias Realizadas</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-medical-secondary mb-1">
                {averageConformity.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Conformidade Média</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-medical-warning mb-1">
                {auditResults.filter(r => r.conformityPercentage < 80).length}
              </div>
              <p className="text-sm text-muted-foreground">Setores que Precisam de Atenção</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Audits List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Auditorias Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditResults.slice().reverse().map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onViewReport(result)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold">{result.sectorName}</h4>
                    {getConformityBadge(result.conformityPercentage)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {result.completedAt.toLocaleDateString('pt-BR')}
                    </span>
                    <span>Conformidade: {result.conformityPercentage.toFixed(1)}%</span>
                    <span>Pontuação: {result.score}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Relatório
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentAudits;