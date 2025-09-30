import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Save, ArrowLeft, Settings, UserCheck, Users, Building2 } from "lucide-react";
import { hospitalSectors } from "@/data/realistic-sectors";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import AdminApprovals from "./AdminApprovals";
import UserManagement from "@/components/UserManagement";
import InstitutionManagement from "@/components/InstitutionManagement";

interface Question {
  id: number;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'text';
  options?: string[];
  axis: string;
  required: boolean;
}

interface EditingSector {
  id: number;
  name: string;
  description: string;
  questions: Question[];
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'sectors' | 'questions' | 'users' | 'institutions' | 'settings'>('approvals');
  const [editingSector, setEditingSector] = useState<EditingSector | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const tabs = [
    { id: 'approvals', label: 'Aprovações', icon: UserCheck },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'institutions', label: 'Unidades', icon: Building2 },
    { id: 'sectors', label: 'Módulos', icon: Settings },
    { id: 'questions', label: 'Requisitos', icon: Edit2 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleEditSector = (sector: any) => {
    setEditingSector({
      id: sector.id,
      name: sector.name,
      description: sector.description,
      questions: sector.questions,
    });
    setActiveTab('questions');
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      type: 'yes_no',
      axis: '',
      required: true,
    };
    setEditingQuestion(newQuestion);
    setIsAddingQuestion(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion || !editingSector) return;

    if (isAddingQuestion) {
      setEditingSector({
        ...editingSector,
        questions: [...editingSector.questions, editingQuestion],
      });
    } else {
      setEditingSector({
        ...editingSector,
        questions: editingSector.questions.map(q => 
          q.id === editingQuestion.id ? editingQuestion : q
        ),
      });
    }

    setEditingQuestion(null);
    setIsAddingQuestion(false);
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (!editingSector) return;
    
    setEditingSector({
      ...editingSector,
      questions: editingSector.questions.filter(q => q.id !== questionId),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Configure usuários, unidades, módulos e parâmetros do sistema
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Sistema
            </Button>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-background border-b-2 border-medical-primary text-medical-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <AdminApprovals />
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* Institutions Tab */}
        {activeTab === 'institutions' && (
          <InstitutionManagement />
        )}

        {/* Sectors Tab */}
        {activeTab === 'sectors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Módulos de Auditoria
                </h2>
                <p className="text-muted-foreground mt-1">
                  Configure os módulos disponíveis para auditoria
                </p>
              </div>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Novo Módulo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitalSectors.map((sector) => (
                <Card key={sector.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{sector.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {sector.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSector(sector)}
                        className="ml-2 flex-shrink-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {sector.questions.length} requisitos
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Ativo
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && editingSector && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {editingSector.name}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {editingSector.description}
                </p>
              </div>
              <Button onClick={handleAddQuestion} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Novo Requisito
              </Button>
            </div>

            {/* Question Form */}
            {editingQuestion && (
              <Card className="border-medical-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isAddingQuestion ? 'Novo Requisito' : 'Editar Requisito'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="lg:col-span-2">
                      <Label htmlFor="question-text">Texto do Requisito</Label>
                      <Textarea
                        id="question-text"
                        value={editingQuestion.text}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          text: e.target.value
                        })}
                        className="min-h-[100px]"
                        placeholder="Digite o texto do requisito..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="question-type">Tipo</Label>
                      <select
                        id="question-type"
                        value={editingQuestion.type}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          type: e.target.value as Question['type']
                        })}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm"
                      >
                        <option value="yes_no">Sim/Não</option>
                        <option value="multiple_choice">Múltipla Escolha</option>
                        <option value="text">Texto</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="question-axis">Eixo</Label>
                      <Input
                        id="question-axis"
                        value={editingQuestion.axis}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          axis: e.target.value
                        })}
                        placeholder="Ex: Segurança do Paciente"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingQuestion(null);
                        setIsAddingQuestion(false);
                      }}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveQuestion} className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions List */}
            <div className="space-y-3">
              {editingSector.questions.map((question, index) => (
                <Card key={question.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.axis}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.type === 'yes_no' ? 'Sim/Não' : 
                             question.type === 'multiple_choice' ? 'Múltipla' : 'Texto'}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">
                          {question.text}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingQuestion(question);
                            setIsAddingQuestion(false);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="app-name">Nome do Sistema</Label>
                  <Input
                    id="app-name"
                    defaultValue="Sistema RAG - Requisitos de Apoio à Gestão"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Instituição</Label>
                  <Input
                    id="institution"
                    defaultValue="Instituto de Cooperação para o Desenvolvimento da Saúde (ICDS)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    defaultValue="Metodologia de auditoria interna do Instituto de Cooperação para o Desenvolvimento da Saúde (ICDS)"
                    className="mt-1"
                  />
                </div>
                <Button className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;