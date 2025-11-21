
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface DocumentationSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const DocumentationSearch: React.FC<DocumentationSearchProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const categoryLabels = {
    'manual-sistema': 'Manual do Sistema',
    'vendas': 'Manual de Vendas',
    'marketing': 'Manual de Marketing',
    'proposta-valor': 'Proposta de Valor',
    'dores-empresas': 'Dores das Empresas',
    'benchmarks': 'Benchmarks'
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documentação..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          Todas as Categorias
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
          >
            {categoryLabels[category as keyof typeof categoryLabels] || category}
          </Button>
        ))}
      </div>
    </div>
  );
};
