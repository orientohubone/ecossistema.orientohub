import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { contactService } from '../services/contactService';
import { CustomSelect } from '../components/CustomSelect';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

const subjects = [
  { value: 'general', label: 'Assunto geral' },
  { value: 'Estratégia', label: 'Estratégia' },
  { value: 'Inovação', label: 'Inovação' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Mídia paga', label: 'Mídia paga' },
  { value: 'Google Meu Negócio', label: 'Google Meu Negócio' },
  { value: 'Design', label: 'Design' },
  { value: 'Sistemas inteligentes', label: 'Sistemas inteligentes' },
  { value: 'Marcas', label: 'Marcas' },
  { value: 'Naming', label: 'Naming' },
  { value: 'Domínio', label: 'Domínio' },
  { value: 'Sites', label: 'Sites' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'sales', label: 'Falar com vendas' },
  { value: 'support', label: 'Suporte técnico' },
  { value: 'partnership', label: 'Parcerias' },
  { value: 'press', label: 'Imprensa' },
  { value: 'other', label: 'Outro' },
];

const fieldClassName = 'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#FFF200]/70 focus:bg-black/40';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const serviceParam = searchParams.get('service');
  const messageParam = searchParams.get('message');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', subject: serviceParam || 'general', message: messageParam || '',
  });

  useEffect(() => {
    if (serviceParam || messageParam) {
      setFormData((previous) => ({
        ...previous,
        subject: serviceParam || previous.subject,
        message: messageParam || previous.message,
      }));
    }
  }, [serviceParam, messageParam]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await contactService.sendMessage(formData);
      if (!result.success) {
        alert(`Erro ao enviar mensagem: ${result.error}`);
        return;
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', company: '', subject: 'general', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, eyebrow: 'E-mail', value: 'fernando@orientohub.com.br', detail: 'Resposta em até 1 dia útil', href: 'mailto:fernando@orientohub.com.br' },
    { icon: Phone, eyebrow: 'Conversa direta', value: '+55 (14) 99861-8547', detail: 'Segunda a sexta, das 9h às 18h', href: 'tel:+5514998618547' },
    { icon: MapPin, eyebrow: 'Base', value: 'Pompeia, SP', detail: 'Atuação remota em todo o Brasil', href: 'https://maps.google.com/?q=Pompeia,+SP' },
  ];

  return (
    <div className="dark min-h-screen overflow-hidden text-white">
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="pointer-events-none fixed inset-0 -z-40 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <Helmet>
        <title>Contato | Orientohub</title>
        <meta name="description" content="Conte o que você quer construir, melhorar ou destravar. A Orientohub ajuda a transformar contexto em direção e próximos passos." />
      </Helmet>

      <section className="relative pb-20 pt-24 sm:pb-24 sm:pt-28">
        <div className="container-custom">
          <motion.div className="mx-auto w-full max-w-5xl text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="liquid-glass" icon={<MessageSquare className="h-3.5 w-3.5" />} className="mb-6 sm:mb-8">Comece pelo que está travando</Badge>
            <h1 className="flex flex-col items-center text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block">Quando falta clareza</span>
              <span className="block text-[#FFF200]">o avanço para.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:mt-8 sm:text-lg">
              Conte o contexto. A gente ajuda a organizar o próximo passo.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider topSpacing="tight" />

      <section className="pt-20 sm:pt-28">
        <div className="container-custom">
          <motion.div className="mb-12 max-w-3xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Comece pelo contexto</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Sem apresentação longa.<br />Sem solução genérica.</h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <motion.div className="rounded-3xl border border-white/10 bg-[#0d131d] p-6 sm:p-9 lg:p-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {isSubmitted ? (
                <motion.div className="flex min-h-[520px] flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10"><CheckCircle2 className="h-9 w-9 text-emerald-300" /></span>
                  <h2 className="mt-7 text-3xl font-black">Contexto recebido.</h2>
                  <p className="mt-3 max-w-md leading-relaxed text-white/50">Vamos analisar sua mensagem e retornar com a conversa já direcionada.</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF200] text-black"><Send className="h-5 w-5" /></span>
                    <div><h3 className="text-xl font-black">Conte o que está acontecendo</h3><p className="mt-1 text-sm text-white/40">Nós retornamos em até 1 dia útil.</p></div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Nome" required><input className={fieldClassName} id="name" name="name" required autoComplete="name" value={formData.name} onChange={handleInputChange} placeholder="Como podemos chamar você?" /></Field>
                      <Field label="E-mail" required><input className={fieldClassName} id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleInputChange} placeholder="voce@email.com" /></Field>
                      <Field label="Telefone"><input className={fieldClassName} id="phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" /></Field>
                      <Field label="Empresa, projeto ou ideia"><input className={fieldClassName} id="company" name="company" autoComplete="organization" value={formData.company} onChange={handleInputChange} placeholder="Como podemos identificar?" /></Field>
                    </div>
                    <CustomSelect value={formData.subject} onChange={(value) => setFormData((previous) => ({ ...previous, subject: value }))} options={subjects} label="Sobre o que vamos conversar?" required />
                    <Field label="Qual é o desafio?" required>
                      <textarea className={`${fieldClassName} min-h-32 resize-none leading-relaxed`} id="message" name="message" required minLength={20} maxLength={1200} value={formData.message} onChange={handleInputChange} placeholder="O que você quer fazer avançar e o que está impedindo isso hoje?" />
                    </Field>
                    <button type="submit" disabled={isSubmitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-7 py-4 font-black text-black transition hover:bg-[#fff64d] disabled:cursor-wait disabled:opacity-60">
                      {isSubmitting ? 'Enviando contexto…' : <>Iniciar conversa <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            <motion.aside className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d]" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="border-b border-white/10 p-6">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FFF200]">Prefere outro canal?</span>
                <p className="mt-2 text-sm leading-relaxed text-white/40">Fale diretamente por onde for mais simples.</p>
              </div>
              <div>
                {contactInfo.map((info) => (
                  <a key={info.eyebrow} href={info.href} target={info.eyebrow === 'Base' ? '_blank' : undefined} rel={info.eyebrow === 'Base' ? 'noopener noreferrer' : undefined} className="group flex gap-4 border-b border-white/10 p-6 transition last:border-0 hover:bg-white/[0.03]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#FFF200]/20 bg-[#FFF200]/10 text-[#FFF200]"><info.icon className="h-4 w-4" /></span>
                    <span className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-[0.16em] text-white/30">{info.eyebrow}</span><strong className="mt-1 block break-words text-sm text-white">{info.value}</strong><span className="mt-1 block text-xs leading-relaxed text-white/35">{info.detail}</span></span>
                  </a>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
        <div className="h-32 sm:h-44" aria-hidden="true" />
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
      </section>
    </div>
  );
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <label className="block text-sm font-bold text-white/70">
    <span className="mb-2 block">{label}{required && <span className="ml-1 text-[#FFF200]">*</span>}</span>
    {children}
  </label>
);

export default ContactPage;
