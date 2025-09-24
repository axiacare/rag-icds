import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Paperclip, FileText, CheckCircle, ArrowLeft, ArrowRight, Upload, Image } from "lucide-react";
import { Question } from "@/types/audit";
import { useToast } from "@/hooks/use-toast";

interface AuditFormProps {
  sectorName: string;
  questions: Question[];
  onComplete: (answers: any) => void;
  onBack: () => void;
}

const AuditForm = ({ sectorName, questions, onComplete, onBack }: AuditFormProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [photos, setPhotos] = useState<{ [key: number]: File[] }>({});
  const [observations, setObservations] = useState<{ [key: number]: string }>({});
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handlePhotoUpload = (questionId: number, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setPhotos(prev => ({ ...prev, [questionId]: fileArray }));
      toast({
        title: "Foto anexada",
        description: `${fileArray.length} foto(s) anexada(s) com sucesso`,
      });
    }
  };

  const handleObservation = (questionId: number, observation: string) => {
    setObservations(prev => ({ ...prev, [questionId]: observation }));
  };

  const canProceed = () => {
    if (currentQuestion.required) {
      if (currentQuestion.type === 'photo_evidence') {
        // Para requisitos de evidência fotográfica, deve ter foto
        return photos[currentQuestion.id]?.length > 0;
      } else {
        // Para outros requisitos, deve ter resposta
        return answers[currentQuestion.id] !== undefined;
      }
    }
    return true;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finalizar auditoria
      const result = {
        answers,
        photos,
        observations,
        completedAt: new Date(),
        sectorName
      };
      onComplete(result);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'yes_no':
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="sim" />
              <Label htmlFor="sim" className="text-lg">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="nao" />
              <Label htmlFor="nao" className="text-lg">Não</Label>
            </div>
          </RadioGroup>
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            placeholder="Digite sua resposta..."
            className="min-h-[100px]"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
            placeholder="Digite o número..."
            className="w-32"
          />
        );

      case 'photo_evidence':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-medical-secondary/10 rounded-lg border-2 border-dashed border-medical-secondary">
              <p className="text-center text-medical-secondary font-medium mb-2">
                📸 Este requisito requer evidência fotográfica
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Use a seção de evidências abaixo para anexar as fotos necessárias
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-medical shadow-medical sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">{sectorName}</h1>
                <p className="text-white/80 text-sm">
                  Requisito {currentQuestionIndex + 1} de {questions.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso da Auditoria</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
                <div className="flex space-x-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {currentQuestion.category}
                  </Badge>
                  {currentQuestion.type === 'photo_evidence' && (
                    <Badge className="bg-medical-warning text-white">
                      <Image className="w-3 h-3 mr-1" />
                      Evidência Fotográfica
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Input */}
            <div>
              <Label className="text-base font-medium mb-4 block">Resposta:</Label>
              {renderQuestionInput()}
            </div>

            {/* Observations */}
            <div>
              <Label htmlFor="observations" className="text-base font-medium mb-2 block">
                Observações:
              </Label>
              <Textarea
                id="observations"
                value={observations[currentQuestion.id] || ''}
                onChange={(e) => handleObservation(currentQuestion.id, e.target.value)}
                placeholder="Adicione observações relevantes..."
                className="min-h-[80px]"
              />
            </div>

            {/* Evidence Upload - Available for all questions */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Anexar Evidências:
              </Label>
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handlePhotoUpload(currentQuestion.id, e.target.files)}
                        className="pl-12 h-12 border-2 border-dashed border-medical-primary/30 hover:border-medical-primary/50 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-medical-primary file:text-white hover:file:bg-medical-secondary"
                      />
                      <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-primary pointer-events-none" />
                    </div>
                    <div className="p-3 bg-medical-primary/10 rounded-lg">
                      <Upload className="w-5 h-5 text-medical-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 ml-12">
                    Selecione uma ou mais imagens como evidência
                  </p>
                </div>
                {photos[currentQuestion.id] && photos[currentQuestion.id].length > 0 && (
                  <div className="bg-medical-success/5 p-4 rounded-lg border border-medical-success/20">
                    <div className="flex flex-wrap gap-2">
                      {photos[currentQuestion.id].map((file, index) => (
                        <Badge key={index} className="bg-medical-success text-white px-3 py-1">
                          <Paperclip className="w-3 h-3 mr-2" />
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button
                variant="medical"
                onClick={nextQuestion}
                disabled={!canProceed()}
                className="min-w-[120px]"
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Próxima
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditForm;