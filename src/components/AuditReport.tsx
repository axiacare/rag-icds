import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Camera, CheckCircle, XCircle } from "lucide-react";
import { AuditResult } from "@/types/audit";
import { hospitalSectors } from "@/data/sectors";

interface AuditReportProps {
  auditResult: AuditResult;
  onNewAudit: () => void;
}

const AuditReport = ({ auditResult, onNewAudit }: AuditReportProps) => {
  const sector = hospitalSectors.find(s => s.id === auditResult.sectorId);
  
  const generatePDFReport = () => {
    // Simular geração de PDF
    const reportContent = `
RELATÓRIO DE AUDITORIA HOSPITALAR - RAG
========================================

Setor: ${auditResult.sectorName}
Data: ${auditResult.completedAt.toLocaleDateString('pt-BR')}
Hora: ${auditResult.completedAt.toLocaleTimeString('pt-BR')}
Conformidade: ${auditResult.conformityPercentage.toFixed(1)}%
Pontuação: ${auditResult.score}

RESPOSTAS POR CATEGORIA:
${sector?.questions.map(q => `
${q.category} - ${q.indicator}
Requisito: ${q.text}
Resposta: ${auditResult.answers[q.id] || 'Não respondido'}
Observações: ${auditResult.observations[q.id] || 'Nenhuma'}
`).join('\n')}

RECOMENDAÇÕES:
- Revisar itens não conformes
- Implementar plano de ação corretiva
- Reagendar auditoria de acompanhamento
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-auditoria-${auditResult.sectorName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getConformityStatus = () => {
    if (auditResult.conformityPercentage >= 90) return { status: 'Excelente', color: 'bg-medical-success', icon: CheckCircle };
    if (auditResult.conformityPercentage >= 80) return { status: 'Bom', color: 'bg-medical-primary', icon: CheckCircle };
    if (auditResult.conformityPercentage >= 70) return { status: 'Regular', color: 'bg-medical-warning', icon: CheckCircle };
    return { status: 'Crítico', color: 'bg-medical-danger', icon: XCircle };
  };

  const conformityStatus = getConformityStatus();
  const StatusIcon = conformityStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-medical shadow-medical">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Relatório de Auditoria</h1>
            <p className="text-white/80">{auditResult.sectorName}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Summary Card */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Resumo da Auditoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {auditResult.conformityPercentage.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Taxa de Conformidade</p>
                <Badge className={`${conformityStatus.color} text-white mt-2`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {conformityStatus.status}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-medical-secondary mb-1">
                  {auditResult.score}
                </div>
                <p className="text-sm text-muted-foreground">Pontuação Total</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-medical-warning mb-1">
                  {sector?.questions.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Requisitos Avaliados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>Resultados Detalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sector?.questions.map((question, index) => (
                <div key={question.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{question.text}</h4>
                        <div className="flex space-x-2 mt-2">
                          <Badge className="bg-primary text-primary-foreground">
                            {question.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">Resposta:</p>
                          <p className="text-base">
                            {auditResult.answers[question.id] || 'Não respondido'}
                          </p>
                        </div>
                        
                        {auditResult.observations[question.id] && (
                          <div>
                            <p className="font-medium text-sm text-muted-foreground">Observações:</p>
                            <p className="text-base">{auditResult.observations[question.id]}</p>
                          </div>
                        )}
                      </div>
                      
                      {auditResult.photos[question.id] && auditResult.photos[question.id].length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="font-medium text-sm text-muted-foreground mb-2">
                            Evidências Fotográficas:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {auditResult.photos[question.id].map((photo, photoIndex) => (
                              <Badge key={photoIndex} className="bg-medical-success text-white">
                                <Camera className="w-3 h-3 mr-1" />
                                {photo.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < sector.questions.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="medical"
                onClick={generatePDFReport}
                className="flex-1 max-w-xs"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
              
              <Button
                variant="outline"
                onClick={onNewAudit}
                className="flex-1 max-w-xs"
              >
                <FileText className="w-4 h-4 mr-2" />
                Nova Auditoria
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Relatório gerado em {auditResult.completedAt.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditReport;