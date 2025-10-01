import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Calendar, FileText, Eye, Play, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Audit {
  id: string;
  title: string;
  description: string;
  institution_id: string;
  template_id: string;
  status: 'draft' | 'in_progress' | 'completed';
  start_date: string | null;
  end_date: string | null;
  total_score: number | null;
  conformity_percentage: number | null;
  created_at: string;
  institutions: {
    name: string;
  };
  audit_templates: {
    name: string;
  };
}

const Auditor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('audits')
        .select(`
          *,
          institutions (name),
          audit_templates (name)
        `)
        .eq('auditor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudits(data || []);
    } catch (error) {
      console.error('Erro ao buscar auditorias:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as auditorias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = 
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.institutions.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.audit_templates.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'Rascunho', variant: 'secondary' as const, className: '' },
      in_progress: { label: 'Em Andamento', variant: 'default' as const, className: '' },
      completed: { label: 'Concluída', variant: 'outline' as const, className: 'bg-green-100 text-green-700 border-green-300' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.draft;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const handleStartAudit = async (auditId: string) => {
    try {
      const { error } = await supabase
        .from('audits')
        .update({ 
          status: 'in_progress',
          start_date: new Date().toISOString()
        })
        .eq('id', auditId);

      if (error) throw error;

      toast({
        title: "Auditoria iniciada",
        description: "Você pode começar a responder as perguntas"
      });

      // Navegar para a página de execução
      navigate(`/auditor/execute/${auditId}`);
    } catch (error) {
      console.error('Erro ao iniciar auditoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a auditoria",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Central do Auditor
            </h1>
            <p className="text-muted-foreground">
              Acesse todas as ferramentas e relatórios de auditoria em um só lugar
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Sistema
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, unidade ou template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{audits.length}</p>
                </div>
                <FileText className="w-8 h-8 text-medical-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rascunhos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {audits.filter(a => a.status === 'draft').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {audits.filter(a => a.status === 'in_progress').length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {audits.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audits List */}
        <div className="space-y-4">
          {filteredAudits.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma auditoria encontrada
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "Tente ajustar os filtros de busca" 
                    : "Você ainda não possui auditorias atribuídas"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAudits.map((audit) => {
              const status = getStatusBadge(audit.status);
              return (
                <Card key={audit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {audit.title}
                          </h3>
                          <Badge variant={status.variant} className={status.className}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {audit.description || "Sem descrição"}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>🏥 {audit.institutions.name}</span>
                          <span>📋 {audit.audit_templates.name}</span>
                          <span>📅 {new Date(audit.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {audit.status === 'completed' && audit.conformity_percentage && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Conformidade</p>
                            <p className={`text-2xl font-bold ${getScoreColor(audit.conformity_percentage)}`}>
                              {audit.conformity_percentage.toFixed(1)}%
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {audit.status === 'draft' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleStartAudit(audit.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Iniciar
                            </Button>
                          )}
                          {audit.status === 'in_progress' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => navigate(`/auditor/execute/${audit.id}`)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continuar
                            </Button>
                          )}
                          {audit.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Auditor;