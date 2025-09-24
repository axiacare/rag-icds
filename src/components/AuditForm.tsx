import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, FileText, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
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
      const hasAnswer = answers[currentQuestion.id] !== undefined;
      const hasPhotos = currentQuestion.type === 'photo_evidence' ? 
        photos[currentQuestion.id]?.length > 0 : true;
      return hasAnswer && hasPhotos;
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
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(currentQuestion.id, e.target.files)}
                className="flex-1"
              />
              <Camera className="w-5 h-5 text-medical-primary" />
            </div>
            {photos[currentQuestion.id] && photos[currentQuestion.id].length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos[currentQuestion.id].map((file, index) => (
                  <Badge key={index} className="bg-medical-success text-white">
                    {file.name}
                  </Badge>
                ))}
              </div>
            )}
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
                  Pergunta {currentQuestionIndex + 1} de {questions.length}
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
                  <Badge variant="outline">{currentQuestion.category}</Badge>
                  <Badge className="bg-medical-secondary text-white">
                    {currentQuestion.indicator}
                  </Badge>
                  {currentQuestion.required && (
                    <Badge className="bg-medical-danger text-white">Obrigatório</Badge>
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
                Observações (opcional):
              </Label>
              <Textarea
                id="observations"
                value={observations[currentQuestion.id] || ''}
                onChange={(e) => handleObservation(currentQuestion.id, e.target.value)}
                placeholder="Adicione observações relevantes..."
                className="min-h-[80px]"
              />
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