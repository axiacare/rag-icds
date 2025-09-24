import { Sector } from "@/types/audit";

export const hospitalSectors: Sector[] = [
  {
    id: 1,
    name: "UTI - Unidade de Terapia Intensiva",
    description: "Auditoria de equipamentos, protocolos e segurança do paciente crítico",
    questions: [
      {
        id: 1,
        text: "Os leitos possuem monitor multiparamétrico funcionando adequadamente?",
        type: "yes_no",
        category: "Equipamentos",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 2,
        text: "Qual o estado de conservação dos respiradores disponíveis?",
        type: "multiple_choice",
        category: "Equipamentos",
        indicator: "Qualidade Assistencial",
        required: true,
        options: ["Excelente", "Bom", "Regular", "Ruim", "Péssimo"]
      },
      {
        id: 3,
        text: "Anexar foto do painel de gases medicinais",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 4,
        text: "Quantos profissionais de enfermagem estão presentes no turno?",
        type: "number",
        category: "Recursos Humanos",
        indicator: "Dimensionamento",
        required: true
      },
      {
        id: 5,
        text: "Os protocolos de sepse estão atualizados e disponíveis?",
        type: "yes_no",
        category: "Protocolos",
        indicator: "Qualidade Assistencial",
        required: true
      },
      {
        id: 6,
        text: "Descreva as condições de higienização das mãos na unidade",
        type: "text",
        category: "Controle de Infecção",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 7,
        text: "Anexar foto dos equipamentos de emergência (carro de parada)",
        type: "photo_evidence",
        category: "Equipamentos",
        indicator: "Segurança do Paciente",
        required: true
      }
    ]
  },
  {
    id: 2,
    name: "Centro Cirúrgico",
    description: "Verificação de normas de esterilização, equipamentos e procedimentos",
    questions: [
      {
        id: 8,
        text: "As salas cirúrgicas possuem sistema de ar condicionado adequado?",
        type: "yes_no",
        category: "Infraestrutura",
        indicator: "Controle de Infecção",
        required: true
      },
      {
        id: 9,
        text: "Qual o estado dos equipamentos de esterilização?",
        type: "multiple_choice",
        category: "Equipamentos",
        indicator: "Segurança do Paciente",
        required: true,
        options: ["Excelente", "Bom", "Regular", "Necessita Manutenção", "Fora de Uso"]
      },
      {
        id: 10,
        text: "Anexar foto da central de esterilização",
        type: "photo_evidence",
        category: "Controle de Infecção",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 11,
        text: "Os cirurgiões seguem adequadamente os protocolos de paramentação?",
        type: "yes_no",
        category: "Protocolos",
        indicator: "Controle de Infecção",
        required: true
      },
      {
        id: 12,
        text: "Quantas salas cirúrgicas estão em funcionamento?",
        type: "number",
        category: "Infraestrutura",
        indicator: "Capacidade Operacional",
        required: true
      },
      {
        id: 13,
        text: "Descreva o processo de checklist de segurança cirúrgica",
        type: "text",
        category: "Protocolos",
        indicator: "Segurança do Paciente",
        required: true
      }
    ]
  },
  {
    id: 3,
    name: "Emergência / Pronto Socorro",
    description: "Auditoria de fluxo de atendimento, triagem e recursos disponíveis",
    questions: [
      {
        id: 14,
        text: "O sistema de triagem (Protocolo Manchester) está funcionando?",
        type: "yes_no",
        category: "Protocolos",
        indicator: "Qualidade Assistencial",
        required: true
      },
      {
        id: 15,
        text: "Qual a avaliação do tempo médio de espera?",
        type: "multiple_choice",
        category: "Fluxo Assistencial",
        indicator: "Qualidade Assistencial",
        required: true,
        options: ["Muito Bom (< 15min)", "Bom (15-30min)", "Regular (30-60min)", "Ruim (1-2h)", "Péssimo (> 2h)"]
      },
      {
        id: 16,
        text: "Anexar foto da sala de emergência/trauma",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 17,
        text: "Quantos leitos de observação estão disponíveis?",
        type: "number",
        category: "Infraestrutura",
        indicator: "Capacidade Assistencial",
        required: true
      },
      {
        id: 18,
        text: "Os medicamentos de emergência estão organizados e dentro do prazo?",
        type: "yes_no",
        category: "Medicamentos",
        indicator: "Segurança do Paciente",
        required: true
      }
    ]
  },
  {
    id: 4,
    name: "Enfermaria Geral",
    description: "Verificação de cuidados de enfermagem e conforto do paciente",
    questions: [
      {
        id: 19,
        text: "Os leitos possuem grades de segurança funcionais?",
        type: "yes_no",
        category: "Equipamentos",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 20,
        text: "Como você avalia a limpeza dos quartos?",
        type: "multiple_choice",
        category: "Infraestrutura",
        indicator: "Controle de Infecção",
        required: true,
        options: ["Excelente", "Boa", "Regular", "Deficiente", "Crítica"]
      },
      {
        id: 21,
        text: "Anexar foto de um quarto típico da enfermaria",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Conforto do Paciente",
        required: true
      },
      {
        id: 22,
        text: "Qual a proporção enfermeiro/paciente no turno atual?",
        type: "text",
        category: "Recursos Humanos",
        indicator: "Dimensionamento",
        required: true
      }
    ]
  },
  {
    id: 5,
    name: "Farmácia Hospitalar",
    description: "Auditoria de armazenamento, dispensação e controle de medicamentos",
    questions: [
      {
        id: 23,
        text: "Os medicamentos estão armazenados em temperatura adequada?",
        type: "yes_no",
        category: "Armazenamento",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 24,
        text: "Como está o controle de estoque de medicamentos controlados?",
        type: "multiple_choice",
        category: "Controle",
        indicator: "Conformidade Regulatória",
        required: true,
        options: ["Excelente", "Bom", "Adequado", "Deficiente", "Crítico"]
      },
      {
        id: 25,
        text: "Anexar foto da área de armazenamento refrigerado",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Segurança do Paciente",
        required: true
      },
      {
        id: 26,
        text: "Quantos farmacêuticos atuam na unidade?",
        type: "number",
        category: "Recursos Humanos",
        indicator: "Dimensionamento",
        required: true
      }
    ]
  },
  {
    id: 6,
    name: "Laboratório",
    description: "Verificação de processos, equipamentos e controle de qualidade",
    questions: [
      {
        id: 27,
        text: "Os equipamentos de análise estão calibrados e em funcionamento?",
        type: "yes_no",
        category: "Equipamentos",
        indicator: "Qualidade Analítica",
        required: true
      },
      {
        id: 28,
        text: "Como está o controle de qualidade dos exames?",
        type: "multiple_choice",
        category: "Qualidade",
        indicator: "Confiabilidade",
        required: true,
        options: ["Excelente", "Bom", "Adequado", "Necessita Melhoria", "Crítico"]
      },
      {
        id: 29,
        text: "Anexar foto da área de processamento de amostras",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Biossegurança",
        required: true
      },
      {
        id: 30,
        text: "Qual o tempo médio de liberação de resultados de exames urgentes (minutos)?",
        type: "number",
        category: "Processos",
        indicator: "Agilidade",
        required: true
      }
    ]
  },
  {
    id: 7,
    name: "Radiologia e Imagem",
    description: "Auditoria de equipamentos, proteção radiológica e laudos",
    questions: [
      {
        id: 31,
        text: "Os equipamentos de proteção individual (EPIs) estão disponíveis?",
        type: "yes_no",
        category: "Proteção Radiológica",
        indicator: "Segurança Ocupacional",
        required: true
      },
      {
        id: 32,
        text: "Qual o estado de conservação dos equipamentos de imagem?",
        type: "multiple_choice",
        category: "Equipamentos",
        indicator: "Qualidade de Imagem",
        required: true,
        options: ["Excelente", "Bom", "Regular", "Necessita Manutenção", "Crítico"]
      },
      {
        id: 33,
        text: "Anexar foto da sala de comando de um equipamento",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Segurança Radiológica",
        required: true
      },
      {
        id: 34,
        text: "Quantos radiologistas estão disponíveis para laudos?",
        type: "number",
        category: "Recursos Humanos",
        indicator: "Capacidade de Laudos",
        required: true
      }
    ]
  },
  {
    id: 8,
    name: "Administração e RH",
    description: "Verificação de processos administrativos e gestão de recursos humanos",
    questions: [
      {
        id: 35,
        text: "Os funcionários possuem capacitação em segurança do trabalho?",
        type: "yes_no",
        category: "Capacitação",
        indicator: "Segurança Ocupacional",
        required: true
      },
      {
        id: 36,
        text: "Como você avalia a gestão de documentos e prontuários?",
        type: "multiple_choice",
        category: "Gestão Documental",
        indicator: "Organização",
        required: true,
        options: ["Excelente", "Boa", "Regular", "Deficiente", "Crítica"]
      },
      {
        id: 37,
        text: "Anexar foto do arquivo de prontuários",
        type: "photo_evidence",
        category: "Infraestrutura",
        indicator: "Organização",
        required: true
      },
      {
        id: 38,
        text: "Descreva o processo de admissão de novos funcionários",
        type: "text",
        category: "Processos de RH",
        indicator: "Gestão de Pessoas",
        required: true
      }
    ]
  }
];