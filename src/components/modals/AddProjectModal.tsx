import {useRef,useState} from 'react';
import {Dialog,Listbox} from '@headlessui/react';
import {AlertTriangle,ArrowRight,Check,CheckCircle,ChevronDown,Loader2,Rocket,X} from 'lucide-react';

export interface ProjectDraft {name:string;description:string;stage:'ideation'|'validation'|'mvp'|'traction'|'growth'}
interface Props {show:boolean;onClose:()=>void;newProject:ProjectDraft;setNewProject:(project:ProjectDraft)=>void;onSave:()=>Promise<void>;error?:string|null}
const stages=[{value:'ideation',label:'Ideação'},{value:'validation',label:'Validação'},{value:'mvp',label:'MVP'},{value:'traction',label:'Tração'},{value:'growth',label:'Crescimento'}] as const;

export default function AddProjectModal({show,onClose,newProject,setNewProject,onSave,error}:Props){
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState('');
  const busy=useRef(false);
  const nameRef=useRef<HTMLInputElement>(null);
  const close=()=>{if(!busy.current)onClose();};
  const stage=stages.find(item=>item.value===newProject.stage)||stages[0];
  const fieldClass='mt-1.5 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3.5 py-2.5 text-sm font-normal text-white outline-none transition placeholder:text-[#63748a] focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 disabled:opacity-60';
  return <Dialog open={show} onClose={close} initialFocus={nameRef} className="relative z-[200]">
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
    <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-3 sm:p-6">
      <Dialog.Panel className="w-full max-w-5xl rounded-2xl border border-[#34455a] bg-[#101722] text-white shadow-2xl">
        <form className="flex min-h-0 flex-col" onSubmit={async event=>{
          event.preventDefault();if(busy.current||!newProject.name.trim()||!newProject.description.trim())return;
          busy.current=true;setSaving(true);setSaveError('');
          try{await onSave();}catch(failure){setSaveError(failure instanceof Error?failure.message:'Não foi possível criar o projeto. Tente novamente.');}finally{busy.current=false;setSaving(false);}
        }}>
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#273548] px-5 py-4 sm:px-6">
            <div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-400/30 bg-primary-400/10 text-primary-300"><Rocket className="h-6 w-6" /></span><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">Portfólio / Novo projeto</p><Dialog.Title className="text-2xl font-bold tracking-tight">Dê direção ao seu próximo projeto.</Dialog.Title><Dialog.Description className="mt-2 text-sm text-[#9ba9bc]">Defina o contexto e o estágio para começar a validar sua ideia.</Dialog.Description></div></div>
            <button type="button" onClick={close} disabled={saving} aria-label="Fechar cadastro de projeto" className="rounded-lg p-2 text-[#9ba9bc] hover:bg-white/5 hover:text-white disabled:opacity-40"><X className="h-5 w-5" /></button>
          </header>
          <div className="grid lg:grid-cols-[1fr_260px]">
            <div className="space-y-4 p-5 sm:px-6">
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-300">01 / Identidade e contexto</h3>
                <label className="block text-sm font-semibold text-[#d4deeb]">Nome do projeto <span className="text-primary-300">*</span><input ref={nameRef} name="name" required disabled={saving} value={newProject.name} onChange={event=>setNewProject({...newProject,name:event.target.value})} placeholder="Como seu projeto se chama?" className={fieldClass} autoComplete="off" /></label>
                <label className="mt-3 block text-sm font-semibold text-[#d4deeb]">Descrição <span className="text-primary-300">*</span><textarea name="description" required disabled={saving} rows={3} value={newProject.description} onChange={event=>setNewProject({...newProject,description:event.target.value})} placeholder="Qual problema você quer resolver e para quem?" className={`${fieldClass} resize-none`} /></label>
              </section>
              <section className="border-t border-[#273548] pt-3">
                <Listbox value={newProject.stage} onChange={value=>setNewProject({...newProject,stage:value})} disabled={saving}>
                  <div className="relative"><Listbox.Label className="text-sm font-semibold text-[#d4deeb]">Estágio atual</Listbox.Label><Listbox.Button className={`${fieldClass} flex items-center justify-between text-left`}><span>{stage.label}</span><ChevronDown className="h-4 w-4 text-[#9ba9bc]" /></Listbox.Button><Listbox.Options className="absolute inset-x-0 bottom-full z-10 mb-2 max-h-64 overflow-y-auto rounded-xl border border-[#34455a] bg-[#101722] p-1 shadow-xl focus:outline-none">{stages.map(item=><Listbox.Option key={item.value} value={item.value} className={({active})=>`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm ${active?'bg-[#233248]':'bg-transparent'}`}>{({selected})=><><span>{item.label}</span>{selected&&<Check className="h-4 w-4 text-primary-300" />}</>}</Listbox.Option>)}</Listbox.Options></div>
                </Listbox>
                <p className="mt-2 text-xs text-[#9ba9bc]">O estágio pode ser atualizado depois.</p>
              </section>
            </div>
            <aside className="hidden border-l border-[#273548] bg-[#0c121b] p-6 lg:block"><p className="text-[10px] font-bold uppercase tracking-widest text-[#9ba9bc]">Resumo do projeto</p><div className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b] text-2xl font-bold text-primary-300">{newProject.name.trim().slice(0,1).toUpperCase()||<Rocket className="h-6 w-6" />}</div><h3 className="mt-4 text-xl font-bold [overflow-wrap:anywhere]">{newProject.name.trim()||'Seu próximo projeto'}</h3><p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary-300">{stage.label}</p><p className="mt-4 line-clamp-6 text-sm leading-relaxed text-[#9ba9bc] [overflow-wrap:anywhere]">{newProject.description||'Um problema claro é o primeiro passo para construir e validar uma boa solução.'}</p><div className="mt-8 border-t border-[#273548] pt-5 text-xs leading-relaxed text-[#9ba9bc]"><CheckCircle className="mb-2 h-4 w-4 text-primary-300" />Depois de criar, organize tarefas, registre entrevistas e acompanhe os testes do projeto.</div></aside>
          </div>
          <footer className="shrink-0 rounded-b-2xl border-t border-[#273548] bg-[#101722] px-5 py-3 sm:px-6">
            {(error||saveError)&&<p role="alert" className="mb-4 flex gap-2 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{saveError||error}</span></p>}
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[#9ba9bc]">* Nome e descrição obrigatórios. Rascunho mantido ao fechar.</p><div className="flex gap-3"><button type="button" onClick={close} disabled={saving} className="rounded-xl border border-[#34455a] px-4 py-3 text-sm font-bold text-[#c2cedd] disabled:opacity-50">Fechar</button><button type="submit" disabled={saving||!newProject.name.trim()||!newProject.description.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-5 py-3 text-sm font-bold text-black hover:bg-primary-300 disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin" />:<ArrowRight className="h-4 w-4" />}{saving?'Criando...':'Criar projeto'}</button></div></div>
          </footer>
        </form>
      </Dialog.Panel>
    </div></div>
  </Dialog>;
}
