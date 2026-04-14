import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Calendar, User, Building, Phone, Clock, Search, Trash2, Filter } from 'lucide-react';
import { newsletterService, NewsletterSubscription } from '../../services/newsletterService';
import { contactService, ContactMessage } from '../../services/contactService';

export const LeadsManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState<'newsletter' | 'contact'>('newsletter');
  const [newsletterLeads, setNewsletterLeads] = useState<NewsletterSubscription[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [news, contacts] = await Promise.all([
        newsletterService.getAll(),
        contactService.getAll()
      ]);
      setNewsletterLeads(news);
      setContactMessages(contacts);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredNewsletter = newsletterLeads.filter(lead => 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contactMessages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveSubTab('newsletter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === 'newsletter'
                ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            Newsletter ({newsletterLeads.length})
          </button>
          <button
            onClick={() => setActiveSubTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeSubTab === 'contact'
                ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensagens ({contactMessages.length})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          {activeSubTab === 'newsletter' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Inscrição</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredNewsletter.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-primary-500" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lead.created_at || '').toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredNewsletter.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        Nenhum lead de newsletter encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredContacts.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">{msg.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</span>
                          {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {msg.phone}</span>}
                          {msg.company && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {msg.company}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-500 uppercase tracking-wider">
                        {msg.subject}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at || '').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Arquivar
                    </button>
                    <a 
                      href={`mailto:${msg.email}`}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black text-sm font-bold rounded-lg transition-all shadow-sm"
                    >
                      Responder por E-mail
                    </a>
                  </div>
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  Nenhuma mensagem de contato recebida.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
