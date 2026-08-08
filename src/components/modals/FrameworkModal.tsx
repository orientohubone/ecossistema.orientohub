import { Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Gamepad, Download, Sparkles, BookOpen } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  enableGamification?: boolean;
}

const FrameworkModal = ({ isOpen, onClose, title, children, enableGamification = true }: FrameworkModalProps) => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // Add animation to list items when modal opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const listItems = contentRef.current.querySelectorAll('li');
      listItems.forEach((item, index) => {
        (item as HTMLElement).style.opacity = '0';
        (item as HTMLElement).style.transform = 'translateX(-10px)';
        setTimeout(() => {
          (item as HTMLElement).style.transition = 'all 0.3s ease-out';
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'translateX(0)';
        }, index * 50);
      });

      const headers = contentRef.current.querySelectorAll('h4');
      headers.forEach((header, index) => {
        (header as HTMLElement).style.opacity = '0';
        (header as HTMLElement).style.transform = 'translateY(-10px)';
        setTimeout(() => {
          (header as HTMLElement).style.transition = 'all 0.4s ease-out';
          (header as HTMLElement).style.opacity = '1';
          (header as HTMLElement).style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }, [isOpen]);

  const handleGenerateTemplate = async () => {
    try {
      const content = document.getElementById('framework-content');
      if (!content) return;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const margin = 18;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;
      let cursorY = 24;

      const addPageIfNeeded = (height: number) => {
        if (cursorY + height <= pageHeight - 18) return;
        pdf.addPage();
        cursorY = 20;
      };
      const write = (text: string, size = 11, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [55, 65, 81]) => {
        pdf.setFont('helvetica', style); pdf.setFontSize(size); pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text.trim(), usableWidth);
        addPageIfNeeded(lines.length * (size * 0.48) + 5);
        pdf.text(lines, margin, cursorY);
        cursorY += lines.length * (size * 0.48) + 5;
      };

      pdf.setFillColor(250, 204, 21); pdf.rect(0, 0, pageWidth, 8, 'F');
      write('ORIENTOHUB  |  FRAMEWORK ESTRATÉGICO', 9, 'bold', [107, 114, 128]);
      write(title, 22, 'bold', [17, 24, 39]);
      write(`Guia de aplicação • Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 9, 'normal', [107, 114, 128]);
      cursorY += 5;

      const elements = Array.from(content.querySelectorAll('h2, h3, h4, p, li'));
      elements.forEach((element) => {
        const text = element.textContent?.replace(/\s+/g, ' ').trim();
        if (!text) return;
        if (/^H[2-4]$/.test(element.tagName)) write(text, element.tagName === 'H2' ? 16 : 13, 'bold', [17, 24, 39]);
        else write(`${element.tagName === 'LI' ? '• ' : ''}${text}`, 10.5);
      });

      const totalPages = pdf.getNumberOfPages();
      for (let page = 1; page <= totalPages; page++) {
        pdf.setPage(page); pdf.setFontSize(8); pdf.setTextColor(107, 114, 128);
        pdf.text(`OrientoHub • ${title}`, margin, pageHeight - 10);
        pdf.text(`${page}/${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-template.pdf`);
    } catch (error) {
      console.error('Error generating template:', error);
    }
  };

  const handleStartGamification = () => {
    sessionStorage.setItem('currentFramework', title);
    
    const frameworkId = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/frameworks/${frameworkId}/game`);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all border-2 border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700 p-6">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-3xl" />
                  </div>
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700">
                        <BookOpen className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Explore e aplique este framework ao seu negócio
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-3">
                    {enableGamification && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStartGamification}
                        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-black rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30"
                      >
                        <Gamepad className="w-5 h-5" />
                        Modo Gamificado
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateTemplate}
                      className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black rounded-xl font-medium transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Baixar PDF
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <strong className="font-semibold">Dica:</strong> {enableGamification ? 'Use o modo gamificado para uma experiência interativa passo a passo, ou baixe o PDF para trabalhar offline.' : 'Baixe o PDF para trabalhar offline ou compartilhe esta estrutura com o seu time.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content with Enhanced Styling */}
                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto styled-scrollbar">
                  <div 
                    ref={contentRef}
                    id="framework-content" 
                    className="framework-content-enhanced"
                  >
                    {children}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💡 Aplique este framework ao seu negócio para estruturar melhor sua estratégia
                    </p>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FrameworkModal;
