import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type SelectOption = { value: string; label: string };
export const CustomSelect = ({ value, onChange, options, placeholder = 'Selecionar', ariaLabel }: { value: string; onChange: (value: string) => void; options: SelectOption[]; placeholder?: string; ariaLabel?: string }) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  useEffect(() => { const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  return <div className={`custom-select ${open ? 'open' : ''}`} ref={root}>
    <button type="button" className="custom-select-trigger" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}><span className={selected ? '' : 'placeholder'}>{selected?.label || placeholder}</span><ChevronDown size={15} /></button>
    {open && <div className="custom-select-menu" role="listbox">{options.map((option) => <button type="button" role="option" aria-selected={option.value === value} className={option.value === value ? 'selected' : ''} key={option.value} onClick={() => { onChange(option.value); setOpen(false); }}><span>{option.label}</span>{option.value === value && <Check size={14} />}</button>)}</div>}
  </div>;
};
