import { Listbox } from '@headlessui/react';
import { Check,ChevronDown } from 'lucide-react';
import type { GithubInstallation } from '../../services/githubAppService';

interface Props {
  value:string;
  onChange:(value:string)=>void;
  installations:GithubInstallation[];
  disabled:boolean;
}

export default function GithubInstallationSelect({value,onChange,installations,disabled}:Props){
  const selected=installations.find(item=>String(item.id)===value);
  return <Listbox value={value} onChange={onChange} disabled={disabled}>
    <div className="relative min-w-0">
      <Listbox.Label className="block text-sm font-semibold text-[#d7e0ea]">Conta ou organização</Listbox.Label>
      <Listbox.Button className="mt-2 flex w-full min-w-0 items-center gap-3 rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-3 text-left text-sm text-white outline-none focus-visible:border-primary-400 disabled:opacity-50">
        <span className="min-w-0 flex-1 whitespace-normal [overflow-wrap:anywhere]">{selected?.account||'Selecione uma conta ou organização'}</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-[#9ba9bc]" />
      </Listbox.Button>
      <Listbox.Options className="absolute inset-x-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-[#34455a] bg-[#101722] p-1 shadow-xl focus:outline-none">
        {installations.map(item=><Listbox.Option key={item.id} value={String(item.id)} className={({active})=>`cursor-pointer rounded-lg px-3 py-3 ${active?'bg-[#233248]':'bg-transparent'}`}>
          {({selected:isSelected})=><div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="whitespace-normal text-sm font-semibold text-white [overflow-wrap:anywhere]">{item.account}</p>
              <p className="mt-1 text-xs text-[#9ba9bc]">{item.selection==='all'?'Todos os repositórios autorizados':'Repositórios selecionados'}</p>
            </div>
            {isSelected&&<Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />}
          </div>}
        </Listbox.Option>)}
      </Listbox.Options>
    </div>
  </Listbox>;
}
