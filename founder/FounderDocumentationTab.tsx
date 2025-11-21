
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentationCard } from './DocumentationCard';
import { DocumentationSearch } from './DocumentationSearch';
import { DocumentationViewer } from './DocumentationViewer';
import { documentationData } from '@/data/documentationData';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  BookOpen, 
  Star, 
  Download, 
  FileText, 
  ExternalLink,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  Calendar
} from 'lucide-react';

export const FounderDocumentationTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);
  const [viewerDocument, setViewerDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  const filteredDocuments = documentationData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.some(item => 
                           item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(documentationData.map(doc => doc.category))];

  const toggleFavorite = (docId: string) => {
    setFavorites(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const generatePDF = async (document: any) => {
    setIsGeneratingPDF(document.id);
    
    try {
      // Simular geração de PDF com conteúdo real
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Configurar fonte
      doc.setFont('helvetica');
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229); // Cor primária
      doc.text('HumanSys - Documentação', 20, 25);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(document.title, 20, 40);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(document.description, 20, 50);
      
      // Informações do documento
      doc.setFontSize(10);
      doc.text(`Última atualização: ${document.lastUpdated}`, 20, 60);
      doc.text(`Tempo estimado de leitura: ${document.estimatedReadTime} minutos`, 20, 65);
      
      // Linha separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 75, 190, 75);
      
      let yPosition = 85;
      
      // Conteúdo
      document.content.forEach((section: any, index: number) => {
        // Verificar se precisa de nova página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Título da seção
        doc.setFontSize(14);
        doc.setTextColor(79, 70, 229);
        doc.text(`${index + 1}. ${section.title}`, 20, yPosition);
        yPosition += 10;
        
        // Descrição da seção
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const descriptionLines = doc.splitTextToSize(section.description, 170);
        doc.text(descriptionLines, 20, yPosition);
        yPosition += descriptionLines.length * 5 + 5;
        
        // Items da seção
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        section.items.forEach((item: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          
          const itemLines = doc.splitTextToSize(`• ${item}`, 165);
          doc.text(itemLines, 25, yPosition);
          yPosition += itemLines.length * 4 + 2;
        });
        
        yPosition += 10; // Espaço entre seções
      });
      
      // Footer na última página
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount}`, 170, 290);
        doc.text('© 2025 HumanSys - Todos os direitos reservados', 20, 290);
      }
      
      // Download do PDF
      const filename = `HumanSys_${document.title.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
      doc.save(filename);
      
      toast({
        title: "PDF Gerado com Sucesso!",
        description: `${document.title} foi baixado como PDF`,
      });
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao Gerar PDF",
        description: "Não foi possível gerar o documento PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openViewer = (document: any) => {
    setViewerDocument(document);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewerDocument(null);
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Central de Documentação
              </CardTitle>
              <CardDescription className="text-lg">
                Acesso completo aos manuais e guias da plataforma HumanSys
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{documentationData.length}</div>
              <div className="text-sm text-blue-600">Documentos</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold">Manual Completo</div>
              <div className="text-sm text-gray-600">20 capítulos detalhados</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-semibold">45+ min</div>
              <div className="text-sm text-gray-600">Tempo de leitura total</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold">Atualizado</div>
              <div className="text-sm text-gray-600">Janeiro 2025</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Busca e filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Documentação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {documentationData.find(doc => doc.category === category)?.categoryLabel}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <div className="grid gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <document.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{document.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {document.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {document.estimatedReadTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {document.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{document.categoryLabel}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(document.id)}
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        favorites.includes(document.id) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preview do conteúdo */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {document.content.slice(0, 3).map((section, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <section.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{section.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {section.description}
                      </p>
                    </div>
                  ))}
                  {document.content.length > 3 && (
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        +{document.content.length - 3} seções
                      </span>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => generatePDF(document)}
                    disabled={isGeneratingPDF === document.id}
                    className="flex-1"
                  >
                    {isGeneratingPDF === document.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Gerando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  
                  {document.externalUrl && (
                    <Button
                      variant="outline"
                      onClick={() => openExternalLink(document.externalUrl!)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Online
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openViewer(document)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca para encontrar a documentação desejada.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Documentation Viewer Modal */}
      <DocumentationViewer
        document={viewerDocument}
        isOpen={isViewerOpen}
        onClose={closeViewer}
        onGeneratePDF={generatePDF}
        isGeneratingPDF={isGeneratingPDF === viewerDocument?.id}
      />
    </div>
  );
};
