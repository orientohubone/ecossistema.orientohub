
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentationItem } from '@/types/documentation';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Download, 
  ExternalLink,
  Eye,
  Clock
} from 'lucide-react';

interface DocumentationCardProps {
  document: DocumentationItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DocumentationCard: React.FC<DocumentationCardProps> = ({
  document,
  isFavorite,
  onToggleFavorite
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewCount, setViewCount] = useState(document.viewCount || 0);

  const handleView = () => {
    setViewCount(prev => prev + 1);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'manual-sistema': 'bg-blue-100 text-blue-800',
      'vendas': 'bg-green-100 text-green-800',
      'marketing': 'bg-purple-100 text-purple-800',
      'proposta-valor': 'bg-yellow-100 text-yellow-800',
      'dores-empresas': 'bg-red-100 text-red-800',
      'benchmarks': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <document.icon className="h-5 w-5 text-primary" />
            <Badge className={getCategoryColor(document.category)}>
              {document.categoryLabel}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(document.id)}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
        </div>
        
        <CardTitle className="text-lg">{document.title}</CardTitle>
        <CardDescription>{document.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {viewCount} visualizações
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {document.estimatedReadTime} min
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) handleView();
            }}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? 'Fechar' : 'Ver Conteúdo'}
          </Button>
          
          {document.downloadUrl && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          )}
          
          {document.externalUrl && (
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Link
            </Button>
          )}
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            <div className="border-t pt-4">
              {document.content.map((section, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    {section.icon && <section.icon className="h-4 w-4" />}
                    {section.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {section.description}
                  </p>
                  {section.items && (
                    <ul className="space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
