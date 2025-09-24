export interface Question {
  id: number;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'text' | 'number' | 'photo_evidence';
  category: string;
  indicator: string;
  required: boolean;
  options?: string[];
  answer?: any;
  photos?: File[];
  observations?: string;
}

export interface Sector {
  id: number;
  name: string;
  description: string;
  questions: Question[];
}

export interface AuditResult {
  sectorId: number;
  sectorName: string;
  completedAt: Date;
  answers: { [questionId: number]: any };
  photos: { [questionId: number]: File[] };
  observations: { [questionId: number]: string };
  score: number;
  conformityPercentage: number;
}