import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthContext();
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const checkAccountStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('account_status')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Erro ao verificar status da conta:', error);
            setAccountStatus('approved'); // Em caso de erro, permitir acesso
          } else {
            setAccountStatus(data?.account_status || 'pending');
          }
        } catch (error) {
          console.error('Erro ao verificar status da conta:', error);
          setAccountStatus('approved'); // Em caso de erro, permitir acesso
        } finally {
          setStatusLoading(false);
        }
      };

      checkAccountStatus();
    } else {
      setStatusLoading(false);
    }
  }, [user]);

  if (loading || statusLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-medical-primary mx-auto" />
          <p className="text-muted-foreground font-inter">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Se a conta não foi aprovada ainda
  if (accountStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Conta Pendente de Aprovação</strong>
              <br />
              Sua conta foi criada com sucesso e está aguardando aprovação da administração. 
              Você receberá um email quando sua conta for aprovada.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Se a conta foi rejeitada
  if (accountStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Conta Rejeitada</strong>
              <br />
              Sua solicitação de acesso foi rejeitada pela administração. 
              Entre em contato para mais informações.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Se a conta foi aprovada ou há erro (permite acesso)
  return <>{children}</>;
};

export default ProtectedRoute;