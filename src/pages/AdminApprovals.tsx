import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  X, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PendingUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  account_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

const AdminApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários pendentes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar usuários pendentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('approve_user_account', {
        _user_id: userId
      });

      if (error) throw error;

      toast({
        title: "Usuário aprovado",
        description: "A conta foi aprovada com sucesso",
        variant: "default"
      });

      // Atualizar lista
      setPendingUsers(prev => prev.filter(user => user.user_id !== userId));
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o usuário",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (userId: string) => {
    const reason = rejectionReason[userId];
    if (!reason?.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Informe o motivo da rejeição",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('reject_user_account', {
        _user_id: userId,
        _reason: reason
      });

      if (error) throw error;

      toast({
        title: "Usuário rejeitado",
        description: "A conta foi rejeitada",
        variant: "default"
      });

      // Atualizar lista
      setPendingUsers(prev => prev.filter(user => user.user_id !== userId));
      setRejectionReason(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o usuário",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Aprovações Pendentes
          </h2>
          <p className="text-muted-foreground">
            Gerencie solicitações de acesso ao sistema
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {pendingUsers.length} pendentes
        </Badge>
      </div>

      {pendingUsers.length === 0 ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Não há solicitações de acesso pendentes no momento.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <Card key={user.id} className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5" />
                      {user.full_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pendente
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor={`reason-${user.user_id}`}>
                    Motivo da rejeição (obrigatório para rejeitar)
                  </Label>
                  <Textarea
                    id={`reason-${user.user_id}`}
                    placeholder="Informe o motivo caso vá rejeitar esta solicitação..."
                    value={rejectionReason[user.user_id] || ''}
                    onChange={(e) => setRejectionReason(prev => ({
                      ...prev,
                      [user.user_id]: e.target.value
                    }))}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(user.user_id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Aprovar
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(user.user_id)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;