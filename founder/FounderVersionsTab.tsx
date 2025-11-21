import { useState } from 'react';
import { useSystemVersions } from '@/hooks/useSystemVersions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Sparkles, 
  Bug, 
  Trash2, 
  Shield, 
  AlertTriangle,
  Package,
  Calendar,
  User,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const categoryIcons: Record<string, React.ComponentType<any>> = {
  feature: Sparkles,
  improvement: Code,
  bugfix: Bug,
  security: Shield,
  infrastructure: Package,
  deprecated: AlertTriangle
};

const categoryColors: Record<string, string> = {
  feature: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  improvement: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  bugfix: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  security: 'bg-red-500/10 text-red-600 border-red-500/20',
  infrastructure: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  deprecated: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
};

const changeTypeIcons: Record<string, React.ComponentType<any>> = {
  added: Sparkles,
  changed: Code,
  fixed: Bug,
  removed: Trash2,
  security: Shield,
  deprecated: AlertTriangle
};

const changeTypeColors: Record<string, string> = {
  added: 'text-emerald-600 dark:text-emerald-400',
  changed: 'text-blue-600 dark:text-blue-400',
  fixed: 'text-amber-600 dark:text-amber-400',
  removed: 'text-red-600 dark:text-red-400',
  security: 'text-red-700 dark:text-red-500',
  deprecated: 'text-gray-600 dark:text-gray-400'
};

export const FounderVersionsTab = () => {
  const { versions, loading, fetchVersions } = useSystemVersions();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredVersions = selectedTag
    ? versions.filter(v => v.impact_tags?.includes(selectedTag))
    : versions;

  const allTags = Array.from(
    new Set(versions.flatMap(v => v.impact_tags || []))
  );

  return (
    <div className="space-y-6" data-testid="founder-versions-tab">
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Controle de Versões do Sistema
              </CardTitle>
              <CardDescription>
                Histórico completo de mudanças, melhorias e correções
              </CardDescription>
            </div>
            <Button
              onClick={() => fetchVersions()}
              variant="outline"
              size="sm"
              className="gap-2"
              data-testid="button-refresh-versions"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar por Tag de Impacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                data-testid="filter-all-tags"
              >
                Todas
              </Button>
              {allTags.map(tag => {
                const Icon = categoryIcons[tag] || Code;
                return (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="gap-2"
                    data-testid={`filter-tag-${tag}`}
                  >
                    <Icon className="h-3 w-3" />
                    {tag}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Versions List */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-emerald-600 mb-4" />
            <p className="text-muted-foreground">Carregando versões...</p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredVersions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">
              {selectedTag
                ? `Nenhuma versão encontrada para a tag "${selectedTag}"`
                : 'Nenhuma versão registrada ainda'}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredVersions.length > 0 && (
        <ScrollArea className="h-[600px]">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredVersions.map((version) => (
              <AccordionItem
                key={version.id}
                value={version.id}
                className="border rounded-lg overflow-hidden"
                data-testid={`version-item-${version.version}`}
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          v{version.version}
                        </Badge>
                        <h3 className="font-semibold">{version.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(version.release_date), 'dd MMM yyyy', { locale: ptBR })}
                        </span>
                        {version.impact_tags && version.impact_tags.length > 0 && (
                          <div className="flex gap-1">
                            {version.impact_tags.map(tag => {
                              const Icon = categoryIcons[tag] || Code;
                              return (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className={`text-xs ${categoryColors[tag] || ''}`}
                                >
                                  <Icon className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  {version.summary && (
                    <p className="text-muted-foreground mb-4">{version.summary}</p>
                  )}
                  
                  <div className="space-y-3">
                    {version.changes.map((change, idx) => {
                      const Icon = changeTypeIcons[change.type] || Code;
                      const colorClass = changeTypeColors[change.type] || '';
                      
                      return (
                        <div
                          key={idx}
                          className="flex gap-3 items-start p-3 rounded-lg bg-muted/30"
                          data-testid={`change-${change.type}-${idx}`}
                        >
                          <Icon className={`h-4 w-4 mt-0.5 ${colorClass}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {change.type}
                              </Badge>
                              {change.module && (
                                <Badge variant="secondary" className="text-xs">
                                  {change.module}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{change.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      )}
    </div>
  );
};
