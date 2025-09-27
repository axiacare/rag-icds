import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, UserPlus, Shield, Stethoscope } from 'lucide-react';
import { z } from 'zod';
import icdsMainLogo from "@/assets/icds-main-logo.png";
import axiacareLogo from "@/assets/axiacare-logo.png";

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(3, 'Senha deve ter pelo menos 3 caracteres'),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
});

const Auth = () => {
  const { user, signIn, signUp } = useAuthContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn('admin@teste.com', 'admin123');
      if (result.error) {
        setError('Usuário de teste não encontrado ou credenciais incorretas.');
      }
    } catch (err) {
      console.error('Error in test login:', err);
      setError('Erro ao fazer login de teste.');
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      const validationData = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, fullName: formData.fullName };
        
      authSchema.parse(validationData);

      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.fullName);
      }

      if (result.error) {
        if (result.error.message.includes('Email not confirmed')) {
          setError('Verifique seu email e clique no link de confirmação antes de fazer login.');
        } else if (result.error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos.');
        } else if (result.error.message.includes('User already registered')) {
          setError('Este email já está cadastrado. Tente fazer login.');
        } else {
          setError(result.error.message);
        }
      } else if (!isLogin) {
        setError('Cadastro realizado! Verifique seu email para confirmar sua conta.');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Background com mesmo estilo da página principal */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-hero will-change-transform"></div>
        
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-sm"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-5 sm:top-20 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 left-5 sm:bottom-20 sm:left-10 w-32 h-32 sm:w-40 sm:h-40 bg-medical-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Header com logos */}
            <div className="flex items-center justify-center space-x-6 animate-fade-in">
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg">
                <img 
                  src={icdsMainLogo} 
                  alt="ICDS Logo" 
                  className="h-8 sm:h-10 md:h-12 w-auto"
                  loading="eager"
                />
              </div>
              
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-inter font-black leading-none tracking-tight rag-title rag-glow">
                  RAG
                </h1>
                <p className="text-white/90 text-xs sm:text-sm font-medium">Sistema de Auditoria</p>
              </div>

              <div className="bg-white/90 rounded-lg p-2 sm:p-3 shadow-lg">
                <img 
                  src={axiacareLogo} 
                  alt="AxiaCare Logo" 
                  className="h-6 sm:h-8 md:h-10 object-contain"
                  loading="eager"
                />
              </div>
            </div>

            {/* RAG Title */}
            <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="space-y-2">
                <p className="text-lg sm:text-xl md:text-2xl text-white font-inter font-bold">
                  Requisitos de Apoio à Gestão
                </p>
                <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-medical-accent to-white mx-auto rounded-full animate-scale-in"></div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/30 shadow-elegant max-w-2xl">
                <p className="text-sm sm:text-base text-white leading-relaxed font-inter font-medium">
                  Metodologia de auditoria interna do 
                  <span className="block mt-1 text-white font-bold">
                    Instituto de Cooperação para o Desenvolvimento da Saúde (ICDS)
                  </span>
                </p>
              </div>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Card className="shadow-elegant border-0 bg-gradient-to-br from-card/95 via-card to-background/95 backdrop-blur-sm">
                <CardHeader className="space-y-4 text-center">
                  <div className="mx-auto p-3 bg-gradient-medical rounded-2xl w-14 h-14 flex items-center justify-center shadow-glow animate-float">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-foreground font-inter">
                      {isLogin ? 'Acesso ao Sistema' : 'Criar Nova Conta'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-inter">
                      {isLogin 
                        ? 'Entre com suas credenciais para acessar o RAG' 
                        : 'Registre-se para começar as auditorias hospitalares'}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Botão de Login de Teste - SEPARADO */}
                   {isLogin && (
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground mb-3 text-center font-medium">
                        Acesso de Teste do Sistema
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="default"
                        onClick={handleTestLogin}
                        className="w-full"
                        disabled={loading}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {loading ? 'Entrando...' : 'Entrar com Login de Teste'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        admin@teste.com / admin123
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        OU USE SEU LOGIN OFICIAL
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Seu nome completo"
                          required={!isLogin}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Sua senha"
                        required
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="medical"
                      className="w-full h-12 font-medium shadow-glow hover:shadow-elegant"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          {isLogin ? (
                            <>
                              <LogIn className="w-4 h-4 mr-2" />
                              Entrar no RAG
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Criar Conta
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                        setFormData({ email: '', password: '', fullName: '' });
                      }}
                      className="text-sm font-medium hover:text-medical-primary transition-colors"
                    >
                      {isLogin 
                        ? 'Não tem uma conta? Criar conta' 
                        : 'Já tem uma conta? Fazer login'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer info */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <p className="text-white/70 text-xs font-inter">
                Sistema Profissional de Auditoria Hospitalar
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;