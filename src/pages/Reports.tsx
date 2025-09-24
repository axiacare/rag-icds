import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Search, Filter, Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { AuditResult } from "@/types/audit";

const evaluators = [
  "Fernando Paragó",
  "Sandra Miziara", 
  "Letícia Teles",
  "Guilherme Thomé"
];

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvaluator, setSelectedEvaluator] = useState("");
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);

  // Mock data - in a real app, this would come from a database
  useEffect(() => {
    const mockResults: AuditResult[] = [
      {
        sectorId: 1,
        sectorName: "Unidade de Terapia Intensiva",
        completedAt: new Date("2024-01-15"),
        answers: {},
        photos: {},
        observations: {},
        score: 85,
        conformityPercentage: 85.2,
      },
      {
        sectorId: 2,
        sectorName: "Centro Cirúrgico",
        completedAt: new Date("2024-01-10"),
        answers: {},
        photos: {},
        observations: {},
        score: 92,
        conformityPercentage: 92.1,
      },
      {
        sectorId: 3,
        sectorName: "Emergência",
        completedAt: new Date("2024-01-05"),
        answers: {},
        photos: {},
        observations: {},
        score: 78,
        conformityPercentage: 78.5,
      },
    ];
    setAuditResults(mockResults);
  }, []);

  const filteredResults = auditResults.filter(result => {
    const matchesSearch = result.sectorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-medical-success";
    if (score >= 70) return "text-medical-warning";
    return "text-medical-danger";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Relatórios de Auditoria
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie os relatórios de auditoria realizadas
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Sistema
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar Setor</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome do setor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Avaliador</label>
                <select
                  value={selectedEvaluator}
                  onChange={(e) => setSelectedEvaluator(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                >
                  <option value="">Todos os avaliadores</option>
                  {evaluators.map((evaluator) => (
                    <option key={evaluator} value={evaluator}>
                      {evaluator}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Últimos 30 dias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Auditorias</p>
                  <p className="text-2xl font-bold text-foreground">{auditResults.length}</p>
                </div>
                <FileText className="w-8 h-8 text-medical-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Média de Conformidade</p>
                  <p className="text-2xl font-bold text-foreground">
                    {auditResults.length > 0 
                      ? Math.round(auditResults.reduce((acc, r) => acc + r.conformityPercentage, 0) / auditResults.length) 
                      : 0}%
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-medical-success/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-medical-success"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Acima de 90%</p>
                  <p className="text-2xl font-bold text-medical-success">
                    {auditResults.filter(r => r.conformityPercentage >= 90).length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-medical-success/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-medical-success"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Necessitam Atenção</p>
                  <p className="text-2xl font-bold text-medical-warning">
                    {auditResults.filter(r => r.conformityPercentage < 80).length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-medical-warning/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-medical-warning"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredResults.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum relatório encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "Tente ajustar os filtros de busca" 
                    : "Ainda não há auditorias realizadas"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResults.map((result) => (
              <Card key={result.sectorId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {result.sectorName}
                        </h3>
                        <Badge variant={getScoreBadge(result.score) as any}>
                          {result.conformityPercentage.toFixed(1)}% Conformidade
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>Data: {result.completedAt.toLocaleDateString('pt-BR')}</span>
                        <span>Avaliador: {evaluators[result.sectorId % evaluators.length]}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Pontuação</p>
                        <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}/100
                        </p>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Baixar PDF</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;