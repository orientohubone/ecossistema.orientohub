import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  X, 
  Clock, 
  Calendar, 
  FileText, 
  ChevronRight,
  BookOpen,
  ExternalLink,
  Print,
  Share2,
  Bookmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentationViewerProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onGeneratePDF: (document: any) => void;
  isGeneratingPDF: boolean;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  document,
  isOpen,
  onClose,
  onGeneratePDF,
  isGeneratingPDF
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const { toast } = useToast();

  if (!document) return null;

  const copyToClipboard = () => {
    const content = document.content.map((section: any) => {
      return `${section.title}\n\n${section.description}\n\n${section.items.map((item: string) => `• ${item}`).join('\n')}\n\n`;
    }).join('');

    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Conteúdo Copiado",
        description: "O conteúdo da documentação foi copiado para a área de transferência.",
      });
    });
  };

  const shareDocument = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: document.description,
        url: window.location.href
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background border-border">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <document.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">{document.title}</DialogTitle>
                <p className="text-muted-foreground mt-1">{document.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{document.categoryLabel}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {document.estimatedReadTime} min
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {document.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={shareDocument}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <BookOpen className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar com navegação */}
          <div className="w-80 min-w-80 max-w-80 border-r border-border bg-muted/30 flex flex-col hidden md:flex">
            <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
              <h3 className="font-semibold text-foreground text-sm  mb-2">Sumário</h3>
              <p className="text-xs text-muted-foreground">{document.content.length} seções</p>
            </div>
            <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
              <div className="p-2 space-y-1">
                {document.content.map((section: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-card/80 group ${
                      activeSection === index 
                        ? 'bg-primary/10 border-l-4 border-primary shadow-sm' 
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-medium transition-colors ${
                        activeSection === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm leading-tight mb-1 ${activeSection === index ? 'text-primary' : 'text-foreground'}`}>
                          {section.title}
                        </div>
                        <div className={`text-xs leading-relaxed line-clamp-2 ${
                          activeSection === index ? 'text-primary/70' : 'text-muted-foreground'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform flex-shrink-0 ${
                        activeSection === index ? 'rotate-90' : ''
                      } ${activeSection === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col">
            {/* Navegação móvel */}
            <div className="md:hidden border-b border-border bg-muted/30 p-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-sm"
              >
                {document.content.map((section: any, index: number) => (
                  <option key={index} value={index}>
                    {index + 1}. {section.title}
                  </option>
                ))}
              </select>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                {document.content.map((section: any, index: number) => (
                  <div
                    key={index}
                    className={`mb-8 ${activeSection === index ? 'block' : 'hidden'}`}
                  >
                    {/* Header da seção */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <section.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {index + 1}. {section.title}
                        </h2>
                        <p className="text-muted-foreground mt-1">{section.description}</p>
                      </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Conteúdo da seção */}
                    <div className="space-y-4">
                      {section.items.map((item: string, itemIndex: number) => (
                        <div key={itemIndex} className="flex gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-foreground leading-relaxed">{item}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navegação entre seções */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                        disabled={activeSection === 0}
                        className="w-full sm:w-auto border-border hover:bg-accent"
                      >
                        ← Seção Anterior
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {activeSection + 1} de {document.content.length}
                        </span>
                        <div className="flex gap-1">
                          {document.content.map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSection(idx)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                idx === activeSection ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveSection(Math.min(document.content.length - 1, activeSection + 1))}
                        disabled={activeSection === document.content.length - 1}
                        className="w-full sm:w-auto border-border hover:bg-accent"
                      >
                        Próxima Seção →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer com ações */}
            <div className="border-t border-border p-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{document.content.length} seções • {document.estimatedReadTime} min de leitura</span>
                </div>
                <div className="flex gap-2">
                  {document.externalUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document.externalUrl, '_blank')}
                      className="border-border hover:bg-accent"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Online
                    </Button>
                  )}
                  <Button
                    onClick={() => onGeneratePDF(document)}
                    disabled={isGeneratingPDF}
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGeneratingPDF ? 'Gerando PDF...' : 'Download PDF'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};