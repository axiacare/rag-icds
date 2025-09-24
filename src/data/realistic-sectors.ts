import { Sector } from "@/types/audit";

export const hospitalSectors: Sector[] = [
  {
    id: 1,
    name: "Segurança do Paciente",
    description: "Avaliação de protocolos de segurança, identificação de pacientes e prevenção de eventos adversos",
    questions: [
      {
        id: 101,
        text: "Existe protocolo de identificação segura do paciente implementado?",
        type: "yes_no",
        category: "Identificação do Paciente", 
        indicator: "Protocolo de identificação",
        required: true
      },
      {
        id: 102,
        text: "Os pacientes utilizam pulseiras de identificação com dados corretos?",
        type: "yes_no",
        category: "Identificação do Paciente",
        indicator: "Pulseiras de identificação", 
        required: true
      },
      {
        id: 103,
        text: "Qual a frequência de verificação da identidade do paciente antes de procedimentos?",
        type: "multiple_choice",
        category: "Identificação do Paciente",
        indicator: "Verificação de identidade",
        required: true,
        options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
      },
      {
        id: 104,
        text: "Existe protocolo de prevenção de quedas implementado?",
        type: "yes_no", 
        category: "Prevenção de Quedas",
        indicator: "Protocolo de quedas",
        required: true
      },
      {
        id: 105,
        text: "Há avaliação de risco de queda para todos os pacientes internados?",
        type: "yes_no",
        category: "Prevenção de Quedas", 
        indicator: "Avaliação de risco",
        required: true
      }
    ]
  },
  {
    id: 2,
    name: "Controle de Infecção Hospitalar",
    description: "Práticas de controle e prevenção de infecções associadas aos cuidados de saúde",
    questions: [
      {
        id: 201,
        text: "Existe Comissão de Controle de Infecção Hospitalar (CCIH) ativa?",
        type: "yes_no",
        category: "Estrutura Organizacional",
        indicator: "CCIH ativa",
        required: true
      },
      {
        id: 202,
        text: "Há protocolo de higienização das mãos implementado?",
        type: "yes_no",
        category: "Higienização",
        indicator: "Protocolo de higienização",
        required: true
      },
      {
        id: 203,
        text: "Qual a adesão à higienização das mãos pelos profissionais?",
        type: "multiple_choice",
        category: "Higienização",
        indicator: "Adesão higienização",
        required: true,
        options: ["Acima de 80%", "60-80%", "40-60%", "20-40%", "Abaixo de 20%"]
      },
      {
        id: 204,
        text: "Existe vigilância epidemiológica das infecções hospitalares?",
        type: "yes_no",
        category: "Vigilância",
        indicator: "Vigilância epidemiológica",
        required: true
      },
      {
        id: 205,
        text: "Há isolamento adequado para pacientes com doenças transmissíveis?",
        type: "yes_no",
        category: "Isolamento",
        indicator: "Protocolo de isolamento", 
        required: true
      }
    ]
  },
  {
    id: 3,
    name: "Gestão de Medicamentos",
    description: "Sistema de medicação segura, armazenamento e dispensação de medicamentos",
    questions: [
      {
        id: 301,
        text: "Existe protocolo de prescrição, dispensação e administração de medicamentos?",
        type: "yes_no",
        category: "Protocolo de Medicação",
        indicator: "Sistema de medicação",
        required: true
      },
      {
        id: 302,
        text: "Há farmacêutico clínico responsável pela análise das prescrições?",
        type: "yes_no",
        category: "Recursos Humanos",
        indicator: "Farmacêutico clínico",
        required: true
      },
      {
        id: 303,
        text: "Como é realizada a conferência de medicamentos antes da administração?",
        type: "multiple_choice",
        category: "Administração de Medicamentos",
        indicator: "Conferência de medicamentos",
        required: true,
        options: ["Dupla conferência sempre", "Conferência simples sempre", "Conferência esporádica", "Não há protocolo"]
      },
      {
        id: 304,
        text: "Existe controle de temperatura para medicamentos termolábeis?",
        type: "yes_no",
        category: "Armazenamento",
        indicator: "Controle de temperatura",
        required: true
      },
      {
        id: 305,
        text: "Há sistema de identificação de medicamentos de alta vigilância?",
        type: "yes_no",
        category: "Medicamentos de Alta Vigilância",
        indicator: "Identificação MAV",
        required: true
      }
    ]
  },
  {
    id: 4,
    name: "Emergência e Urgência",
    description: "Atendimento de emergência, classificação de risco e protocolos de urgência",
    questions: [
      {
        id: 401,
        text: "Existe protocolo de classificação de risco implementado?",
        type: "yes_no",
        category: "Classificação de Risco",
        indicator: "Protocolo Manchester ou similar",
        required: true
      },
      {
        id: 402,
        text: "Há enfermeiro exclusivo para classificação de risco?",
        type: "yes_no",
        category: "Recursos Humanos",
        indicator: "Enfermeiro classificador",
        required: true
      },
      {
        id: 403,
        text: "Qual o tempo médio para primeira avaliação médica?",
        type: "multiple_choice",
        category: "Tempo de Atendimento",
        indicator: "Tempo primeira avaliação",
        required: true,
        options: ["< 15 minutos", "15-30 minutos", "30-60 minutos", "1-2 horas", "> 2 horas"]
      },
      {
        id: 404,
        text: "Existe carro de emergência com checklist diário?",
        type: "yes_no",
        category: "Equipamentos",
        indicator: "Carro de emergência",
        required: true
      },
      {
        id: 405,
        text: "Há protocolos para atendimento de parada cardiorrespiratória?",
        type: "yes_no",
        category: "Protocolos Assistenciais",
        indicator: "Protocolo PCR",
        required: true
      }
    ]
  },
  {
    id: 5,
    name: "Centro Cirúrgico",
    description: "Segurança cirúrgica, controle de processos e prevenção de complicações",
    questions: [
      {
        id: 501,
        text: "É utilizada a Lista de Verificação de Segurança Cirúrgica (Checklist OMS)?",
        type: "yes_no",
        category: "Segurança Cirúrgica",
        indicator: "Checklist cirúrgico",
        required: true
      },
      {
        id: 502,
        text: "Existe protocolo de cirurgia segura implementado?",
        type: "yes_no",
        category: "Segurança Cirúrgica",
        indicator: "Protocolo cirurgia segura",
        required: true
      },
      {
        id: 503,
        text: "Como é realizada a identificação do sítio cirúrgico?",
        type: "multiple_choice",
        category: "Identificação de Sítio",
        indicator: "Demarcação cirúrgica",
        required: true,
        options: ["Sempre demarcado pelo cirurgião", "Demarcado quando necessário", "Demarcação inconsistente", "Não há protocolo"]
      },
      {
        id: 504,
        text: "Há controle de temperatura e umidade nas salas cirúrgicas?",
        type: "yes_no",
        category: "Controle Ambiental",
        indicator: "Controle temperatura/umidade",
        required: true
      },
      {
        id: 505,
        text: "Existe protocolo de prevenção de infecção de sítio cirúrgico?",
        type: "yes_no",
        category: "Prevenção de Infecção",
        indicator: "Protocolo ISC",
        required: true
      }
    ]
  },
  {
    id: 6,
    name: "Unidade de Terapia Intensiva",
    description: "Cuidados intensivos, monitorização de pacientes críticos e protocolos específicos",
    questions: [
      {
        id: 601,
        text: "Existe protocolo de sedação e analgesia implementado?",
        type: "yes_no",
        category: "Protocolos Assistenciais",
        indicator: "Protocolo sedação",
        required: true
      },
      {
        id: 602,
        text: "Há protocolo de prevenção de pneumonia associada à ventilação mecânica?",
        type: "yes_no",
        category: "Prevenção de Infecção",
        indicator: "Protocolo PAV",
        required: true
      },
      {
        id: 603,
        text: "Qual a relação enfermeiro/paciente na UTI?",
        type: "multiple_choice",
        category: "Dimensionamento",
        indicator: "Relação enfermeiro/paciente",
        required: true,
        options: ["1:2 ou melhor", "1:3", "1:4", "1:5", "Acima de 1:5"]
      },
      {
        id: 604,
        text: "Existe protocolo de mobilização precoce?",
        type: "yes_no",
        category: "Reabilitação",
        indicator: "Mobilização precoce",
        required: true
      },
      {
        id: 605,
        text: "Há monitorização contínua de sinais vitais em todos os leitos?",
        type: "yes_no",
        category: "Monitorização",
        indicator: "Monitores multiparamétricos",
        required: true
      }
    ]
  },
  {
    id: 7,
    name: "Gestão de Resíduos",
    description: "Manejo adequado de resíduos de serviços de saúde e sustentabilidade ambiental",
    questions: [
      {
        id: 701,
        text: "Existe Plano de Gerenciamento de Resíduos de Serviços de Saúde (PGRSS)?",
        type: "yes_no",
        category: "Planejamento",
        indicator: "PGRSS atualizado",
        required: true
      },
      {
        id: 702,
        text: "Há segregação adequada dos resíduos na origem?",
        type: "yes_no",
        category: "Segregação",
        indicator: "Segregação na origem",
        required: true
      },
      {
        id: 703,
        text: "Como é realizado o treinamento sobre manejo de resíduos?",
        type: "multiple_choice",
        category: "Capacitação",
        indicator: "Treinamento resíduos",
        required: true,
        options: ["Treinamento regular e documentado", "Treinamento esporádico", "Orientação informal", "Não há treinamento"]
      },
      {
        id: 704,
        text: "Existe local adequado para armazenamento temporário de resíduos?",
        type: "yes_no",
        category: "Armazenamento",
        indicator: "Abrigo temporário",
        required: true
      },
      {
        id: 705,
        text: "Há controle e rastreabilidade dos resíduos até a destinação final?",
        type: "yes_no",
        category: "Controle",
        indicator: "Rastreabilidade",
        required: true
      }
    ]
  },
  {
    id: 8,
    name: "Gestão da Qualidade",
    description: "Sistema de qualidade, indicadores de desempenho e melhoria contínua",
    questions: [
      {
        id: 801,
        text: "Existe programa de qualidade institucional implementado?",
        type: "yes_no",
        category: "Sistema de Qualidade",
        indicator: "Programa de qualidade",
        required: true
      },
      {
        id: 802,
        text: "Há comitê ou núcleo de qualidade atuante?",
        type: "yes_no",
        category: "Estrutura Organizacional",
        indicator: "Núcleo de qualidade",
        required: true
      },
      {
        id: 803,
        text: "Com que frequência são analisados os indicadores de qualidade?",
        type: "multiple_choice",
        category: "Monitoramento",
        indicator: "Análise de indicadores",
        required: true,
        options: ["Mensal", "Trimestral", "Semestral", "Anual", "Não há análise sistemática"]
      },
      {
        id: 804,
        text: "Existe sistema de notificação de eventos adversos?",
        type: "yes_no",
        category: "Gestão de Riscos",
        indicator: "Notificação eventos",
        required: true
      },
      {
        id: 805,
        text: "Há programa de educação continuada para os profissionais?",
        type: "yes_no",
        category: "Desenvolvimento Profissional",
        indicator: "Educação continuada",
        required: true
      }
    ]
  }
];