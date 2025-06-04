import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, FileText, GamepadIcon } from 'lucide-react';

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FrameworkModal = ({ isOpen, onClose, title, children }: FrameworkModalProps) => {
  const handleGenerateTemplate = () => {
    // Template generation logic will be implemented here
    console.log('Generating template for:', title);
  };

  const handleStartGamification = () => {
    // Gamification flow will be implemented here
    console.log('Starting gamification for:', title);
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
          <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-semibold">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={handleGenerateTemplate}
                      className="flex items-center px-4 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <FileText size={18} className="mr-2" />
                      Gerar Template
                    </button>
                    <button
                      onClick={handleStartGamification}
                      className="flex items-center px-4 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <GamepadIcon size={18} className="mr-2" />
                      Modo Gamificado
                    </button>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  {children}
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