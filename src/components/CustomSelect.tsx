import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  required?: boolean;
}

export const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  label,
  required = false 
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const updateMenuPosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const closeOnScroll = () => setIsOpen(false);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', closeOnScroll, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', closeOnScroll, true);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && ' *'}
        </label>
      )}
      
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!isOpen) updateMenuPosition();
          setIsOpen(!isOpen);
        }}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-left flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-all"
      >
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {selectedOption?.label}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[#FFF200] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && createPortal(
        <div ref={menuRef} style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }} className="z-[9999] max-h-64 overflow-y-auto rounded-xl border border-white/15 bg-[#0d131d] p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-all ${
                value === option.value
                  ? 'bg-[#FFF200] text-black font-semibold'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};
