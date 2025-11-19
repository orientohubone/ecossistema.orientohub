import type { LucideIcon } from 'lucide-react';
import { BookOpen, Target, TrendingUp, Users, Trophy } from 'lucide-react';

export interface CourseMaterial {
  id: string;
  label: string;
  url: string;
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
  lessons: number;
  duration: string;
  completed: boolean;
  progress: number;
  thumbnail: string;
  instructor: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  youtubeUrl?: string;
  materials?: CourseMaterial[];
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
    lessons: 12,
    duration: '4h 30min',
    completed: false,
    progress: 0,
    thumbnail: '/course-validation.jpg',
    instructor: 'João Silva',
    category: 'validation',
    tags: ['Lean Startup', 'MVP', 'Entrevistas'],
    isPremium: false,
    youtubeUrl: 'https://www.youtube.com/watch?v=123',
    materials: [
      { id: 'm11', label: 'Checklist de Validação', url: 'https://orientohub.notion.site/checklist' },
      { id: 'm12', label: 'Template de Entrevista', url: 'https://drive.google.com/template' }
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
    lessons: 15,
    duration: '6h 15min',
    completed: true,
    progress: 100,
    thumbnail: '/course-growth.jpg',
    instructor: 'Maria Santos',
    category: 'growth',
    tags: ['Marketing', 'Métricas', 'Automação'],
    isPremium: true,
    youtubeUrl: 'https://www.youtube.com/watch?v=456',
    materials: [
      { id: 'm21', label: 'Planilha North Star Metrics', url: 'https://orientohub.com/materials/north-star.xlsx' }
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
    lessons: 10,
    duration: '5h 20min',
    completed: false,
    progress: 30,
    thumbnail: '/course-leadership.jpg',
    instructor: 'Pedro Costa',
    category: 'leadership',
    tags: ['Gestão', 'Cultura', 'Team Building'],
    isPremium: true,
    youtubeUrl: 'https://www.youtube.com/watch?v=789'
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
    lessons: 8,
    duration: '4h 45min',
    completed: false,
    progress: 0,
    thumbnail: '/course-investment.jpg',
    instructor: 'Ana Rodrigues',
    category: 'finance',
    tags: ['Pitch', 'Valuation', 'Term Sheet'],
    isPremium: true,
    youtubeUrl: 'https://www.youtube.com/watch?v=101112'
  }
];
