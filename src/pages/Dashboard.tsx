import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  Building2, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalAudits: number;
  completedAudits: number;
  pendingAudits: number;
  institutions: number;
}

const Dashboard: React.FC = () => {
  const { user, profile, roles, signOut, isAdmin, isAuditor } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAudits: 0,
    completedAudits: 0,
    pendingAudits: 0,
    institutions: 0
  });
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch audits stats
      const { data: auditsData, error: auditsError } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (auditsError) throw auditsError;

      const totalAudits = auditsData?.length || 0;
      const completedAudits = auditsData?.filter(audit => audit.status === 'completed').length || 0;
      const pendingAudits = auditsData?.filter(audit => ['draft', 'in_progress'].includes(audit.status)).length || 0;

      // Fetch institutions count
      const { count: institutionsCount, error: institutionsError } = await supabase
        .from('institutions')
        .select('*', { count: 'exact', head: true });

      if (institutionsError) throw institutionsError;

      setStats({
        totalAudits,
        completedAudits,
        pendingAudits,
        institutions: institutionsCount || 0
      });

      // Set recent audits (limited to 5)
      setRecentAudits(auditsData?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', variant: 'secondary' as const },
      in_progress: { label: 'Em Andamento', variant: 'default' as const },
      completed: { label: 'Concluída', variant: 'default' as const },
      approved: { label: 'Aprovada', variant: 'default' as const },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRolesBadges = () => {
    return roles.map(role => (
      <Badge key={role.id} variant="outline" className="capitalize">
        {role.role === 'admin' ? 'Administrador' : 
         role.role === 'auditor' ? 'Auditor' : 'Visualizador'}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                <div className="flex space-x-1">
                  {getRolesBadges()}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {profile?.full_name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades de auditoria
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Auditorias</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAudits}</div>
              <p className="text-xs text-muted-foreground">
                Todas as auditorias do sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedAudits}</div>
              <p className="text-xs text-muted-foreground">
                Auditorias finalizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAudits}</div>
              <p className="text-xs text-muted-foreground">
                Em andamento ou rascunho
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instituições</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.institutions}</div>
              <p className="text-xs text-muted-foreground">
                Cadastradas no sistema
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesse as principais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isAuditor() || isAdmin()) && (
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Auditoria
                  </Button>
                )}
                
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Relatórios
                </Button>
                
                {isAdmin() && (
                  <>
                    <Button className="w-full justify-start" variant="outline">
                      <Building2 className="h-4 w-4 mr-2" />
                      Gerenciar Instituições
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Gerenciar Usuários
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Button>
                  </>
                )}
                
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analíticas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Audits */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Auditorias Recentes</CardTitle>
                <CardDescription>
                  Últimas auditorias criadas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentAudits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma auditoria encontrada</p>
                    <p className="text-sm">
                      {isAuditor() ? 'Crie sua primeira auditoria para começar' : 'Aguarde a criação de auditorias'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAudits.map((audit) => (
                      <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{audit.title}</h4>
                          <p className="text-sm text-gray-600">{audit.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Criada em {new Date(audit.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(audit.status)}
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;