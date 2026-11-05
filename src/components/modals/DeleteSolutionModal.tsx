import {useRef} from 'react';
import {Dialog} from '@headlessui/react';
import {Loader2,Trash2,X} from 'lucide-react';
import type {Solution} from '../../services/solutionsService';

interface Props {
  solution:Solution;
  deleting:boolean;
  error:string|null;
  onClose:()=>void;
  onConfirm:()=>void;
}

export default function DeleteSolutionModal({solution,deleting,error,onClose,onConfirm}:Props){
  const cancelRef=useRef<HTMLButtonElement>(null);
  return <Dialog open onClose={()=>{if(!deleting)onClose();}} initialFocus={cancelRef} className="relative z-[210]">
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
    <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
      <div className="flex min-h-full items-center justify-center">
        <Dialog.Panel aria-busy={deleting} className="w-full max-w-md overflow-hidden rounded-2xl border border-[#34455a] bg-[#101722] text-white shadow-2xl">
          <header className="flex items-start justify-between gap-4 border-b border-[#273548] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/25 bg-red-400/10 text-red-300"><Trash2 className="h-5 w-5" /></span>
              <Dialog.Title className="text-lg font-bold">Excluir solução?</Dialog.Title>
            </div>
            <button type="button" onClick={onClose} disabled={deleting} aria-label="Fechar confirmação de exclusão" className="rounded-lg p-2 text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white disabled:opacity-40"><X className="h-4 w-4" /></button>
          </header>
          <div className="p-5 sm:p-6">
            <Dialog.Description className="text-sm leading-relaxed text-[#9ba9bc]">Tem certeza que deseja excluir a solução <strong className="font-semibold text-white [overflow-wrap:anywhere]">{solution.name}</strong>? Esta ação é permanente e não pode ser desfeita.</Dialog.Description>
            {error&&<p role="alert" className="mt-4 rounded-xl border border-red-400/25 bg-red-400/5 p-3 text-sm text-red-200">{error}</p>}
          </div>
          <footer className="flex flex-wrap justify-end gap-3 border-t border-[#273548] bg-[#0c121b] p-5 sm:px-6">
            <button ref={cancelRef} type="button" onClick={onClose} disabled={deleting} className="rounded-xl border border-[#34455a] px-4 py-2.5 text-sm font-semibold text-[#d7e0ea] hover:bg-[#151f2b] disabled:opacity-40">Cancelar</button>
            <button type="button" onClick={onConfirm} disabled={deleting} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60">{deleting?<Loader2 className="h-4 w-4 animate-spin" />:<Trash2 className="h-4 w-4" />}{deleting?'Excluindo...':'Excluir solução'}</button>
          </footer>
        </Dialog.Panel>
      </div>
    </div>
  </Dialog>;
}
