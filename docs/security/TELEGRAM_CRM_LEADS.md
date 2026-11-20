# Notificações de leads do site no Telegram

Os formulários de contato, CTA da página inicial e chat guiado inserem uma linha em `public.contact_messages`. Um trigger do banco transforma essa linha em cliente/contato/oportunidade no CRM. O webhook de Telegram deve observar `contact_messages` para avisar uma vez por envio, incluindo nome, e-mail, telefone, empresa, assunto, mensagem e origem. Assinaturas da newsletter não entram no CRM.

## Configuração

1. Crie um segundo bot pelo `@BotFather`, dê a ele o nome de exibição desejado e copie o token.
2. Abra a conversa com esse bot e envie `/start`. Obtenha o `chat_id` usando `getUpdates`, conforme o guia de configuração do outro bot. Para um grupo, adicione o bot e use o ID do grupo.
3. Gere um segredo diferente do usado no webhook de novos usuários com `openssl rand -hex 32`.
4. No Vercel, adicione `TELEGRAM_LEADS_BOT_TOKEN`, `TELEGRAM_LEADS_CHAT_ID` e `SUPABASE_CONTACT_WEBHOOK_SECRET`. Publique um novo deployment depois de salvar as variáveis.
5. No Supabase, em **Database → Webhooks**, crie outro webhook:
   - tabela: `public.contact_messages`
   - evento: `INSERT`
   - método: `POST`
   - URL: `https://orientohub.com.br/api/telegram-new-lead`
   - header: `x-orientohub-lead-webhook-secret: <mesmo valor de SUPABASE_CONTACT_WEBHOOK_SECRET>`
   - content type: `application/json`
6. Envie um formulário de contato ou use o chat guiado no site e confirme que a oportunidade chegou ao CRM e a notificação chegou ao segundo bot.

Mantenha o token do bot e o segredo somente nas variáveis secretas do Vercel e no header do webhook do Supabase. Nunca use prefixo `VITE_`.
