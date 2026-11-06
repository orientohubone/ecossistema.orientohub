import { useState, useRef, useEffect, useCallback, useId } from 'react';
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
  disabled?: boolean;
  buttonClassName?: string;
  placeholder?: string;
  ariaLabel?: string;
}

export const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  label,
  required = false,
  disabled = false,
  buttonClassName,
  placeholder = 'Selecione uma opção',
  ariaLabel,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id=useId();
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0, maxHeight:256 });

  const updateMenuPosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewport=window.visualViewport;
    const viewportTop=viewport?.offsetTop||0;
    const viewportBottom=viewportTop+(viewport?.height||window.innerHeight);
    const below=Math.max(0,viewportBottom-rect.bottom-16);
    const above=Math.max(0,rect.top-viewportTop-16);
    const openAbove=below<256&&above>below;
    const maxHeight=Math.min(256,openAbove?above:below);
    const width=Math.min(rect.width,window.innerWidth-16);
    setMenuPosition({top:openAbove?rect.top-8-maxHeight:rect.bottom+8,left:Math.max(8,Math.min(rect.left,window.innerWidth-width-8)),width,maxHeight});
  },[]);

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
    const repositionOnScroll = (event:Event) => {
      // Scrolling the options must not close the portaled menu before selection.
      if(event.target instanceof Node&&menuRef.current?.contains(event.target))return;
      updateMenuPosition();
    };
    const closeOnEscape=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setIsOpen(false);buttonRef.current?.focus();}
    };
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', repositionOnScroll, true);
    window.addEventListener('keydown',closeOnEscape);
    window.visualViewport?.addEventListener('resize',updateMenuPosition);
    window.visualViewport?.addEventListener('scroll',updateMenuPosition);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', repositionOnScroll, true);
      window.removeEventListener('keydown',closeOnEscape);
      window.visualViewport?.removeEventListener('resize',updateMenuPosition);
      window.visualViewport?.removeEventListener('scroll',updateMenuPosition);
    };
  }, [isOpen,updateMenuPosition]);

  const selectedOption = options.find(opt => opt.value === value);
  useEffect(()=>{if(disabled)setIsOpen(false);},[disabled]);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label id={`${id}-label`} htmlFor={`${id}-button`} className="block text-sm font-medium mb-2">
          {label}
          {required && ' *'}
        </label>
      )}
      
      <button
        ref={buttonRef}
        id={`${id}-button`}
        aria-expanded={isOpen}
        aria-controls={isOpen?`${id}-options`:undefined}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={() => {
          if (!isOpen) updateMenuPosition();
          setIsOpen(!isOpen);
        }}
        className={`${buttonClassName||'w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all'} flex min-w-0 items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className={`${buttonClassName?'text-white':'text-gray-900 dark:text-gray-100'} min-w-0 whitespace-normal font-medium [overflow-wrap:anywhere]`}>
          {selectedOption?.label||placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 shrink-0 text-[#FFF200] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && createPortal(
        <div id={`${id}-options`} ref={menuRef} style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left, width: menuPosition.width, maxHeight:menuPosition.maxHeight }} className="z-[9999] overflow-y-auto overscroll-contain rounded-xl border border-white/15 bg-[#0d131d] p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                buttonRef.current?.focus();
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
