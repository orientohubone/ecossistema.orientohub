import type { LucideIcon } from 'lucide-react';
import { BookOpen, Target, TrendingUp, Users, Trophy } from 'lucide-react';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'link' | 'other';
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoId?: string;
  videoUrl?: string;
  duration?: string;
  attachments?: Attachment[];
  isFree?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  badge: string;
  rating: number;
  reviews: number;
  students: number;
  // Derived from modules/lessons in real app, but kept for UI simplicity in mock
  lessonsCount: number;
  duration: string;
  completed: boolean;
  progress: number;
  thumbnail: string;
  instructor: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  modules: Module[];
}

export interface AcademyCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const academyCategories: AcademyCategory[] = [
  { id: 'all', name: 'Todos', icon: BookOpen },
  { id: 'validation', name: 'Validação', icon: Target },
  { id: 'growth', name: 'Growth', icon: TrendingUp },
  { id: 'leadership', name: 'Liderança', icon: Users },
  { id: 'finance', name: 'Finanças', icon: Trophy }
];

export const defaultCourses: Course[] = [
  {
    id: 1,
    title: 'Validação de Ideias na Prática',
    description: 'Aprenda metodologias comprovadas para validar sua ideia de negócio antes de investir tempo e dinheiro.',
    level: 'Iniciante',
    badge: 'Validador',
    rating: 4.8,
    reviews: 120,
    students: 850,
    lessonsCount: 12,
    duration: '4h 30min',
    completed: false,
    progress: 0,
    thumbnail: 'https://placehold.co/800x400/0f172a/e2e8f0?text=Validação+de+Ideias',
    instructor: 'João Silva',
    category: 'validation',
    tags: ['Lean Startup', 'MVP', 'Entrevistas'],
    isPremium: false,
    modules: [
      {
        id: 'm1',
        title: 'Introdução à Validação',
        lessons: [
          {
            id: 'l1',
            title: 'O que é validação?',
            description: 'Conceitos fundamentais sobre validação de startups.',
            videoUrl: 'https://www.youtube.com/watch?v=123',
            duration: '15:00',
            isFree: true,
            attachments: [
              { id: 'a1', name: 'Checklist de Validação', url: 'https://orientohub.notion.site/checklist', type: 'link' }
            ]
          },
          {
            id: 'l2',
            title: 'Tipos de MVP',
            description: 'Entenda os diferentes tipos de Produto Mínimo Viável.',
            videoUrl: 'https://www.youtube.com/watch?v=124',
            duration: '20:00'
          }
        ]
      },
      {
        id: 'm2',
        title: 'Entrevistas com Usuários',
        lessons: [
          {
            id: 'l3',
            title: 'Como roteirizar entrevistas',
            videoUrl: 'https://www.youtube.com/watch?v=125',
            duration: '25:00',
            attachments: [
              { id: 'a2', name: 'Template de Entrevista', url: 'https://drive.google.com/template', type: 'doc' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Growth Hacking Avançado',
    description: 'Estratégias práticas de crescimento acelerado utilizadas por startups de sucesso.',
    level: 'Intermediário',
    badge: 'Growth Master',
    rating: 4.9,
    reviews: 98,
    students: 650,
    lessonsCount: 15,
    duration: '6h 15min',
    completed: true,
    progress: 100,
    thumbnail: 'https://placehold.co/800x400/0f172a/e2e8f0?text=Growth+Hacking',
    instructor: 'Maria Santos',
    category: 'growth',
    tags: ['Marketing', 'Métricas', 'Automação'],
    isPremium: true,
    modules: [
      {
        id: 'm1',
        title: 'Fundamentos de Growth',
        lessons: [
          {
            id: 'l1',
            title: 'O funil pirata (AARRR)',
            videoUrl: 'https://www.youtube.com/watch?v=456',
            duration: '30:00',
            attachments: [
              { id: 'a1', name: 'Planilha North Star Metrics', url: 'https://orientohub.com/materials/north-star.xlsx', type: 'other' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Liderança para Founders',
    description: 'Desenvolva habilidades essenciais de liderança para construir e gerenciar times de alta performance.',
    level: 'Avançado',
    badge: 'Líder',
    rating: 4.7,
    reviews: 76,
    students: 420,
    lessonsCount: 10,
    duration: '5h 20min',
    completed: false,
    progress: 30,
    thumbnail: 'https://placehold.co/800x400/0f172a/e2e8f0?text=Liderança',
    instructor: 'Pedro Costa',
    category: 'leadership',
    tags: ['Gestão', 'Cultura', 'Team Building'],
    isPremium: true,
    modules: []
  },
  {
    id: 4,
    title: 'Captação de Investimento',
    description: 'Prepare sua startup para rodadas de investimento e aprenda a negociar com investidores.',
    level: 'Avançado',
    badge: 'Investidor',
    rating: 4.9,
    reviews: 54,
    students: 380,
    lessonsCount: 8,
    duration: '4h 45min',
    completed: false,
    progress: 0,
    thumbnail: 'https://placehold.co/800x400/0f172a/e2e8f0?text=Investimento',
    instructor: 'Ana Rodrigues',
    category: 'finance',
    tags: ['Pitch', 'Valuation', 'Term Sheet'],
    isPremium: true,
    modules: []
  }
];
