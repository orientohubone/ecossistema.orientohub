import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, FileText, GamepadIcon, Download, Sparkles, Zap, BookOpen } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FrameworkModal = ({ isOpen, onClose, title, children }: FrameworkModalProps) => {
  const navigate = useNavigate();

  const handleGenerateTemplate = async () => {
    try {
      // Get the content element
      const content = document.getElementById('framework-content');
      if (!content) return;

      // Create canvas from content
      const canvas = await html2canvas(content);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // Save PDF
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-template.pdf`);
    } catch (error) {
      console.error('Error generating template:', error);
    }
  };

  const handleStartGamification = () => {
    // Store the current framework in session storage
    sessionStorage.setItem('currentFramework', title);
    
    // Navigate to gamification page
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
                {/* Header com gradiente */}
                <div className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700 p-6">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-3xl" />
                  </div>
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-7 h-7 text-black" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {title}
                          <Sparkles className="w-5 h-5 text-primary-500" />
                        </Dialog.Title>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Explore e aplique este framework ao seu negócio
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleStartGamification}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 group"
                    >
                      <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Modo Gamificado
                      <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">Novo</span>
                    </button>
                    
                    <button
                      onClick={handleGenerateTemplate}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-bold rounded-xl transition-all group"
                    >
                      <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      Baixar Template PDF
                    </button>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        <strong>Dica:</strong> Use o modo gamificado para uma experiência interativa e aprenda enquanto constrói seu framework!
                      </span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div 
                    id="framework-content" 
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                      prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-primary-600 dark:prose-h3:text-primary-400
                      prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-gray-800 dark:prose-h4:text-gray-200
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-ul:my-4 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
                      prose-ol:my-4 prose-ol:list-decimal
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                      prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    "
                  >
                    {children}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pronto para começar? Escolha uma das opções acima.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all"
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
