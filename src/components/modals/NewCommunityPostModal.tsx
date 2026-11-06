import {useRef,useState} from 'react';
import {Dialog} from '@headlessui/react';
import {AlertTriangle,CheckCircle,Loader2,MessageSquare,Send,X} from 'lucide-react';
import {CustomSelect} from '../CustomSelect';

type Category='discussion'|'question'|'showcase'|'announcement';
interface Props {show:boolean;onClose:()=>void;onSubmit:(data:{title:string;content:string;category:Category})=>Promise<void>}
const categories=[{value:'discussion',label:'Discussão'},{value:'question',label:'Pergunta'},{value:'showcase',label:'Showcase'},{value:'announcement',label:'Anúncio'}];

export default function NewCommunityPostModal({show,onClose,onSubmit}:Props){
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [category,setCategory]=useState<Category>('discussion');
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const busy=useRef(false);
  const titleRef=useRef<HTMLInputElement>(null);
  const close=()=>{if(!busy.current)onClose();};
  const categoryLabel=categories.find(item=>item.value===category)?.label;
  const fieldClass='mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3.5 py-3 text-sm font-normal text-white outline-none transition placeholder:text-[#63748a] focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 disabled:opacity-60';
  return <Dialog open={show} onClose={close} initialFocus={titleRef} className="relative z-[200]">
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
    <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-3 sm:p-6">
      <Dialog.Panel className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#34455a] bg-[#101722] text-white shadow-2xl">
        <form onSubmit={async event=>{
          event.preventDefault();if(busy.current||!title.trim()||!content.trim())return;
          busy.current=true;setSaving(true);setError('');
          try{await onSubmit({title:title.trim(),content:content.trim(),category});setTitle('');setContent('');setCategory('discussion');}
          catch(failure){setError(failure instanceof Error?failure.message:'Não foi possível publicar. Tente novamente.');}
          finally{busy.current=false;setSaving(false);}
        }}>
          <header className="flex items-start justify-between gap-4 border-b border-[#273548] px-5 py-5 sm:px-6">
            <div className="flex gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-400/30 bg-primary-400/10 text-primary-300"><MessageSquare className="h-6 w-6" /></span><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">Comunidade / Nova publicação</p><Dialog.Title className="text-2xl font-bold tracking-tight">Sua experiência pode abrir caminhos.</Dialog.Title><Dialog.Description className="mt-2 text-sm text-[#9ba9bc]">Compartilhe uma descoberta, faça uma pergunta ou mostre o que está construindo.</Dialog.Description></div></div>
            <button type="button" onClick={close} disabled={saving} aria-label="Fechar nova publicação" className="rounded-lg p-2 text-[#9ba9bc] hover:bg-white/5 hover:text-white disabled:opacity-40"><X className="h-5 w-5" /></button>
          </header>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
                <label className="min-w-0 text-sm font-semibold text-[#d4deeb]">Título <span className="text-primary-300">*</span><input ref={titleRef} required disabled={saving} value={title} onChange={event=>setTitle(event.target.value)} className={fieldClass} placeholder="O que você quer compartilhar?" /></label>
                <div><p className="text-sm font-semibold text-[#d4deeb]">Categoria</p><CustomSelect ariaLabel="Categoria da publicação" value={category} onChange={value=>setCategory(value as Category)} options={categories} disabled={saving} buttonClassName={fieldClass} /></div>
              </div>
              <label className="block text-sm font-semibold text-[#d4deeb]">Conteúdo <span className="text-primary-300">*</span><textarea required disabled={saving} rows={6} value={content} onChange={event=>setContent(event.target.value)} className={`${fieldClass} resize-none leading-relaxed`} placeholder="Conte o contexto, o que você aprendeu ou onde precisa de ajuda…" /></label>
              <div className="flex items-center justify-between gap-3 text-xs text-[#718096]"><span>Uma conversa útil começa com um contexto claro.</span><span className="shrink-0">{content.length} caracteres</span></div>
            </div>
            <aside className="hidden min-w-0 border-l border-[#273548] bg-[#0c121b] p-6 lg:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ba9bc]">Prévia da publicação</p>
              <span className="mt-5 inline-flex rounded-lg border border-primary-400/20 bg-primary-400/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{categoryLabel}</span>
              <h3 className="mt-4 line-clamp-3 text-lg font-bold [overflow-wrap:anywhere]">{title.trim()||'O próximo assunto da comunidade'}</h3>
              <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-sm leading-relaxed text-[#9ba9bc] [overflow-wrap:anywhere]">{content.trim()||'Enquanto você escreve, sua publicação ganha forma aqui.'}</p>
              <div className="mt-6 border-t border-[#273548] pt-4 text-xs leading-relaxed text-[#9ba9bc]"><CheckCircle className="mb-2 h-4 w-4 text-primary-300" />Sua publicação será compartilhada com a comunidade. Evite dados pessoais e informações confidenciais.</div>
            </aside>
          </div>
          <footer className="border-t border-[#273548] px-5 py-4 sm:px-6">
            {error&&<p role="alert" className="mb-4 flex gap-2 rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></p>}
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[#9ba9bc]">Rascunho mantido ao fechar, até sair desta página.</p><div className="flex gap-3"><button type="button" onClick={close} disabled={saving} className="rounded-xl border border-[#34455a] px-4 py-3 text-sm font-bold text-[#c2cedd] disabled:opacity-50">Fechar</button><button type="submit" disabled={saving||!title.trim()||!content.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-5 py-3 text-sm font-bold text-black hover:bg-primary-300 disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin" />:<Send className="h-4 w-4" />}{saving?'Publicando...':'Publicar na comunidade'}</button></div></div>
          </footer>
        </form>
      </Dialog.Panel>
    </div></div>
  </Dialog>;
}
