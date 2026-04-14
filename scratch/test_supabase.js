
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testando conexão com Supabase...');
  
  // Testar tabela newsletter_subscriptions
  const { data: newsData, error: newsError } = await supabase
    .from('newsletter_subscriptions')
    .select('count', { count: 'exact', head: true });
    
  if (newsError) {
    console.error('Erro ao acessar tabela newsletter_subscriptions:', newsError.message);
    if (newsError.message.includes('relation "newsletter_subscriptions" does not exist')) {
      console.log('DICA: A tabela newsletter_subscriptions não existe. Execute o SQL de criação.');
    }
  } else {
    console.log('Sucesso: Tabela newsletter_subscriptions acessível.');
  }

  // Testar tabela contact_messages
  const { data: contactData, error: contactError } = await supabase
    .from('contact_messages')
    .select('count', { count: 'exact', head: true });
    
  if (contactError) {
    console.error('Erro ao acessar tabela contact_messages:', contactError.message);
    if (contactError.message.includes('relation "contact_messages" does not exist')) {
      console.log('DICA: A tabela contact_messages não existe. Execute o SQL de criação.');
    }
  } else {
    console.log('Sucesso: Tabela contact_messages acessível.');
  }
}

testConnection();
