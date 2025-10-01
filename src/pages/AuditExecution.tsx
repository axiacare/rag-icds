import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuditForm from "@/components/AuditForm";

interface Sector {
  id: string;
  name: string;
  description: string;
  questions: Array<{
    id: string;
    text: string;
    type: string;
    category: string;
    indicator: string;
    required: boolean;
    options?: any;
    weight: number;
  }>;
}

const AuditExecution = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [currentSectorIndex, setCurrentSectorIndex] = useState(0);
  const [auditInfo, setAuditInfo] = useState<any>(null);

  useEffect(() => {
    if (auditId) {
      fetchAuditData();
    }
  }, [auditId]);

  const fetchAuditData = async () => {
    try {
      // Buscar informações da auditoria
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .select(`
          *,
          institutions (name),
          audit_templates (id, name)
        `)
        .eq('id', auditId)
        .single();

      if (auditError) throw auditError;
      setAuditInfo(audit);

      // Buscar setores e questões do template
      const { data: sectorsData, error: sectorsError } = await supabase
        .from('sectors')
        .select(`
          id,
          name,
          description,
          order_index,
          questions (
            id,
            text,
            type,
            category,
            indicator,
            required,
            options,
            weight,
            order_index
          )
        `)
        .eq('template_id', audit.audit_templates.id)
        .order('order_index', { ascending: true });

      if (sectorsError) throw sectorsError;

      // Ordenar as questões dentro de cada setor
      const sortedSectors = sectorsData.map(sector => ({
        ...sector,
        questions: (sector.questions || []).sort((a: any, b: any) => a.order_index - b.order_index)
      }));

      setSectors(sortedSectors);
    } catch (error) {
      console.error('Erro ao buscar dados da auditoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da auditoria",
        variant: "destructive"
      });
      navigate('/auditor');
    } finally {
      setLoading(false);
    }
  };

  const handleSectorComplete = async (sectorData: any) => {
    try {
      const currentSector = sectors[currentSectorIndex];
      
      // Salvar cada resposta no banco de dados
      for (const questionId in sectorData.answers) {
        const question = currentSector.questions.find(q => q.id === questionId);
        if (!question) continue;

        // Upload de fotos para o storage (se houver)
        let photoUrls: string[] = [];
        if (sectorData.photos[questionId]?.length > 0) {
          photoUrls = await uploadPhotos(questionId, sectorData.photos[questionId]);
        }

        // Inserir ou atualizar resposta
        const { error } = await supabase
          .from('audit_responses')
          .upsert({
            audit_id: auditId,
            question_id: questionId,
            answer: sectorData.answers[questionId],
            observations: sectorData.observations[questionId] || null,
            photo_urls: photoUrls.length > 0 ? photoUrls : null
          }, {
            onConflict: 'audit_id,question_id'
          });

        if (error) throw error;
      }

      // Verificar se há mais setores
      if (currentSectorIndex < sectors.length - 1) {
        setCurrentSectorIndex(prev => prev + 1);
        toast({
          title: "Setor concluído",
          description: `Progresso salvo com sucesso. Próximo setor: ${sectors[currentSectorIndex + 1].name}`
        });
      } else {
        // Finalizar auditoria - calcular score
        await finalizeAudit();
      }
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as respostas",
        variant: "destructive"
      });
    }
  };

  const uploadPhotos = async (questionId: string, files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${auditId}/${questionId}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('audit-evidence')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('audit-evidence')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    return urls;
  };

  const finalizeAudit = async () => {
    try {
      // Buscar todas as respostas para calcular o score
      const { data: responses, error: responsesError } = await supabase
        .from('audit_responses')
        .select(`
          *,
          questions (weight, type)
        `)
        .eq('audit_id', auditId);

      if (responsesError) throw responsesError;

      // Calcular score
      let totalScore = 0;
      let maxScore = 0;

      responses.forEach((response: any) => {
        const weight = response.questions.weight || 1;
        maxScore += weight;

        // Calcular pontuação baseado no tipo de resposta
        if (response.questions.type === 'yes_no') {
          if (response.answer === 'sim') {
            totalScore += weight;
          }
        } else if (response.questions.type === 'photo_evidence') {
          if (response.photo_urls && response.photo_urls.length > 0) {
            totalScore += weight;
          }
        } else {
          // Para outros tipos, considera como respondido = pontos completos
          if (response.answer) {
            totalScore += weight;
          }
        }
      });

      const conformityPercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

      // Atualizar auditoria com score e status
      const { error: updateError } = await supabase
        .from('audits')
        .update({
          status: 'completed',
          end_date: new Date().toISOString(),
          total_score: totalScore,
          conformity_percentage: conformityPercentage
        })
        .eq('id', auditId);

      if (updateError) throw updateError;

      toast({
        title: "Auditoria concluída!",
        description: `Conformidade: ${conformityPercentage.toFixed(1)}%`
      });

      navigate('/auditor');
    } catch (error) {
      console.error('Erro ao finalizar auditoria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a auditoria",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    if (currentSectorIndex > 0) {
      setCurrentSectorIndex(prev => prev - 1);
    } else {
      navigate('/auditor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  if (!sectors.length || !sectors[currentSectorIndex]) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Nenhum setor encontrado para esta auditoria</p>
        </div>
      </div>
    );
  }

  const currentSector = sectors[currentSectorIndex];

  return (
    <AuditForm
      sectorName={currentSector.name}
      questions={currentSector.questions.map(q => ({
        id: Number(q.id),
        text: q.text,
        type: q.type as any,
        category: q.category,
        indicator: q.indicator,
        required: q.required,
        options: q.options,
      }))}
      onComplete={handleSectorComplete}
      onBack={handleBack}
    />
  );
};

export default AuditExecution;
