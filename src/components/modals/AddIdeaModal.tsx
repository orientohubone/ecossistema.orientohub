import {useEffect,useRef,useState} from 'react';
import {Dialog} from '@headlessui/react';
import {ImagePlus,Lightbulb,Loader2,Plus,X} from 'lucide-react';

interface IdeaDraft {title:string;description:string;audience:string;problem:string;proposed_solution:string}
interface Props {
  values:IdeaDraft;
  onChange:(values:IdeaDraft)=>void;
  files:File[];
  onFilesChange:(files:File[])=>void;
  saving:boolean;
  onSave:()=>Promise<void>;
  onClose:()=>void;
}

export default function AddIdeaModal({values,onChange,files,onFilesChange,saving,onSave,onClose}:Props){
  const titleRef=useRef<HTMLInputElement>(null);
  const busy=useRef(false);
  const [error,setError]=useState('');
  const [previews,setPreviews]=useState<string[]>([]);
  useEffect(()=>{
    const urls=files.map(file=>URL.createObjectURL(file));setPreviews(urls);
    return()=>urls.forEach(url=>URL.revokeObjectURL(url));
  },[files]);
  const close=()=>{if(!saving&&!busy.current)onClose();};
  const field=(key:keyof IdeaDraft,label:string,placeholder:string,multiline=false)=> <label className="block min-w-0 text-xs font-semibold text-[#d7e0ea]">
    {label}<span className="mt-1.5 block">{multiline?
      <textarea rows={3} value={values[key]} onChange={event=>onChange({...values,[key]:event.target.value})} disabled={saving} placeholder={placeholder} className="w-full resize-y rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm font-normal leading-relaxed text-white outline-none placeholder:text-[#718096] focus:border-primary-400 disabled:opacity-50" />:
      <input ref={key==='title'?titleRef:undefined} required={key==='title'} value={values[key]} onChange={event=>onChange({...values,[key]:event.target.value})} disabled={saving} placeholder={placeholder} className="w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm font-normal text-white outline-none placeholder:text-[#718096] focus:border-primary-400 disabled:opacity-50" />}</span>
  </label>;
  return <Dialog open onClose={close} initialFocus={titleRef} className="relative z-[200]">
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-5">
      <Dialog.Panel className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#101722] text-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
        <form className="flex min-h-0 flex-col" onSubmit={async event=>{
          event.preventDefault();if(saving||busy.current||!values.title.trim())return;
          busy.current=true;setError('');
          try{await onSave();}catch(failure){setError(failure instanceof Error?failure.message:'Não foi possível salvar a ideia. Tente novamente.');}finally{busy.current=false;}
        }}>
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#273548] px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-400/10 text-primary-300"><Lightbulb className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary-300">Ideias / Captura</p><Dialog.Title className="mt-0.5 text-xl font-bold">Nova ideia</Dialog.Title><Dialog.Description className="mt-1 text-xs text-[#9ba9bc]">Registre o essencial agora. Você pode aprofundar a ideia depois.</Dialog.Description></div></div>
            <button type="button" onClick={close} disabled={saving} aria-label="Fechar nova ideia" className="rounded-lg p-2 text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white disabled:opacity-40"><X className="h-4 w-4" /></button>
          </header>
          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {error&&<p role="alert" className="mb-4 rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">{field('title','Nome da ideia *','Como você chamaria essa ideia?')}{field('audience','Público','Para quem você quer resolver isso?')}</div>
                {field('description','Contexto','O que despertou essa ideia?',true)}
                <div className="grid gap-4 sm:grid-cols-2">{field('problem','Problema','Qual dificuldade você identificou?',true)}{field('proposed_solution','Possível solução','Como você imagina resolver?',true)}</div>
              </div>
              <aside className="min-w-0 rounded-xl bg-[#0c121b] p-4">
                <div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-bold">Referências visuais</h3><p className="mt-1 text-xs leading-relaxed text-[#9ba9bc]">Até 2 imagens para contextualizar sua ideia.</p></div><span className="text-xs font-semibold text-primary-300">{files.length}/2</span></div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {files.map((file,index)=><div key={`${file.name}-${file.lastModified}-${index}`} className="relative aspect-square overflow-hidden rounded-lg bg-[#151f2b]"><img src={previews[index]} alt={`Referência ${index+1}`} className="h-full w-full object-contain" /><button type="button" disabled={saving} onClick={()=>onFilesChange(files.filter((_,i)=>i!==index))} aria-label={`Remover referência ${index+1}`} className="absolute right-1 top-1 rounded-md bg-black/80 p-1.5 text-white disabled:opacity-40"><X className="h-3.5 w-3.5" /></button></div>)}
                </div>
                {files.length<2&&<label className={`mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#34455a] px-3 py-5 text-xs font-semibold text-[#d7e0ea] ${saving?'opacity-40':'cursor-pointer hover:border-primary-400'}`}><ImagePlus className="h-4 w-4 text-primary-300" />Adicionar imagens<input type="file" accept="image/*" multiple disabled={saving} className="sr-only" onChange={event=>{const next=Array.from(event.target.files||[]).filter(file=>file.type.startsWith('image/')).slice(0,2-files.length);if(next.length)onFilesChange([...files,...next]);event.currentTarget.value='';}} /></label>}
                <p className="mt-3 text-[11px] leading-relaxed text-[#718096]">Opcional. Você pode adicionar referências mais tarde.</p>
              </aside>
            </div>
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#273548] px-5 py-4 sm:px-6">
            <p className="text-xs text-[#9ba9bc]">Só o nome da ideia é obrigatório.</p>
            <div className="flex gap-3"><button type="button" onClick={close} disabled={saving} className="rounded-xl border border-[#34455a] px-4 py-2.5 text-sm font-semibold text-[#d7e0ea] disabled:opacity-40">Cancelar</button><button type="submit" disabled={saving||!values.title.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-40">{saving?<Loader2 className="h-4 w-4 animate-spin" />:<Plus className="h-4 w-4" />}{saving?'Salvando...':'Salvar na captura'}</button></div>
          </footer>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>;
}
