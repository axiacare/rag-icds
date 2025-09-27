import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Users, Shield, Building, BarChart3, FileText, ArrowRight, Hospital, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Sistema de Auditoria
              <span className="block text-blue-200">Hospitalar</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Plataforma profissional para auditoria de qualidade e conformidade em instituições de saúde
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Hospital className="mr-2 h-5 w-5" />
                    Acessar Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Começar Agora
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <BarChart3 className="mr-2 h-5 w-5" />
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sistema Completo de Auditoria
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvido especificamente para atender às necessidades de auditoria em saúde
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Conformidade Total</CardTitle>
                <CardDescription className="text-gray-600">
                  Avaliação completa baseada em protocolos e normas de qualidade hospitalar reconhecidas internacionalmente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Gestão de Equipes</CardTitle>
                <CardDescription className="text-gray-600">
                  Controle de acesso baseado em funções para auditores, administradores e visualizadores com segurança total
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Relatórios Inteligentes</CardTitle>
                <CardDescription className="text-gray-600">
                  Relatórios automáticos com análises detalhadas e recomendações para melhoria contínua da qualidade
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Multi-Instituições</CardTitle>
                <CardDescription className="text-gray-600">
                  Gerencie auditorias de múltiplas instituições de saúde em uma única plataforma centralizada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Analytics Avançado</CardTitle>
                <CardDescription className="text-gray-600">
                  Dashboards interativos com métricas de desempenho, tendências e indicadores de qualidade em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Auditoria Digital</CardTitle>
                <CardDescription className="text-gray-600">
                  Processo 100% digital com coleta de evidências fotográficas, observações e validação em tempo real
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Setores de Auditoria
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cobertura completa de todos os setores críticos de uma instituição de saúde
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Segurança do Paciente', icon: Shield, count: '25+ protocolos' },
              { name: 'Controle de Infecção', icon: Hospital, count: '18+ indicadores' },
              { name: 'Centro Cirúrgico', icon: ClipboardList, count: '30+ checklist' },
              { name: 'UTI', icon: Users, count: '20+ critérios' },
              { name: 'Farmácia', icon: FileText, count: '15+ processos' },
              { name: 'Recursos Humanos', icon: Users, count: '12+ avaliações' },
              { name: 'Infraestrutura', icon: Building, count: '22+ itens' },
              { name: 'Gestão de Resíduos', icon: Shield, count: '10+ protocolos' }
            ].map((sector, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <sector.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{sector.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {sector.count}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme a Qualidade da sua Instituição
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Implemente um sistema de auditoria profissional e eleve os padrões de qualidade e segurança
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Hospital className="mr-2 h-5 w-5" />
                  Ir para Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;